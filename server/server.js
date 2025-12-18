// Entry point for the server - initializes Express app and connects all routes
require('dotenv').config();
const express=require('express') ;
const app=express() ;
const documentRoutes=require("./routes/documentRoutes")
const authRoutes=require('./routes/authRoutes') ;
const proposeRoutes=require("./routes/proposeRoutes")
const cors = require('cors');
const cookieParser = require('cookie-parser');


app.use(cors({
    origin: true, // Allow all origins for testing
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

const port=process.env.PORT || 4000 ;

app.use('/api/auth',authRoutes) ;
app.use("/api/documents",documentRoutes);
app.use("/api/propose",proposeRoutes)


app.get('/',(req,res)=>{
    res.json({message:"server is runing "}) ;
})

app.listen(port,()=>console.log(`server is running on port ${port}`));


