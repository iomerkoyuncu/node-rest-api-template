const express = require("express")
const router = express.Router()

const {
  getQuotes,
  getQuote,
} = require("../controllers/quoteController")

router.get("/", getQuotes)
router.get("/:id", getQuote)


module.exports = router

