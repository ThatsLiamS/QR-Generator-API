const express = require('express');
const router = express.Router();

// Analytics routes
router.get('/qrcodes', (_req, _res) => {});           // overall QR code stats
router.get('/qrcodes/:id', (_req, _res) => {});       // stats for a single QR code
router.get('/users/:id', (_req, _res) => {});         // analytics for a specific user
router.post('/track', (_req, _res) => {});            // record scan event

module.exports = router;
