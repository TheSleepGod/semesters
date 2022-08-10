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
  background: whitesmoke;
  position:fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
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
/*::-webkit-scrollbar {width: 5px;transition: all 0.25s;}*/
/*::-webkit-scrollbar-track {background: ghostwhite;border-radius: 10px;}*/
/*::-webkit-scrollbar-thumb {background: darkgrey;border-radius: 10px;}*/
/*::-webkit-scrollbar-thumb:hover {background: lightslategrey;}*/
/*::-webkit-scrollbar-thumb:active {background: grey}*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-thumb {
  background: #ababab;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
  -webkit-transition: all 0.25s;
}

::-webkit-scrollbar-thumb:hover{
  border: 0;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>
