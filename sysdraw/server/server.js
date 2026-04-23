/**
 * SysDraw - Main Server Entry Point
 * Starts the Express application on the configured port
 */
const app = require('./app');

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 SysDraw Server running on http://localhost:${PORT}`);
});
