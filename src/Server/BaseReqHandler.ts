/* eslint-disable @typescript-eslint/no-explicit-any */
import {IncomingMessage, ServerResponse} from 'http';
import {HTTP_CODES} from '../Shared/model';

export abstract class BaseReqHandler {
  protected req: IncomingMessage;
  protected res: ServerResponse;
  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
  }

  async handleRequest(): Promise<void> {}

  protected handle_not_found() {
    this.res.statusCode = HTTP_CODES.NOT_FOUND;
    this.res.write('Not found');
  }
  protected async getReqBody(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.req.on('data', (data: string) => {
        body += data;
      });
      this.req.on('end', () => {
        try {
          if (body) return resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
      this.req.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  protected resJsonObject(code: HTTP_CODES, object: any) {
    this.res.writeHead(code, {'Content-Type': 'application/json'});
    this.res.write(JSON.stringify(object));
  }
  protected resBadRequest(message: string) {
    this.res.statusCode = HTTP_CODES.BAD_REQUEST;
    this.res.write(message);
  }
  protected resUnauthorized(message: string) {
    this.res.statusCode = HTTP_CODES.UNAUTHORIZED;
    this.res.write(message);
  }
  protected resText(http_code: HTTP_CODES, message: string) {
    this.res.statusCode = http_code;
    this.res.write(message);
  }
  protected resInternalServerError(message: string) {
    this.res.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
    this.res.write(message);
  }
}
