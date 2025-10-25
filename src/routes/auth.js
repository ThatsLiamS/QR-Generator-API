const express = require('express');
const router = express.Router();

// --- Public Routes ---
router.post('/register', (_req, _res) => {});        // register a new user
router.post('/login', (_req, _res) => {});           // log in and get token
router.post('/forgot-password', (_req, _res) => {}); // request password reset email
router.post('/reset-password', (_req, _res) => {});  // reset password via token

// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

router.post('/logout', (_req, _res) => {});        // log out / invalidate session
router.post('/refresh', (_req, _res) => {});       // refresh JWT token
router.get('/me', (_req, _res) => {});             // get current user info

// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
