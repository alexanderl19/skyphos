<script lang="ts">
	import HalfHour from './HalfHour.svelte';
	import dayjs from '$lib/dayjs';

	export let date: string;
	export let segments: string[][];
</script>

<div>
	<span class="day">{dayjs(date).format('ddd D')}</span>
	{#each segments as ids, i}
		<HalfHour {ids} {i} />
	{/each}
</div>

<style lang="scss">
	.day {
		display: block;
		height: 40px;
		text-align: center;
	}
</style>
