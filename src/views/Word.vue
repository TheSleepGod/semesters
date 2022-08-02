<template>
  <el-container>
    <el-aside width="200px"style="border: 0.1px solid gray;height: 100%">
      <div class="doc_title">文档列表</div>
      <hr/>
      <div class="doc_new">
        <i class="el-icon-plus" title="新建文档" style="width: 30px;height: 30px;left: 10px" @click="docVis=true"></i>
        <i class="el-icon-folder" title="新建文件夹" style="width: 30px;height: 30px;left: 50px" @click="WenVis=true"></i>
      </div>
      <el-dialog
          title="新建文档"
          :visible.sync="docVis"
          width="30%"
          :before-close="handleClose">
        <el-input
            placeholder="请输入文档名称"
            v-model="nameDoc"
            clearable>
        </el-input>
          <span slot="footer" class="dialog-footer">
           <el-button @click="docVis = false">取 消</el-button>
            <el-button type="primary" @click="createDoc(nameDoc)">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          title="新建文件夹"
          :visible.sync="WenVis"
          width="30%"
          :before-close="handleClose">
        <el-input
            placeholder="请输入文件夹名称"
            v-model="nameWen"
            clearable>
        </el-input>
        <span slot="footer" class="dialog-footer">
           <el-button @click="WenVis = false">取 消</el-button>
            <el-button type="primary" @click="createWen(nameWen)">确 定</el-button>
        </span>
      </el-dialog>
      <hr/>
      <div v-for="items in words" class="doc_list" >
        <div @mouseover="beActive(items)" @mouseleave="beNormal(items)" :style="items.active" @click="switchWord(items)">
          {{items.name}}
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="doc_toolbox">
        {{nowWord.name}}
        <el-button icon="el-icon-download" circle style="position: absolute;right: 105px" title="下载"></el-button>
        <el-button icon="el-icon-edit" circle style="position: absolute ;right: 45px" title="编辑" @click="jump_to_edit"></el-button>
      </div>
      <hr/>
      <div class="doc_all">
          <div class="doc_content">
              {{nowWord.name}}
          </div>
      </div>
    </el-main>
  </el-container>

</template>

<script>
export default {
  name:'Word',
  data(){
    return{
      docVis:false,
      WenVis:false,
      nameDoc:'',
      nameWen:'',
      words:[
        {name:"word1",content:"测试文档",active:''},
        {name:"word2",content:"测试文档",active:''},
        {name:"word3",content:"测试文档",active:''},
        {name:"word4",content:"测试文档",active:''},
      ],
      nowWord:{name:"",content:"",active:''}
    }
  },
  methods:{
      beActive(item){
        item.active="background-color: #cccccc;color: red;cursor : pointer;";
      },
      beNormal(arg){
        arg.active='';
      },
    jump_to_edit(){
        this.$router.push('/edit');
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    createDoc(input){
        this.words.push({
          name:input,
          content: '',
          active: ''
        });
        this.docVis=false;
    },
    createWen(input){
      /*this.words.push({
        name:input,
        content: '',
        active: ''
      });*/
      this.WenVis=false;
    },
    switchWord(item){
        this.nowWord.name=item.name;
        this.nowWord.content=item.content;
        this.nowWord.active=item.active;
    }
  }
}
</script>

<style >

.doc_title{
  margin-top: 15px;
}
.doc_toolbox{
  height: 30px;
  margin-bottom: 30px;
  font-size: 30px;
}
.doc_new{
  display: flex;
  margin-top: 20px;
  height: 30px;
}
.doc_list{
  margin-top: 0px;
  font-size: 20px;
  height: 100%;
}
.doc_all{
  margin-top: 20px;
  border: 1px solid mediumpurple;
  background-color: gainsboro;
  height: 3000px;
}
.doc_content{
  margin: 10px 30px 10px 30px;
  background-color: white;
  height: 2980px;
}
</style>