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
		width: 96px;
		height: 24px;
		border-top: 0.5px solid #fff;
	}
</style>
