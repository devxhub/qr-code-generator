<script lang="ts">
	import { cn } from '$lib/shared/utils';

	type Variant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
	type Size = 'default' | 'sm' | 'lg' | 'icon';

	interface Props {
		class?: string;
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (e: MouseEvent) => void;
		'aria-label'?: string;
		children?: any;
	}

	const baseStyles =
		'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300';

	const variants: Record<Variant, string> = {
		default:
			'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200',
		secondary:
			'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700',
		destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
		outline:
			'border border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800',
		ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
		link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50'
	};

	const sizes: Record<Size, string> = {
		default: 'h-10 px-4 py-2',
		sm: 'h-9 rounded-md px-3',
		lg: 'h-11 rounded-md px-8',
		icon: 'h-10 w-10'
	};

	let {
		class: className,
		variant = 'default',
		size = 'default',
		disabled = false,
		type = 'button',
		onclick,
		'aria-label': ariaLabel,
		children
	}: Props = $props();

	function handleClick(e: MouseEvent) {
		if (onclick && !disabled) {
			onclick(e);
		}
	}
</script>

<button
	{type}
	{disabled}
	class={cn(baseStyles, variants[variant], sizes[size], !disabled && 'cursor-pointer', className)}
	onclick={handleClick}
	aria-label={ariaLabel}
>
	{@render children?.()}
</button>
