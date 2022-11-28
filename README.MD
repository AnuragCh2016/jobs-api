#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- jobs.js

#### User Model

Email Validation Regex

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

 - [x] Validate - name, email, password - with Mongoose
- [x] Hash Password (with bcryptjs)
- [x] Save User
- [x] Generate Token
- [x] Send Response with Token with status as created

#### Login User

- [x] Validate - email, password - in controller
- [x] If email or password is missing, throw BadRequestError
- [x] Find User
- [x] Compare Passwords
- [x] If no user or password does not match, throw UnauthenticatedError
- [x] If correct, generate Token
- [x] Send Response with Token

#### Mongoose Errors

- [x] Validation Errors
- [x] Duplicate (Email)
- [x] Cast Error

#### Security

- [x] helmet
- [x] cors
- [x] xss-clean
- [x] express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```
