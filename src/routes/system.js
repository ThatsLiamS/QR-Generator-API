const express = require('express');
const router = express.Router();

// --- Public Routes ---
router.get('/health', (_req, _res) => {});       // health check endpoint
router.get('/status', (_req, _res) => {});       // API/system status info
router.get('/docs', (_req, _res) => {});         // serve API docs (Swagger)
router.get('/config', (_req, _res) => {});       // get public config options

// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));

// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
