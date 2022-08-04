<template>
  <div class="box-body">
    <topBar/>
    <div class="left">
      <div id="showCase1" v-if="!isChanging">
        <div class = "left-head-box">
          <img class = "left-head-img" src="../assets/icon.jpg" alt="">
        </div>
        <div class = "left-message-box" style="margin-top: 10px">
          <div class = "left-id-box">
            <span class = "font-1" style="font-size: 26px;width: 100%">TheSleepGod</span>
          </div>
          <div style="margin-top: 20px">
            <button class ="left-changeMes-btn" @click="showChangeMesForm">编辑资料</button>
          </div>
        </div>
      </div>
      <div id="showCase2" v-if="isChanging">
        <div class="left-changeMesForm">
          <div class="left-changeMesForm-line">
            <span class="changeMesForm-label">昵称</span>
            <input placeholder="TheSleepGod" class="changeMesForm-input" maxlength="16" />
          </div>
          <div class="left-changeMesForm-line">
            <span class="changeMesForm-label">邮箱</span>
            <input type="text" placeholder="TheSleepGod" class="changeMesForm-input" maxlength="16" />
          </div>
          <div class="left-changeMesForm-line">
            <span class="changeMesForm-label">真实姓名</span>
            <input placeholder="TheSleepGod" class="changeMesForm-input" maxlength="16" />
          </div>
          <div class="left-changeMesForm-line">
            <span class="changeMesForm-label">电话</span>
            <input placeholder="TheSleepGod" class="changeMesForm-input" maxlength="16" />
          </div>
          <div style="height: 50px;">
            <button class="changeMesForm-btn" style="margin-left: 20%;" @click="changeOk">保存</button>
            <button class="changeMesForm-btn" style="margin-left: 59%;" @click="changeNo">取消</button>
          </div>
        </div>
      </div>
    </div>
    <div class = "right">
      <div class = "right-head-box">
        <div class="right-head-title">
          <span style="margin-left: 2%">我的团队</span>
        </div>
        <div class = "right-head-choose">
          <div class = "right-head-choose-tab" id="added-team-btn" @click="showAdded">
            <span class = "font-1"><i class="el-icon-suitcase"/> 我参与的团队</span>
          </div>
          <div class = "right-head-choose-tab" id="created-team-btn" style="margin-left: 220px" @click="showCreated">
            <span class = "font-1"><i class="el-icon-suitcase-1"/> 我创建的团队</span>
          </div>
          <div class="right-head-choose-tab" id="createNew-btn" style="margin-left: 420px" @click="showCreateNew">
            <span class="font-1"><i class="el-icon-plus"/> 创建新团队</span>
          </div>
          <div class="font-1" style="margin-left: 80%;margin-top:5px;min-width: 200px;position: absolute">
            <i class="el-icon-s-grid"/>
            3teams · 4projects
          </div>
        </div>
        <hr style="margin:0;height: 2px;border:none;background-image: linear-gradient(to right, black,grey,white)"/>
      </div>
      <div class = "right-mes-box">
        <div class = "right-team-mes" v-for="(myTeam) in allTeam" @click="gotoTeamOne(myTeam)">
          <div class = "right-team-name">
            <span class="font-1 right-team-name-font">{{ myTeam.teamName }}</span>
          </div>
          <div class = "right-team-number">
            <span class="font-1">{{ myTeam.teamNumber }}人&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="创建新团队" :visible.sync="newTeamVisible" style="width:60%;margin-left: 20%">
      <el-input v-model="newTeamName" placeholder="请输入团队名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="createNewTeam(newTeamName)">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import topBar from "@/components/topBar";
import qs from "qs";
import axios from "axios";
export default {
  components:{
    topBar
  },
  name: "Team",
  data() {
    let createdTeam = [];
    let addedTeam = [];
    let allTeam = addedTeam;
    return {
      username: '',
      newTeamName: "",
      newTeamVisible: false,
      createdTeam,
      addedTeam,
      allTeam,
      isChanging: false,
    }
  },
  methods: {
    gotoTeamOne(team) {
      this.$router.push({path:'/projects',query:{teamName:team.teamName,teamId:team.id}})
    },
    showCreated() {
      this.allTeam = this.createdTeam;
      document.getElementById("created-team-btn").style.borderBottom = "4px solid lightblue";
      document.getElementById("added-team-btn").style.borderBottom = "0px solid white";
    },
    showAdded() {
      this.allTeam = this.addedTeam;
      document.getElementById("added-team-btn").style.borderBottom = "4px solid lightblue";
      document.getElementById("created-team-btn").style.borderBottom = "0px solid white";
    },
    showChangeMesForm: function() {
      document.getElementById("showCase1").style = "opacity: 0;transform: translateY(100px);";
      setTimeout(()=>{
        document.getElementById("showCase1").style = "transition: all 0.5s";
        this.isChanging = true;
      },740);
      setTimeout(()=>{
        document.getElementById("showCase2").style = "transform: translateY(0);filter:opacity(1)";
      },750)
    },
    closeChangeMesForm: function (){
      document.getElementById("showCase2").style = "opacity: 0;transform: translateY(100px);";
      setTimeout(()=>{
        document.getElementById("showCase2").style = "";
        this.isChanging = false;
      },750);
    },
    changeOk: function() { //修改个人资料
      let toSend = {

      };
      this.$axios({
        method : 'post',
        url : 'http://',
        data : qs.stringify(toSend)
      }).then((res) =>{
        console.log(res);
        let ans = res.data;
      })
      this.closeChangeMesForm();
    },
    changeNo: function() {
      this.closeChangeMesForm();
    },
    showCreateNew(){
      this.newTeamVisible = true;
    },
    createNewTeam(name){
      let toSend = {
        user_id: 1,
        team_name: name,
      };
      this.$axios({
        method : 'post',
        url : 'http://43.138.22.20:8000/api/user/newteam',
        data : qs.stringify(toSend)
      }).then((res) =>{
        console.log(res);
        let ans=res.data;
        if(ans.errno === 0){
          alert("创建成功！！！");
        }
        else {
          alert("创建失败！！！");
        }
      })
    }
  },
  mounted() {
    this.showAdded();
  },
  created() {
    let toSend = {
      user_id: 1
    }
    let that = this;
    this.$axios({
      method : 'post',
      url : 'http://43.138.22.20:8000/api/user/check_user_team',
      data : qs.stringify(toSend)
    }).then((res) =>{
      console.log(res);
      var ans = res.data;
      var rec =res.data.data;
      console.log(rec);
      if(ans.errno==0){
        for(let i in rec){
            that.addedTeam.push({
                id : rec[i].team_id,
                teamName: rec[i].name,
                teamNumber: rec[i].count
            });
        }
      }
      else {
        alert("页面加载错误 ! ! !");
      }
    })
    this.$axios({
      method : 'post',
      url : 'http://',
      data : qs.stringify(toSend)
    }).then((res) =>{
      console.log(res);
      let ans =res.data;
      let rec =ans.data;
      if(ans.errno==0){
        for(let i in rec){
          this.addedTeam.push({
            id : rec[i].team_id,
            teamName: rec[i].name,
            teamNumber: rec[i].count
          })
        }
      }
      else {
        alert("页面加载错误 ! ! !");
      }
    })
  }
}
</script>

<style scoped>
.box-body {
  padding: 0;
  margin-left: -10px;
  margin-top: -10px;
  overflow: hidden;
}
.left {
  display: inline-block;
  position: relative;
  float: left;
  width: 25%;
  height: 550px;
}
.left-head-box {
  position: relative;
  width: 80%;
  margin-left: 10%;
}
.left-head-img {
  position: relative;
  width: 80%;
  margin-top: 10%;
  border-radius: 150px;
}
.left-id-box {
  height: 40px;
  width: 80%;
  margin-left: 10%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.left-changeMes-btn{
  display: inline-block;
  padding: 10px 25px;
  font-size: 20px;
  cursor: pointer;
  color:#fff;
  background-color: rgb(16, 185, 214);
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}
.left-changeMes-btn:hover{
  background-color: #1795bb;
}
.left-changeMes-btn:active{
  background-color: #1795bb;
  box-shadow: 0 5px #666;
  transform:translateY(4px);
}
.right {
  display: inline-block;
  position: relative;
  width: 75%;
}
.right-head-box {

}
.right-head-title{
  font-size: 28px;
  text-align: left;
}
.right-head-choose{
  margin-top: 20px;
  text-align: left;
  height: 37px;
  width: 100%;
}
.right-head-choose-tab {
  height: 35px;
  margin-left: 2%;
  display: inline-block;
  position: absolute;
  font-size: 22px;
  transition: all 0.25s;
}
.right-head-choose-tab:hover {
  background-color: aliceblue;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
}
#createNew-btn{
  transition: all 0.25s;
}
#createNew-btn:hover{
  background-color: navajowhite;
}
.right-mes-box {
  position: relative;
  flex-wrap: wrap;
  display: flex;
}
.right-team-mes{
  width: 25%;
  min-width: 180px;
  height: 150px;
  position: relative;
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 25px;
  border-radius: 10px;
  color: lightsteelblue;
  box-shadow: 0 0 4px 0 grey;
  transition: all 0.25s;
  background: -webkit-linear-gradient(right, rgba(255,255,255,0)0, rgba(255,255,255,0.5)50%, rgba(255,255,255,0)100%) no-repeat -300px 0, url("../assets/icon.jpg") no-repeat;
}
.right-team-mes:hover{
  background-position: 200px 0, 0 0;
  cursor: pointer;
  transform: translateY(-5px);
  box-shadow: 0 0 8px 0 grey;
  color: lightcyan;
  animation: team-everShine 2s infinite linear;
}
@keyframes team-everShine {
  0%{text-shadow: none;}
  50%{text-shadow: 0 0 4px white, 0 0 8px white;}
  100%{text-shadow: none;}
}
.right-team-name {
  position: absolute;
  top: 20%;
  margin-left: 10%;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  font-size: 20px;
}
.right-team-number {
  position: absolute;
  margin-left: 10%;
  top: 65%;
}
.left-changeMesForm{
  margin-top: 10%;
  font-weight: bold;
  text-align: left;
  transition: all 0.5s;
}
.left-changeMesForm-line{
  display: inline-grid;
  width: 100%;
  height: 100px;
}
.changeMesForm-label{
  width: 20%;
  margin-top: 2%;
  margin-left: 5%;
}
.changeMesForm-input{
  flex-wrap: nowrap;
  width: 60%;
  height: 14px;
  position: absolute;
  margin-left: 25%;
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 13px 14px;
  font-size: 14px;
  font-weight: 700;
}
.changeMesForm-input:focus{
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)
}
.changeMesForm-btn{
  position: absolute;
  font-size: 18px;
  width: 18%;
  min-width: 55px;
  margin-left: 19%;
  border: 1px grey solid;
  border-radius: 15px;
  /*color: white;*/
  /*background-color: blueviolet;*/
  transition: all 0.25s;
}
.changeMesForm-btn:hover{
  cursor: pointer;
  border-radius: 15px;
  box-shadow: 1px 1px 3px 0 black;
  text-shadow: 0 0 4px white;
}
#added-team-btn{
  transition: all 0.5s;
}
#created-team-btn{
  transition: all 0.5s;
}
#showCase1{
  transition: all 0.75s;
}
#showCase2{
  filter: opacity(0);
  transform: translateY(100px);
  transition: all 0.75s;
}
</style>






