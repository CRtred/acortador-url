
const express = require('express');
const { body } = require('express-validator');

const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, } = require('../controllers/authController');

const router = express.Router();

router.get("/register", registerForm);
router.post("/register", [

    body("userName", "ingrese un nombre valido").trim().notEmpty().escape(),
    body("email", "ingrese un correo valido").trim().isEmail().normalizeEmail(),
    body("password", "Contraseña de minimo 6 caracteres").trim().isLength({ min: 6 }).escape().custom((value, { req }) => {
        if (value !== req.body.rePassword) {
            throw new Error("Las contraseñas no coinciden")
        } else {

            return value;
        }
    }),

], registerUser);
router.get("/confirmar/:token", confirmarCuenta)
router.get("/login", loginForm);
router.post("/login", [
    body("email", "ingrese un correo valido").trim().isEmail().normalizeEmail(),
    body("password", "ingrese una contraseña").trim().isLength({ min: 6 }).escape()
], loginUser);
router.get("/logout", (req, res) => {
    req.logOut(req.user, err => {
        if (err) return next(err);
        res.redirect("/auth/login");
    })
});


module.exports = router;







