<script lang="ts">
	import type { PageData } from './$types';
	import { setContext } from 'svelte';
	import Day from './Day.svelte';
	import { Poline, positionFunctions } from 'poline';
	import { dragscroll } from '@svelte-put/dragscroll';
	import Times from './Times.svelte';
	import Fade from './Fade.svelte';
	import Scale from './Scale.svelte';

	export let data: PageData;
	const event = data.event;
	setContext('event', event);

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

	const max = Array.from(dates.values())
		.flatMap((day) => day.map((ids) => ids.length))
		.reduce((a, b) => Math.max(a, b), -Infinity);

	setContext('max', max);
	setContext('peopleCount', event.pollResponses.length);

	const colors = new Poline({
		positionFunctionX: positionFunctions.linearPosition,
		positionFunctionY: positionFunctions.exponentialPosition,
		positionFunctionZ: positionFunctions.linearPosition,
		numPoints: max,
		anchorColors: [
			[7, 0.25, 1],
			[125, 0.8, 0.5]
		]
	});

	const colorStyle = colors.colorsCSS.map((colorCss, i) => `--color-${i}: ${colorCss};`).join('');
</script>

<main style={colorStyle}>
	<div class="header">
		<h1>{event.title}</h1>
		<p class="description">{event.description}</p>
		<Scale {max} />
	</div>
	<div class="schedule-parent">
		<Times {numberOfSegments} />
		<Fade />
		<div use:dragscroll class="schedule">
			{#each Array.from(dates.entries()) as [date, segments]}
				<Day {date} {segments} />
			{/each}
		</div>
		<Fade direction="right" />
	</div>
</main>

<style lang="scss">
	$padding: 24px;
	$times-width: 50px + $padding + 24px;
	$max-width-breakpoint: 1312px;
	$max-width: $max-width-breakpoint - $times-width * 2;

	:global(body) {
		margin: 0;
		font-family: 'Inter';
		font-size: 16px;
		font-weight: 400;
		letter-spacing: -0.011em;
		line-height: 22px;
	}

	.header {
		max-width: $max-width;
		margin: 24px;

		@media (min-width: 672px) {
			margin-left: $times-width;
		}

		@media (min-width: $max-width-breakpoint) {
			max-width: $max-width;
			margin: 24px auto;
		}

		h1 {
			font-family: 'Archivo';
			font-weight: 400;
			font-size: 20px;
			line-height: 28px;
		}

		.description {
			margin: 12px 0;
			font-weight: 400;
			font-size: 16px;
			line-height: 24px;
			max-width: 60ch;
		}
	}

	.schedule-parent {
		padding-left: calc((100vw - $max-width) / 2 - 50px - $padding - 24px);
		display: flex;
		align-items: stretch;
		justify-content: stretch;

		.schedule {
			display: flex;
			overflow-x: auto;
			box-sizing: border-box;
			padding: 0 max(calc((100vw - $max-width) / 2), $padding) 0 $padding;
		}
	}
</style>
