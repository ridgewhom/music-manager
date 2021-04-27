<template>
  <div class="toolbar">
    <dropdown-menu
      v-model="showDropdown">
      <button class="dropdown-toggle" style="width:100%;height:100%;" >
          File
      </button>
      <div slot="dropdown" class="dropdown" >
        <div class="dropdown-item-wrapper">
          <base-file-input class="dropdown-item" :multiple="true" v-on:input="handleFiles" name="Add Files" accept="audio/*">Add File(s)</base-file-input>
          <confirmation-button class="dropdown-item" 
            v-on:confirmation-accepted="clearFiles"
            windowTitle="Clear ALL Files"
            type="warning"
            message="Are you sure you want to remove ALL files?">Clear Files</confirmation-button>
          <button class="dropdown-item" @click="toggleSelectRemove">Select And Remove Files</button>
        </div>
      </div>
    </dropdown-menu>
    <!--base-file-input name="Add Music File(s)" :multiple="true" v-on:input="handleFiles"  accept="audio/*"/>
    <Button @click="clearFiles()">Clear Files</Button>
    <confirmation-button text="Clear Files" message="Are you sure you want to clear ALL files?" v-on:confirmation-accepted="clearFiles"></confirmation-button-->
    <div id = "zoom-toggle">
      <Button id = "zoom-button" @click="zoom = !zoom; minPxPerSec = zoom ? copyMinPx : '0';">Toggle Zoom</Button>
      <input id = "min-px-input"  type="number" min="0" step="1" v-if="zoom" v-model="minPxPerSec" placeholder="Px/Sec">
    </div>
    <input v-model.trim="nameFilter" placeholder="Filter By Name">
    <input v-model.trim="artistFilter" placeholder="Filter By Artist">
    <input v-model.trim="genreFilter" placeholder="Filter By Genre">
    <!--div id = statusMessageField ref="statusMessageField"><b>{{statusMessage}}</b></div-->
    <input type="range" title="Global Volume" id=volume min="0" max="100" @input="setGlobalVolume($event.target.value * .01)"/>

  </div>
</template>

<script>
import BaseFileInput from './Base-Components/BaseFileInput.vue';
//import BaseButton from '@/components/Base-Components/BaseButton.vue'
import { mapActions} from 'vuex'
import * as mm from 'music-metadata';
import _ from 'lodash';
import ConfirmationButton from './ConfirmationButton.vue';
import DropdownMenu from '@innologica/vue-dropdown-menu'

//const util = require('util');

export default {
  name: 'ToolBar',
  components: {
    BaseFileInput,
    ConfirmationButton,
    DropdownMenu
  },
  data: () => ({
        statusMessage : 'Status Messages Are Displayed Here',
        zoom : false,
        copyMinPx : '0',    //for toggle
        showDropdown: false,
  }),
  mounted() {
    if(this.minPxPerSec > 0){   //restore same settings from last shutdown
      this.zoom=true;
    }
  },
  computed: {
    musicFiles(){
      return this.$store.state.musicFiles;
    },
    nameFilter:{
        get(){ 
            return this.$store.nameFilter; 
        }, 
        set(nameFilter){ 
            this.$store.dispatch('setNameFilter',nameFilter); 
        }
    },
    genreFilter:{
        get(){ 
            return this.$store.genreFilter; 
        }, 
        set(genreFilter){ 
            this.$store.dispatch('setGenreFilter',genreFilter); 
        }
    },
    artistFilter:{
        get(){ 
            return this.$store.artistFilter; 
        }, 
        set(artistFilter){ 
            this.$store.dispatch('setArtistFilter',artistFilter); 
        }
    },
    minPxPerSec: {
      get(){ 
            let minPx = this.$store.minPxPerSec; 
            return (minPx > 0) ? minPx : '';
      }, 
      set: _.debounce(function(minPxPerSec){ 
            if(minPxPerSec != 0) {this.copyMinPx = minPxPerSec}
            this.$store.dispatch('setMinPxPerSec',minPxPerSec); 
      } , 500 )
    },
  },
  methods: {
      ...mapActions([
        'clearFiles',
        'pushFile',
        'setGlobalVolume',
        'toggleSelectRemove'
      ]),
      handleFiles(files){
        let genre = 'unknown';
        let artist = 'unknown';
        if(files.length > 0){
          for (let file of files){
            if(file && file['type'].split('/')[0] === 'audio')
              {
                if(this.musicFiles.some(e => e.path === file['path'])){
                  console.log('file already added') //Throw error window here?
                } else {
                  try {
                    mm.parseFile(file['path'])
                      .then( (metadata) =>{
                          //console.log(util.inspect(metadata, { showHidden: true, depth: 5 }));
                          //console.log(metadata.common)
                          artist = metadata.common.artist != undefined ? metadata.common.artist : artist;
                          genre = metadata.common.genre != undefined ? metadata.common.genre[0] : genre;
                          let fileName = file['path'].match(/^.*?([^\\]*)[^\\/]*$/)[1];
                          let name = metadata.common.title != undefined ? metadata.common.title : fileName;
                          this.pushFile({
                            name: name,
                            path: file['path'],
                            genre: genre,
                            artist: artist,
                            desc: ''
                            })
                          });
                    } catch (error) {
                      console.error(error.message);
                    }                  
                }

              }
          }
        }
      },
      
  },
  beforeDestroy() {
      window.removeEventListener('keypress', this.keybindRecieved); 
  }
   
}
</script>

<style scoped>
    .toolbar{
        display: grid;
        grid-template-columns: 75px minmax(150px,2fr) minmax(50px,3fr)  minmax(50px,3fr) minmax(50px,2fr)  minmax(100px,1fr);
        grid-template-rows: 100%;
        grid-gap: 0;
        z-index: 10;
    }
    button{
      text-overflow:ellipsis;

      overflow: hidden;
    }
    #zoom-toggle{
      display:flex;
      flex-direction: row;
    }
    #zoom-button{
      flex: 1;
    }
    #min-px-input{
      width: 100%;
      flex: 1;
    }
    .dropdown{
      height:100%;
      width:100%;
    }
    .dropdown-toggle{
      cursor: default;
    }
    .dropdown-item-wrapper{
      padding-top:1px;
      display:flex;
      flex-direction:column;
      width:200px;
      background-color: #2c2c2c;
    }
    .dropdown-item{
      display: inline-block;
      font-size: 14px;
      z-index: 10;
      background:none;
      margin: 3px;
      border:none;
      text-align:left;
      padding-left: 10px;
      padding-right: 10px;
      color: lightgrey;
      
    }
    .dropdown-item:hover{
      filter: none;
      background-color: SlateGrey;
    }
    
</style>