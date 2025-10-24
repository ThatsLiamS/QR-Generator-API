const express = require('express');
const router = express.Router();

// User profile & management routes
router.get('/:id', (_req, _res) => {});               // get user profile by ID
router.put('/:id', (_req, _res) => {});               // update user profile
router.delete('/:id', (_req, _res) => {});            // delete user account
router.get('/:id/qrcodes', (_req, _res) => {});       // list user's QR codes
router.post('/avatar', (_req, _res) => {});           // upload/update avatar

module.exports = router;
