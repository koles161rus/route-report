<template>
  <div class="main">
    <div>
      <DxDateBox
          label="Период с"
          :value="start"
          type="datetime"
          display-format="dd.MM.yyyy HH:mm"
          @value-changed="onStartDate"
      />
      <DxDateBox
          label="Период по"
          :value="end"
          type="datetime"
          display-format="dd.MM.yyyy HH:mm"
          @value-changed="onEndDate"
      />
    </div>
    <DxDataGrid
      :data-source="properties"
      :focused-row-enabled="true"
      key-expr="id"
      @focused-row-changed="onFocusedRowChanged"
    >
      <DxColumn
        caption="Событие"
        data-field="name"
      />
      <DxColumn
        caption="Начало"
        data-field="start"
        data-type="datetime"
        format="dd MMM HH:mm"
      />
      <DxColumn
        caption="Конец"
        data-field="end"
        data-type="datetime"
        format="dd MMM HH:mm"
      />
      <DxColumn
        caption="Итого"
        data-field="total"
      />
    </DxDataGrid>
    <div>
      <div>D - Датчик</div>
      <div>1 - Стоянка</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useMapStore } from "@/stores/mapStore";
import { events } from "@/events";
import { getStyle } from "@/style";

import { ValueChangedEvent } from 'devextreme/ui/date_box';
import { FocusedRowChangedEvent } from 'devextreme/ui/data_grid';

import { Style } from 'ol/style';
import moment from 'moment';

import { DxDateBox } from 'devextreme-vue/date-box';
import { DxDataGrid, DxColumn } from 'devextreme-vue/data-grid';

export default defineComponent({
  name: 'MainList',
  data: () => {
    return {
      events,
      prevId: null,
      start: '2023-10-20T22:56',
      end: '2023-10-21T18:00'
    }
  },
  computed: {
    properties() {
      return events.map((item, i) => {
        const props = item.properties;

        const diff = moment(props.end).diff(moment(props.start));
        const total = moment.utc(diff).format("HH:mm");

        return { ...props, total, id: i };
      }).filter(obj => {
        const start = moment(this.start);
        const startEvent = moment(obj.start);
        const end = moment(this.end);
        const endEvent = moment(obj.end);

        if (start.diff(startEvent, "seconds") > 0 || end.diff(endEvent, "seconds") < 0) {
          const feature = this.routeLayer?.getProperties().source.getFeatureById(obj.id);
          feature.setStyle(new Style({}));
        } else {
          if (this.properties && this.properties.findIndex(prop => prop.id === obj.id) === -1) {
            const feature = this.routeLayer?.getProperties().source.getFeatureById(obj.id);
            const letter = feature.get('letter');

            feature.setStyle(new Style(getStyle(letter, false)));
          }
        }

        return start.diff(startEvent, "seconds") <= 0 && end.diff(endEvent, "seconds") >= 0;
      })
    },
    map() {
      const store = useMapStore();
      return store.getMap;
    },
    routeLayer() {
      const store = useMapStore();
      return store.findLayerByTitle('route');
    }
  },
  components: {
    DxDateBox,
    DxDataGrid,
    DxColumn
  },
  methods: {
    onStartDate(e: ValueChangedEvent) {
      this.start = e.value;
    },
    onEndDate(e: ValueChangedEvent) {
      this.end = e.value;
    },
    onFocusedRowChanged(e: FocusedRowChangedEvent) {
      if (this.prevId !== null) {
        const prevFeat = this.routeLayer?.getProperties().source.getFeatureById(this.prevId);
        const prevLetter = prevFeat.get('letter');

        prevFeat.setStyle(new Style(getStyle(prevLetter, false)));
      }

      const feature = this.routeLayer?.getProperties().source.getFeatureById(e.row?.data.id);
      const letter = feature.get('letter');

      feature.setStyle(new Style(getStyle(letter, true)));

      this.map.getView().fit(feature.getGeometry().getExtent(), {
        maxZoom: 15,
        padding: [50, 50, 50, 50],
        duration: 1000
      });

      this.prevId = e.row?.data.id;
    }
  }
})
</script>

<style scoped>
.main {
  display: block;
  margin: 10px;

  & > *:first-child {
    display: flex;

    & > * {
      flex: 1;
      margin: 5px 5px 10px;
    }
  }

  & > *:last-child {
    font-size: 16px;
    font-weight: bold;
    margin: 5px;

    & > *:first-child {
      color: #0f0;
      margin: 5px;
    }

    & > *:last-child {
      color: #00f;
      margin: 5px;
    }
  }
}
</style>