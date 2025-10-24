const express = require('express');
const router = express.Router();

// QR Code routes
router.post('/', (_req, _res) => {});                 // generate a new QR code
router.get('/', (_req, _res) => {});                  // list all user's QR codes
router.get('/:id', (_req, _res) => {});               // get single QR code by ID
router.put('/:id', (_req, _res) => {});               // update QR metadata
router.delete('/:id', (_req, _res) => {});            // delete QR code
router.get('/:id/download', (_req, _res) => {});      // download QR code as image
router.post('/bulk', (_req, _res) => {});             // generate multiple QRs
router.post('/decode', (_req, _res) => {});           // decode QR image to text

module.exports = router;
