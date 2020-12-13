<template>
  <div>
    <el-tabs type="card" tab-position="top">
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-document"></i>{{ xlsx1.title }}</span>
        <FilterExcelColumns
          :default-columns="xlsx1.filterColumns"
          :default-no-null-columns="xlsx1.noNullColumns"
          @change="onFilterD1"
        />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-document"></i>{{xlsx2.title}}</span>
        <FilterExcelColumns
          :default-columns="xlsx2.filterColumns"
          :default-no-null-columns="xlsx2.noNullColumns"
          @change="onFilterD2"
        />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i>Comparacion de datos</span>
        <el-row v-if="xlsx1.info && xlsx2.info" :gutter="20" type="flex" justify="space-around">
          <el-col :span="22" :offset="0">
            <match-info
              :arr1="xlsx1.info"
              :arr2="xlsx2.info"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FilterExcelColumns from "@/components/FilterExcelColumns";
//import CompareData from '@/components/compareData';
import MatchInfo from '../components/matchInfo.vue';
export default {
  name: "CompararPlanillas",
  components: {
    FilterExcelColumns,
    //CompareData,
    MatchInfo,
  },
  data(){
    return {
      xlsx1: {
        title: "Seleccione Palanilla De Descuento Permanente Ajustado",
        filterColumns: [
          'Nº SOCIO',
          'CEDULA DE IDENTIDAD',
          'APELLIOS PATERNO',
          'APELLIDOS MATERNO ',
          'NOMBRES ',
          'TOTAL GENERAL'
        ],
        noNullColumns: [
          'NOMBRES ',
          'TOTAL GENERAL',
        ],
        info: null,
      },
      xlsx2: {
        title: "Seleccione Nomina de Personal UATF",
        filterColumns: [
          'CI',
          'APELLIDOS Y NOMBRES',
          'MONTO',
        ],
        noNullColumns: [
          'APELLIDOS Y NOMBRES',
          'MONTO',
        ],
        jsonData: null,
        info: null,
      },
    };
  },
  methods: {
    onFilterD1(data){
      this.xlsx1.info = data;      
      console.log(data);
    },
    onFilterD2(data){
      this.xlsx2.info = data;      
      console.log(data);
    },
  },
};
</script>

<style>
</style>
