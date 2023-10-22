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

app.post('/:realm', (req, res) => {
  const { realm } = req.params;
  
  const { _type, tid, lat, lon, alt } = req.body;
  const tst = Math.floor(new Date().getTime() / 1000);
  
  if (_type === 'location') {
    if (!(realm in locationData)) {
      locationData[realm]={};
    }
    locationData[realm][tid] = { "_type":"location", tid, lat, lon, alt, "tst":tst };
    console.log(`location data in realm ${realm} received: ${tid}: Lat ${lat}, Lon ${lon}`);
    
    // Erfolgreiche Antwort an OwnTracks-Client
    const allLocations = Object.values(locationData[realm]); // Konvertieren Sie das Objekt in ein Array
    res.status(200).json(allLocations);
    
  } else {
    // Andere Arten von Nachrichten werden ignoriert
    res.status(400).send('unknown request');
    console.log('unknown request');
  }
});


app.get('/', (req, res) => {
  
  //Todo: show create realm page
  
  res.status(200).send("new realm?");
});

app.get('/locations/:realm', (req, res) => {
  const { realm } = req.params;
  if (realm in locationData) {
    const allLocations = Object.values(locationData[realm]);
    res.status(200).json(allLocations);
    console.log(`all locations for realm ${realm} requested`);
  } else {
    res.status(404).send("unknown realm");
  }
  
});

app.get('/:realm', (req, res) => {
  const { realm } = req.params;
  
  
  const config = {
    "_type" : "configuration",
    "username" : generateRandomString(2),
    "maxHistory" : 0,
    "positions" : 0,
    "locked" : false,
    "deviceId" : generateRandomString(2),
    "monitoring" : 1,
    "cmd" : false,
    "tid" : generateRandomString(2),
    "allowRemoteLocation" : false,
    "url" : "https:\/\/trax.fpleds.de\/"+realm,
    "ignoreStaleLocations" : 0,
    "allowinvalidcerts" : false,
    "auth" : false,
    "locatorInterval" : 180,
    "extendedData" : true,
    "ignoreInaccurateLocations" : 0,
    "locatorDisplacement" : 200,
    "mode" : 3,
    "password" : "XXXXX",
    "downgrade" : 0
  };
  
  const configLink = 'owntracks:///config?inline='+encodeURIComponent(btoa(JSON.stringify(config).toString('base64')));
  
  const information = `
  <h1>proof of concept for location sharing </h1> 
  <h2> Step 1: install owntracks App: </h2> 
  <a href="https://itunes.apple.com/us/app/mqttitude/id692424691?mt=8">iOS</a> 
  <a href="https://play.google.com/store/apps/details?id=org.owntracks.android">Android</a> 
  <a href="https://owntracks.org/">Website</a>
  <h2> Step 2: configure owntracks with magic link: </h2>
  <a href='${configLink}'>join ${realm}</a>
  `;
  
  res.status(200).send(information);
  console.log(`someone requested realm: ${realm}`);
});



app.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});



// --------------

function generateRandomString(len) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomString += alphabet.charAt(randomIndex);
  }

  return randomString;
}