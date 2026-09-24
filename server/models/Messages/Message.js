import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
   conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
   },
   senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   messageContent: {
      type: String,
      required: true,
      minlength: 1
   },
   seenBy: {
      type: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
         }
      ]
   }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema);
export default Message;