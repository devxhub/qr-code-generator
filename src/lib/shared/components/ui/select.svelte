<script lang="ts">
	import { cn } from '$lib/shared/utils';

	interface Props {
		class?: string;
		value?: string | number;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
		ariaLabel?: string;
		ariaDescribedby?: string;
		onblur?: (e: Event) => void;
		onchange?: (e: Event) => void;
		onfocus?: (e: Event) => void;
	}

	let {
		class: className,
		value = $bindable(),
		disabled = false,
		required = false,
		name = '',
		id = '',
		ariaLabel = '',
		ariaDescribedby = '',
		onblur,
		onchange,
		onfocus,
		children
	}: Props & { children?: any } = $props();
</script>

<select
	bind:value
	{disabled}
	{required}
	{name}
	{id}
	aria-label={ariaLabel}
	aria-describedby={ariaDescribedby}
	class={cn(
		'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
		className
	)}
	{onblur}
	{onchange}
	{onfocus}
>
	{@render children?.()}
</select>
