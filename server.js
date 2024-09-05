require('dotenv').config({ path: 'c:/Users/HP/Desktop/fullStack-Blog/.env' });

const express = require("express");
const session = require("express-session");
const mongostore=require("connect-mongo");
const globalErrHandler = require("./middlewares/globalHandler");
const commentRoutes = require("./routes/comments/comments");
const postRoutes = require("./routes/posts/posts");
const userRoutes = require("./routes/users/users");

require("./config/dbConnect");

const app = express();

//middlewares
//configure ejs
app.set("view engine", "ejs");
// serve static files
app.use(express.static(__dirname, +"/public"));
app.use(express.json()); //pass incoming data

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store : new mongostore({
      mongoUrl : "mongodb+srv://sakshikug21ec:PH0Wh27iDQP3HvR0@fullstackblog.cnbekcr.mongodb.net/?retryWrites=true&w=majority&appName=fullstackblog",
      ttl : 24*60*60 // 1 day
    })
    
  })
);

// render home
app.get('/', (req, res)=>{
  res.render('index.ejs');
});

//users route
app.use("/api/v1/users", userRoutes);

//posts route
app.use("/api/v1/posts", postRoutes);

//comments
app.use("/api/v1/comments", commentRoutes);

//Error handler middlewares
app.use(globalErrHandler);
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));

