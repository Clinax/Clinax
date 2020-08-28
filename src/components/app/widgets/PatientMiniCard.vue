<template>
  <v-card min-width="240" max-width="320">
    <v-card-text class="text-center">
      <v-avatar color="primary" size="64">
        <v-img
          v-if="patient.profile"
          :src="baseUrl + patient.profile"
          contain
        ></v-img>
        <span v-else class="white--text title">
          {{ patient.initials }}
        </span>
      </v-avatar>
      <v-list-item class="contact-info">
        <v-list-item-content>
          <v-list-item-title> {{ patient.prefixFullname }} </v-list-item-title>
          <template v-if="patient.phone || patient.phone">
            <v-list-item-subtitle :title="patient.phone || patient.phone">
              <a
                v-if="patient.phone"
                class="dashed"
                :href="'tel:' + patient.phone"
              >
                {{ patient.phone }}
              </a>
              <a
                v-else-if="patient.email"
                class="dashed"
                :href="'mailto:' + patient.email"
              >
                {{ patient.email }}
              </a>
            </v-list-item-subtitle>
          </template>
          <v-list-item-subtitle v-else>-</v-list-item-subtitle>
          <v-list-item-subtitle
            v-if="patient.email && patient.phone"
            :title="patient.email"
          >
            <a class="dashed" :href="'mailto:' + patient.email">{{
              patient.email
            }}</a>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card v-if="patient.address" outlined>
        <v-list-item dense class="py-0 text-left">
          <v-list-item-content>
            <v-list-item-title
              v-if="patient.address.street"
              class="text-wrap"
              :title="patient.address.street"
            >
              {{ patient.address.street }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="patient.address.area" class="text-wrap">
              {{ patient.address.area }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="patient.address.pincode"
              class="text-wrap"
            >
              <small>
                {{ patient.address.pincode }}
              </small>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { patient: { type: Object, required: true } },
};
</script>

<style lang="scss">
.contact-info {
  a {
    margin: 0.2rem 0;
    font-size: 9pt;
    color: currentColor;
  }
}
</style>
