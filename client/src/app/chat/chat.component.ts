import { Component } from '@angular/core';
import { ChatSidebarComponent } from "../compoents/chat-sidebar/chat-sidebar.component";
import { ChatWindowComponent } from "../compoents/chat-window/chat-window.component";

@Component({
  selector: 'app-chat',
  imports: [ChatSidebarComponent, ChatWindowComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
