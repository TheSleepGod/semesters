<template>
  <div class = "body-box">
    <topBar/>
    <ProjectLeft/>
  </div>
</template>

<script>
import ProjectLeft from "../components/ProjectLeft";
import topBar from "../components/topBar"
export default {
  name: "DC",
  components: {
    ProjectLeft,
    topBar,
  }
}
</script>

<style scoped>
.body-box {
  width: 1708px;
  height: 800px;
  margin-left: -10px;
  margin-top: -10px;
}
</style>