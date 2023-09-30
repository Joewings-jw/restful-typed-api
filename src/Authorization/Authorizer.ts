import {
  Account,
  SessionToken,
  TokenGenerator,
  TokenRights,
  TokenState,
  TokenValidator,
} from '../Server/Model';
import {SessionTokenDbAcc} from './SessionTokenDbAcc';
import {UserCredDbAccess} from './UserCredDbAccess';

export class Authorizer implements TokenGenerator, TokenValidator {
  private userDbAccess: UserCredDbAccess = new UserCredDbAccess();
  private session_token: SessionTokenDbAcc = new SessionTokenDbAcc();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const user_account = await this.userDbAccess.getUserCred(
      account.username,
      account.password
    );

    if (user_account) {
      const token = {
        access_rights: user_account.access_rights,
        expiration_time: this.gen_expiry_time(),
        username: user_account.username,
        valid: true,
        tokenId: this.gen_random_tokenId(),
      };
      await this.session_token.store_sess_token(token);
      return token;
    } else {
      return undefined;
    }
  }

  private gen_expiry_time() {
    return new Date(Date.now() + 60 * 60 * 1000);
  }
  private gen_random_tokenId() {
    return Math.random().toString(36).slice(2);
  }

  public async validateToken(tokenId: string): Promise<TokenRights> {
    const token = await this.session_token.get_token(tokenId);
    if (!token || !token.valid) {
      return {
        access_rights: [],
        state: TokenState.INVALID,
      };
    } else {
      if (token.expiration_time < new Date()) {
        return {
          access_rights: [],
          state: TokenState.EXPIRED,
        };
      }
    }
    return {
      access_rights: token.access_rights,
      state: TokenState.VALID,
    };
  }
}
