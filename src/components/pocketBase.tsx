import PocketBase from 'pocketbase';
export const pocketBase = new PocketBase(process.env.REACT_APP_POCKETBASE_URL);
