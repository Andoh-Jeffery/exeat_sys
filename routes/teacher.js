const express=require('express')
const bcrypt=require('bcrypt')
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

router.post('/login',async(req,res)=>{
    try {
        const { email, password } = req.body
        const teacher = await db.collection('teacher').where('email', '==', req.body.email).get()
        if (!teacher.empty) {
            console.log("yes"); 
            teacher.forEach(async (teacher) => {
                const isMatch = await bcrypt.compare(req.body.password, teacher.data().password)
                if (isMatch) {
                    console.log("matched");
                    res.send('dashboad')
                }
                else {
                    console.log("no match");
                }
            })
        }
        else {
            console.log('wrong creds');
        }
    } catch (error) {
        console.log("error", error);
    }
})

module.exports=router