var express = require('express');
var router = express.Router();
const branchController = require('../controllers/branchController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkAdmin = require('../middleware/checkAdmin')

/* GET users listing. */
router.get("/",branchController.index );
router.get("/staff",branchController.staff );
router.get("/:id",branchController.show );
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

module.exports = router;