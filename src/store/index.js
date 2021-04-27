import Vue from "vue"
import Vuex from "vuex"

import _ from 'lodash';

import { createPersistedState } from "vuex-electron"
//import { createPersistedState, createSharedMutations } from "vuex-electron"


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      musicFiles: [],       //convert this to hashMap in case of large number of files?
      nameFilter: '',
      genreFilter: '',
      artistFilter: '',
      globalVolume: 1,
      minPxPerSec: 0,
      selectRemoveEnable: false,
    },
  
    actions: {
      pushFile(store,file){
        store.commit("PUSH_FILE",file);
      },
      clearFiles(store){
        store.commit("CLEAR_FILES");
      },
      removeFile(store,filePath){
        store.commit("REMOVE_FILE",filePath)
      },
      setGlobalVolume(store,volume){
        store.commit("SET_GLOBAL_VOLUME",volume);
        //console.log(volume)
      },
      setNameFilter(store,name){
        //console.log(name);
        store.commit("SET_NAME_FILTER",name);
      },
      setGenreFilter(store,genre){
        store.commit("SET_GENRE_FILTER",genre);
      },
      setArtistFilter(store,artist){
        store.commit("SET_ARTIST_FILTER",artist);
      },
      setMinPxPerSec(store,minPxPerSec){
        store.commit("SET_MIN_PX_PER_SEC",minPxPerSec);
      },
      addRegion(store,{region,file}){
        store.commit("ADD_REGION",{region,file});
      },
      removeRegion(store,{region,file}){
        store.commit("REMOVE_REGION",{region,file});
      },
      clearRegions(store,file){
        store.commit("CLEAR_REGIONS",file);
      },
      toggleSelectRemove(store){
        store.commit("TOGGLE_SELECT_REMOVE");
      }
    },
  
    mutations: {
      PUSH_FILE(state,file){
        let fileCopy = _.cloneDeep(file)
        if(! _.has(fileCopy,"timestamps")){
          fileCopy.timestamps = [];
        }
        if(! _.has(fileCopy,"regions")){
          fileCopy.regions = [];
        }
        state.musicFiles.push(fileCopy)
      },
      CLEAR_FILES(state){
        state.musicFiles.splice(0,state.musicFiles.length) //ensure reactivity with splice
      },
      REMOVE_FILE(state,filePath){
        state.musicFiles = state.musicFiles.filter(x => x.path != filePath)
      },
      SET_GLOBAL_VOLUME(state,volume){
        state.globalVolume = volume
      },
      SET_NAME_FILTER(state,name){
        state.nameFilter = name;
      },
      SET_GENRE_FILTER(state,genre){
        state.genreFilter = genre;
      },
      SET_ARTIST_FILTER(state,artist){
        state.artistFilter = artist;
      },
      SET_MIN_PX_PER_SEC(state,minPxPerSec){
        state.minPxPerSec= minPxPerSec;
      },
      ADD_REGION(state,{region,file}){
        let regionArr = state.musicFiles.find(x => { return x.path == file.path}).regions
        if(! regionArr.find(x => {return (x.start == region.start && x.end == region.end)}) !== undefined){
          regionArr.push(region);
        } else {
          console.log('region already added')
        }
      },
      // eslint-disable-next-line no-unused-vars
      REMOVE_REGION(state,{region,file}){      
        //TODO: 
      },
      CLEAR_REGIONS(state,file){
        let regionArr = state.musicFiles.find(x => { return x.path == file.path}).regions
        regionArr.splice(0,regionArr.length)
      },
      TOGGLE_SELECT_REMOVE(state){
        state.selectRemoveEnable = !state.selectRemoveEnable;
      }

    },
    getters: {
      filteredFiles: (state) => {
        console.log(state.genreFilter)
        let arr =  _.filter(state.musicFiles, file => (file.name.toLowerCase().includes(state.nameFilter.toLowerCase()) 
                                                        && file.genre.toLowerCase().includes(state.genreFilter.toLowerCase()) 
                                                        && file.artist.toLowerCase().includes(state.artistFilter.toLowerCase()))); //probably a more modular way to do this
        return arr;
      }
    },
  
    plugins: [createPersistedState({
      blacklist: ['SET_GENRE_FILTER','SET_NAME_FILTER','SET_MIN_PX_PER_SEC','SET_ARTIST_FILTER']
    })],
    //strict: process.env.NODE_ENV !== "production"
  })


  /*
musicFile 
{path: "...",
name: "...",
desc: "...",
genre: "...",
}

  */