import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import fs from 'fs/promises'
import path from 'path'


const splitText = async () => {
   try {
      // MAKE AN INSTANCE OF RECURSIVE TEXT SPLITTER:
      const splitter = new RecursiveCharacterTextSplitter({
         chunkSize: 500,
         separators: ["\n\n", "\n", " ", "", "##"],
         chunkOverlap: 200
      })
      // GET THE FILE THAT TEXT NEEDS TO BE SPLITTED:
      const text = await fs.readFile(path.join(process.cwd(), 'config/appOverview.md'), 'utf-8');

      if(!text && text.length < 1) {
         console.log('Text file does not exist');
         return;
      }

      // SPLIT THE TEXT FROM THE FILE INTO CHUNKS:
      const chunksOutput = await splitter.createDocuments([text]);
      return chunksOutput;
   } catch (error) {
      console.log(error.message);
      return;
   }
}

export default splitText;