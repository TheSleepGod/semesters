<template>
  <div>
    <div class = "multi-level-folders-box">
      <div class="multi-level-folders-title">文档列表</div>
      <div class="multi-level-folders-content">
        <!-- 项目文档区-->
        <div class = "first-folder">
          <div class = "first-folder-title" @click="reverseVisible(projectsFolder)">
            <i class="el-icon-caret-right folder-tool-icon" v-if="!projectsFolder.isActive">&nbsp</i>
            <i class="el-icon-caret-bottom folder-tool-icon" v-if="projectsFolder.isActive">&nbsp</i>
            <i class="el-icon-folder" v-if="!projectsFolder.isActive">项目文档区</i>
            <i class="el-icon-folder-opened" v-if="projectsFolder.isActive">项目文档区</i>
          </div>
          <transition appear>
            <div class="first-folder-content" v-if="projectsFolder.isActive">
              <div class = "second-folder" v-for="(oneProjectFolder) in projectsFolder.projectsList">
                <div class="second-folder-title" @click="reverseVisible(oneProjectFolder)"
                     @mouseenter="showIcon(oneProjectFolder)" @mouseleave="hideIcon(oneProjectFolder)">
                  <div style="margin-left: 37px;">
                    <i class="el-icon-caret-right folder-tool-icon" v-if="!oneProjectFolder.isActive">&nbsp</i>
                    <i class="el-icon-caret-bottom folder-tool-icon" v-if="oneProjectFolder.isActive">&nbsp</i>
                    <i class="el-icon-folder" v-if="!oneProjectFolder.isActive">{{oneProjectFolder.projectName}}</i>
                    <i class="el-icon-folder-opened" v-if="oneProjectFolder.isActive">{{oneProjectFolder.projectName}}</i>
                    <i class="el-icon-plus folder-tool-icon folder-tool-icon-right"
                       title="新建文档" v-if="oneProjectFolder.isHover" @click.stop="showCreateDoc(0)"/>
                  </div>
                </div>
                <transition appear>
                  <div class="second-folder-content" v-if="oneProjectFolder.isActive">
                    <div class="doc-box" v-for="(doc) in oneProjectFolder.projectDocs"  @click="openDoc(doc)"
                         @mouseenter="showIcon(doc)" @mouseleave="hideIcon(doc)">
                      <div style="margin-left: 74px;display: flex;">
                        <div class="doc-font">
                          <i class="el-icon-document">{{doc.docName}}</i>
                        </div>
                        <i class="el-icon-edit-outline folder-tool-icon folder-tool-icon-right"
                           title="重命名" v-if="doc.isHover" @click.stop="showRenameDoc(doc)"/>
                        <i class="el-icon-delete folder-tool-icon folder-tool-icon-right"
                           title="删除" v-if="doc.isHover" @click.stop="confirmDelDoc(doc)"/>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
        <!-- 非项目文档区-->
        <div class="first-folder" v-for="(anotherFolder) in otherFolders">
          <div class="first-folder-title" @click="reverseVisible(anotherFolder)"
               @mouseenter="showIcon(anotherFolder)" @mouseleave="hideIcon(anotherFolder)">
            <i class="el-icon-caret-right folder-tool-icon" v-if="!anotherFolder.isActive">&nbsp</i>
            <i class="el-icon-caret-bottom folder-tool-icon" v-if="anotherFolder.isActive">&nbsp</i>
            <i class="el-icon-folder" v-if="!anotherFolder.isActive">{{anotherFolder.folderName}}</i>
            <i class="el-icon-folder-opened" v-if="anotherFolder.isActive">{{anotherFolder.folderName}}</i>
            <i class="el-icon-plus folder-tool-icon folder-tool-icon-right"
               title="新建文档" v-if="anotherFolder.isHover" @click.s.stop="showCreateDoc(1)"/>
          </div>
          <transition appear>
            <div class="first-folder-content" v-if="anotherFolder.isActive">
              <div class="doc-box" v-for="(doc) in anotherFolder.folderDocs" @click="openDoc(doc)"
                   @mouseenter="showIcon(doc)" @mouseleave="hideIcon(doc)">
                <div style="margin-left: 37px;display: flex;">
                  <div class="doc-font">
                    <i class="el-icon-document">{{doc.docName}}</i>
                  </div>
                  <i class="el-icon-edit-outline folder-tool-icon folder-tool-icon-right"
                     title="重命名" v-if="doc.isHover" @click.stop="showRenameDoc(doc)"/>
                  <i class="el-icon-delete folder-tool-icon folder-tool-icon-right"
                     title="删除" v-if="doc.isHover" @click.stop="confirmDelDoc(doc)"/>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- 新建文件夹-->
        <div class="first-folder">
          <div class="first-folder-title" @click="showCreateFolder"
               @mouseenter="showIcon(newFolder)" @mouseleave="hideIcon(newFolder)">
            <div style="margin-left: 20px">
              <i class="el-icon-folder-add">新建文件夹</i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话框-->
    <el-dialog title="重命名文档" :visible="renameDocVisible" :close-on-click-modal=false :before-close="beClose" style="width: 60%;margin-left: 20%">
      <el-input v-model="renameDoc.newName" placeholder="请输入文档名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="postRenameDoc">确认</el-button>
      </el-input>
    </el-dialog>
    <el-dialog title="新建文档" :visible="createDocVisible" :close-on-click-modal=false :before-close="beClose" style="width:60%;margin-left: 20%">
      <el-input v-model="createDocName" placeholder="请输入文档名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="createDoc(createDocName)">确认</el-button>
      </el-input>
    </el-dialog>
    <el-dialog title="新建文件夹" :visible="createFolderVisible" :close-on-click-modal=false :before-close="beClose" style="width:60%;margin-left: 20%">
      <el-input v-model="newFolder.name" placeholder="请输入文件夹名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="createFolder(newFolder.name)">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "multiFolder",
  props:['team_id','team_name'],
  data() {
    let projectsList = [
      {
        isHover: false,
        isActive: false,
        projectId: 1,
        projectName: "项目1",
        projectDocs: [
          {
            isHover: false,
            docId: 1,
            docName: 'doc1'
          },
          {
            isHover: false,
            docId: 2,
            docName: 'doc2'
          }
        ]
      },
      {
        isHover: false,
        isActive: false,
        projectId: 2,
        projectName: "项目2",
        projectDocs: [
          {
            isHover: false,
            docId: 3,
            docName: 'doc3'
          },
          {
            isHover: false,
            docId: 4,
            docName: 'doc4'
          }
        ]
      },
    ];
    let projectsFolder = {
      isActive: false,
      projectsList
    };
    let otherFolders = [
      {
        isHover: false,
        isActive: false,
        folderName: '团队介绍',
        folderDocs: [
          {
            isHover: false,
            docId: 5,
            docName: 'doc5'
          },
          {
            isHover: false,
            docId: 6,
            docName: 'doc6'
          }
        ]
      },
      {
        isHover: false,
        isActive: false,
        folderName: '组会记录',
        folderDocs: [
          {
            isHover: false,
            docId: 7,
            docName: 'doc7doc7'
          },
          {
            isHover: false,
            docId: 8,
            docName: 'doc8'
          }
        ]
      },
    ]
    return {
      createFolderVisible: false,
      newFolder:{
        isHover: false,
        name: ''
      },
      createDocVisible: false,
      createDocType: 0,//0在项目内,1在项目外
      createDocName: '',
      renameDocVisible: false,
      renameDoc: {
        id: 0,
        newName: "",
      },
      username:'',
      projectsFolder,
      otherFolders,
      currentDoc:{
        docId: '',
        docName: '',
        docContent: '',
      }
    }
  },
  methods: {
    beClose(){
      this.renameDocVisible = false; this.renameDoc={};
      this.createDocVisible = false; this.createDocName='';
      this.createFolderVisible = false; this.newFolder.name='';
    },
    showIcon(item){item.isHover=true},
    hideIcon(item){item.isHover=false},
    reverseVisible(item){item.isActive = !item.isActive;},
    showCreateFolder(){this.createFolderVisible = true;},
    showRenameDoc(doc){
      this.renameDoc.docId = doc.docId;
      this.renameDoc.newName = doc.docName;
      this.renameDocVisible = true;
    },
    showCreateDoc(type){
      if(type===0)this.createDocType = 0;
      else this.createDocType = 1;
      this.createDocVisible = true;
    },
    openDoc(doc){
      this.$emit('input',doc);
    },
    getNowUser() {
      this.$axios({
            method : 'post',
            url : 'http://101.42.160.94:8000/api/user_web/get_user',
            headers:{
              'Authorization':localStorage.getItem('Token'),
            }
          }
      ).then((ret) => {
        if (ret.data.errno === 0) {
          console.log(ret.data.data);
          this.username = ret.data.data.username;
          this.userId=ret.data.data.user_id;
        } else {
          this.$notify.error(ret.data.msg);
        }
      })
    },
    createFolder(name){
      this.$message.success("文件夹 "+name+" 创建成功");
      this.beClose();
    },
    createDoc(name){
      if(this.createDocType === 0)this.createDocInProject(name);
      else this.createDocOutProject(name);
      this.beClose();
    },
    createDocInProject(name){
      this.$message.success("文档 "+name+" 创建成功in")
    },
    createDocOutProject(name){
      this.$message.success("文档 "+name+" 创建成功out")
    },
    postRenameDoc(){
      this.$message.success("成功重命名为"+this.renameDoc.newName);
      this.beClose();
    },
    confirmDelDoc(doc) {
      this.$confirm('将彻底删除该文档, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDoc(doc)
      })
    },
    delDoc(doc){
      this.$notify.success("文档 "+doc.docName+"（docID:"+doc.docId+"） 已删除");
    }
  },
  created() {
    this.getNowUser();
  },
  mounted() {
  }
}
</script>

<style scoped>
.v-enter {transform: translateY(-20%);opacity: 0;}
.v-enter-to {transform: translateY(0);opacity: 1;}
.v-enter-active {transition: 0.25s;}
.v-leave {opacity: 1;transform: translateY(0);}
.v-leave-to {transform: translateY(-20%);opacity: 0;}
.v-leave-active {transition: 0.25s;}

.multi-level-folders-box {
  position: relative;
  text-align: left;
  transition: all 0.25s;
  font-size: 20px;
  line-height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.multi-level-folders-title{
  text-align: center;
}
.multi-level-folders-content{
}
.first-folder{

}
.first-folder-title{
  cursor: pointer;
  transition: all 0.5s;
}
.first-folder-title:hover{
  background-color: whitesmoke;
  color: dodgerblue;
}
.first-folder-content{

}
.second-folder{

}
.second-folder-title{
  cursor: pointer;
  transition: all 0.5s;
}
.second-folder-title:hover{
  background-color: whitesmoke;
  color: dodgerblue;
}
.second-folder-content{

}
.doc-box{
  min-width: 0;
  max-width: 100%;
  cursor: pointer;
  transition: all 0.5s;
}
.doc-box:hover{
  color: dodgerblue;
  background-color: whitesmoke;
}
.doc-font{
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 1s;
}
.doc-font:hover{
  width: 85%;
}
.folder-tool-icon{
  margin-top: 10px;
  font-size: 15px;
}
.folder-tool-icon-right{
  float: right;
  right: 0;
  margin-left: 5px;
  margin-right: 5px;
}
</style>