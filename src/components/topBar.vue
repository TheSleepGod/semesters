<template>
  <div id="topBar">
    <div class="webLogo-box">
      <img class="webLogo" src="../assets/final_logo.png" alt=""/>
    </div>
    <div class="logo-font-box">
      <div style="padding-top: 15px;">墨书</div>
    </div>
    <div class="user">
      <div class="username">
        {{username}}
      </div>
      <div class = "icon-head-box">
        <el-dropdown @command="handleHeadCommand" placement="bottom" trigger="hover">
<!--          <img class = "icon-head" src="../assets/icon.jpg" alt="" @click="goHome">-->
          <Avatar class="icon-head" :username="username" :src="username" :background-color="extractColorByName(username)"
                  color="#fff" style="vertical-align: middle;" :inline="true"/>
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
import Avatar from "vue-avatar";
export default {
  name: "topBar",
  props:['username'],
  components:{Avatar},
  data(){
    return{
      //username: 'lsc1111',
    }
  },
  methods:{
    extractColorByName(name) {
      let temp = [];
      temp.push("#");
      for (let index = 0; index < name.length; index++) {
        temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16));
      }
      return temp.slice(0, 5).join('').slice(0, 4);
    },
    handleHeadCommand(command){
      switch (command){
        case "gotoTeams":
          this.$router.push("/team");
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    getNowUser() {
      console.log(111)
      let con = {};
      console.log(this.username);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/get_user',
        method: 'get',
        data: JSON.stringify(con),
      }).then((ret) => {
        if (ret.data.errno === 0) {
          console.log(ret.data.username);
          this.username = ret.data.username;
        } else {
          console.log("ERROR!");
          alert(ret.data.msg);
        }
      })
    },
    logout: function () {
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/logout',
        method: 'post',
        headers:{
          'Authorization':localStorage.getItem('Token'),
        },
      }).then((ret) => {
        console.log(ret);
        if (ret.data.errno === 0) {
          this.$message.success("退出成功");
          localStorage.clear();
          this.$router.push("/80");
        } else if(ret.data.errno===4001){
          localStorage.clear();
          this.$notify.error("用户已下线");
          this.$router.push("/80");
        } else this.$notify.error(ret.data.msg+"，退出失败");
      }).catch((error)=>{
        console.log(error)
      })
    },
    created() {
      this.getNowUser();
    },
  }
}
</script>

<style scoped>
#topBar{
  position: relative;
  display: flex;
  height: 70px;
  width: 100%;
  border-bottom: 2px black groove;
  margin-bottom: 20px;
  caret-color: transparent;
}
.webLogo-box{
  margin-left: 5px;
  float: left;
  height: 70px;
  width: 70px;
}
.webLogo{
  padding-top: 5px;
  height: 60px;
  width: 60px;
}
.logo-font-box{
  font-family:华文行楷,serif;
  cursor: default;
  display: table-cell;
  vertical-align: middle;
  width: 70px;
  font-size: 35px;
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
  cursor: default;
  display: inline-block;
  position: relative;
  margin-right: 10px;
  top: 18px;
  font-size: 25px;
}

.user{
  position: absolute;
  right: 0;
  float: right;
}
</style>