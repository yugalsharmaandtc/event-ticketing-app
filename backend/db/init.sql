CREATE TABLE if not exists users (
    id serial primary key,
    name varchar(50) not null,
    email varchar(100) unique not null,
    phone varchar(15),
    created_at timestamp default current_timestamp
);

create table if not exists events_cache(
    id varchar(100) primary key,
    title TEXT,
    description TEXT,async function signup(req,res){
  try{
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
      return res.status(400).json({ success:false, message:"All fields are required" });
    }
    const result = await authService.signup(req.body);
    res.json({ success:true, ...result });
  }catch(err){
    res.status(400).json({ 
      success:false,
      message: err.message,
      errorType: err.message === "User exists" ? "duplicate_email" : "validation_error"
    });
  }
}

    venue TEXT,
    city VARCHAR(100),
    event_date TIMESTAMP,
    price NUMERIC(10,2),
    raw JSONB,
    created_at TIMESTAMP DEFAULT current_timestamp
);

create table if not exists bookings(
    id serial primary key,
    user_id integer references users(id),
    event_id varchar(100),
    pax_name varchar(200),
    phone varchar(15),
    price NUMERIC(10,2),
    booking_status varchar(30) DEFAULT 'reserved',
    payment_status varchar(30) DEFAULT 'pending',
    payment_txn_id varchar(200),
    created_at TIMESTAMP DEFAULT current_timestamp
);
CREATE TABLE booking_passengers (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  name TEXT,
  phone TEXT
);