<script lang="ts">
	export let max: number;
</script>

<div class="scale">
	<span class="label min">Min (0)</span>
	{#each new Array(max + 1) as _undefined, i}
		<div class="color" style:background-color="var(--color-{i})" />
	{/each}
	<span class="label max">Max ({max})</span>
</div>

<style lang="scss">
	.scale {
		display: flex;
		justify-content: center;
		height: 20px;
		width: 256px;
	}

	.color {
		flex-grow: 1;
	}

	.label {
		font-size: 14px;
		letter-spacing: -0.006em;

		&.min {
			margin-right: 4px;
		}

		&.max {
			margin-left: 4px;
		}
	}
</style>
