<template>
  <div class="container">
    <div class="filter-container" v-if="filterable">
      <el-row :gutter="20" type="flex" justify="end">
        <el-input class="filter-component" v-model="keyword" placeholder="palabra a buscar" size="small" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="filterList">Buscar</el-button>
      </el-row>
    </div>
    <div class="data-container">
      <el-row :gutter="20">
        <template v-if="getIndexs().length>0">
          <el-col :key="index" v-for="index in getIndexs()" :span="24">
            <el-container class="row-container" direction="horizontal">
              <span class="index"><strong>{{(index+1)+'.- '}}</strong></span>
              <el-tooltip v-if="onSelect" content="Seleccionar" placement="top" effect="dark">
                <el-link class="icon-select" :underline="false" @click="onSelect({... filteredList[index]})"><i class="el-icon-s-flag"></i></el-link>
              </el-tooltip>
              <div class="slot-container">
                <slot :index="list.indexOf(filteredList[index])" :item="{... filteredList[index]}"></slot>
              </div>  
            </el-container>
          </el-col>
        </template>
        <template v-else>
          Sin Datos
        </template>
      </el-row>
    </div>
    <el-pagination
      small
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5,10, 20, 40, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="filteredList.length" 
      hide-on-single-page
      background
    >
      :pager-count="7">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ArrayPaginate',
  props: {
    list: {
      type: Array,
      default: ()=> [], 
    },
    filterMethod: {
      type: Function,
      default: null,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    onSelect: {
      type: Function,
      default: null,
    },
  },
  data(){
    return {
      currentPage: 1,
      pageSize: 10,
      keyword:'',
      filteredList: [],
    };
  },
  computed: {
  },
  watch: {
    list(){
      this.filterList();
    },
  },
  created(){
    this.filteredList = this.list;
  },
  methods: {
    filterList(){
      this.currentPage = 1;
      this.filteredList =  this.list.filter((e) => {
        if(this.filterMethod){
          return this.filterMethod( e, this.keyword);
        }
        else {
          return JSON.stringify(e).toUpperCase().includes(String(this.keyword).toUpperCase());
        }
      });
    },
    sizeChange(newSize){
      this.pageSize = newSize;
      this.currentPage = 1;
    },
    currentChange(newPage){
      this.currentPage = newPage;
    },
    getIndexs(){
      var il=[];
      for(let i = ((this.currentPage - 1)*this.pageSize);i<(this.currentPage*this.pageSize);i++){
        if(this.filteredList[i]!=undefined){
          il.push(i);
        }
        else{
          break;
        }
      }
      return il;
    }
  },
}
</script>

<style lang="css" scoped>
.container{
  padding: 10px;
}
.filter-container{
  padding: 5px;
}
.data-container{
  padding: 5px;
}
.filter-component{
  width: 200px;
  margin-right: 10px;
}
.icon-select{
  margin-right: 5px;
}
.slot-container{
  width: 100%;
}
.row-container{
  border: 1px;
  border-style: solid;
  border-radius: 10px;
  border-color: rgb(179, 179, 179);
}
.index{
  padding: 5px;
}
</style>
