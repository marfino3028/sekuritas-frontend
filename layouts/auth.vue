<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-surface-hero font-sans">
    <!-- Foto gedung (gaya hero Danapathi) memudar ke kiri -->
    <img src="/images/hero.jpg" alt="" class="absolute inset-y-0 right-0 h-full w-full lg:w-[60%] object-cover pointer-events-none" />
    <div class="absolute inset-0 bg-hero-fade pointer-events-none"></div>
    <div class="absolute inset-0 bg-white/50 lg:hidden pointer-events-none"></div>

    <header class="relative z-10 py-6 px-6 sm:px-10 flex-shrink-0">
      <NuxtLink to="/" class="inline-flex">
        <img src="/logo.png" alt="Danapathi Asset Management" class="h-11 w-auto" />
      </NuxtLink>
    </header>

    <main class="relative z-10 flex-1 flex items-center justify-center lg:justify-start px-4 sm:px-10 lg:px-24 py-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <footer class="relative z-10 py-6 px-6 sm:px-10 lg:px-24 flex-shrink-0 text-xs text-slate-500">
      <p>Berizin dan diawasi oleh <span class="font-semibold text-primary-900">Otoritas Jasa Keuangan (OJK)</span></p>
      <p class="mt-1">&copy; {{ new Date().getFullYear() }} PT Danapathi Asset Management. Hak cipta dilindungi.</p>
    </footer>
  </div>
</template>
