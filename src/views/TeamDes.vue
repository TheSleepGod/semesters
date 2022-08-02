<template>
  <div class = "box-body">
    <!-- 顶部栏（占位-->
    <div style="height: 100px"></div>
    <TeamLeft></TeamLeft>
    <div class = "right-box">
      <div class = "right-head-box">
        <div style="width: 100%;height: 60px">
          <div class = "right-head-name-box">
            <span class = "font-1 right-head-teamName">{{teamMes.teamName}}</span>
          </div>
          <div class = "right-head-identity-box">
            <div class="font-1 right-head-identity-mes" style="width: 40%;height: 100%;display: inline-grid">身份</div>
            <div class="font-1 right-head-identity-mes" id="right-head-identity-mes-idy" style="width: 60%;height: 100%;display: inline-grid">{{ teamMes.myIdentity }}</div>
          </div>
        </div>
        <div class = "right-head-mes-box">
          <span class="font-1 right-head-mes">
            <i class="el-icon-s-grid"></i>
            {{teamMes.teamNumber}}人&nbsp;·&nbsp;{{teamMes.teamWorks}}项目
          </span>
        </div>
      </div>
      <hr style="margin:0;background-color:black;height:1px;border:none; background-image: linear-gradient(to right, #333, #333, #ccc);width: 80%" />
      <div class = "right-people-boxes-container">
        <div class = "right-people-mes-box" v-for="(people,index) in teamPeople" @mouseover="clickCome(people)" @mouseleave="clickLeave(people)">
          <div class = "rpm-left">
            <div>
              <img class = "rpm-left-icon" src="../assets/icon.jpg" alt="">
            </div>
            <div>
              <span class = "font-1 rmp-left-id">TheSleepGod</span>
            </div>
            <img class = "rpm-per-icon" src = "../assets/permissions/Owner.png" v-if = "people.permission === 2"
                 alt="创建者" title="创建者">
            <img class = "rpm-per-icon" src = "../assets/permissions/Manger.png" v-if = "people.permission === 1"
                 alt="管理员" title="管理员">
            <img class = "rpm-per-icon" src = "../assets/permissions/Person.png" v-if = "people.permission === 0"
                 alt="成员" title="成员">
          </div>
          <div class = "rpm-right">
            <ul style="text-align: left; margin-left: -20px; margin-top: 25px">
              <li style="margin-bottom: 10px;">电话: {{people.tel}}</li>
              <li style="margin-bottom: 10px;">邮箱：{{people.email}}</li>
              <li style="margin-bottom: 10px;">真实姓名：{{people.name}}</li>
            </ul>
          </div>
          <div class="rpm-foot" v-if="people.isHover">
            <div class="rpm-del-whole" v-if="people.permission===2" @click="del(people)">解 散</div>
            <div class="rpm-changePer-leftHalf" v-if="people.permission!==2" @click="changePer(people)">修 改 权 限</div>
            <div class="rpm-del-rightHalf" v-if="people.permission!==2" @click="del(people)">删 除</div>
          </div>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
import TeamLeft from '../components/ProjectLeft'
export default {
  name: "TeamDes",
  components: {
    TeamLeft
  },
  data() {
    let teamMes = {
      myIdentity: "管理员",
      teamName: "啊对对队",
      teamNumber: 6,
      teamWorks: 9,
    };
    let teamPeople = [
        {
          tel: "15536833281",
          email: "1634504737@qq.com",
          name: "hhw",
          permission: 1,
          isHover: false,
        },
      {
        tel: "15536833281",
        email: "1634504737@qq.com",
        name: "hhw",
        permission: 0,
        isHover: false,
      },
      {
        tel: "15536833281",
        email: "1634504737@qq.com",
        name: "hhw",
        permission: 2,
        isHover: false,
      },
      {
        tel: "114514",
        email: "11012138@qq.com",
        name: "killer",
        permission: 0,
        isHover: false,
      },
      {
        tel: "214904777899",
        email: "62531122222@qq.com",
        name: "zzx",
        permission: 0,
        isHover: false,
      }
    ]
    let changePerM = -1;
    return {
      teamMes,
      teamPeople,
      changePerM,
    }
  },
  methods: {
    clickCome: function (people) {
      people.isHover = true
    },
    clickLeave: function (people) {
      people.isHover = false
    },
    del: function(people) {
      let r=confirm("确认删除吗");
      if (r===true)
      {
        alert("You pressed OK! del " + people.name);
      }
      else
      {
        alert("You pressed Cancel!");
      }

    },
    changePer:function (people) {
      this.changePerM = people.name;
    }
  },
}
</script>

<style scoped>
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.box-body {
  padding: 0;
  margin-left: -10px;
  margin-top: -10px;
  overflow: hidden;
}
.right-box {
  position: relative;
  padding: 0;
  left: 60px;
}
.right-head-box {
  position: relative;
  height: 100px;
  left: 30px;
}
.right-head-teamName {
  position: relative;
  float: left;
  font-size: 28px;
  text-align: left;
  margin-top: 11px;
}
.right-head-name-box {
  height: 60px;
  max-width: 70%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  float: left;
  /*color: #0997F7;*/
}
.right-head-mes-box {
  height: 40px;
  position: relative;
  float: left;
}
.right-head-mes {
  position: relative;
  float: left;
  margin-top: 10px;
}
.right-head-identity-box {
  position: relative;
  float: left;
  width: 105px;
  height: 25px;
  margin-left: 10px;
  background: darkgrey;
  top:20px;
  text-align: center;
  border-radius: 5px;
  cursor: default;
}
.right-head-identity-mes {
  position: relative;
  color: white;
}
#right-head-identity-mes-idy{
  background-color: darkslateblue;
  font-weight: bold;
  border-radius: 5px;
  float: right;
}
.right-people-boxes-container {
  margin-top: 20px;
  position: relative;
  flex-wrap: wrap;
  display: flex;
}
.right-people-mes-box {
  width: 380px;
  height: 140px;
  position: relative;
  border-radius: 30px;
  box-shadow: 1px 1px 2px 0 darkgrey;
  margin-right: 25px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  transition: all 0.25s;
}
.right-people-mes-box:hover{
  transform: translateY(-5px);
  box-shadow: 2px 2px 5px 1px grey;
}
.rpm-left {
  height: 115px;
  width: 130px;
  position: relative;
  float: left;
}
.rpm-left-icon {
  position: relative;
  width: 61px;
  height: 61px;
  border-radius: 30px;
  margin-top: 25px;
}
.rmp-left-id {
  position: absolute;
  margin-left: -50px;
  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rpm-right {
  width: 250px;
  height: 115px;
  position: absolute;
  margin-left: 130px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rpm-foot{
  position: relative;
  width: 380px;
  height: 25px;
  float: left;
  cursor: pointer;
  color: white;
}
.rpm-del-whole {
  height: 25px;
  background: red;
  position: relative;
  z-index: 10;
  border-radius: 0 0 30px 30px;
  transition: all 0.5s;
}
.rpm-del-whole:hover{
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c, 0 0 35px #00a67c, 0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
}
.rpm-changePer-leftHalf{
  display: inline-block;
  height: 25px;
  width: 50%;
  background: darkslateblue;
  position: relative;
  z-index: 10;
  border-radius: 0 0 0 30px;
  transition: all 0.5s;
}
.rpm-changePer-leftHalf:hover{
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c, 0 0 35px #00a67c, 0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
}
.rpm-del-rightHalf {
  display: inline-block;
  height: 25px;
  width: 50%;
  background: red;
  position: relative;
  z-index: 10;
  border-radius: 0 0 30px 0;
  transition: all 0.25s;
}
.rpm-del-rightHalf:hover{
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c, 0 0 35px #00a67c, 0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
}
.rpm-per-icon {
  height: 30px;
  width: 30px;
  position: relative;
  float: left;
  z-index: 10;
  margin-left: 70px;
  transform: rotate(35deg);
  top: -80px;
  transition: all 0.25s;
}
.right-people-mes-box:hover .rpm-per-icon{
  animation: perIcon-everFloat 2.5s infinite linear;
}
@keyframes perIcon-everFloat {
  0%{transform: translateX(0) translateY(0) rotate(35deg);}
  20%{transform: translateX(-4px) translateY(4px) rotate(35deg);}
  50%{transform: translateX(0) translateY(0) rotate(35deg);}
  75%{transform: translateX(4px) translateY(-4px) rotate(35deg);}
  100%{transform: translateX(0) translateY(0) rotate(35deg);}
}

</style>