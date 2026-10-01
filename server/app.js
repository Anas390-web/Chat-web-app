import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express from 'express'
import connectToDB from './connectDB/connectDB.js'
import cors from 'cors'
import authRouter from './routes/Users/users.js'
import contactsRouter from './routes/Contacts/contacts.js'
import socketAuth from './middlewares/Auth/socketAuth.js'
import { joinPersonalRoom, saveMessageInDB } from './sockets/chatSockets.js'
import messageRouter from './routes/Messages/messages.js'
import groupsRouter from './routes/Groups/groupList.js'
import { joinGroupRoom, saveGroupMessageInDB } from './sockets/groupSockets.js'
import groupMessagesRouter from './routes/Messages/groupMessages.js'

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// MIDDLEWARES:
app.use(cors({ origin: process.env.VITE_REACT_BASE_SERVER }))
app.use(express.json())
app.use(express.static('./public'))

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/contacts', contactsRouter);
app.use('/api/v1/chats/messages', messageRouter)
app.use('/api/v1/groups', groupsRouter)
app.use('/api/v1/groups/messages', groupMessagesRouter)

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

// CONNECTION WITH CLIENT:

io.on('connection', (socket) => {
   console.log('CONNECTED WITH CLIENT', socket.id)
   // JOIN-ROOM LISTENER:
   joinPersonalRoom(socket, io);
   // SAVE MESSAGES IN THE DB:
   saveMessageInDB(socket, io);
   // JOIN-GROUP-ROOM LISTENER:
   joinGroupRoom(socket, io);
   // SAVE GROUP MESSAGES IN DB:
   saveGroupMessageInDB(socket, io);
   // UPON USER DISCONNECTING:
   socket.on('disconnect', () => {
      console.log('CLIENT DISCONNECTED', socket.id);
   })
})

// DB CONNECTION AND THEN LISTENS TO THE API REQUESTS:
const start = async () => {
   try {
      await connectToDB(process.env.MONGO_URI);
      console.log('CONNECTED TO DB');
      httpServer.listen(port, () => {
         console.log(`Server is listening on ${port}...`)
      })
   } catch (error) {
      console.log(error.message)
   }
}

start();