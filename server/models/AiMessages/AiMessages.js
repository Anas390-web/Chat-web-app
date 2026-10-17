import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema({

   aiConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AiConversation',
      required: [true, 'Ai Conversation id is required']
   },
   senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   messageContent: {
      type: String,
      required: [true, 'messages are required']
   }

}, { timestamps: true })


const AiMessage = mongoose.model('AiMessage', aiMessageSchema);

export default AiMessage;