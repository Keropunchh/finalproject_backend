var express = require('express');
var router = express.Router();
const menuController = require('../controllers/menuController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkRole = require('../middleware/checkRole')

router.post("/",[passportJWT.isLogin,checkRole.isLevel3,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อเมนู"),
    body('price').not().isEmpty().withMessage("กรุณาป้อนราคา")
],menuController.insert );

router.get("/",menuController.index );

router.get("/:id",menuController.show );

router.put("/:id",[passportJWT.isLogin,checkRole.isLevel3],menuController.update);

router.delete("/:id",[passportJWT.isLogin,checkRole.isLevel3],menuController.destroy);

module.exports = router;