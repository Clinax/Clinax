<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="flex flex-column">
          <v-card-title>
            Available Drugs
            {{ selectedItems.length }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Search available drugs"
              hide-details
              single-line
              prepend-inner-icon="mdi-magnify"
              clearable
              outlined
              dense
            ></v-text-field>
          </v-card-text>
          <v-divider class="mb-5"></v-divider>
          <v-sheet height="450">
            <RecycleScroller
              class="scroller"
              :items="availableDrugs"
              :item-size="48"
              v-slot="{ item }"
            >
              <li
                class="drug-item"
                @drag="onDragEventSrc"
                @dragend="onDragEventSrc"
                @dragstart="onDragEventSrc"
                draggable="true"
                :class="{ selected: item.selected }"
                @click="item.selected = !item.selected"
              >
                {{ item.name }}
              </li>
            </RecycleScroller>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="flex flex-column">
          <v-card-title>Inventory</v-card-title>
          <v-sheet
            height="450"
            @drop="onDragEventDst"
            @dragenter="onDragEventDst"
            @dragover="onDragEventDst"
          >
            <v-list class="scroller">
              <RecycleScroller
                :items="inventoryDrugs"
                :item-size="48"
                v-slot="{ item }"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </RecycleScroller>
            </v-list>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import drugs from "@/json/drugs.json";

export default {
  data() {
    return {
      availableDrugs: drugs.map((ev, index) => ({
        id: index,
        name: ev,
        selected: false,
      })),
      inventoryDrugs: drugs.slice(0, 10),
      dragEventSrc: {
        target: null,
      },
    };
  },
  computed: {
    selectedItems() {
      return this.availableDrugs.filter((e) => e.selected);
    },
  },
  methods: {
    onDragEventSrc(ev) {
      const type = ev.type;

      switch (type) {
        case "dragstart":
          ev.target.classList.add("dragging");
          break;
        case "drag":
          ev.target.style.transform = `translate(${ev.screenX}px, ${ev.screenY}px)`;
          break;
        case "dragend":
          ev.target.classList.remove("dragging");
      }
    },
    onDragEventDst(ev) {
      const type = ev.type;
      switch (type) {
        case "dragstart":
          break;
        case "drag":
          break;
        case "dragend":
      }
    },
  },
};
</script>

<style lang="scss">
.scroller {
  overflow: auto;
  height: 100%;
  ::-webkit-scrollbar-thumb {
    width: 8px;
    background: red;
  }
  &:-webkit-scrollbar {
    width: 8px;
    &-track {
      width: 8px;
      background: red;
    }
    &-thumb {
      width: 8px;
      background: #000000;
    }
  }
  .drug-item {
    list-style: none;
    border: 1px solid rgba($color: #000000, $alpha: 0.12);
    height: 42px;
    line-height: 42px;
    padding: 0rem 1rem;
    margin: 0rem 1rem;
    user-select: none;
    transform-origin: 0 0;
    cursor: pointer;
    border-radius: 4px;
    &.dragging {
      position: absolute;
    }
    &.selected {
      border-color: var(--v-primary-base);
    }
  }
}
</style>
