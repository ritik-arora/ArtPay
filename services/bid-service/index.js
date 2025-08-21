const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8083;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const pool = new Pool({ connectionString: DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req,res)=>res.json({ok:true, service:'bid-service'}));

function auth(req,res,next){
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ')?auth.slice(7):null;
  if(!token) return res.status(401).json({error:'No token'});
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({error:'Unauthorized'}); }
}

app.get('/:auctionId', async (req,res)=>{
  const { rows } = await pool.query('SELECT * FROM bids WHERE auction_id=$1 ORDER BY amount DESC', [req.params.auctionId]);
  res.json(rows);
});

app.post('/', auth, async (req,res)=>{
  const { auctionId, amount } = req.body;
  const { rows: baseRows } = await pool.query('SELECT base_price FROM auctions WHERE id=$1',[auctionId]);
  if(baseRows.length===0) return res.status(404).json({error:'auction not found'});
  const base = Number(baseRows[0].base_price);
  const { rows: bidRows } = await pool.query('SELECT COALESCE(MAX(amount), 0) AS max FROM bids WHERE auction_id=$1',[auctionId]);
  const current = Math.max(base, Number(bidRows[0].max));
  if(Number(amount) <= current) return res.status(400).json({error:`Bid must be greater than ${current}`});
  const { rows } = await pool.query('INSERT INTO bids(auction_id,user_id,amount) VALUES($1,$2,$3) RETURNING *',[auctionId, req.user.id, amount]);
  res.status(201).json(rows[0]);
});

app.listen(PORT, ()=>console.log('bid-service on', PORT));
