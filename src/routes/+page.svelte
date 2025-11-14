<script lang="ts">
	import { QRCodeCustomizer, QRCodeForm, QRCodePreview } from '$lib/qr-generator/components';
	import type { QRCodeOptions } from '$lib/qr-generator/types';
	import {
		formDataToQRCodeData,
		generateQRCodeImage,
		generateQRContent,
		type FormData
	} from '$lib/qr-generator/utils';

	interface QrType {
		value: string;
		label: string;
	}

	interface ErrorLevel {
		value: 'L' | 'M' | 'Q' | 'H';
		label: string;
	}

	const qrTypes: QrType[] = [
		{ value: 'url', label: 'Website URL' },
		{ value: 'contact', label: 'Contact Card' },
		{ value: 'text', label: 'Plain Text' },
		{ value: 'sms', label: 'SMS Message' },
		{ value: 'email', label: 'Email' },
		{ value: 'wifi', label: 'WiFi Network' },
		{ value: 'phone', label: 'Phone Number' },
		{ value: 'location', label: 'GPS Location' }
	];

	const errorLevels: ErrorLevel[] = [
		{ value: 'L', label: 'Low (7%)' },
		{ value: 'M', label: 'Medium (15%)' },
		{ value: 'Q', label: 'Quartile (25%)' },
		{ value: 'H', label: 'High (30%)' }
	];

	// State using Svelte 5 runes
	let selectedType = $state('url');
	let qrCodeUrl = $state('');
	let isGenerating = $state(false);
	let error = $state('');
	let hasUserInteracted = $state(false);

	// Customization options
	let qrSize = $state(400);
	let foregroundColor = $state('#000000');
	let backgroundColor = $state('#ffffff');
	let errorCorrection = $state<'L' | 'M' | 'Q' | 'H'>('M');

	// Form data for different types - all empty by default
	let formData = $state<FormData>({
		url: { url: '' },
		contact: {
			firstName: '',
			lastName: '',
			organization: '',
			phone: '',
			email: '',
			website: '',
			address: ''
		},
		text: { text: '' },
		sms: { phone: '', message: '' },
		email: { email: '', subject: '', body: '' },
		wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
		phone: { phone: '' },
		location: { latitude: '', longitude: '' }
	});

	// Convert formData to component format
	function getQRCodeData() {
		return formDataToQRCodeData(selectedType, formData);
	}

	// Get current form data as flat structure for QRCodeForm
	function getFormDataForComponent() {
		const qrData = getQRCodeData();
		// For contact type, we need to pass the flat structure
		if (selectedType === 'contact') {
			return {
				type: 'contact' as const,
				data: {
					firstName: formData.contact.firstName,
					lastName: formData.contact.lastName,
					organization: formData.contact.organization,
					phone: formData.contact.phone,
					email: formData.contact.email,
					website: formData.contact.website,
					address: formData.contact.address
				}
			};
		}
		return qrData;
	}

	// Track user interaction
	function markUserInteraction() {
		hasUserInteracted = true;
	}

	// Handle form data change from QRCodeForm
	function handleFormDataChange(newData: Record<string, string>) {
		markUserInteraction();

		// Update formData based on selected type
		switch (selectedType) {
			case 'url':
				formData.url.url = newData.url || '';
				break;
			case 'contact':
				formData.contact = {
					firstName: newData.firstName || '',
					lastName: newData.lastName || '',
					organization: newData.organization || '',
					phone: newData.phone || '',
					email: newData.email || '',
					website: newData.website || '',
					address: newData.address || ''
				};
				break;
			case 'text':
				formData.text.text = newData.text || '';
				break;
			case 'sms':
				formData.sms.phone = newData.phone || '';
				formData.sms.message = newData.message || '';
				break;
			case 'email':
				formData.email.email = newData.email || '';
				formData.email.subject = newData.subject || '';
				formData.email.body = newData.message || '';
				break;
			case 'wifi':
				formData.wifi.ssid = newData.ssid || '';
				formData.wifi.password = newData.password || '';
				formData.wifi.security = newData.encryption || 'WPA';
				formData.wifi.hidden = newData.hidden === 'true';
				break;
			case 'phone':
				formData.phone.phone = newData.phone || '';
				break;
			case 'location':
				formData.location.latitude = newData.latitude || '';
				formData.location.longitude = newData.longitude || '';
				break;
		}
	}

	// Generate QR code
	async function generateQrCode(): Promise<void> {
		if (!hasUserInteracted) return;

		const qrData = getQRCodeData();

		// Generate content string to check if we have data (matching original logic)
		const data = generateQRContent(qrData);

		if (!data.trim()) {
			qrCodeUrl = '';
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
		} catch (err) {
			error = 'Failed to generate QR code. Please check your input.';
			qrCodeUrl = '';
			console.error('QR Code generation error:', err);
		} finally {
			isGenerating = false;
		}
	}

	// Svelte 5 reactive effect to replace $: statement
	$effect(() => {
		// Access all reactive dependencies to ensure this runs when they change
		const currentType = selectedType;
		const currentFormData = formData;
		const currentSize = qrSize;
		const currentForeground = foregroundColor;
		const currentBackground = backgroundColor;
		const currentErrorCorrection = errorCorrection;
		const currentHasUserInteracted = hasUserInteracted;

		// Auto-generate QR code when values change (only after user interaction)
		if (hasUserInteracted) {
			generateQrCode();
		}
	});

	// Handle customization options change
	function handleOptionsChange(options: QRCodeOptions) {
		qrSize = options.size;
		foregroundColor = options.foregroundColor;
		backgroundColor = options.backgroundColor;
		errorCorrection = options.errorCorrection;
		markUserInteraction();
	}

	// Reset form when type changes
	function handleTypeChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		selectedType = target.value;

		// Reset form data
		formData = {
			url: { url: '' },
			contact: {
				firstName: '',
				lastName: '',
				organization: '',
				phone: '',
				email: '',
				website: '',
				address: ''
			},
			text: { text: '' },
			sms: { phone: '', message: '' },
			email: { email: '', subject: '', body: '' },
			wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
			phone: { phone: '' },
			location: { latitude: '', longitude: '' }
		};

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

<div class="min-h-screen dark:bg-gray-900">
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
					<label
						for="qr-type-select"
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-white"
					>
						QR Code Type
					</label>
					<select
						id="qr-type-select"
						class="w-full rounded-md border p-3 dark:bg-gray-700 dark:text-white"
						bind:value={selectedType}
						onchange={handleTypeChange}
						aria-label="Select QR code type"
					>
						{#each qrTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<!-- Enter Details -->
				<div class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
					<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Enter Details</h2>

					<QRCodeForm
						{selectedType}
						qrData={getFormDataForComponent()}
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
					typeLabel={qrTypes.find((t) => t.value === selectedType)?.label || ''}
				/>
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
