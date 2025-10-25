const express = require('express');
const router = express.Router();

// --- Public Routes ---

// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

router.get('/:id', (_req, _res) => {});          // get user profile by ID (must be own profile)
router.put('/:id', (_req, _res) => {});          // update user profile (must be own profile)
router.delete('/:id', (_req, _res) => {});       // delete user account (must be own account)
router.get('/:id/qrcodes', (_req, _res) => {});  // list user's QR codes (must be own codes)
router.post('/avatar', (_req, _res) => {});      // upload/update avatar (for logged-in user)

// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
