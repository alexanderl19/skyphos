<script lang="ts">
	import type { PageData } from './$types';
	import { setContext } from 'svelte';
	import Day from './Day.svelte';
	import { Poline } from 'poline';
	import { dragscroll } from '@svelte-put/dragscroll';
	import Times from './Times.svelte';
	import Fade from './Fade.svelte';

	export let data: PageData;
	const event = data.event;
	setContext('event', event);

	const colors = new Poline({
		numPoints: 6,
		anchorColors: [
			[309, 0.72, 0.8],
			[67, 0.32, 0.08]
		]
	});

	const pollDates = event.pollDates;
	const pollStartTime = event.pollStartTime.split(':');
	const pollStartHour = parseInt(pollStartTime[0]) + parseInt(pollStartTime[1]) / 60;
	const pollEndTimeSplit = event.pollEndTime.split(':');
	const pollEndHour = parseInt(pollEndTimeSplit[0]) + parseInt(pollEndTimeSplit[1]) / 60 || 24;

	const numberOfSegments = Math.floor((pollEndHour - pollStartHour) * 2);

	const dates = new Map(
		pollDates.map((pollDate) => [pollDate, new Array<string[]>(numberOfSegments).fill([])])
	);

	event.pollResponses.forEach(({ id, availabilities }) => {
		availabilities.forEach(({ start, end }) => {
			const date = start.slice(0, 10);

			const segmentStartTime = start.split('T')[1].split(':');
			const segmentStartHour = parseInt(segmentStartTime[0]) + parseInt(segmentStartTime[1]) / 60;
			const segmentEndTime = end.split('T')[1].split(':');
			const segmentEndHour = parseInt(segmentEndTime[0]) + parseInt(segmentEndTime[1]) / 60 || 24;

			for (
				let i = (segmentStartHour - pollStartHour) * 2;
				i < (segmentEndHour - pollStartHour) * 2;
				i++
			) {
				const segments = dates.get(date);
				if (!segments) throw new Error('Availability date is outside of poll range.');
				segments[i] = [id, ...segments[i]];
			}
		});
	});

	const colorStyle = colors.colorsCSS.map((colorCss, i) => `--color-${i}: ${colorCss};`).join('');
</script>

<div class="header">
	<h1>{event.title}</h1>
	<span>{event.description}</span>
	<span>{event.timeZone}</span>
</div>
<div class="schedule-parent">
	<Times {numberOfSegments} />
	<Fade />
	<div use:dragscroll class="schedule" style={colorStyle}>
		{#each Array.from(dates.entries()) as [date, segments]}
			<Day {date} {segments} />
		{/each}
	</div>
	<Fade direction="right" />
</div>

<style lang="scss">
	$max-width: 1056px;

	:global(body) {
		margin: 0;
		font-family: 'Inter';
		font-size: 16px;
		font-weight: 400;
		letter-spacing: -0.011em;
		line-height: 22px;
	}

	.header {
		margin: 0 auto;
		padding: 24px;
		max-width: $max-width;

		h1 {
			font-family: 'Archivo';
			font-weight: 400;
			font-size: 28px;
			line-height: 36px;
		}
	}

	.schedule-parent {
		$padding: 24px;

		padding-left: calc((100vw - $max-width) / 2 - 50px - $padding);
		display: flex;
		align-items: stretch;
		justify-content: stretch;

		.schedule {
			display: flex;
			overflow-x: auto;
			box-sizing: border-box;
			padding: 0 calc((100vw - $max-width) / 2) 0 $padding;
		}
	}
</style>
