import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';

@Injectable()
export class ChromaService {
  private client = new ChromaClient({ path: process.env.CHROMA_DB_PATH });

  async query(
    args: { embedding: number[]; metadata: Record<string, any> },
    collectionName: string,
  ) {
    const collection = await this.client.getCollection({
      name: collectionName,
    });

    const results = await collection.query({
      queryEmbeddings: [args.embedding],
      // where: args.metadata,
      nResults: 3,
    });

    const similarCases = results.metadatas;

    return similarCases;
  }
}
