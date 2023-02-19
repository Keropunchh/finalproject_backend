var express = require('express');
var router = express.Router();
const menuController = require('../controllers/menuController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")
const checkAdmin = require('../middleware/checkAdmin')

router.post("/",[passportJWT.isLogin,checkAdmin.isAdmin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อเมนู"),
    body('price').not().isEmpty().withMessage("กรุณาป้อนราคา")
],menuController.insert );

router.get("/",menuController.index );

router.get("/:id",menuController.show );

router.put("/:id",[passportJWT.isLogin,checkAdmin.isAdmin],menuController.update);

router.delete("/:id",[passportJWT.isLogin,checkAdmin.isAdmin],menuController.destroy);

module.exports = router;