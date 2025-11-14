<script lang="ts">
	import type { QRCodeData, QRCodeType } from '../types';

	type Props = {
		selectedType: QRCodeType | 'contact' | string;
		qrData: QRCodeData | { type: 'contact'; data: Record<string, string> };
		onDataChange: (data: Record<string, string>) => void;
	};

	let { selectedType, qrData, onDataChange }: Props = $props();

	function updateData(field: string, value: string | boolean) {
		const newData = { ...qrData.data };
		newData[field] = typeof value === 'boolean' ? String(value) : value;
		onDataChange(newData);
	}

	function handleInput(field: string) {
		return (e: Event) => {
			const target = e.target as HTMLInputElement | HTMLTextAreaElement;
			updateData(field, target.value);
		};
	}

	function handleCheckbox(field: string) {
		return (e: Event) => {
			const target = e.target as HTMLInputElement;
			updateData(field, target.checked);
		};
	}

	function handleSelect(field: string) {
		return (e: Event) => {
			const target = e.target as HTMLSelectElement;
			updateData(field, target.value);
		};
	}
</script>

{#if selectedType === 'url'}
	<input
		type="url"
		class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
		placeholder="https://example.com or example.com"
		value={qrData.data.url || ''}
		oninput={handleInput('url')}
		aria-label="Website URL"
	/>
{:else if selectedType === 'contact'}
	<div class="space-y-3">
		<input
			type="text"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.firstName || ''}
			oninput={handleInput('firstName')}
			placeholder="First Name"
			aria-label="First Name"
		/>
		<input
			type="text"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.lastName || ''}
			oninput={handleInput('lastName')}
			placeholder="Last Name"
			aria-label="Last Name"
		/>
		<input
			type="text"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.organization || ''}
			oninput={handleInput('organization')}
			placeholder="Organization"
			aria-label="Organization"
		/>
		<input
			type="tel"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.phone || ''}
			oninput={handleInput('phone')}
			placeholder="Phone"
			aria-label="Phone"
		/>
		<input
			type="email"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.email || ''}
			oninput={handleInput('email')}
			placeholder="Email"
			aria-label="Email"
		/>
		<input
			type="url"
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.website || ''}
			oninput={handleInput('website')}
			placeholder="Website"
			aria-label="Website"
		/>
		<textarea
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.address || ''}
			oninput={handleInput('address')}
			placeholder="Address"
			rows="2"
			aria-label="Address"
		></textarea>
	</div>
{:else if selectedType === 'vcard'}
	<div class="space-y-2">
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Full Name (required)"
			value={qrData.data.name || ''}
			oninput={handleInput('name')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Phone Number (required)"
			value={qrData.data.phone || ''}
			oninput={handleInput('phone')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Email Address (required)"
			value={qrData.data.email || ''}
			oninput={handleInput('email')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Organization/Company (optional)"
			value={qrData.data.org || ''}
			oninput={handleInput('org')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Job Title (optional)"
			value={qrData.data.title || ''}
			oninput={handleInput('title')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Website URL (optional)"
			value={qrData.data.website || ''}
			oninput={handleInput('website')}
		/>
		<textarea
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Address (optional)"
			rows="2"
			value={qrData.data.address || ''}
			oninput={handleInput('address')}
		></textarea>
	</div>
{:else if selectedType === 'text'}
	<textarea
		class="mb-4 w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
		maxlength="300"
		rows="4"
		value={qrData.data.text || ''}
		oninput={handleInput('text')}
	></textarea>
{:else if selectedType === 'sms'}
	<div class="space-y-2">
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Phone Number"
			value={qrData.data.phone || ''}
			oninput={handleInput('phone')}
		/>
		<textarea
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Message"
			value={qrData.data.message || ''}
			oninput={handleInput('message')}
		></textarea>
	</div>
{:else if selectedType === 'email'}
	<div class="space-y-2">
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Email"
			value={qrData.data.email || ''}
			oninput={handleInput('email')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Subject"
			value={qrData.data.subject || ''}
			oninput={handleInput('subject')}
		/>
		<textarea
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Message"
			value={qrData.data.message || ''}
			oninput={handleInput('message')}
		></textarea>
	</div>
{:else if selectedType === 'wifi'}
	<div class="space-y-2">
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Network Name (SSID)"
			value={qrData.data.ssid || ''}
			oninput={handleInput('ssid')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Password"
			type="password"
			value={qrData.data.password || ''}
			oninput={handleInput('password')}
		/>
		<select
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			value={qrData.data.encryption || ''}
			onchange={handleSelect('encryption')}
		>
			<option value="">Select Security Type</option>
			<option value="WPA">WPA/WPA2/WPA3</option>
			<option value="WEP">WEP (Legacy)</option>
			<option value="nopass">Open Network (No Password)</option>
		</select>
		<label class="flex items-center space-x-2">
			<input
				type="checkbox"
				checked={qrData.data.hidden === 'true'}
				onchange={handleCheckbox('hidden')}
				class="rounded border p-2"
			/>
			<span class="text-sm dark:text-white">Hidden Network</span>
		</label>
	</div>
{:else if selectedType === 'phone'}
	<input
		class="mb-4 w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
		placeholder="+1-555-123-4567"
		value={qrData.data.phone || ''}
		oninput={handleInput('phone')}
	/>
{:else if selectedType === 'location'}
	<div class="space-y-2">
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Latitude (e.g., 37.7749)"
			value={qrData.data.latitude || ''}
			oninput={handleInput('latitude')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Longitude (e.g., -122.4194)"
			value={qrData.data.longitude || ''}
			oninput={handleInput('longitude')}
		/>
		<input
			class="w-full rounded-md border p-2 dark:bg-gray-700 dark:text-white"
			placeholder="Location Label (optional)"
			value={qrData.data.label || ''}
			oninput={handleInput('label')}
		/>
	</div>
{/if}
