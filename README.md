### Project Title

**Injecting Types into JavaScript: A Simple RESTful API Showcase**

### Overview

Explore a concise TypeScript server project featuring Zod validation for RESTful APIs. This project emphasizes early returns for clean code and leverages a modular MVC structure with dependency injection.

### Project Structure

```plaintext
├── database
│   ├── SessionToken.db
│   ├── UserCredentials.db
│   └── Users.db
├── dist/
├── src
│   ├── Authorization
│   │   ├── Authorizer.ts
│   │   ├── SessionTokenDbAcc.ts
│   │   └── UserCredDbAccess.ts
│   ├── Launcher.ts
│   ├── Server
│   │   ├── BaseReqHandler.ts
│   │   ├── LoginHandler.ts
│   │   ├── Model.ts
│   │   ├── Server.ts
│   │   ├── UsersHandler.ts
│   │   ├── Utils.ts
│   │   └── Validators.ts
│   ├── Shared
│   │   └── model.ts
│   └── User
│       └── UsersDbAccess.ts
├── Test
│   └── DbTest.ts
├── package-lock.json
├── package.json
├── README.md
├── requests.http
└── tsconfig.json
```

### Quick Start Guide

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Create User Credentials with all access rights:**

   ```bash
   ts-node Test/DbTest.ts
   ```

   ```typescript
   // Content of DbTest.ts
   import { UserCredDbAccess } from '../src/Authorization/UserCredDbAccess';
   import { UsersDbAccess } from '../src/User/UsersDbAccess';

   class DbTest {
     public db_access: UserCredDbAccess = new UserCredDbAccess();
     public user_db_access: UsersDbAccess = new UsersDbAccess();
   }

   new DbTest().db_access.putUserCred({
     username: 'Test',
     password: 'password',
     access_rights: [0, 1, 2, 3],
   });
   ```

4. **Run the Server:**

   ```bash
   npm start
   ```

5. **Test Endpoints:**

   - **Login Endpoint:**

     ```http
     POST http://localhost:3000/login
     Content-Type: application/json

     {
         "username": "Test",
         "password": "password"
     }
     ```

   - **Users Endpoint:**

     ```http
     GET http://localhost:3000/users?id=YourUserId
     Authorization: YourAuthToken
     ```

     For more endpoints, refer to the [requests.http](./requests.http) file.

### Key Features

- **Zod Validation**
- **Early Returns for Code Clarity**
- **Modular MVC Structure**
- **Dependency Injection Flexibility**

### Scripts

```json
"scripts": {
  "start": "ts-node src/Launcher.ts",
  "watch": "concurrently \"tsc -w\" \"nodemon --watch ./dist/ --exec npm run start\"",
  "lint": "gts lint",
  "clean": "gts clean",
  "compile": "tsc",
  "fix": "gts fix"
}
```
