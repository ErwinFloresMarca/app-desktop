<template>
  <div>
    <el-button type="danger" size="default" @click="refreshAllKeys">Reiniciar</el-button>
    <el-button type="success" size="default" @click="generateData">Generar</el-button><br>
    
    <el-tag
      class="tag"
      v-for="(item, index) in newKeys"
      :key="index"
      type="success"
      closable
      @close="onDeleteTag(index)"
    >
      <EditableInput
        :key="item.key"
        :value="item.newVal"
        :index="index"
        :change="onChangeNewVal"
      />
    </el-tag>
    
  </div>
</template>

<script>
import EditableInput from './EditableInput';
export default {
  name: 'GenerateCompositeObject',
  components: {
    EditableInput,
  },
  props: {
    list: {
      type: Array,
      default: null,
    },
    object: {
      type: Object,
      default: null,
    },
    onlyColumns: {
      type: Array,
      default: null,
    }
  },
  data(){
    return {
      newKeys: [],
    };
  },
  created(){
    this.refreshAllKeys();
  },
  computed: {
  },
  methods: {
    getOnlyKeys(){
      if(this.onlyColumns){
        return this.onlyColumns;
      }
      else{
        if(this.list){
          if(this.list.length>0){
            return Object.keys(this.list[0]);
          }else
            return [];
        }
        else if(this.object){
          return Object.keys(this.object);
        }
        else
          return [];
      }
    },
    getObjectsKeys(){
      if(this.list){
        if(this.list.length>0){
          return Object.keys(this.list[0]).filter(k => this.getOnlyKeys().includes(k)).map(k => {
            return Object.keys(this.list[0][k]);
          });
        }
        else
         return [];
      }
      else if(this.object){
        return Object.keys(this.object).filter(k => this.getOnlyKeys().includes(k)).map(k => {
            return Object.keys(this.object[k]);
          });
      }
      else
        return [];
    },
    refreshAllKeys(){
      this.newKeys = this.getObjectsKeys().reduce((d,a)=>a.concat(d),[]).map(k=> {
        return {
          key: k,
          newVal: k,
        }
      });
    },
    onDeleteTag(index){
      console.log(index)
      this.newKeys = this.newKeys.filter((v,i)=>{
        return i!==index;
      });
    },
    generateData(){
      var data=[]
      if(this.list)
        this.list.forEach(o => {
          data.push(this.refactorObject(o));
        })
      else if(this.object)
        data=this.refactorObject(this.object);
      this.$emit('on-refactor',data);
    },
    refactorObject(o){
      var newObj={};
      Object.keys(o).filter(k=> this.getOnlyKeys().includes(k))
        .forEach(k =>{
          Object.keys(o[k]).forEach(sk => {
            this.newKeys.forEach(nk=>{
              if(nk.key===sk)
                newObj[nk.newVal]=o[k][sk];
            });
          })
        })
      return newObj   
    },
    onChangeNewVal(index,newVal){
      this.newKeys[index].newVal=newVal;
    }
  },
};
</script>

<style lang="css" scoped>
.tag{
  margin: 5px;
}
</style>
