const mongoose = require("mongoose");
//require('dotenv').config({ path: 'c:/Users/HP/Desktop/fullStack-Blog/.env' });
const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://sakshikug21ec:PH0Wh27iDQP3HvR0@fullstackblog.cnbekcr.mongodb.net/?retryWrites=true&w=majority&appName=fullstackblog");
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();