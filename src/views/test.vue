<template>
  <div>
    <el-button  size="mini" title="生成图片" @click="test()" icon="el-icon-download"></el-button>
  <div style="height: 600px; width: 1000px; border: 1px solid red; position: relative;" ref="imageToFile">
    <vdr :w="100" :h="100" v-on:dragging="onDrag" v-on:resizing="onResize" :parent="true" >
      <p>Hello! I'm a flexible component. You can drag me around and you can resize me.<br>
        X: {{ x }} / Y: {{ y }} - Width: {{ width }} / Height: {{ height }}</p>
    </vdr>
    <div>1111</div>
    <vdr
        :w="200"
        :h="200"
        :parent="true"
        :debug="false"
        :min-width="200"
        :min-height="200"
        :isConflictCheck="true"
        :snap="true"
        :snapTolerance="20"
    >
    </vdr>
  </div>
  </div>
</template>

<script>
import vdr from 'vue-draggable-resizable-gorkys'
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
import html2canvas from "html2canvas";
import qs from "qs";
import axios from "axios";
export default {
  components: {vdr},
  data: function () {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0
    }
  },
  methods: {
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    onDrag: function (x, y) {
      this.x = x
      this.y = y
    },
    // 页面元素转图片
    toImage () {
      // 手动创建一个 canvas 标签
      const canvas = document.createElement("canvas")
      // 获取父标签，意思是这个标签内的 DOM 元素生成图片
      // imageTofile是给截图范围内的父级元素自定义的ref名称
      let canvasBox = this.$refs.imageToFile
      // 获取父级的宽高
      const width = parseInt(window.getComputedStyle(canvasBox).width)
      const height = parseInt(window.getComputedStyle(canvasBox).height)
      // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
      canvas.width = width * 2.5
      canvas.height = height * 2.5
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      const context = canvas.getContext("2d");
      context.scale(2, 2);
      const options = {
        backgroundColor: null,
        canvas: canvas,
        useCORS: true
      }
      html2canvas(canvasBox, options).then((canvas) => {
        // toDataURL 图片格式转成 base64
        let dataURL = canvas.toDataURL("image/png")
        console.log(dataURL)
        this.downloadImage(dataURL)
      })
    },
    //下载图片
    downloadImage(url) {
      // 如果是在网页中可以直接创建一个 a 标签直接下载
      let a = document.createElement('a')
      a.href = url
      a.download = '首页截图'
      a.click()
    },
    login: function () {
      axios({
        url: '/user_web/login',
        method: 'post',
        params: {
          'username': 1,
          'password': 1,
        }
      }).then((ret) => {
        if (ret.data.errno === 0) {
          this.$message.success("登录成功");
          this.$router.push('/team');
        } else {
          alert(ret.data.msg);
          this.$message.error("登录失败");
        }
      })
    },
    test: function () {
      // let params = {
      //   user_id: 0,
      //   project_name: "test",
      //   team_id: 1,
      // };
      // this.$axios
      //     .post("/user/newproject", qs.stringify(params))
      //     .then((res) => {
      //       console.log(res);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      let params = {
        user_id: 1,
        project_name: 1,
        team_id: 1,
      };
      this.$axios
          .post("http://43.138.22.20:8000/api/user/newproject", qs.stringify(params))
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
}
</script>