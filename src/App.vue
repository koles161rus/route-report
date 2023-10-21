<template>
  <div class="main">
    <MainList />
    <MainMap />
  </div>
</template>

<script lang="ts">
import MainList from './components/MainList.vue';
import MainMap from './components/MainMap.vue';

import {loadMessages, locale} from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";

export default {
  name: 'App',
  components: {
    MainMap,
    MainList
  },
  created() {
    loadMessages(ruMessages);
    locale('ru');
  }
}
</script>

<style>
@import url('../node_modules/ol/ol.css');

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.main {
  display: flex;

  & > *:first-child {
    flex: 1;
  }

  & > *:last-child {
    flex: 3;
  }
}
</style>