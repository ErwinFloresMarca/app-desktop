<template>
  <div>
    <el-row :gutter="20" type="flex" justify="space-around">
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
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="20" :offset="0">
        
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"></el-col>
          <el-col :span="12" :offset="0"></el-col>
        </el-row>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import UploadExcel from '@/components/uploadExcel';
export default {
  name: 'Home',
  components: {
    UploadExcel,
  },
  data(){
    return {
      xlsx1: {
        title: "Seleccione Palanilla De Descuento Permanente Ajustado",
        filterColumns: [
          'ITEM',
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
  methods: {
    onReadX1(Json){
      this.xlsx1.jsonData = Json;
    },
    onFilterX1(data){
      this.xlsx1.info = data;
      this.readx1 = true;
    },
    onReadX2(Json){
      this.xlsx2.jsonData = Json;
    },
    onFilterX2(data){
      this.xlsx2.info = data;
      this.readx2 = true;
    }
  }
}
</script>

<style> 

</style>