<template>
  <el-collapse :accordion="true">
    <el-collapse-item
      :title="dp.desc">
      <FilterExcelColumns
        :default-columns="dp.fc"
        :default-no-null-columns="dp.noNC"
        @on-filter="onFilterDP"
        :defaultfirst-row="dp.firstRow"
        :default-unique-columns="['Nro. SOCIO']"
      />
    </el-collapse-item>
    <el-collapse-item
      :title="np.desc">
      <FilterExcelColumns
        :default-columns="np.fc"
        :default-no-null-columns="np.noNC"
        @on-filter="onFilterNP"
        :defaultfirst-row="np.firstRow"
        :default-unique-columns="['Nro. SOCIO']"
      />
    </el-collapse-item>
    <el-collapse-item
      :title="j.desc">
      <FilterExcelColumns
        :default-columns="j.fc"
        :default-no-null-columns="j.noNC"
        @on-filter="onFilterJ"
        :defaultfirst-row="j.firstRow"
        :default-unique-columns="['Nro. SOCIO']"
      />
    </el-collapse-item>
    <el-collapse-item
      :title="g.desc">
      <FilterExcelColumns
        :default-columns="g.fc"
        :default-no-null-columns="g.noNC"
        @on-filter="onFilterG"
        :defaultfirst-row="g.firstRow"
        :default-unique-columns="['Nro. SOCIO']"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import FilterExcelColumns from '@/components/FilterExcelColumns'
export default {
  name: 'LoadCoopPlanillas',
  components: {
    FilterExcelColumns,
  },
  data(){
    return {
      dp: {
        desc: 'PLANILLA DESCUENTOS',
        fc: [
          {
            oldKey: 'B',
            newKey: 'Nro. SOCIO'
          },
          {
            oldKey: 'C',
            newKey: 'CEDULA DE IDENTIDAD',
          },
          {
            oldKey: 'D',
            newKey: 'APELLIDO PATERNO'
          },
          {
            oldKey: 'E',
            newKey: 'APELLIDO MATERNO'
          },
          {
            oldKey: 'F',
            newKey: 'NOMBRES'
          },
          {
            oldKey: 'AF',
            newKey: 'TOTAL GENERAL'
          },
        ],
        noNC: ['F','AF'],
        firstRow: 10,
        info: [],
      },
      j: {
        desc: 'PLANILLA JORNALEROS',
        fc: [
          {
            oldKey: 'B',
            newKey: 'Nro. SOCIO'
          },
          {
            oldKey: 'C',
            newKey: 'CEDULA DE IDENTIDAD',
          },
          {
            oldKey: 'D',
            newKey: 'APELLIDO PATERNO'
          },
          {
            oldKey: 'E',
            newKey: 'APELLIDO MATERNO'
          },
          {
            oldKey: 'F',
            newKey: 'NOMBRES'
          },
          {
            oldKey: 'O',
            newKey: 'TOTAL GENERAL'
          },
        ],
        firstRow: 12,
        noNC: ['F','O'],
        info: [],
      },
      np: {
        desc: 'PLANILLA NO PERMANENTES',
        fc: [
          {
            oldKey: 'B',
            newKey: 'Nro. SOCIO'
          },
          {
            oldKey: 'C',
            newKey: 'CEDULA DE IDENTIDAD',
          },
          {
            oldKey: 'D',
            newKey: 'APELLIDO PATERNO'
          },
          {
            oldKey: 'E',
            newKey: 'APELLIDO MATERNO'
          },
          {
            oldKey: 'F',
            newKey: 'NOMBRES'
          },
          {
            oldKey: 'U',
            newKey: 'TOTAL GENERAL'
          },
        ],
        firstRow: 8,
        noNC: ['F','U'],
        info: [],
      },
      g: {
        desc: 'PLANILLA GRANJAS',
        fc: [
          {
            oldKey: 'B',
            newKey: 'Nro. SOCIO'
          },
          {
            oldKey: 'C',
            newKey: 'CEDULA DE IDENTIDAD',
          },
          {
            oldKey: 'D',
            newKey: 'APELLIDO PATERNO'
          },
          {
            oldKey: 'E',
            newKey: 'APELLIDO MATERNO'
          },
          {
            oldKey: 'F',
            newKey: 'NOMBRES'
          },
          {
            oldKey: 'N',
            newKey: 'TOTAL GENERAL'
          },
        ],
        firstRow: 12,
        noNC: ['F','N'],
        info: [],
      },
    };
  },
  methods: {
    onFilterDP(data){
      this.dp.info = data;
      this.change();
    },
    onFilterG(data){
      this.g.info = data;
      this.change();
    },
    onFilterNP(data){
      this.np.info = data;
      this.change();
    },
    onFilterJ(data){
      this.j.info = data;
      this.change();
    },
    change(){
      var info = [];
      if(this.dp.info){
        info = info.concat(this.dp.info);
      }
      if(this.np.info)
        info = info.concat(this.np.info);
      if(this.j.info)
        info = info.concat(this.j.info);
      if(this.g.info)
        info = info.concat(this.g.info);
      this.$emit('on-filter',info);
    }
  },
};
</script>

<style>

</style>
