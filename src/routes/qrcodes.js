const express = require('express');
const router = express.Router();

// --- Public Routes ---

// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

router.post('/', (_req, _res) => {});            // generate a new QR code (for logged-in user)
router.get('/', (_req, _res) => {});             // list all user's QR codes
router.get('/:id', (_req, _res) => {});          // get single QR code by ID (owned by user)
router.put('/:id', (_req, _res) => {});          // update QR metadata (owned by user)
router.delete('/:id', (_req, _res) => {});       // delete QR code (owned by user)
router.get('/:id/download', (_req, _res) => {}); // download QR code as image (owned by user)
router.post('/bulk', (_req, _res) => {});        // generate multiple QRs (for logged-in user)
router.post('/decode', (_req, _res) => {});      // decode QR image to text (utility for logged-in user)

// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
