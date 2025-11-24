<script>
    import Acciones from "./components/Acciones.svelte";
    import Mapa from "./components/Mapa.svelte";
</script>

<div class="flex w-full h-full overflow-hidden relative">
    <Acciones />

    <main class="flex-1 relative z-0 h-full">
        <Mapa />
        
        <button class="md:hidden absolute top-4 left-4 z-10 bg-green-800 text-amber-100 p-2 rounded shadow border border-green-600">
            ☰
        </button>
    </main>

</div>