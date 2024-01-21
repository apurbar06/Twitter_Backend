# Twitter Backend Project Setup Guide:


### Project Description:

This project utilizes JavaScript as the programming language, with the Express framework for setting up the Node.js server. MongoDB is the default database.

### Functionality Overview:

The project allows users to follow others, view tweets, and post tweets. Three MongoDB models—userModel, FollowersModel, and MessageModel—have been implemented to handle user data, follower relationships, and tweet storage, respectively.


#### PREREQUISITES: 
Node Js v18.0.0

#### Setup:

.env
```
MONGO_URL = <YOUR_MONGODB_URL>
PORT = 3005
SECRET = G*advd^&jKSAI&^%$
```

```
https://github.com/apurbar06/MERN_things.git
cd Simple_Tweet/server
npm install
npm run dev
```


if everything is correct then the server will run at PORT 3005.

#### Routs:
```
http://localhost:3000/api/signup      Method: POST , body: userName ,password, email
http://localhost:3000/api/login       Method: POST , body: password, email
http://localhost:3000/api/me          Method: GET ,  authentication: Bearer Token
http://localhost:3000/api/users       Method: GET ,  authentication: Bearer Token
http://localhost:3000/api/following   Method: GET ,  authentication: Bearer Token
http://localhost:3000/api/followers   Method: GET ,  authentication: Bearer Token
http://localhost:3000/api/follow      Method: POST , body: followinguserCode, authentication: Bearer Token
http://localhost:3000/api/tweets      Method: POST , body: tweet , authentication: Bearer Token
http://localhost:3000/api/tweets      Method: GET ,  authentication: Bearer Token
```


