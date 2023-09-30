import {UserCredDbAccess} from '../src/Authorization/UserCredDbAccess';
import {UsersDbAccess} from '../src/User/UsersDbAccess';

class DbTest {
  public db_access: UserCredDbAccess = new UserCredDbAccess();
  public user_db_access: UsersDbAccess = new UsersDbAccess();
}

new DbTest().db_access.putUserCred({
  username: 'Test',
  password: 'password',
  access_rights: [0, 1, 2, 3],
});
