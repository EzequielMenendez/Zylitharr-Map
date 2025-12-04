<script>
    import { fade, scale } from 'svelte/transition';
    import { 
        isModalOpen, 
        selectedTool, 
        tempCoordinates, 
        closeCreation 
    } from '../helpers/store';
    import { MARKER_TYPES } from '../../../lib/icons';
    import { addMarker } from '../../../lib/db';

    let name = '';
    let description = ''; // Opcional para futuro
    let loading = false;

    // Reactividad: Obtenemos la configuración visual del tipo seleccionado
    $: currentTypeConfig = $selectedTool ? MARKER_TYPES[Object.keys(MARKER_TYPES).find(key => MARKER_TYPES[key].id === $selectedTool)] : null;

    async function handleSave() {
        if (!name.trim()) return;
        
        loading = true;
        try {
            await addMarker({
                name: name,
                type: $selectedTool,
                x: $tempCoordinates.x,
                y: $tempCoordinates.y
            });
            
            // Limpiar y cerrar
            name = '';
            description = '';
            closeCreation();
        } catch (error) {
            alert("Error al crear marcador");
        } finally {
            loading = false;
        }
    }

    function handleCancel() {
        name = '';
        closeCreation();
    }
</script>

{#if $isModalOpen && currentTypeConfig}
    <!-- Backdrop (Fondo oscuro) -->
    <div class="fixed inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm" transition:fade={{ duration: 200 }}>
        
        <!-- Contenedor del Modal -->
        <div 
            class="bg-green-900 w-full max-w-sm rounded-lg border-2 border-green-700 shadow-2xl overflow-hidden"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            
            <!-- Encabezado -->
            <div class="bg-green-950 p-4 border-b border-green-800 flex items-center justify-between">
                <h3 class="text-amber-100 font-serif font-bold text-lg">Nuevo Marcador</h3>
                <button on:click={handleCancel} class="text-green-400 hover:text-white transition-colors">✕</button>
            </div>

            <!-- Cuerpo -->
            <div class="p-6 space-y-4">
                
                <!-- Vista Previa del Icono -->
                <div class="flex flex-col items-center justify-center p-4 bg-green-800/50 rounded border border-green-700/50 border-dashed mb-4">
                    <span class="text-xs text-green-400 mb-2 uppercase tracking-widest">Tipo: {currentTypeConfig.label}</span>
                    
                    <!-- Renderizamos el icono tal cual se verá en el mapa -->
                    <div class="w-12 h-12 rounded-full border-2 {currentTypeConfig.borderColor} {currentTypeConfig.bgColor} flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7 {currentTypeConfig.color}">
                            <path fill-rule="evenodd" d="{currentTypeConfig.iconPath}" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>

                <!-- Formulario -->
                <div>
                    <p class="block text-amber-50 text-xs font-bold mb-1 uppercase">Nombre del Lugar</p>
                    <input 
                        bind:value={name}
                        type="text" 
                        placeholder="Ej. Cueva de los lamentos"
                        class="w-full bg-green-950 border border-green-700 text-white p-2 rounded focus:outline-none focus:border-amber-500 transition-colors"
                        autoFocus
                    />
                </div>

                <!-- Botones -->
                <div class="flex gap-3 pt-2">
                    <button 
                        on:click={handleCancel}
                        class="flex-1 py-2 text-red-300 hover:text-white hover:bg-red-900/30 rounded transition-colors border border-transparent"
                    >
                        Cancelar
                    </button>
                    <button 
                        on:click={handleSave}
                        disabled={!name.trim() || loading}
                        class="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Guardando...' : 'Crear'}
                    </button>
                </div>

            </div>
        </div>

    </div>
{/if}