<template>
  <v-menu max-height="340" :close-on-content-click="false" left>
    <template v-slot:activator="{ on }">
      <v-btn depressed small v-on="on">
        <v-icon>mdi-history</v-icon>
      </v-btn>
    </template>
    <v-card min-width="320" class="h-100">
      <perfect-scrollbar class="h-100">
        <template v-for="(followUp, i) in followUps">
          <v-sheet :key="i">
            <v-subheader class="primary white--text">
              {{ moment(followUp.createdAt).format("Do MMM YYYY") }}
            </v-subheader>
            <follow-up-summary-table
              :follow-up="followUp"
            ></follow-up-summary-table>
          </v-sheet>
        </template>
      </perfect-scrollbar>
    </v-card>
  </v-menu>
</template>

<script>
import FollowUpSummaryTable from "@/components/app/widgets/FollowUpSummaryTable";

export default {
  components: { FollowUpSummaryTable },
  props: {
    followUps: { type: Array, required: true },
  },
};
</script>

<style></style>
