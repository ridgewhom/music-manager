<template>
  <button v-bind="$attrs" @click="openWindow" >
    <slot></slot>
  </button>
</template>

<script>
//import { remote } from 'electron';
import {ipcRenderer} from 'electron';

export default {
  inheritAttrs: false,
  name: 'OpenWindowButton',
  components: {
  },
  props: {
    ipcChannel: {
      type: String,
      required: true,
    }
  },
  data: function() {
    return {}
  },
  mounted(){

  },
  methods: {
    openWindow(){
      ipcRenderer.send(this.ipcChannel);
    },
  },
  computed: {
  }
}

</script>

<style scoped>
  
</style>