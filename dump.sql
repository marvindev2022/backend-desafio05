CREATE TABLE IF NOT EXISTS users  (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password VARCHAR(20) NOT NULL,
  cpf CHAR(11) ,
  phone CHAR(11) 
);

CREATE TABLE IF NOT EXISTS client (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  cep VARCHAR(10),
  street VARCHAR(255),
  complement VARCHAR(255),
  neighborhood VARCHAR(255),
  city VARCHAR(255),
  uf VARCHAR(2)
);

CREATE TABLE invoices (
   id SERIAL PRIMARY KEY,
   description VARCHAR(255) NOT NULL,
   status VARCHAR(10) NOT NULL CHECK (status IN ('pago', 'pendente')),
   invoice_value DECIMAL(10,2) NOT NULL,
   due_date DATE NOT NULL,
   client_id INTEGER REFERENCES client(id)
);