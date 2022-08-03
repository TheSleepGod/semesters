<template>
  <div class = "body-box">
    <vue-drag-resize style="" :isActive="true" :isResizable="true"></vue-drag-resize>
  </div>
</template>
<script>

import VueDragResize from 'vue-drag-resize';

export default {
  name: "Home",
  components: {
    VueDragResize,
  },
  mounted(){
    this.test();
  },
  methods: {
    test(){
    }
  }
}
</script>
<style scoped>
.body-box {
  padding: 0;
  width: 1600px;
  height: 800px;
  margin-left: -10px;
  margin-top: -10px;
  overflow: hidden;
  background: #0997F7;
}
</style>
