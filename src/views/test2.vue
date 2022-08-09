<template>
  <div class = "body-box">
    <TopBar :username="username"></TopBar>
    <TeamLeft :team_id="team.teamId" :team_name="team.teamName"/>
    <MultiFolder :team_id="team.teamId" :team_name="team.teamName" style="float: right;width: 300px"/>
<!--    <v-treeview-->
<!--        v-model="tree"-->
<!--        :open="initiallyOpen"-->
<!--        :items="items"-->
<!--        activatable-->
<!--        expand-icon=""-->
<!--        return-object-->
<!--        transition-->
<!--        dense-->
<!--        item-key="name"-->
<!--        open-on-click-->
<!--    >-->
<!--      <template v-slot:prepend="{ item, open }">-->
<!--        <div @contextmenu.prevent = "onContextmenu">-->
<!--        <v-icon v-if="!item.file">-->
<!--          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}-->
<!--        </v-icon>-->
<!--        <v-icon v-else>-->
<!--          {{ files[item.file] }}-->
<!--        </v-icon>-->
<!--        </div>-->
<!--      </template>-->
<!--    </v-treeview>-->
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
  created() {
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.getNowUser();
  },
  methods: {
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
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "返回(B)",
            onClick: () => {
              this.message = "返回(B)";
              console.log("返回(B)");
            }
          },
          { label: "前进(F)", disabled: true },
          { label: "重新加载(R)", divided: true, icon: "el-icon-refresh" },
          { label: "另存为(A)..." },
          { label: "打印(P)...", icon: "el-icon-printer" },
          { label: "投射(C)...", divided: true },
          {
            label: "使用网页翻译(T)",
            divided: true,
            minWidth: 0,
            children: [{ label: "翻译成简体中文" }, { label: "翻译成繁体中文" }]
          },
          {
            label: "截取网页(R)",
            minWidth: 0,
            children: [
              {
                label: "截取可视化区域",
                onClick: () => {
                  this.message = "截取可视化区域";
                  console.log("截取可视化区域");
                }
              },
              { label: "截取全屏" }
            ]
          },
          { label: "查看网页源代码(V)", icon: "el-icon-view" },
          { label: "检查(N)" }
        ],
        event, // 鼠标事件信息
        customClass: "custom-class", // 自定义菜单 class
        zIndex: 3, // 菜单样式 z-index
        minWidth: 230 // 主菜单最小宽度
      });
      return false;
    }
  }
}
</script>

<style scoped>

</style>


