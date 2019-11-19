import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { NotificationEntity } from './notification.entity';

const namespace = 'notifications';

@WebSocketGateway({ namespace })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  disconnect(userId: number): void {
    this.server.in(`${userId}`).clients((err, socketIds) => {
      socketIds.forEach(socketId => this.server.sockets[socketId].disconnect());
    });
  }

  handleConnection(socket: Socket) {
    this.join(socket);
    const userId = this.getUserId(socket);
  }

  notify(notification: NotificationEntity) {
    const { notifiableId, ...data } = notification;
    this.server.to(`${notifiableId}`).emit('create', data);
  }

  private getUserId(socket: Socket): number {
    return socket.request.session.passport.user.id;
  }

  private join(socket: Socket) {
    const userId = this.getUserId(socket);
    socket.join(`${userId}`);
  }
}
