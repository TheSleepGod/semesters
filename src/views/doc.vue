<template>
  <div>
    <div class="editor" id="pdfPrint1" v-if="editor">
    <menu-bar class="editor__header" :editor="editor" />
    <div id="outContent">
      <editor-content  id="pdfPrint" class="editor__content" :editor="editor"/>
    </div>
    <div class="editor__footer">
      <div :class="`editor__status editor__status--${status}`">
        <template v-if="status === 'connected'">
          {{ editor.storage.collaborationCursor.users.length }} user{{ editor.storage.collaborationCursor.users.length === 1 ? '' : 's' }} online in {{ room }}
        </template>
        <template v-else>
          offline
        </template>
      </div>
      <div class="editor__name">
        <button @click="setName">
          {{ currentUser.name }}
        </button>
        <button @click="exportWord()">
          导出word!
        </button>
        <button @click="getPdfFromHtml('pdfPrint')">
          导出pdf!
        </button>
        <button @click="getMd()">
          导出md!
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import TurndownService from 'turndown';
import htmlToPdf from "../utils/htmlToPdf";
import html2Canvas from "html2canvas";
import { HocuspocusProvider } from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-2'
import * as Y from 'yjs'

import MenuBar from '../components/MenuBar.vue'
import JsPDF from "jspdf";
import html2canvas from "html2canvas";
import JSZipUtils from "jszip-utils";
import JSZip from "jszip";
import docxtemplater from 'docxtemplater'
import $ from 'jquery'
import axios from "axios";
import qs from "qs";
require('@/assets/js/jquery.wordexport')

const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
}

const getRandomRoom = () => {
  return getRandomElement([
    'rooms.18555',
  ])
}

const turndownService = require('turndown').default;

export default {
  components: {
    EditorContent,
    MenuBar,
    htmlToPdf,
  },

  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || {
        name: this.getRandomName(),
        color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: this.$route.query.room,
      textModel: '',
      textCode: '',
      textDownload: '',
      // 填入导出的pdf文件名和html元素
      pdfTitle: 'default',
      pdfSelector: '#pdfPrint',
      htmlDownload: '',
      markdownContent: '',
      createVisible: false,
      createForm: {
        title: '',
        type: '',
      },
      formLabelWidth: '120px',
    }
  },

  mounted() {

    this.getText(this.$route.query.type);
    const ydoc = new Y.Doc()

    this.provider = new HocuspocusProvider({
      url: 'wss://connect.hocuspocus.cloud',
      parameters: {
        key: 'write_bqgvQ3Zwl34V4Nxt43zR',
      },
      name: this.room,
      document: ydoc,
    })
    this.provider.on('status', event => {
      this.status = event.status
    })
    this.editor = new Editor({
      onUpdate: ({ editor }) => {
        this.textDownload = editor.getText();
        this.htmlDownload = editor.getHTML();
        // send the content to an API here
      },
      content: this.textModel,
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: this.provider,
          user: this.currentUser,
        }),
        CharacterCount.configure({
          limit: 10000,
        }),
      ],
    })
    // console.log(this.editor.getText());
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    // console.log(this.editor.getText());
  },

  beforeCreate() {
    // 读取文件
    FileReader.prototype.reading = function ({encode} = pms) {
      let bytes = new Uint8Array(this.result);    //无符号整型数组
      let text = new TextDecoder(encode || 'UTF-8').decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)       //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => {  //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f);  //内部会回调this.onload方法
    };
  },

  methods: {
    setName() {
      const name = (window.prompt('Name') || '')
          .trim()
          .substring(0, 32)
      if (name) {
        return this.updateCurrentUser({
          name,
        })
      }
    },

    exportWord() {
      setTimeout(function() {
        $('#pdfPrint').wordExport('word文档')
      }, 300)
    },

    getText(textCode) {
      if(textCode === '0'){
        this.textModel = '';
      }
      else if(textCode === '1'){
        //需求规格说明书
        this.textModel = '<h2>需求规格说明书</h2>';
      }
      else if(textCode === '2'){
        //会议纪要
        this.textModel = '<h2>会议纪要</h2>';
      }
      else if(textCode === '3'){
        //项目计划
        this.textModel = '<h2>项目计划</h2>';
      }
      else if(textCode === '4'){
        //架构设计说明书
        this.textModel = '<h2>架构设计说明书</h2>';
      }
    },

    getTextCode() {
      //TODO 前后端交互
    },

    beforeUpload(file) {
      this.fileList = [file]
      console.log('选择了文件beforeUpload')
      // 读取数据
      this.read(file);
      return false
    },
    read(f) {
      let rd = new FileReader();
      rd.onload = e => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let cont = rd.reading({encode: 'UTF-8'});
        console.log(cont);
        document.getElementById("textarea").value=cont;
        let  formerData = this.textData;
        this.textData = formerData + "\n" + cont;
      };
      rd.readAsBinaryString(f);
    },
    download() {
      let str = new Blob([this.textDownload], {type: 'text/plain;charset=utf-8'});
      saveAs(str, 'document.txt');
    },

    getMd() {
      let turndownServices = new turndownService();
      this.markdownContent = turndownServices.turndown(this.htmlDownload);
      console.log(this.markdownContent)
      let str = new Blob([this.markdownContent], {type: 'text/plain;charset=utf-8'});
      saveAs(str,'document.md');
    },

    printOut(DomName) {
      DomName = document.getElementById(DomName)
      console.log("正在帮您导出......");
      window.pageYoffset = 0; // 滚动置顶
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      //title，随意设置，也可以提出来做参数，传入进来，自己发挥
      var title = "测试啊";
      var that = this;
      var shareContent = DomName; //需要截图的包裹的（原生的）DOM 对象
      //打印看有没有获取到dom
      console.log(shareContent);
      var width = shareContent.offsetWidth; //获取dom 宽度
      var height = shareContent.offsetHeight; //获取dom 高度
      var canvas = document.createElement("canvas"); //创建一个canvas节点
      var scale = 2; //定义任意放大倍数 支持小数
      canvas.width = width * scale; //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      html2Canvas(DomName, {
        //允许跨域图片的加载
        useCORS: true,
        dpi: window.devicePixelRatio , //将分辨率提高到特定的DPI 提高四倍
        // scale: 2, //按比例增加分辨率
      }).then(function(canvas) {
        var context = canvas.getContext("2d");
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var imgData = canvas.toDataURL("image/", 1.0); //转化成base64格式,可上网了解此格式
        var img = new Image();
        img.src = imgData;
        img.onload = function() {
          img.width = img.width / 2; //因为在上面放大了2倍，生成image之后要/2
          img.height = img.height / 2;
          img.style.transform = "scale(0.5)";
          if (this.width > this.height) {
            //此可以根据打印的大小进行自动调节
            var doc = new JsPDF("l", "mm", [
              this.width * 0.555,
              this.height * 0.555
            ]);
          } else {
            var doc = new JsPDF("p", "mm", [
              this.width * 0.555,
              this.height * 0.555
            ]);
          }
          doc.addImage(
              imgData,
              "jpeg",
              10,
              0,
              this.width * 0.505,
              this.height * 0.545
          );
          doc.save(title + "-文件.pdf");
          console.log("倒数3秒导出啦");
        };
      });
    },

    getPdfFromHtml(ele, pdfFileName) {
      ele = document.getElementById('pdfPrint')
      pdfFileName = pdfFileName||'pdf'
      window.pageYoffset = 0; // 滚动置顶
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // ele.style.fontFamily='宋体';
      // ele.style.padding='30px';
      let scale = window.devicePixelRatio * 2
      html2Canvas(ele,{
        // dpi: 300,
        dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
        scale: 4, //按比例增加分辨率
        logging: false,
        // scale:scale,
        useCORS: true,//允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
        allowTaint: false,
        height: ele.offsetHeight,
        width: ele.offsetWidth,
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
        backgroundColor: '#fff'
      }).then(canvas=>{
        const _this = this;
        //未生成pdf的html页面高度
        var leftHeight = canvas.height;
        var a4Width = 555.28 // 原A4宽 592 因为要设置边距 20 ,这里要减掉 40
        var a4Height = 801.89 // 原A4高   841 因为要设置边距 20 ,这里要减掉 40
        //一页pdf显示html页面生成的canvas高度;
        var a4HeightRef = Math.floor(canvas.width / a4Width * a4Height);

        //pdf页面偏移
        var position = 0;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);

        var pdf = new JsPDF('x', 'pt', 'a4');
        var index = 1,
            canvas1 = document.createElement('canvas'),
            height;
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

        function createImpl(canvas) {
          if (leftHeight > 0) {
            index++;
            var checkCount = 0;
            if (leftHeight > a4HeightRef) {
              var i = position + a4HeightRef;
              for (i = position + a4HeightRef; i >= position; i--) {
                var isWrite = true
                for (var j = 0; j < canvas.width; j++) {
                  var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                  if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                    isWrite = false
                    break
                  }
                }
                if (isWrite) {
                  checkCount++
                  if (checkCount >= 10) {
                    break
                  }
                } else {
                  checkCount = 0
                }
              }
              height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
              if(height<=0){
                height = a4HeightRef;
              }
            } else {
              height = leftHeight;
            }

            canvas1.width = canvas.width;
            canvas1.height = height;

            // console.log(index, 'height:', height, 'pos', position);

            var ctx = canvas1.getContext('2d');
            ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height); // 边距这里设置0，不然又黑边

            var pageHeight = Math.round(a4Width / canvas.width * height);
            // pdf.setPageSize(null, pageHeight)
            if(position != 0){
              pdf.addPage();
            }
            // 设置 20px 边距
            pdf.addImage(canvas1.toDataURL('image/jpeg', 1.0), 'JPEG', 20, 20, a4Width, a4Width / canvas1.width * height);
            leftHeight -= height;
            position += height;
            // $('.pdfProgress').text(index + 1);
            // $('.pdfTotal').text(index + Math.ceil(leftHeight / a4HeightRef));
            if (leftHeight > 0) {
              //添加全屏水印
              const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAArCAYAAADIWo5HAAACLUlEQVR42u2Zy2sCMRDGV9tbtVJKrQ/0JBWLvbgsaOttQQqreO5R6GHP/v+HZiEDQ9i8k33YDHyXbcxufpN8maRRFCJEiBAhQoTgRIfoh+hKNBe0G9I2GVG3om9bEl2I9rcIoE/77Cq8Myd6sn2ZSBgAr80YARhI+gOwCdGW6EB/d6R9XDUGFrsAf2Fe7Fswk1JBmzMd1DNKgI2EywQyUKYjkxFeOwwxkwgAvBJNqEa0DzaTHcn3qWrXdA/ocQD8m11ABUDfQF0fpujjI2QAeoZetdYdfOzB9HgGNEF6owM8Ec3Q8wEDgP07T6ktgNyB8YgAqGZ0b+gRsS2AtQP/iAUAHlAdsEW7TY6eFVrVNQN8A2AjlZho5R5wYjJhoqMiADy4DFWLPJMcKBhv3AYThFi4yJyrAAAfDrY/1SVQVhLDOWDowIwzSQ1TqwfA1P5CU3yJlsPY8fmjcTMgptmeIwB3aFbsLCvM2BRAFR4AZXYxuEdmn38hmjoosY0B5IonxLNhIYTNby0odMoAJJL1/k10bwpgQztZKaxb2YXFRnAUhexDHzoAUsGxu3j+awNA5+RmcxW1UCx1eQB4SyI1AaBrbiMEYGrwexgYBlgrgGtU/ZUY3AlGhgByTvV5MQGgW1SomqBOUWLiATy1wgNsABQz51PzWHxTALzWAW0F0EM+MKPmnLj6x0lbAPDuC5zfNPsCcChZ25DZd4VBJCW7wrRp1+whQoQIESJEg+IPRa38G55TPkQAAAAASUVORK5CYII='
              for(let i=0;i<6;i++){
                for(let j=0;j<5;j++){
                  const  left = (j*120)+20;
                  // pdf.addImage(base64,'JPEG', left, i*150, 20, 30); // 关掉水印
                }
              }
              setTimeout(createImpl, 500, canvas);
            } else {
              pdf.save(pdfFileName + '.pdf');
            }
          }
        }

        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < a4HeightRef) {
          pdf.addImage(pageData, 'JPEG', 20,20, a4Width, a4Width / canvas.width * leftHeight);
          pdf.save(pdfFileName + '.pdf')
        } else {
          try {
            pdf.deletePage(0);
            setTimeout(createImpl, 500, canvas);

          } catch (err) {
            console.log(err);
          }
        }
      })

    },

    updateCurrentUser(attributes) {
      this.currentUser = { ...this.currentUser, ...attributes }
      this.editor.chain().focus().updateUser(this.currentUser).run()

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    },

    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },

    getRandomName() {
      return getRandomElement([
        'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
      ])
    },
  },

  beforeUnmount() {
    this.editor.destroy()
    this.provider.destroy()
  },
}
</script>

<style lang="scss">

#outContent {
  padding: 1.25rem 1rem;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.editor {
  display: flex;
  flex-direction: column;
  max-height: 26rem;
  color: #0D0D0D;
  background-color: #FFF;
  border: 3px solid #0D0D0D;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid #0D0D0D;
  }

  &__content {
    padding: 1.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    text-align: left;
  }

  &__footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    white-space: nowrap;
    border-top: 3px solid #0D0D0D;
    font-size: 12px;
    font-weight: 600;
    color: #0D0D0D;
    white-space: nowrap;
    padding: 0.25rem 0.75rem;
  }

  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;

    &::before {
      content: ' ';
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>