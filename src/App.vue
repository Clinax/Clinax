<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style lang="scss">
@font-face {
  font-family: "Sansation Regular V3";
  src: url("/fonts/14df84ca92de1925877ef2ea23edf8b0.eot");
  /* IE9*/
  src: url("/fonts/14df84ca92de1925877ef2ea23edf8b0.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("/fonts/14df84ca92de1925877ef2ea23edf8b0.woff2")
      format("woff2"),
    /* chrome、firefox */ url("/fonts/14df84ca92de1925877ef2ea23edf8b0.woff")
      format("woff"),
    /* chrome、firefox */ url("/fonts/14df84ca92de1925877ef2ea23edf8b0.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("/fonts/14df84ca92de1925877ef2ea23edf8b0.svg#Sansation Regular V3")
      format("svg");
  /* iOS 4.1- */
}

@font-face {
  font-family: "Androgyne Medium";
  src: url("/fonts/3813038d9377e8e801bc444e8c469694.eot");
  /* IE9*/
  src: url("/fonts/3813038d9377e8e801bc444e8c469694.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("/fonts/3813038d9377e8e801bc444e8c469694.woff2")
      format("woff2"),
    /* chrome、firefox */ url("/fonts/3813038d9377e8e801bc444e8c469694.woff")
      format("woff"),
    /* chrome、firefox */ url("/fonts/3813038d9377e8e801bc444e8c469694.ttf")
      format("truetype"),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url("/fonts/3813038d9377e8e801bc444e8c469694.svg#Androgyne Medium")
      format("svg");
  /* iOS 4.1- */
}

* {
  font-family: "Sansation Regular V3" !important;
}
.w-100 {
  width: 100%;
}
.brand {
  font-family: "Androgyne Medium" !important;
  text-decoration: none !important;
}
a {
  text-decoration: none !important;
}
$border: 1px solid
  rgba(
    $color: #000000,
    $alpha: 0.12,
  ) !important;
.border {
  border: $border;
}
.border-bottom {
  border-bottom: $border;
}
.border-top {
  border-top: $border;
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
