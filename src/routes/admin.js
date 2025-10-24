const express = require('express');
const router = express.Router();

// Admin-only routes
router.get('/users', (_req, _res) => {});             // list all users
router.get('/qrcodes', (_req, _res) => {});           // list all QR codes
router.delete('/users/:id', (_req, _res) => {});      // delete user account
router.delete('/qrcodes/:id', (_req, _res) => {});    // delete QR code
router.get('/stats', (_req, _res) => {});             // view global statistics

module.exports = router;
