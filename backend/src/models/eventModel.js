const pool=require("../config/db");

async function upsertEvent(event){
    const res=await pool.query( `INSERT INTO events_cache 
     (id, title, description, venue, city, event_date, price, raw)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id)
     DO UPDATE SET
       title=EXCLUDED.title,
       description=EXCLUDED.description,
       venue=EXCLUDED.venue,
       city=EXCLUDED.city,
       event_date=EXCLUDED.event_date,
       price=EXCLUDED.price,
       raw=EXCLUDED.raw
     RETURNING *`,
    [
      event.id,
      event.title,
      event.description,
      event.venue,
      event.city,
      event.date,
      event.price,
      event.raw,
    ]
  );

  return res.rows[0];
}

async function getEventById(id){
    const res=await pool.query("SELECT * FROM events_cache WHERE id=$1",[id]);
    return res.rows[0];
}

module.exports={upsertEvent,getEventById};