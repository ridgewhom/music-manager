<template>
  <tr v-if='validPath'>
    <td class ="text-cell" v-if="showCheckbox" @click="check"> <input type="checkbox" ref="checkbox" v-model="checked"> </td>
    <td class ="text-cell" @dblclick="openFileLocation">{{file.name}}</td>
    <td class ="text-cell">{{file.artist}}</td>
    <td class ="text-cell">{{file.genre}}</td>
    <td class="slide-container"> 
      <div class="buttons-div">
        <!--Button class=playButton :class='{"paused": playing}' ref=playButton @click="playMusic"></Button--> 
        <Button @click="playPreview" title="Preview">
          <div class="control-button" style=" ">
            {{playingPreview ? 'Pause Preview' : 'Play Preview'}}
            <font-awesome-icon :icon="playingPreview ? 'pause' : 'music'" size="2x"/>
          </div> 
        </Button>
        <Button @click="playMusic" :title = "playing ? 'Pause ' : 'Play'">
          <div class="control-button" >
            {{playing ? 'Pause ' : 'Play'}}
            <font-awesome-icon :icon="playing ? 'pause' : 'play'"  size="2x"/>
          </div>
        </Button>
        <confirmation-button @confirmation-accepted="clearRegions" message="Are you sure you want to clear ALL regions for this track?" title="Clear Regions">
          <div class=control-button >
            Clear Regions <font-awesome-icon icon="eraser" size="2x"/>
          </div>
        </confirmation-button>
      </div>
      <div id="waveform" ref = 'waveform'><div class="loading" v-if="loading">Loading {{loadingPercent}}%</div></div> 
      <input type="range" title="Track Volume" orient="vertical" id=volume min="0" max="100" v-model="vol"/> </td>
  </tr>
  <tr v-else >
    <td style='color:black; background-color:red;  grid-column: 1/-1; display: flex;'>
      <button @click="$emit('remove-track',file.path)">Remove Track</button>
      "{{file.name}}", was not found at "{{filePath}}" 
    </td> 
    <!--
    TODO: add button to select file here?
    -->
  </tr>
  
</template>

<script>



import WaveSurfer from "wavesurfer.js";
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js';
import ConfirmationButton from './ConfirmationButton.vue';
import{ shell, remote } from 'electron';



var path = require("path");      //TODO: change these to ES6 Imports
var fs = require("fs");
const { Readable } = require("stream");
const streamToBlob = require("stream-to-blob");

export default {
  name: 'MusicSlide',
  components: {
    ConfirmationButton,
  },
  props: {
    file: {
      required: true,
    },
    globalVolume: {
      type: Number,
      required: true,
    },
    minPxPerSec: {
      required: false,
      default: 0,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    }
  },
  data: function() {
    return {
        checked : false,
        wavesurfer: null,
        songName: "",
        waveColor: "white",
        progressColor: "violet",
        backgroundColor: "rgba(50,50,50,1)",
        percent: "30%",
        vol: 50,
        validPath : true,
        colorArr: ['rgba(255,0,0,.5)','rgba(0,255,0,.5)','rgba(0,0,255,.5)','rgba(255,255,0,.5)','rgba(0,255,255,.5)'], //TODO: Maybe let user select these in future?
        numRegions: 0,
        playingRegion: -1,
        playing: false,
        playingPreview: false,
        loading: true,
        loadingPercent: 0,
        height: 128,
    }
  },
  mounted() {
    //console.log(this.filePath)
    this.$nextTick(() => {
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform,
        //barWidth: 2,
        //barHeight: 1,
        //barGap: 1,
        //barRadius: 2,
        waveColor: this.waveColor,
        progressColor: this.progressColor,
        backgroundColor: this.backgroundColor,
        backend: "MediaElement",
        mediaControls: false,
        audioRate: "1",
        normalize: true,
        minPxPerSec: 0,
        responsive: true,
        cursorWidth: 1,
        height: this.height,
        //hideScrollbar: true,
        //scrollParent: true,
        plugins: [
          RegionPlugin.create(),
          CursorPlugin.create()
          ]
      });
      
      
      let path = this.filePath;
      let self = this
      fs.readFile(path, 
      function(err, buffer) {
        if (buffer && !err) {
          /* tslint:disable:no-empty */
          //console.log('has data and no error!');
        }
        if(buffer){
          self.validPath = true;
          let stream = self.bufferToStream(buffer);

          let fileUrl; 
          streamToBlob(stream)
            .then(res => {
              fileUrl = res;
              let filePath = window.URL.createObjectURL(fileUrl);
              self.wavesurfer.load(filePath);
            })
            .catch(err => {
              console.log('readfile Error: ' + err);
            })
        } else {
          console.log('No File found at ' + this.filePath);
          self.validPath = false;
        }
      });
      this.wavesurfer.on('loading', (x) => {
        this.loadingPercent = x;
      })

      this.wavesurfer.on('ready', () => {
        this.loading = false;
        // Enable creating regions by dragging
        this.wavesurfer.setVolume(self.computedVolume);
        this.playing = false;
        this.wavesurfer.enableDragSelection({loop: false});
      
        if(this.minPxPerSec > 0){ 
          this.wavesurfer.zoom(this.minPxPerSec);
        }

        //add regions
        let regions = this.file.regions
        for (let region of regions){
          this.wavesurfer.addRegion({
            start: region.start,
            end: region.end,
            color: region.color,
          });
          this.numRegions +=1;
        }
      });

      this.wavesurfer.on('error', function(err) {
        console.log(err);
      });

      this.wavesurfer.on('region-created',(region) => {

        //set region color
        let regionColor = this.colorArr[(Object.keys(this.wavesurfer.regions.list).length)%(this.colorArr.length)]
        
        region.update({
          color: regionColor,
          drag: false,
          loop: false,
        })

        //tell parent that a region has been created
      });
      this.wavesurfer.on('region-update-end',(region) => {
              this.$emit('new-region-created',{newRegion: region, file: this.file})
              this.numRegions += 1;
      });
      this.wavesurfer.on('region-dblclick',(region) => {
        console.log(region);
        region.play();
      });

    });
    
  },
  computed: { 

    computedVolume: function () {
      return this.globalVolume * this.vol * .01;
    },
    filePath: function(){   
      return this.file.path;
    },
    sortedRegions: function () {
      let a = this.numRegions; // eslint-disable-line
      //above line is to force update since regions is an object property that isn't made till mounted() hook;
      
      let sorted = Object.values(this.wavesurfer.regions.list);
      sorted.sort((a, b) => (a.start > b.start) ? 1 : -1);
      return sorted;
    }

  },

  methods: {
    check(){
      this.checked = !this.checked;
    },
    playMusic() {
      this.playingPreview = false;
      this.playingRegion = -1;

      this.playing = !this.playing;
      this.wavesurfer.un('region-out',this.playNextRegion)
      this.wavesurfer.playPause();
    },
    playPreview(){
      if(this.playingPreview){
        this.playing=false;
        this.playingPreview=false;
        this.wavesurfer.pause();
        this.wavesurfer.un('region-out',this.playNextRegion)

      }else {
        if(this.numRegions > 0){
          this.playing = true;
          this.playingPreview = true;

          console.log(this.sortedRegions);
          if(this.playingRegion < 0)
            this.playingRegion = 0;
          this.sortedRegions[this.playingRegion].play();
          console.log('playing-region: ' + this.playingRegion)
          this.wavesurfer.on('region-out', this.playNextRegion);
        } else {
            remote.dialog.showMessageBox(null, {
              message : 'No regions found for this track. Please create one or more by clicking and dragging on the waveform or wait for the track to finish loading.',
              title : 'No Regions Found',
              type : 'warning'
            })
        }//TODO: Maybe add a dialog box to create a region if no regions made?
      }
    },
    clearRegions(){
      this.wavesurfer.regions.clear();
      this.numRegions = 0;
      console.log(this.wavesurfer.regions.list)
      this.$emit('clear-regions',this.file)
    },
    removeRegion(){

    },
    playRegion(){

    },
    playNextRegion(region){
      console.log(this.sortedRegions.length)
      console.log(this.playingRegion)
      if(region == this.sortedRegions[this.playingRegion])
        {
          if(this.playingRegion >= this.sortedRegions.length - 1){
              //end of Regions
              console.log('end of regions')
              this.playingRegion = -1;
              this.playing = false;
              this.playingPreview = false;
              this.wavesurfer.un('region-out',this.playNextRegion)
          } else {
          this.playingRegion += 1;
          this.sortedRegions[this.playingRegion].play();
          console.log('playing-region: ' + this.playingRegion)
          }
        }
    },
    loadMusic(diskPath) {
      this.filePath = diskPath;
      this.songName = path.basename(diskPath);
      let buffer = fs.readFileSync(diskPath); 
      let stream = this.bufferToStream(buffer); 
      let fileUrl; 
      streamToBlob(stream)
        .then(res => {
          fileUrl = res;
          
          let filePath = window.URL.createObjectURL(fileUrl);
          
          this.wavesurfer.load(filePath);
          
          this.wavesurfer.play();
          this.playing = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    openFileLocation(){
      shell.showItemInFolder(this.filePath)
    },
    bufferToStream(binary) {
      const readableInstanceStream = new Readable({
        read() {
          this.push(binary);
          this.push(null);
        }
      });
      return readableInstanceStream;
    }
    
  },
  watch: {
    computedVolume: function (newVol) {
      this.wavesurfer.setVolume(newVol);
    },
    minPxPerSec: function(minPx) {
      this.wavesurfer.zoom(minPx);
      if(minPx == 0){
        this.wavesurfer.toggleScroll();   //resizing doesnt work without toggling scroll off again
      }
    },
    checked: function(newChecked) {
      if(newChecked){
        this.$emit('checked-remove',this.file.path)
      } else {
        this.$emit('unchecked-remove',this.file.path)
      }
    },
    showCheckbox: function(){ //wavesurfer's responsive option doesn't respond to changes in CSS like adding/removing a grid column
      if(this.wavesurfer){
        this.$nextTick(()=> {
          this.wavesurfer.drawBuffer();
        });
      }
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
  
  div >>> .wavesurfer-handle {
    display: none;
  }
  
  button {
    height: 100%;
  }

  #waveform{ 
    height:100%;
    width:100%;
    position: relative;
    z-index: 2;
  }
  
  .loading {
    position: absolute;
    top: 50%; right: 0; left: 0;
    transform: translateY(-50%);
    font-size: 32px;
    z-index: 1;
  }

  .slide-container {
    display: grid;
    grid-template-columns: 94px 1fr 30px;
    grid-template-rows: 120px;
    background: #3c3c3c;
  }
  .buttons-div {
    display: flex;
    flex-direction: column;
  }
    
  input[type=range]{
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    margin: 0 0;
    width: 30px;
    
  }
  .control-button{
    display: flex; 
    flex-direction: row; 
    justify-content: space-between;
    align-items: center; 
    text-align:left;
  }

  .playButton {
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 74px;
    border-color: transparent transparent transparent white;
    transition: 100ms all ease;
    cursor: pointer;
    border-style: solid;
    border-width: 37px 0 37px 60px;
   }
  .playButton:hover {
    border-color: transparent transparent transparent #404040;
  }

 
  .text-cell{
    display:flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    max-height:128px;
  }

  #waveform >>> ::-webkit-scrollbar-track
  {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color:  rgba(40,40,40,1);
    border: 1px solid rgba(90,90,90,1);
    border-radius: 5px;

  }

  #waveform >>>  ::-webkit-scrollbar-thumb
  {
    border: 1px solid rgba(100,100,100,1);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: rgba(90,90,90,1);
    border-radius: 5px;
  }

input[type='checkbox'] {
    width:30px;
    height:30px;
    background:white;
    border-radius:5px;
    border:2px solid #555;
}

</style>



