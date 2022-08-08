<template>
  <div class="body-box">
    <TopBar :username="username"/>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>
    <div class="main-box">
      <div class="main-center-box">
        <div class="center-head-box">
          <div class="center-head-font">
            {{team.teamName}} - 文档中心
          </div>
        </div>
        <div class="center-doc-box">
          <div class="center-doc-title">{{currentDoc.docName}}</div>
          <div class="center-doc-editor-box">
            <!-- todo: put Editor in this box-->
          </div>
        </div>
      </div>
      <div class="main-right-box">
        <div class="right-pullIcon-bar"/>
        <div class="right-folders-box">
          <!-- todo: put Folders in this box-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
<<<<<<< HEAD
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
=======
import TopBar from "@/components/topBar";
import TeamLeft from "@/components/ProjectLeft";
export default {
  name: "DC",
  components:{
    TopBar,TeamLeft
  },
  data(){
    return{
      username: '',
      team:{
        teamId: '',
        teamName: ''
      },
      currentDoc:{
        docId: '',
        docName: 'name1',
        docContent: ''
      }
    }
  },
  methods:{

>>>>>>> 4a457f62e136e0306a02c66d0aace4378275822b
  },
  created() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
<<<<<<< HEAD
    this.getNowUser();
=======
>>>>>>> 4a457f62e136e0306a02c66d0aace4378275822b
  }
}
</script>

<style scoped>
<<<<<<< HEAD
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


=======
.body-box{
}
.main-box{
  display: flex;
  width: 90%;
  margin-left: 10%;
}
.main-center-box{
  transition: all 1s;
  width: 90%;
  height: 100%;
  background-color: whitesmoke;
}
.main-right-box{
  display: flex;
  transition: all 1s;
  width: 10%;
  height: 610px;
  padding-left: 5%;
}
.main-right-box:hover .main-center-box{
  width: 75%;
}
.main-right-box:hover{
  padding-left: 0;
  width: 25%;
}
.center-head-box{
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  padding-left: 20px;
  background-color: antiquewhite;
}
.center-head-font{
  font-size: 28px;
  float: left;
  text-align: left;
}
.center-doc-box{
  background-color: whitesmoke;
}
.center-doc-title{
  height: 50px;
  line-height: 50px;
  font-size: 24px;
}
.center-doc-editor-box{
  height: 500px;
  background-color: floralwhite;
  padding: 10px 10px 10px 10px;
}
.right-pullIcon-bar{
  cursor: pointer;
  width: 100px;
  height: 100%;
  transition: all 1s;
  background-image: url("../assets/left.png");
  background-repeat: no-repeat;
  background-position: 300% 50%;
  background-size: 85% 50%;
  animation: arrow 5s infinite linear;
}
@keyframes arrow {
  0%{background-position: 300% 50%}
  25%{background-position: 600% 50%}
  50%{background-position: 300% 50%}
  75%{background-position: 0% 50%}
  100%{background-position: 300% 50%}
}
.right-folders-box{
  width: 0;
  height: 100%;
  background-color: lightyellow;
  transition: all 1s;
}
.main-right-box:hover .right-pullIcon-bar{
  width: 0;
}
.main-right-box:hover .right-folders-box{
  width: 100%;
}
</style>
>>>>>>> 4a457f62e136e0306a02c66d0aace4378275822b
