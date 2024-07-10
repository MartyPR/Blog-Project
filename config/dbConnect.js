const mongoose = require("mongoose");

//Todo conection mongoDB
const dbConnect = async () => {
  try {
    await mongoose.connect("");
    console.log("DB Connected succesfully");
  } catch (error) {
    console.error(error);
  }
};

dbConnect();
module.exports = dbConnect;
