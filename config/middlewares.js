const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    }
    else{
        res.redirect('/')
    }
}

const isAuthorize=(req,res,next)=>{
    if(req.session.isAuthorize){
        next()
    }
    else{console.log("not Authorize");}
}
const islegit=(req,res,next)=>{
    if(req.session.isAuthorize=='0'){
        next()
    }
    else{
        res.redirect('/dashboard')
    }
}
module.exports={
    isAuth,
    isAuthorize,
    islegit
}