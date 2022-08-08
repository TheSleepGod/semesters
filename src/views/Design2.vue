<!-- drag-test -->
<template>
  <el-container>

      <el-aside class="aside">

      </el-aside>

      <el-main class="main_area">
        <div id="example">
        <div class="container">
          <div id="bar">
            <h1 style="margin-left: 60px">{{this.name}}</h1>
            <button v-on:click="loadDesign(design)">载入页面</button>
            <button v-on:click="saveDesign">保存页面</button>
            <button v-on:click="exportHtml">导出页面</button>
          </div>

            <EmailEditor ref="emailEditor" v-on:load="editorLoaded" v-on:ready="editorReady" />
          </div>
        </div>
      </el-main>

  </el-container>

</template>

<script>
import { EmailEditor } from '../components'
import sample from '../data/sample.json';

export default {
  name: 'exampleView',
  components: {
    EmailEditor
  },
  data(){
    return{
      name:'设计图1',
      design:{},
    }
  },
  methods: {
    // called when the editor is created
    editorLoaded() {
      console.log('editorLoaded');
      this.$refs.emailEditor.editor.loadDesign(sample);
    },
    // called when the editor has finished loading
    editorReady() {
      console.log('editorReady');
    },
    loadDesign(design) {
      this.$refs.emailEditor.editor.loadDesign(design);
    },
    saveDesign() {
      this.$refs.emailEditor.editor.saveDesign(
          (design) => {
            console.log('saveDesign', design);
            this.design=design;
          }
      )
    },
    exportHtml() {
      this.$refs.emailEditor.editor.exportHtml(
          (data) => {
            console.log('exportHtml', data);
          }
      )
    }
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
.el-main  {
  padding: 0 !important;
}
.container{
  padding: 0 !important;
  max-width: 100% !important;
}
*, :after, :before {
  background-repeat: no-repeat;
  box-sizing: inherit;
}
#example {
  height: 100%;
  margin: 0px;
  padding: 0px;
  border: 0px;
}
#example .container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 800px;
}

#bar {
  flex: 1;
  background-color: #40B883;
  color: #FFF;
  padding: 10px;
  display: flex;
  max-height: 60px;
}

#bar h1 {
  flex: 1;
  font-size: 16px;
  text-align: left;
}

#bar button {
  flex: 1;
  padding: 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #000;
  color: #FFF;
  border: 0px;
  max-width: 150px;
  cursor: pointer;
}
.aside{
  border: 1px solid black;
}
.main_area{
  border: 1px solid black;
}

</style>