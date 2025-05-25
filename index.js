const express = require('express');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();
app.use(cors());
app.use(express.json());

const SHEET_ID = '1yv6YHxP9JMvv1WPfxg1t6drleL96bco708lDaUlKoFQ';
const CREDS = JSON.parse(process.env.GOOGLE_CREDS);

app.post('/rsvp', async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(CREDS);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({ Name: name, Phone: phone, Email: email });

    res.json({ result: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: 'error', message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('RSVP API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));