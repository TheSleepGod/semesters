<template>
  <div id="topBar">
    <div class="webLogo-box">
      <img class="webLogo" src="../assets/moshulogo.png" alt=""/>
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
</template>

<script>
export default {
  name: "topBar",
  data(){
    return{

    }
  },
  methods:{
    handleHeadCommand(command){
      switch (command){
        case "gotoTeams":
          this.$router.push("/team");
          break;
        case "logout":
          this.$router.push("/home");
          this.$message.success("已退出登录");
          break;
      }
    }
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
</style>