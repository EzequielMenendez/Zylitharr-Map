<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { players, markers } from '../../../lib/db';
    import { selectedTool, startCreation } from '../helpers/store';
    import { MARKER_TYPES } from '../../../lib/icons';
    import mapa from '../../../assets/Mapa-mundi.jpg'

    // --- CONFIGURACIÓN ---
    const MAP_IMAGE = mapa; 
    const MAP_WIDTH = 3840; 
    const MAP_HEIGHT = 2160;

    let mapElement;
    let map;

    // Capas
    let playerLayer;
    let markerLayer;

    onMount(() => {
        if (!mapElement) return;
        // --- INICIALIZAR MAPA ---
        map = L.map(mapElement, {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 2,
            zoomControl: false,
            attributionControl: false
        });

        const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];
        L.imageOverlay(MAP_IMAGE, bounds).addTo(map);
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);

        markerLayer = L.layerGroup().addTo(map);
        playerLayer = L.layerGroup().addTo(map);

        // --- EVENTO DE CLICK (Lógica DM) ---
    map.on('click', (e) => {
        // Si hay una herramienta seleccionada, iniciamos creación
        if ($selectedTool) {
            startCreation({ x: e.latlng.lng, y: e.latlng.lat });
        } 
    });
    });

    $: if (playerLayer && $players) {
        drawPlayers($players);
    }

    $: if (markerLayer && $markers) {
        drawMarkers($markers);
    }

    // --- FUNCIONES DE DIBUJO ---
    function drawPlayers(list) {
        playerLayer.clearLayers(); 
        list.forEach(p => {
            if(!p.x || !p.y)return
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
                className: '', 
                iconSize: [40, 50],
                iconAnchor: [20, 25]
            });
            L.marker([p.y, p.x], { icon }).addTo(playerLayer);
        });
    }

    function drawMarkers(list) {
        markerLayer.clearLayers();

        list.forEach(m => {
        // 1. Buscamos la configuración visual
        const config = Object.values(MARKER_TYPES).find(t => t.id === m.type) || MARKER_TYPES.INFO;
        
        // 2. Construimos el HTML con fondo
        const html = `
            <div class="flex flex-col items-center justify-center transition-transform hover:scale-110 drop-shadow-md group">
            
            <!-- EL FONDO CIRCULAR -->
            <!-- Usamos bgColor y borderColor del config -->
            <div class="w-8 h-8 rounded-full border-2 ${config.borderColor} ${config.bgColor} flex items-center justify-center shadow-lg relative z-10">
                
                <!-- EL ICONO SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ${config.color}">
                    <path fill-rule="evenodd" d="${config.iconPath}" clip-rule="evenodd" />
                </svg>

            </div>
            
            <!-- Pequeño triángulo abajo para simular un 'Pin' de mapa (Opcional, estético) -->
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black/50 -mt-1 opacity-50"></div>

            </div>
        `;

        const icon = L.divIcon({
            html: html,
            className: ''
        });

        L.marker([m.y, m.x], { icon })
            .addTo(markerLayer)
            .bindPopup(`<strong class="text-sm font-bold text-gray-800">${m.name}</strong>`);
        });
    }
</script>

<div 
    class="w-full h-full bg-stone-900 z-2 outline-none relative transition-colors duration-200" 
    class:cursor-crosshair={$selectedTool}
    bind:this={mapElement}>
</div>

<style>
    :global(.leaflet-container) {
        background: transparent !important; 
    }
    .cursor-crosshair {
        cursor: crosshair !important;
    }

    :global(.cursor-crosshair .leaflet-interactive) {
        cursor: crosshair !important;
    }
</style>