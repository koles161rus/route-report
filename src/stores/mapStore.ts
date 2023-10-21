import { defineStore } from 'pinia'
import { Map } from 'ol'

export const useMapStore = defineStore('map', {  
  state: () => ({
    map: new Map({})
  }),
  getters: {
    getMap: (state) => state.map
  },
  actions: {
    setMap(map: Map) {
      this.map = map
    },
    findLayerByTitle(title: string) {
      return this.map.getAllLayers().find(layer => layer.get('title') === title);
    }
  },
})