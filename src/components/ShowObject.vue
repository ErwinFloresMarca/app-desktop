<template>
  <div class="container" v-if="object" :type="type" shadow="hover">
    <el-popover
      placement="bottom"
      :disabled="!showPupover"
      :title="generateTitle"
      trigger="hover">
      <el-alert :type="type" effect="light" show-icon :closable="false">
        <table border="0px">
          <tr v-for="k in Object.keys(object)" :key="k">
            <td align="right"><strong>{{ k }}</strong></td>
            <td>{{ object[k] }}</td>
          </tr>
        </table>
      </el-alert>
      <el-link slot="reference" :type="(type==='error'? 'danger' : type)" :underline="true" @click="toggleShow">
        {{ generateTitle }}
      </el-link>
    </el-popover>
    <template v-if="showAllContent">
      <el-alert :type="type" effect="light" show-icon :closable="false">
        <table border="0px">
          <template v-for="k in Object.keys(object)">
            <tr :key="k">
              <td align="right">
                <Strong>{{ k }}</Strong>
              </td>
              <td align="center">
                -
              </td>
              <td align="left">
                {{ object[k] }}
              </td>
            </tr>
          </template>
        </table>
      </el-alert>
    </template>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    object: {
      type: Object,
      default: () => null,
    },
    principalKeys: {
      type: Array,
      default: () => null,
    },
    showAreaInfo: {
      type: Boolean,
      default: ()=>false,
    },
    type: {
      type: String,
      default: 'info',
    },
    showPupover: {
      type: Boolean,
      default: false,
    }
  },
  data(){
    return {
      showAllContent: false,
    };
  },
  computed: {
    generateTitle(){
      return this.getPrincipalKeys().map(e => {
        if(String(this.object[e]) === 'undefined'){
          return 'no tiene';
        }
        else{
          return this.object[e];
        }
      }).join(' ');
    },
  },
  methods: {
    getPrincipalKeys(){
      if(this.principalKeys&&this.object)
        return this.principalKeys;
      else
        return [Object.keys(this.object)[0]];
    },
    toggleShow(){
      if(this.showAreaInfo){
        this.showAllContent = !this.showAllContent;
      }
    },
  },
};
</script>

<style lang='css' scoped>
.container{
  border: 1px;
  margin: 3px;
  padding: 5px;
  border-radius: 10px;
  border-color: rgb(199, 198, 198);
  border-style: solid;
}
</style>
