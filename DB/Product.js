const mongoose =require('mongoose');

const productSchema= new mongoose.Schema(
    {
        name: String,
        price: String,
        category: String,
        brand: String
    }
);

module.exports = mongoose.model("products", productSchema);