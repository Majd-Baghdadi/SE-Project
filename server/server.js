// Entry point for the server - initializes Express app and connects all routes
require('dotenv').config();
const express=require('express') ;
const app=express() ;

app.use(express.json());
const port=process.env.PORT ;
app.listen(port,()=>console.log(`server is running on port ${port}`));