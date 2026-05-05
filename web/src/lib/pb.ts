import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.DEV ? 'http://127.0.0.1:8090' : window.location.origin;

export const pb = new PocketBase(pbUrl);
