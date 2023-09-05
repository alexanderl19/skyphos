<script lang="ts">
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	export let ids: string[];
	const max = getContext('max') as number;
	const peopleCount = getContext('peopleCount') as number;
</script>

<div class="half-hour" style:background-color="var(--color-{ids.length})">
	{#if ids.length === max}
		<span>
			{ids.length} / {peopleCount}
		</span>
	{/if}
</div>

<style lang="scss">
	.half-hour {
		box-sizing: border-box;
		width: 96px;
		height: 24px;
		border: 0.1px solid #fff;

		span {
			font-size: 14px;
			letter-spacing: -0.006em;
			margin: 0 4px;
		}
	}
</style>
