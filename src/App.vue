<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style lang="scss">
.w-100 {
  width: 100%;
}
h-100 {
  height: 100%;
}
.brand {
  font-family: "Androgyne Medium" !important;
  text-decoration: none !important;
}
a {
  text-decoration: none !important;
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}

$border: 1px solid
  rgba(
    $color: #000000,
    $alpha: 0.12,
  );
$border-dashed: 1px dashed
  rgba(
    $color: #000000,
    $alpha: 0.12,
  );

.border-0 {
  border: none !important;
}
.border {
  border: $border !important;
}
.border-bottom {
  border-bottom: $border !important;
}
.border-top {
  border-top: $border !important;
}
.border-left {
  border-left: $border !important;

  &-bold {
    border-left: $border !important;
    border-width: 4px !important;
  }
}
.border-primary {
  border-color: var(--v-primary-base) !important;
}

.rounded {
  border-radius: 0.25rem !important;
}
.rounded-0 {
  border-radius: 0 !important;
}
.highlight {
  background: rgba(rgb(0, 102, 255), 0.3);
}

.dashed {
  border-bottom: $border-dashed;
}

.highlight {
  .highlight {
    background: transparent;
  }
}
.animate {
  transition: 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.text-nonospace {
  font-family: monospace !important;
}
</style>
