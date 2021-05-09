<template>
  <div id="home">
    <Toolbar/>
    <Main id= 'main'/>
  </div>
</template>

<script>
import Main from '@/components/Main.vue'
import Toolbar from '@/components/Toolbar.vue'
import { ipcRenderer} from 'electron';
export default {
  name: 'Home',
  created(){
    ipcRenderer.on('vuex-update',this.updateFromIPC);
  },
  components: {
    Main,
    Toolbar,
  }, 
  mounted() {
  },
  methods: {
    updateFromIPC(event,arg){
      for(let action in arg){
        this.$store.dispatch(action,arg[action])
      }
    }
  },
  beforeDestroy(){
    ipcRenderer.removeListener('vuex-update',this.updateFromIPC)
  },
  
}
</script>

<style>
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #1e1e1e;
  color: white;
  margin-top: 0px;
  overflow-y: hidden; /* Hide vertical scrollbar */

  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 35px 1fr;
  grid-gap: 0px;
  padding:0;
}

 button {
  border: 1px solid rgba(90,90,90,1);
  background: #3c3c3c;
  color: lightgrey;
  box-shadow: none;
  border-radius: 0px;
  font-size: 14px;
}
  button:hover {
    filter: brightness(150%);
    cursor:pointer;
}


body {
    margin-left: 0px;
    margin-bottom: 0px;
    margin-top:0px;
    overflow-y: hidden; /* Hide vertical scrollbar */
}
*,
*:after,
*:before{
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}


::-webkit-scrollbar-track
{
	box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color:  #1e1e1e;
  border: 1px solid rgba(90,90,90,1);

}

::-webkit-scrollbar
{
	width: 10px;
	background-color:  #1e1e1e;
}

::-webkit-scrollbar-thumb
{
  border-left: 1px solid rgba(90,90,90,1);
  border-right: 1px solid rgba(90,90,90,1);
	box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: rgba(90,90,90,1);

}


/*
 *  STYLE 2
 */
</style>
