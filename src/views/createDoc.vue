<template>
  <div>
    <div>
      <el-button type="primary" round @click="createVisible = true">创建新文档</el-button>
      <el-button type="primary" round @click="openDoc()">打开文档</el-button>
      <el-button type="primary" round @click="delDoc()">删除文档</el-button>
      <el-button type="primary" round @click="createDirVisible = true">创建文件夹</el-button>
      <el-dialog title="新建文档" :visible.sync="createVisible" style="text-align: left">
        <el-form :model="createForm">
          <el-form-item label="文档标题" :label-width="formLabelWidth">
            <el-input v-model="createForm.title" autocomplete="off" style="width: 220px"></el-input>
          </el-form-item>
          <el-form-item label="文档模板" :label-width="formLabelWidth">
            <el-select v-model="createForm.type" placeholder="请选择模板">
              <el-option label="空" value="0"></el-option>
              <el-option label="需求规格说明书" value="1"></el-option>
              <el-option label="会议纪要" value="2"></el-option>
              <el-option label="项目计划" value="3"></el-option>
              <el-option label="架构设计说明书" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button type="primary" @click="createDoc()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新建文件夹" :visible.sync="createDirVisible" style="text-align: left">
        <el-form :model="createDirForm">
          <el-form-item label="文件夹名称" :label-width="formLabelWidth">
            <el-input v-model="createDirForm.title" autocomplete="off" style="width: 220px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createDirVisible = false">取 消</el-button>
          <el-button type="primary" @click="createDir()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  components: {
  },

  data() {
    return {
      createVisible: false,
      createDirVisible: false,
      createForm: {
        title: '',
        type: '',
      },
      createDirForm: {
        title: '',
      },
      formLabelWidth: '120px',
      project_id: '83',
      team_id: '48',
    }
  },

  mounted() {
  },

  methods: {
    createDoc() {
      let con = {};
      con['project_id'] = this.project_id;
      con['title'] = this.createForm.title;
      console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/create_document',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        console.log(ret);
        if (ret.data.errno === 0) {
          this.$message.success("创建成功");
          this.$router.push({path:'/teamDoc',query: {room:ret.data.room_name,type:this.createForm.type}});
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("创建失败");
        }
      })
    },
    openDoc() {
      let con = {};
      con['project_id'] = this.project_id;
      con['title'] = '007';
      console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/open_document',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        console.log(ret);
        if (ret.data.errno === 0) {
          this.$message.success("打开成功");
          this.$router.push({path:'/teamDoc',query: {room:ret.data.room_name,type:'0'}});
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("打开失败");
        }
      })
    },

    delDoc() {
      let con = {};
      con['project_id'] = this.project_id;
      con['title'] = '009';
      console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/delete_document',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        console.log(ret);
        if (ret.data.errno === 0) {
          this.$message.success("删除成功");
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("删除失败");
        }
      })
    },

    createDir() {
      let con = {};
      con['team_id'] = this.team_id;
      con['folder_name'] = this.createDirForm.title;
      console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/create_folder',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        console.log(ret);
        if (ret.data.errno === 0) {
          this.$message.success("创建成功");
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("创建失败");
        }
      })
    },

  },
}
</script>

<style lang="scss">

</style>