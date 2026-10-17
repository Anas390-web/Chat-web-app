import { OllamaEmbeddings } from '@langchain/ollama';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import mongoose from 'mongoose';
import splitText from './textSplitter.js';

// CREATE OLLAMA EMBEDDINGS INSTANCE:
const embeddings = new OllamaEmbeddings({
   baseUrl: process.env.OLLAMA_BASE_URL,
   model: 'nomic-embed-text'
})

const ingestionOfDocuments = async () => {
   try {
      // GET THE TEXT TO CONVERT IT INTO EMBEDDINGS:
      const chunksOutput = await splitText();
      // GET CLIENT FROM THE EXISING SERVER MONGO DB CONNECTION:
      const client = mongoose.connection.getClient();
      // GET DB CONNECTED TO THE CLIENT CONNECTION:
      const db = client.db();
      // GET THE COLLECTION WHERE YOU WANT TO SAVE THE EMBEDDINGS:
      const collection = db.collection(process.env.DB_COLLECTION_NAME);
      // IF EMBEDDED DOCUMENTS ARE ALREADY EXISTING, SKIP THE INGESTION:
      const countOfDocs = await collection.countDocuments();
      if(countOfDocs > 0) {
         console.log('Documents are already ingested, skipping...');
         return;
      }
      // VECTOR STORE: CONVERTING TEXT INTO EMBEDDINGS AND UPLOADING TO THE COLLECTION:
      const vectorStore = MongoDBAtlasVectorSearch.fromDocuments(
         chunksOutput,
         embeddings,
         {
            collection,
            indexName: process.env.VECTOR_INDEX_NAME,
            textKey: 'text',
            embeddingKey: 'embedding'
         }
      )
      return vectorStore;
   } catch (error) {
      console.log('ERROR DURING INGESTION OF DOCUMENTS:' ,error.message);
      return;
   }
}

export default ingestionOfDocuments;
