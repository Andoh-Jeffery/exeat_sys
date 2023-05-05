const express=require('express')
require('dotenv').config()
const db=require('./config/db')
const student=require('./routes/student')
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/student',student)

// GET REQUEST TO /
app.get('/',(req,res)=>{
    res.send('homepage')
})
// POST REQUEST TO ADD STUDENT

app.listen(process.env.PORT,(console.log(`listening on port http://localhost:${process.env.PORT}`)))