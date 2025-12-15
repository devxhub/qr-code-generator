<script lang="ts">
	import { ArrowRight } from '$lib/shared/icons';

	interface Props {
		title?: string;
		description?: string;
		buttonText?: string;
		buttonUrl?: string;
		buttonAriaLabel?: string;
	}

	const {
		title = 'Need Custom Development?',
		description = "Let's build something amazing together",
		buttonText = 'Contact Devxhub',
		buttonUrl = 'https://devxhub.com/contact-us',
		buttonAriaLabel = 'Contact Devxhub for custom development services'
	}: Props = $props();
</script>

<section
	class="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-200 via-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 shadow-xl sm:p-8 md:p-10"
	aria-labelledby="cta-heading"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10 text-slate-400 dark:text-white" aria-hidden="true">
		<div
			class="absolute inset-0"
			style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 40px 40px;"
		></div>
	</div>

	<div class="relative text-center">
		<h2 id="cta-heading" class="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100 sm:mb-3 sm:text-2xl md:text-3xl">
			{title}
		</h2>
		<p class="mb-4 text-sm text-slate-600 dark:text-slate-300 sm:mb-6 sm:text-base md:text-lg">
			{description}
		</p>
		<a
			href={buttonUrl}
			target="_blank"
			rel="external noopener noreferrer"
			class="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-50 dark:focus-visible:ring-white dark:focus-visible:ring-offset-slate-900 focus-visible:outline-none sm:w-auto sm:px-8 sm:py-4 sm:text-base"
			aria-label={buttonAriaLabel}
		>
			<span class="truncate">{buttonText}</span>
			<ArrowRight
				class="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5"
			/>
		</a>
	</div>
</section>
