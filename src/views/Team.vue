<template>
  <div class="box-body">
    <div id = "head">
      <div class = "icon-box">
        <img class = "icon-head" src="../assets/icon.jpg" alt="">
      </div>
    </div>
    <div class="left">
      <div class = "left-head-box">
        <img class = "left-head" src="../assets/icon.jpg" alt="">
      </div>
      <div class = "left-message-box">
        <div class = "left-id-box">
          <span class = "font-1 font-id">TheSleepGod</span>
        </div>
        <div class="font-1 left-mes-button-box">
          <button class = "btn">编辑资料</button>
        </div>
        <div class= "left-mes-box">
          <img class="left-mes-group-img" src="../assets/Team-group.png" alt="">
          <span class="font-1 font-mes">3teams&nbsp·&nbsp4projects</span>        
        </div>  
      </div>  
    </div>
    <div class = "right">
      <div class = "right-head-box">
        <div class = "right-head">
          <div id = "create" class = "right-head-mes">
            <div @click = "create" class = "right-head-click">
              <img class = "right-head-mes-img" src = "../assets/Team-group-second.png" alt="">
              <span class = "font-1 right-head-mes-tab">Created</span>
            </div> 
          </div>
          <div id = "add" class = "right-head-mes">
            <div @click = "add" class = "right-head-click">
              <img class = "right-head-mes-img" src = "../assets/Team-group-second.png" alt="">
              <span class = "font-1 right-head-mes-tab">Added</span>
            </div>
          </div>
        </div>
        <hr style="margin:0;background-color:black;height:1px;border:none; background-image: linear-gradient(to right, #333, #333, #ccc);width: 80%" />
      </div>  
      <div class = "right-mes-box">
        <div class = "right-team-mes" :id = index v-for="(myTeam,index) in allTeam" @mouseover="clickCome(index)" @mouseleave="clickLeave(index)">
          <div class = "right-team-name">
            <span class="font-1 right-team-name-font">{{ myTeam.teamName }}</span>
          </div>
          <div class = "right-team-number">
            <span class="font-1">{{ myTeam.teamNumber }}人&nbsp;&nbsp;</span>
            <span class="font-1">{{ myTeam.teamTime }}</span>
          </div>  
        </div>
      </div>  
    </div>  
  </div>  
</template>

<script>
export default {
  name: "Team",
  data() {
    let createTeam = [
      {
      id: 1,  
      teamName: "TheSleepGod",
      teamNumber: "3",
      teamTime: "2022-05-02"
      },
      {
        id: 2,
        teamName: "TheAwakeHome",
        teamNumber: "4",
        teamTime: "2022-05-01"
      },
      {
        id: 3,
        teamName: "TheLDS",
        teamNumber: "1",
        teamTime: "2022-05-03"
      }
    ];
    let addTeam = [
      {
        id: 1,
        teamName: "TheASD",
        teamNumber: "3",
        teamTime: "2022-05-02"
      },
      {
        id: 2,
        teamName: "TheAwakeHome",
        teamNumber: "4",
        teamTime: "2022-05-01"
      },
      {
        id: 3,
        teamName: "TheYuanShen",
        teamNumber: "1",
        teamTime: "2022-05-03"
      }
    ];
    let allTeam = createTeam;

    return {
      createTeam,
      addTeam,
      allTeam,
    }
  },
  methods: {
    create: function() {
      this.allTeam = this.createTeam;
      document.getElementById("create").style.borderBottom = "3px solid coral";
      document.getElementById("add").style.borderBottom = "0px solid white";
    },
    add: function() {
      this.allTeam = this.addTeam;
      document.getElementById("add").style.borderBottom = "3px solid coral";
      document.getElementById("create").style.borderBottom = "0px solid white";
    },
    clickCome: function (id) {
      document.getElementById(id).style.border = "2px solid lightskyblue";
      document.getElementById(id).style.color = "white";
    },
    clickLeave: function (id) {
      document.getElementById(id).style.border = "0px solid lightskyblue";
      document.getElementById(id).style.color = "lightsteelblue";
    }
  },
  mounted() {
    this.create();
  }
}
</script>

<style scoped>
.box-body {
  height: 800px;
  width: 1708px;
  padding: 0;
  margin-left: -10px;
  margin-top: -10px;
  overflow: hidden;

}
#head {
  height: 100px;
  width: 100%;
}

.icon-box {
  position: relative;
  float: right;
  height: 70px;
  width: 70px;
  top: 15px;
  right: 15px;
}
.icon-head {
  position: relative;
  float: right;
  height: 70px;
  width: 70px;
  border-radius: 35px;
}
.left {
  position: relative;
  float: left;
  width: 350px;
  height: 700px;

}
.left-head-box {
  position: relative;
  height: 325px;  
  width: 350px;
}
.left-head {
  position: relative;
  height: 300px;
  width: 300px;
  margin-top: 25px;
  border-radius: 150px;
  left: 10px;
}
.left-id-box {
  height: 40px;
  width: 100%;
}
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.font-id {
  position: relative;
  float: left;
  left: 35px;
  font-size: 26px;
  line-height: 1.5;
  caret-color: transparent;
}
.font-mes {
  position: relative;
  float: left;
  left: 35px;
  top:5px;
  font-size: 20px;
  line-height: 1.5;
}
.left-mes-box {
  height: 40px;
  width: 100%;
}
.left-mes-button-box {
  display: block;
  height: 50px;
  width: 100%;
  text-align: center;
}
.btn {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  height: 50px;
  width: 300px;
  position: relative;
  float: left;
  left: 30px;
  color: black;
  border-top-color: lightgoldenrodyellow;
  border-right-color: lightgoldenrodyellow;
  border-bottom-color: lightgoldenrodyellow;
  border-left-color: lightgoldenrodyellow;
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color,background-color;
}
.left-mes-group-img {
  height: 25px;
  width: 25px;
  position: relative;
  float: left;
  left: 30px;
  top: 10px
}
.right {
  position: relative;
  float: left;
  height: 700px;
  width: 1358px;

}
.right-head-box {
  height: 100px;
}
.right-head {
  height: 103px;
  display: flex;
}
.right-head-mes {
  height: 70px;
  width: 175px;
  position: relative;
  float: left;
  top: 30px;
  left: 50px;
}

.right-head-mes-img {
  height: 40px;
  width: 40px;
  position: relative;
  float: left;
  top:10px;
  left: 10px;
}
.right-head-mes-tab {
  height: 20px;
  width: 150px;
  position: relative;
  margin-left: 5px;
  font-size: 26px;
  top: 10px;
  text-align: left;
}
.right-head-click {
  cursor: pointer;
  caret-color: transparent;
  height: 50px;
  width: 170px;
  position: relative;
  top:10px;
  border-radius: 10px;
}
.right-head-click:hover {
  background: #cccccc;
}
.right-mes-box {
  position: relative;
  float: left;
  width: 1358px;
  height: 700px;
  caret-color: transparent;
}
.right-team-mes{
  width: 400px;
  height: 150px;
  position: relative;
  float: left;
  margin-top: 50px;
  margin-left: 40px;
  border-radius: 10px;
  border: 1px solid black;
  background-image: url("../assets/icon.jpg");
  background-position: center center;
}
.right-team-name {
  position: relative;
  float: left;
  width: 200px;
  height: 30px;
  left: 40px;
  top: 30px;
  text-align: left;
}
.right-team-name-font {
  font-size: 20px;
  text-align: left;
}
.right-team-number {
  position: relative;
  float: left;
  width: 180px;
  height: 30px;
  left: -190px;
  top: 80px;
}
</style>






