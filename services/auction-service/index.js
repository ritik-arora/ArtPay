const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8082;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req,res)=>res.json({ok:true, service:'auction-service'}));

function auth(req,res,next){
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ')?auth.slice(7):null;
  if(!token) return res.status(401).json({error:'No token'});
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({error:'Unauthorized'}); }
}

app.get('/', async (req,res)=>{
  const { rows } = await pool.query('SELECT * FROM auctions ORDER BY id DESC');
  res.json(rows);
});

app.post('/', auth, async (req,res)=>{
  const { title, description, basePrice, endTime } = req.body;
  const q = `INSERT INTO auctions(user_id,title,description,base_price,end_time) VALUES($1,$2,$3,$4,$5) RETURNING *`;
  const { rows } = await pool.query(q,[req.user.id, title, description||'', basePrice, endTime]);
  res.status(201).json(rows[0]);
});

app.listen(PORT, ()=>console.log('auction-service on', PORT));
