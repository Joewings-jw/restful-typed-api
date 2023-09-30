import {IncomingMessage, ServerResponse} from 'http';
import {ZodError} from 'zod';
import {HTTP_CODES, HTTP_METHODS} from '../Shared/model';
import {BaseReqHandler} from './BaseReqHandler';
import {Account, TokenGenerator} from './Model';
import {loginSchema} from './Validators';

export class LoginHandler extends BaseReqHandler {
  private token_gen: TokenGenerator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    token_gen: TokenGenerator
  ) {
    super(req, res);
    this.token_gen = token_gen;
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handle_post();
        break;

      default:
        this.handle_not_found();
        break;
    }
  }

  private async handle_post() {
    try {
      const body: Account = await this.getReqBody();
      // Validate the request body against the login schema
      const validatedData = loginSchema.parse(body);

      const session_token = await this.token_gen.generateToken(validatedData);

      if (session_token) {
        this.res.statusCode = HTTP_CODES.CREATED;
        this.res.writeHead(HTTP_CODES.CREATED, {
          'Content-Type': 'application/json',
        });
        this.res.write(JSON.stringify(session_token));
      } else {
        this.resBadRequest(
          `Could not create user session for ${body.username}`
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        this.resBadRequest(
          `Invalid request body:', ${error.errors[0].message}`
        );
      } else {
        this.resInternalServerError('Internal Server Error');
      }
    }
  }
}
