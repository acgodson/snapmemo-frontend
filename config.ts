import { initializeApp } from "firebase/app";
import "firebase/auth";
import bs58 from "bs58";
const firebaseConfig = {
  apiKey: "AIzaSyB98ao6ktsuVsdBCFdLM2TzTiEh6FAWblI",
  authDomain: "snapmemo-e421c.firebaseapp.com",
  projectId: "snapmemo-e421c",
  storageBucket: "snapmemo-e421c.appspot.com",
  messagingSenderId: "321930239475",
  appId: "1:321930239475:web:ef9e69bf3ed246fa048686",
  measurementId: "G-X3MS1K9NX2",
};

export const WEB3AUTH_CLIENT_ID =
  "BHnW5FozhGaglAa3TirvaspkQmiDzYbiZ0Azu2CIrVfTntvJudyScXXE4_v64X70wV-RSr2lQeIHQlGPZQL8Mlw";

export function initFirebase() {
  initializeApp(firebaseConfig);
}

export const ALGO_API_KEY = "c8sJuxFbqE8a7xOTWM4ZC3PpoILhc2qk1sSVm6Vh";

export const convertIpfsCidV0ToByte32 = (cid: string) => {
  let hex = `${bs58.decode(cid).slice(2).toString()}`;
  let base64 = `${bs58.decode(cid).slice(2).toString()}`;
  console.log("CID Hash Converted to hex: ", hex);

  const buffer = Buffer.from(bs58.decode(cid).slice(2).toString(), "base64");
  console.log("CID Hash Converted to Base64: ", base64);
  const volBytes = buffer.length;
  console.log(
    "CID Hash Bytes volume is: ",
    `${volBytes} bytes, OK for ASA MetaDataHash field!`
  );

  return { base64, hex, buffer };
};
