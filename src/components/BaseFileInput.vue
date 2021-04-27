<template>
    
        <label for="file-upload" class="base-file-input" >
            <slot></slot>{{name}}
            <input type = "file" id="file-upload" :multiple="multiple" @change="handleFiles" @click="$event.target.value=null" v-bind="$attrs" />
        </label>
    
</template>

<script>
export default {
    name: "BaseFileInput",
    inheritAttrs: false,
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
        }
  },
  methods: {
      handleFiles(e){
          console.log(e.target.files)
          if(this.multiple == false)
            this.$emit('input',e.target.files)
          else
            this.$emit('input',e.target.files)
      }
  }
}
</script>


<style scoped>
input[type="file"]{
    display:none;
  }

.base-file-input {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    /*display: flex;
    align-items: center;
    justify-content:center;*/
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid grey;
    background-color: #eeeeee;
    color:black;
}
.base-file-input:hover {
    background-color: #dddddd;
 }

</style>