<script lang="ts">
	import jsPDF from 'jspdf';
	import QRCode from 'qrcode';
	import type { QRCodeOptions } from '../types.js';

	interface Props {
		content: string;
		options: QRCodeOptions;
	}

	let { content, options }: Props = $props();

	let qrCanvas: HTMLCanvasElement | undefined = $state();
	let isGenerating = $state(false);

	$effect(() => {
		if (content && qrCanvas) {
			generateQR();
		}
	});

	async function generateQR(): Promise<void> {
		if (!content || !qrCanvas) return;

		isGenerating = true;
		try {
			await QRCode.toCanvas(qrCanvas, content, {
				width: options.size,
				color: {
					dark: options.foregroundColor,
					light: options.backgroundColor
				},
				errorCorrectionLevel: options.errorCorrection
			});
		} catch (error) {
			console.error('Error generating QR code:', error);
		} finally {
			isGenerating = false;
		}
	}

	function downloadPNG(): void {
		if (!qrCanvas) return;

		const link = document.createElement('a');
		link.download = 'qr-code.png';
		link.href = qrCanvas.toDataURL();
		link.click();
	}

	function downloadPDF(): void {
		if (!qrCanvas) return;

		const pdf = new jsPDF();
		const imgData = qrCanvas.toDataURL('image/png');
		const imgWidth = 100;
		const imgHeight = 100;
		const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
		const y = 30;

		pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
		pdf.save('qr-code.pdf');
	}
</script>

<div class="flex flex-col items-center">
	<div class="relative mb-4 rounded-lg border p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800">
		{#if isGenerating}
			<div class="flex h-64 w-64 items-center justify-center">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
			</div>
		{:else}
			<canvas
				bind:this={qrCanvas}
				class="rounded-lg"
				style="background-color: {options.backgroundColor};"
			></canvas>
		{/if}
	</div>

	<div class="flex space-x-4">
		<button
			onclick={downloadPNG}
			disabled={isGenerating || !content}
			class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
		>
			Download PNG
		</button>
		<button
			onclick={downloadPDF}
			disabled={isGenerating || !content}
			class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
		>
			Download PDF
		</button>
	</div>
</div>
