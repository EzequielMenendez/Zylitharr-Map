<script>
    import Acciones from "./components/Acciones.svelte";
    import Mapa from "./components/Mapa.svelte";

    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }
</script>

<div class="flex w-full h-full overflow-hidden relative">
    <Acciones isOpen={isSidebarOpen}/>

    <main class="flex-1 relative z-0 h-full">
        <Mapa />
        
    <button 
        on:click={toggleSidebar}
        class="absolute top-4 left-4 z-20 bg-green-800 text-amber-100 p-2 rounded shadow border border-green-600 hover:bg-green-700 transition-colors"
        title={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>
    </main>
</div>