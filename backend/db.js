const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/iNoteBook";

const connectToMongo = ()=>{
    try{
        mongoose.connect(mongoURI)
        console.log("Connected to mongo db successfully!");
    }catch(err){
        console.error("Failed to connect to mongo db: "+err);
    }

}

module.exports = connectToMongo;