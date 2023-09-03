<script lang="ts">
	import type { PageData } from './$types';
	import { getContext } from 'svelte';

	export let ids: string[];
	export let i: number;
	const event = getContext('event') as PageData['event'];
</script>

<div class="half-hour" style:background-color="var(--color-{ids.length})" />

<style lang="scss">
	.half-hour {
		box-sizing: border-box;
		width: 96px;
		height: 24px;
		border: 0.1px solid #fff;
	}
</style>
