const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8085;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(MONGO_URL).then(()=>console.log('mongo connected')).catch(e=>console.error('mongo error', e.message));

const Notification = mongoose.model('Notification', new mongoose.Schema({
  userId: Number,
  message: String,
  createdAt: { type: Date, default: Date.now }
}));

app.get('/health', (req,res)=>res.json({ok:true, service:'notification-service'}));

app.post('/', async (req,res)=>{
  const n = await Notification.create(req.body);
  res.status(201).json(n);
});

app.get('/', async (req,res)=>{
  const list = await Notification.find().sort({createdAt: -1}).limit(50);
  res.json(list);
});

app.listen(PORT, ()=>console.log('notification-service on', PORT));
