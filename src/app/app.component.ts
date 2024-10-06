import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chats: any[] = [];

  constructor(private router: Router, private chatService: ChatService) {}

  newChat() {
    const newChatId = this.chatService.createNewChat();
    this.router.navigate(['/chat', newChatId]);
  }

  selectChat(chat: any) {
    this.router.navigate(['/chat', chat.id]);
  }

  onModelChange(model: any) {
    this.chatService.setCurrentModel(model);
  }
}