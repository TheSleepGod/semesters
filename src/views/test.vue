<template>
  <div class="my_draggle">
    <div class="md_title">使用vuedraggable实现从左到右拖拽</div>

    <div class="md_con">
      <draggable
          class="mdc_left"
          v-model="originDataArr"
          v-bind="{sort: false}"
          v-bind:group="{ name:"person", pull:"clone", put:false }"
      v-bind:clone="cloneItem">

      <div v-for="(item,index) in originDataArr" v-bind:key="index">
        <span>{{item.name}}</span>&nbsp;&nbsp;
        <span>{{item.sex}}</span>
      </div>

      </draggable>

      <draggable
          class="mdc_right"
          v-model="newDataArr"
          v-bind:group="{name:"person"}"
      v-on:start="dragItem"
      v-on:add="addItem">
      <div v-for="(item,index) in newDataArr" v-bind:key="index">
        <span><img v-bind:src="item.icon" /></span>&nbsp;&nbsp;
        <span>{{item.name}}</span>&nbsp;&nbsp;
        <span>{{item.sex}}</span>
      </div>
      </draggable>
    </div>
  </div>
</template>

<script>

import draggable from "vuedraggable"

export default {
  name: "MyDraggle",
  components:{
    draggable
  },
  props: {
    msg: String
  },
  data: function(){
    return{
      originDataArr: new Array(),
      newDataArr: new Array()
    }
  },

  mounted: function(){
    this.initData();
  },

  methods: {
    initData: function(){
      this.originDataArr = [
        {name:"张三", age: 15, sex: "男", icon: require("@/assets/logo.png")},
        {name:"李四", age: 15, sex: "男", icon: require("@/assets/logo.png")},
        {name:"王五", age: 15, sex: "男", icon: require("@/assets/logo.png")},
        {name:"小花", age: 15, sex: "女", icon: require("@/assets/logo.png")}
      ]
    },

    cloneItem: function(val){
      // 深复制一个节点
      return JSON.parse(JSON.stringify(val))
    },

    dragItem: function(widget){
      console.log(widget);
    },

    addItem: function(widget){
      console.log(widget);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.my_draggle{
  position: relative;
}

.md_title{
  font-size: 24px;
  height: 60px;
}

.md_con>div{
  width: 600px;
  height: 600px;
  display: inline-block;
  border: 1px solid #CCCCCC;
  border-radius: 10px;
  vertical-align: top;
}

.mdc_left>div{
  height: 40px;
  line-height: 40px;
  margin-top: 6px;
  border: 1px solid #CCCCCC;
  cursor: move;
  margin: 10px 20px;
}

.mdc_left>div:hover{
  box-shadow: 1px 2px 4px #CCCCCC;
}

.mdc_right>div{
  height: 40px;
  line-height: 40px;
  margin-top: 6px;
  border: 1px solid #CCCCCC;
  cursor: move;
  margin: 10px 20px;
}

.mdc_right>div:hover{
  box-shadow: 1px 2px 4px #CCCCCC;
}

.mdc_right>div>span{
  display: inline-block;
  vertical-align: top;
}

.mdc_right>div>span>img{
  height: 30px;
}

</style>