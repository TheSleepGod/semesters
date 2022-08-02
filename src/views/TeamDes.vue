<template>
  <div class = "box-body">
    <TeamLeft></TeamLeft>
    <div class = "right-box">
      <div class = "right-head-box">
        <div class = "right-head-name-box">
          <span class = "font-1 right-head-teamName">{{teamMes.teamName}}</span>
        </div>
        <div class = "right-head-mes-box">
          <img class = "right-head-mes-img" src="../assets/Team-group.png" alt="">
          <span class="font-1 right-head-mes">{{teamMes.teamNumber}}人&nbsp;·&nbsp;{{teamMes.teamWorks}}项目</span>
        </div>
        <div class = "right-head-pos-box">
          <span class="font-1 right-head-pos-mes">管理员</span>
        </div>  
      </div>
      <hr style="margin:0;background-color:black;height:1px;border:none; background-image: linear-gradient(to right, #333, #333, #ccc);width: 80%" />
      <div class = "right-people-mes">
        <div class = "right-people-mes-box" v-for="(people,index) in teamPeople" @mouseover="clickCome(index)" @mouseleave="clickLeave(index)">
          <div class = "rpm-left">
            <img class = "rpm-left-icon" src="../assets/icon.jpg" alt="">
            <span class = "font-1 rmp-left-id">TheSleepGod</span>
            <img class = "rpm-name-per" src = "../assets/permissions/Owner.png" v-if = "people.permission === 2" 
                 alt="创建者" title="创建者">
            <img class = "rpm-name-per" src = "../assets/permissions/Manger.png" v-if = "people.permission === 1" 
                 alt="管理员" title="管理员">
            <img class = "rpm-name-per" src = "../assets/permissions/Person.png" v-if = "people.permission === 0" 
                 alt="成员" title="成员">
          </div>
          <div class = "rpm-right" >
            <ul style="text-align: left; margin-top: 22px; margin-left: -20px">
              <li style="margin-bottom: 10px;">电话: {{people.tel}}</li>
              <li style="margin-bottom: 10px;">邮箱：{{people.email}}</li>
              <li style="margin-bottom: 10px;">真实姓名：{{people.name}}</li>
            </ul>
          </div>
          <div class = "rpm-del" style="display: none" :id = index @click="del(index)">
            <span style="position: relative;float: left; top: 4px; left: 175px">删除</span>
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
      teamName: "睡觉",
      teamNumber: 6,
      teamWorks: 9,
    };
    let teamPeople = [
        {
          tel: "15536833281",
          email: "1634504737@qq.com",
          name: "hhw",
          permission: 1,
        },
      {
        tel: "15536833281",
        email: "1634504737@qq.com",
        name: "hhw",
        permission: 0,
      },
      {
        tel: "15536833281",
        email: "1634504737@qq.com",
        name: "hhw",
        permission: 2,
      },
      {
        tel: "114514",
        email: "11012138@qq.com",
        name: "killer",
        permission: 0,
      },
      {
        tel: "214904777899",
        email: "62531122222@qq.com",
        name: "zzx",
        permission: 0,
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
    clickCome: function (id) {
      document.getElementById(id).style.display = "inline";
    },
    clickLeave: function (id) {
      document.getElementById(id).style.display = "none";
    },
    del: function(id) {
      let r=confirm("确认删除吗");
      if (r===true)
      {
        alert("You pressed OK!" + id);
      }
      else
      {
        alert("You pressed Cancel!");
      }

    },
    changePer:function (id) {
      this.changePerM = id;
    }
  },
}
</script>

<style scoped>
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.box-body {
  height: 800px;
  width: 1708px;
  padding: 0;
  margin-left: -10px;
  margin-top: -10px;
  overflow: hidden;
}
.right-box {
  position: relative;
  width: 1608px;
  height: 700px;
  padding: 0;
  top: 100px;
  left: 100px;
}
.right-head-box {
  position: relative;
  width: 1608px;
  height: 130px;
  left: 30px;
}
.right-head-teamName {
  position: relative;
  float: left;
  font-size: 26px;
  text-align: left;
  margin-top: 20px;
}
.right-head-name-box {
  height: 60px;
  width: 500px;
  position: relative;
  float: left;
  left: 15px;
  color: #0997F7;
}
.right-head-mes-box {
  height: 60px;
  width: 500px;
  position: relative;
  top: 60px;
  left: -500px;
  float: left;
}
.right-head-mes-img {
  height: 25px;
  width: 25px;
  position: relative;
  float: left;
  left:10px;
  top: 25px;
}
.right-head-mes {
  position: relative;
  float: left;
  top: 25px;
  left: 20px;
}
.right-head-pos-box {
  position: relative;
  float: left;
  width: 120px;
  height: 45px;
  background: #42b983;
  top:20px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid #333333;
}
.right-head-pos-mes {
  position: relative;
  top: 10px
}
.right-people-mes {
  position: relative;
  float: left;
  height: 600px;
  width: 1408px;
}
.right-people-mes-box {
  width: 400px;
  height: 150px;
  position: relative;
  float: left;
  border-radius: 30px;
  border: 1px solid lightskyblue;
  margin-left: 30px;
  margin-top: 30px;
  caret-color: transparent;
}
.rpm-left {
  height: 130px;
  width: 100px;
  position: relative;
  float: left;
  margin-bottom: -50px;
}
.rpm-left-icon {
  position: relative;
  width: 61px;
  height: 61px;
  border-radius: 30px;
  top: 20px;
  left: 10px;
}
.rmp-left-id {
  position: relative;
  top: 30px;
  left: 10px;
  font-size: 16px;
}
.rpm-right {
  width: 250px;
  height: 130px;
  position: relative;
  float: left;
  left: 50px;
  margin-bottom: -50px;
}
.rpm-del {
  height: 30px;
  width: 400px;
  background: #0997F7;
  position: relative;
  top: 40px;
  float: left;
  z-index: 10;
  border-radius: 0 0 30px 30px;
  cursor:pointer;
}
.rpm-name-per {
  height: 30px;
  width: 30px;
  position: relative;
  float: left;
  z-index: 10;
  margin-left: 70px;
  transform: rotate(45deg);
  top: -80px;
}
</style>