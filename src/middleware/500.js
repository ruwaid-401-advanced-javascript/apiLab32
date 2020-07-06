'use strict';

/**
 * (Middleware) set the response status to 500 and send an error 
 * @module 500
 */

/**
* Input 
* @function errorHandler
* @param req - request
* @param res  - response
* @param next - next
*/

function errorHandler(err, req, res, next) {
  res.status(500);
  res.json({
    err: err,
    status: '500',
  });
}

module.exports = errorHandler;
