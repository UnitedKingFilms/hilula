# RSVP API for Movie Premiere

Deployed on Railway and connected to Google Sheets.

## Setup

1. Create `.env` file or use Railway's Variables:
   - GOOGLE_CREDS: (stringified JSON from your service account)

2. Sheet ID: 1yv6YHxP9JMvv1WPfxg1t6drleL96bco708lDaUlKoFQ

## Endpoints

- `POST /rsvp`
  - Payload: `{ name, phone, email }`