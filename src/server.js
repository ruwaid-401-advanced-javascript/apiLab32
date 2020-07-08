'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const error404 = require('./middleware/404');
const error500 = require('./middleware/500');
const schema = require('../model.js');
const usersSchema = require('../userModel');
const basicAuth = require('./middleware/basic')
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.status(200).send('hiii  401'));



app.route('/todo')
  .get(async (req, res) => {
    let record = await schema.find({});
    res.json(record);
  })
  .post(async (req, res) => {
    try {
      let record = new schema(req.body);
      let save = await record.save();
      res.json(save);
    } catch (e) {
      console.log(e.message);
    }
  })
  .put(async (req, res) => {
    let _id = req.body;
    let record = await schema.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(record);
  })
  .delete(async (req, res) => {
    let _id = req.body._id
    let record = await schema.findByIdAndDelete(req.body._id);
    res.json(record);
  });


app.put('/todo/:id', async (req, res) => {
  let _id = req.params.id;
  let record = await schema.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  res.json(record);
})
app.delete('/todo/:id', async (req, res) => {
  let _id = req.params.id;
  let record = await schema.findByIdAndDelete({ _id });
  res.json(record);
});






app.post('/signup', async (req, res, next) => {
  try {

    let users = new usersSchema(req.body);
    let result = await users.save();
    let token = usersSchema.generateToken(result);
    res.status(200).send({ result, token });
  } catch (e) {
    next('error username is duplicated');
  }
});

app.post('/signin', basicAuth, (req, res) => {

  // let token = req.token;
  let token = usersSchema.generateToken(req.data);
  res.cookie('token', token);

  let roles = {
    user: ['read'],
    writers: ['read', 'create'],
    editors: ['read', 'update', 'create'],
    admin: ['read', 'update', 'create', 'delete'],
  };
  let note1 = 'THIS is a note for you guys ---> users roles have these capabilities';
  let note2 = `user: ['read']`
  let note3 = `writers: ['read', 'create']`
  let note4 = `editors: ['read', 'update', 'create']`
  let note5 = `admin: ['read', 'update', 'create', 'delete']`

  res.status(200).json({ note1, note2, note3, note4, note5, 'token': token, 'user': req.data, capabilities: roles[req.data.role] });
});

app.get('/users', async (req, res) => {

  let users = await usersSchema.findAll();
  res.status(200).json({ users });
});


app.use(error404);
app.use(error500);

module.exports = {
  server: app,
  start: (portNumber) => app.listen(portNumber, () => console.log(`Listnening to PORT ${portNumber}`)),
};