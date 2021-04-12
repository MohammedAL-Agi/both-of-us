const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const path = require('path');

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`You are connected on port :${PORT}`);
});

app.get('/hospital', (req, res) => {
  request(
    'https://opendata.ecdc.europa.eu/covid19/hospitalicuadmissionrates/json/',
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.send(body);
      }
    }
  );
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}
