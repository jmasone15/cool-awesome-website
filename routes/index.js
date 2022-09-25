const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.get("/id", (req, res) => {
    res.json(
        {   
            id: req.session.id,
            cookie: req.session.cookie
        }
    )
});

module.exports = router;