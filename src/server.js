'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const error404 = require('./middleware/404');
const error500 = require('./middleware/500');
const schema = require('../model.js');


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


  app.put('/todo/:id',async (req, res) => {
    let _id = req.params.id;
    let record = await schema.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(record);
  })
  app.delete('/todo/:id',async (req, res) => {
    let _id = req.params.id;
    let record = await schema.findByIdAndDelete({_id});
    res.json(record);
  });



app.use(error404);
app.use(error500);

module.exports = {
  server: app,
  start:  (portNumber) => app.listen(portNumber, () => console.log(`Listnening to PORT ${portNumber}`)),
};