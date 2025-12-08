<script>
    import { user } from '../../lib/auth';
    import { updatePlayer } from '../../lib/db'; // Importamos la función para actualizar DB
    import { pop } from 'svelte-spa-router';
    import { getAuth, updatePassword } from "firebase/auth";

    // Estado para edición de nombre
    let newName = '';
    let isEditingName = false;

    // Estado del formulario de contraseña
    let newPassword = '';
    let confirmPassword = '';
    let loading = false;
    let message = { type: '', text: '' }; // { type: 'success' | 'error', text: '...' }

    // Sincronizar el input de nombre con el usuario actual al cargar
    $: if ($user && !isEditingName) {
        newName = $user.name;
    }

    async function handleUpdateName() {
        if (!newName.trim()) {
            message = { type: 'error', text: 'El nombre no puede estar vacío.' };
            return;
        }

        loading = true;
        message = { type: '', text: '' };

        try {
            // Actualizamos en Firestore usando la función que ya creamos en db.js
            await updatePlayer($user.uid, { name: newName });
            message = { type: 'success', text: 'Nombre de personaje actualizado.' };
            isEditingName = false;
            $user.name = newName
        } catch (error) {
            console.error(error);
            message = { type: 'error', text: 'Error al actualizar el nombre.' };
        } finally {
            loading = false;
        }
    }

    async function handleChangePassword() {
        if (newPassword.length < 6) {
            message = { type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' };
            return;
        }
        if (newPassword !== confirmPassword) {
            message = { type: 'error', text: 'Las contraseñas no coinciden.' };
            return;
        }

        loading = true;
        message = { type: '', text: '' };

        try {
            const auth = getAuth();
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
                message = { type: 'success', text: 'Contraseña actualizada correctamente.' };
                newPassword = '';
                confirmPassword = '';
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                message = { type: 'error', text: 'Por seguridad, debes cerrar sesión y volver a entrar antes de cambiar tu clave.' };
            } else {
                message = { type: 'error', text: 'Error al actualizar la contraseña: ' + error.message };
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="min-h-[calc(100vh-64px)] bg-stone-900 flex items-center justify-center p-2 bg-[url('/pattern.png')]">
    
    {#if $user}
        <div class="w-full max-w-lg bg-green-900 border-4 border-green-950 rounded-lg shadow-2xl overflow-hidden relative">
            
            <!-- Botón Volver -->
            <button 
                on:click={() => pop()}
                class="absolute top-4 right-4 text-green-400 hover:text-amber-200 transition-colors"
                title="Volver"
            >
                ✕
            </button>

            <!-- Encabezado con Avatar -->
            <div class="bg-green-950 p-3 flex flex-col items-center border-b border-green-800">
                <h1 class="text-2xl font-serif font-bold text-amber-100 tracking-wide">{$user.name || 'Aventurero'}</h1>
            </div>

            <div class="p-8 space-y-8">

                <!-- Mensajes Globales -->
                {#if message.text}
                    <div class="p-3 rounded text-sm text-center {message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-800/50 text-green-200 border border-green-600'}">
                        {message.text}
                    </div>
                {/if}
                
                <!-- Datos del Usuario -->
                <div class="space-y-4">
                    <div>
                        <p class="block text-xs uppercase font-bold text-green-500 mb-1">Nombre de Jugador</p>
                        <div class="flex gap-2">
                            {#if isEditingName}
                                <!-- Modo Edición -->
                                <input 
                                    bind:value={newName}
                                    type="text"
                                    class="flex-1 min-w-[160px] bg-green-950 border border-green-700 p-2 rounded text-amber-50 font-mono focus:border-amber-500 outline-none"
                                    placeholder="Nombre del personaje"
                                />
                                <button     
                                    on:click={handleUpdateName} 
                                    disabled={loading}
                                    class="bg-amber-700 hover:bg-amber-600 text-white px-3 rounded shadow transition-colors"
                                    title="Guardar"
                                >
                                    💾
                                </button>
                                <button 
                                    on:click={() => { isEditingName = false; newName = $user.name; }} 
                                    disabled={loading}
                                    class="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 px-3 rounded transition-colors"
                                    title="Cancelar"
                                >
                                    ✕
                                </button>
                            {:else}
                                <!-- Modo Visualización -->
                                <div class="flex-1 bg-green-950/50 border border-green-800 p-3 rounded text-amber-50 font-mono">
                                    {$user.name}
                                </div>
                                <button 
                                    on:click={() => isEditingName = true}
                                    class="bg-green-800 hover:bg-green-700 text-green-200 border border-green-600 px-3 rounded transition-colors"
                                    title="Editar Nombre"
                                >
                                    ✏️
                                </button>
                            {/if}
                        </div>
                    </div>
                    <div>
                        <p class="block text-xs uppercase font-bold text-green-500 mb-1">Correo Electrónico</p>
                        <div class="bg-green-950/50 border border-green-800 p-3 rounded text-amber-50 font-mono flex items-center justify-between">
                            <span>{$user.email}</span>
                            <span class="text-xs bg-green-800 text-green-200 px-2 py-0.5 rounded">Privado</span>
                        </div>
                    </div>
                </div>

                <!-- Cambio de Contraseña -->
                <div class="bg-green-800/30 p-4 rounded border border-green-800/50">
                    <h3 class="text-amber-200 font-bold font-serif mb-4 flex items-center gap-2">
                        <span>🔐</span> Seguridad
                    </h3>

                    <form on:submit|preventDefault={handleChangePassword} class="space-y-3">
                        <div>
                            <input 
                                bind:value={newPassword}
                                type="password" 
                                placeholder="Nueva contraseña"
                                class="w-full bg-green-950 border border-green-700 p-2 rounded text-white focus:border-amber-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <input 
                                bind:value={confirmPassword}
                                type="password" 
                                placeholder="Confirmar contraseña"
                                class="w-full bg-green-950 border border-green-700 p-2 rounded text-white focus:border-amber-500 outline-none text-sm"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading || !newPassword || !confirmPassword}
                            class="w-full bg-amber-700 hover:bg-amber-600 text-white py-2 rounded font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    {:else}
        <div class="text-amber-500 animate-pulse">Cargando pergaminos...</div>
    {/if}

</div>