<!-- drag-test -->
<template>
  <div class="drag-test" style="margin-top: 50px" contenteditable="false">
    <div class="controls-list" contenteditable="false">
      <div style="display: inline-grid;margin-left: 25px;margin-top:15px;margin-bottom: 15px;font-size: 20px">组件栏</div>
      <div style="display: inline-grid;float: right;margin-top: 15px">
        <el-button  size="mini" title="生成图片" circle @click="toImage()" icon="el-icon-download"/>
        <el-button  size="mini" title="保存" circle @click="saveState()" icon="el-icon-download"/>
      </div>
      <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          figure 图形
        </template>
        <div id="figure" style="overflow-y: scroll;width: 220px;height: 200px;" contenteditable="false">
        <div
            :class="commonClassName"
            @click="addControl(1)"
            class="controls-item controls-text"
        >
          <img src="../assets/rectangle.png" alt="">
          <p class="icon-name">矩形</p>
        </div>
        <div
            :class="commonClassName"
            @click="addControl(6)"
            class="controls-item controls-text"
        >
          <img src="../assets/round-rectangle.png" alt="">
          <p class="icon-name">圆角矩形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-text"
            @click="addControl(7)"
        >
          <img src="../assets/triangle.png" alt="">
          <p class="icon-name">三角形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(8)"
        >
          <img src="../assets/circle.png" alt="">
          <p class="icon-name">圆形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/line.png" alt="">
          <p class="icon-name">直线</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/rhombus.png" alt="">
          <p class="icon-name">菱形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/hexagon.png" alt="">
          <p class="icon-name">六边形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/octagon.png" alt="">
          <p class="icon-name">八边形</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/cube.png" alt="">
          <p class="icon-name">正方体</p>
        </div>
        <div
            :class="commonClassName"
            class="controls-item controls-select"
            @click="addControl(3)"
        >
          <img src="../assets/black-triangle.png" alt="">
          <p class="icon-name">实心三角箭头</p>
        </div>
        </div>
      </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            icon 图标
          </template>
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                &nbsp &nbsp website 网站
              </template>
              <div id="icon-website" style="overflow-y: scroll;width: 220px;height: 200px;">
                <div
                    :class="commonClassName"
                    @click="addControl(1)"
                    class="controls-item controls-text"
                >
                  <img src="../assets/ok.png" alt="">
                  <p class="icon-name">确定</p>
                </div>
                <div
                    :class="commonClassName"
                    @click="addControl(1)"
                    class="controls-item controls-text"
                >
                  <img src="../assets/cancel.png" alt="">
                  <p class="icon-name">取消</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-date"
                    @click="addControl(2)"
                >
                  <img src="../assets/correct.png" alt="">
                  <p class="icon-name">勾</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-date"
                    @click="addControl(2)"
                >
                  <img src="../assets/error.png" alt="">
                  <p class="icon-name">叉</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/plus.png" alt="">
                  <p class="icon-name">添加</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/share.png" alt="">
                  <p class="icon-name">分享</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/edit.png" alt="">
                  <p class="icon-name">编辑</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/trash.png" alt="">
                  <p class="icon-name">删除</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/refresh.png" alt="">
                  <p class="icon-name">刷新</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/setting.png" alt="">
                  <p class="icon-name">设置</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/clock.png" alt="">
                  <p class="icon-name">时钟</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/about.png" alt="">
                  <p class="icon-name">关于</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/menu.png" alt="">
                  <p class="icon-name">菜单</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/home.png" alt="">
                  <p class="icon-name">家</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/info.png" alt="">
                  <p class="icon-name">信息</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/search.png" alt="">
                  <p class="icon-name">搜索</p>
                </div>
                </div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                &nbsp &nbsp project 项目
              </template>
              <div id="icon-project" style="overflow-y: scroll;width: 220px;height: 200px;">
                <div
                    :class="commonClassName"
                    @click="addControl(1)"
                    class="controls-item controls-text"
                >
                  <img src="../assets/document.png" alt="">
                  <p class="icon-name">文档</p>
                </div>
                <div
                    :class="commonClassName"
                    @click="addControl(1)"
                    class="controls-item controls-text"
                >
                  <img src="../assets/file.png" alt="">
                  <p class="icon-name">文件</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-date"
                    @click="addControl(2)"
                >
                  <img src="../assets/directory.png" alt="">
                  <p class="icon-name">文件夹</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/unlock.png" alt="">
                  <p class="icon-name">解锁</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/lock.png" alt="">
                  <p class="icon-name">锁定</p>
                </div>
                <div
                    :class="commonClassName"
                    class="controls-item controls-select"
                    @click="addControl(3)"
                >
                  <img src="../assets/unavailable.png" alt="">
                  <p class="icon-name">禁止</p>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            diagram 图表
          </template>
          <div id="diagram" style="overflow-y: scroll;width: 220px;height: 300px;">
            <div
                :class="commonClassName"
                @click="addControl(1)"
                class="controls-item controls-text"
            >
              <img src="../assets/bar-diagram.png" alt="">
              <p class="icon-name">条形图</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-date"
                @click="addControl(2)"
            >
              <img src="../assets/line-diagram.png" alt="">
              <p class="icon-name">折线图</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-select"
                @click="addControl(3)"
            >
              <img src="../assets/area-diagram.png" alt="">
              <p class="icon-name">面积图</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-select"
                @click="addControl(3)"
            >
              <img src="../assets/tree-diagram.png" alt="">
              <p class="icon-name">树状图</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-select"
                @click="addControl(3)"
            >
              <img src="../assets/pie-diagram.png" alt="">
              <p class="icon-name">饼状图</p>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            Media 多媒体
          </template>
          <div id="media" style="overflow-y: scroll;width: 220px;height: 300px;">
            <div
                :class="commonClassName"
                class="controls-item controls-date"
                @click="addControl(2)"
            >
              <img src="../assets/picture.png" alt="">
              <p class="icon-name">图片</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-date"
                @click="addControl(2)"
            >
              <img src="../assets/music.png" alt="">
              <p class="icon-name">音乐</p>
            </div>
            <div
                :class="commonClassName"
                class="controls-item controls-select"
                @click="addControl(3)"
            >
              <img src="../assets/video.png" alt="">
              <p class="icon-name">视频</p>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="drag-wrap"  ref="imageToFile">
      <vue-draggable-resizable
          v-for="(item, index) in controlsArr"
          :id = index
          :key="item.customId"
          :ref="item.customId"
          :custom-id="item.customId"
          :h="item.fontsSize | filterFonstSizeToHeight(item)"
          :minWidth="200"
          :w="item.width"
          :parentH="600"
          :parentW="800"
          :parent="true"
          :common-class-name="commonClassName"
          :class-name="item.type | filterAccordingToType"
          :class-name-active="activedClass"
          :handles="item.type | filterAccordingToType('handles')"
          :x="item.x"
          :y="item.y"
          :isActive="true"
          :isResizable="true"
          @resizestop="onResizstop"
          @dragstop="onDragstop"
          @activated="onActivated"
          @clicked="clickHandle"
      >
        <div :class="commonClassName" class="inner-container" v-if = "false">
          {{ filterSignatory(item.signatory)
          }}<span class="name">({{ item.name }})</span>
        </div>
        <i
            class="close el-icon-error"
            @click="removeControl(item.customId)"
            v-if="activedId === item.customId"
        ></i>
        <div class="seal-inner" :class="commonClassName">
          <div class="seal" :class="commonClassName"></div>
        </div>
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from '@/components/vue-draggable-resizable';
import { findIndex, find } from 'lodash';
import { wordFontSizeToPx } from '@/utils';
import html2canvas from "html2canvas";
export default {
  components: { VueDraggableResizable },
  data() {
    return {
      activedId: '', // 编辑实例的id
      activedType: '', // 编辑实例的类型
      commonClassName: 'target', // 确保点击其它非控件元素时，已激活的控件不失去焦点,作为单选高亮判定标准
      activedClass: 'lq-active-class',
      controlsArr: [
        // 所有控件数组
      ],
      fontSizeOptions: [
        {
          label: '初号',
          value: 0
        },
        {
          label: '小初',
          value: 1
        },
        {
          label: '一号',
          value: 2
        },
        {
          label: '小一',
          value: 3
        },
        {
          label: '二号',
          value: 4
        },
        {
          label: '小二',
          value: 5
        },
        {
          label: '三号',
          value: 6
        },
        {
          label: '小三',
          value: 7
        },
        {
          label: '四号',
          value: 8
        },
        {
          label: '小四',
          value: 9
        },
        {
          label: '五号',
          value: 10
        },
        {
          label: '小五',
          value: 11
        }
      ],
      signatoryOptions: [],
      textVal: '',
      fontSizeValue: 10, // 默认5号 14px
      signatory: 0, // 默认甲方
      minLeft: 100, // 添加控件时拖拽的左边界
      controlTxtPos: {
        x: 60,
        y: 0
      }
    };
  },
  filters: {
    filterAccordingToType(controlsType, type) {
      let className = '';
      let handles = [];
      switch (controlsType) {
        case 'text':
          className = 'lq-draggable-text';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'seal':
          className = 'lq-draggable-seal';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'sign':
          className = 'lq-draggable-sign';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'date':
          className = 'lq-draggable-date';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'select':
          className = 'lq-draggable-select';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'rr':
          className = 'lq-draggable-rr';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'tri':
          className = 'lq-draggable-tri';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;
        case 'rotundity':
          className = 'lq-draggable-rot';
          handles = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
          break;  
        default:
          break;
      }
      if (type && type === 'handles') {
        return handles;
      } else {
        return className;
      }
    },
    filterFonstSizeToHeight(fontSize, item) {
      if (item.type === 'sign' || item.type === 'seal') {
        // 印章和签名固定高度
        return item.height;
      }
      return wordFontSizeToPx(fontSize) + 10; // 上下5px padding
    }
  },
  computed: {
    filterSignatory() {
      return function(signatory) {
        let findItem = find(this.signatoryOptions, o => {
          return signatory === o.value;
        });
        return findItem.label;
      };
    }
  },
  created() {
    this.signatoryOptions = [
      {
        label: '甲方',
        value: 0
      },
      {
        label: '乙方',
        value: 1
      },
      {
        label: '丙方',
        value: 2
      }
    ];
  },
  mounted() {
    this.getDomData();
  },
  //方法集合
  methods: {
    // 计算距离
    getDomData() {
      //本来用于计算控制组件的距离，但是我们只有一个控制组件就是那个大框，所以没什么用（
      // let domCtrList = document.getElementsByClassName(
      //     'controls-list'
      // )[0];
      let domFile = document.getElementsByClassName('drag-wrap')[0];
      //console.log(domFile.offsetLeft);
      //console.log(domCtrList);
      this.minLeft = domFile.offsetLeft;
    },
    //设计用于将文本直接拖拽至指定地点时，在该位置产生一个新的文本框，但由于错误的minLeft导致该功能会产生额外的文本框
    onTextDragStop(left, top) {
      console.log(left, top);
      if (left >= this.minLeft) {
        // 拖拽控件到了文件区域
        this.addControl(1, left - this.minLeft, top);
      }
      //this.$refs.textControl.setPosByHands(left, top);
      console.log(this.controlTxtPos);
    },
    // 点击控件
    onActivated(customId) {
      // console.log(customId);
      // 点击 赋值
      this.activedId && this.setVal(this.textVal);
      this.activedId = customId;
      let editIndex = this.getEditIndex();
      this.activedType = this.controlsArr[editIndex].type;
      this.textVal = this.controlsArr[editIndex].name; // 设置文本名称
      this.signatory = this.controlsArr[editIndex].signatory; // 设置签署方
      // 设置签字号
      if (['text', 'date', 'select'].includes(this.activedType)) {
        this.fontSizeValue = this.controlsArr[editIndex].fontsSize;
      } else {
        this.fontSizeValue = 10;
      }
    },
    // 缩放结束
    onResizstop(left, top, width, height, customId) {
      // console.log(left, top, width, height, customId);
    },
    // 拖动结束
    onDragstop(left, top, customId) {
      // console.log(left, top, customId);
    },
    // 文本编辑完成
    // textChange(val) {
    //   this.setVal(val);
    // },
    setVal(val) {
      let editIndex = this.getEditIndex();
      this.controlsArr[editIndex].name = val;
    },
    // 选择字体
    // selectFontsize(fontsSize) {
    //   let editIndex = this.getEditIndex();
    //   this.controlsArr[editIndex].fontsSize = fontsSize;
    // },
    // 选择签署方
    // selectSignatory(signatory) {
    //   let editIndex = this.getEditIndex();
    //   this.controlsArr[editIndex].signatory = signatory;
    // },
    // 获取当前编辑控件的索引Index
    getEditIndex() {
      return findIndex(this.controlsArr, o => {
        return o.customId === this.activedId;
      });
    },
    // 添加控件
    addControl(type, x, y) {
      const controlObjMap = {
        1: {
          customId: Date.now(),
          width: 200,
          height: 30,
          x: x,
          y: y,
          className: 'lq-draggable-text',
          type: 'text', // 控件类型
          handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
          name: '文本框',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        },
        2: {
          customId: Date.now(),
          width: 80,
          height: 80,
          x: 0,
          y: 140,
          type: 'seal', // 控件类型
          name: '印章',
          signatory: 0 // 签署方默认甲方
        },
        3: {
          customId: Date.now(),
          width: 80,
          height: 40,
          x: 0,
          y: 260,
          type: 'sign', // 控件类型
          name: '签名',
          signatory: 0 // 签署方默认甲方
        },
        4: {
          customId: Date.now(),
          width: 80,
          height: 30,
          x: 0,
          y: 380,
          type: 'date', // 控件类型
          name: '日期',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        },
        5: {
          customId: Date.now(),
          width: 80,
          height: 30,
          x: 200,
          y: 380,
          type: 'select', // 控件类型
          name: '选项',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        },
        6: {
          customId: Date.now(),
          width: 80,
          height: 30,
          x: 200,
          y: 380,
          type: 'rr', // 控件类型 圆角矩形
          name: '圆角矩形',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        },
        7: {
          customId: Date.now(),
          width: 80,
          height: 80,
          x: 200,
          y: 380,
          type: 'tri', // 控件类型 圆角矩形
          name: '三角形',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        },
        8: {
          customId: Date.now(),
          width: 80,
          height: 30,
          x: 200,
          y: 380,
          type: 'rot', // 控件类型 圆角矩形
          name: '圆形',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        }
      };
      this.controlsArr.push(controlObjMap[type]);
      this.setControlActive(controlObjMap[type].customId);
    },
    // 手动设置刚才添加的控件为选中状态
    saveState() {
      console.log(this.controlsArr);
    },
    setControlActive(customId) {
      this.$nextTick(() => {
        // console.log(this.$refs[customId][0]);
        this.$refs[customId][0].elementDown();
      });
    },
    removeControl(customId) {
      let editIndex = findIndex(this.controlsArr, o => {
        return o.customId === customId;
      });
      this.controlsArr.splice(editIndex, 1);
      this.activedId = '';
      this.activedType = '';
      this.textVal = '文本'; // 设置文本名称
      this.signatory = 0; // 设置签署方
      this.fontSizeValue = 10;
    },
    toImage () {
      // 手动创建一个 canvas 标签
      const canvas = document.createElement("canvas");
      // 获取父标签，意思是这个标签内的 DOM 元素生成图片
      // imagefile是给截图范围内的父级元素自定义的ref名称
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
        //console.log(dataURL)
        console.log("图片格式转化成功")
        this.downloadImage(dataURL)
      })
    },
    clickHandle(e){
      e.target.focus()
    },
    downloadImage(url) {
      // 如果是在网页中可以直接创建一个 a 标签直接下载
      let a = document.createElement('a')
      a.href = url
      a.download = '首页截图'
      a.click()
      console.log("图片生成成功")
    },
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.drag-test {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 20px;
  top: 20px;
  right: 20px;
  bottom: 20px;
  .controls-list {
    border: solid 1px #000000;
    box-shadow:2px 2px 10px #909090;
    border-radius: 5px;
    width: 220px;
    padding: 0 10px;
    //border-right: solid 1px rgb(105, 103, 103);
    margin-right: 10px;
    .controls-item {
      position: relative;
      float: left;
      display: inline-block;
      margin: 5px;
      width: 80px;
      height: 80px;
      border: solid 1px #ccc;
      cursor: pointer;
      line-height: 50px;
      text-align: center;
    }
    .controls-item:hover{
      background-color: #DDDDDD;
    }
  }
}
.drag-wrap {
  box-shadow:2px 2px 10px #909090;
  border-radius: 5px;
  margin-left: 0;
  width: 1370px;
  height: 100%;
  border: solid 1px #000000;
  position: relative;
  .draggable {
    cursor: move;
    // cursor: pointer;
  }
  .inner-container {
    margin-top: -20px;
    height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    .name {
      font-size: 12px;
    }
  }
  .el-icon-error {
    font-size: 16px;
    position: absolute;
    top: -30px;
    right: -30px;
    z-index: 100;
    cursor: pointer;
  }

  .lq-draggable-text,
  .lq-draggable-date,
  .lq-draggable-sign,
  .lq-draggable-select {
    border: dashed 1px #000;
    //background-image:url('../assets/mainBk.png');
    background-size: 100% 100%;
    background-position: center center;
  }
  .lq-draggable-seal {
    .seal-inner {
      width: 100%;
      height: 100%;
      border: dashed 1px #000;
      .seal {
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 5px 0 0 5px;
        border: dashed 1px #000;
        border-radius: 50%;
      }
    }
  }
  .lq-draggable-rr {
    border: dashed 1px #000;
    border-radius: 50px;
  }
  .lq-draggable-tri {
    background-image: url("../assets/triangle.png");
    background-position: center center;
    background-size: 100% 100%;
  }
  .lg-draggable-rot {
    width: 30px;
    height: 30px;
    border: dashed 1px #000;
    border-radius:50%;
  }
  .lq-active-class {
    border-color: rgb(14, 74, 238);
    .seal-inner {
      border-color: rgb(14, 74, 238);
      .seal {
        border-color: rgb(14, 74, 238);
      }
    }
  }
}
.set-wrap {
  width: 230px;
  padding: 0 10px;
  border-left: solid 1px rgb(105, 103, 103);
  .control-set-item {
    margin-bottom: 20px;
    .title {
      margin-bottom: 5px;
      font-size: 14px;
    }
  }
}
.lq-dragging-class {
  border: dashed 1px #000;
}
</style>
<style lang="scss">
.lq-active-class {
  .handle.handle-mr {
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
  }
  .handle-mr::before {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 7px transparent solid;
    border-bottom: 7px transparent solid;
    border-right: 6px solid rgb(122, 121, 121);
    position: absolute;
    left: 2px;
    top: 2px;
  }
  .handle-mr::after {
    content: ' ';
    width: 0;
    height: 0;
    border-top: 7px transparent solid;
    border-bottom: 7px transparent solid;
    border-left: 6px solid rgb(122, 121, 121);
    position: absolute;
    right: 2px;
    top: 2px;
  }
}

.icon-name{
  margin-top: -37px;
}
</style>