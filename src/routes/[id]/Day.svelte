<script lang="ts">
	import HalfHour from './HalfHour.svelte';
	import dayjs from '$lib/dayjs';

	export let date: string;
	export let segments: string[][];
</script>

<div class="day">
	<span>{dayjs(date).format('ddd, MMM D')}</span>
	{#each segments as ids, i}
		<HalfHour {ids} {i} />
	{/each}
</div>
