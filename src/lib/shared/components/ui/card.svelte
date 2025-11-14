<script lang="ts">
	import { cn } from '$lib/shared/utils';

	interface Props {
		class?: string;
		children?: any;
	}

	let { class: className, children }: Props = $props();
</script>

<div
	class={cn(
		'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
		className
	)}
>
	{@render children?.()}
</div>
