<template>
  <div>
    <el-button type="primary" size="default" @click="onShowDialog">Cambiar montos en Planilla UATF</el-button>
    <el-dialog
      title="Cambiar montos en Planilla UATF"
      :visible.sync="showDialog"
      width="50%"
    >
      <upload-excel
        @on-read-worbook="onReadWorkBook"
      />
      <el-form label-width="150px">
        <el-form-item label="Lista Campo Item">
          <el-select v-model="itemKey" placeholder="seleccione el campo como item" clearable>
            <el-option v-for="item in listKeys"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Lista Campo TOTAL">
          <el-select v-model="totalKey" placeholder="seleccione el campo como TOTAL" clearable>
            <el-option v-for="item in listKeys"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="Columna Campo Item">
          <el-input v-model="itemCol" type="text" placeholder="" size="normal" clearable></el-input>
        </el-form-item>
        <el-form-item label="Columna Campo Monto">
          <el-input v-model="totalCol" type="text" placeholder="" size="normal" clearable></el-input>
        </el-form-item>
        <el-form-item label="Numero de fila del primer Registro">
          <el-input v-model="frr" type="number" placeholder="Fila " size="normal" clearable></el-input>
        </el-form-item>
        <el-form-item label="Numero de fila del ultimo Registro">
          <el-input v-model="er" type="number" placeholder="Fila " size="normal" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="onInitInyect">Cambiar</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { saveAs } from '@/utils/saveAs';
const SaveAs = saveAs;
import XLSX from 'xlsx'
import uploadExcel from './uploadExcel.vue';
export default {
  components: { uploadExcel },
  name: 'InyectToExcel',
  props: {
    list: {
      type: Array,
      default: ()=>[],
    },
    firstRow: {
      type: Number,
      default: 1,
    },
    ik: {
      type: String,
      default: '',
    },
    tk: {
      type: String,
      default: '',
    },
    ic: {
      type: String,
      default: '',
    },
    tc: {
      type: String,
      default: '',
    }
  },
  watch: {
    list(newVal){
      if(newVal){
        if(newVal.length)
          this.listKeys=Object.keys(newVal[0]);
        else
          this.listKeys = [];
      }
      else 
        this.listKeys = [];
    },
  },
  data(){
    return {
      workbook: null,
      showDialog: false,
      listKeys: [],
      itemKey: '',
      totalKey: '',
      itemCol: '',
      totalCol: '',
      frr: 1,
      er: 1505,
    };
  },
  created(){
    this.itemKey = this.ik;
    this.totalKey = this.tk;
    this.itemCol = this.ic;
    this.totalCol = this.tc;
    this.frr = this.firstRow;
    if(this.list){
        if(this.list.length)
          this.listKeys=Object.keys(this.list[0]);
        else
          this.listKeys = [];
      }
      else 
        this.listKeys = [];
  },
  methods: {
    saveAS(b,o){
      return SaveAs(b,o)
    },
    onShowDialog(){
      this.showDialog = true;
    },
    onInitInyect(){
      var haveInfo=this.list.map(e=>e[this.itemKey]);
      var sheetName = this.workbook.SheetNames[0];
      for (let i = this.frr; i <= this.er; i++) {
        let wbkitem = this.itemCol.concat(String(i));
        let wbktotal = this.totalCol.concat(String(i));
        if(this.workbook.Sheets[sheetName][wbkitem]){
          var pos = haveInfo.indexOf(this.workbook.Sheets[sheetName][wbkitem].v);
          if(pos!==-1){
            this.workbook.Sheets[sheetName][wbktotal]=this.gennDataInyect(this.list[pos][this.totalKey],'n');
          }
          else
            this.workbook.Sheets[sheetName][wbktotal]=this.gennDataInyect('','s');
        }
      }
      this.saveWB(this.workbook,'DECIENTOS UATF DICIEMBRE 2020');
    },
    onReadWorkBook(wb){
      this.workbook = wb;
    },
    gennDataInyect(data,type){
      return {
        v: data,
        t: type,
        w: data,
      }
    },
    saveWB(wb,filename){
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      });
      SaveAs(new Blob([this.s2ab(wbout)], {
        type: "application/octet-stream"
      }), `${filename}.${'xlsx'}`);
    },
    s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  },
};
</script>

<style>

</style>
