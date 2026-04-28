import { auth, db } from "../config/firebase.config";         // ← add db
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";             // ← was missing
import { signOut } from "firebase/auth";

export const signup = async (email, password, role) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        skills_flat: [],
        availability: true,
        createdAt: new Date(),
    });

    return user;
};

export const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  await signOut(auth);
};