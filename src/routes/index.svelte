<script lang="ts">
	import clsx from 'clsx';
	import { rollup } from 'd3-array';

	import {
		AppBar,
		Card,
		fetchStore,
		localStore,
		Table,
		tableCell,
		stickyContext,
		remainingViewportHeight,
		debounceStore,
		TextField,
		Paginate,
		TablePagination,
		SelectField
	} from 'svelte-ux';
	import { getCellContent } from 'svelte-ux/utils/table';
	import { writable } from 'svelte/store';

	import { mdiMagnify } from '@mdi/js';

	export let teamsWithDivisions: any[];

	const keys = Object.keys(teamsWithDivisions[0]);
	const teamDivisionMap = rollup(
		teamsWithDivisions,
		(items) => items[0].Division,
		(d) => d[keys[0]] // TODO: Figure out why d['License'] doesn't work
	);

	const season = '155';
	const postSeason = '1';
	const gradeLevel = 'Elementary';
	const query = fetchStore();
	const localData = localStore('api-cache', []);
	$: query.fetch(
		`https://www.robotevents.com/api/seasons/${season}/skills?post_season=${postSeason}&grade_level=${gradeLevel}`,
		{
			disabled: $localData != null,
			onDataChange: (data) => {
				const dataWithDivisions = data.map((d) => ({
					...d,
					division: teamDivisionMap.get(d.team.team)
				}));
				$localData = dataWithDivisions;
			}
		}
	);
	const divisions = [...new Set($localData.map((x) => x.division))]
		.filter((d) => d)
		.sort()
		.map((d) => ({
			name: d,
			value: d
		}));

	let search = writable('');
	let debouncedSearch = debounceStore(search);
	let divisionSelected: string | null = null;

	$: tableData = $localData.filter((d) => {
		let divisionMatch = true;
		if (divisionSelected) {
			divisionMatch = d.division === divisionSelected;
		}

		let searchMatch = true;
		const search = $debouncedSearch?.toLowerCase();
		if (!search || search == '') {
			// return true;
		} else {
			searchMatch = Object.values(d.team).some((value) => {
				if (typeof value === 'string') {
					return value.toLowerCase().includes(search);
				}
			});
			// return (
			// 	// TODO: check all properties using Object.entites() (or similar)
			// 	d.team.team.toLowerCase().includes(search) || d.team.teamName.toLowerCase().includes(search)
			// );
		}

		return divisionMatch && searchMatch;
	});
</script>

<AppBar title="Teams" />

<main class="p-2">
	<div class="mb-2 grid grid-cols-[1fr,auto] gap-2">
		<TextField label="Search" icon={mdiMagnify} bind:value={$search} />
		<SelectField label="Division" bind:value={divisionSelected} items={divisions} />
	</div>

	<Card>
		<div
			use:stickyContext={{ type: 'container' }}
			use:remainingViewportHeight={{
				max: true,
				offset: 8 /* bottom padding */
			}}
		>
			<Paginate items={tableData} perPage={100} let:pagination let:pageItems>
				<Table
					data={pageItems}
					columns={[
						{ name: 'rank', header: 'Rank', format: 'integer', sticky: { top: true } },
						{ name: 'team.team', header: 'Number', sticky: { top: true /*, left: true*/ } },
						{ name: 'team.teamName', header: 'Name', sticky: { top: true } },
						{ name: 'team.city', header: 'City', sticky: { top: true } },
						{ name: 'team.region', header: 'Region', sticky: { top: true } },
						{ name: 'team.country', header: 'Country', sticky: { top: true } },
						// { name: 'team.link', header: 'link', sticky: { top: true } }
						{
							name: 'scores',
							header: 'Scores',
							columns: [
								{
									name: 'scores.maxDriver',
									header: 'Driver',
									format: 'integer',
									sticky: { top: true }
								},
								{
									name: 'scores.maxProgramming',
									header: 'Program',
									format: 'integer',
									sticky: { top: true }
								},
								{
									name: 'scores.score',
									header: 'Total',
									format: 'integer',
									sticky: { top: true }
								}
							],
							sticky: { top: true }
						},
						{ name: 'division', header: 'Division', sticky: { top: true } }
					]}
					classes={{
						th: 'text-xs font-medium text-secondary px-2 py-1 bg-gray-300 whitespace-nowrap text-left',
						td: 'text-sm px-2 cursor-pointer border-r border-b border-gray-300 whitespace-nowrap'
					}}
					styles={{
						th: 'box-shadow: inset 0 0 0 0.5px var(--color-gray-400);'
					}}
				>
					<tbody slot="data" let:data let:columns={rowColumns}>
						{#each data ?? [] as rowData, rowIndex}
							<tr
								on:click={(e) => {
									// selected = rowData;
								}}
							>
								{#each rowColumns as column}
									<td
										use:tableCell={{ column, rowData, rowIndex }}
										class={clsx(
											'text-sm px-2 cursor-pointer border-r border-b border-gray-300 whitespace-nowrap h-7',
											(column.sticky?.left || column.sticky?.right) && 'bg-white'
										)}
									>
										{#if column.name === 'team.link'}
											TODO
										{:else}
											{getCellContent(column, rowData, rowIndex)}
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</Table>
				<TablePagination {pagination} class="sticky bottom-0 left-0 bg-white" />
			</Paginate>
		</div>
	</Card>
</main>
