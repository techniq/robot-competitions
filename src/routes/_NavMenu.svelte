<script lang="ts">
	import { mdiAccountGroup, mdiCodeBraces, mdiHome } from '@mdi/js';
	import { NavItem } from 'svelte-ux';
</script>

<NavItem text="Home" icon={mdiHome} path="/" class="pl-6 py-2 mt-2" />

<div class="pt-4 pb-2 pl-4 text-xs text-gray-200 font-bold">General</div>
<NavItem text="Teams" icon={mdiAccountGroup} path="/teams" class="pl-6 py-2" />
