<script lang="ts">
	interface FooterSection {
		title: string;
		items: string[];
	}

	interface Address {
		country: string;
		address: string;
		phone: string;
		mapIcon: string;
	}

	interface SocialLink {
		name: string;
		icon: string;
		href: string;
	}

	interface Props {
		companyName?: string;
		companyUrl?: string;
		description?: string;
		logoSrc?: string;
		brandName?: string;
		sections?: FooterSection[];
		addresses?: Address[];
		socialLinks?: SocialLink[];
	}

	const defaultSections: FooterSection[] = [
		{
			title: 'Features',
			items: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
		},
		{
			title: 'Options',
			items: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
		},
		{
			title: 'Products',
			items: ['Product 1', 'Product 2', 'Product 3']
		}
	];

	const defaultAddresses: Address[] = [
		{
			country: 'Bangladesh',
			address: '158/27 Scolia, Kazla, Rajshahi-6204',
			phone: '+880 1326 506464',
			mapIcon: '/bangladesh.svg'
		},
		{
			country: 'USA',
			address: '903 1st Street North #1061, Hopkins, MN 55343',
			phone: '+1 612 300 7711',
			mapIcon: '/usa.svg'
		},
		{
			country: 'Finland',
			address: 'Viidintie 1 A 1, 05420, Helsinki, Uusimaa',
			phone: '+358 402245717',
			mapIcon: '/finland.svg'
		}
	];

	const defaultSocialLinks: SocialLink[] = [
		{
			name: 'LinkedIn',
			icon: '/linkedin.svg',
			href: 'https://www.linkedin.com/company/devxhubcom/'
		},
		{ name: 'GitHub', icon: '/github.svg', href: 'https://github.com/devxhub' },
		{ name: 'Facebook', icon: '/facebook.svg', href: 'https://www.facebook.com/devxhubcom/' },
		{ name: 'YouTube', icon: '/youtube.svg', href: 'https://www.youtube.com/@devxhub' },
		{ name: 'Twitter', icon: '/twitter.svg', href: 'https://x.com/devxhub' }
	];

	const {
		companyName = 'Devxhub Pvt. Ltd.',
		companyUrl = 'https://devxhub.com',
		description = 'Create beautiful, customizable tools for any purpose.',
		logoSrc = '/logo.webp',
		brandName = 'App',
		sections = defaultSections,
		addresses = defaultAddresses,
		socialLinks = defaultSocialLinks
	}: Props = $props();

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-slate-200 bg-slate-900 text-slate-300">
	<div class="mx-auto max-w-7xl px-6 py-8">
		<!-- Main Footer Content -->
		<div class="mb-8">
			<!-- Brand Section -->
			<div class="mb-8">
				<div class="mb-4 flex items-center gap-3">
					<img
						src={logoSrc}
						alt=""
						class="h-10 w-10 object-contain"
						loading="lazy"
						aria-hidden="true"
					/>
					<span class="text-lg font-semibold text-white">{brandName}</span>
				</div>
				<p class="text-sm leading-relaxed text-slate-400">
					{description}
				</p>
			</div>

			<!-- Dynamic Sections Grid - 3 columns for Features, Export Options, Products -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each sections as section (section.title)}
					<div>
						<h3 class="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
							{section.title}
						</h3>
						<ul class="space-y-2">
							{#each section.items as item (item)}
								<li>
									{#if section.title === 'Products'}
										<button
											type="button"
											class="text-sm text-slate-400 transition-colors duration-200 hover:text-slate-200"
											aria-label={`View ${item}`}
										>
											{item}
										</button>
									{:else}
										<span
											class="cursor-default text-sm text-slate-400 transition-colors duration-200 hover:text-slate-200"
										>
											{item}
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<!-- Divider -->
		<div class="mt-8 border-t border-slate-700 pt-8"></div>

		<!-- Addresses Section -->
		<div class="mb-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each addresses as addr (addr.country)}
					<div>
						<!-- Map Icon -->
						<div class="mb-4">
							<img
								src={addr.mapIcon}
								alt=""
								class="h-12 w-12 object-contain"
								loading="lazy"
								aria-hidden="true"
							/>
						</div>

						<!-- Country Name -->
						<p class="mb-4 font-semibold text-white">{addr.country}</p>

						<!-- Address with Icon -->
						<div class="mb-3 flex gap-3">
							<img
								src="/address.svg"
								alt=""
								class="h-4 w-4 shrink-0"
								loading="lazy"
								aria-hidden="true"
							/>
							<address class="text-sm text-slate-400 not-italic">{addr.address}</address>
						</div>

						<!-- Phone with Icon -->
						<div class="flex gap-3">
							<img
								src="/call.svg"
								alt=""
								class="h-4 w-4 shrink-0"
								loading="lazy"
								aria-hidden="true"
							/>
							<a
								href={`tel:${addr.phone.replace(/\s/g, '')}`}
								class="text-sm text-slate-400 hover:text-slate-200"
								aria-label={`Phone number for ${addr.country}: ${addr.phone}`}
							>
								{addr.phone}
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Divider -->
		<div class="mt-8 border-t border-slate-700 pt-8"></div>

		<!-- Bottom Section -->
		<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
			<!-- Copyright -->
			<p class="text-sm text-slate-400">
				&copy; {currentYear}
				<a
					href={companyUrl}
					target="_blank"
					rel="external noopener noreferrer"
					class="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300"
				>
					{companyName}
				</a>
				. All rights reserved.
			</p>

			<!-- Social Links -->
			<div class="flex gap-4">
				{#each socialLinks as social (social.name)}
					<a
						href={social.href}
						target="_blank"
						rel="external noopener noreferrer"
						aria-label={`Visit our ${social.name} page`}
						class="flex h-10 w-10 items-center justify-center rounded-full"
					>
						<img
							src={social.icon}
							alt=""
							class="h-9 w-9 object-contain transition-transform duration-200 hover:scale-110"
							loading="lazy"
							aria-hidden="true"
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
