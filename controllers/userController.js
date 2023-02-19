const User = require("../models/user");
const { validationResult } = require('express-validator')
const jwt = require("jsonwebtoken");
const config = require('../config/index');

exports.register = async(req,res,next) => {
  try{
    const { name, email, password, role} = req.body
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error("ข้อมูลที่ได้รับไม่ถูกต้อง")
      error.statusCode = 422;   
      error.validation = errors.array()
      throw error;
    }

    const existEmail = await User.findOne({ email:email })
    if(existEmail){
      const error= new Error("อีเมลนี้มีผู้ใช้งานในระบบแล้ว")
      error.statusCode = 400
      throw error;
    }
    
    let user = new User();
    user.name = name
    user.email = email
    user.password = await user.encryptPassword(password)
    user.role = role;
  
    await user.save();
    
    res.status(201).json({
      message:"ลงทะเบียนเรียบร้อยแล้ว"
    })
  }catch (error){
    next(error)
 }
};

exports.login = async(req,res,next) => {
  try{
    const {email, password} = req.body

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error("ข้อมูลที่ได้รับไม่ถูกต้อง")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    // check email isExist
    const user = await User.findOne({ email:email })
    if(!user){
      const error= new Error("ไม่พบผู้ใช้งาน")
      error.statusCode = 404
      throw error;
    }

    // check password
    const isValid = await user.checkPassword(password)
    if(!isValid){
      const error= new Error("รหัสผ่านไม่ถูกต้อง")
      error.statusCode = 401
      throw error;
    }

    //create token
    const token = await jwt.sign({
      id:user._id,
      role: user.role,
    },config.JWT_KEY,{ expiresIn: "5 days"})

    const expires_in = jwt.decode(token)

    res.status(201).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer'
    })
   }catch (error){
    next(error)
 }
};

exports.index = async(req,res,next) => {
  const role = "admin";
  const user = await User.findOne({
    role: role,
  });

  res.status(200).json({
    data: user,
  });
};

exports.profile = async(req,res,next) => {
  res.status(200).json({
    user: req.user
  })
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role} = req.body;

    const existEmail = await User.findOne({ email:email })
    if(existEmail){
      const error= new Error("อีเมลนี้มีผู้ใช้งานในระบบแล้ว")
      error.statusCode = 400
      throw error;
    }

    let user1 = new User();
    let enpassword = await user1.encryptPassword(password);

    const user = await User.updateOne(
      { _id: id },
      {
        name: name,
        email: email,
        password: enpassword,
        role: role
      }
    );
    res.status(200).json({
      message: "เพิ่มข้อมูลเรียบร้อย",
    });
  } catch (error) {
    error = new Error("เกิดข้อผิดพลาด: " + error.message)
    error.statusCode = 402
    next(error)
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.deleteOne({
      _id: id,
    });

    if (user.deletedCount === 0) {
      const error= new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบข้อมูล")
      error.statusCode = 401
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อย",
      });
    }
  } catch (error) {
    next(error)
  }
};

