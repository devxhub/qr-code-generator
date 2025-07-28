<script lang="ts">
	import QRCodeCustomizer from '$lib/components/QRCodeCustomizer.svelte';
	import QRCodeForm from '$lib/components/QRCodeForm.svelte';
	import QRCodePreview from '$lib/components/QRCodePreview.svelte';
	import { generateQRContent } from '$lib/qr-generator.js';
	import type { QRCodeData, QRCodeOptions, QRCodeType } from '$lib/types.js';

	let selectedType: QRCodeType = $state('url');
	let qrData: QRCodeData = $state({
		type: 'url',
		data: {}
	});
	let options: QRCodeOptions = $state({
		size: 400,
		foregroundColor: '#000000',
		backgroundColor: '#ffffff',
		errorCorrection: 'M'
	});

	const types: { value: QRCodeType; label: string }[] = [
		{ value: 'url', label: 'Website URL' },
		{ value: 'vcard', label: 'Contact Card (vCard)' },
		{ value: 'text', label: 'Plain Text' },
		{ value: 'sms', label: 'SMS Message' },
		{ value: 'email', label: 'Email' },
		{ value: 'wifi', label: 'WiFi Network' },
		{ value: 'phone', label: 'Phone Number' },
		{ value: 'location', label: 'GPS Location' }
	];

	let errors: string[] = $state([]);
	let qrContent: string = $state('');

	$effect(() => {
		qrData.type = selectedType;
		qrData.data = {};
		errors = [];
	});

	$effect(() => {
		if (validateForm()) {
			qrContent = generateQRContent(qrData);
		} else {
			qrContent = '';
		}
	});

	function validateForm(): boolean {
		const currentErrors: string[] = [];
		const data = qrData.data;

		switch (qrData.type) {
			case 'url':
				if (!data.url || !/^https?:\/\/.+/.test(data.url)) {
					currentErrors.push('Please enter a valid URL.');
				}
				break;
			case 'vcard':
				if (!data.name) currentErrors.push('Name is required.');
				if (!data.phone) currentErrors.push('Phone number is required.');
				if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
					currentErrors.push('Please enter a valid email address.');
				}
				break;
			case 'text':
				if (!data.text) currentErrors.push('Text content is required.');
				break;
			case 'sms':
				if (!data.phone) currentErrors.push('Phone number is required.');
				break;
			case 'email':
				if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
					currentErrors.push('Please enter a valid email address.');
				}
				break;
			case 'wifi':
				if (!data.ssid) currentErrors.push('Network name (SSID) is required.');
				if (!data.encryption) currentErrors.push('Security type is required.');
				if (data.encryption !== 'nopass' && !data.password) {
					currentErrors.push('Password is required for secured networks.');
				}
				break;
			case 'phone':
				if (!data.phone) currentErrors.push('Phone number is required.');
				break;
			case 'location':
				if (!data.latitude || !data.longitude) {
					currentErrors.push('Latitude and longitude are required.');
				}
				if (
					data.latitude &&
					(isNaN(Number(data.latitude)) || Math.abs(Number(data.latitude)) > 90)
				) {
					currentErrors.push('Latitude must be between -90 and 90.');
				}
				if (
					data.longitude &&
					(isNaN(Number(data.longitude)) || Math.abs(Number(data.longitude)) > 180)
				) {
					currentErrors.push('Longitude must be between -180 and 180.');
				}
				break;
		}

		errors = currentErrors;
		return currentErrors.length === 0;
	}

	function updateQRData(data: Record<string, string>): void {
		qrData = {
			...qrData,
			data
		};
	}

	function updateOptions(newOptions: QRCodeOptions): void {
		options = newOptions;
	}

	function handleTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		selectedType = target.value as QRCodeType;
	}
</script>

<svelte:head>
	<title>QR Code Generator - Create QR Codes for URLs, vCards, WiFi, and More</title>
	<meta
		name="description"
		content="Generate QR codes for websites, contact cards, WiFi networks, and more. Free, fast, and works on all devices."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto px-4 py-8">
		<div class="mx-auto max-w-6xl">
			<!-- Header -->
			<div class="mb-8 text-center">
				<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">QR Code Generator</h1>
				<p class="text-lg text-gray-600 dark:text-gray-300">
					Create QR codes for websites, contact cards, WiFi networks, and more
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Left Column: Form -->
				<div class="space-y-6">
					<!-- Type Selection -->
					<div
						class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800"
					>
						<label
							for="qr-type-select"
							class="mb-2 block text-sm font-medium text-gray-700 dark:text-white"
						>
							QR Code Type
						</label>
						<select
							id="qr-type-select"
							bind:value={selectedType}
							onchange={handleTypeChange}
							class="w-full rounded-md border p-3 dark:bg-gray-700 dark:text-white"
						>
							{#each types as type (type.value)}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>

					<!-- Form Fields -->
					<div
						class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800"
					>
						<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Enter Details</h2>
						<QRCodeForm {selectedType} {qrData} onDataChange={updateQRData} />
					</div>

					<!-- Customization Options -->
					<QRCodeCustomizer {options} onUpdate={updateOptions} />

					<!-- Error Messages -->
					{#if errors.length > 0}
						<div
							class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/20"
						>
							<div class="flex">
								<div class="ml-3">
									<h3 class="text-sm font-medium text-red-800 dark:text-red-200">
										Please fix the following errors:
									</h3>
									<div class="mt-2 text-sm text-red-700 dark:text-red-300">
										<ul class="list-disc space-y-1 pl-5">
											{#each errors as error, index (index)}
												<li>{error}</li>
											{/each}
										</ul>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Column: Preview -->
				<div class="space-y-6">
					<div
						class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800"
					>
						<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
							QR Code Preview
						</h2>

						{#if qrContent && errors.length === 0}
							<QRCodePreview content={qrContent} {options} />
						{:else}
							<div
								class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
							>
								<p class="text-gray-500 dark:text-gray-400">
									{errors.length > 0
										? 'Fix errors to generate QR code'
										: 'Fill in the details to generate QR code'}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Footer -->
			<footer
				class="mt-16 border-t pt-8 text-center text-gray-600 dark:border-gray-600 dark:text-gray-400"
			>
				<p class="mb-2">
					All QR codes are generated locally in your browser. No data is sent to our servers.
				</p>
				<p class="text-sm">
					Supports industry-standard formats for maximum compatibility across all devices.
				</p>
			</footer>
		</div>
	</div>
</div>
