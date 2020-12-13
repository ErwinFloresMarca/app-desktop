<template>
  <div v-if="array.length > 0">
    <el-search-table-pagination
      type="local"
      :data="array"
      :page-sizes="[5, 10, 15]"
      :columns="columns"
      :form-options="formOptions"
    >
    </el-search-table-pagination>
  </div>
</template>

<script>
export default {
  name: "ShowData",
  props: {
    array: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formOptions: {
        fuzzy: true,
        inline: true,
        submitBtnText: "Buscar",
        forms: [],
      },
      columns: [],
    };
  },
  created(){
    this.generateFormItems();
    this.generateColumns();
  },
  watch:{
    array(){
      this.generateFormItems();
      this.generateColumns();
    }
  },
  methods: {
    generateFormItems(){
      if(this.array.length>0){
        this.formOptions.forms = Object.keys(this.array[0]).map(k => {
          return {prop: k, label: k};
        });
      }
    },
    generateColumns(){
      if(this.array.length>0){
        this.columns = Object.keys(this.array[0]).map(k => {
          return {prop: k, label: k, width: 'inherit'};
        });
      }
    },
  },
};
</script>

<style>
</style>
