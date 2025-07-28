<script lang="ts">
	import type { QRCodeOptions } from '../types.js';

	interface Props {
		options: QRCodeOptions;
		onUpdate: (options: QRCodeOptions) => void;
	}

	let { options, onUpdate }: Props = $props();

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

<div class="space-y-4 rounded-lg border p-4 dark:border-gray-600 dark:bg-gray-800">
	<h3 class="text-lg font-semibold dark:text-white">Customize QR Code</h3>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<label for="size-range" class="mb-1 block text-sm font-medium dark:text-white">Size</label>
			<input
				id="size-range"
				type="range"
				min="200"
				max="800"
				step="50"
				value={options.size}
				oninput={handleInput('size')}
				class="w-full"
			/>
			<span class="text-xs text-gray-500">{options.size}px</span>
		</div>

		<div>
			<label for="error-correction-select" class="mb-1 block text-sm font-medium dark:text-white"
				>Error Correction</label
			>
			<select
				id="error-correction-select"
				value={options.errorCorrection}
				onchange={handleInput('errorCorrection')}
				class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			>
				<option value="L">Low (7%)</option>
				<option value="M">Medium (15%)</option>
				<option value="Q">Quartile (25%)</option>
				<option value="H">High (30%)</option>
			</select>
		</div>

		<div>
			<label for="foreground-color" class="mb-1 block text-sm font-medium dark:text-white"
				>Foreground Color</label
			>
			<input
				id="foreground-color"
				type="color"
				value={options.foregroundColor}
				oninput={handleInput('foregroundColor')}
				class="h-10 w-full rounded-md border"
			/>
		</div>

		<div>
			<label for="background-color" class="mb-1 block text-sm font-medium dark:text-white"
				>Background Color</label
			>
			<input
				id="background-color"
				type="color"
				value={options.backgroundColor}
				oninput={handleInput('backgroundColor')}
				class="h-10 w-full rounded-md border"
			/>
		</div>
	</div>
</div>
