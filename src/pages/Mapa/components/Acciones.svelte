<script>
    import { createEventDispatcher } from 'svelte';
    import { MARKER_TYPES } from '../../../lib/icons';
    import { selectedTool, selectTool, clearTool } from '../helpers/store';
    import { user } from '../../../lib/auth'; // Para verificar si es DM

    // Prop para controlar visibilidad (viene del padre)
    export let isOpen = false;

    const dispatch = createEventDispatcher();

    // Maneja el click en una herramienta
    function handleToolClick(typeId) {
        if ($selectedTool === typeId) {
            // Si ya estaba seleccionada, la deseleccionamos (Cancelar)
            clearTool();
        } else {
            // Seleccionar herramienta
            selectTool(typeId);
            
            // Si es móvil, emitimos evento para cerrar sidebar y ver el mapa
            if (window.innerWidth < 768) {
                dispatch('closeSidebar');
            }
        }
    }
</script>

<!-- 
    Barra Lateral
    Solo mostramos contenido si el usuario es DM.
-->
<aside class="{isOpen ? 'flex' : 'hidden'} flex-col w-64 h-full bg-green-900 border-r-4 border-green-950 shadow-2xl z-20 transition-all duration-300">
    
    {#if $user && $user.role === 'DM'}
        <!-- Encabezado -->
        <div class="p-4 bg-green-950 border-b border-green-800">
            <h2 class="text-amber-100 font-serif text-lg font-bold flex items-center gap-2">
                <span>🛠️</span> Herramientas DM
            </h2>
            <p class="text-green-400 text-xs mt-1">Selecciona para añadir al mapa</p>
        </div>

        <!-- Lista de Herramientas Dinámica -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
            
            {#each Object.values(MARKER_TYPES) as type}
                <button 
                    on:click={() => handleToolClick(type.id)}
                    class="w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 group
                    { $selectedTool === type.id 
                        ? `${type.bgColor} ${type.borderColor} ring-2 ring-amber-400 scale-105` 
                        : 'bg-green-800/50 border-green-700 hover:bg-green-800 hover:border-green-500' 
                    }"
                >
                    <!-- Icono -->
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 {type.color}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                            <path d={type.iconPath} />
                        </svg>
                    </div>

                    <!-- Texto -->
                    <div class="flex flex-col items-start">
                        <span class="text-amber-50 font-bold text-sm group-hover:text-white">
                            {type.label}
                        </span>
                        {#if $selectedTool === type.id}
                            <span class="text-[10px] text-amber-300 animate-pulse">Activo - Click en mapa</span>
                        {/if}
                    </div>
                </button>
            {/each}

        </div>

        <!-- Botón de Cancelar (Solo visible si hay herramienta activa) -->
        {#if $selectedTool}
            <div class="p-4 border-t border-green-800 bg-green-950/50">
                <button 
                    on:click={clearTool}
                    class="w-full py-2 text-xs text-red-300 hover:text-red-100 uppercase tracking-widest border border-red-900/50 hover:bg-red-900/20 rounded transition-colors"
                >
                    Cancelar Acción (ESC)
                </button>
            </div>
        {/if}

    {:else}
        <!-- Vista para Jugadores (No DMs) -->
        <div class="p-8 text-center text-green-400/50 italic font-serif">
            <p>Solo el Dungeon Master puede alterar la realidad...</p>
        </div>
    {/if}

</aside>