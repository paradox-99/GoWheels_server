const express = require("express");
const { order, paymentSuccess, paymentFail } = require("../controllers/paymentControllers");
const router = express.Router();

router.post("/order", order);
router.post("/success/:tranId", paymentSuccess);
router.post("/fail/:tranId", paymentFail);



module.exports = router;
