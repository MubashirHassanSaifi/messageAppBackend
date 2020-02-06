const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const userRouter=require('./Router/user');
require("dotenv").config();


const app=express();

app.use(express.json());
app.use(cors());
app.use('/user',userRouter);


// database connectivity
const connectionString=process.env.CONNECTION_STRING;
//console.log(connectionString);
mongoose.connect(connectionString,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{console.log("Mongo Db connection is established")});

// connect to the port
const port=process.env.PORT || 5002
app.listen(port,console.log(`server is running on ${port}`));

