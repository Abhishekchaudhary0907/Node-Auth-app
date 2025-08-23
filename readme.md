login
1 check email pass
2 fetch data from email
3 compare password using bcrypt
4 create json web token
5 store token in cookies or other place it depends
6 use cookie-parser fro asscessing cookie

// if you will make any property undefined in mongodb database it will be deleted automatically//
7 that is why set undefined rather than null

// no need to add .gitignore in .gitignore

8 how to add local git repo in git remote

git init
git add
git commit

-- now make git repo in remote

git remote add origin <remote url>
git branch -M main
git push -u origin <branch name>

// winston for logging
winston-daily-rotate-file ==> this is for logging in file

winston-mongodb ==> transport logs on mongodb db

//morgan ==> this is for logging http request response

// generally we integrate morgan with winston

mongodb structure
Cluster
└── Database(s)
└── Collection(s)
└── Document(s)

mongoose.Model("User",userSchema)

'User' --> refer to --> 'users' collection in mongodb

You don’t need to manually create collections in MongoDB Atlas.
Mongoose will automatically create the collection for you when you first save a document through a model.

//// connect to Atlas and specify a db name "myNewApp"
await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.mongodb.net/myNewApp");

//What is Connection Pooling?

A connection pool is a cache of reusable database connections maintained by the MongoDB driver (or Mongoose, which uses the driver under the hood).

Instead of opening and closing a new network connection for every request (slow & expensive), the app:

Opens a pool of connections once.

Reuses those connections across all requests.

Releases them back to the pool when done.
