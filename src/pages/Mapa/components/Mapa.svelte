<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import mapa from '../../../assets/Mapa-mundi.jpg'
    import { players, markers } from '../../../lib/db';

    const MAP_WIDTH = 3840; 
    const MAP_HEIGHT = 2160;

    let mapElement;
    let map;

    let playerLayer;
    let markerLayer;

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
        L.imageOverlay(mapa, bounds).addTo(map);
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);

        markerLayer = L.layerGroup().addTo(map); // Capa de Eventos (abajo)
        playerLayer = L.layerGroup().addTo(map); // Capa de Jugadores (arriba)
    });

    $: if (playerLayer && $players) {
        drawPlayers($players);
    }

    // Cada vez que $markers cambie, ejecuta esto:
    $: if (markerLayer && $markers) {
        drawMarkers($markers);
    }

    function drawPlayers(list) {
        playerLayer.clearLayers();

        list.forEach(p => {
            const html = `
                <div class="flex flex-col items-center transition-transform hover:scale-110">
                <div class="${p.color} w-8 h-8 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center text-white font-bold text-xs relative z-10">
                    ${p.name.charAt(0).toUpperCase()}
                </div>
                <span class="bg-black/80 text-white text-[10px] px-2 py-0.5 rounded mt-1 backdrop-blur-sm border border-gray-600 shadow-md font-sans z-20 whitespace-nowrap">
                    ${p.name}
                </span>
                </div>
            `;

            const icon = L.divIcon({
                html: html,
                className: '', // Quitamos estilos default de Leaflet
                iconSize: [40, 50],
                iconAnchor: [20, 25] // Centrado en el círculo
            });

            // Añadimos a la capa de jugadores, NO al mapa directamente
            L.marker([p.y, p.x], { icon }).addTo(playerLayer);
        });
    }

    function drawMarkers(list) {
        markerLayer.clearLayers();

        list.forEach(m => {
            // Color según tipo
            const colorClass = m.type === 'danger' ? 'text-red-500' : 'text-yellow-400';
            
            const html = `
                <div class="flex items-center justify-center filter drop-shadow-lg hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 ${colorClass}">
                    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                </div>
            `;

            const icon = L.divIcon({
                html: html,
                className: '',
                iconSize: [40, 40]
            });

            L.marker([m.y, m.x], { icon })
                .addTo(markerLayer)
                .bindPopup(`<strong class="text-sm font-bold text-gray-800">${m.name}</strong>`);
        });
    }
</script>

<div 
    class="w-full h-full bg-stone-900 z-10 relative outline-none" 
    bind:this={mapElement}>
</div>