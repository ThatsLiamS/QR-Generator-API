const express = require('express');
const router = express.Router();


// --- Public Routes ---

/**
 * @route GET /system/health
 * @group System
 * @summary A simple health check endpoint to confirm the API is running.
 * @access Public
 * 
 * @returns {Object} 200 - An object with a 'status' property
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/health', (_req, res, next) => {
	try {
		return res.status(200).json({
			status: 'ok',
		});
	} catch {
		return next({ statusCode: 500, name: 'ServiceUnavailableError', message: 'Failed to process the health request.' });
	}
});

/**
 * @route GET /system/status
 * @group System
 * @summary Provides detailed system and environment status
 * @access Public
 * 
 * @returns {Object} 200 - An object with detailed status properties
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/status', (_req, res, next) => {
	try {
		return res.status(200).json({
			status: 'ok',
			environment: (process.env.isProduction === 'true') ? 'production' : 'development',
			uptime: process.uptime(),
			nodeVersion: process.version,
			pid: process.pid,
			platform: process.platform,
			memoryUsage: process.memoryUsage(),
			timestamp: new Date().toISOString(),
		});
	} catch {
		return next({ statusCode: 500, name: 'ServiceUnavailableError', message: 'Failed to process the status request.' });
	}
});

/**
 * @route GET /system/config
 * @group System
 * @summary Provides public-facing configuration for the client
 * @access Public
 * 
 * @returns {Object} 200 - An object with public-facing configurations
 * @returns {Error} 500 - An unexpected internal server error
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
router.get('/config', (_req, res, next) => {
	try {
		return res.status(200).json({
			appName: 'QR Code Generator',
			validationRules: {
				maxQrCodesPerUser: 5,
				maxLabelLength: 50,
				maxTextContentLength: 1024,
				maxUploadSizeMB: 5,
				allowedFileTypes: ['png', 'jpg', 'jpeg'],
			},
			links: {
				privacyPolicy: '/privacy-policy',
				termsOfService: '/terms',
				helpCenter: '/help',
				github: 'https://github.com/ThatsLiamS/QR-Generator-API',
			},
		});
	} catch {
		return next({ statusCode: 500, name: 'ServiceUnavailableError', message: 'Failed to process the config request.' });
	}
});


// --- Auth Protected Routes ---
router.use(require('./../middleware/checkAuth'));


// --- Admin Protected Routes ---
router.use(require('./../middleware/checkAdmin'));


module.exports = router;
