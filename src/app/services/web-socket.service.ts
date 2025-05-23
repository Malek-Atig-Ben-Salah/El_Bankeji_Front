import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private httpUrl = 'ws://localhost:8001/chat?user=John Doe';

  constructor() {
    console.log("conntext");
    this.connect();
  }

  public connect(): void {
    this.socket = new WebSocket(this.httpUrl);

    this.socket.onopen = (event) => {
      console.log('WebSocket connected:', event);
    };

    this.socket.onmessage = (event) => {
      console.log(event);
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.messageSubject.error(error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
      this.messageSubject.complete();
      // Optional: Reconnect logic
      setTimeout(() => this.connect(), 5000);
    };
  }

  public sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      console.log("message : " , message);
      this.socket.send(JSON.stringify(message.content));
    } else {
      console.error('WebSocket is not open. Ready state:', this.socket.readyState);
    }
  }

  public getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  public closeConnection(): void {
    this.socket.close();
  }
}
