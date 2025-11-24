<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import mapa from '../../../assets/Mapa-mundi.jpg'

    const MAP_WIDTH = 3840; 
    const MAP_HEIGHT = 2160;

    let mapElement;
    let map;

    onMount(() => {
        if (!mapElement) return;

        // Inicializar mapa en modo "Plano" (píxeles, no latitud/longitud)
        map = L.map(mapElement, {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 2,
            zoomControl: false, // Ocultamos controles por defecto para estilo limpio
            attributionControl: false 
        });

        // Definir los límites: [0,0] es esquina inferior izquierda
        const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

        // Cargar la imagen
        L.imageOverlay(mapa, bounds).addTo(map);

        // Ajustar la cámara para que se vea todo el mapa al inicio
        map.fitBounds(bounds);
        
        // (Opcional) Limitar para que no puedan arrastrar la cámara al vacío infinito
        map.setMaxBounds(bounds);
    });
</script>

<div 
    class="w-full h-full bg-stone-900 z-10 relative outline-none" 
    bind:this={mapElement}>
</div>