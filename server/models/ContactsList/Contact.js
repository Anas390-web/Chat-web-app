import mongoose from 'mongoose'

const contactListSchema = new mongoose.Schema({
   contacts: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Must provide the users'],
      }
   ],
   storedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Must provide the userId'],
   }
})

const Contact = mongoose.model('Contact', contactListSchema);

export default Contact;