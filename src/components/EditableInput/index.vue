<template>
    <el-popover
      placement="top"
      title="Opciones"
      trigger="click"
      width="100px"
    >
      <el-button v-if="!editable" type="warning" size="mini" icon="el-icon-edit" plain @click="onEdit">Editar</el-button>
      <el-button v-else type="success" size="mini" icon="el-icon-document-checked" plain @click="onSave">Salvar</el-button>
      <!-- <template> -->
        <el-input v-show="editable" :slot="editable?'reference':''" class="input" ref="text" v-model="text" type="text" placeholder="" :readonly="!editable" size="mini"/>
        <el-link v-show="!editable" :slot="!editable?'reference':''" type="success" :underline="false">{{text}}</el-link>
      <!-- </template> -->
    </el-popover>
</template>

<script>
export default {
  name: 'EditableInput',
  props: {
    value: {
      type: String,
      default: () => '',
    },
    index: {
      type: Number,
      default: null,
    },
    change: {
      type: Function,
      default: null,
    }
  },
  data: () => {
    return {
      text: '',
      editable: false,
    };
  },
  created(){
    this.text = this.value;
  },
  methods: {
    onChange(value){
      this.$emit('input', value);
      if(this.change)
        this.change(this.index,value);
    },
    onSave(){
      this.editable = false;
      this.onChange(this.text);
    },
    onEdit(){
      this.editable = true;
      const app = this;
      setTimeout(function(){
        app.$refs.text.focus();
      },500)
    },
  },
};
</script>

<style lang="css" scoped>
.input{
  width: 200px;
}
</style>
