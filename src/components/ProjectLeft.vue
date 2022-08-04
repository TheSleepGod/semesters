<template>
  <div class = "left-box">
      <div class = "left-project-one" title="查看项目" @click="gotoTeamProjects">
        <img class = "left-project-one-img" src="../assets/teamProjects1.png" alt=""/>
<!--        <span class="font-1 left-project-one-mes">项目</span>-->
      </div>
      <div class = "left-project-one" title="查看成员" @click="gotoTeamOne">
        <img class = "left-project-one-img" src="../assets/teamMembers1.png" alt=""/>
<!--        <span class="font-1 left-project-one-mes">成员</span>-->
      </div>
      <div class="left-project-one" title="返回团队" @click="gotoTeams">
        <img class="left-project-one-img" src="../assets/goBack.png" alt=""/>
      </div>
    </div>
</template>

<script>
export default {
  name: "TeamDes",
  data(){
    return{

    }
  },
  methods: {
    gotoTeamOne(){
      this.$router.push({path:'/teamOne'});
    },
    gotoTeamProjects() {
      this.$router.push({path:'/projects'});
    },
    gotoTeams(){
      this.$router.push({path:'/team'});
    },
  }
}
</script>

<style scoped>
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.left-box {
  position: relative;
  float: left;
  top: 60px;
  height: 500px;
  width: 100px;
  padding: 0;
}
.left-project-one {
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-bottom: 30px;
  border-radius: 40px;
  cursor: pointer;
  box-shadow: 1px 1px 1px 1px lightgrey;
  transition: all 0.25s;
}
.left-project-one:hover{
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-left: 10px;
  box-shadow: 2px 2px 4px 2px grey;
}
.left-project-one-img {
  position: relative;
  width: 50%;
  height: 50%;
  top: 25%;
  transition: all 0.25s;
}
.left-project-one:hover .left-project-one-img{
  transform: rotate(360deg);
}
</style>