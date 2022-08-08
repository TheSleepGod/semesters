
<template>
  <div class = "body-box">
    <top-bar :username="username"></top-bar>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>
    <div class = "multi-level-lists-box" @mouseover="comeDocument" @mouseleave="leaveDocument">
      <div class = "document-center">
        <transition name="slide-fade">
          <div class = "document-right-img-box" v-if = "!isDocumentOut">
            <img src="../assets/DocumentCenter/choose-one.png" alt="" class = "document-right-img"/>
          </div>
          <div class = "document-center-box" v-if = "isDocumentOut" @mouseover="showOne">
            <div class = "document-center-box-box">
              <div class = "document-right-img-box-two" >
                <img src="../assets/DocumentCenter/choose-one.png" alt="" class = "document-right-img"/>
              </div>
              <div class = "document-right-span-box">
                <span class = "document-right-span font-1">项目文档</span>
              </div>
            </div>  
          </div>
          <div class = "" v-if = "oneChoose">
            <div class = "document-right-team-box">
              <span>团队1</span>
            </div>  
          </div>
        </transition>  
      </div>
    </div>

    
    <el-collapse accordion style="width: 200px; position: relative; float: left; left: 100px;">
      <el-collapse-item style="">
        <div slot="title" style=" width: 200px; text-align: center" >
          <div class = "document-team-box">
            <span class="document-team">项目文档</span>
          </div>  
        </div>
        <el-collapse accordion>
          <div v-for="(team,index) in projectList">
            <el-collapse-item>
              <div slot="title" class = "team-name">
                <div class = "team-name-box font-1 ">
                  <span class="document-team">{{team.teamName}}</span>
                </div>  
              </div>
              <div v-for="project in docList" style="text-align: left">
                <div class = "project-name font-1">
                  {{project.projectName}}
                </div>  
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
    
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
    let projectList = [
      {
        teamId: 1,
        teamName: "ababab",
      },
      {
        teamId: 2,
        teamName: "cdcdcdcd",
      },
      {
        teamId: 3,
        teamName: "efefefef",
      },
      {
        teamId: 4,
        teamName: "ghghghghghg",
      }  
    ];
    let docList = [
      {
        projectId: 1, 
        projectName: "test1",
      },
      {
        projectId: 2,
        projectName: "test2",
      },
      {
        projectId: 3,
        projectName: "test3",
      },
      {
        projectId: 4,
        projectName: "test4",
      }
    ]
    return {
      activeNames: ['1'],
      isDocumentOut,
      oneChoose,
      twoChoose,
      threeChoose,
      docList,
      projectList,
      username:'',
      team:{
        teamId:0,
        teamName:'',
      }
    }
  },
  methods: {
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
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(10px);
  opacity: 0;
}

.multi-level-lists-box {
  height: 700px;
  background: #0997F7;
  position: relative;
  float: right;
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
  width: 140px;
  height: 40px;
  border-radius: 10px;
  position: relative;
  float: left;
  left: 30px;
  text-align: center;
}
.document-team-box:hover {
  background: #cccccc;
}
.document-team {
  position: relative;
  display: block;
  top: -2px;
}
.project-name {
  width: 200px;
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
  width: 200px;
  height: 50px;
  text-align: center;
  font-size: 16px;
  background: #1795bb;
  caret-color: transparent;
  cursor: pointer;
}
.team-name:hover {
  background: #1795bb;
}
.team-name-box {
  cursor: pointer;
  caret-color: transparent;
  width: 140px;
  height: 40px;
  border-radius: 10px;
  position: relative;
  float: left;
  left: 30px;
  text-align: center;
}
.team-name-box:hover {
  background: #cccccc;
}
.document-team {
  position: relative;
  display: block;
  top: -2px;
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


