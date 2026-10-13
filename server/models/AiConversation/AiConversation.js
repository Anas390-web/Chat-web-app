import mongoose from 'mongoose'

const aiConversationSchema = new mongoose.Schema({
   senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   chatType: {
      type: String,
      default: 'ai'
   },
   imgUrl: {
      type: String,
      default: '/images/Sowl-bot-circle.png'
   }
}, { timestamps: true })

const AiConversation = mongoose.model('AiConversation', aiConversationSchema);

export default AiConversation;