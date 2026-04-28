import { db } from "../config/firebase.config";
import { doc, updateDoc } from "firebase/firestore";

export const assignVolunteer = async (requestId, volunteerId) => {
    const ref = doc(db, "requests", requestId);

    await updateDoc(ref, {
        assignedVolunteer: volunteerId,
        status: "assigned"
    });
};