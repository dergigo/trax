const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 2107;

// Middleware zum Parsen von JSON-Daten
app.use(bodyParser.json());

// Objekt für die Speicherung der Standortdaten
const locationData = {};

// Route zum Empfangen von Standortdaten von OwnTracks-Clients


app.post('/', (req, res) => {
  console.log("fnord");
});

app.post('/owntracks', (req, res) => {
  const { _type, tid, lat, lon, alt } = req.body;
  console.log(req.body);
  const tst = Math.floor(new Date().getTime() / 1000);
  
  if (_type === 'location') {
    // Speichern der Standortdaten
    locationData[tid] = { "_type":"location", tid, lat, lon, alt, "tst":tst };
    console.log(`location data received: ${tid}: Lat ${lat}, Lon ${lon}`);
    
    // Erfolgreiche Antwort an OwnTracks-Client
    const allLocations = Object.values(locationData); // Konvertieren Sie das Objekt in ein Array
    res.status(200).json(allLocations);
    
  } else {
    // Andere Arten von Nachrichten werden ignoriert
    res.status(400).send('unknown request');
    console.log('unknown request');
  }
});

app.get('/locations', (req, res) => {
  const allLocations = Object.values(locationData); // Konvertieren Sie das Objekt in ein Array
  res.status(200).json(allLocations);
  console.log("all locations requested");
});



app.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});