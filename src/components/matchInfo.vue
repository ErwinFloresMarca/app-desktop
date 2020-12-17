<template>
  <div v-if="arr1.length>0 && arr2.length>0">
    <el-row :gutter="20">
      <el-col :span="7" :offset="0">
        <h3><span>Seleccione Campo de la Lista 1</span></h3>
        <el-select v-model="l1CompareKeys" placeholder="seleccione campo a comparar" multiple clearable>
          <el-option v-for="item in getKeysList(list1)"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select> 
      </el-col>
      <el-col :span="7" :offset="0">
        <h3><span>Criterio de Comparación</span></h3>
        <el-select v-model="algoSelect" placeholder="seleccione 1">
          <el-option v-for="item in arrAlgoComp"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <br>
        <br>
        <el-button :disabled="showResults" type="primary" size="default" @click="matching">Iniciar Agrupacion</el-button> <br>
        <el-button type="danger" size="default" @click="initComponents">Reiniciar</el-button>
      </el-col>
      <el-col :span="7" :offset="0">
        <h3><span>Seleccione Campo de la Lista 2</span></h3>
        <el-select v-model="l2CompareKeys" placeholder="seleccione campo a comparar" multiple clearable>
          <el-option v-for="item in getKeysList(list2)"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>
    <el-collapse v-if="showResults" :accordion="true">
      <el-collapse-item>
        <span slot="title"><el-badge :value="matchList.length" :hidden="false" type="success">
          <el-link type="success" :underline="false">Registros Emparejados</el-link>
        </el-badge></span>
        <array-paginate
          :list="matchList"
          filterable
        >
          <el-row slot-scope="row" :gutter="20" type="flex" justify="space-around">
            <el-col :span="10" :offset="0">
              <show-object :object="row.item.d1" :principal-keys="l1CompareKeys" :type="'success'" show-area-info/>
            </el-col>
            <el-col :span="10" :offset="0">
              <show-object :object="row.item.d2" :principal-keys="l2CompareKeys" :type="'success'" show-area-info/>
            </el-col>
          </el-row>
        </array-paginate>
      </el-collapse-item>
      <el-collapse-item v-if="possibleMatchList.length>0">
        <span slot="title">
          <el-badge :value="possibleMatchList.length" :hidden="false" type="primary">
            <el-link type="info" :underline="false">Registros por confirmar</el-link>
          </el-badge>
        </span>
        Lista por Confirmar
        <possible-match-list 
          :list="possibleMatchList"
          @on-confirm="PMLonConfirm"
          @on-delete="PMLonDelete"
        />
      </el-collapse-item>
      <el-collapse-item v-if="list1.length>0||list2.length>0">
        <span slot="title">
          <el-badge :value="Math.max(list1.length,list2.length)" :max="99" :hidden="false">
            <el-link type="danger" :underline="false">Registros no Emparejados</el-link>
          </el-badge>
        </span>
        Listas No emparejadas
        <!-- <NoMatchList /> -->
        <no-matched-lists
          :list1="list1"
          :list2="list2"
          @on-matched="onMatchNM"
        />
      </el-collapse-item>
      
    </el-collapse>
    
  </div>
</template>

<script>
import Comp from '@/utils/compareData';
import ArrayPaginate from './ArrayPaginate';
import ShowObject from './ShowObject';
import NoMatchedLists from './NoMatchLists';
import PossibleMatchList from './PossibleMatchList';
export default {
  name: 'MatchInfo',
  components: {
    ArrayPaginate,
    ShowObject,
    NoMatchedLists,
    PossibleMatchList,
  },
  props: {
    arr1:{
      type: Array,
      default: () => [],
    },
    arr2: {
      type: Array,
      default: () => [],
    }
  },
  data(){
    return {
      list1: [],
      list2: [],
      matchList: [],
      possibleMatchList: [],
      hasNoMatched: false,
      showResults: false,
      arrAlgoComp: [
        {
          name: 'Carnet de Identidad',
          id: 1,
        },
        {
          name: 'Nombre',
          id: 2,
        },
        {
          name: 'Valor Unico',
          id: 3,
        }
      ],
      algoSelect: null,
      l1CompareKeys: [],
      l2CompareKeys: [],
    };
  },
  watch: {
    arr1(){
      this.initComponents();
    },
    arr2(){
      this.initComponents();
    },
    matchList(newVal){
      this.$emit('on-match',newVal);
    }
  },
  created(){
    this.initComponents();
  },
  methods: {
    PMLonConfirm(row){
      this.matchList.push(row.item);
      this.possibleMatchList = this.possibleMatchList.filter((v,i)=>{
        return (row.index !== i);
      });
    },
    PMLonDelete(row){
      this.list1.push(row.item.d1);
      this.list2.push(row.item.d2);
      this.possibleMatchList = this.possibleMatchList.filter((v,i)=>{
        return (row.index !== i);
      });
    },
    compareObjects(o1,o2){
      if(o1&&o2){
        const keys1 = Object.keys(o1);
        const keys2 = Object.keys(o2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          if (o1[key] !== o2[key]) {
            return false;
          }
        }
        return true;
      }
      else
        return false;
    },
    onMatchNM(m){
      this.list1 = this.list1.filter(e => !this.compareObjects(m.d1,e));
      this.list2 = this.list2.filter(e => !this.compareObjects(m.d2,e));
      this.matchList.push(m);
    },
    initComponents(){  
      this.list1 = this.arr1;
      this.list2 = this.arr2;
      this.matchList = [];
      this.possibleMatchList = [];
      this.hasNoMatched = false;
      this.showResults = false;
    },
    getKeysList(list){
      if(list.length>0)
        return Object.keys(list[0]);
      else
        return [];
    },
    matching(){
      const app = this;
      if(this.l1CompareKeys.length>0 && this.l2CompareKeys.length>0 && this.algoSelect){
        this.list1 = this.list1.filter(d1 => {
          var matched = false;
          this.list2 = this.list2.filter(d2 => {
            if(matched)
              return true;
            else{
              if(app.compareWithAlgoComp(d1,d2,app.algoSelect)){
                matched = true;
                return false;
              }
              else
                return true;
            }
          });
          if(matched)
            return false;
          else
            return true;
        });
        this.showResults = true;
        this.hasNoMatched = this.list1.length>0 || this.list2.length>0;
      }
      else{
        this.$message({
          message: 'seleccione almenos 1 para cada campo',
          type: 'warning',
          showClose: true,
          duration: 5000,
        });
      }
    },
    compareWithAlgoComp(d1,d2,algoId){
      switch(algoId){
        case 1:// CI
            switch(Comp.compareCI(d1[this.l1CompareKeys[0]],d2[this.l2CompareKeys[0]])){
              case 1:
                this.matchList.push(this.registerMatch(d1,d2));
                return true;
              case 0:
                this.possibleMatchList.push(this.registerMatch(d1,d2));
                return true;
              case -1:
                return false;
            } 
          break;
        case 2:// Nombre
            if(Comp.compareNames(this.l1CompareKeys.map(k => d1[k]),this.l2CompareKeys.map( k => d2[k]))){
              this.matchList.push(this.registerMatch(d1,d2));
              return true;
            }
            else {
              return false;
            }
        case 3://llave unica
          if(String(d1[this.l1CompareKeys[0]]).toUpperCase()===String(d2[this.l2CompareKeys[0]]).toUpperCase()){
            this.matchList.push(this.registerMatch(d1,d2));
            return true;
          }
          else
          return false;
      }
    },
    registerMatch(d1,d2){
      return {
        d1,
        d2
      }
    },
  },
};
</script>

<style>

</style>
