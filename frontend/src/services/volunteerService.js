import { db } from "../config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getAvailableVolunteers = async () => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "volunteer"),
    where("availability.isAvailable", "==", true)  // ✅ dot-notation for nested map field
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};