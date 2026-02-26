import { Component } from '@angular/core';
import { ChatSidebarComponent } from "../compoents/chat-sidebar/chat-sidebar.component";
import { ChatWindowComponent } from "../compoents/chat-window/chat-window.component";
import { ChatRightSidebarComponent } from "../compoents/chat-right-sidebar/chat-right-sidebar.component";

@Component({
  selector: 'app-chat',
  imports: [ChatSidebarComponent, ChatWindowComponent, ChatRightSidebarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

}
