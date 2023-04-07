const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
const getQuotes = asyncHandler(async (req, res) => {
  const quotes = await pool.query('SELECT * FROM quotes ORDER BY id ASC');
  res.status(200).json(quotes.rows);
});

// @desc    Get a quote
// @route   GET /api/quotes/:id
// @access  Public
const getQuote = asyncHandler(async (req, res) => {
  const quote = await pool.query('SELECT * FROM quotes WHERE id = $1', [
    req.params.id,
  ]);
  if (quote.rows.length === 0) {
    res.status(404);
    throw new Error('Quote not found');
  }
  res.status(200).json(quote.rows[0]);
});

// @desc    Create a quote
// @route   POST /api/quotes
// @access  Private
const createQuote = asyncHandler(async (req, res) => {
  const { quote } = req.body;
  const newQuote = await pool.query(
    'INSERT INTO quotes (quote) VALUES ($1) RETURNING *',
    [quote]
  );
  res.status(201).json(newQuote.rows[0]);
});


module.exports = {
  getQuotes,
  getQuote,
  createQuote,
}
