// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Stack,
  InputAdornment,
  Paper,
  Box,
  Autocomplete,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventCard from '../components/EventCard';
import { searchEvents } from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';

const Home = () => {
  const [q, setQ] = useState('rock');
  const [city, setCity] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const extractGenres = (eventList) => {
    const genreSet = new Set();
    eventList.forEach((event) => {
      if (event.classifications && Array.isArray(event.classifications)) {
        event.classifications.forEach((classification) => {
          if (classification.genre?.name) {
            genreSet.add(classification.genre.name);
          }
        });
      }
    });
    return Array.from(genreSet).sort();
  };

  const extractCities = (eventList) => {
    const citySet = new Set();
    eventList.forEach((event) => {
      if (event.city) {
        citySet.add(event.city);
      }
    });
    return Array.from(citySet).sort();
  };

  // fetchData wrapped in useCallback to avoid missing dependency warnings
  const fetchData = useCallback(
    async (pageToLoad = 0, append = false) => {
      try {
        setLoading(true);
        const data = await searchEvents({ q, city, page: pageToLoad });

        const newEvents = data.events || [];

        // append or replace
        setEvents((prev) =>
          append ? [...prev, ...newEvents] : newEvents
        );

        // detect if more events exist
        setHasMore(newEvents.length > 0);

        // update autocomplete sources
        setGenres(extractGenres(newEvents));
        setCities(extractCities(newEvents));
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    },
    [q, city] // dependencies used inside fetchData
  );

  // Initial load + restore filter from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastSearch');

    if (saved) {
      const { q: sq, city: sc, page: sp } = JSON.parse(saved);
      setQ(sq);
      setCity(sc);
      setPage(sp);
      fetchData(sp, false);
    } else {
      fetchData(0, false);
    }
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearch = { q, city, page: 0 };
    localStorage.setItem('lastSearch', JSON.stringify(newSearch));
    setPage(0);
    fetchData(0, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <LoadingOverlay open={loading} />

      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Discover Events
      </Typography>

      {/* Search Form */}
      <Paper
        sx={{ p: 3, mb: 4, borderRadius: 3 }}
        component="form"
        onSubmit={handleSearch}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="flex-end"
        >
          {/* Genre */}
          <Autocomplete
            freeSolo
            options={genres}
            value={q}
            onChange={(event, newValue) => setQ(newValue || '')}
            onInputChange={(event, newInputValue) => setQ(newInputValue)}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search events (Genre)"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* City */}
          <Autocomplete
            freeSolo
            options={cities}
            value={city}
            onChange={(event, newValue) => setCity(newValue || '')}
            onInputChange={(event, newInputValue) => setCity(newInputValue)}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Search button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: '#ff6b35',
              '&:hover': {
                backgroundColor: '#ff5722',
              },
            }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      {/* Event Grid */}
      <Grid
        container
        spacing={3}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 3,
          width: '100%',
        }}
      >
        {events.map((ev) => (
          <Box key={ev.id}>
            <EventCard event={ev} />
          </Box>
        ))}
      </Grid>

      {/* If no results */}
      {!loading && events.length === 0 && (
        <Typography
          sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}
        >
          No events found. Try a different search.
        </Typography>
      )}

      {/* Load More */}
      {!loading && events.length > 0 && hasMore && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{ px: 4, py: 1.5 }}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Home;
