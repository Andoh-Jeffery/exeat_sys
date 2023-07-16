const express=require('express')
const db=require('../config/db')
const FormData=require('form-data')
const fetch=require('node-fetch')
const router=express.Router()

router.post('/create',async(req,res)=>{
    // const data=req.body;
    try {
        console.log(await req.body);
        res.status(201).send('got data')
        
    } catch (error) {
        console.log(error);
    }
})
router.get('/',async(req,res)=>{
    try {
        const studentDetails=await db.collection('student').get()
        res.status(200).render('view_students',{title:'students',students:studentDetails})
    } catch (error) {
        console.log(error);
    }
})

router.get('/add',(req,res)=>{
    try {
        res.status(200).render('addStudent',{title:'add student'})
    } catch (error) {
        console.log(error);
    }
})

router.get('/issued',(req,res)=>{
    try {
        res.status(200).render('viewIssuedExeat',{title:'issued exeat'})
    } catch (error) {
        console.log(error);
    }
})
router.post('/add',async(req,res)=>{
    try {
        const {firstName,middleName,lastName,house,course,parentTelephone}=req.body
        await db.collection('student').doc().set(req.body)
        res.status(201).json('student added')
    } catch (error) {
        console.log(error);
    }
   
})
router.get('/issue/:id',async(req,res)=>{
    const id=req.params.id
    try {
        const issue=await db.collection('student').doc(id).get()
        // const issueData=issue.data()
        res.status(200).render('issue_exeat',{title:'issue exeat',exeat:issue.data()})
    } catch (error) {
        console.log(error);
    }
})
router.post('/issue_exeat',async(req,res)=>{
    var formdata=new FormData();
    
    try {
        const {studentName,reason,d_o_i,d_o_r,message,parentTel}=req.body
        formdata.append("from","KWGH");
        formdata.append("to",parentTel);
        formdata.append("msg",message);
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
        await db.collection('exeat').doc().set(req.body)
        res.status(200).send('exeat issued')
    } catch (error) {
        console.log(error);
    }
})

module.exports=router