<script lang="ts">
	import { theme, type ThemeMode } from '$lib/shared/stores/themeStore';
	import { onMount } from 'svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		logoSrc?: string;
	}

	const {
		title = 'QR Code',
		subtitle = 'Create & Customize',
		logoSrc = '/logo.webp'
	}: Props = $props();

	let dropdownOpen = $state(false);
	let dropdownRef: HTMLDivElement | null = $state(null);

	const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
		{ value: 'light', label: 'Light', icon: 'sun' },
		{ value: 'dark', label: 'Dark', icon: 'moon' },
		{ value: 'system', label: 'System', icon: 'monitor' }
	];

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function selectTheme(mode: ThemeMode) {
		theme.set(mode);
		dropdownOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			dropdownOpen = false;
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});

	function getThemeLabel(mode: ThemeMode): string {
		return themeOptions.find((opt) => opt.value === mode)?.label || 'System';
	}
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-slate-200 shadow-md dark:border-slate-700 dark:bg-slate-900">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<div class="flex items-center gap-4">
			<img
				src={logoSrc}
				alt=""
				class="h-14 w-14 object-contain"
				width="56"
				height="56"
				loading="eager"
				fetchpriority="high"
				decoding="async"
				aria-hidden="true"
			/>
			<div class="flex flex-col">
				<h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
				<p class="text-sm font-medium text-slate-600 dark:text-slate-300">{subtitle}</p>
			</div>
		</div>
		<div class="relative" bind:this={dropdownRef}>
			<button
				type="button"
				onclick={toggleDropdown}
				aria-label="Theme selector"
				aria-expanded={dropdownOpen}
				aria-haspopup="true"
				class="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
			>
				<!-- Sun Icon -->
				{#if $theme === 'light'}
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{/if}
				<!-- Moon Icon -->
				{#if $theme === 'dark'}
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{/if}
				<!-- Monitor Icon -->
				{#if $theme === 'system'}
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				{/if}
				<span class="hidden sm:inline">{getThemeLabel($theme)}</span>
				<!-- Chevron Icon -->
				<svg
					class="h-4 w-4 transition-transform {dropdownOpen ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<!-- Dropdown Menu -->
			{#if dropdownOpen}
				<div
					class="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
					role="menu"
					aria-orientation="vertical"
				>
					<div class="py-1" role="none">
						{#each themeOptions as option (option.value)}
							<button
								type="button"
								role="menuitem"
								onclick={() => selectTheme(option.value)}
								class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors {option.value === $theme
									? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
									: 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700'}"
							>
								<!-- Sun Icon -->
								{#if option.icon === 'sun'}
									<svg
										class="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								{/if}
								<!-- Moon Icon -->
								{#if option.icon === 'moon'}
									<svg
										class="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
										/>
									</svg>
								{/if}
								<!-- Monitor Icon -->
								{#if option.icon === 'monitor'}
									<svg
										class="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								{/if}
								<span>{option.label}</span>
								{#if option.value === $theme}
									<svg
										class="ml-auto h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	header {
		/* Use will-change for better performance */
		will-change: backdrop-filter;
		/* Optimize backdrop-filter for mobile - use simpler fallback */
		/* Match footer background: slate-200 = rgb(226, 232, 240) */
		background-color: rgba(226, 232, 240, 0.98);
	}

	:global(.dark) header {
		background-color: rgba(15, 23, 42, 0.98);
	}

	/* Only apply backdrop-filter on devices that can handle it */
	@media (prefers-reduced-motion: no-preference) {
		header {
			backdrop-filter: blur(10px);
		}
	}

	/* Disable backdrop-filter on mobile for better performance */
	@media (max-width: 768px) {
		header {
			backdrop-filter: none;
			background-color: rgb(226, 232, 240);
		}
	}
</style>
