<template>
  <v-container :fluid="isMobile" :class="{ 'pa-0': isMobile }">
    <slot></slot>
  </v-container>
</template>

<script>
export default {};
</script>
