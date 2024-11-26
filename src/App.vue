<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
    <header class="w-full text-black p-4 text-center">
      <!-- <h1 class="text-2xl">Free Chat</h1> -->
    </header>
    <main class="flex-1 w-full flex justify-center items-center">
      <router-view></router-view>
    </main>
    <footer class="w-full text-black p-4 text-center">
      <!-- <p>© 2023 Freechat</p> -->
    </footer>
  </div>
</template>
