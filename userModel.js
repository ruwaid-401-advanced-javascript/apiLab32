'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
});

Users.pre('save', async function () {
  // console.log('oooooo');

  this.password = await bcrypt.hash(this.password, 5);
  // console.log(this.password,'pppppppppp');
  // return;
});


/**
 * @method athenticateRole
 * @param {string} user
 * @param {string} capability
 */

Users.statics.athenticateRole = function (user, capability) {
  let roles = {
    user: ['read'],
    writers: ['read', 'create'],
    editors: ['read', 'update', 'create'],
    admin: ['read', 'update', 'create', 'delete'],
  };
  return !!roles[user.capabilities].includes(capability);
};

/**
 * @method authenticate
 * @param {string} username
 * @param {string} password
 */
Users.statics.authenticate = function (username, pass) {
  console.log(username, pass, 'ttttttttttttttttttttt');

  return this.find({ username })
    .then(async (user) => {
      console.log(user, 'uuuuuuuuuuuuuuuuuuuuuuuuuuu');
      console.log(await bcrypt.compare(pass, user[0].password));
      if (await bcrypt.compare(pass, user[0].password)) {
        return user[0];
      }
      return null;
      // return bcrypt.compare(pass, user[0].password) ? null : null;
    });
};

/**
 * @method generateToken
 * @param {object} user
 * @returns {string} token
 */
Users.statics.generateToken = function (user) {
  let expire = process.env.EXPIRE;
  return jwt.sign({
    id: user.id,
    capabilities: user.role,
  }, process.env.SECRET, { expiresIn: expire });
};

/**
 * @method findAll
 * find all saved users in DB
 */
Users.statics.findAll = function () {
  return this.find({});
};

/**
 * @method findOneByUser
 * @param {string} username
 */
Users.statics.findOneByUser = function (username) {
  return this.find({ username });
};

/**
 * @method verifyToken
 * @param {string} token
 */
Users.statics.verifyToken = async function (token) {
  return jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      return Promise.reject(err);
    }
    if (decoded.id && decoded.capabilities) {
      return Promise.resolve(decoded);
    } else {
      return Promise.reject();
    }
  });
};

module.exports = mongoose.model('Users', Users);