<template>
  <div class="body-box">
    <div id="topBar-login">
      <div class="webLogo-box">
        <img class="webLogo" src="../assets/ink_black.png" alt=""/>
      </div>
      <div class="logo-font-box">
        <div style="padding-top: 10px;">墨书</div>
      </div>
    </div>
    <div class="main-box">
      <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
        <el-form :rules="registerRules" :model="createUserForm">
          <h2 class="title">注册</h2>
          <el-form-item prop="username">
            <el-input v-model="createUserForm.username" class="form__input" type="text" placeholder="用户名"/>
          </el-form-item>
          <el-form-item prop="password1">
            <el-input v-model="createUserForm.password1" class="form__input" type="password" placeholder="密码" show-password/>
          </el-form-item>
          <el-form-item prop="password2">
            <el-input v-model="createUserForm.password2" class="form__input" type="password" placeholder="再次输入密码" show-password/>
          </el-form-item>
          <el-form-item prop="email">
            <div style="display: flex;">
              <el-input v-model="createUserForm.email" class="form__input" type="text" placeholder="邮箱" style="width: 260px;"/>
              <div class="verify-btn" @click="verify">发送验证码</div>
            </div>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input v-model="createUserForm.verifyCode" class="form__input" type="text" placeholder="验证码"/>
          </el-form-item>
          <el-form-item>
            <div class="primary-btn" @click="register">立即注册</div>
          </el-form-item>
        </el-form>
      </div>
      <div :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]">
        <el-form :rules="loginRules" :model="loginForm">
          <h2 class="title">登录</h2>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" class="form__input" type="text" placeholder="用户名"  />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" class="form__input" type="password" placeholder="密码" show-password/>
          </el-form-item>
          <el-form-item>
            <div class="primary-btn" @click="login">立即登录</div>
          </el-form-item>
        </el-form>
      </div>
      <div :class="['switch', { login: isLogin }]">
        <div class="switch__circle"></div>
        <div class="switch__circle switch__circle_top"></div>
        <div class="switch__container">
          <h2>{{ isLogin ? '期待您的加入' : '欢迎回来' }}</h2>
          <p>
            {{
              isLogin
                  ? '还没有账号？点击下方按钮前往注册'
                  : '已创建过账号？点击下方按钮立即登录'
            }}
          </p>
          <div class="primary-btn" @click="isLogin = !isLogin">
            {{ isLogin ? '立即注册' : '立即登录' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  name: 'LoginBox',
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
      isLogin: false,
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
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}, {validator: checkUsername, trigger: 'blur'}],
        password1: [{required: true, message: '请输入密码', trigger: 'blur'}, {validator: checkNewPwd, trigger: 'blur'}],
        password2: [{required: true, message: '请确认密码', trigger: 'blur'}, {validator: checkNewPwd2, trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
        verifyCode: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
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
          this.isLogin = !this.isLogin;
          this.createUserForm = {
            name: '',
            username: '',
            password1: '',
            password2: '',
            email: '',
            verifyCode: '',
          };
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

<style lang="scss" scoped>
.main-box {
  margin-left: 17%;
  position: relative;
  width: 66%;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;
    form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      color: #a0a5a8;
      .title {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      .text {
        margin-top: 30px;
        margin-bottom: 12px;
      }
      .form__input {
        width: 350px;
        height: 40px;
        margin: 4px 0;
        padding-left: 25px;
        font-size: 13px;
        letter-spacing: 0.15px;
        border: none;
        outline: none;
        // font-family: 'Montserrat', sans-serif;
        background-color: #ecf0f3;
        transition: 0.25s ease;
        border-radius: 8px;
        box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
        &::placeholder {
          color: #a0a5a8;
        }
      }
    }
  }
  .container-register {
    z-index: 100;
    left: calc(100% - 600px);
  }
  .container-login {
    left: calc(100% - 600px);
    z-index: 0;
  }
  .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
  }
  .is-z200 {
    z-index: 200;
    transition: 1.25s;
  }
  .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;
    .switch__circle {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background-color: #ecf0f3;
      box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
      bottom: -60%;
      left: -60%;
      transition: 1.25s;
    }
    .switch__circle_top {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
    .switch__container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: absolute;
      width: 400px;
      padding: 50px 55px;
      transition: 1.25s;
      h2 {
        font-size: 34px;
        font-weight: 700;
        line-height: 3;
        color: #181818;
      }
      p {
        font-size: 14px;
        letter-spacing: 0.25px;
        text-align: center;
        line-height: 1.6;
      }
    }
  }
  .login {
    left: calc(100% - 400px);
    .switch__circle {
      left: 0;
    }
  }
  .primary-btn {
    transition: all 0.3s;
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 25px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    &:hover {
      box-shadow: 4px 4px 6px 0 rgb(255 255 255 / 50%),
      -4px -4px 6px 0 rgb(116 125 136 / 50%),
      inset -4px -4px 6px 0 rgb(255 255 255 / 20%),
      inset 4px 4px 6px 0 rgb(0 0 0 / 40%);
    }
  }
}
.verify-btn{
  cursor: pointer;
  width: 80px;
  padding: 0 5px 0 5px;
  margin-top: 4px;
  margin-left: 10px;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  border-radius: 8px;
  background-color: #ecf0f3;
  box-shadow: 2px 2px 4px #d1d9e6, -2px -2px 4px #f9f9f9;
}
.verify-btn:hover{
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}
.verify-btn:active{
  font-weight: bold;
  background-color: ghostwhite;
}
::v-deep .el-input__inner{
  background-color: #ecf0f3 !important;
  border: none 0 !important;
  padding-left: 0 !important;
  height: 30px !important;
  line-height: 30px !important;
}
.body-box{
  height: 800px;
}
#topBar-login{
  position: relative;
  display: flex;
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
</style>

