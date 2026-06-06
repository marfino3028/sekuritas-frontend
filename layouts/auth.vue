<template>
  <div class="min-h-screen flex flex-col overflow-hidden relative"
       style="background: linear-gradient(160deg, #0f172a 0%, #134e4a 45%, #0c1a30 100%)">
    <!-- Decorative orbs -->
    <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
         style="background: radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 65%)"></div>
    <div class="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
         style="background: radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 65%)"></div>
    <div class="absolute top-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
         style="background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)"></div>

    <!-- Header -->
    <header class="relative z-10 py-5 px-6 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-3 w-fit group">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105"
             style="background: linear-gradient(135deg, #14b8a6, #0ea5e9)">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div>
          <p class="text-[18px] font-bold text-white tracking-tight leading-none">Sekuritas</p>
          <p class="text-[11px] font-medium leading-none mt-0.5" style="color: #5eead4">Demo Platform</p>
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
    <footer class="relative z-10 py-5 text-center flex-shrink-0">
      <p class="text-xs" style="color: #64748b">
        Berizin dan Diawasi oleh <span class="font-semibold" style="color: #94a3b8">OJK</span>
      </p>
      <p class="text-xs mt-1" style="color: #475569">
        &copy; {{ new Date().getFullYear() }} PT Sekuritas Indonesia. Hak Cipta Dilindungi.
      </p>
    </footer>
  </div>
</template>
