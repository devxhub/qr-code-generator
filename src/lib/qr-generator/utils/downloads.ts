import jsPDF from 'jspdf';

/**
 * Download QR code as PNG image
 */
export function downloadQRCode(qrCodeUrl: string, type: string): void {
	if (!qrCodeUrl) return;

	const link = document.createElement('a');
	link.download = `qr-code-${type}.png`;
	link.href = qrCodeUrl;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Download QR code as PDF
 */
export function downloadQRCodeAsPDF(qrCodeUrl: string): void {
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
