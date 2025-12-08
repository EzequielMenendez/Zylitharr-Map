import Login from './pages/Login/Login.svelte';
import Mapa from './pages/Mapa/Modul.svelte';
import Perfil from './pages/Perfil/Perfil.svelte';
import Usuarios from './pages/Usuarios/Usuarios.svelte';

export const routes = {
    '/': Mapa,
    '/login': Login,
    '/users': Usuarios,
    '/profile': Perfil
};