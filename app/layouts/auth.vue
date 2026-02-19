<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div class="flex flex-col items-center mb-2">
      <img src="/logo.jpeg" alt="Cabmatics Logo" class="w-full h-auto"/>
    </div>
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>