<template>
  <div class="min-h-screen text-ash relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-16 -left-24 h-72 w-72 bg-blood/20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-0 right-0 h-96 w-96 bg-ember/15 blur-[140px] rounded-full"></div>
    </div>
    <header class="relative border-b border-iron/60 bg-iron/60 backdrop-blur px-6 py-4">
      <div class="mx-auto max-w-6xl flex items-center justify-between gap-4">
        <div>
          <p class="uppercase tracking-[0.2em] text-xs text-ash/70">Kult: Character Forge</p>
          <h1 class="text-2xl font-serif text-ash">Un linceul voile nos yeux</h1>
        </div>
      </div>
    </header>
    <main class="relative z-10">
      <slot />
    </main>
    <footer class="relative border-t border-iron/60 bg-iron/60 backdrop-blur mt-12">
      <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between text-sm text-ash/70">
        <p>Kult builder by Genium007</p>
        <p>Prends des notes, avance avec prudence.</p>
      </div>
    </footer>
  </div>
</template>
