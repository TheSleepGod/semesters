<template>
  <el-container>
    <el-aside class="aside-box">
      <div class="aside-doc-list-panel">
        <div class="doc_list_title">文档列表</div>
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
          <div @click="switchWord(items)">
            &nbsp{{items.name}}
          </div>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="main-doc-box">
        <div class="doc_toolbox">
          <el-button icon="el-icon-download" circle title="下载"></el-button><br/>
          <el-button icon="el-icon-edit" circle title="编辑" @click="jump_to_edit"></el-button>
        </div>
        <div class="doc_background_box">
            <div class="doc_text_box">
              <div class="doc_title">
                {{nowWord.name}}
              </div>
              <div class="doc_content">
                {{nowWord.content}}
              </div>
            </div>
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
      pageScrollData: 0,
      docVis:false,
      WenVis:false,
      nameDoc:'',
      nameWen:'',
      words:[
        {name:"word1",content:"测试文档测试文档测试文档测试文档测试文" +
              "档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档测试文档",active:''},
        {name:"word2",content:"测试文档",active:''},
        {name:"word3",content:"测试文档",active:''},
        {name:"word4",content:"测试文档",active:''},
      ],
      nowWord:{name:"",content:"",active:''}
    }
  },
  methods:{
    beActive(item){
      item.active="background-color: #ccc;color: red;cursor : pointer;";
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


.doc_title {
  margin-top: 15px;
  caret-color: transparent;
}
.aside-box{
  max-width: 200px;
  height: 100%;
}
.aside-doc-list-panel{
  width: 200px;
  position: fixed;
  box-shadow: 2px 2px 10px 0 grey;
  border-radius: 10px;
  margin-top: 5px;
  display: block;
  z-index: 20;
}
.doc_list_title{
  margin-top: 10px;
  font-size: 22px;
  height: 100%;
}
.doc_new{
  display: flex;
  margin-top: 20px;
  height: 30px;
}
.doc_list{
  cursor: pointer;
  margin-top: 0;
  height: 30px;
  font-size: 18px;
  text-align: left;
  transition: all 0.25s;
}
.doc_list:hover{
  background-color: whitesmoke;
  font-weight: bold;
  border-radius: 10px;
}
.main-doc-box{
  margin-top: -15px;
  box-shadow: 2px 2px 10px 0 grey;
  border-radius: 19px;
}
.doc_toolbox{
  display: block;
  z-index: 20;
  position: fixed;
  margin-top: 30px;
  right: 70px;
  height: 120px;
  font-size: 30px;
}
.doc_background_box{
  padding-top: 40px;
  padding-bottom: 30px;
  border-radius: 0 0 10px 10px;
  background-color: #eef0f4;
  height: 3000px;
}
.doc_text_box{
  padding: 10px 20px 10px 20px;
  margin: 0 250px 60px 250px;
  background-color: white;
  height: 2980px;
  border-radius: 10px;
  box-shadow:2px 2px 10px #ccc;;
  font-size: 19px;
}
.doc_title{
  font-size: 35px;
}
.doc_content{
  text-align: left;
  margin-top: 10px;
}
</style>