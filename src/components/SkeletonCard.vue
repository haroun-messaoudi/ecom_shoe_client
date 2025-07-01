<template>
  <div class="animate-pulse bg-gray-200 rounded-2xl shadow-md w-full h-80"></div>
</template>

<script setup>
// No script needed for skeleton
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
