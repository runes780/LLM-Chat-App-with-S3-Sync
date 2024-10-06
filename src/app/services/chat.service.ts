import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private openai: OpenAIApi;
  private currentModel: any;
  private chats: Map<string, { messages: any[] }> = new Map();

  constructor() {
    this.setCurrentModel({ name: 'GPT-3.5', apiUrl: 'https://api.openai.com/v1', modelName: 'gpt-3.5-turbo' });
  }

  setCurrentModel(model: any) {
    this.currentModel = model;
    const configuration = new Configuration({
      apiKey: 'YOUR_OPENAI_API_KEY',
      basePath: model.apiUrl
    });
    this.openai = new OpenAIApi(configuration);
  }

  createNewChat(): string {
    const chatId = Date.now().toString();
    this.chats.set(chatId, { messages: [] });
    return chatId;
  }

  async sendMessage(chatId: string, message: string): Promise<string> {
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.messages.push({ role: 'user', content: message });

    try {
      const response = await this.openai.createChatCompletion({
        model: this.currentModel.modelName,
        messages: chat.messages,
      });

      const assistantMessage = response.data.choices[0].message;
      chat.messages.push(assistantMessage);

      return assistantMessage.content;
    } catch (error) {
      console.error('Error calling API:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }
}