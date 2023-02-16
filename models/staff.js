const mongoose = require('mongoose')
const Schema = mongoose.Schema

const staffSchema = new Schema({
    name:  { type: String, required:true, trim:true },
    photo: { type: String, default:'nopic.png' },
    salary: { type: Number, required:true, trim:true},
    tel:  {type: String, required:true, trim:true},
    branch: {type: Schema.Types.ObjectId, ref: 'branch'}
  },{
    toJSON: {virtuals: true},
    timestamps:true,
    collection:"staffs" 
});


const staff = mongoose.model("Staff",staffSchema)

module.exports = staff