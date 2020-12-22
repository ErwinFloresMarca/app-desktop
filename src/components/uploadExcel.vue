<template>
  <div>
    <el-upload
      action="/"
      drag
      :on-remove="onRemoveFile"
      :on-change="beforeUpload"
      :on-exceed="onExceeded"
      :auto-upload="false"
      :limit="1"
      list-type="picture"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Suelta tu archivo aquí o <em>haz clic para cargar</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        Archivos xlsx
      </div>
    </el-upload>
  </div>
</template>

<script>
import XLSX from "xlsx";
import generateHeders from '@/utils/generateXlsxHeaders';
export default {
  name: "UploadExcel",
  props: {
    filterColumns: {
      type: Array,
      default: ()=>[],
    },
    noNullColumns: {
      type: Array,
      default: ()=>[],
    },
    firstRow: {
      type: Number,
      default: 1,
    },
    endRow: {
      type: Number,
      default: null,
    },
    onRead: {
      type: Function,
      default: null,
    }
  },
  data() {
    return {
      file: {},
      masterJson: null,
      info: null,
      finalLineIndex: null,
      excluded: null,
    };
  },
  watch: {
    filterColumns(newVal){
      if(newVal)
        this.getInfo();
    },
    noNullColumns(newVal){
      if(newVal)
        this.getInfo();
    },
    file(newValue) {
      if (newValue) {
        this.excelToJson(newValue);
      }
      else this.deleteData();
    },
  },
  methods: {
    inRange(r){
      return r.__rowNum__>=this.firstRow-1&&(this.endRow? this.endRow>=r.__rowNum__:true);
    },
    NoNullColums() {
      if (this.noNullColumns) return this.noNullColumns;
      else return this.filterColumns;
    },
    excelToJson(file) {
      const app = this;
      var f = file.raw;
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        app.$emit('on-read-worbook',workbook);
        /* DO SOMETHING WITH workbook HERE bit*/
        let worksheet = workbook.Sheets[sheetName];
        let headers = generateHeders('A:AZ');
        // inject headers to row 1
        // for(let i = 0; i<=headers.length;i++)
        //   worksheet[headers[i]+'0']=app.getInjectColumnSheet(headers[i]);
        app.masterJson = XLSX.utils.sheet_to_json(worksheet,{header: headers});
        if(app.onRead)
          app.onRead([... app.masterJson]);
        app.getInfo();
      };
      reader.readAsArrayBuffer(f);
    },
    getInfo() {
      if(this.masterJson===null)
        return;
      this.excluded = [];
      this.info = this.masterJson
        .map((val) => {
          if (this.inRange(val)) {
            let data = this.filterRowWithNoNullColumns(val);
            if (data)
              return {
                ...data,
              };
            else return false;
          }
          return false;
        })
        .filter((d) => d);
      this.$emit('on-filter',{data: [... this.info], excluded: [... this.excluded]});
    },
    filterRowWithNoNullColumns(row) {
      if(this.filterColumns.length===0)
        return true;
      var newData = {};
      let haveKeys = this.filterColumns.filter((k) => {
        newData[k] = row[k];
        if (this.NoNullColums().includes(k))
          if (row[k] !== undefined) return true;
          else return false;
        return false;
      });
      if (haveKeys.length === this.NoNullColums().length) return newData;
      else {
        this.excluded.push(newData);
        return false;
      }
    },
    onRemoveFile() {
      this.file = null;
      this.masterJson = null;
      this.info = null;
      if(this.onRead)
        this.onRead(null);
      this.$emit('on-filter',{data: null, excluded: null})
    },
    beforeUpload(file) {
      this.file = file;
    },
    onExceeded() {
      this.$message({
        message: "Ya se selecciono un Archivo, eliminelo para subir otro",
        type: "warning",
        showClose: true,
        duration: 3000,
      });
    },
    deleteData() {
      this.file = null;
      this.dataKeys = null;
      this.info = null;
      this.masterJson = null;
      this.excluded = null;
      this.$emit('on-filter',{data: null, excluded: null})
    },
    getInjectColumnSheet(val){
      return {
        v: val,
        t: 's',
        w: val,
      }
    }
  },
};
</script>

<style>
</style>
