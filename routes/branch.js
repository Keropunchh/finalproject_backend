var express = require('express');
var router = express.Router();
const branchController = require('../controllers/branchController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkAdmin = require('../middleware/checkAdmin')

router.post("/",[
    passportJWT.isLogin,checkAdmin.isAdmin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อบริษัทด้วย"),
    body('location.lat').not().isEmpty().withMessage("กรุณาป้อนพิกัดด้วย").isDecimal().withMessage("รูปแบบพิกัดไม่ถูกต้อง"),
    body('location.lgn').not().isEmpty().withMessage("กรุณาป้อนพิกัดด้วย").isDecimal().withMessage("รูปแบบพิกัดไม่ถูกต้อง")
],branchController.insert );

router.post("/staff",[
    passportJWT.isLogin,checkAdmin.isAdmin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อพนักงานด้วย"),
    body('salary').not().isEmpty().withMessage("กรุณาป้อนเงินเดือนด้วย").isInt().withMessage("รูปแบบเงินเดือนไม่ถูกต้อง"),
    body('tel').not().isEmpty().withMessage("กรุณาป้อนเบอร์ติดต่อด้วย").isLength({ min: 10 , max: 10}).withMessage("รูปแบบเบอร์โทรไม่ถูกต้อง"),
    body('branch').not().isEmpty().withMessage("กรุณาป้อนสาขาด้วย")
],branchController.insertstaff );

router.get("/",branchController.index );

router.get("/staff",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.staff );

router.get("/:id",branchController.show );

router.get("/staff/:id",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.showstaff );

router.put("/:id",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.update);

router.put("/staff/:id",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.updatestaff);

router.delete("/:id",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.destroy);

router.delete("/staff/:id",[passportJWT.isLogin,checkAdmin.isAdmin],branchController.destroystaff);

module.exports = router;