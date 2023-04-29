const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerForm = (req, res) => {
    res.render("register");
}

const registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect("/auth/register")
    }

    const { userName, email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            throw new Error("usuario existente")
        }

        user = new User({ userName, email, password, tokenConfirm: nanoid() })
        await user.save();

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.userEmail,
                pass: process.env.passEmail
            },
        });

        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: user.email,
            subject: "verifique cuenta de correo",
            html: `<a href="${process.env.PATHHERENDER || "http://localhost:5000"}/confirmar/${user.tokenConfirm}">verificar cuenta aquí</a>`,
        });


        req.flash("mensajes", [{ msg: "Se ha enviado un correo al email registrado para verificar su cuenta" }])
        res.redirect("login");

    } catch (error) {
        // res.json({ error: error.message })
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/auth/register")
    }

}


const confirmarCuenta = async (req, res) => {

    const { token } = req.params;

    try {

        const user = await User.findOne({ tokenConfirm: token });
        if (!user) throw new Error("No existe el usuario")

        user.confirmedAccount = true;
        user.tokenConfirm = null;

        await user.save();

        // enviar correo electronico a usuario al confirmar cuenta
        req.flash("mensajes", [{ msg: "Cuenta verificada, Bienvenido:" }])
        res.redirect("/auth/login");
    } catch (error) {
        // res.json({ error: error.message });
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/auth/login")
    }

}


const loginForm = (req, res) => {
    res.render("login");
}

const loginUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect("/auth/login")
    }

    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("Este correo no esta registrado");
        }
        if (!user.confirmedAccount) {
            throw new Error("Cuenta no verificada, revise su correo electronico y confirme su registro");
        }

        if (!await user.comparePassword(password)) {
            throw new Error("contraseña incorrecta");
        }

        // Creando la sesion de usuario por passport
        req.login(user, function (error) {
            if (error) {
                throw new Error("Error al crear la sesion")
            }
            res.redirect("/")
        })


    } catch (error) {
        // console.log(error);
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/auth/login")
        // res.send(error.message);
    }
}

const cerrarSesion = function (req, res) {
    req.logout();
    res.redirect("/auth/login")
}


module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion
}