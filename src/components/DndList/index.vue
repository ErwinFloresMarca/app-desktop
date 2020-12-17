<template>
  <el-row :gutter="20">
    <el-col :span="11" :offset="0">
      <h3>{{ list1Title }}</h3>
      <draggable :list="dlist1" group="article" class="dragArea">
        <div v-for="element in dlist1" :key="element.oldKey" class="list-complete-item">
          <div class="list-complete-item-handle">
            <el-input v-if="element.oldKey === editEleOldKey" v-model="editEleNewKey" placeholder="intro nuevo nombre" size="mini" />
            <template v-else>{{ element.oldKey }} | {{ element.newKey }}</template>
          </div>
          <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -20px;margin-right:5px;" @click="deleteEle(element)">
              <i style="color:#F56C6C" class="el-icon-delete" />
            </span>
            <span v-if="element.oldKey === editEleOldKey" style="float: right ;margin-top: -20px;margin-right:5px;" @click="saveEle(element)">
              <i style="color:#67C23A" class="el-icon-check" />
            </span>
            <span v-else style="float: right ;margin-top: -20px;margin-right:5px;" @click="editEle(element)">
              <i style="color:#E6A23C" class="el-icon-edit" />
            </span>
          </div>
        </div>
      </draggable>
    </el-col>
    <el-col :span="11" :offset="0">
      <h3>{{ list2Title }}</h3>
      <draggable :list="dlist2" group="article" class="dragArea">
        <div v-for="element in dlist2" :key="element.oldkey" class="list-complete-item">
          <div class="list-complete-item-handle2" @click="pushEle(element)">
            {{ element.oldKey }} | {{ element.newKey }}
          </div>
        </div>
      </draggable>
    </el-col>
  </el-row>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'DndList',
  components: { draggable },
  props: {
    list1: {
      type: Array,
      default() {
        return [];
      },
    },
    list2: {
      type: Array,
      default() {
        return [];
      },
    },
    list1Title: {
      type: String,
      default: 'list1',
    },
    list2Title: {
      type: String,
      default: 'list2',
    },
  },
  data(){
    return {
      dlist1:[],
      dlist2:[],
      editEleOldKey: null,
      editEleNewKey: null,
    };
  },
  watch: {
    list1(newVal){
      this.dlist1=newVal;
    },
    list2(newVal){
      this.dlist2=newVal.filter(e=>!this.dlist1.includes(e));
    },
    dlist1(newVal){
      this.$emit('on-change-list1',newVal);
    },
    dlist2(newVal){
      this.$emit('on-change-list2',newVal);
    },
  },
  created(){
    this.dlist1 = this.list1;
    this.dlist2 = this.list2.filter(e=>!this.dlist1.includes(e));
  },
  methods: {
    isNotInList1(v) {
      return this.list1.every(k => v.oldKey !== k.oldKey);
    },
    isNotInList2(v) {
      return this.list2.every(k => v.oldKey !== k.oldKey);
    },
    editEle(ele){
      this.editEleOldKey =  ele.oldKey;
      this.editEleNewKey = ele.newKey;
    },
    saveEle(ele){
      if(this.editEleNewKey.length<1){
        this.$message({
          message: 'No puede dejar este campo vacio.',
          type: 'warning',
          showClose: true,
          duration: 5000,
        });
        return;
      }
      for (const item of this.list1) {
        if (item.oldKey === ele.oldKey) {
          const index = this.list1.indexOf(item);
          this.list1[index].newKey=this.editEleNewKey;
          break;
        }
      }
      this.editEleOldKey =  null;
      this.editEleNewKey = null;
    },
    deleteEle(ele) {
      for (const item of this.list1) {
        if (item.oldKey === ele.oldKey) {
          const index = this.list1.indexOf(item);
          this.list1.splice(index, 1);
          break;
        }
      }
      if (this.isNotInList2(ele)) {
        this.list2.unshift(ele);
      }
    },
    pushEle(ele) {
      for (const item of this.list2) {
        if (item.oldKey === ele.oldKey) {
          const index = this.list2.indexOf(item);
          this.list2.splice(index, 1);
          break;
        }
      }
      if (this.isNotInList1(ele)) {
        this.list1.push(ele);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
