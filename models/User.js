const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const { Schema } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        require: true,

    },
    email: {
        type: String,
        lowercase: true,
        require: true,
        unique: true,
        index: { unique: true }
    },
    password: {
        type: String,
        require: true,

    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    confirmedAccount: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt)

        user.password = hash;
        next();
    } catch (error) {
        // validar si hay fallo en la encriptacion de contrasena
        console.log(error);
        throw new Error("Error al codificar contraseña")
    }




})


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema);