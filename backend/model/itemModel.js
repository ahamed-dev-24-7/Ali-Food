import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
    shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    category: {
        type: String,
        enum: [
            "Snacks",
            "Burger",
            "Pasta",
            "Pizza",
            "Sandwich",
             "Chicken",
            "Rolls & Wraps",
            "Fried Rice & Noodles",
            "Biryani",
            "Momos",
            "Desserts",
            "Others"
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    foodtype:{
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true
    },
    rating: {
      average: {type: Number, default: 0},
      count: {type: Number, default: 0}
    }
}, {timestamps: true})


const Item = mongoose.model("Item", itemSchema);
export default Item;