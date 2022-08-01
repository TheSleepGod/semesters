<template>
  <div>
    <!-- 页头-->
    <div style="height: 40px;">
      <span style="font-size: 30px;margin-top: 10px">{{teamName}}的工作台</span>
    </div>
    <!-- 项目展示-->
    <el-tabs v-model="activeName" style="width: 70%;margin-left: 15%">
      <el-tab-pane label="团队项目" name="first">
        <div class="cards-container" style="margin-top: 10px">
          <div class="projectsCard" v-for="item in tmpProjectsList" :key="item.data" v-if="item.isRecycled===false"
               @click="gotoProject(item)" @mouseenter="showIcon(item)" @mouseleave="hideIcon(item)">
            <div class="projectsCardFoot">
              <span class="projectsNameSpan">{{item.name}}</span>
              <span class="projectsBtn">
                <i class="el-icon-edit-outline" v-if="item.isHover" title="重命名" style="margin-right: 10px" @click.stop="showRename(item)"></i>
                <i class="el-icon-delete" v-if="item.isHover" title="移除至回收站" style="margin-right: -20px" @click.stop="confirmRecycle(item)"></i>
              </span>
            </div>
          </div>
          <div class="newProjectCard" @click="showCreateProject">
            <div style="margin-top: 25px">
              <span class="newProjectNameSpanPlus">+</span>
            </div>
            <div style="margin-top: 110px">
              <span class="newProjectNameSpan">创建新项目</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="项目回收站" name="second">
        <div class="cards-container" style="margin-top: 10px">
          <div class="recycleProjectsCard" v-for="item in tmpProjectsList" :key="item.data" v-if="item.isRecycled!==false"
               @click="gotoProject(item)" @mouseenter="showIcon(item)" @mouseleave="hideIcon(item)">
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
    <el-dialog title="重命名项目" :visible.sync="renameVisible" style="width: 60%;margin-left: 20%">
      <el-input v-model="tmpProjectName" placeholder="请输入项目名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="rename">确认</el-button>
      </el-input>
    </el-dialog>
    <el-dialog title="新建项目" :visible.sync="newProjectVisible" style="width:60%;margin-left: 20%">
      <el-input v-model="tmpProjectName" placeholder="请输入项目名" maxlength="20" show-word-limit>
        <el-button slot="append" @click="createProject(tmpProjectName)">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectsView",
  data(){
    return{
      newProjectVisible: false,
      iconVisible: false,
      renameVisible: false,
      tmpProjectName: '',
      activeName: "first",
      teamName: "团队1",
      projectsList: [],
      oneProject: {
        id: 0,
        name: '',
        isRecycled: false,
        isHover: false,
      },
      tmpProjectsList: [
        {
          id: 12345,
          name: "敏捷开发",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "瀑布模型开发",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "你是一个一个一个项目啊啊啊",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "小学期项目",
          isRecycled: true,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: false,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: true,
          isHover: false,
        },
        {
          id: 12345,
          name: "好多好多测试项目",
          isRecycled: true,
          isHover: false,
        }
      ]
    }
  },
  methods:{
    showCreateProject(){this.newProjectVisible=true},
    showRename(item){this.tmpProjectName = item.name;this.renameVisible = true},
    showIcon(item){item.isHover=true},
    hideIcon(item){item.isHover=false},
    gotoProject(item){
      this.$router.push({name:'inProject',query:{projectName:item.name,projectId:item.id}})
    },
    rename(item){
      this.$message.success("重命名成功")
    },
    confirmRecycle(item){
      this.$confirm('此操作将移除该项目至回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success("已移除项目："+item.name)
      })
    },
    recover(item){
      this.$message.success("已恢复项目："+item.name)
    },
    confirmDelete(item){
      this.$confirm("将彻底删除该项目且无法恢复，是否继续?",'警告',{
        confirmButtonText: '确定',
        confirmButtonClass: 'danger',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success("已彻底删除项目："+item.name)
      })
    },
    createProject(name){
      this.$message.success("新建项目成功")
    }
  }
}
</script>

<style scoped>
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
  margin-right: 25px;
  cursor: pointer;
  border-radius: 25px;
  background-image: url("../assets/nmb.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 75%;
  box-shadow: 1px 1px 2px 0 lightgrey;
  transition: all 0.25s;
}
.projectsCard:hover{
  box-shadow: 3px 3px 5px 0 darkgrey;
  margin-top: -5px;
  filter: brightness(0.75);
}
.recycleProjectsCard{
  min-width: 150px;
  max-width: 200px;
  height:140px;
  flex-basis: 25%;
  margin-bottom: 30px;
  padding: 0 15px;
  margin-right: 25px;
  cursor: pointer;
  border-radius: 25px;
  background-image: url("../assets/nmb.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 75%;
  box-shadow: 1px 1px 2px 0 lightgrey;
  filter: grayscale(1);
  transition: all 0.25s;
}
.recycleProjectsCard:hover{
  box-shadow: 3px 3px 5px 0 darkgrey;
  margin-top: -5px;
  filter: grayscale(0.3);
}
.projectsCardFoot{
  margin-top: 110px;
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
  transition: all 0.25s;
}
.projectsCard:hover .projectsNameSpan{
  width: 75%;
  font-size: 16px;
}
.recycleProjectsCard:hover .projectsNameSpan{
  width: 75%;
  font-size: 16px;
}
.projectsBtn{
  margin-left: -15px;
}
.newProjectCard{
  min-width: 150px;
  max-width: 200px;
  height:140px;
  flex-basis: 25%;
  margin-bottom: 30px;
  padding: 0 15px;
  margin-right: 25px;
  cursor: pointer;
  border-radius: 25px;
  box-shadow: 1px 1px 2px 0 lightgrey;
  transition: all 0.25s;
  background-color: whitesmoke;
}
.newProjectCard:hover{
  box-shadow: 3px 3px 5px 0 darkgrey;
  margin-top: -5px;
  background-color: ghostwhite;
}
.newProjectNameSpan{
  font-weight: bold;
  font-size:15px;
  transition: all 0.25s;
  width: 90%;
  float: left;
  text-align: left;
  margin-left: 5px;
}
.newProjectCard:hover .newProjectNameSpan{
  font-size: 16px;
  color: deepskyblue;
}
.newProjectNameSpanPlus{
  font-weight: bolder;
  font-size: 25px;
  transition: all 0.25s;
  width: 90%;
  float: left;
  text-align: left;
  margin-left: 5px;
}
.newProjectCard:hover .newProjectNameSpanPlus{
  font-size: 28px;
  color: deepskyblue;
}
</style>