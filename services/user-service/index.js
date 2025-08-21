const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8081;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const pool = new Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req,res)=>res.json({ok:true, service:'user-service'}));

app.post('/register', async (req,res) => {
  try {
    const { name, email, mobile, age, gender, password } = req.body;
    if(!email || !password) return res.status(400).json({error:'email and password required'});
    const hash = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users(name,email,mobile,age,gender,password_hash) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,name,email,mobile,age,gender,created_at`;
    const { rows } = await pool.query(q,[name,email,mobile,age,gender,hash]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(400).json({error:e.message});
  }
});

app.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    const user = rows[0];
    if(!user) return res.status(401).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({error:'Invalid credentials'});
    const token = jwt.sign({ id:user.id, email:user.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id:user.id, name:user.name, email:user.email } });
  } catch (e) {
    res.status(400).json({error:e.message});
  }
});

app.get('/me', async (req,res)=>{
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if(!token) return res.status(401).json({error:'No token'});
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query('SELECT id,name,email,mobile,age,gender,created_at FROM users WHERE id=$1',[payload.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(401).json({error:'Unauthorized'});
  }
});

app.listen(PORT, ()=>console.log('user-service on', PORT));
