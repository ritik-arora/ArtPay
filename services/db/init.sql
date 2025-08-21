-- Create DB user
CREATE USER auction_user WITH PASSWORD 'auction_pass';

-- Create DB
CREATE DATABASE auction_db OWNER auction_user;

\c auction_db;

-- Tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(20) UNIQUE,
    age INT,
    gender VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(12,2) NOT NULL,
    end_time TIMESTAMP NOT NULL,
    owner_id INT REFERENCES users(id)
);

CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auctions(id),
    user_id INT REFERENCES users(id),
    amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auctions(id),
    user_id INT REFERENCES users(id),
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
