export const MARKER_TYPES = {
    DANGER: {
        id: 'danger',
        label: 'Peligro',
        color: 'text-red-600',
        bgColor: 'bg-red-900/80',
        borderColor: 'border-red-500',
        // Path del SVG (Icono de Calavera/Peligro)
        iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z' 
    },
    INFO: {
        id: 'info',
        label: 'Información',
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/80',
        borderColor: 'border-blue-500',
        // Path del SVG (Icono de Información)
        iconPath: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'
    },
    SHOP: {
        id: 'shop',
        label: 'Comercio',
        color: 'text-amber-400',
        bgColor: 'bg-amber-900/80',
        borderColor: 'border-amber-500',
        // Path del SVG (Bolsa de dinero)
        iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z' // (Placeholder, luego ponemos uno mejor)
    },
    SAFE: {
        id: 'safe',
        label: 'Refugio',
        color: 'text-green-400',
        bgColor: 'bg-green-900/80',
        borderColor: 'border-green-500',
        // Path del SVG (Escudo/Casa)
        iconPath: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'
    }
};