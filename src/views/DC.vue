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
    
  },
  created() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.getNowUser();
  }
}
</script>

<style scoped>
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
  height: 900px;
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
  75%{background-position: 0 50%}
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
