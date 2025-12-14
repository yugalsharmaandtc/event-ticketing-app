// src/services/ticketmasterService.js
const axios = require('axios');

const TM_BASE = process.env.TICKETMASTER_BASE || 'https://app.ticketmaster.com/discovery/v2';
const TM_API_KEY = process.env.TICKETMASTER_API_KEY;

// 🔹 Format a single Ticketmaster event into our app shape
function formatEvent(e) {
  const venue = e._embedded?.venues?.[0];

  // ----- Price normalization -----
  const priceRanges = e.priceRanges || [];
  let price = 50; // default fallback
  if (priceRanges.length > 0) {
    price = priceRanges[0].min;
  }

  return {
    id: e.id,
    title: e.name,
    date: e.dates?.start?.dateTime || e.dates?.start?.localDate,
    venue: venue?.name || null,
    city: venue?.city?.name || null,

    description: e.description || e.info || null,
    info: e.info || null,
    pleaseNote: e.pleaseNote || null,

    price,
    priceRanges,

    images: e.images || [],
    image: e.images?.[0]?.url || null,

    // optional metadata
    classifications: e.classifications || [],
    segment: e.classifications?.[0]?.segment?.name || null,
    genre: e.classifications?.[0]?.genre?.name || null,

    raw: e,
  };
}


// 🔹 Search endpoint (list)
async function searchEvents({ q, city, page = 0 }) {
  const params = {
    apikey: TM_API_KEY,
    keyword: q,
    page: page + 1,
  };
  if (city) params.city = city;

  const url = `${TM_BASE}/events.json`;
  const res = await axios.get(url, { params });

  const events = res.data?._embedded?.events || [];
  const formatted = events.map((e) => formatEvent(e));
  return formatted;
}

// 🔹 Single event (details) – IMPORTANT: also use formatEvent
async function getEventById(id) {
  const url = `${TM_BASE}/events/${id}.json`;
  const res = await axios.get(url, {
    params: { apikey: TM_API_KEY },
  });

  const event = res.data; // raw Ticketmaster event
  return formatEvent(event); // ⭐ map it the same way
}

module.exports = {
  searchEvents,
  getEventById,
};
