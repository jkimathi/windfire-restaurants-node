// Add required modules
var express = require('express');
var cors = require('cors');
var connectTimeout = require('connect-timeout');
var logger = require('./utils/logger');
// Variable declaration
const configuration = require('./utils/configuration');
const timeout = process.env.TIMEOUT || configuration.getProperty('timeout');
// Initialize application
var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(process.cwd() + '/public'));
app.use(errorHandler);
//app.use(connectTimeout(timeout));
//app.use(haltOnTimedout);
// Variables section
var PORT = process.env.EXPOSED_PORT || 8082;
// #######################################
// ###### Auth0 Authorization setup ######
// #######################################
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
// Authorization middleware. 
// When used, the Access Token must exist and
// be verified against the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://robipozzi.eu.auth0.com/.well-known/jwks.json`
  }),
  // Validate the audience and the issuer.
  audience: 'windfire-restaurants',
  issuer: `https://robipozzi.eu.auth0.com/`,
  algorithms: ['RS256']
});
// Routers setup
require("./routers/health")(app, logger);
require("./routers/restaurant")(app, checkJwt, logger);
// Run server
app.listen(PORT, function() {
	logger.info("Current working directory = " + process.cwd());
	logger.info("Application is listening on port " + PORT);
});
// ############ Common Functions
process.on('uncaughtException', error => {
	logger.error('There was an uncaught error : ', error);
	//process.exit(1) //mandatory (as per the Node.js docs)
})
// Halt timeout
function haltOnTimedout(req, res, next){
	if (!req.timedout) {
		next();
	}
}
// Error Handling
function errorHandler (err, req, res, next) {
	logger.error("errorHandler - " + err);
	if (res.headersSent) {
	  return next(err)
	}
	res.status(500);
	//res.render('error.html', { error: err });
	res.sendFile('error.html', {root : process.cwd() + '/public'});
}