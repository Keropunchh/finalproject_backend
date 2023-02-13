const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name:  { type: String, required:true },
    photo: { type: String, default:'nopic.png' },
    price: { type: Number, required:true},
  },{collection:"menus"});

  const menu = mongoose.model("menu",menuSchema)

  module.exports = menu;