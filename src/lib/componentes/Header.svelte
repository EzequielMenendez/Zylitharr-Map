<script>
    import { user, logout } from '../../lib/auth'; // Importamos estado de usuario
    import { push } from 'svelte-spa-router';   // Para navegar

    let menuOpen = false;

    // Svelte usa "on:click", no "onclick"
    const toggleMenu = () => {
        menuOpen = !menuOpen;
    };

    const handleLogout = async () => {
        await logout();
        menuOpen = false;
        push('/login'); // Redirigir al login al salir
    };

    const goToLogin = () => {
        menuOpen = false;
        push('/login');
    };

    const goToProfile = () => {
        menuOpen = false;
        push('/profile'); // Asumimos que existirá esta ruta
    };
</script>

<header class="w-full h-16 bg-green-900 text-amber-50 border-b-4 border-green-950 shadow-lg flex items-center justify-between px-4 md:px-8 z-50 relative">
    
    <!-- Lado Izquierdo: Título -->
    <div class="flex items-center gap-2 cursor-default select-none">
        <span class="text-2xl drop-shadow-md">⚔️</span>
        <h1 class="text-xl md:text-2xl font-serif font-bold tracking-wider uppercase drop-shadow-md text-amber-100">
        Zylitharr
        </h1>
    </div>

    <!-- Lado Derecho: Menú de Usuario -->
    <div class="relative">
        
        <!-- Botón del Avatar -->
        <button 
            on:click={toggleMenu} 
            class="flex items-center justify-center w-10 h-10 rounded-full bg-green-950 border border-green-800 hover:bg-green-800 hover:border-amber-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            title="Menú de usuario"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-200 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </button>

        <!-- MENÚ DESPLEGABLE -->
        {#if menuOpen}
        <div class="absolute top-12 right-0 mt-2 w-48 bg-green-900 border-2 border-green-700 rounded-md shadow-2xl py-1 z-[100] origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
            
            {#if $user}
                <!-- OPCIONES PARA USUARIO LOGUEADO -->
                <div class="px-4 py-2 text-xs text-green-300 border-b border-green-800 uppercase tracking-widest font-bold">
                    {$user.name || 'Aventurero'}
                </div>

                {#if $user.role !== 'DM'}
                    <button 
                        on:click={goToProfile}
                        class="w-full text-left px-4 py-2 text-sm text-amber-50 hover:bg-green-800 hover:text-amber-400 transition-colors flex items-center gap-2"
                    >
                        📜 Perfil
                    </button>
                {/if}

                <!-- Cerrar Sesión -->
                <button 
                    on:click={handleLogout}
                    class="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors flex items-center gap-2 border-t border-green-800 mt-1"
                >
                    🚪 Cerrar Sesión
                </button>

            {:else}
            <!-- OPCIONES PARA INVITADO (NO LOGUEADO) -->
            <button 
                on:click={goToLogin}
                class="w-full text-left px-4 py-2 text-sm text-amber-50 hover:bg-green-800 hover:text-amber-400 transition-colors"
            >
                🔐 Iniciar Sesión
            </button>
            {/if}

        </div>
        
        <!-- Fondo invisible para cerrar al hacer click fuera -->
        <div class="fixed inset-0 z-[90]" on:click={() => menuOpen = false}></div>
        {/if}

    </div>

</header>