<!-- drag-test -->
<template>
  <el-container>
      <el-aside class="aside" style="background-color: #ffd;">
          <div>新建</div>
        <v-treeview
            v-model="tree"
            :open="initiallyOpen"
            :items="items"
            activatable
            item-key="name"
            open-on-click
        >
          <template v-slot:prepend="{ item, open }" >
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file]}}
              </v-icon>
          </template>
        </v-treeview>
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
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
import { EmailEditor } from '../components'
import sample from '../data/sample.json';
import Vue from  'vue'
export default {
  name: 'exampleView',
  components: {
    EmailEditor
  },
  data(){
    return{
      name:'设计图1',
      design:{},
      initiallyOpen: ['文档中心'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [{
        name:'文档中心',
        children: [
          {
            name: '.git',
          },
          {
            name: 'node_modules',
          },
          {
            name: 'public',
            children: [
              {
                name: 'static',
                children: [{
                  name: 'logo.png',
                  file: 'png',
                },
                  {
                    name:'abc.js',
                    file:'js',
                  }],
              },
              {
                name: 'favicon.ico',
                file: 'png',
              },
              {
                name: 'index.html',
                file: 'html',
              },
            ],
          },
          {
            name: '.gitignore',
            file: 'txt',
          },
          {
            name: 'babel.config.js',
            file: 'js',
          },
          {
            name: 'package.json',
            file: 'json',
          },
          {
            name: 'README.md',
            file: 'md',
          },
          {
            name: 'vue.config.js',
            file: 'js',
          },
          {
            name: 'yarn.lock',
            file: 'txt',
          },
        ]
      }
      ],
    }
  },
  methods: {
    onContextmenu(event,item) {
      if(item.name=='文档中心'){
        this.$contextmenu({
          items: [
            {
              label: "新建文件夹",
              icon:'el-icon-folder-add'
            },
          ],
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
          minWidth: 230
        });
      }
      else if(!item.file){
        this.$contextmenu({
          items: [
            {
              label: "新建文档",
              icon:"el-icon-document-add"
            },
            {
              label: "重命名文件夹",
              icon:"el-icon-edit"
            }

          ],
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
          minWidth: 230
        });
      }
      else{
        this.$contextmenu({
          items: [
            {
              label: "删除文档",
              icon:"el-icon-document-delete"
            },
            {
              label: "重命名文档",
              icon:"el-icon-edit"
            }
          ],
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
          minWidth: 230
        });
      }
      return false;
    },
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
            console.log(typeof design)
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