<template>
  <div class=main>
    <div class="tableDiv">
      <table :style="[showCheckboxes ? checkboxStyle : withoutCheckboxStyle]">
        <thead>
            <th v-if="showCheckboxes">Remove?</th>
            <th @click='onHeaderClicked("name")'>Title</th>
            <th @click='onHeaderClicked("artist")'>Artist</th>
            <th @click='onHeaderClicked("genre")'>Genre</th>
            <th>Waveform</th>
        </thead>
        <tbody>
          <tr v-for="file in paginatedFiles" :key="file.path"  is="MusicSlide" 
            :file = file 
            :globalVolume = globalVolume 
            :minPxPerSec= minPxPerSec
            :showCheckbox = showCheckboxes
            :checked = "checkedFilesToRemove.includes(file.path)"
            @new-region-created="createRegion"
            @clear-regions="clearRegions"
            @remove-track="removeFile"
            @checked-remove="trackChecked"
            @unchecked-remove="trackUnChecked">
          </tr>
        </tbody>
      </table>
    </div>
    <page-navigator @remove-selected-files="removeSelectedfiles" @set-page="createPage" :totalItems="filteredFiles.length" :page="currentPage" :showRemoveButton="showCheckboxes"> </page-navigator>
  </div>
</template>

<script>
import MusicSlide from "./MusicSlide.vue"
import {mapState, mapGetters,mapActions} from 'vuex'
import _ from 'lodash'
import PageNavigator from './PageNavigator.vue'

export default {
  name: 'Main',
  data() {
    return {
        withoutCheckboxStyle: {
          'grid-template-columns': 'minmax(100px,2fr) minmax(100px,1fr) minmax(100px,1fr) minmax(150px, 10fr)'
        },
        checkboxStyle: {
          'grid-template-columns': '80px minmax(100px,2fr) minmax(100px,1fr) minmax(100px,1fr) minmax(150px, 10fr)'
        },
        sortOrderArr : ["name"],
        sortOrderAscOrDesc : ["asc"],
        currentPage: 1,
        startIdx: 0,
        endIdx: 10,
        checkedFilesToRemove: [],
    }
  },
  mounted() {},
  components: {
    MusicSlide,
    PageNavigator
  },
  props: {
    msg: String
  },
  computed: {
      ...mapState([
      'musicFiles',
      'globalVolume',
      'minPxPerSec',
    ]),
    ...mapState({
      showCheckboxes : 'selectRemoveEnable',
    }),
    ...mapGetters([
      'filteredFiles'
    ]),
    
    sortedFiles: function(){
      let sorted = _.orderBy(this.filteredFiles,this.sortOrderArr,this.sortOrderAscOrDesc)
      console.log('sorted = ' + sorted);
      return sorted;
    },
    paginatedFiles: function(){
        this.filteredFiles;
        let start = (this.startIdx < this.sortedFiles.length)? this.startIdx : 0 ;
        let end = (this.endIdx < this.sortedFiles.length) ? this.endIdx : this.sortedFiles.length;
        return this.sortedFiles.slice(start,end);
    }
  }
  ,
  methods: {
    ...mapActions([
        'removeFile',
        'addRegion',
        'removeRegion',
        'clearRegions',
    ]),
    createPage({startIdx,endIdx}){
      this.startIdx = startIdx;
      this.endIdx = endIdx;
    },
    createRegion({newRegion,file}){
      console.log(newRegion);
      console.log(file);

      //grab color, start, end from region
      //we don't really care about other properties, they can be left as defaults or are the same for all regions
      let color = newRegion.color;
      let start = newRegion.start;
      let end = newRegion.end;
      console.log(newRegion.end)
      console.log(color + ' ' + start + ' ' + end)

      let region = {color: color, start: start, end: end}
      this.addRegion({region,file});
      //add region to store, regions are stored as objects with color, start, end properties

    },
    onHeaderClicked(header){
      console.log(header)
      let idx = this.sortOrderArr.indexOf(header)
      if(idx == 0){
        
        this.$set(this.sortOrderAscOrDesc,0,(this.sortOrderAscOrDesc == 'asc') ? 'desc' : 'asc')
        console.log(this.sortOrderAscOrDesc);
      } else if (idx > 0){
        this.sortOrderArr.splice(idx,1);
        this.sortOrderArr.unshift(header);

        this.sortOrderAscOrDesc.splice(idx,1);
        this.sortOrderAscOrDesc.unshift('asc'); //this feels more natural to user to have it set to ascending than keeping old setting

      } else {
        this.sortOrderArr.unshift(header);
        this.sortOrderAscOrDesc.unshift('asc');
      }

    },
    trackChecked(filePath){
      this.checkedFilesToRemove.push(filePath);
    },
    trackUnChecked(filePath){
      this.checkedFilesToRemove = this.checkedFilesToRemove.filter(x => x != filePath);
    },
    removeSelectedfiles(){
      for(let filePath of this.checkedFilesToRemove){
        this.removeFile(filePath);
      }
    }

  }
}
</script>

<style scoped>
  .main {
    display: grid;
    grid-template-rows: 1fr 30px;
  }

  .tableDiv {
    background-color: #222222 ;
    height:100%;
    border: 0px;
    border-left: 1px solid rgba(90,90,90,1);
    margin: 0;
    padding: 0;
    position: relative;
    overflow-y: scroll;
  }


  table {
      border-style:hidden;
      display: grid;
      min-width: 100%;
      /*grid-template-columns: 
        minmax(100px,2fr) minmax(100px,1fr) minmax(100px,1fr) minmax(150px, 10fr);*/
  }

  

  table thead, tbody, tr ::v-deep {
      display: contents;
  }

  table th {
    position: sticky;
    background: #234;
    color: white;
    z-index: 5;
    
  }

  table th, table >>> td {
    border: 1px solid rgba(90,90,90,1);
    border-top: 0px;
  }
  
  table th {
    border-top: 1px solid rgba(90,90,90,1); 
  }

  .tableDiv{
    border-bottom: 1px solid rgba(90,90,90,1);
  }
  .main {
    overflow-y: auto;
  }

  div >>>  tbody, tr  {
    display: contents;
    z-index: 2;
  }
  div >>> th {
    position: sticky;
    top: 0;
    background: #234;
    color: white;
  }
  table >>> td {
    word-wrap: break-word;
    overflow: hidden;
    overflow-wrap: anywhere;
  }
  table >>> tr {
    height: 128px;
  }

</style>
