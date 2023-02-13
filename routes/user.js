var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkAdmin = require('../middleware/checkAdmin')

router.post('/',[
    passportJWT.isLogin,checkAdmin.isAdmin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป"),
    body('role').not().isEmpty().withMessage("กรุณาป้อนตำแหน่งด้วย")
],userController.register)

router.post('/login',[
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.login );

router.get('/profile',[passportJWT.isLogin],userController.profile)

module.exports = router;
