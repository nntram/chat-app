import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService = inject(AuthService);
  private hubUrl = 'http://localhost:5000/hubs/chat';

  onlineUsers = signal<User[]>([]);

  private hubConnection?: HubConnection;

  startConnction(token: string, senderId?: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`, {
        accessTokenFactory: () => token,
      }).withAutomaticReconnect().build();

    this.hubConnection.start().then(() => {
      console.log('Connetion started');
    })
      .catch((error) => {
        console.log('Connetion or login error', error);
      })

    this.hubConnection!.on('OnlineUsers', (user: User[]) => {
      console.log(user);
      this.onlineUsers.update(() =>
        user.filter(user => user.userName !== this.authService.currentLoggedUser!.userName))
    })
  }
}
