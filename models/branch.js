const mongoose = require('mongoose')
const Schema = mongoose.Schema

const branchSchema = new Schema({
    name:  { type: String, required:true,trim:true },
    photo: { type: String, default: 'nopic.png' },
    location: {
        lat: Number,
        lgn: Number
    },
  },{
    toJSON: {virtuals: true},
    timestamps:true,
    collection:"branchs" });

branchSchema.virtual('staffs',{
  ref:'Staff',
  localField:'_id',
  foreignField:'branch'
})
const branch = mongoose.model("Branch",branchSchema)

module.exports = branch