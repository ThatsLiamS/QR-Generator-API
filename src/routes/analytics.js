const express = require('express');
const router = express.Router();

// --- Public Routes ---
router.post('/track', (_req, _res) => {});       // record scan event

// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

router.get('/qrcodes', (_req, _res) => {});      // overall QR code stats for logged-in user
router.get('/qrcodes/:id', (_req, _res) => {});  // stats for a single QR code (owned by user)
router.get('/users/:id', (_req, _res) => {});    // analytics for a specific user (the logged-in user)

// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
