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
PORT = 3000
SECRET = G*advd^&jKSAI&^%$
```

```
git clone https://github.com/apurbar06/Twitter_Backend.git
cd Twitter_Backend
npm install
npm run dev
```


if everything is correct then the server will run at PORT 3000.

#### Routs:
```
http://localhost:3000/api/signup      Method: POST , body: userName ,password, email
http://localhost:3000/api/login       Method: POST , body: password, email
http://localhost:3000/api/follow      Method: POST , body: followinguserCode, authentication: Bearar Token
http://localhost:3000/api/tweets      Method: POST , body: tweet , authentication: Bearar Token
http://localhost:3000/api/tweets      Method: GET ,  authentication: Bearar Token
```


