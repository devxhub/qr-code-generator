<script lang="ts">
	import { Label, Select, Slider } from '$lib/shared/components/ui';
	import type { QRCodeOptions } from '../types';

	interface Props {
		options: QRCodeOptions;
		onUpdate: (options: QRCodeOptions) => void;
	}

	let { options, onUpdate }: Props = $props();

	// Local state for size to enable binding with Slider
	let size = $state(options.size);

	// Ensure color values are always valid hex colors
	const foregroundColor = $derived(options.foregroundColor || '#000000');
	const backgroundColor = $derived(options.backgroundColor || '#ffffff');

	// Sync size when options change externally
	$effect(() => {
		size = options.size;
	});

	// Update options when size changes
	$effect(() => {
		if (size !== options.size) {
			updateOption('size', size);
		}
	});

	function updateOption<K extends keyof QRCodeOptions>(key: K, value: QRCodeOptions[K]): void {
		onUpdate({
			...options,
			[key]: value
		});
	}

	function handleInput(field: keyof QRCodeOptions) {
		return (event: Event) => {
			const target = event.target as HTMLInputElement | HTMLSelectElement;
			const value = field === 'size' ? parseInt(target.value) : target.value;
			updateOption(field, value as QRCodeOptions[typeof field]);
		};
	}
</script>

<div
	class="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
>
	<h3 class="text-lg font-semibold text-slate-900 dark:text-white">Customize QR Code</h3>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Size Range Input -->
		<div class="space-y-2">
			<Label htmlFor="size-range"
				>Size: <span class="font-semibold text-slate-900 dark:text-white">{size}px</span></Label
			>
			<Slider id="size-range" min={200} max={800} step={50} bind:value={size} class="mt-2" />
		</div>

		<!-- Error Correction Select -->
		<div class="space-y-2">
			<Label htmlFor="error-correction-select">Error Correction</Label>
			<Select
				id="error-correction-select"
				value={options.errorCorrection}
				onchange={handleInput('errorCorrection')}
			>
				<option value="L">Low (7%)</option>
				<option value="M">Medium (15%)</option>
				<option value="Q">Quartile (25%)</option>
				<option value="H">High (30%)</option>
			</Select>
		</div>

		<!-- Foreground Color Input -->
		<div class="space-y-2">
			<Label htmlFor="foreground-color">Foreground Color</Label>
			<input
				id="foreground-color"
				type="color"
				value={foregroundColor}
				oninput={handleInput('foregroundColor')}
				class="h-10 w-full cursor-pointer rounded-md border border-slate-200 dark:border-slate-800"
			/>
		</div>

		<!-- Background Color Input -->
		<div class="space-y-2">
			<Label htmlFor="background-color">Background Color</Label>
			<input
				id="background-color"
				type="color"
				value={backgroundColor}
				oninput={handleInput('backgroundColor')}
				class="h-10 w-full cursor-pointer rounded-md border border-slate-200 dark:border-slate-800"
			/>
		</div>
	</div>
</div>
