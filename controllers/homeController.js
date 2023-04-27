const Url = require("../models/Url");
const { nanoid } = require('nanoid');
const { findById } = require("../models/User");

const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render('home', { urls: urls });

    } catch (error) {
        // console.log(error);
        // res.send("Fallo algo");
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }

};

const agregarUrl = async (req, res) => {

    const { origin } = req.body;

    try {
        const url = new Url({ origin: origin, shortUrl: nanoid(8), user: req.user.id });
        await url.save();
        req.flash("mensajes", [{ msg: "Url agregada" }]);
        res.redirect("/");

    }
    catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");

    }
};

const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("no se puede eliminar url");
        }
        await url.deleteOne();

        req.flash("mensajes", [{ msg: "se eliminó url correctamente" }]);
        return res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        if (!url.user.equals(req.user.id)) {
            throw new Error("no existe esta url");
        }
        res.render("home", { url })



    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/")
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("no existe esta url");
        }

        await url.updateOne({ origin });
        req.flash("mensajes", [{ msg: "Url editada" }]);
        // await Url.findByIdAndUpdate(id, { origin: origin });
        res.redirect("/");

    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/")
    }
};

const redireccionamiento = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const urlDB = await Url.findOne({ shortUrl: shortUrl })
        res.redirect(urlDB.origin)

    } catch (error) {
        req.flash("mensajes", [{ msg: "Esta Url no existe" }])
        return res.redirect("/auth/login")
    }
};



module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento
};