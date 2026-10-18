import mongoose from 'mongoose'
import { OllamaEmbeddings } from '@langchain/ollama'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'

const embeddings = new OllamaEmbeddings({
   baseUrl: process.env.OLLAMA_BASE_URL,
   model: 'nomic-embed-text'
})

const getRetriever = async () => {
   try {
      // GET CLIENT FROM MONGOOSE EXISTING SERVER CONNECTION WITH MONGODB:
      const client = mongoose.connection.getClient();
      // TAKE DB OUT OF CLIENT/CONNECTION:
      const db = client.db();
      // GET THE COLLECTION OUT OF DB:
      const collection = db.collection(process.env.DB_COLLECTION_NAME);
      // CREATE VECTOR STORE:
      const vectorStore = new MongoDBAtlasVectorSearch(
         embeddings,
         {
            collection,
            indexName: process.env.VECTOR_INDEX_NAME,
            textKey: 'text',
            embeddingKey: 'embedding'
         }
      )
      // GET THE RETRIEVER OUT OF VECTOR STORE:
      const retriever = vectorStore.asRetriever();
      return retriever;
   } catch (error) {
      console.log('ERROR OCCURED DURING GETTING THE RETRIEVER FROM VECTOR STORE:', error.message);
      return;
   }
}

export default getRetriever;