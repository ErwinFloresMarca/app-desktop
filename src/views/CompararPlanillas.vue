<template>
  <div class="com-planillas-container">
    <el-tabs type="card" tab-position="top">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i>{{ xlsx1.title }}</span>
        <br>
        <br>
        <el-collapse>
          <el-collapse-item v-if="xlsx1.info">
            <template slot="title">
              <el-badge :value="xlsx1.info.length" :is-dot="false" :hidden="false" type="success">
                <el-link type="success" :underline="false">Registros Recuperados</el-link>
              </el-badge>
            </template>
            <ArrayPaginate
              :list="xlsx1.info"
              filterable
            >
              <template slot-scope="row">
                <ShowObject
                  :object="row.item"
                  type="success"
                  show-all
                  show-area-info
                />
              </template>
            </ArrayPaginate>
          </el-collapse-item>
        </el-collapse>
        
        <LoadCoopPlanillas
          @on-filter="onFilterD1"
        />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"
          ><i class="el-icon-document"></i>{{xlsx2.title}}</span>
        <FilterExcelColumns
          :default-columns="xlsx2.filterColumns"
          :default-no-null-columns="xlsx2.noNullColumns"
          @on-filter="onFilterD2"
          :defaultfirst-row="xlsx2.firstRow"
        />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i>Emparejacion de datos</span>
        <el-row v-if="xlsx1.info && xlsx2.info" :gutter="20" type="flex" justify="space-around">
          <el-col :span="22" :offset="0">
            <match-info
              :arr1="xlsx1.info"
              :arr2="xlsx2.info"
              @on-match="onGenerateMatchList"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i>Comparacion de datos</span>
        <el-row :gutter="20" type="flex" justify="space-around">
          <el-col :span="22" :offset="0">
            <ValidateData 
              :match-list="matchList"        
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ShowObject from '@/components/ShowObject';
import ArrayPaginate from '@/components/ArrayPaginate';
import LoadCoopPlanillas from './CompPlanillasComponents/LoadCoopPlanillas';
import FilterExcelColumns from "@/components/FilterExcelColumns";
import MatchInfo from '../components/matchInfo.vue';
import ValidateData from './../components/ValidateData';
export default {
  name: "CompararPlanillas",
  components: {
    FilterExcelColumns,
    MatchInfo,
    ValidateData,
    LoadCoopPlanillas,
    ShowObject,
    ArrayPaginate,
  },
  data(){
    return {
      xlsx1: {
        title: "Palanillas De Descuento Cooperativa",
        
        info: null,
      },
      xlsx2: {
        title: "Seleccione Nomina de Personal UATF",
        filterColumns: [
          {
            oldKey: 'E',
            newKey: 'ITEM',
          },
          {
            oldKey: 'F',
            newKey: 'CI',
          },
          {
            oldKey: 'G',
            newKey: 'APELLIDOS Y NOMBRES'
          },
          {
            oldKey: 'L',
            newKey: 'MONTO'
          },
        ],
        noNullColumns: [
          'G',
          'L',
        ],
        firstRow: 4,
        info: null,
      },
      matchList:[],
    };
  },
  methods: {
    onFilterD1(data){
      this.xlsx1.info = data;
    },
    onFilterD2(data){
      this.xlsx2.info = data;
    },
    onGenerateMatchList(matchList){
      this.matchList = matchList;
    }
  },
};
</script>

<style lang="css" scoped>
.com-planillas-container{
  margin: 5px;
  padding: 10px;
}
</style>
