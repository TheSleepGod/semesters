<template>
  <div>
    <div id="test" class="test-div" contenteditable="true" @click="change()"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contentEditor: {},
    }
  },
  methods: {
    change() {
      let element = document.getElementById('test');
      element.contentEditable = 'true';
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      //TODO: logout
    };
  }
}
</script>

<style>
.test-div{
  background-color: #42b983;
}
</style>