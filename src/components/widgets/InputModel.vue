<script>
export default {
  props: { value: { type: [Boolean, String, Number], default: null } },
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
