// backend/googleDrive/googleDriveAuth.js
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

const CREDENTIALS_PATH = path.resolve('googleDrive', 'oauth_client.json'); // from GCP
const TOKEN_PATH = path.resolve('googleDrive', 'token.json');

function getOAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Missing OAuth client JSON at ${CREDENTIALS_PATH}. Place the file from GCP there.`);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

export function loadSavedCredentialsIfExist() {
  try {
    if (!fs.existsSync(TOKEN_PATH)) return null;
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    const client = getOAuthClient();
    client.setCredentials(token);
    return client;
  } catch (err) {
    console.error('Error loading saved credentials:', err);
    return null;
  }
}

export function saveCredentials(client) {
  try {
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(client.credentials, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving credentials:', err);
    throw err;
  }
}

export function generateAuthUrl() {
  const client = getOAuthClient();
  const scopes = ['https://www.googleapis.com/auth/drive.file'];
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent select_account',
  });
}

export async function handleOAuthCallback(code) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  saveCredentials(client);
  return client;
}

export function getAuthenticatedClient() {
  // prefer saved client; otherwise return a fresh OAuth client (without tokens)
  const client = loadSavedCredentialsIfExist() || getOAuthClient();
  return client;
}
