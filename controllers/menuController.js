const Menu = require("../models/menu");
const { validationResult } = require('express-validator')
const config = require("../config/index");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

exports.index = async (req, res, next) => {
  const menu = await Menu.find()
    .select("name photo price")
    .sort({ _id: -1 });

  const menuWithPhotoDomain = menu.map((menu, index) => {
    return {
      id: menu._id,
      name: menu.name,
      photo: config.DOMAIN + "images/" + menu.photo,
      price: menu.price,
    };
  });

  res.status(200).json({
    data: menuWithPhotoDomain,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.find({
      _id: id,
    });

    const menuWithPhotoDomain = menu.map((menu, index) => {
      return {
        id: menu._id,
        name: menu.name,
        photo: config.DOMAIN + "images/" + menu.photo,
        price: menu.price,
      };
    });

    if (!menu) {
      const error = new Error("ไม่พบเมนู")
      error.statusCode = 400
      throw error;
    } else {
      res.status(200).json({
        data: menuWithPhotoDomain,
      });
    }
  } catch (error) {
    next(error)
  }
};

exports.insert = async (req, res, next) => {
  try{
    const { name, photo ,price } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error("ข้อมูลที่ได้รับไม่ถูกต้อง")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }


    let menu = new Menu({
      name: name,
      photo: await saveImageToDisk(photo),
      price: price,
    });
    await menu.save();

    res.status(200).json({
      message: "เพิ่มข้อมูลเรียบร้อย",
    });
  }catch (error){
    next(error)
}
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const menu1 = await Menu.findOne({
      _id: id,
    });
    var pic = menu1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)

    const menu = await Menu.deleteOne({
      _id: id,
    });

    if (menu.deletedCount === 0) {
      const error= new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบเมนู")
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

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, photo , price } = req.body;
    const menu1 = await Menu.findOne({
      _id: id,
    });
    var pic = menu1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)

    const menu = await Menu.updateOne(
      { _id: id },
      {
        name: name,
        photo: await saveImageToDisk(photo),
        price: price,
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

async function saveImageToDisk(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");
  //โฟลเดอร์และ path ของการอัปโหลด
  const uploadPath = `${projectPath}/public/images/`;

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  //เขียนไฟล์ไปไว้ที่ path
  await writeFileAsync(uploadPath + filename, image.data, "base64");
  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
};

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
};
