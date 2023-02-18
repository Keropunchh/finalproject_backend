const Branch = require("../models/branch");
const Staff = require("../models/staff");
const { validationResult } = require('express-validator')
const config = require("../config/index");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

exports.insert = async (req, res, next) => {
  try{
    const { name, location, photo } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      const error = new Error("ข้อมูลที่ได้รับไม่ถูกต้อง")
      error.statusCode = 422;
      error.validation = errors.array()
      throw error;
    }

    let branch = new Branch({
      name: name,
      location: location,
      photo: await saveImageToDisk(photo)
    });
    await branch.save();

    res.status(200).json({
      message: "เพิ่มข้อมูลเรียบร้อย",
    });
  }catch (error){
    next(error)
}};

exports.insertstaff = async (req, res, next) => {
    try{
      const { name, salary, tel , photo , branch } = req.body;
  
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        const error = new Error("ข้อมูลที่ได้รับไม่ถูกต้อง")
        error.statusCode = 422;
        error.validation = errors.array()
        throw error;
      }
  
      let staff = new Staff({
        name: name,
        salary: salary,
        tel: tel,
        branch: branch,
        photo: await saveImageToDisk(photo)
      });
      await staff.save();
  
      res.status(200).json({
        message: "เพิ่มข้อมูลเรียบร้อย",
      });
    }catch (error){
      next(error)
}};

exports.index = async (req, res, next) => {
  const branch = await Branch.find()
    .select("name photo location")
    .sort({ _id: -1 });

  const branchWithPhotoDomain = branch.map((branch, index) => {
    return {
      id: branch._id,
      name: branch.name,
      photo: config.DOMAIN + "images/" + branch.photo,
      location: branch.location,
    };
  });

  res.status(200).json({
    data: branchWithPhotoDomain,
  });
};

exports.staff = async (req, res, next) => {
  const staff = await Staff.find().populate("branchs");
  const staffWithPhotoDomain = staff.map((staff, index) => {
    return {
      id: staff._id,
      name: staff.name,
      photo: config.DOMAIN + "images/" + staff.photo,
      salary: staff.salary,
      tel: staff.tel,
      branch: staff.branch
    };
  });
  res.status(200).json({
    data: staffWithPhotoDomain,
  });
};

exports.show = async (req, res, next) => {
  const { id } = req.params;
  const branch = await Branch.find({
    _id: id,
  }).populate("staffs");
  
  res.status(200).json({
    data: branch,
  });
};

exports.showstaff = async (req, res, next) => {
  const { id } = req.params;
  const staff = await Staff.find({
    _id: id,
  }).populate("branchs");
  const staffWithPhotoDomain = staff.map((staff, index) => {
    return {
      id: staff._id,
      name: staff.name,
      photo: config.DOMAIN + "images/" + staff.photo,
      salary: staff.salary,
      tel: staff.tel,
      branch: staff.branch
    };
  });
  res.status(200).json({
    data: staffWithPhotoDomain,
  });
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, photo } = req.body;
    const branch1 = await Branch.findOne({
      _id: id,
    });

    var pic = branch1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)

    const branch = await Branch.updateOne(
      { _id: id },
      {
        name: name,
        location: location,
        photo: await saveImageToDisk(photo),
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

exports.updatestaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, salary, tel , photo , branch } = req.body;
    const staff1 = await Staff.findOne({
      _id: id,
    });
    
    var pic = staff1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)
    
    const staff = await Staff.updateOne(
      { _id: id },
      {
        name: name,
        salary: salary,
        tel: tel,
        branch: branch,
        photo: await saveImageToDisk(photo)
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

    const branch1 = await Branch.findOne({
      _id: id,
    });

    var pic = branch1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)

    const branch = await Branch.deleteOne({
      _id: id,
    });

    if (branch.deletedCount === 0) {
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

exports.destroystaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff1 = await Staff.findOne({
      _id: id,
    });
    
    var pic = staff1.photo
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/images/`;
    fs.unlinkSync(uploadPath + pic)

    const staff = await Staff.deleteOne({
      _id: id,
    });

    if (staff.deletedCount === 0) {
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
