import {Server} from './Server/Server';

class Launcher {
  server: Server;

  constructor() {
    this.server = new Server();
  }
  launch_app() {
    this.server.create_server(3000, 'localhost');
  }
}

new Launcher().launch_app();
