import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr'
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private authService = inject(AuthService);
  private hubUrl = 'http://localhost:5000/hubs/chat';

  onlineUsers = signal<User[]>([]);
  currentOpenedChat = signal<User | null>(null);
  chatMessages = signal<Message[]>([]);
  isLoading = signal<boolean>(true);

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

    this.hubConnection!.on('Notify', (user: User) => {
      Notification.requestPermission().then((result) => {
        if (result == 'granted') {
          new Notification('Active now', {
            body: user.fullName + ' is online now',
            icon: user.profileImage,
          })
        }
      }
      )
    })

    this.hubConnection!.on('OnlineUsers', (user: User[]) => {
      console.log(user);
      this.onlineUsers.update(() =>
        user.filter(user => user.userName !== this.authService.currentLoggedUser!.userName))
    })

    this.hubConnection!.on('ReceiveMessageList', (message) => {
      this.chatMessages.update(messages => [...message, ...messages]);
      this.isLoading.update(() => false);
    })

    this.hubConnection!.on('ReceiveNewMessage', (message: Message) => {
      document.title = '(1) New Message';
      this.chatMessages.update((messages) => [...messages, message]);
    })
  }

  disConnectConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(err => console.log(err));
    }
  }

  sendMessage(message: string) {
    this.chatMessages.update((messages) => [
      ...messages,
      {
        content: message,
        senderId: this.authService.currentLoggedUser!.id,
        receiverId: this.currentOpenedChat()?.id!,
        createdDate: new Date().toString(),
        isRead: false,
        id: 0
      },
    ]);

    this.hubConnection?.invoke('SendMessage', {
      receiverId: this.currentOpenedChat()?.id,
      content: message,
    })
      .then((id) => {
        console.log('message send to', id)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  status(userName: string): string {
    const currentChatUser = this.currentOpenedChat();
    if (!currentChatUser) {
      return 'offline';
    }

    const onlineUser = this.onlineUsers().find((user) => user.userName == userName);
    return onlineUser?.isTyping ? 'Typing...' : this.isUserOnline();
  }

  isUserOnline(): string {
    let onlineUser = this.onlineUsers().find((user) => user.userName == this.currentOpenedChat()?.userName);
    return onlineUser?.isOnline ? 'online' : this.currentOpenedChat()!.userName;
  }

  loadMessages(pageNumber: number) {
    this.hubConnection?.invoke('LoadMessages', this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => this.isLoading.update(() => false));
  }

}
