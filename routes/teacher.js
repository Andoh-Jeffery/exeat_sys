const express=require('express')
const router=express.Router()
const db=require('../config/db')

router.post('/add_teacher',async(req,res)=>{
    try {
        const user_password= await bcrypt.hash(req.body.password,10)
        const teacher_obj={
            name:req.body.name,
            phoneNumber:req.body.phoneNumber,
            house:req.body.house,
            email:req.body.email,
            password:user_password
        }
        await db.collection('teacher').doc().set(teacher_obj)
        res.send("teacher added")
    } catch (error) {
        console.log(error);
    }
})


module.exports=router