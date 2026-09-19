import 'dotenv/config'
import express from 'express'
import connectToDB from './connectDB/connectDB.js'
import cors from 'cors'
import authRouter from './routes/Users/users.js'
import contactsRouter from './routes/Contacts/contacts.js'

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES:
app.use(cors({ origin: process.env.VITE_REACT_BASE_SERVER }))
app.use(express.json())
app.use(express.static('./public'))

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/contacts', contactsRouter);

// DB CONNECTION AND THEN LISTENS TO THE API REQUESTS:
const start = async () => {
   try {
      await connectToDB(process.env.MONGO_URI);
      console.log('CONNECTED TO DB');
      app.listen(port, () => {
         console.log(`Server is listening on ${port}...`)
      })
   } catch (error) {
      console.log(error.message)
   }
}

start();