// src/pbClient.js
import PocketBase from 'pocketbase';

// URL del tuo server PocketBase (in locale)
const pb = new PocketBase('http://127.0.0.1:8090');

// opzionale: disabilita auto-cancel delle richieste
pb.autoCancellation(false);

// 🔥 esportazione di default (import pb from './pbClient')
export default pb;
