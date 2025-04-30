const mongoose=require("mongoose");
require("dotenv").config();

const DbConnect= ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("MongoDB Connected successfully"))
    .catch((e)=>{
        console.log("Error while coonecting Mongoodb",e);
        process.exit(1);
    })
    
    
}

module.exports={DbConnect};