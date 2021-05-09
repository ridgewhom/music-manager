<template>
  <div id="nav-bar">
    <div style="display: flex; align-items: center;">Showing {{itemsDisplayedStart}} to {{itemsDisplayedEnd}} of {{totalItems}} </div>
    <confirmation-button v-show="showRemoveButton" class="remove-files-button" @confirmation-accepted="$emit('remove-selected-files')"
    style="display: flex-basis: 2">Remove Selected Files</confirmation-button>
    <div>
      <div style="display: flex; align-items: center;">
        Show 
        <select @change="resetPage" v-model.number="itemsPerPage" style="margin-right:5px; margin-left:5px; height: 100%;">
          <option value=0>All</option>
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=20>20</option>
          <option value=30>30</option>
          <option value=40>40</option>
          <option value=50>50</option>
          <option value=100>100</option>
        </select>
        Music Tracks
      </div>
      <button :disabled="this.currentPage == 1" @click="goToFirstPage">First</button>
      <button :disabled="this.currentPage == 1" @click="decrementPage" style="display:flex; align-items: center; justify-content: center;">
        <font-awesome-icon icon="angle-left" size="2x"/>
      </button>
      <input class="page-input" min="1" :max="totalPages"  v-model="pageInput" :title="'Enter a Value between 1 and ' + {totalPages}"/>
      <button :disabled="this.currentPage == this.totalPages" @click="incrementPage" style="display:flex; align-items: center; justify-content: center;">
        <font-awesome-icon icon="angle-right" size="2x"/>
      </button>
      <button :disabled="this.currentPage == this.totalPages" @click="goToLastPage" >Last</button>
    </div>
  </div>
</template>

<script>
import ConfirmationButton from './ConfirmationButton.vue';

export default {
  name: 'PageNavigator',
  components: {
    ConfirmationButton,
  },
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
    }


  },
  data: function() {
    return {
      itemsPerPage: 20,
      currentPage: 1,
      pageInput: 1,
    }
  },
  mounted(){
    console.log(this.totalItems)
  },
  methods: {
    resetPage(){
      this.currentPage = 1;
    },
    incrementPage(){
      this.currentPage = (this.currentPage < this.totalPages) ? this.currentPage + 1 : this.currentPage;
    },
    decrementPage(){
      this.currentPage = (this.currentPage > 1) ? this.currentPage - 1 : this.currentPage;

    },
    goToLastPage(){
      this.currentPage = this.totalPages;
    },
    goToFirstPage(){
      this.currentPage = 1;
    },
    goToPage(pageNum){
      this.currentPage = pageNum;
    }
  },
  computed: {
    totalPages: function(){
      if(this.itemsPerPage == 0){
        return 1;
      }
      let total = Math.ceil(this.totalItems/this.itemsPerPage)
      console.log('totalPages = ' + total)
      return total;
    },
    itemsDisplayedStart: function() {
      let itemsPerPage = parseInt(this.itemsPerPage)
      console.log('start ' + itemsPerPage + 'totalitems' + this.itemsPerPage)
      return (this.currentPage - 1) * itemsPerPage + 1
    },
    itemsDisplayedStartIdx: function(){
      return this.itemsDisplayedStart - 1 ;
    },
    itemsDisplayedEnd: function(){
      let itemsPerPage = parseInt(this.itemsPerPage)
      if(this.itemsPerPage){
        let end = (this.currentPage - 1) * itemsPerPage + itemsPerPage;
        end = (end > this.totalItems) ? this.totalItems : end;       
        //end = parseInt(end);
        return end ;
      }else {
        return this.totalItems;
      }
    },
    currentPageIdxs: function(){
      console.log('currentPageidxs fired')
      return {startIdx: this.itemsDisplayedStartIdx,endIdx: this.itemsDisplayedEnd} 
    }
  }, watch: {
      currentPageIdxs: function(newCurrentPageIdxs) {
        this.$emit('set-page',newCurrentPageIdxs)
      },
      pageInput: function(newPage) {
        if(newPage > 0 && newPage <= this.totalPages){
          this.currentPage = newPage;
        }
        this.pageInput = this.currentPage;
      }
  }
  
}

</script>

<style scoped>

  #nav-bar{
    display:flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
    
  }
  #nav-bar >>> div{
    display:flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-end;
    
  }
  button:disabled{
    filter:brightness(.5);
    cursor: auto;
  }
  .remove-files-button {
    background-color: Brown;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }
  .page-input {
    width: 50px;
    text-align:center;
    font-size: 18px;
    font-weight: bold;

  }


</style>