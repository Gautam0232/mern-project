const mongoose = require("mongoose");  // Import the mongoose model

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const Login = new mongoose.model("Login", employeeSchema);

module.exports = Login;