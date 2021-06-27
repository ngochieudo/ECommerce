const mongoose = require("../lib").mongoose;
const productSchema = new mongoose.Schema({
    image: String,
    price: String,
    name: String
});
module.exports = mongoose.model("Product", productSchema)
