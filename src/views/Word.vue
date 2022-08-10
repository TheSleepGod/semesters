<template>
  <div>
    <el-container>
    <el-aside width="300px" style="background-color: #ffd">
      <div class="newCreate" @click="createVisible = true"><i class="el-icon-document-add"></i>&nbsp&nbsp新建文档</div>
      <el-dialog title="新建文档" :visible.sync="createVisible" style="width:60%;margin-left: 20%">
        <el-form :model="createForm">
        <el-form-item label="文档标题" :label-width="'120px'">
          <el-input v-model="createForm.title" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="文档模板" :label-width="'120px'">
          <el-select v-model="createForm.type" placeholder="请选择模板">
            <el-option label="空" value="0"></el-option>
            <el-option label="会议纪要" value="1"></el-option>
            <el-option label="需求规格说明书" value="2"></el-option>
            <el-option label="软件项目计划书" value="3"></el-option>
            <el-option label="架构设计说明书" value="4"></el-option>
          </el-select>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button type="primary" @click="createDoc()">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="重命名文档" :visible="renameDocVisible" :close-on-click-modal=false style="width: 60%;margin-left: 20%">
        <el-input v-model="renameDoc.newName" placeholder="请输入新文档名" maxlength="12" show-word-limit>
          <el-button slot="append" @click="postRenameDoc()">确认</el-button>
        </el-input>
      </el-dialog>
      <div class="leftBar" style="height: 100%" >
        <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="items"
          activatable
          item-key="name"
          open-on-click
          style="text-align: left"
        >
          <template v-slot:prepend="{ item, open }" >
            <div @click="chooseDoc(item)" @contextmenu.prevent="onContextmenu($event,item)">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file]}}
              </v-icon>
            </div>
          </template>
        </v-treeview>
    </div>
    </el-aside>
    <el-main>
      <div class="main-box">
      <div class="main-center-box">
        <div class="center-doc-box">
          <div class="center-doc-title">{{currentDoc.docName}}</div>
          <div class="center-doc-editor-box">
            <!-- todo: put Editor in this box-->
            <div class="editor" id="pdfPrint1" v-if="editor">
              <menu-bar class="editor__header" :editor="editor" />
              <div id="outContent">
                <editor-content  id="pdfPrint" class="editor__content" :editor="editor"/>
              </div>
              <div class="editor__footer">
                <div :class="`editor__status editor__status--${status}`">
                  <template v-if="status === 'connected'">
                    {{ currentDoc.docRoom }}
                  </template>
                  <template v-else>
                    offline
                  </template>
                </div>
                <div class="editor__name">
                  <button @click="exportWord()">
                    导出word
                  </button>
                  <button @click="getPdfFromHtml('pdfPrint')">
                    导出pdf
                  </button>
                  <button @click="getMd()">
                    导出md
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </el-main>
    </el-container>
  </div>
</template>

<script>

import TopBar from "@/components/topBar";
import TeamLeft from "@/components/ProjectLeft";
import htmlToPdf from "../utils/htmlToPdf";
import html2Canvas from "html2canvas";
import {HocuspocusProvider} from '@hocuspocus/provider'
import CharacterCount from '@tiptap/extension-character-count'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import {Editor, EditorContent} from '@tiptap/vue-2'
import * as Y from 'yjs'

import MenuBar from '../components/MenuBar.vue'
import JsPDF from "jspdf";
import $ from 'jquery'
import qs from "qs";
import axios from "axios";

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
  components:{
    TopBar,TeamLeft,
    EditorContent,
    MenuBar,
    htmlToPdf,
  },
  data(){
    return{
      tempModelJson: {},
      tempOpenType: '',
      sendJson: {},
      renameDoc: {
        docId: '',
        newName: '',
        type: '',
        projectId: '',
        folderId: '',
        openType: '',
        content: {},
      },
      renameDocVisible: false,
      delVisible: false,
      visible:false,
      username: '',
      userid: '',
      team:{
        teamId: '',
        teamName: ''
      },
      currentDoc:{
        docId: '',
        docName: '',
        docRoom: '',
        openType:'',
        content: {},
      },
      project_id: this.$route.query.projectId,
      initiallyOpen: ['项目文档'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [{
        name:'项目文档',
        children: [
          {
            docId: '',
            name: '',
            docRoom: '',
            file: '',
            content: {},
            openType: '',
          }
        ]
      }
      ],
      currentUser: {
        name: this.username,
        color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: this.$route.query.room,
      textModel: {},
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
  beforeCreate() {
    // 读取文件
    let pms;
    FileReader.prototype.reading = function ({encode} = pms) {
      let bytes = new Uint8Array(this.result);    //无符号整型数组
      return new TextDecoder(encode || 'UTF-8').decode(bytes);
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

    chooseModel(type){
      this.tempModelJson = {};
      if(type === '0'){
        this.tempModelJson = {};
      }
      else if(type === '1'){
        this.tempModelJson = {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "会议纪要", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "       会议时间：20XX年X月X日XX:XX-XX:XX", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　会议地点：XX公司XX层办公室", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　主持人：XXX", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　参会人员：XXX、XXX、XXX、XXX、XXX", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　记录人：XXX", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　会议议题：关于优化组合后需要明确的几个问题", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　会议内容：", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1、", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（1）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（2）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（3）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2、", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（1）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（2）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "（3）", "type": "text"}]}, {"type": "paragraph"}, {"type": "paragraph"}]}
      }
      else if(type === '2'){
        this.tempModelJson = {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 2}, "content": [{"text": "                                                                      XXXXXXX", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "heading", "attrs": {"level": 1}}, {"type": "paragraph", "content": [{"text": "                                                                                                        [需求规格说明书]", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "                                                                                                目录", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.概述...........................................................................................................................1", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.1 用户简介...............................................................................................................1", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.2 项目的目标...........................................................................................................2", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.3 术语定义...............................................................................................................2", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.4 参考资料...............................................................................................................3", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           1.5 相关文档...............................................................................................................4", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           2.目标系统描述..........................................................................................................5", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           2.1 角色定义...............................................................................................................5", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           2.2 业务流程...............................................................................................................5", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           3.总体功能需求..........................................................................................................5", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           3.1 总体功能...............................................................................................................6", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           3.2 用例图形式分析...................................................................................................7", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           3.3 类图........................................................................................................................7", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           4. 目标系统界面与接口需求.....................................................................................7", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           4.1 界面需求...............................................................................................................8", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           4.2 页面设计...............................................................................................................8", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           4.3 接口需求...............................................................................................................9", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           5.系统的其他需求.......................................................................................................10", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           5.1 安全性....................................................................................................................10", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "                                                           5.2 可靠性....................................................................................................................11", "type": "text"}]}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "1.     概述", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.1   用户简介", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "\"xxxxx\"的用户是任何有意愿浏览和使用本网站的用户，使用者主要有管理者和用户群两种，其中用户群被分为游客和已注册用户，已注册用户在团队中被细分为团队管理者和团队成员。", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.1.1.     游客", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "在实际操作中，没有在本站注册过的用户。游客仅可以浏览设置了相应权限的文档。游客可以通过注册来成为用户。", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.1.2.     已注册用户", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "在实际操作中，拥有本站账号的用户。已注册用户可以使用网站的一切基础功能和资源。", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.1.3.     团队管理者", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "在实际操作中，团队协作活动中拥有管理该团队权限的已注册用户，可以在该团队内拥有进行一定的管理功能。", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.1.4.     系统管理员", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "在实际操作中，拥有本站管理者账号的用户。管理员可以通过管理员账号登录，可以对用户、团队、文档进行增删查改等操作。", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.2.    项目的目的与目标", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.2.1.     目的", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "随考虑疫情的影响，本司决定开发一个超越“石墨文档”的代号为“金刚石文档”的在线文档协作平台，当然具体名字各组随意取即可，金刚石只是代号，最终展示形式为PC端的Web网站。有关项目，公司决定打造一个不同的协作平台，专注于一点，不需要在共享时实现类似腾讯文档的实时同步，而只要求能够协作即可，当然还需要有辅助功能来支持，预计的功能可分为以下几方面：基础功能、个人工作台、文档有关处理、团队协作、消息通知系统。", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "1.2.2.     目标 ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1.     \"金刚石文档\"各个功能完整。", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.     整个系统可以稳定运行。", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.     在线协作顺畅", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.3.    术语定义", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[1] 系统管理员：本系统的后台管理者，可以对网站信息进行管理。", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[2] 游客：未注册的用户", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[4] 用户：狭义上的用户指已注册用户", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[3] 团队管理者：某一团队中拥有管理权限的用户", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[4] 个人中心：每个用户自己的个人工作台页面", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[5] 团队中心：用户进行团队协作时的页面", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[6] 消息中心：用户管理个人消息的页面", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.4.    参考资料", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[1] 吕云翔. 软件工程实用教程[M]. 北京：清华大学出版社, 2015.", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[2] Pressman R S. 软件工程: 实践者的研究方法 (英文精编版)[M]. 机械工业出版社, 2008. ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[3] Ian Sommerille. 软件工程(原书第8版)[M]. 机械工业出版社, 2007.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.5.    相关文档", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[1] 《软件开发计划书》", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[2] 《软件设计说明书》", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[3] 《部署文档》", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[4] 《测试报告》", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[5] 《用户使用说明书》", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "2.     目标系统描述", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.1   角色定义", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.2   业务流程", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "2.     目标系统描述", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.1   角色定义", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.2   业务流程", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "3.     总体功能需求", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.1   总体功能", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.2   用例图形式分析", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.3   类图", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "4.     目标系统界面与接口需求", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "4.1   界面需求", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "4.2   页面设计", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "4.3   接口需求", "type": "text"}]}, {"type": "paragraph"}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "5.     系统的安全需求", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "5.1   安全性", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "5.2   可靠性", "type": "text"}]}, {"type": "paragraph"}]}
      }
      else if(type === '3'){
        this.tempModelJson = {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"text": "                                                                   软件项目计划书", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "content": [{"text": "　　", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "目录", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "第一部分 摘要", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、信息系统公司概况描述", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、信息系统公司的宗旨和目标", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、信息系统公司目前股权结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、已投入的资金及用途", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、信息系统公司目前主要产品或服务介绍", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　六、市场概况和营销策略", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　七、主要业务部门及业绩简介", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　八、核心经营团队", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　九、信息系统公司优势说明", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十、目前信息系统公司为实现目标的增资需求:原因、数量、方式、用途、偿还", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十一、融资方案(资金筹措及投资方式及退出方案)", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十二、财务分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.财务历史数据", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.财务预计", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　3.资产负债情况", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第二部分 综述", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第一章 信息系统公司介绍", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、信息系统公司的宗旨", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、信息系统公司简介资料", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、各部门职能和经营目标", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、信息系统公司管理", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.董事会", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.经营团队", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　3.外部支持", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第二章 技术与产品", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、技术描述及技术持有", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、产品状况", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.主要产品目录", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.产品特性", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　3.正在开发/待开发产品简介", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　4.研发计划及时间表", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　5.知识产权策略", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　6.无形资产", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、信息系统产品生产", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.资源及原材料供应", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.现有生产条件和生产能力", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　3.扩建设施、要求及成本，扩建后生产能力", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　4.原有主要设备及需添置设备", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　5.产品标准、质检和生产成本控制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　6.包装与储运", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第三章 信息系统市场分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、信息系统市场规模、市场结构与划分", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、目标市场的设定", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、产品消费群体、消费方式、消费习惯及影响市场的主要因素分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、目前信息系统公司产品市场状况，产品所处市场发展阶段(空白/新开发/高成长/成熟/饱和) 产 品排名及品牌状况", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、市场趋势预测和市场机会", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　六、行业政策", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第四章 竞争分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、有无行业垄断", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、从市场细分看竞争者市场份额", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、主要竞争对手情况:公司实力、产品情况", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、潜在竞争对手情况和市场变化分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、信息系统公司产品竞争优势", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第五章 信息系统市场营销", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、概述营销计划", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、信息系统销售政策的制定", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、信息系统销售渠道、方式、行销环节和售后服务", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、主要业务关系状况", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、信息系统销售队伍情况及销售福利分配政策", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　六、促销和市场渗透", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.主要促销方式", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.广告/公关策略、媒体评估", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　七、信息系统产品价格方案", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　1.定价依据和价格结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　2.影响价格变化的因素和对策", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　八、销售资料统计和销售纪录方式，销售周期的计算。", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　九、信息系统市场开发规划，销售目标", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第六章 投资说明", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、资金需求说明(用量/期限)", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、资金使用计划及进度", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、投资形式(贷款/利率/利率支付条件/转股-普通股、优先股、任股权/对应价格等)", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、资本结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、回报/偿还计划", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　六、资本原负债结构说明", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　七、投资抵押", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　八、投资担保", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　九、吸纳投资后股权结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十、股权成本", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十一、投资者介入公司管理之程度说明", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十二、报告", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十三、杂费支付", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　第七章 投资报酬与退出", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、股票上市", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、股权转让", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、股权回购", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、股利", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "第八章 风险分析", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　一、资源风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　二、市场不确定性风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　三、研发风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　四、生产不确定性风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　五、成本控制风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　六、竞争风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　七、政策风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　八、财务风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　九、管理风险", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "　　十、破产风险", "type": "text"}]}]}
      }
      else if(type === '4'){
        this.tempModelJson = {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"text": "                                                                    架构设计说明书", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "目 录", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1     简介", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1.1      目的", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1.2      范围", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1.3      定义、首字母缩写词和缩略语", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "1.4      参考资料", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2     设计方案", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.1      系统与外部系统关系", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.2      技术选型标准", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.3      备选方案分析与选择", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.4      设计约束和原则", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.4.1      设计遵循的标准", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.4.2      硬件限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.4.3      技术限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.4.4      其他限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "2.5      开发平台与技术架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3     系统架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.1      逻辑架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.2      物理架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.3      系统功能设计", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.3.1      系统功能分解结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.3.2      XXX子系统", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.3.2.1      功能描述", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "3.4      架构模式设计（可选）", "type": "text"}]}, {"type": "paragraph", "content": [{"type": "hardBreak"}, {"type": "hardBreak"}]}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "1          简介", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.1       目的", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[阐明此文档的编写目的。]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.2       范围", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[简要说明此文档描述的内容范围，比如：软件实现的功能或不实现的功能，软件的应用领域等。]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.3       定义、首字母缩写词和缩略语", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节应提供正确理解此文档所需的全部术语的定义、首字母缩写词和缩略语。 这些信息可以通过引用项目词汇表来提供。]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "1.4       参考资料", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节应完整列出此文档中所引用的任何文档。列出可从中获取这些参考资料的来源。这些信息可以通过引用附录或其他文档来提供。]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "2          设计方案", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节应说明该软件系统的所有的可选设计方案，以及最终方案和设计约束等。]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.1       系统与外部系统关系", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节应说明该软件系统所处的软硬件环境，与其他系统的交互关系，比如：系统在Mos中的位置；可以使用系统结构图表示等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.2       技术选型标准", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}, {"text": "[本小节描述技术方案的选择标准。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.3       备选方案分析与选择", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节对本软件系统的几种备选设计方案进行分析，比较，并确定最终采用的设计方案等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.4       设计约束和原则", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[此节描述软件产品的设计原则和设计技术路线，指明是结构化设计，还是面向对象的设计；说明在软件复用、产品维护和扩展等方面的要求和目标，以及设计须遵守的企业内部设计规范]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2.4.1    设计遵循的标准", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节说明软件所遵循的设计标准，规范等，比如：采用UML2.0标准，采用研发中心《软件设计过程》规范等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2.4.2    硬件限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节说明系统实现的硬件限制，比如：服务器类型，终端类型，网络环境等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2.4.3    技术限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节说明系统实现的所有技术限制，比如：技术架构，数据库方案对系统性能的影响和限制等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "2.4.4    其他限制", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[本小节说明系统实现的所有其他方面的限制，比如：约定的关键设计原则，资源，预算等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "2.5       开发平台与技术架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "   ", "type": "text"}, {"text": "[本小节说明系统开发使用的平台和选择的技术架构等。]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 1}, "content": [{"text": "3          系统架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "     [此节描述软件的逻辑架构和物理架构]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.1       逻辑架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[此节描述软件产品在逻辑概念上的总体结构（特别是内部依赖、接口关系），可以采用结构图，层次分解图，或UML的包图等来描述。同时，也应该说明系统架构的划分原则，比如：基于产品组件化设计思想，协议所规定的体系结构，原有系统的限制等等 ]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.2       物理架构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "       [此节描述软件产品在用户处的实际部署结构，本节要求画出系统在实际的物理和网络环境下的分布图]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.3       系统功能设计", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[这一节应针对系统的功能分解结构，结合所采用的设计方案，对软件功能的设计实现做概要说明]", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3.3.1    系统功能分解结构", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[这一节简要说明软件系统的功能分解结构（比如：系统－子系统），分解到子系统]", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "   【", "type": "text", "marks": [{"type": "italic"}]}, {"text": "对每个子系统重复使用下面的格式", "type": "text", "marks": [{"type": "bold"}, {"type": "italic"}]}, {"text": "】", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "3.3.2    XXX子系统", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "[此节说明子系统XXX的功能点和接口依赖关系,如果必要，描述关键数据结构，比如：接口数据等]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 4}, "content": [{"text": "3.3.2.1功能描述", "type": "text"}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "3.4       架构模式设计（可选）", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "  ", "type": "text"}, {"text": " [如果需要，请描述本软件分别采用的业务逻辑模式，数据源模式，O/R映射模式，Web表现模式，分布模式和并发模式；本节可选]", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "paragraph", "content": [{"text": " ", "type": "text"}]}]}
      }
    },

    outJson() {
      console.log(this.editor.getJSON());
    },

    postRenameDoc() {
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/update_title',
          JSON.stringify({
            document_id: this.renameDoc.docId,
            project_id: this.renameDoc.projectId,
            folder_id: '',
            document_type: 'project_document',
            new_title: this.renameDoc.newName,
          })
      ).then((res)=>{
        if(res.data.errno===0){
          this.$message.success("重命名成功");
          this.getDocs();
          this.renameDocVisible = false;
          if(this.currentDoc.docId === this.renameDoc.docId){
            this.currentDoc.docName = this.renameDoc.newName;
          }
          this.renameDoc = {
            docId: '',
            newName: '',
            projectId: '',
            folderId: '',
            type: '',
            content: {},
            openType: '',
          };
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },

    delDoc(item) {
      console.log(item);
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/delete_document',
          JSON.stringify({
            document_id: item.docId,
            document_type: 'project_document'
          })
      ).then((res)=>{
        if(res.data.errno===0){
          this.$notify.success("文档 "+item.name+" 已删除");
          this.getDocs();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.provider.destroy();
          this.editor.destroy();
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },

    onContextmenu(event,item) {
      if(item.file === 'txt'){
        this.$contextmenu({
          items: [
            {
              label: "删除文档",
              icon:'el-icon-document-delete',
              onClick: () => {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.delDoc(item);
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            },
            {
              label: "重命名文档",
              icon:'el-icon-edit-outline',
              onClick: () => {
                this.renameDoc = {
                  docId: item.docId,
                  newName: item.name,
                  projectId: this.project_id,
                  folderId: '',
                  type: 'project_document'
                };
                this.renameDocVisible = true;
              }
            },

          ],
          event,
          //x: event.clientX,
          //y: event.clientY,
          customClass: "class-a",
          zIndex: 3,
          minWidth: 230
        });
      }
      return false;
    },

    getNowUser() {
      this.$axios({
            method : 'post',
            url : 'http://101.42.160.94:8000/api/user_web/get_user',
            headers:{
              'Authorization': localStorage.getItem('Token')
            }
          }
      ).then((ret) => {
        if (ret.data.errno === 0) {
          this.username = ret.data.data.username;
          this.userid=ret.data.data.user_id;
          this.currentUser.color = this.getRandomColor();
          this.currentUser.name = this.username;
          const ydoc = new Y.Doc()
          //this.textModel = this.currentDoc.content;
          this.provider = new HocuspocusProvider({
            url: 'wss://connect.gethocuspocus.com',
            parameters: {
              key: 'write_bqgvQ3Zwl34V4Nxt43zR',
            },
            name: this.currentDoc.docRoom,
            document: ydoc,
          })
          this.provider.on('status', event => {
            this.status = event.status
          })
          this.editor = new Editor({
            onUpdate: ({ editor }) => {
              this.textDownload = editor.getText();
              this.htmlDownload = editor.getHTML();
              this.sendJson = editor.getJSON();
              if(this.currentDoc.openType === 'first'){
                this.tempOpenType = '';
              }
              this.$axios.post(
                  'http://101.42.160.94:8000/api/user_web/update_document',
                  JSON.stringify({
                    document_id: this.currentDoc.docId,
                    project_id: this.project_id,
                    folder_id: '',
                    document_type: 'project_document',
                    content: this.sendJson,
                    open_type:this.tempOpenType
                  })
              ).then((res)=>{
                if(res.data.errno===0){
                  console.log(1)
                } else this.$notify.error(res.data.msg)
              }).catch((error)=>{console.log(error)})
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
        } else {
          this.$notify.error(ret.data.msg);
        }
        console.log('userid:'+this.userid);
      })
    },

    createDoc() {
      this.chooseModel(this.createForm.type);
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/create_document',
          JSON.stringify({
            project_id: this.project_id,
            folder_id: '',
            title: this.createForm.title,
            document_type: 'project_document',
            content: this.tempModelJson,
          })
      ).then((res)=>{
        console.log(res);
        if(res.data.errno===0){
          this.$message.success("文档创建成功");
          this.createVisible = false;
          this.getDocs();
        } else this.$notify.error(res.data.msg);
      }).catch((error)=>{console.log(error)})
    },

    chooseDoc(item) {
      if(item.file === 'txt') {
        this.currentDoc.docId = item.docId;
        this.currentDoc.docName = item.name;
        this.currentDoc.docRoom = item.docRoom;
        this.currentDoc.content = item.content;
        this.currentDoc.openType = item.openType;
        if(this.currentDoc.openType === 'first'){
          this.textModel = this.currentDoc.content;
          this.tempOpenType = '';
          this.currentDoc.openType = '';
          item.openType = '';
        }
        else{
          this.textModel = {};
        }
        console.log('现在选中的是' + this.currentDoc.docId);
        console.log(this.textModel);
        this.editor.destroy()
        this.provider.destroy()
        const ydoc = new Y.Doc()
        this.provider = new HocuspocusProvider({
          url: 'wss://connect.gethocuspocus.com',
          parameters: {
            key: 'write_bqgvQ3Zwl34V4Nxt43zR',
          },
          name: this.currentDoc.docRoom,
          document: ydoc,
        })
        this.provider.on('status', event => {
          this.status = event.status
        })
        this.editor = new Editor({
          onUpdate: ({editor}) => {
            this.textDownload = editor.getText();
            this.htmlDownload = editor.getHTML();
            this.sendJson = editor.getJSON();
            console.log(this.sendJson);
            if(this.currentDoc.openType === 'first'){
              this.tempOpenType = '';
            }
            this.$axios.post(
                'http://101.42.160.94:8000/api/user_web/update_document',
                JSON.stringify({
                  document_id: this.currentDoc.docId,
                  project_id: this.project_id,
                  folder_id: '',
                  document_type: 'project_document',
                  content: this.sendJson,
                  open_type:this.tempOpenType
                })
            ).then((res)=>{
              if(res.data.errno===0){
                console.log(1)
              } else this.$notify.error(res.data.msg)
            }).catch((error)=>{console.log(error)})
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
      }
    },

    getDocs() {
      this.items[0].children = [];
      this.$axios.post(
          'http://43.138.22.20:8000/api/user/check_project_document',
          qs.stringify({
            project_id: this.project_id
          })
      ).then((res)=>{
        if(res.data.errno===0){
          let docArray = res.data.data;
          for (let j in docArray){
            this.items[0].children.push({
              docId: docArray[j].document_id,
              name: docArray[j].title,
              docRoom: docArray[j].room_name,
              openType: docArray[j].open_type,
              content: docArray[j].content,
              file: 'txt',
            })
          }
          // this.currentDoc.docId = this.items[0].children[0].docId;
          // this.currentDoc.docName = this.items[0].children[0].name;
          // this.currentDoc.docRoom = this.items[0].children[0].docRoom;
          // this.currentDoc.content = this.items[0].children[0].content;
          // this.currentDoc.openType = this.items[0].children[0].openType;
          //
          // this.editor.destroy()
          // this.provider.destroy()
          // const ydoc = new Y.Doc()
          //
          // this.provider = new HocuspocusProvider({
          //   url: 'wss://connect.gethocuspocus.com',
          //   parameters: {
          //     key: 'write_bqgvQ3Zwl34V4Nxt43zR',
          //   },
          //   name: this.currentDoc.docRoom,
          //   document: ydoc,
          // })
          // this.provider.on('status', event => {
          //   this.status = event.status
          // })
          // this.editor = new Editor({
          //   onUpdate: ({ editor }) => {
          //     this.textDownload = editor.getText();
          //     this.htmlDownload = editor.getHTML();
          //     this.sendJson = editor.getJSON();
          //     if(this.currentDoc.openType === 'first'){
          //       this.tempOpenType = '';
          //     }
          //     this.$axios.post(
          //         'http://101.42.160.94:8000/api/user_web/update_document',
          //         JSON.stringify({
          //           document_id: this.currentDoc.docId,
          //           project_id: this.project_id,
          //           folder_id: '',
          //           document_type: 'project_document',
          //           content: this.sendJson,
          //           open_type:this.tempOpenType
          //         })
          //     ).then((res)=>{
          //       if(res.data.errno===0){
          //         console.log(1)
          //       } else this.$notify.error(res.data.msg)
          //     }).catch((error)=>{console.log(error)})
          //   },
          //   content: this.textModel,
          //   extensions: [
          //     StarterKit.configure({
          //       history: false,
          //     }),
          //     Highlight,
          //     TaskList,
          //     TaskItem,
          //     Collaboration.configure({
          //       document: ydoc,
          //     }),
          //     CollaborationCursor.configure({
          //       provider: this.provider,
          //       user: this.currentUser,
          //     }),
          //     CharacterCount.configure({
          //       limit: 10000,
          //     }),
          //   ],
          // })
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },

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
      else{
        this.textModel = '';
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
      let title = "测试啊";
      let that = this;
      let shareContent = DomName; //需要截图的包裹的（原生的）DOM 对象
      //打印看有没有获取到dom
      console.log(shareContent);
      let width = shareContent.offsetWidth; //获取dom 宽度
      let height = shareContent.offsetHeight; //获取dom 高度
      let canvas = document.createElement("canvas"); //创建一个canvas节点
      let scale = 2; //定义任意放大倍数 支持小数
      canvas.width = width * scale; //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      html2Canvas(DomName, {
        //允许跨域图片的加载
        useCORS: true,
        dpi: window.devicePixelRatio , //将分辨率提高到特定的DPI 提高四倍
        // scale: 2, //按比例增加分辨率
      }).then(function(canvas) {
        let context = canvas.getContext("2d");
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        let imgData = canvas.toDataURL("image/", 1.0); //转化成base64格式,可上网了解此格式
        let img = new Image();
        img.src = imgData;
        img.onload = function() {
          img.width = img.width / 2; //因为在上面放大了2倍，生成image之后要/2
          img.height = img.height / 2;
          img.style.transform = "scale(0.5)";
          let doc;
          if (this.width > this.height) {
            //此可以根据打印的大小进行自动调节
            doc = new JsPDF("l", "mm", [
              this.width * 0.555,
              this.height * 0.555
            ]);
          } else {
            doc = new JsPDF("p", "mm", [
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
        let leftHeight = canvas.height;
        let a4Width = 555.28 // 原A4宽 592 因为要设置边距 20 ,这里要减掉 40
        let a4Height = 801.89 // 原A4高   841 因为要设置边距 20 ,这里要减掉 40
        //一页pdf显示html页面生成的canvas高度;
        let a4HeightRef = Math.floor(canvas.width / a4Width * a4Height);

        //pdf页面偏移
        let position = 0;

        let pageData = canvas.toDataURL('image/jpeg', 1.0);

        let pdf = new JsPDF('x', 'pt', 'a4');
        let index = 1,
            canvas1 = document.createElement('canvas'),
            height;
        pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

        function createImpl(canvas) {
          if (leftHeight > 0) {
            index++;
            let checkCount = 0;
            if (leftHeight > a4HeightRef) {
              for (let i = position + a4HeightRef; i >= position; i--) {
                let isWrite = true
                for (let j = 0; j < canvas.width; j++) {
                  let c = canvas.getContext('2d').getImageData(j, i, 1, 1).data

                  if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
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

            let ctx = canvas1.getContext('2d');
            ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height); // 边距这里设置0，不然又黑边

            let pageHeight = Math.round(a4Width / canvas.width * height);
            // pdf.setPageSize(null, pageHeight)
            if(position !== 0){
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
  created() {
    this.getNowUser();
    this.team.teamId = this.$route.query.teamId;
    this.team.teamName = this.$route.query.teamName;
    this.project_id = this.$route.query.projectId;
  },

  mounted() {
    this.getDocs();
    //
    this.getText(this.$route.query.type);

    console.log(this.currentUser);

  },
  beforeUnmount() {
    this.editor.destroy()
    this.provider.destroy()
  },
}
</script>

<style scoped>

.el-main{
}

.leftBar{
  width: 100%;
}

.body-box{
}
.main-box{
  display: flex;
  width: 100%;
}
.main-center-box{
  transition: all 1s;
  width: 100%;
  height: 100%;
}
.main-right-box{
  display: flex;
  transition: all 1s;
  width: 10%;
  padding-left: 5%;
}
.main-right-box:hover .main-center-box{
  width: 75%;
}
.main-right-box:hover{
  padding-left: 0;
  width: 25%;
}
.center-head-box{
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  padding-left: 20px;
  background-color: antiquewhite;
}
.center-head-font{
  font-size: 28px;
  float: left;
  text-align: left;
}
.center-doc-box{
}
.center-doc-title{
  height: 50px;
  line-height: 50px;
  font-size: 24px;
}
.center-doc-editor-box{
  padding: 10px 10px 10px 10px;
}
.right-pullIcon-bar{
  cursor: pointer;
  width: 100px;
  transition: all 1s;
  background-image: url("../assets/left.png");
  background-repeat: no-repeat;
  background-position: 300% 50%;
  background-size: 85% 50%;
  animation: arrow 5s infinite linear;
}
@keyframes arrow {
  0%{background-position: 300% 50%}
  25%{background-position: 600% 50%}
  50%{background-position: 300% 50%}
  75%{background-position: 0 50%}
  100%{background-position: 300% 50%}
}
.right-folders-box{
  width: 0;
  background-color: lightyellow;
  transition: all 1s;
}
.main-right-box:hover .right-pullIcon-bar{
  width: 0;
}
.main-right-box:hover .right-folders-box{
  width: 100%;
}
</style>

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
  min-height: 590px;
  max-height: 590px;
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

.newCreate{
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 20px;
  background-color: #FAF594;
}

.newCreate:hover{
  cursor: pointer;
}

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