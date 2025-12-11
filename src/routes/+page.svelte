<script lang="ts">
	import { QRCodeCustomizer, QRCodeForm, QRCodePreview } from '$lib/qr-generator/components';
	import type { QRCodeOptions } from '$lib/qr-generator/types';
	import {
		createEmptyFormData,
		formDataToQRCodeData,
		generateQRCodeImage,
		generateQRContent,
		getFormDataForComponent,
		QR_TYPES,
		updateFormDataByType,
		type FormData
	} from '$lib/qr-generator/utils';
	import CTA from '$lib/shared/components/CTA.svelte';
	import { Label } from '$lib/shared/components/ui';

	let selectedType = $state('url');
	let qrCodeUrl = $state('');
	let qrContent = $state('');
	let isGenerating = $state(false);
	let error = $state('');
	let hasUserInteracted = $state(false);

	let qrSize = $state(400);
	let foregroundColor = $state('#000000');
	let backgroundColor = $state('#ffffff');
	let errorCorrection = $state<'L' | 'M' | 'Q' | 'H'>('M');

	let formData = $state<FormData>(createEmptyFormData());

	function markUserInteraction() {
		hasUserInteracted = true;
	}

	function handleFormDataChange(newData: Record<string, string>) {
		markUserInteraction();
		formData = updateFormDataByType(selectedType, formData, newData);
	}

	async function generateQrCode(): Promise<void> {
		if (!hasUserInteracted) return;

		const qrData = formDataToQRCodeData(selectedType, formData);
		const data = generateQRContent(qrData);

		if (!data.trim()) {
			qrCodeUrl = '';
			qrContent = '';
			error = '';
			return;
		}

		isGenerating = true;
		error = '';

		try {
			const options: QRCodeOptions = {
				size: qrSize,
				foregroundColor,
				backgroundColor,
				errorCorrection
			};

			const url = await generateQRCodeImage(qrData, options);
			qrCodeUrl = url;
			qrContent = data;
		} catch (err) {
			error = 'Failed to generate QR code. Please check your input.';
			qrCodeUrl = '';
			qrContent = '';
			console.error('QR Code generation error:', err);
		} finally {
			isGenerating = false;
		}
	}

	$effect(() => {
		if (hasUserInteracted) {
			generateQrCode();
		}
	});

	function handleOptionsChange(options: QRCodeOptions) {
		qrSize = options.size;
		foregroundColor = options.foregroundColor;
		backgroundColor = options.backgroundColor;
		errorCorrection = options.errorCorrection;
		markUserInteraction();
	}

	function handleTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		selectedType = target.value;
		formData = createEmptyFormData();
		error = '';
		hasUserInteracted = false;
	}
</script>

<svelte:head>
	<title>QR Code Generator - Create QR Codes for URLs, Text, Phone, and More</title>
	<meta
		name="description"
		content="Generate QR codes for websites, text, phone numbers, WiFi networks, and more. Free, fast, and works on all devices."
	/>
</svelte:head>

<div class="min-h-[calc(100vh-150px)] dark:bg-gray-900">
	<div class="mx-auto">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">QR Code Generator</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Create QR codes for websites, text, phone numbers, WiFi networks, and more
			</p>
		</div>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Left Column: Form Controls -->
			<div class="space-y-6">
				<!-- QR Code Type Selection -->
				<div class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
					<Label htmlFor="qr-type-select" class="mb-2 block text-base font-medium dark:text-white">
						QR Code Type
					</Label>
					<select
						id="qr-type-select"
						class="w-full rounded-md border p-3 dark:bg-gray-700 dark:text-white"
						bind:value={selectedType}
						onchange={handleTypeChange}
						aria-label="Select QR code type"
					>
						{#each QR_TYPES as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<!-- Enter Details -->
				<div class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
					<Label class="mb-4 block text-lg font-semibold text-gray-900 dark:text-white">
						Enter Details
					</Label>
					<QRCodeForm
						{selectedType}
						qrData={getFormDataForComponent(selectedType, formData, formDataToQRCodeData)}
						onDataChange={handleFormDataChange}
					/>
					{#if error}
						<div class="mt-2 text-sm text-red-500" role="alert" aria-live="polite">
							{error}
						</div>
					{/if}
				</div>

				<!-- Customize QR Code -->
				<QRCodeCustomizer
					options={{
						size: qrSize,
						foregroundColor,
						backgroundColor,
						errorCorrection
					}}
					onUpdate={handleOptionsChange}
				/>
			</div>

			<!-- Right Column: QR Code Preview -->
			<div class="space-y-6">
				<QRCodePreview
					{qrCodeUrl}
					{isGenerating}
					{error}
					{selectedType}
					{qrContent}
					qrOptions={{
						size: qrSize,
						foregroundColor,
						backgroundColor,
						errorCorrection
					}}
					typeLabel={QR_TYPES.find((t) => t.value === selectedType)?.label || ''}
				/>
			</div>
		</div>

		<div class="mt-10">
			<CTA />
		</div>

		<div
			class="mt-10 border-t pt-8 text-center text-gray-600 dark:border-gray-600 dark:text-gray-400"
		>
			<p class="mb-2">
				All QR codes are generated locally in your browser. No data is sent to our servers.
			</p>
			<p class="text-sm">
				Supports industry-standard formats for maximum compatibility across all devices.
			</p>
		</div>
	</div>
</div>
