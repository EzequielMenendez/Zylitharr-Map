<script>
  import Router from 'svelte-spa-router';
  import { routes } from './routes';
  import Header from './lib/componentes/Header.svelte';
</script>

<div class="flex flex-col h-screen w-full bg-stone-100">
  <Header />
  <main class="flex-1 relative overflow-hidden">
    <Router {routes} />
  </main>
</div>