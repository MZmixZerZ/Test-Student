import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config(); // โหลดตัวแปรจากไฟล์ .env ก่อน

@Injectable()
export class LlmService {
  async embed(prompt: string): Promise<number[]> {
    const response = await axios.post(`${process.env.LLM_URL}/api/embeddings`, {
      model: 'bge-m3',
      prompt,
    });
    return response.data.embedding;
  }
  async chat(prompt: string): Promise<string> {
    const response = await axios.post(`${process.env.LLM_URL}/api/generate`, {
      model: 'llama3',
      prompt,
      stream: false,
    });
    return response.data.response;
  }

  async chatWithOpenAI(prompt: string): Promise<string> {
    const payload = {
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'user',
          content: prompt, // ต้องเป็น string
        },
      ],
    };

    // console.log(JSON.stringify(payload, null, 2)); // ดู payload ที่ส่งไป

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  }
}
