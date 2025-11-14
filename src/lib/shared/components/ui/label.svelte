<script lang="ts">
	import { cn } from '$lib/shared/utils';

	interface Props {
		class?: string;
		htmlFor?: string;
		children?: any;
	}

	let { class: className, htmlFor = '', children }: Props = $props();
</script>

<label
	for={htmlFor}
	class={cn(
		'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
>
	{@render children?.()}
</label>
