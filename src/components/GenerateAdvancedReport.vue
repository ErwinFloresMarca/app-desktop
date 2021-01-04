<template>
  <div>
    <el-button type="primary" size="default" @click="onShowDialog">Generar Excel</el-button>
    <el-dialog
      title="Generar Excel Personalizado"
      :visible.sync="showDialog"
      width="70%"
    >
      <el-row :gutter="20" type="flex" justify="space-around">
        <el-col :span="23" :offset="0">
          <DndList
            :list1="orderListKeys"
            :list2="newListKeys"
            list1Title="Columnas para Exportar"
            list2Title="Columnas Posibles"
            @on-change-list1="onChangeOrderListKeys"
          />
        </el-col>
      </el-row>
      <br>
      <el-form label-width="95px" :inline="true">
        <el-form-item label="Ordenar Por:">
          <el-select class="select" v-model="orderBy" placeholder="Seleccione una columna" clearable>
            <el-option v-for="item in orderListKeys"
              :key="item.oldKey"
              :label="item.newKey"
              :value="item.newKey">
            </el-option>
          </el-select>
          {{ ' | ' }}
          <el-switch
            v-model="orderByAscend"
            active-text="Ascendente"
            inactive-text="Descendente"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="showDialog = false">Cancelar</el-button>
        <el-button type="primary" @click="OnGenerate">Generar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { export_json_to_excel } from '@/vendor/Export2Excel.js';
import { changeAndOrderKeys, extractAtribSubObject } from '@/utils/objectMethods';
import DndList from './DndList';
export default {
  name: 'GenerateAdvancedReport',
  props: {
    list: {
      type: Array,
      default: ()=>[],
    },
    extractSubObjects: {
      type: Array,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    }
  },
  components: {
    DndList,
  },
  data(){
    return {
      showDialog: false,
      newJsonList: [],
      basicList: [],
      newListKeys: [],
      orderListKeys: [],
      orderBy: null,
      orderByAscend: true,
    };
  },
  methods: {
    getNewListKeys(){
      if(this.basicList.length>0)
        return Object.keys(this.basicList[0]).map(k=>{
          return {
            oldKey:k,
            newKey:k,
          };
        });
      else
        return []
    },
    getBasicList(){
      if(this.extractSubObjects)
        return this.list.map(o => extractAtribSubObject(o,this.extractSubObjects))
      else
        return this.list;
    },
    generateNewList(){
      this.newJsonList = this.basicList.map(o => changeAndOrderKeys(o,this.orderListKeys ) );
    },
    compare( a, b ) {
      if ( a[this.orderBy] < b[this.orderBy] ){
        if(this.orderByAscend)
          return -1;
        else
          return 1;
      }
      if ( a[this.orderBy] > b[this.orderBy] ){
        if(this.orderByAscend)
          return 1;
        else
          return -1;
      }
      return 0;
    },
    OnGenerate(){
      this.generateNewList();
      this.newJsonList.sort(this.compare);
      if(this.newJsonList.length>0){
        let headers=Object.keys(this.newJsonList[0]);
        let dataMatriz= this.newJsonList.map(r => {
            return Object.keys(r).map(k=>r[k]);
          });
        export_json_to_excel({
          header: headers,
          data: dataMatriz,
          filename: this.fileName,
          bookType: 'xls',
        });
        this.showDialog = false;
        this.$message({
          message: 'Archivo Guardado Exitosamente!!!',
          type: 'success',
          showClose: true,
          duration: 5000
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
    onShowDialog(){
      this.showDialog = true;
      this.basicList = this.getBasicList();
      this.newListKeys = this.getNewListKeys();
    },
    onChangeOrderListKeys(list){
      this.orderListKeys = list;
    }
  },
};
</script>

<style lang="css" scoped>
</style>
