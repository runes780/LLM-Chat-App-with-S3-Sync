import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { S3SyncService } from '../services/s3-sync.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: { role: string; content: string }[] = [];
  userInput = '';
  chatId: string;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private s3SyncService: S3SyncService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.chatId = params['id'];
      this.loadMessages();
    });
  }

  async sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ role: 'user', content: this.userInput });
      const response = await this.chatService.sendMessage(this.chatId, this.userInput);
      this.messages.push({ role: 'assistant', content: response });
      this.userInput = '';
      this.saveMessages();
    }
  }

  private async loadMessages() {
    const savedMessages = await this.s3SyncService.loadMessages(this.chatId);
    if (savedMessages) {
      this.messages = savedMessages;
    }
  }

  private async saveMessages() {
    await this.s3SyncService.saveMessages(this.chatId, this.messages);
  }
}