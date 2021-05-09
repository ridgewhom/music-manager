<template>
    <photoshop-picker v-model="colors" class="color-picker" 
    @ok = "setColor"
    @cancel = "closeWindow"
    />
</template>

<script>
import  photoshop  from 'vue-color/src/components/Photoshop'
import { remote, ipcRenderer } from 'electron';



export default {
    name: 'ColorPicker',
    data() {
        return {
            colors: {
                hex: this.$store.state.waveformProgressColor,
            }
        }
    },
    mounted(){
        console.log(this.colors.hex)
    },
    components: {
        'photoshop-picker': photoshop
    },
    methods: {
        pass: function(){
            console.log(this.colors);
        },
        setColor: function(){
            let message = {
                setWaveformProgressColor : this.colors.hex
            }
            ipcRenderer.send('preferences-update',message)
            this.closeWindow();
        },
        closeWindow: function(){
            remote.getCurrentWindow().close();
        }
    },
    beforeDestroy(){
    }
}

</script>

<style scoped>

    .color-picker >>> .vc-ps-body {
        border-radius: 0;
        border: 0;
        background-color: #222222;
        color: white;
    }

    .color-picker >>> .vc-ps-head {
        display: none;
    }
    .color-picker >>> .vc-ps-ac-btn {
        border: 1px solid rgba(90,90,90,1);
        background: #3c3c3c;
        color: lightgrey;
        box-shadow: none;
        border-radius: 0px;
        font-size: 14px;
    }
    .color-picker >>> .vc-ps-ac-btn:hover {
        filter: brightness(150%);
        cursor:pointer;
    }
    .color-picker >>> .vc-ps-previews__label{
        color: lightgrey;
    }
    .color-picker >>> .vc-ps-saturation-wrap, .color-picker >>> .vc-ps-hue-wrap, .color-picker >>> .vc-ps-previews__swatches  {
        border-color: #2c2c2c;
    }
</style>