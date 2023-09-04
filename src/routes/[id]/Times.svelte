<script lang="ts">
	import type { PageData } from './$types';
	import { getContext } from 'svelte';
	import dayjs from '$lib/dayjs';

	export let numberOfSegments: number;
	const event = getContext('event') as PageData['event'];

	const startDate = dayjs.tz(event.pollDates[0] + 'T' + event.pollStartTime, event.timeZone);

	const times = Array(numberOfSegments + 1)
		.fill(undefined)
		.map((_undefined, i) => startDate.add(i / 2, 'hour').format('h A'));
</script>

<div class="times">
	<span>{startDate.format('z')}</span>
	{#each times as time, i}
		<div class="label" class:half-hour={i % 2}>
			<span>{time}</span>
		</div>
	{/each}
</div>

<style lang="scss">
	.times {
		flex-shrink: 0;
		width: 50px;
		display: flex;
		flex-direction: column;
		align-items: end;
		position: sticky;
		background-color: #fff;
		padding: 0 12px;
	}

	.label {
		width: max-content;
		height: 24px;

		&.half-hour {
			opacity: 0;
		}

		span {
			display: block;
			font-variant-numeric: lining-nums tabular-nums;
			font-size: 14px;
			letter-spacing: -0.006em;
			line-height: 100%;
			transform: translateY(-50%);
		}
	}
</style>
