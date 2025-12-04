import { initializeApp, getApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Necesitamos la config original, pero importada como objeto puro si es posible
// Para no complicar, asumo que tienes las keys a mano o las reusamos de firebase.js
// IMPORTANTE: En un entorno real, esto debería ser una Cloud Function por seguridad.
import app from "../firebase"; 

// Extraemos la configuración de la app ya inicializada
const firebaseConfig = app.options;

export const createPlayerAccount = async (email, password, name) => {
    let secondaryApp;
    try {
        // 1. Inicializamos una segunda instancia de Firebase con nombre único
        secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);
        const db = getFirestore(app); // Usamos la DB de la app principal

        // 2. Creamos el usuario en esa instancia secundaria
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const uid = userCredential.user.uid;

        // 3. Creamos su documento en Firestore inmediatamente
        await setDoc(doc(db, "players", uid), {
            name: name,
            email: email,
            role: "PLAYER",
            movimiento: false,
            position: null,
            color: 'bg-gray-500',
            createdAt: Date.now()
        });

        // 4. Cerramos sesión en la app secundaria para no dejar sesiones colgadas
        await signOut(secondaryAuth);
        
        console.log("Usuario creado con éxito:", email);
        return { success: true };

    } catch (error) {
        console.error("Error creando usuario:", error);
        throw error;
    } finally {
        // 5. Destruimos la instancia secundaria para liberar memoria
        if (secondaryApp) {
            await deleteApp(secondaryApp);
        }
    }
};