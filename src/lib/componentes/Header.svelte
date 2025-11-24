<script>
  // Aquí podríamos recibir props en el futuro, como el usuario actual
</script>

<header class="w-full h-16 bg-green-900 text-amber-50 border-b-4 border-green-950 shadow-lg flex items-center justify-between px-4 md:px-8 z-50 relative">
    
    <!-- Lado Izquierdo: Título del Reino/Campaña -->
    <div class="flex items-center gap-2 cursor-default select-none">
        <!-- Un pequeño icono de espada o escudo decorativo (opcional) -->
        <span class="text-2xl">⚔️</span>
        <h1 class="text-xl md:text-2xl font-serif font-bold tracking-wider uppercase drop-shadow-md">
        Zylitharr
        </h1>
    </div>

    <!-- Lado Derecho: Perfil -->
    <button class="flex items-center justify-center w-10 h-10 rounded-full bg-green-950 border border-green-800 hover:bg-green-800 hover:border-amber-500 transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-amber-500">
        <!-- Icono SVG de Usuario (Simple y ligero) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </button>

</header>