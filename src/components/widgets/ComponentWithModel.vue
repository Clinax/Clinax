<script>
export default {
  props: { value: Boolean },
  data() {
    return {
      model: this.value,
    };
  },
  watch: {
    value(a) {
      this.model = a;
    },
    model(a) {
      this.$emit("input", a);
    },
  },
};
</script>
