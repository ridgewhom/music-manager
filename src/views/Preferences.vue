<template>
  <div class="preferences">
    <div class= "options-div">
      <div class = "selector-div">
        Row/Waveform Height 
        <select v-model.number="rowHeight">
          <option value="45">Small</option>
          <option value="128">Large</option>
        </select>
      </div>
      <div class = "selector-div">
      Waveform Color
        <open-window-button class="color-button" ipc-channel="showColorPicker" :style="{'background-color' : waveformProgressColor}"></open-window-button>
      </div>
    </div>
    <div class="apply-div">
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
import { ipcRenderer, remote} from 'electron';
import OpenWindowButton from '../components/OpenWindowButton.vue';

export default {
  name: 'Preferences',
  components: {
    OpenWindowButton
  },
  data: function() {
    return {
      defaults: {
        rowHeight : 128,
        waveformProgressColor: '#F9A057'
      },
      rowHeight: this.$store.state.rowHeight,
      waveformProgressColor: this.$store.state.waveformProgressColor  
    }
  },
  created() {
    ipcRenderer.on('preferences-update', this.handleIpcUpdate)
  },
  mounted(){
  },
  computed: {
    preferences: function(){
      return {
        setRowHeight : this.rowHeight,
        setWaveformProgressColor: this.waveformProgressColor
      }
    },
   
  },
  methods: {
      handleIpcUpdate(event,args){
        for(let action in args){
          switch(action) {
            case 'setWaveformProgressColor':
              this.setWaveformProgressColor(args[action])
              break;
            default:
              console.log('action "' + action + '"')
          }
        }
      },
      setWaveformProgressColor(color){
        this.waveformProgressColor = color;
        //console.log(color);
      },
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
        this.waveformProgressColor = this.defaults.waveformProgressColor;
      }
  }
}
</script>

<style scoped>
*, body{
    background-color: #222222;
    color: white;
    font-size: 24px;
    height: 100%;
}
.apply-div {
  background-color:blue; position: absolute;
  left: 0;
  right: 0;
  bottom: 0; height: 30px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;
}
.preferences{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height:100%;
    margin: 15px;
}

.preferences div {
  margin-bottom: 5px;
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
.color-button{
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>