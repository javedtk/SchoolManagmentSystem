import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly platformId = inject(PLATFORM_ID);
  private socket: Socket | null = null;
  private readonly serverUrl = 'http://localhost:5000';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io(this.serverUrl, {
        transports: ['websocket']
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.warn('WebSocket connection error:', error.message);
      });
    }
  }

  on(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        return;
      }
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });

      return () => {
        if (this.socket) {
          this.socket.off(eventName);
        }
      };
    });
  }

  joinRoom(roomName: string): void {
    if (this.socket) {
      this.socket.emit('join', roomName);
    }
  }

  emit(eventName: string, data: any): void {
    if (this.socket) {
      this.socket.emit(eventName, data);
    }
  }
}
