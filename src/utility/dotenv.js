const fs = require('fs');

/**
 * @group Utility
 * @summary Synchronously reads and parses a configuration file, loading its key-value pairs.
 * 
 * @param {String} filePath - The path to the configuration file to load (e.g., `.env`).
 * @returns {void} Nothing. This function modifies 'process.env' directly.
 * 
 * @author Liam Skinner <me@liamskinner.co.uk>
 */
const config = (filePath) => {

	try {
		const fileContent = fs.readFileSync(filePath, 'utf8');
		const lines = fileContent.split(/\r?\n/);

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) { continue; }

			const index = trimmed.indexOf('=');
			if (index === -1) { continue; }

			const key = trimmed.slice(0, index).trim();
			const value = trimmed.slice(index + 1).trim();

			const unquoted = value.replace(/^['"]|['"]$/g, '');

			// eslint-disable-next-line security/detect-object-injection
			process.env[key] = unquoted;
		}
	} catch (err) {
		console.error(`Critical Error: Failed to load config file at '${filePath}'.`, err);
		process.exit(1);
	}
};


module.exports = {
	config,
};
