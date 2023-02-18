module.exports.isLevel4 = (req,res,next) => {
    const { role } = req.user
    
    if(role === 'admin' ){
        next()
    } else {
        return res.status(403).json({
            error:{
                message:'คุณไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น'
            }
        })
    }
}

module.exports.isLevel3 = (req,res,next) => {
    const { role } = req.user
    
    if(role === 'admin' || role === 'manager' ){
        next()
    } else {
        return res.status(403).json({
            error:{
                message:'คุณไม่มีสิทธิ์ใช้งานส่วนนี้ เฉพาะระดับผู้จัดการขึ้นไปเท่านั้น'
            }
        })
    }
}


