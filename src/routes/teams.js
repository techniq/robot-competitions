import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { csvParse, autoType } from 'd3-dsv';

/** @type {import('../../.svelte-kit/types/src/routes/index.json').RequestHandler} */
export async function get(event) {
	const csvPath = fileURLToPath(new URL('../lib/data/divisions/divisions.csv', import.meta.url));
	const csvFile = await readFile(csvPath);
	const teamsWithDivisions = csvParse(csvFile.toString(), autoType);

	return {
		body: { teamsWithDivisions }
	};
}
