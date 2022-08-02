<draggable v-model="fileList" @update="fileDragEnd" v-bind="dragOptions">
<transition-group tag="ul"  class="fileList">
  <li v-for="(item,ins) in fileList" :key="ins"></li>
</transition-group>
</draggable>
<script>
import draggable from 'vuedraggable'
export default({
  name:'drag',
  data () {
    return {
      fileList: [],
      dragOptions: { forceFallback: true, animation: 100, sort: false }
    }
  },
  components: {
    draggable
  },
  methods:{
    fileDragEnd (evt) {
      console.log(evt)
      //evt.item //可以知道拖动的本身
      //evt.to    // 可以知道拖动的目标列表
      //evt.from  // 可以知道之前的列表
      //evt.oldIndex  // 可以知道拖动前的位置
      //evt.newIndex  // 可以知道拖动后的位置
    }
  }
})

</script>

<style lang="less">
.test-left {
  float: left;
  width: 300px;
}
.test-right {
  float: left;
  margin-left: 20px;
  width: 300px;
}
.test-right > div {
  min-height: 80px; /*为了防止右侧开始没有内容时不可以拖动*/
}
.item {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #f2f2f2;
  margin-bottom: 12px;
}

.ghostL {
  opacity: 0.5;
  width: 230px;
}
.ghostR {
  opacity: 0;
  width: 230px;
}
</style>
