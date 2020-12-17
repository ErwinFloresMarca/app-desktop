<template>
  <div v-if="matchList.length>0">
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="9" :offset="0">
        <el-select v-model="validKeysd1" placeholder="seleccione una columna" clearable>
          <el-option v-for="item in (matchList.length>0? Object.keys(matchList[0].d1):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :offset="0">
        <el-select v-model="validTask" placeholder="seleccione la comparacion" clearable>
          <el-option v-for="item in listValidRules"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
        <br><br>
        <el-button type="default" size="default" @click="newTaskVaild">Añadir Verificacion</el-button>
        <br><br>
        <el-button type="success" size="default" @click="initFilter">Iniciar Revicion</el-button>
        <br>
        <el-button type="danger" size="default" @click="reset">Reiniciar</el-button>
      </el-col>
      <el-col :span="9" :offset="0">
        <el-select v-model="validKeysd2" placeholder="seleccione una columna" clearable>
          <el-option v-for="item in (matchList.length>0? Object.keys(matchList[0].d2):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    
    <div v-if="successList.length>0||errorList.length>0">
      <el-row :gutter="20" type="flex" justify="space-around">
        <el-col :span="11" :offset="0">
          <el-select v-model="showKeysListd1" placeholder="seleccione las columnas" clearable multiple>
            <el-option v-for="item in (matchList.length>0? Object.keys(matchList[0].d1):[])"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="11" :offset="0">
          <el-select v-model="showKeysListd2" placeholder="seleccione las columnas" clearable multiple>
            <el-option v-for="item in (matchList.length>0? Object.keys(matchList[0].d2):[])"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- succesList -->
      <br>
      <el-collapse :accordion="true">
        <el-collapse-item v-if="successList.length>0">
          <span slot="title">
            <el-badge :value="successList.length" type="success" :hidden="false">
              <el-link type="success" :underline="false">Registro Iguales</el-link>
            </el-badge>
          </span>
          <array-paginate
            :list="successList"
          >
            <el-row slot-scope="row" :gutter="20" type="flex" justify="space-around">
              <el-col :span="8" :offset="0">
                <show-object
                  :object="row.item.d1"
                  :principal-keys="showKeysListd1"
                  type="success"
                  show-area-info
                />
              </el-col>
              <el-col :span="8" :offset="0">
                <show-object
                  :object="row.item.d2"
                  :principal-keys="showKeysListd2"
                  type="success"
                  show-area-info
                />
              </el-col>
              <el-col :span="6" :offset="0">
                <show-object
                  :object="row.item.success"
                  show-all
                  type="success"
                  show-area-info
                />
              </el-col>
            </el-row>    
          </array-paginate>
          <GenerateAdvancedReport
            :list="successList"
            :extract-sub-objects="['d1','d2','success']"
          />
        </el-collapse-item>
        <el-collapse-item v-if="errorList.length>0">
          <span slot="title">
            <el-badge :value="errorList.length" :hidden="false">
              <el-link type="danger" :underline="false">Registro Diferentes</el-link>
            </el-badge>
          </span>
          <array-paginate
            :list="errorList"
          >
            <el-row slot-scope="row" :gutter="20" type="flex" justify="space-around">
              <el-col :span="8" :offset="0">
                <show-object
                  :object="row.item.d1"
                  :principal-keys="showKeysListd1"
                  type="error"
                  show-area-info
                />
              </el-col>
              <el-col :span="8" :offset="0">
                <show-object
                  :object="row.item.d2"
                  :principal-keys="showKeysListd2"
                  type="error"
                  show-area-info
                />
              </el-col>
              <el-col :span="6" :offset="0">
                <show-object
                  :object="row.item.error"
                  type="error"
                  show-area-info
                />
              </el-col>
            </el-row>
          </array-paginate>
          <!-- cambiar por Avanzado -->
          <GenerateAdvancedReport
            :list="errorList"
            :extract-sub-objects="['d1','d2','error']"
          />
        </el-collapse-item>
      </el-collapse>
      <el-row v-if="acumTaskResult" :gutter="20" type="flex" justify="end">
        <el-col :span="10" :offset="0">
          <show-object
            :object="acumTaskResult"
            :principal-keys="['title']"
            :type="acumTaskResult.type"
            :hide-keys="['title','type']"
            show-area-info
          />
        </el-col>
      </el-row>
      
    </div>
  </div>
</template>

<script>
import GenerateAdvancedReport from './GenerateAdvancedReport';
//import ExportToExcel from './ExportToExcel';
import ArrayPaginate from './ArrayPaginate';
import ShowObject from './ShowObject';
//import GenerateCompositeObject from './GenerateCompositeObject';
export default {
  name: 'ValidateData',
  props: {
    matchList: {
      type: Array,
      default: () => [],
    }
  },
  components: {
    ArrayPaginate,
    ShowObject,
    // GenerateCompositeObject,
    // ExportToExcel,
    GenerateAdvancedReport,
  },
  data(){
    return {
      showKeysListd1: [],
      showKeysListd2: [],
      listValidRules: [
        {
          id: 1,
          label: "comparacion de igualdad"
        },
        {
          id: 2,
          label: "Suma total y Comparacion"
        },
      ],
      validKeysd1: null,
      validKeysd2: null,
      validTask: null,
      tasks: [],
      successList: [],
      errorList: [],
      acumTaskResult: null,
      reporListError: null,
    };
  },
  watch: {
    matchList(newVal){
      if(this.tasks>0&&newVal){
        this.initFilter();
      }
    }
  },
  methods: {
    onRefactorListError(data){
      this.reporListError = data;
    },
    reset(){
      this.successList=[];
      this.errorList=[];
      this.acumTaskResult=null;
      this.tasks = [];
    },
    initFilter(){
      if(this.tasks.length>0){
        let et=this.tasks.filter(t => {
          return t.vrId===1;
        });
        let at=this.tasks.filter(t => {
          return t.vrId===2;
        });
        et = et.length>0? et[0]: null;
        at = at.length>0? at[0]: null;
        this.validateTasks(et,at);
      }
      else{
        this.$message({
          message: 'No tiene ninguna Regla de Validacion registrada!!!',
          type: 'warning',
          showClose: true,
          duration: 5000,
        });
      }
    },
    newTaskVaild(){
      if(!this.validTask||!this.validKeysd1||!this.validKeysd2){
        this.$message({
          message: 'todos los select deben tener un valor seleccionado!!',
          type: 'warning',
          showClose: true,
          duration: 5000,
        });
        return;
      }
      this.tasks.push({
        ks1: this.validKeysd1,
        ks2: this.validKeysd2,
        vrId: this.validTask,
      });
      this.onAddTask();
    },
    onAddTask(){
      this.validKeysd1 = null;
      this.validKeysd2 = null;
      this.validTask = null;
    },
    validateTasks(EqualsTask,acumCompTask){
      var t1k=0,t2k=0;
      this.errorList = [];
      this.successList = [];
      this.matchList.forEach(e => {
        if(acumCompTask){
          t1k+=e.d1[acumCompTask.ks1];
          t2k+=e.d2[acumCompTask.ks2];
        }
        if(EqualsTask)
        if(this.verifyTaskEquals(e.d1,e.d2,EqualsTask)){
          let resp = {
            success: {},
            d1: e.d1,
            d2: e.d2
          }
          resp.success[EqualsTask.ks1]=e.d1[EqualsTask.ks1]
          resp.success[EqualsTask.ks2]=e.d2[EqualsTask.ks2]
          this.successList.push(resp);
        }
        else {
          let resp = {
            error: {},
            d1: e.d1,
            d2: e.d2
          }
          resp.error[EqualsTask.ks1]=e.d1[EqualsTask.ks1]
          resp.error[EqualsTask.ks2]=e.d2[EqualsTask.ks2]
          this.errorList.push(resp);
        }
      });
      if(acumCompTask){
        this.acumTaskResult = {
          title: 'Total Suma ('+acumCompTask.ks1+' + '+acumCompTask.ks2+')',
          type: (t1k===t2k? 'success':'error'),
          resultado: (t1k===t2k? '':'No ')+'Son Iguales',
        };
        this.acumTaskResult['TOTAL '+acumCompTask.ks1] = t1k;
        this.acumTaskResult['TOTAL '+acumCompTask.ks2] = t2k;
      }
    },
    verifyTaskEquals(d1,d2,task){
      return d1[task.ks1] === d2[task.ks2];
    }
  },
};
</script>

<style>

</style>