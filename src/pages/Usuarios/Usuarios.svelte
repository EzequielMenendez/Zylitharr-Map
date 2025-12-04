<script>
    import { players, updatePlayer, deletePlayer } from '../../lib/db';
    import { createPlayerAccount } from '../../lib/authDb';
    import { pop } from 'svelte-spa-router';

    // Estados
    let showCreateModal = false;
    let loading = false;
    
    // Formulario Nuevo Usuario
    let newUser = { name: '', email: '', password: '' };

    // Filtrar la lista de $players (que ya filtra DMs, pero para gestión queremos ver a TODOS si es posible, 
    // aunque tu store actual filtra DMs. Para gestión de 'jugadores' está bien ver solo 'PLAYER')
    
    // --- ACCIONES ---

    async function handleCreate() {
        loading = true;
        try {
            await createPlayerAccount(newUser.email, newUser.password, newUser.name);
            showCreateModal = false;
            newUser = { name: '', email: '', password: '' };
            alert("Jugador reclutado con éxito.");
        } catch (e) {
            alert("Error: " + e.message);
        } finally {
            loading = false;
        }
    }

    async function toggleMovement(player) {
        // Invertimos el valor actual. Si no existe, asumimos false -> true
        const newValue = !player.movimiento; 
        await updatePlayer(player.id, { movimiento: newValue });
    }

    async function handleDelete(player) {
        if(confirm(`¿Estás seguro de expulsar a ${player.name} del reino? Esta acción es irreversible.`)) {
            await deletePlayer(player.id);
        }
    }

</script>

<div class="min-h-screen bg-stone-900 text-amber-50 p-6 md:p-12 overflow-y-auto">
    
    <!-- Encabezado -->
    <div class="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-green-800 pb-4">
        <div>
            <h1 class="text-3xl font-serif font-bold text-amber-100">Gestión de Aventureros</h1>
            <p class="text-green-400 text-sm">Controla quién entra y quién se mueve en tus tierras.</p>
        </div>
        <button 
            on:click={() => pop()} 
            class="text-green-500 hover:text-white underline text-sm"
        >
            ← Volver al Mapa
        </button>
    </div>

    <!-- Contenedor Principal -->
    <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Botón Crear -->
        <div class="bg-green-900/50 p-4 rounded-lg border border-green-800 flex justify-between items-center">
            <span class="font-bold text-lg">Reclutar nuevo jugador</span>
            <button 
                on:click={() => showCreateModal = true}
                class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded shadow font-bold transition-colors"
            >
                + Nuevo Usuario
            </button>
        </div>

        <!-- Lista de Jugadores -->
        <div class="grid gap-4">
            {#if $players}
                {#each $players as player (player.id)}
                    <div class="bg-green-950 border border-green-800 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg hover:border-green-600 transition-colors">
                        
                        <!-- Info Jugador -->
                        <div class="flex items-center gap-4 w-full md:w-auto">
                            <!-- Avatar con color -->
                            <div class="w-10 h-10 rounded-full {player.color} border-2 border-white flex items-center justify-center font-bold text-white shadow">
                                {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 class="font-bold text-lg leading-none">{player.name}</h3>
                                <span class="text-xs text-green-400 font-mono">ID: {player.id.slice(0,6)}...</span>
                            </div>
                        </div>

                        <!-- Controles -->
                        <div class="flex items-center gap-4 w-full md:w-auto justify-end">
                            
                            <!-- Switch de Movimiento -->
                            <div class="flex items-center gap-2 bg-green-900/50 px-3 py-1 rounded-full border border-green-800">
                                <span class="text-xs uppercase font-bold {player.movimiento ? 'text-green-400' : 'text-red-400'}">
                                    {player.movimiento ? 'Movimiento Activo' : 'Inmóvil'}
                                </span>
                                <button 
                                    on:click={() => toggleMovement(player)}
                                    class="w-10 h-5 rounded-full relative transition-colors {player.movimiento ? 'bg-green-500' : 'bg-red-900/50 border border-red-900'}"
                                >
                                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform {player.movimiento ? 'translate-x-5' : 'translate-x-0'}"></div>
                                </button>
                            </div>

                            <!-- Botón Eliminar -->
                            <button 
                                on:click={() => handleDelete(player)}
                                class="text-red-400 hover:text-red-200 hover:bg-red-900/30 p-2 rounded transition-colors"
                                title="Eliminar Usuario"
                            >
                                🗑️
                            </button>
                        </div>

                    </div>
                {/each}
            {:else}
                <div class="text-center py-10 text-gray-500 animate-pulse">Buscando señales de vida...</div>
            {/if}
            
            {#if $players && $players.length === 0}
                <div class="text-center py-10 text-gray-400">No hay jugadores registrados (excepto tú, oh DM).</div>
            {/if}
        </div>

    </div>

    <!-- MODAL DE CREACIÓN -->
    {#if showCreateModal}
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-green-900 border-2 border-green-600 w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
                <div class="bg-green-950 p-4 border-b border-green-800">
                    <h3 class="font-serif font-bold text-xl text-amber-100">Nuevo Contrato</h3>
                </div>
                
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs uppercase font-bold text-green-300 mb-1">Nombre del Personaje</label>
                        <input bind:value={newUser.name} type="text" class="w-full bg-green-950 border border-green-700 p-2 rounded text-white focus:border-amber-500 outline-none" placeholder="Ej. Gandalf" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-green-300 mb-1">Correo (Login)</label>
                        <input bind:value={newUser.email} type="email" class="w-full bg-green-950 border border-green-700 p-2 rounded text-white focus:border-amber-500 outline-none" placeholder="correo@ejemplo.com" />
                    </div>
                    <div>
                        <label class="block text-xs uppercase font-bold text-green-300 mb-1">Contraseña Inicial</label>
                        <input bind:value={newUser.password} type="text" class="w-full bg-green-950 border border-green-700 p-2 rounded text-white focus:border-amber-500 outline-none" placeholder="Mínimo 6 caracteres" />
                    </div>
                </div>

                <div class="p-4 bg-green-950/50 border-t border-green-800 flex justify-end gap-3">
                    <button on:click={() => showCreateModal = false} class="px-4 py-2 text-red-300 hover:text-white transition-colors">Cancelar</button>
                    <button 
                        on:click={handleCreate} 
                        disabled={loading || !newUser.email || !newUser.password}
                        class="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded font-bold shadow disabled:opacity-50"
                    >
                        {loading ? 'Firmando...' : 'Crear Usuario'}
                    </button>
                </div>
            </div>
        </div>
    {/if}

</div>