const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

// Replace with your Football-Data.org API Key
const API_KEY = "d58ae41e5dac465883e1aafbdd6f86be";

// Set up the headers with the API key for Football-Data.org
const config = {
  headers: {
    'X-Auth-Token': API_KEY
  }
};

// Endpoint to fetch live Premier League scores
app.get('/live-scores', async (req, res) => {
  try {
    // Make a request to the Football-Data.org API to get live matches for the Premier League
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches', config);
    const matches = response.data.matches;

    // Check if there are any live matches
    if (matches.length === 0) {
      return res.status(404).json({ message: 'No live matches currently' });
    }

    // Filter out only the live matches
    const liveMatches = matches.filter(match => match.status === 'LIVE');

    // If no live matches, return an appropriate message
    if (liveMatches.length === 0) {
      return res.status(200).json({ message: 'No live matches at the moment' });
    }

    // Prepare a response with live match details
    const liveMatchDetails = liveMatches.map(match => ({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`,
      status: match.status,
      time: match.utcDate,
    }));

    // Send live scores as the response
    res.json({
      message: 'Live Premier League Scores',
      liveMatches: liveMatchDetails
    });

  } catch (error) {
    console.error('Error fetching live scores:', error);
    res.status(500).json({ error: 'Unable to fetch live scores' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

