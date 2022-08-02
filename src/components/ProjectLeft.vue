<template>
  <div class = "left-box">
      <div class = "left-project-one">
        <img class = "left-project-one-img" src="../assets/TeamDes-project.png" alt="">
        <span class="font-1 left-project-one-mes">项目</span>
      </div>
      <div class = "left-project-one">
        <img class = "left-project-one-img" src="../assets/TeamDes-member.png" alt="">
        <span class="font-1 left-project-one-mes">成员</span>
      </div>
    </div>
</template>

<script>
export default {
  name: "TeamDes"
}
</script>

<style scoped>
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.left-box {
  position: relative;
  float: left;
  top: 100px;
  height: 700px;
  width: 100px;
  padding: 0;
}
.left-project-one {
  width: 100px;
  height: 100px;

}
.left-project-one-img {
  position: relative;
  width: 50px;
  height: 50px;
  top: 10px;
  padding-right: 25px;
  padding-left: 25px;
  padding-bottom: 10px;
}
.left-project-one-mes {
  position: relative;
}
</style>