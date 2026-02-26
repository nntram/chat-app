import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatIconModule, MatMenuModule, TitleCasePipe],
  templateUrl: './chat-sidebar.component.html',
  styles: ``
})
export class ChatSidebarComponent implements OnInit {
  authService = inject(AuthService);
  chatService = inject(ChatService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.chatService.disConnectConnection();
  }

  ngOnInit(): void {
    const users = this.chatService.onlineUsers();
    console.table(users);
    this.chatService.startConnction(this.authService.getAccessToken!);
  }

  openChatWindow(user: User) {
    this.chatService.currentOpenedChat.set(user);
  }
}
