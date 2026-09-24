import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
   participants: {
      type: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
         }
      ],
      validate: [
         (val) => val.length >= 2,
         'A conversation must have 2 or more than participants'
      ]
   },
   isGroup: {
      type: Boolean,
      default: false
   },
   groupName: {
      type: String
   }
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;