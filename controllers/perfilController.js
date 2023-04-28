const formidable = require("formidable");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

module.exports.formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.render("perfil", { user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash("mensajes", [{ msg: "Error al leer usuario" }])
        return res.redirect("/perfil");
    }



};

module.exports.editarFotoPerfil = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.maxFileSize = 50 * 1024 * 1024; //50mb

    form.parse(req, async (err, fields, files) => {
        if (err) {
            req.flash("mensajes", [{ msg: "falló formidable" }]);
            return res.redirect("/perfil");

        }

        const file = files.myFile;
        try {
            // console.log(files);


            if (file.originalFilename === "") {
                throw new Error("Agregue un imagen porfavor")
            }

            const imageTypes = ["image/jpeg", "image/png"];

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error("Agrega un imagen de tipo .jpg o .png")
            }
            if (file.size > 50 * 1024 * 1024) {
                throw new Error("La imagen no debe ser mayor a 5MB")
            }

            const extension = file.mimetype.split("/")[1];
            const dirFile = path.join(__dirname, `../public/uploads/${req.user.id}.${extension}`);

            fs.copyFile(file.filepath, dirFile, function (err) {
                if (err) throw new Error("no se pudo copiar");
                return

            });


            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;

            const image = await Jimp.read(dirFile);
            image.resize(200, 200).quality(90).writeAsync(dirFile);

            await user.save();




            req.flash("mensajes", [{ msg: "Imagen cargada" }]);


        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }])

        }
        finally {
            return res.redirect("/perfil");
        }

    })
};
