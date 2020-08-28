<template>
  <div>
    <v-subheader>{{ moment(followUp.createdAt).format("Do MMM") }}</v-subheader>
    <v-simple-table dense class="border mb-3">
      <tbody>
        <template v-for="(value, key) in followUp.criteria">
          <tr v-if="value" :key="key">
            <th>{{ key }}</th>
            <td>{{ value }}</td>
          </tr>
        </template>
        <template v-for="(value, key) in followUp.extra">
          <tr v-if="value" :key="key">
            <th>{{ key }}</th>
            <td>{{ value }}</td>
          </tr>
        </template>
      </tbody>
      <caption>
        Criteria
      </caption>
    </v-simple-table>
    <v-simple-table dense class="border mb-3">
      <tbody>
        <template v-for="value in followUp.treatment.drugs">
          <tr :key="value._id + 'row-1'">
            <th colspan="2">{{ value.name }}</th>
          </tr>
          <tr :key="value._id + 'row-2'">
            <td>{{ value.potency }}</td>
            <td>{{ value.dosage }}</td>
          </tr>
        </template>
      </tbody>
      <caption>
        Treatment
      </caption>
    </v-simple-table>
    <v-simple-table dense class="border">
      <tbody>
        <tr class="primary--text">
          <td colspan="2">{{ followUp.treatment.diagnosis }}</td>
        </tr>
      </tbody>
      <caption>
        Diagnosis
      </caption>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: { followUp: { type: Object, required: true } },
};
</script>
