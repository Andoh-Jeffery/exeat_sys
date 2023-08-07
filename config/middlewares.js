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

module.exports={
    isAuth,
    isAuthorize
}