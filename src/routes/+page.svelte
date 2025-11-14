<script lang="ts">
	import jsPDF from 'jspdf';
	import QrCode from 'qrcode';
	import { Input } from '$lib/components/ui';
	import { Textarea } from '$lib/components/ui';
	import { Select } from '$lib/components/ui';
	import { Button } from '$lib/components/ui';
	import { Label } from '$lib/components/ui';
	import { Card } from '$lib/components/ui';

	// Types
	interface QrType {
		value: string;
		label: string;
	}

	interface ErrorLevel {
		value: 'L' | 'M' | 'Q' | 'H';
		label: string;
	}

	interface ContactData {
		firstName: string;
		lastName: string;
		organization: string;
		phone: string;
		email: string;
		website: string;
		address: string;
	}

	interface FormData {
		url: { url: string };
		contact: ContactData;
		text: { text: string };
		sms: { phone: string; message: string };
		email: { email: string; subject: string; body: string };
		wifi: { ssid: string; password: string; security: string; hidden: boolean };
		phone: { phone: string };
		location: { latitude: string; longitude: string };
	}

	// QR Code Types
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

	// Track user interaction
	function markUserInteraction() {
		hasUserInteracted = true;
	}

	// Generate QR code data based on type
	function generateQrData(): string {
		switch (selectedType) {
			case 'url':
				let url = formData.url.url || '';
				// Add protocol if missing
				if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
					url = 'https://' + url;
				}
				return url;

			case 'contact':
				const contact = formData.contact;
				if (!contact.firstName && !contact.lastName && !contact.phone && !contact.email) {
					return '';
				}
				return `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
ORG:${contact.organization}
TEL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.website}
ADR:;;${contact.address};;;;
END:VCARD`;

			case 'text':
				return formData.text.text || '';

			case 'sms':
				const sms = formData.sms;
				if (!sms.phone) return '';
				return `sms:${sms.phone}${sms.message ? `?body=${encodeURIComponent(sms.message)}` : ''}`;

			case 'email':
				const email = formData.email;
				if (!email.email) return '';
				const params = [];
				if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
				if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
				return `mailto:${email.email}${params.length ? `?${params.join('&')}` : ''}`;

			case 'wifi':
				const wifi = formData.wifi;
				if (!wifi.ssid) return '';
				return `WIFI:T:${wifi.security};S:${wifi.ssid};P:${wifi.password};H:${wifi.hidden ? 'true' : 'false'};;`;

			case 'phone':
				return formData.phone.phone ? `tel:${formData.phone.phone}` : '';

			case 'location':
				const loc = formData.location;
				if (!loc.latitude || !loc.longitude) return '';
				return `geo:${loc.latitude},${loc.longitude}`;

			default:
				return '';
		}
	}

	// Generate QR code
	async function generateQrCode(): Promise<void> {
		if (!hasUserInteracted) return;

		const data = generateQrData();
		if (!data.trim()) {
			qrCodeUrl = '';
			error = '';
			return;
		}

		isGenerating = true;
		error = '';

		try {
			const url = await QrCode.toDataURL(data, {
				width: qrSize,
				margin: 2,
				color: {
					dark: foregroundColor,
					light: backgroundColor
				},
				errorCorrectionLevel: errorCorrection
			});
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

	// Download QR code
	function downloadQrCode(): void {
		if (!qrCodeUrl) return;

		const link = document.createElement('a');
		link.download = `qr-code-${selectedType}.png`;
		link.href = qrCodeUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	// Download as PDF
	function downloadPDF(): void {
		if (!qrCodeUrl) return;

		const pdf = new jsPDF();
		const imgData = qrCodeUrl;
		const imgWidth = 100;
		const imgHeight = 100;
		const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
		const y = 30;

		pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
		pdf.save('qr-code.pdf');
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

					{#if selectedType === 'url'}
						<input
							type="url"
							class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
							bind:value={formData.url.url}
							oninput={markUserInteraction}
							placeholder="https://example.com or example.com"
							aria-label="Website URL"
						/>
					{:else if selectedType === 'contact'}
						<div class="space-y-3">
							<input
								type="text"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.firstName}
								oninput={markUserInteraction}
								placeholder="First Name"
								aria-label="First Name"
							/>
							<input
								type="text"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.lastName}
								oninput={markUserInteraction}
								placeholder="Last Name"
								aria-label="Last Name"
							/>
							<input
								type="text"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.organization}
								oninput={markUserInteraction}
								placeholder="Organization"
								aria-label="Organization"
							/>
							<input
								type="tel"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.phone}
								oninput={markUserInteraction}
								placeholder="Phone"
								aria-label="Phone"
							/>
							<input
								type="email"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.email}
								oninput={markUserInteraction}
								placeholder="Email"
								aria-label="Email"
							/>
							<input
								type="url"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.website}
								oninput={markUserInteraction}
								placeholder="Website"
								aria-label="Website"
							/>
							<textarea
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.contact.address}
								oninput={markUserInteraction}
								placeholder="Address"
								rows="2"
								aria-label="Address"
							></textarea>
						</div>
					{:else if selectedType === 'text'}
						<textarea
							class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
							bind:value={formData.text.text}
							oninput={markUserInteraction}
							placeholder="Enter your text here..."
							rows="4"
							aria-label="Text content"
						></textarea>
					{:else if selectedType === 'sms'}
						<div class="space-y-3">
							<input
								type="tel"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.sms.phone}
								oninput={markUserInteraction}
								placeholder="Phone Number"
								aria-label="Phone Number"
							/>
							<textarea
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.sms.message}
								oninput={markUserInteraction}
								placeholder="Message (Optional)"
								rows="2"
								aria-label="SMS Message"
							></textarea>
						</div>
					{:else if selectedType === 'email'}
						<div class="space-y-3">
							<input
								type="email"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.email.email}
								oninput={markUserInteraction}
								placeholder="Email Address"
								aria-label="Email Address"
							/>
							<input
								type="text"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.email.subject}
								oninput={markUserInteraction}
								placeholder="Subject (Optional)"
								aria-label="Email Subject"
							/>
							<textarea
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.email.body}
								oninput={markUserInteraction}
								placeholder="Body (Optional)"
								rows="3"
								aria-label="Email Body"
							></textarea>
						</div>
					{:else if selectedType === 'wifi'}
						<div class="space-y-3">
							<input
								type="text"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.wifi.ssid}
								oninput={markUserInteraction}
								placeholder="Network Name (SSID)"
								aria-label="WiFi Network Name"
							/>
							<input
								type="password"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.wifi.password}
								oninput={markUserInteraction}
								placeholder="Password"
								aria-label="WiFi Password"
							/>
							<select
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.wifi.security}
								onchange={markUserInteraction}
								aria-label="Security Type"
							>
								<option value="WPA">WPA/WPA2</option>
								<option value="WEP">WEP</option>
								<option value="nopass">None</option>
							</select>
							<label class="flex items-center space-x-2">
								<input
									type="checkbox"
									bind:checked={formData.wifi.hidden}
									onchange={markUserInteraction}
									class="rounded border"
								/>
								<span class="text-sm dark:text-white">Hidden Network</span>
							</label>
						</div>
					{:else if selectedType === 'phone'}
						<input
							type="tel"
							class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
							bind:value={formData.phone.phone}
							oninput={markUserInteraction}
							placeholder="Phone Number"
							aria-label="Phone Number"
						/>
					{:else if selectedType === 'location'}
						<div class="space-y-3">
							<input
								type="number"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.location.latitude}
								oninput={markUserInteraction}
								placeholder="Latitude"
								step="any"
								aria-label="Latitude"
							/>
							<input
								type="number"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={formData.location.longitude}
								oninput={markUserInteraction}
								placeholder="Longitude"
								step="any"
								aria-label="Longitude"
							/>
						</div>
					{/if}

					{#if error}
						<div class="mt-2 text-sm text-red-500" role="alert" aria-live="polite">
							{error}
						</div>
					{/if}
				</div>

				<!-- Customize QR Code -->
				<div class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
					<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Customize QR Code
					</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label for="size-range" class="mb-1 block text-sm font-medium dark:text-white"
								>Size</label
							>
							<input
								id="size-range"
								type="range"
								class="w-full"
								bind:value={qrSize}
								oninput={markUserInteraction}
								min="200"
								max="800"
								step="50"
								aria-label="QR Code Size"
							/>
							<div class="text-xs text-gray-500">{qrSize}px</div>
						</div>

						<div>
							<label
								for="error-correction-select"
								class="mb-1 block text-sm font-medium dark:text-white">Error Correction</label
							>
							<select
								id="error-correction-select"
								class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
								bind:value={errorCorrection}
								onchange={markUserInteraction}
								aria-label="Error Correction Level"
							>
								{#each errorLevels as level}
									<option value={level.value}>{level.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<label for="foreground-color" class="mb-1 block text-sm font-medium dark:text-white"
								>Foreground Color</label
							>
							<input
								id="foreground-color"
								type="color"
								class="h-10 w-full rounded-md border"
								bind:value={foregroundColor}
								oninput={markUserInteraction}
								aria-label="Foreground Color"
							/>
						</div>

						<div>
							<label for="background-color" class="mb-1 block text-sm font-medium dark:text-white"
								>Background Color</label
							>
							<input
								id="background-color"
								type="color"
								class="h-10 w-full rounded-md border"
								bind:value={backgroundColor}
								oninput={markUserInteraction}
								aria-label="Background Color"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: QR Code Preview -->
			<div class="space-y-6">
				<div class="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
					<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">QR Code Preview</h2>

					<div class="flex flex-col items-center">
						{#if isGenerating}
							<div class="text-center">
								<div
									class="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
								></div>
								<div>Generating QR code...</div>
							</div>
						{:else if qrCodeUrl}
							<div class="text-center">
								<img
									src={qrCodeUrl}
									alt="Generated QR Code for {qrTypes.find((t) => t.value === selectedType)?.label}"
									class="mx-auto mb-4 rounded-lg"
								/>
								<div class="flex space-x-4">
									<button
										type="button"
										class="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
										onclick={downloadQrCode}
									>
										Download PNG
									</button>
									<button
										type="button"
										class="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
										onclick={downloadPDF}
									>
										Download PDF
									</button>
								</div>
							</div>
						{:else}
							<div
								class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
							>
								<p class="text-gray-500 dark:text-gray-400 p-4">
									{error
										? 'Fix errors to generate QR code'
										: 'Fill in the details to generate QR code'}
								</p>
							</div>
						{/if}
					</div>
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
