<script>
    import { replace } from 'svelte-spa-router';
    import { login } from '../../lib/auth';
    
    let email = '';
    let password = '';
    let error = '';
    let loading = false;

    async function handleLogin() {
        loading = true;
        error = '';
        
        try {
            await login(email, password);
            // Si el login funciona, el store 'user' se actualizará solo.
            // Redirigimos al mapa
            replace('/'); 
        } catch (e) {
            console.error(e);
            if (e.code === 'auth/invalid-credential') {
                error = "Credenciales incorrectas, aventurero.";
            } else {
                error = "Error al intentar entrar al reino.";
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-stone-900 bg-[url('/pattern.png')] overflow-y-auto">
    
    <!-- Tarjeta Central -->
    <div class="w-full max-w-md p-8 space-y-6 bg-green-900 border-4 border-green-950 rounded-lg shadow-2xl relative overflow-hidden">
        
        <!-- Decoración brillo superior -->
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

        <div class="text-center">
            <span class="text-4xl mb-2 block">🛡️</span>
            <h1 class="text-3xl font-serif font-bold text-amber-100 tracking-wider uppercase drop-shadow-md">
                Zylitharr
            </h1>
            <p class="text-green-200/80 text-sm mt-2 font-serif">Identifícate para cruzar las puertas</p>
        </div>

        {#if error}
            <div class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center animate-pulse">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="space-y-4">
        
            <div>
                <p class="block text-amber-50 text-xs font-bold mb-1 uppercase tracking-wide">Correo Electrónico</p>
                <input 
                bind:value={email}
                type="email" 
                required
                class="w-full bg-green-950 border border-green-700 text-amber-50 p-3 rounded focus:outline-none focus:border-amber-500 transition-colors placeholder-green-800"
                placeholder="héroe@ejemplo.com"
                />
            </div>

            <div>
                <p class="block text-amber-50 text-xs font-bold mb-1 uppercase tracking-wide">Contraseña</p>
                <input 
                bind:value={password}
                type="password" 
                required
                class="w-full bg-green-950 border border-green-700 text-amber-50 p-3 rounded focus:outline-none focus:border-amber-500 transition-colors placeholder-green-800"
                placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded border-b-4 border-amber-800 active:border-b-0 active:mt-1 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-serif uppercase tracking-widest"
            >
                {#if loading}Abriendo Puertas...{:else}Entrar al Reino{/if}
            </button>
        </form>

    </div>
</div>