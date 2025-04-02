<script lang="ts">
	import { writable } from 'svelte/store';
	import QRCode from 'qrcode';
	import { jsPDF } from 'jspdf';

	type QRCodeType = 'url' | 'vcard' | 'text' | 'sms' | 'email' | 'wifi';
	type QRCodeData = {
		type: QRCodeType;
		data: Record<string, string>;
	};
	type QRCodeOptions = {
		width: number;
		height: number;
	};

	const selectedType = writable<QRCodeType>('url');

	const qrData = writable<QRCodeData>({
		type: 'url',
		data: {}
	});
	const options = writable<QRCodeOptions>({
		width: 256,
		height: 256
	});
	const qrCodeDataUrl = writable('');

	const types: QRCodeType[] = ['url', 'vcard', 'text', 'sms', 'email', 'wifi'];

	const errors = writable<string[]>([]);

	function validateForm(): boolean {
		const currentErrors: string[] = [];
		const data = $qrData.data;

		switch ($qrData.type) {
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
				if (!data.message) currentErrors.push('Message is required.');
				break;
			case 'email':
				if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
					currentErrors.push('Please enter a valid email address.');
				}
				if (!data.subject) currentErrors.push('Subject is required.');
				if (!data.message) currentErrors.push('Message is required.');
				break;
			case 'wifi':
				if (!data.ssid) currentErrors.push('SSID is required.');
				if (!data.password) currentErrors.push('Password is required.');
				break;
		}

		errors.set(currentErrors);
		return currentErrors.length === 0;
	}

	async function generateQRCode() {
		if (!validateForm()) {
			return;
		}

		let content = '';

		switch ($qrData.type) {
			case 'url':
				content = $qrData.data.url || '';
				break;
			case 'vcard':
				content = `BEGIN:VCARD\nVERSION:3.0\nN:${$qrData.data.name}\nTEL:${$qrData.data.phone}\nEMAIL:${$qrData.data.email}\nORG:${$qrData.data.org}\nEND:VCARD`;
				break;
			case 'text':
				content = $qrData.data.text || '';
				break;
			case 'sms':
				content = `SMSTO:${$qrData.data.phone}:${$qrData.data.message}`;
				break;
			case 'email':
				content = `mailto:${$qrData.data.email}?subject=${encodeURIComponent($qrData.data.subject)}&body=${encodeURIComponent($qrData.data.message)}`;
				break;
			case 'wifi':
				content = `WIFI:T:${$qrData.data.encryption};S:${$qrData.data.ssid};P:${$qrData.data.password};;`;
				break;
		}

		try {
			const dataUrl = await QRCode.toDataURL(content, {
				width: $options.width,
				height: $options.height,
				margin: 1
			});
			qrCodeDataUrl.set(dataUrl);
		} catch (err) {
			console.error('Error generating QR code:', err);
		}
	}

	function downloadQRCode(format: string) {
		const url = $qrCodeDataUrl;
		if (!url) return;

		if (format === 'PDF') {
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'px',
				format: [$options.width + 40, $options.height + 40]
			});
			pdf.addImage(url, 'PNG', 20, 20, $options.width, $options.height);
			pdf.save('qrcode.pdf');
		} else {
			const link = document.createElement('a');
			link.download = `qrcode.${format.toLowerCase()}`;
			link.href = url;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	function resetForm() {
		selectedType.set('url');
		qrData.set({ type: 'url', data: {} });
		options.set({ width: 256, height: 256 });
		qrCodeDataUrl.set('');
	}

	$effect(() => {
		qrData.update((d: QRCodeData) => ({ ...d, type: $selectedType }));
	});
</script>

<!-- UI -->
<div class="mx-auto w-full max-w-4xl p-4">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Settings Panel -->
		<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-2xl font-bold dark:text-white">QR Code Settings</h2>
				<button
					onclick={resetForm}
					class="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					>Reset</button
				>
			</div>

			<!-- Error Messages -->
			{#if $errors.length > 0}
				<div class="mb-4 rounded-md bg-red-100 p-4 text-red-700">
					<ul>
						{#each $errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<div class="mb-4">
				<label for="qr-code-type" class="mb-2 block text-sm font-medium dark:text-white"
					>QR Code Type</label
				>
				<select
					id="qr-code-type"
					bind:value={$selectedType}
					class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
				>
					{#each types as type}
						<option value={type}>{type.toUpperCase()}</option>
					{/each}
				</select>
			</div>

			{#if $selectedType === 'url'}
				<input
					class="mb-4 w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
					placeholder="https://example.com"
					bind:value={$qrData.data.url}
				/>
			{:else if $selectedType === 'vcard'}
				<div class="space-y-2">
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Name"
						bind:value={$qrData.data.name}
					/>
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Phone"
						bind:value={$qrData.data.phone}
					/>
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Email"
						bind:value={$qrData.data.email}
					/>
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Organization"
						bind:value={$qrData.data.org}
					/>
				</div>
			{:else if $selectedType === 'text'}
				<textarea
					class="mb-4 w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
					maxlength="300"
					rows="4"
					bind:value={$qrData.data.text}
				></textarea>
			{:else if $selectedType === 'sms'}
				<div class="space-y-2">
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Phone Number"
						bind:value={$qrData.data.phone}
					/>
					<textarea
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Message"
						bind:value={$qrData.data.message}
					></textarea>
				</div>
			{:else if $selectedType === 'email'}
				<div class="space-y-2">
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Email"
						bind:value={$qrData.data.email}
					/>
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Subject"
						bind:value={$qrData.data.subject}
					/>
					<textarea
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Message"
						bind:value={$qrData.data.message}
					></textarea>
				</div>
			{:else if $selectedType === 'wifi'}
				<div class="space-y-2">
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="SSID"
						bind:value={$qrData.data.ssid}
					/>
					<input
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						placeholder="Password"
						bind:value={$qrData.data.password}
					/>
					<select
						class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
						bind:value={$qrData.data.encryption}
					>
						<option value="WPA">WPA/WPA2</option>
						<option value="WEP">WEP</option>
					</select>
				</div>
			{/if}

			<div class="my-4 grid grid-cols-2 gap-4">
				<input
					type="number"
					min="128"
					max="1024"
					bind:value={$options.width}
					class="rounded-md border p-2 dark:bg-gray-700 dark:text-white"
					placeholder="Width"
				/>
				<input
					type="number"
					min="128"
					max="1024"
					bind:value={$options.height}
					class="rounded-md border p-2 dark:bg-gray-700 dark:text-white"
					placeholder="Height"
				/>
			</div>

			<button
				onclick={generateQRCode}
				class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
				>Generate QR Code</button
			>
		</div>

		<!-- QR Preview Panel -->
		<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
			<h2 class="mb-4 text-center text-2xl font-bold dark:text-white">QR Code Preview</h2>
			{#if $qrCodeDataUrl}
				<div class="flex flex-col items-center gap-4">
					<img src={$qrCodeDataUrl} alt="Generated QR Code" class="rounded border" />
					<div class="flex flex-wrap gap-2">
						<button
							onclick={() => downloadQRCode('PNG')}
							class="flex min-w-25 cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
								/>
							</svg> PNG
						</button>
						<button
							onclick={() => downloadQRCode('JPEG')}
							class="flex min-w-25 cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
								/>
							</svg> JPEG
						</button>
						<button
							onclick={() => downloadQRCode('PDF')}
							class="flex min-w-25 cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
								/>
							</svg> PDF
						</button>
					</div>
				</div>
			{:else}
				<div
					class="flex h-64 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
				>
					QR code preview will appear here.
				</div>
			{/if}
		</div>
	</div>
</div>
