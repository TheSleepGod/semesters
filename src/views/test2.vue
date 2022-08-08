<template>
  <div class = "body-box">
    <TopBar :username="username"></TopBar>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>
    <MultiFolder :team_id="team.teamId" :team_name="team.teamName" style="float: right;width: 300px"/>
  </div>
</template>

<script>
import TeamLeft from "../components/ProjectLeft";
import TopBar from "../components/topBar"
import MultiFolder from "@/components/multiFolder";
export default {
  name: "DC",
  components: {
    TeamLeft, TopBar, MultiFolder
  },
  data(){
    return{
      username:'',
      team:{
        teamId:'',
        teamName:'',
      }
    }
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
  },
  created() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.getNowUser();
  }
}
</script>

<style scoped>

</style>


