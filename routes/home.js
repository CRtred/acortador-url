const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento } = require('../controllers/homeController');
const urlValid = require('../middlewares/urlValid');
const userVerify = require('../middlewares/userVerify');
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController');
const router = express.Router();


router.get("/", userVerify, leerUrls);
router.post("/", userVerify, urlValid, agregarUrl);
router.get("/eliminar/:id", userVerify, eliminarUrl);
router.get("/editar/:id", userVerify, editarUrlForm);
router.post("/editar/:id", userVerify, urlValid, editarUrl);
router.get("/perfil", userVerify, formPerfil);
router.post("/perfil", userVerify, editarFotoPerfil);
router.get("/:shortUrl", redireccionamiento);

module.exports = router;