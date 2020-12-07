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
        Archivos xlsx con un tamaño menor que 500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "UploadExcel",
  props: {
    onReade: {
      type: Function,
      default: null,
    },
    filterColumns: {
      type: Array,
      default: null,
    },
    noNullColumns: {
      type: Array,
      default: null,
    },
    onRead: {
      type: Function,
      default: null,
    },
    onFilter: {
      type: Function,
      default: null,
    }
  },
  data() {
    return {
      file: {},
      masterJson: null,
      dataKeys: null,
      info: null,
    };
  },
  created() {},
  computed: {},
  watch: {
    filterColumns(newVal){
      if(newVal)
        this.getKeys();
    },
    noNullColumns(newVal){
      if(newVal)
        this.getInfo();
    },
    file(newValue) {
      if (newValue) {
        this.excelToJson(newValue);
      } else this.deleteData();
    },
    masterJson(newValue) {
      if (newValue) {
        this.getKeys();
        if(this.onRead)
          this.onRead([... newValue]);
      }
    },
    dataKeys(newValue) {
      if (newValue) this.getInfo();
    },
    info(newVal){
      if(newVal) if(this.onFilter) this.onFilter([... newVal]);
    }
  },
  methods: {
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
        /* DO SOMETHING WITH workbook HERE bit*/
        // console.log(workbook);
        let worksheet = workbook.Sheets[sheetName];
        // console.log(XLSX.utils.sheet_to_json(worksheet));
        app.masterJson = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },
    getKeys() {
      if (this.filterColumns) {
        //searchKeys
        this.dataKeys = this.masterJson
          .map((row, i) => {
            let keys = Object.keys(row)
              .map((ck) => {
                if (this.filterColumns.includes(row[ck]))
                  return {
                    fkey: row[ck],
                    xkey: ck,
                  };
                return false;
              })
              .filter((d) => d);
            if (keys.length === this.filterColumns.length)
              return { row: i, keys };
            return null;
          })
          .filter((d) => {
            return d;
          })[0];
      }
    },
    getInfo() {
      this.info = this.masterJson
        .map((val, i) => {
          if (i > this.dataKeys.row) {
            let data = this.filterRowWithNoNullColumns(val);
            if (data)
              return {
                row: i,
                ...data,
              };
            else return false;
          }
          return false;
        })
        .filter((d) => d);
    },
    filterRowWithNoNullColumns(row) {
      var newData = {};
      let haveKeys = this.dataKeys.keys.filter((k) => {
        newData[k.fkey] = row[k.xkey];
        if (this.NoNullColums().includes(k.fkey))
          if (row[k.xkey] !== undefined) return true;
          else return false;
        return false;
      });
      if (haveKeys.length === this.NoNullColums().length) return newData;
      else return false;
    },
    formatData(json) {
      if (this.filterColumns) {
        //searchKeys
        let keys = json
          .map((row, i) => {
            let keys = Object.keys(row)
              .map((ck) => {
                if (this.filterColumns.includes(row[ck]))
                  return {
                    fkey: row[ck],
                    xkey: ck,
                  };
                return false;
              })
              .filter((d) => d);
            if (keys.length === this.filterColumns.length)
              return { row: i, keys };
            return null;
          })
          .filter((d) => {
            return d;
          })[0];
        console.log(keys);
        let data = json
          .map((val, i) => {
            if (i > keys.row) {
              var Row = { row: i };
              for (let j = 0; j < keys.keys.length; j++) {
                if (val[keys.keys[j].xkey] != undefined)
                  Row[keys.keys[j].fkey] = val[keys.keys[j].xkey];
                else return false;
              }
              return Row;
            }
            return false;
          })
          .filter((d) => d);
        console.log(data);
      } else {
        console.log("all");
      }
    },
    onRemoveFile() {
      this.file = null;
      this.masterJson = null;
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
    },
  },
};
</script>

<style>
</style>
