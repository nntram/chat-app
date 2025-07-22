export interface User {
    id: string;
    profilePiture: string;
    photoUrl: string;
    fullName: string;
    isOnline: boolean;
    userName: string;
    connectionId: string;
    lastMessage: string;
    unreadCount: number;
    isTyping: boolean;
}