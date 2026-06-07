<template>
  <div class="min-h-screen flex flex-col overflow-hidden relative bg-brand-gradient">
    <!-- Decorative gradient blobs -->
    <div class="absolute -top-48 -right-32 w-[560px] h-[560px] rounded-full pointer-events-none blur-3xl"
         style="background: radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 68%)"></div>
    <div class="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full pointer-events-none blur-3xl"
         style="background: radial-gradient(circle, rgba(99,102,241,0.28) 0%, transparent 68%)"></div>
    <div class="absolute top-1/4 left-1/3 w-72 h-72 rounded-full pointer-events-none blur-2xl"
         style="background: radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 70%)"></div>

    <!-- Header -->
    <header class="relative z-10 py-6 px-6 sm:px-10 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-3 w-fit group">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-card ring-1 ring-white/20 bg-white/10 backdrop-blur transition-transform duration-200 group-hover:-translate-y-0.5">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <p class="text-[18px] font-display font-extrabold text-white tracking-tight leading-none">Sekuritas</p>
          <p class="text-[11px] font-medium leading-none mt-1 text-accent-100">Demo Platform</p>
        </div>
      </NuxtLink>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 py-6 text-center flex-shrink-0">
      <p class="text-xs text-white/55">
        Berizin dan Diawasi oleh <span class="font-semibold text-accent-100">OJK</span>
      </p>
      <p class="text-xs mt-1 text-white/40">
        &copy; {{ new Date().getFullYear() }} PT Sekuritas Indonesia. Hak Cipta Dilindungi.
      </p>
    </footer>
  </div>
</template>
