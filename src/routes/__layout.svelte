<script lang="ts">
	import { AppLayout } from 'svelte-ux';
	import NavMenu from './_NavMenu.svelte';

	import '../app.css';
</script>

<AppLayout>
	<nav slot="nav" class="nav h-full">
		<NavMenu />
	</nav>

	<slot />
</AppLayout>
