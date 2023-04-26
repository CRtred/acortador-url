const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    const urls = [
        { origin: "www.google.com/tred1", shortURL: "googletred1" },
        { origin: "www.google.com/tred2", shortURL: "googletred2" },
        { origin: "www.google.com/tred3", shortURL: "googletred3" },
        { origin: "www.google.com/tred4", shortURL: "googletred4" },
    ]
    res.render('home', { urls: urls });
})

module.exports = router;