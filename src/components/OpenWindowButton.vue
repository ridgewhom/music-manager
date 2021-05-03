<template>
  <button v-bind="$attrs" class=open-window-button @click="openWindow" >
    <slot></slot>
  </button>
</template>

<script>
//import { remote } from 'electron';
import {ipcRenderer} from 'electron';

export default {
  inheritAttrs: false,
  name: 'ConfirmationButton',
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
    confirmationAccepted(){
      //console.log("ACCEPTED!");
      this.$emit('confirmation-accepted')
    },
  },
  computed: {
    options: function(){
      let options = {
        type : this.type,
        buttons: this.buttons,
        defaultId: 0,
        title: this.title,
        message: this.message,
        }
      return options;
    },
  }
}

</script>

<style scoped>
  
</style>