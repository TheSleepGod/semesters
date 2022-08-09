<!-- drag-test -->
<template>
  <el-container>
      <el-aside class="aside" style="background-color: #ffd;">
          <div class="newCreate" @click="switchVis"><i class="el-icon-document-add"></i>&nbsp&nbsp新建原型图</div>
        <el-dialog title="新建原型图" :visible.sync="createVisible" style="width:60%;margin-left: 20%">
          <el-input v-model="newName" placeholder="请输入原型图名称" maxlength="20" show-word-limit>
            <el-button slot="append" @click="CreatePic">确认</el-button>
          </el-input>
        </el-dialog>
        <v-treeview
            v-model="tree"
            :open="initiallyOpen"
            :items="items"
            activatable
            item-key="name"
            open-on-click
        >
          <template v-slot:prepend="{ item, open }" >
            <div @contextmenu.prevent="onContextmenu($event,item)">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file]}}
              </v-icon>
            </div>
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
            <button v-on:click="shareDesign">共享页面</button>
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
    let nowProjectId;
    return{
      name:'设计图1',
      design:{},
      newName:'',
      createVisible:false,
      project_id:0,
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
      nowProjectId,
    }
  },
  methods: {
    onContextmenu(event,item) {
      if(item.file){
        this.$contextmenu({
          items: [
            {
              label: "删除原型图",
              icon:'el-icon-document-delete'
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
      return false;
    },
    CreatePic(){
      this.$message('success');
      this.createVisible=false;
      this.newName='';
    },
    switchVis(){
      this.createVisible=true;
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
      let toSend = {id : 13};
      this.$axios({
        method:'post',
        url : 'http://101.42.160.94:8000/api/user_web/get_uml',
        data : JSON.stringify(toSend)
      }).then((res) =>{
        console.log(res.data.data);
        this.design=JSON.parse(res.data.data);
        console.log(this.design)
      });
      this.$refs.emailEditor.editor.loadDesign(this.design);
    },
    saveDesign() {
      this.$refs.emailEditor.editor.saveDesign(
          (design) => {
            this.$axios({
              method:'post',
              url : 'http://101.42.160.94:8000/api/user_web/try_uml',
              data: design
            }).then((res) =>{
              console.log(res);
            })
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
    },
    shareDesign() {
      this.saveDesign();
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/try_uml',
          this.design
      ).then((res)=>{
        if(res.data.errno===0){
          this.$message.success("上传成功,将为您生成共享界面");
          //Todo 绑定返回的 Id 和 projectId
        } else this.$notify.error(res.data.msg);
      }).catch((error)=>{console.log(error)})
    }
  },
  mounted() {
    this.nowProjectId = this.$route.query.projectId;
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
.newCreate{
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 20px;
}

.newCreate:hover{
  cursor: pointer;
}

</style>