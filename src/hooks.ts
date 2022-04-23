import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// TODO: Disable server-side until `location` is handled in __layout.svelte (and possible other non-SSR usage)
	// TODO: Disable server-side rendering until AppLayout shift is fixed (https://github.com/techniq/svelte-ux/issues/22).
	// Used to be `ssr: false` in `svelte.config.js`.
	// See https://kit.svelte.dev/docs/hooks#handle
	const response = await resolve(event, {
		ssr: false
	});

	return response;
};
