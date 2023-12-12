const Router = require("express");
const router = new Router();

router.post("/user");
router.get("/user", (req, res) => {
  //res.json({ message: "ALL WORKING" });
});

module.exports = router;
