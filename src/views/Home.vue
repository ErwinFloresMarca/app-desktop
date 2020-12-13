<template>
  <div>
    <!-- <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="10" :offset="0">
        <el-card shadow="hover" :body-style="{ padding: '5px' }">
          <div slot="header">
            <span>{{xlsx1.title}}</span>
          </div>
          <UploadExcel
            :on-read="onReadX1"
            :on-filter="onFilterX1"
            :filter-columns="xlsx1.filterColumns"
            :no-null-columns="xlsx1.noNullColumns"
          />
        </el-card>
      </el-col>
      <el-col :span="10" :offset="0">
        <el-card shadow="hover" :body-style="{ padding: '5px' }">
          <div slot="header">
            <span>{{xlsx2.title}}</span>
          </div>  
          <UploadExcel
            :on-read="onReadX2"
            :on-filter="onFilterX2"
            :filter-columns="xlsx2.filterColumns"
            :no-null-columns="xlsx2.noNullColumns"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row v-if="readx1 && readx2" :gutter="20" type="flex" justify="space-around">
      <el-col :span="22" :offset="0">
        <CompareData
          :arr1="xlsx1.info"
          :arr2="xlsx2.info"
        />
      </el-col>
    </el-row>
     -->
    <CompararPlanillas />
  </div>
</template>

<script>
import CompararPlanillas from './CompararPlanillas';
// import UploadExcel from '@/components/uploadExcel';
// import CompareData from '@/components/compareData';
export default {
  name: 'Home',
  components: {
    // UploadExcel,
    // CompareData,
    CompararPlanillas,
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
        jsonData: null,
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
      readx1: false,
      readx2: false,
    };
  },
  created(){
  },
  methods: {
    onReadX1(Json){
      this.xlsx1.jsonData = Json;
    },
    onFilterX1(data){
      this.xlsx1.info = data;
      this.searchSpecialCi(this.xlsx1.info,'CEDULA DE IDENTIDAD'),
      this.readx1 = true;
    },
    onReadX2(Json){
      this.xlsx2.jsonData = Json;
    },
    onFilterX2(data){
      this.xlsx2.info = data;
      this.searchSpecialCi(this.xlsx2.info,'CI');
      this.readx2 = true;
    },
    searchSpecialCi(arr,key){
      arr.forEach(e => {
        if(e[key].length>7)
          console.log(e[key])
      });
    }
  }
}
</script>

<style> 

</style>