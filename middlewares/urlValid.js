const { URL } = require("url");

const urlValid = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null") {
            if (
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next();
            }

        }

        throw new Error("tiene que contener https://");

    } catch (error) {
        // return res.send("url no valida");
        if (error.message === "Invalid URL") {
            req.flash("mensajes", [{ msg: "Url no valida" }])
        } else {
            req.flash("mensajes", [{ msg: error.message }])
        }
        return res.redirect("/")
    }




}

module.exports = urlValid;