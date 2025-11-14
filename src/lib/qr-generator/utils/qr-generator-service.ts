import QrCode from 'qrcode';
import type { QRCodeData, QRCodeOptions } from '../types';
import { generateQRContent } from './qr-generator';

/**
 * Generate QR code as data URL
 */
export async function generateQRCodeImage(
	qrData: QRCodeData,
	options: QRCodeOptions
): Promise<string> {
	const content = generateQRContent(qrData);

	if (!content.trim()) {
		return '';
	}

	try {
		const url = await QrCode.toDataURL(content, {
			width: options.size,
			margin: 2,
			color: {
				dark: options.foregroundColor,
				light: options.backgroundColor
			},
			errorCorrectionLevel: options.errorCorrection
		});
		return url;
	} catch (err) {
		console.error('QR Code generation error:', err);
		throw err;
	}
}
