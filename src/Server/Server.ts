import {createServer, IncomingMessage, ServerResponse} from 'http';
import {Authorizer} from '../Authorization/Authorizer';
import {LoginHandler} from './LoginHandler';
import {UsersHandler} from './UsersHandler';
import {Utils} from './Utils';

export class Server {
  private authorizer: Authorizer = new Authorizer();

  create_server(port = 8000, host = 'localhost') {
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const basePath = Utils.getUrlBasePath(req.url);
      console.log('basePath', basePath);

      switch (basePath) {
        case 'login':
          await new LoginHandler(req, res, this.authorizer).handleRequest();
          break;

        case 'users':
          await new UsersHandler(req, res, this.authorizer).handleRequest();
          break;

        default:
          break;
      }
      res.end();
    }).listen(port, host);

    console.log(`Server started on http://${host}:${port}`);
  }
}
