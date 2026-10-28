import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express from 'express'
import connectToDB from './connectDB/connectDB.js'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { xss } from 'express-xss-sanitizer'
import authRouter from './routes/Users/users.js'
import contactsRouter from './routes/Contacts/contacts.js'
import socketAuth from './middlewares/Auth/socketAuth.js'
import { joinPersonalRoom, saveMessageInDB, IsUserTyping } from './sockets/chatSockets.js'
import messageRouter from './routes/Messages/messages.js'
import groupsRouter from './routes/Groups/groupList.js'
import { joinGroupRoom, saveGroupMessageInDB, leaveGroupChatRoom, isUserTypingInGroup } from './sockets/groupSockets.js'
import groupMessagesRouter from './routes/Messages/groupMessages.js'
import { saveAiChatUserMsg_And_JoinAiRoom, showAiChat } from './sockets/aiChatSockets.js'
import ingestionOfDocuments from './RAG-Pipeline/ingestion.js'
import aiMsgsRouter from './routes/AiMessages/aiMessages.js'
import finalAiResponse from './RAG-Pipeline/finalAiResponse.js'

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// MIDDLEWARES:
// SET SECURE HTTP HEADERS:
app.use(helmet());
app.use(cors({ origin: process.env.VITE_REACT_BASE_SERVER }));

// RATE LIMITING (TO BLOCK SPAM):
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
   ipv6Subnet: 56
})

app.use('/api/', limiter);

// BODY PARSERS:
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('./public'));

// DATA SANITIZERS:
// PREVENT CROSS SITE SCRIPTING ATTACKS:
app.use(xss());

// ROUTES:
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/chats/messages', messageRouter);
app.use('/api/v1/groups', groupsRouter);
app.use('/api/v1/groups/messages', groupMessagesRouter);
app.use('/api/v1/ai/chat', aiMsgsRouter);

// SOCKET CONNECTION:
const io = new Server(httpServer, {
   cors: {
      origin: process.env.VITE_REACT_BASE_SERVER,
      methods: ['GET', 'POST']
   }
});

// TOKEN AUTHENTICATION:
io.use((socket, next) => {
   socketAuth(socket, next)
})

// CREATE A MAP TO SEND BACK THE ONLINE USERS:
let onlineUsersMap = new Map();

// CONNECTION WITH CLIENT:
io.on('connection', (socket) => {
   console.log('CONNECTED WITH CLIENT', socket.id)

   // DE-STRUCTURE FROM SOCKET USER AUTHENTICATION:
   const { userId } = socket.user;

   // IF THE USER ID DOES NOT EXIST AS KEY THEN GIVE THE USERID KEY A SET AS IT VALUE;
   if (!onlineUsersMap.has(userId)) {
      onlineUsersMap.set(userId, new Set());
   }
   // NOW GET THE SAVED USER ID:
   const socketsSet = onlineUsersMap.get(userId);

   // ADD THE SOCKET.ID TO ITS SET: (.add is Set method)
   socketsSet.add(socket.id);

   // CONVERTING THE MAP KEYS(USERIDs) INTO THE ARRAY AS CLIENT JSON DOES NOT SERIELIZE THE MAP:
   const onlineUsers = Array.from(onlineUsersMap.keys());
   // EMITTING THE ONLINE USERS TO THE CLIENT:
   socket.emit("online-users", onlineUsers);

   // JOIN-ROOM LISTENER:
   joinPersonalRoom(socket, io);
   // SAVE MESSAGES IN THE DB:
   saveMessageInDB(socket, io);
   // JOIN-GROUP-ROOM LISTENER:
   joinGroupRoom(socket, io);
   // SAVE GROUP MESSAGES IN DB:
   saveGroupMessageInDB(socket, io);
   // SHOW AI CHAT:
   showAiChat(socket, io);
   // SAVE THE AI CHAT MESSAGE AND JOIN ROOM ON FIRST USER TO AI MESSAGE:
   saveAiChatUserMsg_And_JoinAiRoom(socket, io)
   // IF USER IS TYPING:
   IsUserTyping(socket, io);
   // IF USER IN GROUP IS TYPING:
   isUserTypingInGroup(socket);
   // LEAVE GROUP CHAT ROOM:
   leaveGroupChatRoom(socket, io);
   // AI RESPONSE IN CHAT:
   finalAiResponse(socket, io);
   // UPON USER DISCONNECTING:
   socket.on('disconnect', () => {
      console.log('CLIENT DISCONNECTED', socket.id);

      // GETTING SOCKETS SET FROM INSIDE THE MAP:
      const usersSocketsSet = onlineUsersMap.get(userId);
      // IF SET OF USERS SOCKETS EXIST, DELETE THE SOCKET CONNECTION WHEN SOCKET IS DISCONNECTED:
      if (usersSocketsSet) {
         usersSocketsSet.delete(socket.id)
      }

      // IF ALL USER SOCKETS ARE DISCONNECTED, REMOVE THE USERID FROM THE ONLINE USERS MAP:
      if (usersSocketsSet.size === 0) {
         onlineUsersMap.delete(userId);
      }

   })
})

// DB CONNECTION AND THEN LISTENS TO THE API REQUESTS:
const start = async () => {

   // LIST TO INCOMMING REQUESTS:
   httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Server is listening on port ${port}...`)
   })

   try {
      await connectToDB(process.env.MONGO_URI);
      console.log('CONNECTED TO DB');
      // INGESTION OF DOCUMENTS BEFORE TAKING THE REQUESTS:
      await ingestionOfDocuments();
   } catch (error) {
      console.log(error.message)
   }
}

start();

