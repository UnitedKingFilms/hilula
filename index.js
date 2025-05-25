const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = '1yv6YHxP9JMvv1WPfxg1t6drleL96bco708lDaUlKoFQ';

console.log('Parsing Google credentials from environment variable...');
let CREDS;
try {
  CREDS = JSON.parse(process.env.GOOGLE_CREDS);
  console.log('Google credentials parsed successfully.');
} catch (err) {
  console.error('Failed to parse Google credentials:', err);
  process.exit(1);
}

app.post('/rsvp', async (req, res) => {
  console.log('Received /rsvp POST request');
  console.log('Request body:', req.body);

  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    console.warn('Missing required fields:', { name, phone, email });
    return res.status(400).json({ result: 'error', message: 'Missing name, phone or email' });
  }

  try {
    console.log('Creating GoogleSpreadsheet instance...');
    const doc = new GoogleSpreadsheet(SHEET_ID);

    console.log('Authenticating with Google service account...');
    await doc.useServiceAccountAuth(CREDS);
    console.log('Authentication successful.');

    console.log('Loading spreadsheet info...');
    await doc.loadInfo();
    console.log(`Loaded spreadsheet titled: ${doc.title}`);

    const sheet = doc.sheetsByIndex[0];
    console.log(`Selected first sheet titled: ${sheet.title}`);

    console.log('Adding new row to the sheet...');
    await sheet.addRow({ Name: name, Phone: phone, Email: email });
    console.log('Row added successfully.');

    res.json({ result: 'success' });
  } catch (err) {
    console.error('Error in /rsvp handler:', err);
    res.status(500).json({ result: 'error', message: err.message });
  }
});

app.get('/', (req, res) => {
  console.log('Received GET request on /');
  res.send('RSVP API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
