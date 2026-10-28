import { ChatGroq } from '@langchain/groq'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers';
import getRetriever from './retriever.js';
import { formatDocuments } from './utils.js';
import AiConversation from '../models/AiConversation/AiConversation.js'
import AiMessage from '../models/AiMessages/AiMessages.js'

const apiKey = process.env.GROQ_AI_CHATBOT_KEY;

const groqLlm = new ChatGroq({
   apiKey,
   model: 'qwen/qwen3.8-27b',
   temperature: 0,
   maxTokens: 500
})

// AI RESPONSE TO USER MESSAGE:

const finalAiResponse = (socket, io) => {
   socket.on("send-message-to-ai-chat", async (aiMessage) => {
      try {
         console.log(aiMessage);
         // CONVERTING THE USER QUESTION TO STANDALONE QUESTION PROMPT:
         const standaloneQuestionTemplate = `Act as an AI assistant to convert user input into a clear, standalone question using conversation context. Shorten long queries to their core intent and expand brief ones with necessary context.
         question: {userQuestion}
         standalone question: `

         const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

         // GET THE RETRIEVER FROM THE RETRIEVER FILE:
         const retriever = await getRetriever();

         // GET RESPONSE FROM THE LLM PROMPT:
         const answerTemplate = `Your name is Sowl. Answer the user's question directly & sequentially about the system information or general knowledge about the world. Remember the username. Strictly avoid explaining missing system information details. If you do not have the answer regarding system information, state: "I don't have information about this."
         system information: {system_information}
         user question: {userQuestion}
         username: {username}
         answer: `
         // CONTEXT/CONVERSATION HISTORY IS REMOVED AS IT EXCEEDS THE TOKEN LIMIT IN FEW MESSAGES.
         // context: {conversation_history}

         const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

         // STANDALONE QUESTION CHAIN:
         const standaloneChain = RunnableSequence.from([
            standaloneQuestionPrompt,
            groqLlm,
            new StringOutputParser(),
         ])

         // RETRIEVER CHUNKS FROM DATABASE CHAIN:
         const retrieverChain = RunnableSequence.from([
            retriever,
            formatDocuments
         ])

         // LLM RESPONSE CHAIN:
         const answerChain = RunnableSequence.from([
            answerPrompt,
            groqLlm,
            new StringOutputParser()
         ])

         // FINAL CHAIN:
         const chain = RunnableSequence.from([
            {
               standalone_Question: standaloneChain,
               original_input: new RunnablePassthrough()
            },
            {
               system_information: async (input) => {
                  return await retrieverChain.invoke(input.standalone_Question)
               },
               username: (input) => {
                  return input.original_input.username
               },
               // REMOVING TO SAVE TOKENS:
               // conversation_history: async (input) => {
               //    return input.original_input.conversation_history
               // },
               userQuestion: (input) => {
                  return input.original_input.userQuestion
               }
            },
            answerChain,
         ])

         // GET THE AI AND USER CONVERSATION:
         const { userId, username } = socket.user;

         const conversation = await AiConversation.findOne(
            { senderId: userId }
         )

         if (!conversation) {
            console.log('ERROR DURING AI CHAT: NO CONVERSATION FOUND')
            return;
         }

         // GET ALL THE CONVERSATION MESSAGES:
         const allAiChatMessages = await AiMessage.find(
            {
               aiConversationId: conversation._id
            }
         )

         const response = await chain.invoke({
            userQuestion: aiMessage,
            conversation_history: allAiChatMessages,
            username: username
         })
         console.log(response);

         const aiResponse = await AiMessage.create(
            {
               aiConversationId: conversation._id,
               messageContent: response,
               senderId: userId
            }
         )
         const aiResponseId = (aiResponse._id).toString();
         if (aiResponseId.length < 1) {
            console.log('ERROR: AI RESPONSE WAS NOT SAVED IN THE DB');
            return;
         }

         // EMIT THE EVENT TO SAVE THE LATEST MESSAGE IN THE ALL AI MESSAGES ARRAY TO DISPLAY THE AI LATEST MESSAGE:

         socket.emit("receive-ai-latest-response", aiResponse);


      } catch (error) {
         console.log('ERROR:', error.message);
      }
   })
}

export default finalAiResponse;