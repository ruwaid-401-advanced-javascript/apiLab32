'use strict';

/**
 * (Middleware) set the response status to 404 and send an error 
 * @module 404
 */

/**
* Input 
* @function notFoundHandler
* @param req - request
* @param res  - response
* @param next - next
*/
function notFoundHandler(req, res, next) {
  res.status(404);
  res.send({
    err: 'not found',
    status: '404',
  });
}

module.exports = notFoundHandler;
