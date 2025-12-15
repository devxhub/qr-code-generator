<script lang="ts">
	import { Button } from '$lib/shared/components/ui';
	import { downloadQRCode, downloadQRCodeAsPDF, downloadQRCodeAsSVG } from '../utils/downloads';

	interface Props {
		qrCodeUrl: string;
		isGenerating: boolean;
		error: string;
		selectedType: string;
		typeLabel: string;
		qrContent?: string;
		qrOptions?: {
			size: number;
			foregroundColor: string;
			backgroundColor: string;
			errorCorrection: 'L' | 'M' | 'Q' | 'H';
		};
	}

	let { qrCodeUrl, isGenerating, error, selectedType, typeLabel, qrContent, qrOptions }: Props =
		$props();

	function handleDownloadPNG() {
		downloadQRCode(qrCodeUrl, selectedType);
	}

	function handleDownloadPDF() {
		downloadQRCodeAsPDF(qrCodeUrl);
	}

	async function handleDownloadSVG() {
		if (qrContent && qrOptions) {
			await downloadQRCodeAsSVG(qrContent, selectedType, qrOptions);
		}
	}
</script>

<div class="rounded-lg border bg-gradient-to-br from-slate-200 via-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800">
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
					alt="Generated QR Code for {typeLabel}"
					class="mx-auto mb-4 rounded-lg"
				/>
				<div class="flex justify-center space-x-2">
					<Button
						type="button"
						class="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
						onclick={handleDownloadPNG}
					>
						Download PNG
					</Button>
					<Button
						type="button"
						class="rounded bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
						onclick={handleDownloadSVG}
					>
						Download SVG
					</Button>
					<Button
						type="button"
						class="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
						onclick={handleDownloadPDF}
					>
						Download PDF
					</Button>
				</div>
			</div>
		{:else}
			<div
				class="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
			>
				<p class="p-4 text-gray-500 dark:text-gray-400">
					{error ? 'Fix errors to generate QR code' : 'Fill in the details to generate QR code'}
				</p>
			</div>
		{/if}
	</div>
</div>
