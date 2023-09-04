<script lang="ts">
	export let width = 32;
	export let direction: 'left' | 'right' = 'left';
</script>

<div class="fade-parent">
	<div
		class="fade {direction}"
		style:width="{width}px"
		style:transform={direction === 'right' ? `translateX(-${width}px)` : ''}
	/>
</div>

<style lang="scss">
	@use '$lib/smooth-gradient' as gradients;

	.fade-parent {
		position: relative;
		align-self: stretch;
		flex-shrink: 0;
	}

	.fade {
		position: absolute;
		height: 100%;

		&.left {
			background: linear-gradient(0.25turn, gradients.scrim(#fff));
		}

		&.right {
			background: linear-gradient(0.75turn, gradients.scrim(#fff));
		}
	}
</style>
