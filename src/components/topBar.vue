<template>
  <div id="topBar">
    <div class="webLogo-box">
      <img class="webLogo" src="../assets/moshulogo.png" alt=""/>
    </div>
    <div class="user">
    <div class="username">
      {{username}}
    </div>
    <div class = "icon-head-box">
      <el-dropdown @command="handleHeadCommand" placement="bottom" trigger="hover">
        <img class = "icon-head" src="../assets/icon.jpg" alt="">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="gotoTeams">我的团队</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "topBar",
  data(){
    return{
      username: 'lsc',
    }
  },
  methods:{
    handleHeadCommand(command){
      switch (command){
        case "gotoTeams":
          this.$router.push("/team");
          break;
        case "logout":
          this.exit();
          this.$router.push("/");
          break;
      }
    },
    exit: function () {
      let con = {};
      con['username'] = this.username;
      console.log(con);
      axios({
        //TODO
        url: 'http://101.42.160.94:8000/api/user_web/login',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        if (ret.data.errno === 0) {
          this.$message.success("退出成功");
        } else {
          alert(ret.data.msg);
          this.$message.error("退出失败");
        }
      })
    },
  }
}
</script>

<style scoped>
#topBar{
  height: 70px;
  width: 100%;
}
.webLogo-box{
  float: left;
  height: 70px;
  width: 100px;
  margin-left: 10px;
}
.webLogo{
  margin-top: 5px;
  height: 60px;
}
.icon-head-box {
  float: right;
  height: 70px;
  width: 70px;
  margin-right: 10px;
}
.icon-head {
  cursor: pointer;
  margin-top: 10px;
  height: 50px;
  width: 50px;
  border-radius: 35px;
}
.username {
  display: inline-block;
  position: relative;
  margin-right: 10px;
  top: 18px;
  font-size: 25px;
}

.user{
  float: right;
}
</style>