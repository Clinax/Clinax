<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style lang="scss">
.hide-number-arrows {
  -webkit-appearance: none;
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
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
.flex-grow-1 {
  flex-grow: 1;
}
.flex-grow-0 {
  flex-grow: 0;
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overlay {
  position: relative;
  * {
    z-index: 0;
  }

  &-container {
    position: absolute;
    top: 0;
    z-index: 1;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

$border: 1px solid rgba(0, 0, 0, 0.12);

$border-dashed: 1px dashed rgba(0, 0, 0, 0.12);

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
