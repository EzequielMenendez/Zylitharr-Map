import { writable } from 'svelte/store';
import { getFirestore, collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import app from "../firebase"; // Importamos la configuración de Firebase

// Inicializamos la referencia a la base de datos
const db = getFirestore(app);

/**
 * Función auxiliar para crear un Store de Svelte conectado a Firestore.
 * Se conecta automáticamente cuando un componente se suscribe ($store)
 * y se desconecta cuando ya no se usa, ahorrando lecturas.
 */
function createFirestoreStore(collectionName, transformFn) {
    // writable(valorInicial, funciónStart)
    const { subscribe } = writable([], (set) => {
        // ESTO SE EJECUTA CUANDO EL PRIMER COMPONENTE SE SUSCRIBE
        const q = query(collection(db, collectionName));

        const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
            const rawData = { id: doc.id, ...doc.data() };
            // Aplicamos la transformación o filtro específico de cada colección
            const processed = transformFn(rawData);
            if (processed) {
            items.push(processed);
            }
        });
        set(items);
        });

        // ESTO SE EJECUTA CUANDO EL ÚLTIMO COMPONENTE SE DESUSCRIBE
        return () => unsubscribe();
    });

    return { subscribe };
}

// --- STORES EXPORTADOS ---

// Store de Jugadores: Se usa como $players en los archivos .svelte
export const players = createFirestoreStore('players', (data) => {
    // FILTRO: Si es DM, devolvemos null para que no se agregue a la lista
    if (data.role === 'DM') return null;

    return {
        id: data.id,
        name: data.name,
        role: data.role,
        movimiento: data.movimiento || false,
        x: data.position?.x || null,
        y: data.position?.y || null
    };
});

// Store de Marcadores: Se usa como $markers
export const markers = createFirestoreStore('markers', (data) => {
    return {
        id: data.id,
        name: data.name,
        type: data.type,    // 'danger', 'info', 'city', etc.
        x: data.position?.x || 0,
        y: data.position?.y || 0
    };
});

export async function addMarker(markerData) {
    try {
        const docRef = await addDoc(collection(db, "markers"), {
            name: markerData.name,
            type: markerData.type,
            position: {
                x: markerData.x,
                y: markerData.y
            },
            createdAt: Date.now()
        });
        console.log("Marcador creado con ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error al añadir marcador: ", e);
        throw e;
    }
}

export async function updatePlayer(uid, data) {
    try {
        const playerRef = doc(db, "players", uid);
        await updateDoc(playerRef, data);
    } catch (e) {
        console.error("Error actualizando jugador:", e);
        throw e;
    }
}

export async function deletePlayer(uid) {
    try {
        await deleteDoc(doc(db, "players", uid));
    } catch (e) {
        console.error("Error eliminando jugador:", e);
        throw e;
    }
}