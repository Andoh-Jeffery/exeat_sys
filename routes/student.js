const express=require('express')
const db=require('../config/db')
const router=express.Router()

router.get('/',async(req,res)=>{
    try {
        const studentDetails=db.collection('student')
        await studentDetails.get() 
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
    try {
        const {studentName,reason,d_o_i,d_o_r,messageToParent,parentTel}=req.body
        await db.collection('exeat').doc.set(req.body)
        res.status(200).send('exeat issued')
    } catch (error) {
        console.log(error);
    }
})

module.exports=router