<template>
  <div id="all">
    <div id="topBar-login">
      <div class="webLogo-box">
        <img class="webLogo" src="../assets/ink_black.png" alt=""/>
      </div>
      <div class="logo-font-box">
        <div style="padding-top: 10px;">墨书</div>
      </div>
      <div><el-button type="danger" @click="outerVisible = true" style="position: absolute;float: right;right: 10px;top:10px" round>登录/注册</el-button></div>
    </div>
    <div id="main">
      <div class="name">团队项目管理</div>
      <div class="name1">专业一体化平台</div>
      <div class="name2">墨书·让管理更简单</div>
    </div>
    <el-dialog title="登录" :visible.sync="outerVisible" width="600px" height="300px">
      <el-form :model="loginForm" :rules="loginRules" label-width="80px" label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
          title="用户注册"
          width="600px"
          :visible.sync="innerVisible"
          append-to-body>
        <el-form :model="createUserForm" :rules="registerRules" label-width="120px" label-position="right">
          <el-form-item label="真实姓名" prop="name">
            <el-input v-model="createUserForm.name"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input v-model="createUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password1">
            <el-input v-model="createUserForm.password1"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="password2">
            <el-input v-model="createUserForm.password2"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <span><el-input v-model="createUserForm.email" style="width: 328px"></el-input></span>
            <span><el-button type="info" @click="verify()" plain>发送验证码</el-button></span>
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model="createUserForm.verifyCode"></el-input>
          </el-form-item>
        </el-form>
        <!-- 注册弹窗底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="register()">确 定</el-button>
        </span>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-right: 70px" @click="login()">登 录</el-button>
<!--        <el-button @click="outerVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>-->
        <a id="toRegister" @click="innerVisible = true">还未注册？点这里去注册</a>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs"

export default {
  name: "home",
  data() {
    let checkUsername = (rule, value, callback) => {
      let userName = /[_a-zA-Z0-9]{2,12}/;
      if (userName.test(value)) {	//匹配成功返回
        callback();
      }
      callback(new Error("用户名格式：2-12位英文字母、数字或下划线"));
    }
    let checkNewPwd = (rule, value, callback) => {
      let pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$/;
      //如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
      if (!pwdReg.test(value)) {
        callback(new Error("密码长度8-18位，且需同时包含英文和数字"));
      }
      callback();
    }
    let checkNewPwd2 = (rule, value, callback) => {
      if (value !== this.createUserForm.password1) {
        callback(new Error("两次输入密码不一致！"));
      }
      callback();
    }
    let checkEmail = (rule, value, callback) => {
      let mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (mailReg.test(value)) {	//匹配成功返回
        callback();
      }
      callback(new Error("邮箱格式：xx@xx.xx，只含数字、大小写字母、下划线、横杠"));
    };
    return {
      innerVisible: false,
      outerVisible: false,
      loginForm: {
        username: '',
        password: '',
      },
      createUserForm: {
        name: '',
        username: '',
        password1: '',
        password2: '',
        email: '',
        verifyCode: '',
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}, {validator: checkUsername, trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}, {validator: checkNewPwd, trigger: 'blur'}],
      },
      registerRules: {
        name: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}, {validator: checkUsername, trigger: 'blur'}],
        password1: [{required: true, message: '请输入密码', trigger: 'blur'}, {validator: checkNewPwd, trigger: 'blur'}],
        password2: [{required: true, message: '请确认密码', trigger: 'blur'}, {validator: checkNewPwd2, trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
        verifyCode: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
    };
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
        console.log(ret);
        if (ret.data.errno === 0) {
          //console.log(ret.data.data);
          this.$notify.info('已检测到登录信息,即将跳转...')
          setTimeout(()=>{this.$router.push('/team');},2000)
        } else this.$notify.error(ret.data.msg);
        //console.log(this.user_id);
      })
    },
    login: function () {
      let con = {
        username:this.loginForm.username,
        password:this.loginForm.password
      };
      //console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/login',
        method: 'post',
        data: qs.stringify(con),
      }).then((ret) => {
        //console.log(ret);
        if (ret.data.errno === 0) {
          //console.log(ret);
          //console.log(ret.data.data.authorization);
          localStorage.clear();
          localStorage.setItem('Token',ret.data.data.authorization);
          this.$message.success("登录成功");
          console.log("我要跳转啦");
          this.$router.push('/team');
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("登录失败");
        }
      })
    },
    register: function () {
      let con = {};
      con['name'] = this.createUserForm.name;
      con['password_1'] = this.createUserForm.password1;
      con['password_2'] = this.createUserForm.password2;
      con['email'] = this.createUserForm.email;
      con['code'] = this.createUserForm.verifyCode;
      con['username'] = this.createUserForm.username;
      //console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/register',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        if (ret.data.errno === 0) {
          this.$message.success("注册成功");
          this.innerVisible = false;
        } else {
          alert(ret.data.msg);
          this.$message.error("登录失败");
        }
      })
    },
    verify: function () {
      let con = {};
      con['email'] = this.createUserForm.email;
      //console.log(con);
      axios({
        url: 'http://101.42.160.94:8000/api/user_web/check_mail',
        method: 'post',
        data: JSON.stringify(con),
      }).then((ret) => {
        if (ret.data.errno === 0) {
          this.$message.success("发送成功");
        } else {
          this.$notify.error(ret.data.msg);
          this.$message.error("发送失败");
        }
      })
    },
  },
  created() {
    this.getNowUser();
  }
}
</script>

<style scoped>
#topBar-login{
  position: relative;
  display: flex;
  background-color: white;
  height: 70px;
  padding: 0;
}
.webLogo-box{
  float: left;
  height: 70px;
  width: 70px;
}
.webLogo{
  margin-top: 2px;
  height: 60px;
}
.logo-font-box{
  display: table-cell;
  width: 70px;
  font-size: 30px;
}
#main{
  background-image:url('../assets/mainBk.png');
  background-size: 100% 100%;
  background-position: center center;
  width: 100%;
  height: 710px;
  /*background-color: #42b983;*/
}

.name{
  font-size: 50px;
  background-clip: border-box;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 0 0 7px #ffd800;
  background-image: linear-gradient(90deg,#ffd800 0%,#ff512f 100%,#fff);
  animation:glow-animation 2s infinite linear;
  color: #FFC0CB;
  box-sizing: border-box;
  vertical-align: inherit;
  position: relative;
  top: 200px;
  font-family: NSimSun sans-serif;
}
.name1{
  font-family: STHeiTi sans-serif;
  position:relative;
  top:220px;
  font-size: 60px;
}
.name2{
  position:relative;
  top:250px;
  font-size:25px;
  color: #808080;
}
@keyframes glow-animation {
  0%{filter: hue-rotate(360deg)}
  /*25%{filter: hue-rotate(360deg)}*/
  /*50%{filter: hue-rotate(-360deg)}*/
  /*75%{filter: hue-rotate(360deg)}*/
  4000%{filter: hue-rotate(-360deg)}
}

#toRegister{
  color: black;
  text-decoration:underline;
}

#toRegister:hover{
  color: #0997F7;
  cursor:pointer;
}

</style>