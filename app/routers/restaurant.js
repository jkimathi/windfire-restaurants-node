// ############################
// ###### Services setup ######
// ############################
var restaurantService = require('../services/restaurantService');

module.exports = function(app, checkJwt, logger) {
    // #############################
    // ###### HTTP GET method ######
    // #############################
    app.get('/restaurants', checkJwt, function (httpRequest, httpResponse) {
        logger.info("GET /restaurants endpoint called");
        logger.info("Calling restaurantService.getRestaurants() ...");
        restaurantService.getRestaurants(function(response, error) {
            if (error) {
                logger.error("Error type = " + error.name);
                var err = {error:'Database connection error'};
                httpResponse.json(err);
            } else {
                logger.info("GET /restaurants response : " + response);
                httpResponse.json(response);
            }
        });
    });
    // ##############################
    // ###### HTTP POST method ######
    // ##############################
    app.post('/restaurants', checkJwt, function (httpRequest, httpResponse) {
        logger.info("POST /restaurants endpoint called");
        logger.info("Calling restaurantService.addRestaurant() ...");
        restaurantService.addRestaurant(httpRequest.body, function(response, error) {
            if (error) {
                logger.error("Error type = " + error.name);
                var err = {error:'Database connection error'};
                httpResponse.json(err);
            } else {
                logger.info("POST /restaurants response : " + response);
                httpResponse.json(response);
            }
        });
    });
    // ################################
    // ###### HTTP DELETE method ######
    // ################################
    app.delete('/restaurants/:id', checkJwt, function (httpRequest, httpResponse) {
        logger.info("DELETE /restaurants endpoint called");
        logger.info("Calling restaurantService.deleteRestaurant() ...");
        restaurantService.deleteRestaurant(httpRequest.params.id, function(response, error) {
            if (error) {
                logger.error("Error type = " + error.name);
                var err = {error:'Database connection error'};
                httpResponse.json(err);
            } else {
                logger.info("DELETE /restaurants response : " + response);
                httpResponse.json(response);
            }
        });
    });
};