// Entry point for the server - initializes Express app and connects all routes
require('dotenv').config();
const express=require('express') ;
const app=express() ;
const documentRoutes=require("./routes/documentRoutes")

app.use(express.json());
app.use("/api/documents",documentRoutes);
const port=process.env.PORT || 4000 ;
app.listen(port,()=>console.log(`server is running on port ${port}`));