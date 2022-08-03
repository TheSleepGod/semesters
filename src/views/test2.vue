<!-- drag-test -->
<template>
  <div class="drag-test">
    <div class="controls-list">
      <div
          :class="commonClassName"
          @click="addControl(1)"
          class="controls-item controls-text"
      >
          文本
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-date"
          @click="addControl(2)"
      >
        签章
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-select"
          @click="addControl(3)"
      >
        签名
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-sign"
          @click="addControl(4)"
      >
        选项
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-seal"
          @click="addControl(5)"
      >
        日期
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-rr"
          @click="addControl(6)"
      >
        圆角矩形
      </div>
      <div
          :class="commonClassName"
          class="controls-item controls-line"
          @click="addControl(7)"
      >
        直线
      </div>
    </div>
    <el-button  size="mini" title="生成图片" @click="toImage()" icon="el-icon-download"></el-button>
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
          :snap="true"
          :snap-tolerance="20"
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
        case 'line':
          className = 'lq-draggable-line';
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
          height: 30,
          x: 200,
          y: 380,
          type: 'line', // 控件类型 圆角矩形
          name: '直线',
          fontsSize: 10,
          signatory: 0 // 签署方默认甲方
        }
      };
      this.controlsArr.push(controlObjMap[type]);
      this.setControlActive(controlObjMap[type].customId);
    },
    // 手动设置刚才添加的控件为选中状态
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
    width: 220px;
    padding: 0 10px;
    border-right: solid 1px rgb(105, 103, 103);
    margin-right: 10px;
    .controls-item {
      height: 30px;
      border: solid 1px #ccc;
      margin-bottom: 20px;
      cursor: pointer;
      line-height: 30px;
      text-align: center;
    }
  }
}
.drag-wrap {
  width: 594px;
  height: 100%;
  border: solid 1px #ccc;
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
    background-image:url('../assets/mainBk.png');
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
  .lq-active-class {
    border-color: rgb(14, 74, 238);
    .seal-inner {
      border-color: rgb(14, 74, 238);
      .seal {
        border-color: rgb(14, 74, 238);
      }
    }
  }
  .lq-draggable-rr {
    border: dashed 1px #000;
    border-radius: 50px;
  }
  .lq-draggable-line {
    border: solid 1px #000;
    height: 1px;
    width: 1px;
    background: #0997F7;
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
</style>