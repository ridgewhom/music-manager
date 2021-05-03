<template>
  <div class="preferences">
    <div class= "options-div">
      <div class = "selector-div">
        Row/Waveform Height 
        <select v-model.number="rowHeight">
          <option value="32">Small</option>
          <option value="64">Medium</option>
          <option value="128">Large</option>
        </select>
      </div>
    </div>
    <div style="background-color:white;">
      <div class = "selector-div">
        <Button @click="closeWindow">Cancel</Button>
        <Button @click="restoreDefaults">Restore Defaults</Button>
        <Button @click="applyPreferences">Apply Changes</Button>
      </div>
    </div>
  </div>
</template>

<script>
//import {mapState,mapActions} from 'vuex'
import{ remote } from 'electron';
import { ipcRenderer} from 'electron';


export default {
  name: 'Preferences',
  components: {

  },
  data: function() {
    return {
      defaults: {rowHeight : 128},
      rowHeight: this.$store.state.rowHeight
    }
  },
  mounted(){
  },
  computed: {
    preferences: function(){
      return {
        setRowHeight : this.rowHeight
      }
    }
  },
  methods: {
      closeWindow(){
        remote.getCurrentWindow().close();
      },
      applyPreferences(){
        let message = this.preferences;
        //console.log(message);
        ipcRenderer.send('vuex-update',message)
        //this.closeWindow();
      },
      restoreDefaults(){
        this.rowHeight = this.defaults.rowHeight;
      }
  }
}
</script>

<style scoped>
*, body{
    background-color: #1e1e1e;
    color: white;
    font-size: 24px;
}
.preferences{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height:100%;
    background-color:red;
}
.selector-div{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
button {
  border: 1px solid rgba(90,90,90,1);
  background: #3c3c3c;
  color: lightgrey;
  box-shadow: none;
  border-radius: 0px;
}
button:hover {
    filter: brightness(150%);
    cursor:pointer;
}

</style>