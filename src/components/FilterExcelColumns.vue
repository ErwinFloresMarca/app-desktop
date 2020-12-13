<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24" :lg="{span: (this.jsonData? 7: 24), offset: 0}" :offset="0">
        <el-row :gutter="20" type="flex" justify="center">
          <UploadExcel
            :on-read="onRead"
            :on-filter="onFilter"
            :filter-columns="filterColumns"
            :no-null-columns="noNullColumns"
          />
        </el-row>
      </el-col>
      <el-col
        v-if="jsonData"
        :span="24"
        :lg="{ span: 16, offset: 0 }"
        :offset="0"
      >
        <el-collapse :accordion="true">
          <el-collapse-item>
            <template slot="title">
              <el-link type="primary" :underline="false">Filtros</el-link>
            </template>
            <el-row :gutter="20" type="flex" justify="space-around">
              <el-col :span="14" :offset="0">
                <h3><span>Selecione las columnas que Quiere Recuperar De Este Documento</span></h3>
                <el-select
                  v-model="filterColumns"
                  placeholder="Seleccione Columnas a seleccionar"
                  clearable
                  filterable
                  multiple
                  no-data-text="No hay datos"
                  no-match-text="No existe esta columna"
                  :filter-method="getFilterColumns"
                  @change="noNullColumns = filterColumns"
                >
                  <el-option
                    v-for="item in filterColumnsList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="9" :offset="0">
                <h3><span>Selecione las Columnas Obligatorias que deben tener los registros</span></h3>
                <span>Los registros que no tengan estas columna seran ignorados</span>
                <el-select
                  v-model="noNullColumns"
                  placeholder="Selecione las Columnas Obligatorias"
                  clearable
                  multiple
                >
                  <el-option
                    v-for="item in filterColumnsList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item v-if="info">
            <template slot="title">
              <el-badge :value="info.length" :is-dot="false" :hidden="false" type="success">
                <el-link type="success" :underline="false">Registros Recuperados</el-link>
              </el-badge>
            </template>
            <ShowArrData
              :array="info"
            />
          </el-collapse-item>
          <el-collapse-item v-if="excluded" title="Registros Desechados">
            <template slot="title">
              <el-badge :value="excluded.length" :is-dot="false" :hidden="false" type="warning">
                <el-link type="warning" :underline="false">Registros Descartados</el-link>
              </el-badge>
            </template>
            <ShowArrData
              :array="excluded"
            />
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UploadExcel from "./uploadExcel";
import ShowArrData from './showArrData';
export default {
  name: "FilterExcelColumns",
  components: {
    UploadExcel,
    ShowArrData,
  },
  props: {
    defaultColumns: {
      type: Array,
      default: () => [],
    },
    defaultNoNullColumns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filterColumns: null,
      filterColumnsList: [],
      noNullColumns: null,
      jsonData: null,
      info: null,
      excluded: null,
    };
  },
  watch: {
    info(newVal) {
      this.$emit("on-filter", newVal);
    },
  },
  created() {
    this.filterColumns = this.defaultColumns;
    this.noNullColumns = this.defaultNoNullColumns;
    this.filterColumnsList = this.defaultColumns;
  },
  methods: {
    getFilterColumns(kw) {
      this.filterColumnsList = [];
      this.jsonData.forEach((r) => {
        Object.keys(r).forEach((k) => {
          if ((r[k] + "").includes(kw)) {
            if (
              this.filterColumnsList.indexOf(r[k]) === -1 &&
              this.filterColumnsList.length < 30
            )
              this.filterColumnsList.push(r[k]);
          }
        });
      });
    },
    onRead(Json) {
      this.jsonData = Json;
      if (!this.defaultColumns) this.getFilterColumns("");
    },
    onFilter(data, excluded) {
      this.info = data;
      this.excluded = excluded;
      this.$emit('change', data);
    },
  },
};
</script>

<style lang="css" scoped>
.el-row {
  margin: 10px;
}
.el-select {
  width: 100%;
}
</style>
