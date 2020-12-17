<template>
  <div>
    Exportar a Excel <el-button type="success" size="default" @click="onExport">
      Guardar como Excel
    </el-button>
    
  </div>
</template>

<script>
import { export_json_to_excel } from '@/vendor/Export2Excel.js';
export default {
  name: 'ExportToExcel',
  props: {
    fileName: {
      type: String,
      default: 'excel-list',
    },
    jsonList: {
      type: Array,
      default: () => [],
    },
  },
  data(){
    return {

    };
  },
  methods: {
    onExport(){
      if(this.jsonList.length>0){
        let headers=Object.keys(this.jsonList[0]);
        let dataMatriz= this.jsonList.map(r => {
            return Object.keys(r).map(k=>r[k]);
          });
        export_json_to_excel({
          header: headers,
          data: dataMatriz,
          filename: this.fileName
        });
      }
      else {
        this.$message({
          message: 'La lista a exportar esta vacia!!!',
          type: 'info',
          showClose: true,
          duration: 5000,
        });
      }
    },
  },
}
</script>

<style>

</style>