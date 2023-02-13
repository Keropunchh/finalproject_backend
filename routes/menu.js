var express = require('express');
var router = express.Router();
const menuController = require('../controllers/menuController')
const { body } = require('express-validator')
const passportJWT = require("../middleware/passportJWT")


router.get("/",menuController.index );

router.get("/:id",menuController.show );

router.post("/",[passportJWT.isLogin,
    body('name').not().isEmpty().withMessage("กรุณาป้อนชื่อเมนู"),
    body('price').not().isEmpty().withMessage("กรุณาป้อนราคา")
],menuController.insert );

router.delete("/:id",[passportJWT.isLogin],menuController.destroy);

router.put("/:id",[passportJWT.isLogin],menuController.update);

module.exports = router;