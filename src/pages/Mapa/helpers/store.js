import { writable } from 'svelte/store';

// --- ESTADOS ---

// ¿Qué herramienta tiene seleccionada el DM? (null = ninguna, modo mover mapa)
export const selectedTool = writable(null);

// ¿Está abierto el modal para poner nombre al marcador?
export const isModalOpen = writable(false);

// Coordenadas temporales donde se hizo click (antes de guardar)
export const tempCoordinates = writable({ x: 0, y: 0 });


// --- ACCIONES ---

/**
 * Selecciona una herramienta para colocar marcadores.
 * @param {string} toolId - El ID del tipo de marcador (ej: 'danger')
 */
export const selectTool = (toolId) => {
    selectedTool.set(toolId);
};

/**
 * Cancela la acción actual y vuelve al modo normal.
 */
export const clearTool = () => {
    selectedTool.set(null);
};

/**
 * Inicia el proceso de creación: Guarda coords y abre modal.
 */
export const startCreation = (coords) => {
    tempCoordinates.set(coords);
    isModalOpen.set(true);
};

/**
 * Finaliza el proceso (ya sea por guardar o cancelar modal).
 */
export const closeCreation = () => {
    isModalOpen.set(false);
    tempCoordinates.set({ x: 0, y: 0 });
    clearTool(); // Opcional: ¿Quieres que siga seleccionada la herramienta para poner varios seguidos?
};