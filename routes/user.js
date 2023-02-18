var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkRole = require('../middleware/checkRole')

router.post('/register/admin',[
    passportJWT.isLogin,checkRole.isLevel4,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.registeradmin)

router.post('/register/manager',[
    passportJWT.isLogin,checkRole.isLevel4,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.registermanager)

router.post('/register/staff',[
    passportJWT.isLogin,checkRole.isLevel3,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.registerstaff)

router.post('/register/member',[
    passportJWT.isLogin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.registermember)

router.post('/login',[
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.login );

router.get('/admin',[passportJWT.isLogin,checkRole.isLevel4],userController.admin)

router.get('/manager',[passportJWT.isLogin,checkRole.isLevel4],userController.manager)

router.get('/staff',[passportJWT.isLogin,checkRole.isLevel3],userController.staff)

router.get('/member',[passportJWT.isLogin],userController.member)

router.get('/profile',[passportJWT.isLogin],userController.profile)

router.put("/:id",[
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อสกุลด้วย"),
    body('email').not().isEmpty().withMessage("กรุณาป้อนอีเมลด้วย").isEmail().withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body('password').not().isEmpty().withMessage("กรุณากรอกรหัสผ่านด้วย").isLength({ min: 5 }).withMessage("รหัสผ่านต้อง 5 ตัวอักษรขึ้นไป")
],userController.update);

router.delete("/:id",userController.destroy);

module.exports = router;

//delete update ขอแค่รู้ id ซึ่งการที่จะรู้ id ของคนอื่นได้ต้องขอ
