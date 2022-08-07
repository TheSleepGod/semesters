<template>
  <div style="margin-left: -10px;margin-top: -10px;">
    <TopBar :username="username"/>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>
    <!-- 页头-->
    <div style="height: 40px;width: 76%;margin-left: 12%;overflow: hidden">
      <div style="font-size: 26px;float: left;text-align: left;">{{team.teamName}}的团队项目</div>
      <div class="tools">
        <div class="search-box">
          <el-input v-model="searchProectName" placeholder="请输入要搜索的项目名称" clearable size="mini" @input="searchProject"/>
        </div>
        <div class="dropdownSort-box">
          <el-dropdown placement="bottom" trigger="click" @command="handleSort">
            <span style="cursor: pointer;color: dodgerblue">{{ sortType }}<i class="el-icon-arrow-down el-icon--right"/></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="timeDown">按时间降序</el-dropdown-item>
              <el-dropdown-item command="timeUp">按时间升序</el-dropdown-item>
              <el-dropdown-item divided command="nameDown">按名称降序</el-dropdown-item>
              <el-dropdown-item command="nameUp">按名称升序</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 项目展示-->
    <el-tabs v-model="activeName" style="width: 76%;margin-left: 12%">
      <el-tab-pane label="团队项目" name="first">
        <div class="cards-container" style="margin-top: 10px">
          <div class="projectsCard" id="commonPrCard" v-for="item in tmpProjectsList" :key="item.data" v-if="item.isRecycled===0"
               @click="gotoProject(item)" @mouseenter="showIcon(item)" @mouseleave="hideIcon(item)">
            <div class="projectsCardFoot">
              <span class="projectsNameSpan">{{item.name}}</span>
              <span class="projectsBtn">
                <i class="el-icon-document-copy" v-if="item.isHover" title="生成副本" style="margin-right: 5px" @click.stop="copy(item)"/>
                <i class="el-icon-edit-outline" v-if="item.isHover" title="重命名" style="margin-right: 5px" @click.stop="showRename(item)"/>
                <i class="el-icon-delete" v-if="item.isHover" title="移除至回收站" style="margin-right: -20px" @click.stop="confirmRecycle(item)"/>
              </span>
            </div>
          </div>
          <div class="projectsCard" id="newPrCard" @click="showCreateProject">
            <div style="margin-top: 10px">
              <span id="prPlusSpan">+</span>
            </div>
            <div class="projectsCardFoot">
              <span class="projectsNameSpan" id="newPrNameSpan">创建新项目</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目回收站" name="second">
        <div class="cards-container" style="margin-top: 10px">
          <div class="projectsCard" id="recyclePrCard" v-for="item in projectsList" :key="item.data" v-if="item.isRecycled!==0"
               @mouseenter="showIcon(item)" @mouseleave="hideIcon(item)">
            <div class="projectsCardFoot">
              <span class="projectsNameSpan">{{item.name}}</span>
              <span class="projectsBtn">
                  <i class="el-icon-refresh-left" v-if="item.isHover" title="恢复" style="margin-right: 10px" @click.stop="recover(item)"></i>
                  <i class="el-icon-delete-solid" v-if="item.isHover" title="彻底删除" style="margin-right: -20px" @click.stop="confirmDelete(item)"></i>
                </span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 对话框-->
    <el-dialog title="重命名项目" :visible="renameVisible" :close-on-click-modal=false :before-close="beClose" style="width: 60%;margin-left: 20%">
      <el-input v-model="renameProject.newName" placeholder="请输入项目名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="rename">确认</el-button>
      </el-input>
    </el-dialog>
    <el-dialog title="新建项目" :visible="newProjectVisible" :close-on-click-modal=false :before-close="beClose" style="width:60%;margin-left: 20%">
      <el-input v-model="newProjectName" placeholder="请输入项目名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="createProject(newProjectName)">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import TeamLeft from "@/components/ProjectLeft";
import TopBar from "@/components/topBar";
import qs from "qs";
import topBar from "@/components/topBar";
import axios from "axios";
export default {
  components: {
    TeamLeft,TopBar
  },
  name: "ProjectsView",
  data(){
    return{
      searchProectName: '',
      sortType: '按时间降序',
      username: "",
      userId: 1,
      newProjectVisible: false,
      iconVisible: false,
      renameVisible: false,
      renameProject: {
        id: 0,
        newName: "",
      },
      newProjectName: '',
      activeName: "first",
      team: {
        teamName: "团队1",
        teamId: 1,
      },
      projectsList: [],
      tmpProjectsList: [
        {
          id: 12345,
          name: "敏捷开发",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "瀑布模型开发",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "你是一个一个一个项目啊啊啊",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "小学期项目",
          time:'',
          isRecycled: true,
          isHover: false,
        },
        {
          id: 12345,
          name: "ABCDE",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          time:'',
          isRecycled: 0,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          time:'',
          isRecycled: true,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          time:'',
          isRecycled: true,
          isHover: false,
        }
      ]
    }
  },
  created() {
    this.getNowUser()
  },
  mounted() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.getTeamProjects();
  },
  methods:{
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
    beClose(){this.newProjectVisible=false;this.renameVisible=false},
    showCreateProject(){this.newProjectVisible=true},
    showRename(item){
      this.renameProject.newName = item.name;
      this.renameProject.id = item.id;
      this.renameVisible = true
    },
    showIcon(item){item.isHover=true},
    hideIcon(item){item.isHover=false},
    gotoProject(item){
      this.$router.push({
        path:'/editWord/word',
        query:{
          teamName:this.$route.query.teamName,
          teamId:this.$route.query.teamId,
          projectName:item.name,
          projectId:item.id
        }
      })
    },
    handleSort(command){
      switch (command){
        case 'timeDown':
          this.sortType = '按时间降序';
          break;
        case 'timeUp':
          this.sortType = '按时间升序';
          break;
        case 'nameDown':
          this.sortType = '按名称降序';
          break;
        case 'nameUp':
          this.sortType = '按名称升序';
          break;
      }
      this.sortProjects()
    },
    sortCmp(itemA, itemB){
      switch (this.sortType){
        case '按时间降序':
          return itemB.time < itemA.time;
        case '按时间升序':
          return itemA.time < itemB.time;
        case '按名称降序':
          return itemB.name < itemA.name;
        case '按名称升序':
          return itemA.name < itemB.name;
      }
    },
    sortProjects(){
      for(let i = 0; i < this.projectsList.length; i++){
        for(let j = 0; j < this.projectsList.length-i-1; j++){
          if(this.sortCmp(this.projectsList[j],this.projectsList[j+1])){
            let tmp = this.projectsList[j];
            this.projectsList[j] = this.projectsList[j+1];
            this.projectsList[j+1] = tmp;
          }
        }
      }
    },
    searchProject(){
      console.log(this.searchProectName)
    },
    copy(item){
      this.$notify.success("已生成项目副本：副本-"+item.name);
      this.getTeamProjects();
    },
    rename(){
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/renameproject",
          qs.stringify({
            project_id: this.renameProject.id,
            new_project_name: this.renameProject.newName,
          })).then((res)=>{
            if(res.data.errno===0){
              this.$message.success("重命名成功")
              this.getTeamProjects();
              this.renameVisible = false;
              this.renameProject.id = 0;
              this.renameProject.newName = "";
            } else this.$notify.error(res.data.msg)
          }).catch((error)=>{
            console.log(error);
          }
      )
    },
    confirmRecycle(item){
      this.$confirm('此操作将移除该项目至回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.recycle(item)
      })
    },
    recycle(project){
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/deleteproject",
          qs.stringify({
            project_id: project.id
          })).then((res)=>{
            if(res.data.errno===0){
              this.$message.success("已将项目 "+project.name+" 移入回收站");
              this.getTeamProjects();
            } else this.$notify.error(res.data.msg)
          }).catch((error)=>{
            console.log(error)
          })
    },
    recover(item){
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/reproject",
          qs.stringify({
            project_id: item.id,
          })).then((res)=>{
            if(res.data.errno===0){
              this.$message.success("已恢复项目："+item.name)
              this.getTeamProjects()
            } else this.$notify.error(res.data.msg)
          }).catch((error)=>{
            console.log(error)
          })
    },
    confirmDelete(item){
      this.$confirm("将彻底删除该项目且无法恢复，是否继续?",'警告',{
        confirmButtonText: '确定',
        confirmButtonClass: 'danger',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(item)
      })
    },
    delete(project){
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/delete_project_recycle",
          qs.stringify({
            project_id: project.id,
          })).then((res)=>{
            if(res.data.errno===0){
              this.getTeamProjects();
              this.$message.success("已彻底删除项目 "+project.name)
            } else this.$notify.error(res.data.msg)
          }).catch((error)=>{
            console.log(error)
          })
    },
    createProject(){
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/newproject",
          qs.stringify({
            user_id: this.userId,
            project_name: this.newProjectName,
            team_id: this.team.teamId,
          })).then((res)=>{
            // console.log(res);
            if(res.data.errno===0){
              this.getTeamProjects();
              this.newProjectVisible = false;
              this.$message.success("成功创建项目 "+this.newProjectName);
              this.newProjectName = "";
              this.newProjectVisible = false;
            } else this.$notify.error(res.data.msg)
          }).catch((error)=>{
            console.log(error)
          })
    },
    getTeamProjects(){
      this.projectsList = [];
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/check_team_project",
          qs.stringify({
            team_id: this.team.teamId,
          }))
          .then((res) => {
            let array = res.data.data;
            for(let i in array){
              this.projectsList.push({
                id: array[i].project_id,
                name: array[i].project_name,
                time: array[i].create_time,
                isRecycled: array[i].recycle,
                isHover: false,
              });
            }
            this.sortProjects();
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>

<style scoped>
.tools{
  position: absolute;
  line-height: 40px;
  display: flex;
  right: 12%;
  height: 40px;
  top: 125px;
  z-index: 20;
}
.search-box{
  width: 200px;
  margin-right: 40px;
}
.dropdownSort-box{
  width: 100px;
}
.cards-container{
  flex-wrap: wrap;
  display: flex;
}
.projectsCard{
  min-width: 150px;
  max-width: 200px;
  height:140px;
  flex-basis: 25%;
  margin-bottom: 30px;
  padding: 0 15px;
  margin-left: 5px;
  margin-right: 35px;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 1px 1px 2px 0 lightgrey;
  transition: all 0.25s;
}
.projectsCard:hover{
  box-shadow: 3px 3px 5px 0 darkgrey;
  margin-top: -5px;
}
#commonPrCard{
  background-image: url("../assets/nmb.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 101% 70%;
}
#commonPrCard:hover{
  filter: brightness(0.75);
}
#recyclePrCard{
  cursor: default;
  background-image: url("../assets/nmb.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 70%;
  filter: grayscale(1);
}
#recyclePrCard:hover{
  filter: grayscale(0.3);
}
.projectsCardFoot{
  margin-top: 108px;
}
.projectsNameSpan{
  font-weight: bold;
  font-size:15px;
  width: 90%;
  float: left;
  margin-left: 5px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.5s;
}
.projectsCard:hover .projectsNameSpan{
  width: 70%;
  font-size: 16px;
}
.projectsBtn{
  filter: opacity(0);
  display: flex;
  cursor: pointer;
  padding-top: 3px;
  margin-left: -15px;
  transition: all 1.5s;
}
.projectsCard:hover .projectsBtn{
  filter: opacity(1);
}
#newPrCard{
  background-color: whitesmoke;
}
#newPrCard:hover{
  background-color: ghostwhite;
}
#prPlusSpan{
  font-weight: bolder;
  font-size: 25px;
  transition: all 0.25s;
  width: 30px;
  float: left;
  text-align: left;
  margin-left: 5px;
}
#newPrCard:hover #prPlusSpan{
  font-size: 28px;
  transform: translateX(270%) translateY(50%) rotate(810deg);
  color: deepskyblue;
}
#newPrCard:hover #newPrNameSpan{
  font-size: 17px;
  color: deepskyblue;
  transform: translateX(35%) translateY(-50%);
}
</style>