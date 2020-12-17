<template>
  <div>
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="11" :offset="0">
        Lista Documento 1
        <!-- select show keys -->
        <el-select v-model="showKeysList1" placeholder="seleccione las columnas" clearable multiple>
          <el-option v-for="item in (list1.length>0? Object.keys(list1[0]):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <br>
        <array-paginate
          :list="list1"
          filterable
          :on-select="onSelectl1"
        >
          <show-object
            slot-scope="row"
            :object="row.item"
            :principal-keys="showKeysList1"
            type="error"
            show-pupover
          />
        </array-paginate>
        <ExportToExcel
          file-name="lista socios con descuentos no registrados"
          :json-list="list1"
        />
      </el-col>
      <el-col :span="11" :offset="0">
        Lista Documento 2
        <!-- select show keys -->
        <el-select v-model="showKeysList2" placeholder="seleccione las columnas" clearable multiple>
          <el-option v-for="item in (list2.length>0? Object.keys(list2[0]):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <br>
        <array-paginate
          :list="list2"
          filterable
          :on-select="onSelectl2"
        >
          <show-object
            slot-scope="row"
            :object="row.item"
            :principal-keys="showKeysList2"
            type="error"
            show-pupover
          />
        </array-paginate>
        <ExportToExcel
          file-name="lista personal sin descuento"
          :json-list="list2"
        />
      </el-col>
    </el-row>
    <h3><span>Registros Seleccionados Para Emparejar Manualmente</span></h3>
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="10" :offset="0">
        Registro de Lista 1
        <show-object
          :object="l1select"
          :principal-keys="showKeysList1"
          type="info"
          show-pupover
        />
      </el-col>
      <el-col :span="3" :offset="0">
        <el-button v-if="l1select&&l2select" type="success" size="default" @click="onMatch">Emparejar</el-button>
      </el-col>
      <el-col :span="10" :offset="0">
        Registro de Lista 2
        <show-object
          :object="l2select"
          :principal-keys="showKeysList2"
          type="info"
          show-pupover
        />
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import ArrayPaginate from './ArrayPaginate';
import ShowObject from './ShowObject';
import ExportToExcel from './ExportToExcel';
export default {
  name: 'NoMatchLists',
  props: {
    list1: {
      type: Array,
      default: () => [],
    },
    list2: {
      type: Array,
      default: () => [],
    }
  },
  components: {
    ArrayPaginate,
    ShowObject,
    ExportToExcel,
  },
  data(){
    return {
      showKeysList1: [],
      showKeysList2: [],
      l1select: null,
      l2select: null,
    };
  },
  methods:{
    onMatch(){
      // emitir evento
      this.$emit('on-matched',{d1:this.l1select,d2:this.l2select});
      this.l1select = null;
      this.l2select = null;
    },
    onSelectl1(obj){
      this.l1select = obj; 
    },
    onSelectl2(obj){
      this.l2select = obj; 
    },
  },
};
</script>

<style>

</style>
