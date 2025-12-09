# QR Code Generator (Svelte 5)

A privacy-friendly QR code generator built with **Svelte 5**, **Tailwind CSS**, and **TypeScript**. Create QR codes for URLs, text, contacts, WiFi, SMS, email, phone, and locations—all in the browser.

## 🚀 Features

- ⚡ Svelte 5 with Runes and TypeScript
- 🎨 Tailwind CSS + shadcn-style UI components
- 🧭 Multiple QR types: URL, text, contact/vCard, SMS, email, WiFi, phone, location
- 🖨️ PNG and PDF downloads (client-side only)
- 🔒 100% local generation—no data leaves your browser
- 🧩 Feature-based structure ready to extend

## 🛠 Tech Stack

- [Svelte 5 (Runes)](https://svelte.dev/docs)
- [SvelteKit](https://kit.svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [qrcode](https://github.com/soldair/node-qrcode) for generation
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export

## 📁 Project Structure

```
src/
├── lib/
│   ├── qr-generator/           # QR feature (components, hooks, utils, types)
│   └── shared/                 # Reusable UI + layout components
└── routes/
    ├── +layout.svelte          # Root layout & global SEO
    └── +page.svelte            # QR generator page
```

## 🚀 Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Run the dev server

```bash
pnpm run dev
```

Open `http://localhost:5173`.

### 3) Build for production

```bash
pnpm run build
```

## 🧩 QR Feature Overview

- Components: `QRCodeForm`, `QRCodePreview`, `QRCodeCustomizer`
- Hooks/utils: `qr-generator/utils` (data adapters, form handlers, generators)
- Downloads: PNG and PDF via client-side helpers

## 🎨 Customizing Header & Footer

Header/Footer remain reusable in `src/lib/shared/components` if you want to rebrand or extend.

## 📄 License

MIT License.
