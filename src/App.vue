<template>
  <div
    id="app"
  >
    <div v-if="loading">
      <img width="50%" src="@/assets/icono_app_sm.png">
    </div>
    <router-view v-show="!loading"></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      loading: true,
    };
  },
  created(){
    this.starting();
  },
  methods: {
    starting(){
      setTimeout(this.onLoad,2000);
    },
    onLoad(){
      this.loading = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100%;
}
</style>
