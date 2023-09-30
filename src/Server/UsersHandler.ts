import {IncomingMessage, ServerResponse} from 'http';
import {ZodError} from 'zod';
import {
  AccessRight,
  HTTP_CODES,
  HTTP_METHODS,
  User,
  UserResponseDTO,
} from '../Shared/model';
import {UsersDbAccess} from '../User/UsersDbAccess';
import {BaseReqHandler} from './BaseReqHandler';
import {TokenValidator} from './Model';
import {Utils} from './Utils';
import {userSchema} from './Validators';

export class UsersHandler extends BaseReqHandler {
  private userdb_acc: UsersDbAccess = new UsersDbAccess();
  private token_validator: TokenValidator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    token_validator: TokenValidator
  ) {
    super(req, res);
    this.token_validator = token_validator;
  }

  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handle_get();
        break;

      case HTTP_METHODS.PUT:
        await this.handle_put();
        break;

      case HTTP_METHODS.DELETE:
        await this.handle_delete();
        break;

      default:
        await this.handle_not_found();
        break;
    }
  }

  private async handle_put() {
    const authorized_operation = await this.operation_authorized(
      AccessRight.CREATE
    );
    if (authorized_operation) {
      try {
        const user: User = await this.getReqBody();
        const validatedUser = userSchema.parse(user);

        await this.userdb_acc.put_user(validatedUser);
        this.resText(HTTP_CODES.CREATED, `User ${user.name} created`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error instanceof ZodError) {
          this.resBadRequest(`Invalid user data: ${error.errors[0].message}`);
        } else {
          this.resInternalServerError('Internal Server Error');
        }
      }
    } else {
      this.resUnauthorized('Missing or unauthorized operation');
    }
  }

  private async handle_get() {
    const authorized_operation = await this.operation_authorized(
      AccessRight.READ
    );
    if (authorized_operation) {
      const parsedUrl = Utils.getUrlParams(this.req.url);
      if (parsedUrl) {
        const userId = parsedUrl.get('id');
        const userName = parsedUrl.get('name');

        if (userId) {
          const user = await this.userdb_acc.get_userById(userId);
          if (user) {
            const userResponse: UserResponseDTO = {
              id: user.id,
              email: user.email,
              working_position: user.working_position,
            };
            this.resJsonObject(HTTP_CODES.OK, userResponse);
          } else {
            this.handle_not_found();
          }
        } else if (userName) {
          const users = await this.userdb_acc.get_userByName(userName);
          const userResponses: UserResponseDTO[] = users.map(user => ({
            id: user.id,
            email: user.email,
            working_position: user.working_position,
          }));

          this.resJsonObject(HTTP_CODES.OK, userResponses);
        } else {
          this.resBadRequest('User id or name requested could not be found');
        }
      }
    } else {
      this.resUnauthorized('Missing or unauthorized operation');
    }
  }

  private async handle_delete() {
    const authorized_operation = await this.operation_authorized(
      AccessRight.DELETE
    );
    if (authorized_operation) {
      const parsedUrl = Utils.getUrlParams(this.req.url);
      if (parsedUrl) {
        const userId = parsedUrl.get('id');
        if (userId) {
          const delete_result = await this.userdb_acc.delete_user(userId);
          if (delete_result) {
            this.resText(HTTP_CODES.OK, `user ${userId} deleted`);
          } else {
            this.resText(HTTP_CODES.NOT_FOUND, `user ${userId} not deleted`);
          }
        } else {
          this.resBadRequest('Missing id in the request');
        }
      }
    }
  }

  public async operation_authorized(operation: AccessRight): Promise<boolean> {
    const tokenId = this.req.headers.authorization;
    if (tokenId) {
      const token_rights = await this.token_validator.validateToken(tokenId);
      if (token_rights.access_rights.includes(operation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
