<template>
  <button v-bind="$attrs" class=confirmation-button @click="showConfirmationWindow" >
    <slot></slot>{{text}}
  </button>
</template>

<script>
import{ remote } from 'electron';

export default {
  inheritAttrs: false,
  name: 'ConfirmationButton',
  components: {
  },
  props: {
    windowTitle: {
        default: 'Confirmation Window'
    },
    message: {
        default: 'Are you sure you want to do this?'
    },
    buttons: {
        type: Array,
        default: function(){
          return ['Cancel','Yes'];
        }
    },
    type: {
        default: 'question',
        validator: function (value) {
          // The value must match one of these strings
          return ['none','info','error', 'question','warning'].indexOf(value) !== -1;
        }
    },
    sync: {
        type: Boolean,
        default: true,
    },
    text: {
      type: String,
    },
    acceptId: {
      type: Number,
      default: 1,
    }
  },
  data: function() {
    return {}
  },
  mounted(){

  },
  methods: {
    showConfirmationWindow(){
      if(this.sync){
        let buttonIdx = remote.dialog.showMessageBoxSync(null, this.options);
        console.log(buttonIdx);
        if(buttonIdx == this.acceptId)
          this.confirmationAccepted();
      } else {
        remote.dialog.showMessageBox(null, this.options) 
          .then(({response,checkboxChecked}) => {
            checkboxChecked;
            if(response == this.acceptId)
              this.confirmationAccepted();
          });
      }
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