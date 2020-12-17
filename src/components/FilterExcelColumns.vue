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
                  :title="'No tiene datos'"
                  :object="row.item"
                  show-all
                  type="warning"
                  show-area-info
                />
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
    }
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
      this.getFilterColumns();
    },
    onFilter({data, excluded}) {
      this.info = data.map(o => {
        return changeAndOrderKeys(o,[...this.filterColumns]);
      });
      this.excluded = excluded.map(o => {
        return changeAndOrderKeys(o,this.filterColumns);
      });
      this.$emit('change', data);
      this.$emit("on-filter", this.info);
    },
    onChangeFilterColumns(list){
      this.filterColumns=list;
    },
    onChangeFilterColumnsList(list){
      this.filterColumnsList = list;
    },
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
