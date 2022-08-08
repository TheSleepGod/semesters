<template>
  <div class = "box-body">
    <TopBar :username="username"/>
    <TeamLeft :team_id="team_id" :team_name="teamMes.teamName"/>
    <div class = "right-box">
      <div class = "right-head-box font-1">
        <div style="width: 100%;height: 60px">
          <div class = "right-head-name-box">
            <span class = "right-head-teamName">{{teamMes.teamName}}</span>
          </div>
          <div class = "right-head-identity-box">
            <div class="right-head-identity-mes" style="width:40%;">身份</div>
            <div class="right-head-identity-mes right-head-identity-mes-idy" v-if="teamPeople[nowLogin].identity === '普通成员'" style="background-color:darkolivegreen;">成 员</div>
            <div class="right-head-identity-mes right-head-identity-mes-idy" v-if="teamPeople[nowLogin].identity === '管理员'" style="background-color:darkblue;">管理员</div>
            <div class="right-head-identity-mes right-head-identity-mes-idy" v-if="teamPeople[nowLogin].identity === '创建者'" style="background-color:black;color:gold">创建者</div>
          </div>
        </div>
        <div class = "right-head-mes-box">
          <span class="right-head-mes">
            <i class="el-icon-s-grid"></i>
<!--            团队人数：{{teamPeople.size}} 人<el-divider direction="vertical"/>-->
            团队简介：{{teamMes.team_intro}}
          </span>
        </div>
        <div class="right-head-invite" @click="showInvitePanel">
          <img id="right-head-invite-icon" src="../assets/bell.png" alt=""/>
          <div> 摇人</div>
        </div>
      </div>
      <hr style="margin:0;background-color:black;height:1px;border:none; background-image: linear-gradient(to right, #333, #333, #ccc);width: 80%" />
      <div class = "right-people-boxes-container">
        <div class = "right-people-mes-box" v-for="(people,index) in teamPeople" @mouseover="clickCome(index)" @mouseleave="clickLeave(index)" :id = index>
          <div class = "rpm-left">
            <div>
              <img class = "rpm-left-icon" src="../assets/icon.jpg" alt="">
            </div>
            <div>
              <span class = "font-1 rmp-left-id">{{ people.user_name }}</span>
            </div>
            <img class = "rpm-per-icon" src = "../assets/permissions/Owner.png" v-if = "people.identity === '创建者'"
                 alt="创建者" title="创建者">
            <img class = "rpm-per-icon" src = "../assets/permissions/Manger.png" v-if = "people.identity === '管理员'"
                 alt="管理员" title="管理员">
            <img class = "rpm-per-icon" src = "../assets/permissions/Person.png" v-if = "people.identity === '普通成员'"
                 alt="成员" title="成员">
          </div>
          <div class = "rpm-right">
            <ul style="text-align: left; margin-left: 16px; margin-top: 25px;z-index: 20">
              <li style="margin-bottom: 10px;">电话: {{people.tel}}</li>
              <li style="margin-bottom: 10px;">邮箱：{{people.mail}}</li>
              <li style="margin-bottom: 10px;">真实姓名：{{people.real_name}}</li>
            </ul>
          </div>
          <div class="rpm-foot" v-if="isHover[index] && teamPeople[nowLogin].identity === '创建者'">
            <div class="rpm-del-whole" v-if="index === nowLogin" @click="showDissolveConfirm">解 散</div>
            <div class="rpm-changePer-leftHalf" v-if="index !== nowLogin" @click="changePer(people)">修 改 权 限</div>
            <div class="rpm-del-rightHalf" v-if="index !== nowLogin" @click="del(people)">删 除</div>
          </div>
          <div class="rpm-foot" v-if="isHover[index] && teamPeople[nowLogin].identity === '管理员'">
            <div class="rpm-del-whole" v-if="index === nowLogin" @click="exit()">退 出</div>
            <div class="rpm-changePer-leftHalf" v-if="index !== nowLogin && teamPeople[index].identity==='普通成员'" @click="changePer(people)">修 改 权 限</div>
            <div class="rpm-del-rightHalf" v-if="index !== nowLogin && teamPeople[index].identity==='普通成员'" @click="del(people)">删 除</div>
          </div>
          <div class="rpm-foot" v-if="isHover[index] && teamPeople[nowLogin].identity === '普通成员'">
            <div class="rpm-del-whole" v-if="index === nowLogin" @click="exit(people)">退 出</div>
<!--            <div class="rpm-changePer-leftHalf" v-if="index !== nowLogin" @click="changePer(people)">修 改 权 限</div>-->
<!--            <div class="rpm-del-rightHalf" v-if="index !== nowLogin" @click="del(people)">删 除</div>-->
          </div>
        </div>
      </div>    
    </div>

    <el-dialog title="邀请新成员" :visible.sync="invitePanelVisible" style="width:60%;margin-left: 20%">
      <el-input v-model="inviteName" placeholder="请输入被邀请者的用户id" maxlength="20" show-word-limit>
        <el-button slot="append" @click="inviteMember(inviteName)">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import TeamLeft from '../components/ProjectLeft';
import TopBar from "@/components/topBar";
import qs from "qs";
export default {
  name: "TeamDes",
  components: {
    TeamLeft,TopBar
  },
  data() {
    let teamMes = {
      myIdentity: "",
      teamName: "",
      teamNumber: 6,
      teamWorks: 9,
      team_intro:'这个团队很懒，什么也没有留下~',
    };
    let teamPeople = [{
      user_id: '',
      user_name: '',
      real_name: '',
      mail: '',
      identity: '',
      tel: '',
    }];
    let isHover = [false,false,false,false,false,false,false,false,false,false,false];
    let nowLogin = 0;
    return {
      username:'',
      inviteName: "",
      invitePanelVisible: false,
      team_id:3,
      user_id:1,
      teamMes,
      teamPeople,
      isHover,
      nowLogin,
    }
  },
  methods: {
    clickCome: function (index) {
      this.isHover.splice(index, 1, true);
    },
    clickLeave: function (index) {
      this.isHover.splice(index, 1, false);
    },
    del: function(people) {
      let r=confirm("确认删除吗");
      if (r===true)
      {
        let todo ={
          user_id : this.user_id,
          team_id : this.team_id,
          del_user_id : people.user_id,
        };
        this.$axios({
          method : 'post',
          url : 'http://43.138.22.20:8000/api/user/deletemember',
          data : qs.stringify(todo)
        }).then((res) =>{
          console.log(res);
          let ans = res.data;
          if(ans.errno===0){
            this.$message.success("You pressed OK! del " + people.name);
            this.getTeamMember();
          }
          else this.$notify.error(ans.msg)
        })
      }
    },
    changePer:function (people) {
      let changeFlag = 0;
      if(people.identity==='管理员')changeFlag = 1;
      let toSend={
        user_id: this.user_id,
        team_id: this.team_id,
        new_user_id: people.user_id
      }
      this.$axios({
        method:'post',
        url : 'http://43.138.22.20:8000/api/user/setadmin',
        data : qs.stringify(toSend)
      }).then((res) =>{
        let ans =res.data;
        if(ans.errno===0){
          if(changeFlag===0) this.$notify.success(people.user_name+"的身份权限已变更为：管理员")
          else this.$notify.success(people.user_name+"的权限等级已变更为：普通成员")
          this.getTeamMember();
        }
        else this.$notify.error(ans.msg);
      })
    },
    showDissolveConfirm(){
      this.$confirm('将解散团队, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass:'warning'
      }).then(() => {
        this.dissolve()
      })
    },
    dissolve(){
      let toSend={
        user_id:this.user_id,
        team_id:this.team_id
      }
      this.$axios({
        method : 'post',
        url : 'http://43.138.22.20:8000/api/user/quit_team',
        data : qs.stringify(toSend)
      }).then((res) =>{
        let ans =res.data;
        if(ans.errno===0){
          this.$notify.info("团队 "+this.teamMes.teamName+" 已解散")
          this.$router.push('/team');
        }
      })
    },
    exit(){
      let toSend={
        user_id:this.user_id,
        team_id:this.team_id
      };
      this.$axios({
        method : 'post',
        url : 'http://43.138.22.20:8000/api/user/quit_team',
        data : qs.stringify(toSend)
      }).then((res) =>{
        let ans = res.data;
        if(ans.errno===0){
          this.$notify.info("已退出团队 "+this.teamMes.teamName)
          this.$router.push('/team');
        }
      })
    },
    showInvitePanel(){
      let bell = document.getElementById("right-head-invite-icon");
      bell.style.height="45px";
      bell.style.width="45px";
      setTimeout(()=>{
        bell.style="";
        this.invitePanelVisible = true;
      },300);
    },
    inviteMember(name){
      let todo = {
        user_id : this.user_id,
        team_id : this.team_id,
        new_user_id : this.inviteName,
      }
      this.$axios({
        method : 'post',
        url:'http://43.138.22.20:8000/api/user/invitemember',
        data : qs.stringify(todo),
      }).then((res) =>{
        //console.log(res);
        let ans=res.data;
        if(ans.errno===0){
          this.$message.success("成功邀请成员 "+name+" 加入团队 "+this.teamMes.teamName);
          this.invitePanelVisible = false;
          this.inviteName = "";
          this.getTeamMember();
        }
        else this.$notify.error("邀请失败;"+ans.msg)
      })
    },
    getTeamMessage() {
      let params = {
        team_id: this.team_id,
      };
      this.$axios
          .post("http://43.138.22.20:8000/api/user/checkteam", qs.stringify(params))
          .then((res) => {
            //console.log(res.data);
            let ans=res.data;
            if(ans.errno===0){
              this.teamMes.teamName=ans.data.name;
              this.teamMes.team_intro=ans.data.introduction;
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },

    getTeamMember() {
      let params = {
        team_id: this.team_id,
      };
      this.$axios
          .post("http://43.138.22.20:8000/api/user/check_team_user", qs.stringify(params))
          .then((res) => {
            //console.log(res.data);
            this.teamPeople = res.data.data;
            //console.log(this.teamPeople);
          })
          .catch((error) => {
            console.log(error);
          });
    },
    getNowUser(){
      this.$axios({
        method:'post',
        url: 'http://101.42.160.94:8000/api/user_web/get_user',
        headers:{
          'Authorization':localStorage.getItem('Token'),
        },
      }).then((res) =>{
        console.log(res);
        this.user_id=0;
        this.user_id=res.data.data.user_id;
        this.username=res.data.data.username;
        for(let i in this.teamPeople){
          if(this.user_id===this.teamPeople[i].user_id){
            this.teamMes.myIdentity=this.teamPeople[i].identity;
            this.nowLogin=i;
          }
        }
        console.log(this.user_id);
      })
    },
  },
  created() {
    this.getNowUser()
    this.team_id = this.$route.query.teamId;
    this.teamMes.teamName = this.$route.query.teamName;
    this.getTeamMessage();
    this.getTeamMember();
  }
}
</script>

<style scoped>
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.box-body {
  padding: 0;
  overflow: hidden;
}
.right-box {
  position: relative;
  padding: 0;
  left: 160px;
}
.right-head-box {
  position: relative;
  height: 100px;
  left: 30px;
}
.right-head-teamName {
  position: relative;
  float: left;
  font-size: 28px;
  text-align: left;
  margin-top: 11px;
}
.right-head-name-box {
  height: 60px;
  max-width: 70%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  float: left;
  /*color: #0997F7;*/
}
.right-head-mes-box {
  height: 40px;
  position: relative;
  float: left;
}
.right-head-mes {
  position: relative;
  top: 8px;
}
.right-head-identity-box {
  position: relative;
  float: left;
  width: 105px;
  height: 25px;
  margin-left: 10px;
  background: darkgrey;
  top:20px;
  text-align: center;
  border-radius: 5px;
  cursor: default;
}
.right-head-identity-mes {
  height: 100%;
  display: inline-block;
  position: relative;
  color: white;
}
.right-head-identity-mes-idy{
  width: 60%;
  font-weight: bold;
  border-radius: 5px;
  float: right;
  transition: all 0.25s;
}
.right-people-boxes-container {
  margin-top: 20px;
  position: relative;
  flex-wrap: wrap;
  display: flex;
}
.right-people-mes-box {
  width: 380px;
  height: 140px;
  position: relative;
  border-radius: 30px;
  box-shadow: 1px 1px 2px 0 darkgrey;
  margin-right: 25px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  transition: all 0.25s;
}
.right-people-mes-box:hover{
  cursor: default;
  transform: translateY(-5px);
  box-shadow: 2px 2px 5px 1px grey;
}
.rpm-left {
  height: 115px;
  width: 130px;
  position: relative;
  float: left;
}
.rpm-left-icon {
  position: relative;
  width: 61px;
  height: 61px;
  border-radius: 30px;
  margin-top: 25px;
}
.rmp-left-id {
  position: absolute;
  margin-left: -50px;
  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rpm-right {
  width: 250px;
  height: 115px;
  position: absolute;
  margin-left: 130px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rpm-foot{
  position: relative;
  width: 380px;
  height: 25px;
  float: left;
  cursor: pointer;
  color: white;
  font-size: 17px;
}
.rpm-del-whole {
  height: 25px;
  background: red;
  position: relative;
  z-index: 10;
  border-radius: 0 0 30px 30px;
  transition: all 0.5s;
}
.rpm-del-whole:hover{
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
}
.rpm-changePer-leftHalf{
  display: inline-block;
  height: 25px;
  width: 50%;
  background: darkslateblue;
  position: relative;
  z-index: 10;
  border-radius: 0 0 0 30px;
  transition: all 0.5s;
}
.rpm-changePer-leftHalf:hover{
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
}
.rpm-del-rightHalf {
  display: inline-block;
  height: 25px;
  width: 50%;
  background: red;
  position: relative;
  z-index: 10;
  border-radius: 0 0 30px 0;
  transition: all 0.25s;
}
.rpm-del-rightHalf:hover{
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
}
.rpm-per-icon {
  height: 30px;
  width: 30px;
  position: relative;
  float: left;
  z-index: 10;
  margin-left: 70px;
  transform: rotate(35deg);
  margin-top: -80px;
  transition: all 0.25s;
}
.right-people-mes-box:hover .rpm-per-icon{
  height: 40px;
  width: 40px;
  margin-left: 66px;
  margin-top: -85px;
  animation: perIcon-everShake 1.5s infinite linear;
}
@keyframes perIcon-everShake {
  0%{transform: rotate(35deg)}
  4%{transform: rotate(20deg)}
  8%{transform: rotate(35deg)}
  12%{transform: rotate(50deg)}
  16%{transform: rotate(35deg)}
  20%{transform: rotate(20deg)}
  24%{transform: rotate(35deg)}
  28%{transform: rotate(50deg)}
  32%{transform: rotate(35deg)}
  100%{transform: rotate(35deg)}
}
.right-head-invite{
  margin-top: -40px;
  width: 80px;
  font-size: 22px;
  margin-left: 72%;
  transition: all 0.25s;
}
.right-head-invite:hover{
  background-color: whitesmoke;
  border-radius: 15px;
  font-size: 24px;
  cursor: pointer;
}
#right-head-invite-icon{
  width: 25px;
  height: 25px;
  transition: all 0.25s;
}
.right-head-invite:hover #right-head-invite-icon{
  width: 35px;
  height: 35px;
  animation: bell-everShake 0.4s infinite linear;
}
@keyframes bell-everShake {
  0%{transform: rotate(0)}
  25%{transform: rotate(-45deg)}
  50%{transform: rotate(0)}
  75%{transform: rotate(45deg)}
  100%{transform: rotate(0)}
}
</style>