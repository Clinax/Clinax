<template>
  <v-sheet max-width="680" class="mx-auto px-3">
    <v-row fill-height>
      <v-col cols="12">
        <v-img src="@/assets/create.svg" max-height="320" contain></v-img>
      </v-col>
      <v-col cols="12">
        <v-layout fill-height align-center justify-center column>
          <div class="text-center text--secondary">
            <p class="body-1">
              <b>No FollowUp</b> for the case has been added yet...
            </p>
            <p class="body-2">
              <small>
                <b>Hint: &nbsp;</b>
                <span>To create first followUp</span>
                <v-icon color="primary" class="mx-1" small>
                  mdi-card-plus
                </v-icon>
                <span>button provide below</span>
              </small>
            </p>
          </div>
          <v-card-actions class="my-5 justify-center">
            <v-btn color="primary" @click="$emit('click:create')">
              <v-icon class="mr-2">mdi-card-plus</v-icon>
              Create FollowUp
            </v-btn>
          </v-card-actions>
        </v-layout>
      </v-col>
    </v-row>
  </v-sheet>
</template>
