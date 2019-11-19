import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

import { sessionMiddleware } from './main';

export class SessionIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options.allowRequest = (request, fn) => {
      sessionMiddleware(request, {}, () => {
        if (request.session.passport && request.session.passport.user) {
          fn(null, true);
        } else {
          fn(null, false);
        }
      });
    };
    options.cookie = false;
    options.transports = ['websocket', 'polling'];
    const server = super.createIOServer(port, options);
    return server;
  }
}
