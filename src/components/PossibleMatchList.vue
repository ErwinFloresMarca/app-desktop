<template>
  <div v-if="list.length>0">
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="11" :offset="0">
        <el-select v-model="showKeysListd1" placeholder="seleccione las columnas" clearable multiple>
          <el-option v-for="item in (list.length>0? Object.keys(list[0].d1):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="11" :offset="0">
        <el-select v-model="showKeysListd2" placeholder="seleccione las columnas" clearable multiple>
          <el-option v-for="item in (list.length>0? Object.keys(list[0].d2):[])"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <br>
    <array-paginate
      :list="list"
    >
      <el-row slot-scope="row" :gutter="20" type="flex" justify="space-around">
        <el-col :span="10" :offset="0">
          <show-object
            :object="row.item.d1"
            type="info"
            :principal-keys="(showKeysListd1.length>0? showKeysListd1: null)"
            show-area-info
          />
        </el-col>
        <el-col :span="3" :offset="0">
          <el-popover
            placement="top"
            title="Confirmar"
            trigger="hover"
          >
            <el-button slot="reference" icon="el-icon-check" @click="onConfirm(row)" type="success" size="small" circle></el-button>
          </el-popover>
          <el-popover
            placement="top"
            title="Desechar"
            trigger="hover"
          >
            <el-button slot="reference" icon="el-icon-close" @click="onDelete(row)" type="danger" size="small" circle></el-button>
          </el-popover>
        </el-col>
        <el-col :span="10" :offset="0">
          <show-object
            :object="row.item.d2"
            type="info"
            :principal-keys="(showKeysListd2.length>0? showKeysListd2: null)"
            show-area-info
          />
        </el-col>
      </el-row>
    </array-paginate>
  </div>
</template>

<script>
import ArrayPaginate from './ArrayPaginate'
import ShowObject from './ShowObject'
export default {
  name: 'PossibleMatchList',
  components: {
    ArrayPaginate,
    ShowObject,
  },
  props: {
    list: {
      type: Array,
      default: ()=>[],
    },
  },
  data(){
    return {
      showKeysListd1: [],
      showKeysListd2: [],
    };
  },
  methods: {
    onConfirm(row){
      this.$message({
        message: 'Registro confirmado!!!',
        type: 'success',
        showClose: true,
        duration: 5000,
      });
      this.$emit('on-confirm',{... row});
    },
    onDelete(row){
      this.$message({
        message: 'Registro desechado!!!',
        type: 'warning',
        showClose: true,
        duration: 5000,
      });
      this.$emit('on-delete',{... row});
    }
  },
}
</script>

<style lang="css" sscoped>
.el-button{
  margin: 5px;
}
</style>