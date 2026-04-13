<template>
  <div class="min-h-screen text-bone relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-16 -left-24 h-72 w-72 bg-blood/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-0 right-0 h-96 w-96 bg-ember/8 blur-[140px] rounded-full"></div>
    </div>
    <header class="relative border-b border-iron-light bg-iron/70 backdrop-blur px-4 sm:px-6 py-3 sm:py-4">
      <div class="mx-auto max-w-6xl flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="uppercase tracking-[0.4em] text-[9px] sm:text-[10px] text-ash font-medium">Kult: Divinity Lost</p>
          <h1 class="text-lg sm:text-2xl font-serif text-white tracking-[0.15em] uppercase truncate">Character Forge</h1>
        </div>
        <div class="hidden sm:block h-6 w-px bg-blood/40"></div>
      </div>
    </header>
    <main class="relative z-10">
      <slot />
    </main>
    <footer class="relative border-t border-iron-light bg-iron/70 backdrop-blur mt-12">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs sm:text-sm text-ash">
        <p>Kult builder by <a href="https://lucagisa.com" target="_blank" rel="noopener">Genium007</a></p>
        <p class="text-ash/70 italic">Prends des notes, avance avec prudence.</p>
      </div>
    </footer>
  </div>
</template>
