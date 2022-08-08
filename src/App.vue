<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  margin: 0;
  padding: 0;
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html{
  overflow-y: auto !important;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
::-webkit-scrollbar{

}
/*::-webkit-scrollbar {     width: 10px;   }*/
/*::-webkit-scrollbar-track {     background: rgb(179, 177, 177);     border-radius: 10px; }*/
/*::-webkit-scrollbar-thumb {     background: rgb(136, 136, 136);     border-radius: 10px;   }*/
/*::-webkit-scrollbar-thumb:hover {     background: rgb(100, 100, 100);     border-radius: 10px;   }*/
/*::-webkit-scrollbar-thumb:active {     background: rgb(68, 68, 68);     border-radius: 10px;   }*/
</style>
