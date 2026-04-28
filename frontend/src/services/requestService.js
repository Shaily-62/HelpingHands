import { db } from "../config/firebase.config";
import { collection, addDoc } from "firebase/firestore";

export const addRequest = async (data) => {
  return await addDoc(collection(db, "requests"), data);
};