import { writable } from 'svelte/store';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebase"; // Tu configuración base

const auth = getAuth(app);
const db = getFirestore(app);

// --- STORE DE USUARIO ---
// Este store tendrá 3 estados:
// 1. undefined: Aún cargando (no sabemos si está logueado)
// 2. null: No logueado
// 3. Objeto User: Logueado y con datos cargados
export const user = writable(undefined);

// --- ESCUCHADOR DE SESIÓN ---
// Se ejecuta automáticamente al abrir la app
onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
        // 1. El usuario se logueó en Firebase Auth
        try {
        // 2. Buscamos sus datos extra (Rol, Nombre) en Firestore
        const docRef = doc(db, "players", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // ¡Éxito! Combinamos Auth + Firestore
            const profile = docSnap.data();
            user.set({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: profile.name, // "Grimm" o "Dungeon Master"
            role: profile.role, // "PLAYER" o "DM"
            ...profile
            });
        } else {
            console.error("Usuario autenticado pero sin perfil en 'players'");
            // Opcional: Podrías crear el perfil aquí si no existe
            user.set({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'GUEST' });
        }
        } catch (error) {
        console.error("Error leyendo perfil:", error);
        user.set(null);
        }
    } else {
        // Usuario no logueado
        user.set(null);
    }
});

// --- FUNCIONES EXPORTADAS ---

export const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
    return signOut(auth);
};