import express from 'express'
import userAuthentication from '../../middlewares/Auth/auth.js'
import { addUsers } from '../../controllers/Contacts/contacts.js';

const contactsRouter = express.Router();

// CONTACT LIST ROUTE:
contactsRouter.route('/').post(userAuthentication, addUsers)


export default contactsRouter;