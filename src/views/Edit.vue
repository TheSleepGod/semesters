<template>
  <div>
    <div class="top_head">
      <div class="top_head_left">
        <i class="el-icon-arrow-left" style="cursor: pointer" @click="goBackToProjects"></i>
        <div class="go_back" style="cursor: pointer" @click="goBackToProjects">
            返回
        </div>
        <div class="item_name">
            当前项目:&nbsp{{nowProjectName}}
        </div>
      </div>
      <div class="top_head_middle">
          <router-link :to="{ path:'/editWord/word',  query:{ projectId: this.nowProjectId ,projectName:this.nowProjectName,teamId:this.nowTeamId,teamName:this.nowTeamName}}">文档</router-link>
          <router-link :to="{ path:'/editWord/design2', query:{ projectId: this.nowProjectId,projectName:this.nowProjectName,teamId:this.nowTeamId,teamName:this.nowTeamName}}" >原型图</router-link>
          <router-link :to="{ path:'/editWord/UML', query:{ projectId: this.nowProjectId,projectName:this.nowProjectName,teamId:this.nowTeamId,teamName:this.nowTeamName}}">绘制UML图</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "Edit",
  data(){
    return{
      nowTeamId: 1,
      nowTeamName: '',
      nowProjectId: 1,
      nowProjectName: 1,
    }
  },
  methods: {
    goBackToProjects() {
      this.$router.push({
        path: '/projects',
        query:{
          teamName: this.nowTeamName,
          teamId: this.nowTeamId
        }
      })
    }
  },
  mounted() {
    this.nowTeamId = this.$route.query.teamId;
    this.nowTeamName = this.$route.query.teamName;
    this.nowProjectId = this.$route.query.projectId;
    this.nowProjectName = this.$route.query.projectName;
  }
}
</script>

<style>
.router-link-exact-active {
  color: white;
  border-bottom: 3px solid red;
  text-decoration: none;
  font-size: 25px;
  margin-right: 30px;
  margin-left: 30px;
}
a{
  text-decoration: none;
  color: white;
  margin-left: 30px;
  margin-right: 30px;
}
.top_head {
  position: relative;
  z-index: 101;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  height: 50px;
  font-family: -apple-system,BlinkMacSystemFont,PingFang SC,Helvetica,Tahoma,Arial,Microsoft YaHei,微软雅黑,sans-serif;
  color: #eef0f4;
  background: #283142;
  line-height: 50px;
  caret-color: transparent;
}

.top_head_left {
  margin-left: 20px;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.top_head_middle{
  display: flex;
  position: absolute;
  left: 50%;
  z-index: 2;
  height: 50px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.go_back {
  margin-left: 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.item_name {
  margin-left: 20px;
  margin-right: 30px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-family: -apple-system,BlinkMacSystemFont,PingFang SC,Helvetica,Tahoma,Arial,Microsoft YaHei,微软雅黑,sans-serif;
  color: white;
}

.member_picture {
  margin-top: 20px;
  margin-left: 5px;
  align-items: center;
  border: 1px solid #42b983;
  border-radius: 30px;
  width: 30px;
  height: 30px;
  display: inline-block;
}

</style>