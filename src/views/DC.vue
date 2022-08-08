<template>
  <div class = "body-box">
    <top-bar :username="username"></top-bar>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>

    <div class = "multi-level-folders-box">
      <div class="multi-level-folders-title">文档中心</div>
      <div class="multi-level-folders-content">
        <div class = "first-folder">
          <div class = "first-folder-title" @click="reverseVisible(projectsFolder,'p1Content')">
            <i class="el-icon-caret-right" v-if="!projectsFolder.isActive"/>
            <i class="el-icon-caret-bottom" v-if="projectsFolder.isActive"/>
            项目文档区
          </div>
          <transition appear>
            <div class="first-folder-content" id="p1Content" v-if="projectsFolder.isActive">
              <div class = "second-folder" v-for="(oneProjectFolder,index) in projectsFolder.projectsList">
                <div class="second-folder-title" @click="reverseVisible(oneProjectFolder,'p2Content'+index)">
                  <i class="el-icon-caret-right" v-if="!oneProjectFolder.isActive"/>
                  <i class="el-icon-caret-bottom" v-if="oneProjectFolder.isActive"/>
                  {{oneProjectFolder.projectName}}
                </div>
                <transition appear>
                  <div class="second-folder-content" :id="'p2Content'+index" v-if="oneProjectFolder.isActive">
                    <div class="doc-box" v-for="(doc,index) in oneProjectFolder.projectDocs">
                      {{doc.docName}}
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
        <div class="first-folder" v-for="(anotherFolder,index) in otherFolders">
          <div class="first-folder-title" @click="reverseVisible(anotherFolder,'oContent'+index)">
            <i class="el-icon-caret-right" v-if="!anotherFolder.isActive"/>
            <i class="el-icon-caret-bottom" v-if="anotherFolder.isActive"/>
            {{anotherFolder.folderName}}
          </div>
          <transition appear>
            <div class="first-folder-content" :id="'oContent'+index" v-if="anotherFolder.isActive">
              <div class="doc-box" v-for="(doc,index) in anotherFolder.folderDocs">
                {{doc.docName}}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import TeamLeft from "../components/ProjectLeft";
import topBar from "../components/topBar"
export default {
  name: "DC",
  components: {
    TeamLeft,
    topBar,
  },
  data() {
    let isDocumentOut = false;
    let oneChoose = false;
    let twoChoose = false;
    let threeChoose = false;
    let projectsList = [
      {
        isActive: false,
        projectId: 1,
        projectName: "p1",
        projectDocs: [
          {
            docId: 1,
            docName: 'doc1'
          },
          {
            docId: 2,
            docName: 'doc2'
          }
        ]
      },
      {
        isActive: false,
        projectId: 2,
        projectName: "p2",
        projectDocs: [
          {
            docId: 3,
            docName: 'doc3'
          },
          {
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
        isActive: false,
        folderName: 'of1',
        folderDocs: [
          {
            docId: 5,
            docName: 'doc5'
          },
          {
            docId: 6,
            docName: 'doc6'
          }
        ]
      },
      {
        isActive: false,
        folderName: 'of2',
        folderDocs: [
          {
            docId: 7,
            docName: 'doc7'
          },
          {
            docId: 8,
            docName: 'doc8'
          }
        ]
      },
    ]
    return {
      activeNames: ['1'],
      isDocumentOut,
      oneChoose,
      twoChoose,
      threeChoose,
      projectsFolder,
      pActive: false,
      otherFolders,
      username:'',
      team:{
        teamId:0,
        teamName:'',
      }
    }
  },
  methods: {
    reverseVisible(item,id){
      item.isActive = !item.isActive;

    },
    itemLeave(panel){
      panel.style = "transition:all 0.25s; height:100%;";
      setTimeout(()=>{
        panel.style = "height:0";
      },250);
    },
    itemEnter(panel){
      panel.style = "transition:all 0.25s; height:0";
      setTimeout(()=>{
        panel.style = "transition:all 0.25s; height:auto";
      },250);
    },
    comeDocument() {
      this.isDocumentOut = true;
    },
    leaveDocument() {
      this.isDocumentOut = false;
    },
    showOne() {
      this.oneChoose = true;
      this.twoChoose = false;
      this.threeChoose = false;
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
  },
  created() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.getNowUser();
  }
}
</script>

<style scoped>
/* 进入：始状态 */
.v-enter {
  transform: translateY(-20%);
  opacity: 0;
}
/* 进入：末状态 */
.v-enter-to {
  transform: translateY(0);
  opacity: 1;
}
/* 进入动画 */
.v-enter-active {
  transition: 0.25s;
}

/* 离开：始状态 */
.v-leave {
  opacity: 1;
  transform: translateY(0);
}
/* 离开：末状态 */
.v-leave-to {
  transform: translateY(-20%);
  opacity: 0;
}
/* 离开动画 */
.v-leave-active {
  transition: 0.25s;
}

.multi-level-folders-box {
  min-width: 100px;
  width: 20%;
  background: whitesmoke;
  position: relative;
  float: right;
  text-align: left;
  transition: all 0.25s;
  font-size: 20px;
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
}
.first-folder-title:hover{
  color: dodgerblue;
}
.first-folder-content{

}
.second-folder{
  margin-left: 20px;
}
.second-folder-title{
  cursor: pointer;
}
.second-folder-title{

}
.second-folder-title:hover{
  color: dodgerblue;
}
.second-folder-content{

}
.doc-box{
  cursor: pointer;
  margin-left: 20px;
  transition: all 0.5s;
}
.doc-box:hover{
  font-weight: bolder;
}
.document-center {
  cursor: pointer;
  position: relative;
  float: left;
  height: 65px;
  transition: width 0.5s;
}
.document-right-img {
  position: relative;
  float: left;
  left: 30px;
  top: 16px;
  height: 30px;
  width: 30px;
}
.document-right-img-box{
  width: 100px;
  height: 50px;
  position: relative;
  float: left;
}
.document-right-img-box-two {
  width: 80px;
  height: 50px;
  position: relative;
  float: left;
  top: -5px;
  left: -15px;
}
.document-right-span-box {
  width: 50px;
  height: 50px;
  position: relative;
  float: left;
  left: -20px;
}
.document-right-span {
  width: 100px;
  font-size: 18px;
  position: relative;
  float: left;
  top: 9px;
  text-align: left;
}
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.document-center-box{
  position: relative;
  float: left;
  width: 220px;
  left: 10px;
  height: 80px;
  border-radius: 5px;
}
.document-center-box-box {
  position: relative;
  float: left;
  width: 160px;
  height: 50px;
  border-radius: 10px;
  top: 8px;
  left: 20px;
}
.document-center-box-box:hover {
  background: #1795bb;
}
.document-team-box {
  cursor: pointer;
  caret-color: transparent;
}
.project-name {
  width: 150px;
  height: 50px;
  text-align: center;
  font-size: 16px;
  background: #1795bb;
  caret-color: transparent;
  cursor: pointer;
}
.project-name:hover {
  background: #1795bb;
}
.team-name {
  width: 150px;
  height: 50px;
  text-align: center;
  font-size: 13px;
  background: #1795bb;
  caret-color: transparent;
  cursor: pointer;
}
.team-name:hover {
  background: #1795bb;
}
/deep/ .el-collapse-item__header{
  font-size: 18px;
  background: #1795bb;
  border: 0 solid #1795bb;
}
/deep/ .el-collapse-item__arrow.is-active {
  display: none;
}
/deep/ .el-collapse-item__arrow, .el-tabs__nav {
  display: none;
}


</style>



