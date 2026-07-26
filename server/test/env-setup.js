// Imported first by the test suite, because ES module imports are hoisted and evaluated in order:
// assigning process.env at the top of smoke.test.js would run *after* server.js had already been
// evaluated, so the app would bind a real port and dial a real database.
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.PORT = '0';
