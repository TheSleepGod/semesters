<template>
  <div class="main-box">
    <div :class="['container', 'container-register', { 'is-txl': isLogin }]">
      <div style="">
        <h2 style="margin-bottom: 5%">注册</h2>
        <el-form :model="createUserForm" :rules="registerRules" label-width="120px" label-position="right">
          <el-form-item label="真实姓名" prop="name" style="margin-left: -275px">
            <el-input v-model="createUserForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="username" style="margin-left: -275px">
            <el-input v-model="createUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password1" style="margin-left: -275px">
            <el-input v-model="createUserForm.password1"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="password2" style="margin-left: -275px">
            <el-input v-model="createUserForm.password2"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" style="margin-left: -165px">
            <span style="display: inline-block">
              <el-input v-model="createUserForm.email"></el-input>
              <el-button type="info" @click="verify()" plain>发送验证码</el-button>
            </span>
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode" style="margin-left: -50%">
            <el-input v-model="createUserForm.verifyCode"></el-input>
          </el-form-item>
        </el-form>
        <div class="primary-btn">立即注册</div>
      </div>
    </div>
    <div
        :class="['container', 'container-login', { 'is-txl is-z200': isLogin }]"
    >
      <form>
        <h2 class="title">登录</h2>
        <input class="form__input" type="text" placeholder="用户名" v-model="loginForm.username"/>
        <input class="form__input" type="password" placeholder="密码" v-model="loginForm.password"/>
        <div class="primary-btn">立即登录</div>
      </form>
    </div>
    <div :class="['switch', { login: isLogin }]">
      <div class="switch__circle"></div>
      <div class="switch__circle switch__circle_top"></div>
      <div class="switch__container">
        <h3>{{ isLogin ? '还没有账号？' : '已有一个账号？' }}</h3>
        <p>
          {{
            isLogin
                ? '点击下方按钮去注册'
                : '点击下方按钮去登录'
          }}
        </p>
        <div class="primary-btn" @click="isLogin = !isLogin">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginBox',
  data() {
    return {
      isLogin: '',
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
    }
  },
  methods: {
    login() {},
    register() {},
  },
}
</script>

<style lang="scss" scoped>

.sendVerify {
  border: 2px #DDDDDD solid;
  border-radius: 5px;
  padding: 6px 6px 6px 5px;
  margin-left: 5px;
}

.sendVerify:hover {
  background-color: #EEEEEE;
  cursor: pointer;
}

.main-box {
  position: relative;
  width: 1000px;
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
      .form__input_email {
        width: 250px;
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
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
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
</style>

