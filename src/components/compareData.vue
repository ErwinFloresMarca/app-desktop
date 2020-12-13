<template>
  <div>
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="7" :offset="0">
        <el-select
          v-model="keys1" placeholder="" clearable multiple
        >
          <el-option v-for="item in (arr1.length>0? Object.keys(arr1[0]): [] )"
            :key="item.trim()"
            :label="item.trim()"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="7" :offset="0">
        <el-select
          v-model="typeCom" placeholder="" clearable
        >
          <el-option v-for="item in typeCompare"
            :key="item.id"
            :label="item.type"
            :value="item.id">
          </el-option>
        </el-select>
        Unico: <el-switch
          v-model="unique"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch> <br>
        <!-- botones de Revisar y agregar tarea -->
        <el-button type="primary" size="default" @click="addTask">Añadir Tarea</el-button>
        <el-button v-if="selectUnique" type="success" size="default" @click="initComp">Comparar</el-button>
      </el-col>
      <el-col :span="7" :offset="0">
        <el-select
          v-model="keys2" placeholder="" clearable multiple
        >
          <el-option v-for="item in (arr2.length>0? Object.keys(arr2[0]): [] )"
            :key="item.trim()"
            :label="item.trim()"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row v-if="checked" :gutter="20">
      <el-col :span="24" :offset="0">
        <el-alert :key="ind" v-for="(al, ind) in notifications" :title="al.title" :type="al.type" :description="al.description" effect="dark" show-icon />
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
//import {compareCI,compareNames,compareNumbers} from '@/utils/compareData';
export default {
  name: 'CompareData',
  props: {
    arr1: {
      type: Array,
      default: () => [],
    },
    arr2: {
      type: Array,
      default: () => [],
    }
  },
  data(){
    return {
      selectUnique: false,
      checked: false,
      keys1: [],
      keys2: [],
      unique: false,
      typeCom: 1,
      compareAttrib:[],
      typeCompare: [
        {
          id: 1,
          type: 'Igual a',
          desc: 'los dos valores deben ser exactamente iguales.'
        },
        {
          id: 2,
          type: 'Similar',
          desc: 'se vera si son similares con un porsentaje de igualdad', 
        },
        {
          id: 3,
          type: 'Calcular Total y Comparar',
          desc: 'se comparara La suma de las colunas', 
        },
      ],
      calcTotalAndCompare: [],
      notifications: [],
    };
  },
  created(){
    console.log('es similar: ',this.isSimilar(
      {
        nombres: 'erwin ramiro',
        paterno: 'flores',
        materno: 'marca'
      },
      {
        'apellidos y nombres': 'flores marca erwin ramiro'
      },
      {
        ats1: ['paterno','materno','nombres'],
        ats2: ['apellidos y nombres'],
        type: 2,
      }
    ));
  },
  methods: {
    initComp(){
      const app =this;
      // si son iguales
      if(this.arr1.length !== this.arr2.length)
        this.notifications.push(this.makeNotIncosist("La cantidad de registros son diferentes"))
      // comparando campos
      var carr1 = [... this.arr1];
      var carr2 = [... this.arr2];
      if(carr2.length>carr1.length){
        carr2.forEach(r2 => {
          var compUnq = this.compareAttrib.filter(x => x.unique).pop();
          let lc1 = carr1.length;
          carr1 = carr1.filter(r1 => {
            if(compUnq.type === 1){
              if(app.isEquals(r1,r2,compUnq)){
                app.checkAllTask(r1,r2);
                return false;
              }
            } else {
              if(app.isSimilar(r1,r2,compUnq)){
                app.checkAllTask(r1,r2);
                return false;
              }
            }
            return true;
          });
          if(lc1 === carr1.length)
            app.notifications.push(app.makeNotIncosist('No se encontro el registro del Doc 2 serca de la linea '+ r2.row+': \n'+ Object.keys(r2).map(d =>r2[d]).join(' | ')));
        })
      } else {
        carr1.forEach(r1 => {
          var compUnq = this.compareAttrib.filter(x => x.unique).pop();
          let lc2 = carr2.length;
          carr2 = carr2.filter(r2 => {
            if(compUnq.type === 1){
              if(app.isEquals(r1,r2,compUnq)){
                app.checkAllTask(r1,r2);
                return false;
              }
            } else {
              if(app.isSimilar(r1,r2,compUnq)){
                app.checkAllTask(r1,r2);
                return false;
              }
            }
            return true;
          });
          if(lc2 === carr2.length)
            app.notifications.push(app.makeNotIncosist('No se encontro el registro del Doc 1 serca de la linea '+ r1.row+': \n'+ Object.keys(r1).map(d =>r1[d]).join(' | ')));
        })
      }
      app.notifications.push(app.makeNotSuccess('Revision de igualdad Terminada','Revision de igualdad y similaridad terminada.'));
      // comparando sumas
      app.calcTotalAndCompare.forEach(st => {
        let stl1 = app.arr1.reduce((a,v) => a+v[st.ats1[0]]);
        let stl2 = app.arr2.reduce((a,v) => a+v[st.ats2[0]]);
        if(stl1 === stl2)
          app.notifications.push(app.makeNotSuccess('Suma de Culumnas Exacta','La suma de las columnas '+st.ats1.join('|')+', '+st.ats2.join('|')+' Son iguales.'))
        else
          app.notifications.push(app.makeNotIncosist('La suma de las columnas '+st.ats1.join('|')+', '+st.ats2.join('|')+'No son iguales.'))
      })
      this.checked = true;
    },
    checkAllTask(r1,r2){
      this.compareAttrib.forEach( comp => {
        if(!comp.unique){
          switch(comp.type){
            case 1:
                if(!this.isEquals(r1,r2,comp))
                  this.notifications.push(this.makeNotError('Error de igualdad en columnas '+ comp.ats1.join('|') +' y ' + comp.ats2.join('|'),r1,r2));
              break;
            case 2:
                if(!this.isSimilar(r1,r2,comp))
                  this.notifications.push(this.makeNotError('Error de Similaridad en columnas '+ comp.ats1.join('|') +' y ' + comp.ats2.join('|'),r1,r2));
              break;
          }
        }
      });
    },
    addTask(){
      if(this.unique)
        this.selectUnique = true;
      if(this.typeCom===3)
        this.calcTotalAndCompare.push(this.newCompAttrib(this.keys1,this.keys2,this.typeCom,this.unique));
      else
        this.compareAttrib.push(this.newCompAttrib(this.keys1,this.keys2,this.typeCom,this.unique));

      // reset
      this.unique = false;
      this.typeCom = 1;
      this.keys1 = [];
      this.keys2 = [];
    },
    newCompAttrib(at1, at2, type, unique ){
      return {
        ats1: at1,
        ats2: at2,
        type,
        unique,
      };
    },
    isEquals(i1,i2,comp){
      let v1 = comp.ats1.map(k => {
        return (i1[k] | '');
      }).join('').split(' ').join('');

      let v2 = comp.ats2.map(k => {
        return (i2[k] | '');
      }).join('').split(' ').join('');
      return v1 === v2;
    },
    isSimilar(i1,i2,comp){
      let v1 = comp.ats1.map(k => {
        return (i1[k]? i1[k] : '');
      }).join('').split(' ').join('');

      let v2 = comp.ats2.map(k => {
        return (i2[k]? i2[k] : '');
      }).join('').split(' ').join('');
      var numDif = 0;
      for(let i=0;i<Math.min(v1.length,v2.length);i++){
        if(v1.charAt(i) !== v2.charAt(i))
          numDif++;
      }
      if(numDif>2)
        return false;
      else
        return true;
    },
    calcTotal(l,key){
      return l.reduce((a,c) => {
        return a+c[key];
      });
    },
    compareTotal(l1,l2,comp){
      var t1 = this.calcTotal(l1,comp.ats1);
      var t2 = this.calcTotal(l2,comp.ats2);
      if(t1 === t2 ){
        return true;
      } else {
        return false;
      }
    },
    makeNotError(msn, row1,row2){
      return {
        title: 'Error en comparacion',
        type: 'error',
        description: 'Doc1: Serca de la linea ' + row1.row +':  '+Object.keys(row1).map(k => row1[k]).join(' | ')+ '\n'+'Doc2: Serca de la linea ' + row2.row +':  '+Object.keys(row2).map(k => row2[k]).join(' | '),
      }
    },
    makeNotSuccess(msn, desc){
      return {
        title: msn,
        type: 'success',
        description: desc,
      };
    },
    makeNotIncosist(msn){
      return {
        title: 'La Tarea no es consistente',
        type: 'error',
        description: msn,
      };
    },
  },
};
</script>

<style>

</style>
