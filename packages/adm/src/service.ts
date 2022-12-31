import {createFetch} from "@restaroo/lib";
import PocketBase from "pocketbase";

export const fetchService = createFetch(process.env.REACT_APP_API_URL ?? '');
export const pocketBase = new PocketBase(process.env.REACT_APP_API_URL ?? '');