import { StatusCodes } from 'http-status-codes'
import Contact from '../../models/ContactsList/Contact.js'

const addUsers = async (req, res) => {
   try {
      // AFTER USER AND TOKEN AUTHENTICATION:
      const { username, userId } = req.user;
      // REQUEST BODY:
      const usersList = req.body;
      console.log(username, userId)
      console.log('Array of users:', usersList)
      if (!usersList) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Bad Request'
         })
      }
      // NOT USING CREATE AS IT WILL CREATE A NEW DOCUMENT EACH TIME USER CLICKS ON ADD USERS:
      const contacts = await Contact.findOneAndUpdate(
         // THIS STORES THE USERID TO THE STOREDBY FIELD
         { storedBy: userId },
         // TO UNPACK EACH ARRAY AND AVOID DUPLICATES
         { $addToSet: { contacts: { $each: usersList } } },
         { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      )
      if (!contacts) {
         console.log('Contacts were not created');
      }
      console.log(contacts);

   } catch (error) {
      console.log(error.message)
   }
}

export { addUsers }