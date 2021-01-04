<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" :lg="{span: (this.jsonData? 7: 24), offset: 0}" :offset="0">
        <el-row :gutter="20" type="flex" justify="center">
          <UploadExcel
            :on-read="onRead"
            @on-filter="onFilter"
            :filter-columns="fcook"
            :no-null-columns="noNullColumns"
            :first-row="firstRow"
          />
        </el-row>
      </el-col>
      <el-col
        v-show="jsonData"
        :span="24"
        :lg="{ span: 16, offset: 0 }"
        :offset="0"
      >
        <el-collapse :accordion="true">
          <el-collapse-item>
            <template slot="title">
              <el-link type="primary" :underline="false">Filtros</el-link>
            </template>
            <el-row :gutter="20" type="flex" justify="space-around">
              <el-col :span="15" :offset="0">
                <DndList
                  :list1="filterColumns"
                  :list2="filterColumnsList"
                  list1Title="Columnas a Filtrar"
                  list2Title="Columnas Encontradas"
                  @on-change-list1="onChangeFilterColumns"
                />
              </el-col>
              <el-col :span="7" :offset="0">
                <h4><span>Seleccione las columnas que deben tener contenido para ser tomados como un registro valido</span></h4>
                <el-select v-model="noNullColumns" placeholder="Seleccione las columnas que no pueden ser nulas." multiple filterable clearable>
                  <el-option v-for="item in filterColumns"
                    :key="item.oldKey"
                    :label="item.newKey"
                    :value="item.oldKey">
                  </el-option>
                </el-select>
                <h4><span>Numero de fila del primer registro</span></h4>
                <el-input v-model="firstRow" placeholder="numero de fila del primer registro valido" size="normal" clearable />
                <h4><span>Buscar Registros Repetidos por Columna</span></h4>
                <el-select v-model="uniqueColumns" placeholder="Seleccione las columnas que no deben repetirse." multiple filterable clearable @change="searchRepeatRegisters">
                  <el-option v-for="item in filterColumns"
                    :key="item.oldKey"
                    :label="item.newKey"
                    :value="item.oldKey">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item v-if="info">
            <template slot="title">
              <el-badge :value="info.length" :is-dot="false" :hidden="false" type="success">
                <el-link type="success" :underline="false">Registros Recuperados</el-link>
              </el-badge>
            </template>
            <ArrayPaginate
              :list="info"
              filterable
            >
              <template slot-scope="row">
                <showobject
                  :object="row.item"
                  type="success"
                  show-all
                  show-area-info
                />
                <el-button type="danger" size="mini" @click="onDeleted(row.index,row.item)" icon="el-icon-delete" round>Eliminar de Lista</el-button>
              </template>
            </ArrayPaginate>
          </el-collapse-item>
          <el-collapse-item v-if="excluded" title="Registros Desechados">
            <template slot="title">
              <el-badge :value="excluded.length" :is-dot="false" :hidden="false" type="warning">
                <el-link type="warning" :underline="false">Registros Descartados</el-link>
              </el-badge>
            </template>
            <ArrayPaginate
              :list="excluded"
              filterable
            >
              <template slot-scope="row">
                <showobject
                  :object="row.item"
                  show-all
                  type="warning"
                  show-area-info
                />
                <el-button type="success" size="mini" @click="onAdded(row.index,row.item)" icon="el-icon-check" round>Añadir a Lista</el-button>
              </template>
            </ArrayPaginate>
          </el-collapse-item>
          <el-collapse-item v-if="repeatList.length>0" title="Registros Repetidos">
            <template slot="title">
              <el-badge :value="repeatList.length" :is-dot="false" :hidden="false" type="danger">
                <el-link type="danger" :underline="false">Registros Repetidos</el-link>
              </el-badge>
            </template>
            <ArrayPaginate
              :list="repeatList"
              filterable
            >
              <template slot-scope="row">
                <el-row :gutter="20">
                  <el-col :span="12" :offset="0">
                    <showobject
                      :object="row.item.e1"
                      :principal-keys="uniqueColumns"
                      type="error"
                      show-area-info
                    />
                    <el-button type="success" size="mini" @click="onRepeatUse(row.item,1)" icon="el-icon-check" round>Usar Este</el-button>
                  </el-col>
                  <el-col :span="12" :offset="0">
                    <showobject
                      :object="row.item.e2"
                      :principal-keys="uniqueColumns"
                      type="error"
                      show-area-info
                    />
                    <el-button type="success" size="mini" @click="onRepeatUse(row.item,2)" icon="el-icon-check" round>Usar Este</el-button>
                  </el-col>
                </el-row>
              </template>
            </ArrayPaginate>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import showobject from './ShowObject';
import ArrayPaginate from './ArrayPaginate';
import DndList from './DndList';
import { changeAndOrderKeys } from '@/utils/objectMethods';
import UploadExcel from "./uploadExcel";
export default {
  name: "FilterExcelColumns",
  components: {
    UploadExcel,
    DndList,
    ArrayPaginate,
    showobject,
  },
  props: {
    defaultColumns: {
      type: Array,
      default: () => [],
    },
    defaultNoNullColumns: {
      type: Array,
      default: () => [],
    },
    defaultfirstRow: {
      type: Number,
      default: 1,
    },
    defaultUniqueColumns: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      fcook:[],
      filterColumns: [],
      firstRow: 1,
      filterColumnsList: [],
      noNullColumns: [],
      jsonData: null,
      info: null,
      excluded: null,
      uniqueColumns: null,
      repeatList: [],
    };
  },
  watch: {
    filterColumns(){
      this.fcook = this.filterColumns.map(o => o.oldKey);
    }
  },
  created() {
    this.filterColumns = [...this.defaultColumns];
    this.noNullColumns = [...this.defaultNoNullColumns];
    this.filterColumnsList = [... this.defaultColumns];
    this.fcook = this.filterColumns.map(o => o.oldKey);
    this.firstRow = this.defaultfirstRow;
    this.uniqueColumns = this.defaultUniqueColumns;
  },
  methods: {
    getFilterColumns() {
      var arrKeys=[];
      this.jsonData.forEach((r) => {
        Object.keys(r).forEach(k=> {
          if(!arrKeys.includes(k))
            arrKeys.push(k);
        })
      });
      var HaveKeys = this.filterColumnsList.map(k=>k.oldKey);
      this.filterColumnsList = this.filterColumnsList.concat(arrKeys.map(k=>{
        if(!HaveKeys.includes(k))
          return { oldKey:k, newKey: k };
        else
          return false;
      }).filter(e=>e));
    },
    onRead(Json) {
      this.jsonData = Json;
      if(this.jsonData)
        this.getFilterColumns();
    },
    onFilter({data, excluded}) {
      if(data&&excluded){
        this.info = data.map(o => {
          return changeAndOrderKeys(o,[...this.filterColumns]);
        });
        this.excluded = excluded.map(o => {
          return changeAndOrderKeys(o,this.filterColumns);
        });
        this.searchRepeatRegisters();
      }
      else{
        this.info = null;
        this.excluded = null;
        this.repeatList =[];
      }
      this.emitChanges();
    },
    onAdded(index,item){
      this.excluded=this.excluded.filter((e,i) => i!==index);
      this.info.push(item);
      this.emitChanges();
      this.$message({
        message: 'Registro añadido!!!',
        type: 'success',
        showClose: true,
        duration: 5000,
      });
    },
    onDeleted(index,item){
      this.info=this.info.filter((e,i) => i!==index);
      this.excluded.push(item);
      this.emitChanges();
      this.$message({
        message: 'Registro Eliminado!!!',
        type: 'warning',
        showClose: true,
        duration: 5000,
      });
    },
    onChangeFilterColumns(list){
      this.filterColumns=list;
    },
    onChangeFilterColumnsList(list){
      this.filterColumnsList = list;
    },
    searchRepeatRegisters(){
      if(!this.uniqueColumns)
        return;
      var rrlist = [];
      var checkIndexs=[];
      this.info.forEach((e1,i) => {
        this.info.forEach((e2,j)=> {
          if(i!==j){
            if(this.uniqueColumns.reduce( (a,c) =>{
              return (a | e1[c]===e2[c]);
            },false)&& !checkIndexs.includes(i)){
              rrlist.push({i1:i,e1:e1,i2:j,e2:e2});
              checkIndexs.push(i);
              checkIndexs.push(j);
            }
          }
        });
      });
      this.repeatList = rrlist;
    },
    onRepeatUse(itemRepeat,use){
      if(use=== 1){
        this.onDeleted(itemRepeat.i2,itemRepeat.e2)
      }
      else if( use === 2){
        this.onDeleted(itemRepeat.i1,itemRepeat.e1)
      }
    },
    emitChanges(){
      this.searchRepeatRegisters();
      this.$emit('change', this.info);
      this.$emit("on-filter", this.info);
    }
  },
};
</script>

<style lang="css" scoped>
.el-row {
  margin: 10px;
}
.el-select {
  width: 100%;
}
</style>
