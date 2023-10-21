<template>
  <div id="map"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useMapStore } from "@/stores/mapStore";
import { events } from "@/events";
import { getStyle } from "@/style";

import { Feature, Map, View } from 'ol';
import { transform } from 'ol/proj';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { LineString, Point } from 'ol/geom';
import { Style } from 'ol/style';

interface CustomOptions extends TileLayer<OSM>{
  source?: OSM,
  name?: string,
  isBaseMap?: boolean
}

export default defineComponent({
  name: 'MainMap',
  data() {
    return {
      events
    }
  },
  mounted() {
    const store = useMapStore();

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
          name: 'OpenStreetMap',
          isBaseMap: true
        } as CustomOptions)
      ],
      view: new View({
        center: transform([37.6123487, 55.748033], 'EPSG:4326', 'EPSG:3857'),
        zoom: 11
      })
    });

    const source = new VectorSource();
    const layer = new VectorLayer({ source });
    layer.set('title', 'route');

    this.events.forEach((item, i) => {
      let feature;
      let letter = '';
      const geom = item.geometry;

      if (geom.type === 'Point') {
        const name = item.properties.name;
        letter = name === 'Датчик' ? 'D' : name.split(' ')[1].replace(/\D/g,'');

        feature = new Feature({
          geometry: new Point(transform(geom.coordinates as number[], 'EPSG:4326', 'EPSG:3857'))
        });
      } else {
        const coords = geom.coordinates.map(coord => transform(coord as number[], 'EPSG:4326', 'EPSG:3857'));
        feature = new Feature({
          geometry: new LineString(coords)
        });
      }

      feature.setStyle(new Style(getStyle(letter, false)));
      feature.set('letter', letter);
      feature.setId(i);

      source.addFeature(feature);
    })

    map.addLayer(layer);

    store.setMap(map);
  }
})
</script>

<style scoped>
#map {
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>