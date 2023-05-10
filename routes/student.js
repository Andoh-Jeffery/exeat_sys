const express=require('express')
const db=require('../config/db')
const FormData=require('form-data')
const fetch=require('node-fetch')
const router=express.Router()

router.get('/',async(req,res)=>{
    try {
        const studentDetails=db.collection('student')
        await studentDetails.get() 
        res.send("student data yet to come")
    } catch (error) {
        console.log(error);
    }
})

router.post('/add_student',async(req,res)=>{
    try {
        const {studentName,studentClass,studentHouse,studentParentTel}=req.body
        await db.collection('student').doc().set(req.body)
        res.status(200).send('student added')
    } catch (error) {
        console.log(error);
    }
   
})
router.post('/issue_exeat',async(req,res)=>{
    var formdata=new FormData();
    
    try {
        const {studentName,reason,d_o_i,d_o_r,message,parentTel}=req.body
        formdata.append("from","KWGH");
        formdata.append("to",req.body.parentTel);
        formdata.append("msg",req.body.message);
        fetch("https://api.giantsms.com/api/v1/send",{
            method:"POST",
            headers:{
                "authorization":"Basic cUtaU0NPdVk6c1R6bUl4UHlxTw=="
            },
            body:formdata,
            redirect:"follow"
        }).then(response=>response.json())
        .then(result=>console.log(result))
        .catch(error=>console.log('error',error))
        await db.collection('exeat').doc.set(req.body)
        res.status(200).send('exeat issued')
    } catch (error) {
        console.log(error);
    }
})

module.exports=router