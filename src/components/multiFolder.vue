<template>
  <div style="caret-color: transparent;" class = "font-1">
    <div class = "multi-level-folders-box">
      <div class="multi-level-folders-title">文档列表</div>
      <div class="multi-level-folders-content">
        <!-- 新建文件夹-->
        <div class="first-folder">
          <div class="first-folder-title" @click="showCreateFolder"
               @mouseenter="showIcon(newFolder)" @mouseleave="hideIcon(newFolder)">
            <div style="margin-left: 20px">
              <i class="el-icon-folder-add">新建文件夹</i>
            </div>
          </div>
        </div>
        <!-- 项目文档区-->
        <div class = "first-folder">
          <div class = "first-folder-title" @click="reverseVisible(projectsFolder)">
            <i class="el-icon-caret-right folder-tool-icon" v-if="!projectsFolder.isActive">&nbsp</i>
            <i class="el-icon-caret-bottom folder-tool-icon" v-if="projectsFolder.isActive">&nbsp</i>
            <i class="el-icon-folder" v-if="!projectsFolder.isActive">项目文档区</i>
            <i class="el-icon-folder-opened" v-if="projectsFolder.isActive">项目文档区</i>
          </div>
          <transition appear>
            <div class="first-folder-content" v-if="projectsFolder.isActive">
              <div class = "second-folder" v-for="(oneProjectFolder) in projectsFolder.projectsList">
                <div class="second-folder-title" @click="reverseVisible(oneProjectFolder)"
                     @mouseenter="showIcon(oneProjectFolder)" @mouseleave="hideIcon(oneProjectFolder)">
                  <div style="margin-left: 37px;">
                    <i class="el-icon-caret-right folder-tool-icon" v-if="!oneProjectFolder.isActive">&nbsp</i>
                    <i class="el-icon-caret-bottom folder-tool-icon" v-if="oneProjectFolder.isActive">&nbsp</i>
                    <i class="el-icon-folder" v-if="!oneProjectFolder.isActive">{{oneProjectFolder.projectName}}</i>
                    <i class="el-icon-folder-opened" v-if="oneProjectFolder.isActive">{{oneProjectFolder.projectName}}</i>
                    <i class="el-icon-plus folder-tool-icon folder-tool-icon-right" title="新建文档"
                       v-if="oneProjectFolder.isHover" @click.stop="showCreateDoc(0,oneProjectFolder.projectId)"/>
                  </div>
                </div>
                <transition appear>
                  <div class="second-folder-content" v-if="oneProjectFolder.isActive">
                    <div class="doc-box" v-for="(doc) in oneProjectFolder.projectDocs"  @click.stop="openDoc(doc,oneProjectFolder.projectId)"
                         @mouseenter="showIcon(doc)" @mouseleave="hideIcon(doc)">
                      <div style="margin-left: 74px;display: flex;">
                        <div class="doc-font"  :title="doc.docName">
                          <i class="el-icon-document">{{doc.docName}}</i>
                        </div>
                        <i class="el-icon-edit-outline folder-tool-icon folder-tool-icon-right" style="right: 20px"
                           title="重命名" v-if="doc.isHover" @click.stop="showRenameDoc(doc,0,oneProjectFolder.projectId)"/>
                        <i class="el-icon-delete folder-tool-icon folder-tool-icon-right"
                           title="删除" v-if="doc.isHover" @click.stop="confirmDelDoc(doc)"/>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
        <!-- 非项目文档区-->
        <div class="first-folder" v-for="(anotherFolder) in otherFolders">
          <div class="first-folder-title" @click="reverseVisible(anotherFolder)"
               @mouseenter="showIcon(anotherFolder)" @mouseleave="hideIcon(anotherFolder)">
            <i class="el-icon-caret-right folder-tool-icon" v-if="!anotherFolder.isActive">&nbsp</i>
            <i class="el-icon-caret-bottom folder-tool-icon" v-if="anotherFolder.isActive">&nbsp</i>
            <i class="el-icon-folder" v-if="!anotherFolder.isActive">{{anotherFolder.folderName}}</i>
            <i class="el-icon-folder-opened" v-if="anotherFolder.isActive">{{anotherFolder.folderName}}</i>
            <i class="el-icon-delete-solid folder-tool-icon folder-tool-icon-right" title="删除文件夹"
               v-if="anotherFolder.isHover" @click.stop="confirmDelFolder(anotherFolder)"/>
            <i class="el-icon-plus folder-tool-icon folder-tool-icon-right" title="新建文档" style="right: 20px"
               v-if="anotherFolder.isHover" @click.stop="showCreateDoc(1,anotherFolder.folderId)"/>
          </div>
          <transition appear>
            <div class="first-folder-content" v-if="anotherFolder.isActive">
              <div class="doc-box" v-for="(doc) in anotherFolder.folderDocs" @click="openDoc(doc,anotherFolder.folderId)"
                   @mouseenter="showIcon(doc)" @mouseleave="hideIcon(doc)">
                <div style="margin-left: 37px;display: flex;">
                  <div class="doc-font" :title="doc.docName">
                    <i class="el-icon-document">{{doc.docName}}</i>
                  </div>
                  <i class="el-icon-edit-outline folder-tool-icon folder-tool-icon-right" style="right: 20px"
                     title="重命名" v-if="doc.isHover" @click.stop="showRenameDoc(doc,1,anotherFolder.folderId)"/>
                  <i class="el-icon-delete folder-tool-icon folder-tool-icon-right"
                     title="删除" v-if="doc.isHover" @click.stop="confirmDelDoc(doc)"/>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 对话框-->
    <el-dialog title="重命名文档" :visible="renameDocVisible" :close-on-click-modal=false :before-close="beClose" class="dialog-box" :append-to-body="true" >
      <el-input v-model="renameDoc.newName" placeholder="请输入文档名" maxlength="12" show-word-limit>
        <el-button slot="append" @click="postRenameDoc">确认</el-button>
      </el-input>
    </el-dialog>
    <el-dialog title="新建文档" :visible="createDocVisible" :close-on-click-modal=false :before-close="beClose" class="dialog-box" :append-to-body="true" >
      <div style="width: 90%;margin-left: 5%">
        <el-input v-model="newDoc.name" placeholder="请输入文档名" maxlength="12" show-word-limit></el-input>
        <div style="margin-top: 20px;text-align: left;display: flex">
          <el-select v-model="createMod" placeholder="请选择模板">
            <el-option label="空" value="0"></el-option>
            <el-option label="会议纪要" value="1"></el-option>
            <el-option label="需求规格说明书" value="2"></el-option>
            <el-option label="软件项目计划书" value="3"></el-option>
            <el-option label="架构设计说明书" value="4"></el-option>
          </el-select>
          <el-button size="small" type="primary" style="color: white;font-size: 16px;margin-left: 35%" @click="createDoc()">创 建</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="新建文件夹" :visible="createFolderVisible" :close-on-click-modal=false :before-close="beClose" class="dialog-box" :append-to-body="true" >
      <el-input v-model="newFolder.name" placeholder="请输入文件夹名" maxlength="12" show-word-limit>
        <el-button slot="append" @click="createFolder">确认</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "multiFolder",
  props:['team_id','team_name'],
  data() {
    let projectsList = [
      {
        isHover: false,
        isActive: false,
        projectId: '',
        projectName: "",
        projectDocs: [
          {
            isHover: false,
            docId: '',
            docName: '',
            docRoom: '',
            type: 'project_document',
            openType:'',
            content: {},
          },
        ]
      },
    ];
    let projectsFolder = {
      isActive: false,
      projectsList
    };
    let otherFolders = [
      {
        isHover: false,
        isActive: false,
        folderId: '',
        folderName: '',
        folderDocs: [
          {
            isHover: false,
            docId: '',
            docName: '',
            docRoom: '',
            type: 'other_document',
            openType:'',
            content: {},
          },
        ]
      },
    ]
    return {
      tempModelJson: {},
      createMod:'',
      createFolderVisible: false,
      newFolder:{
        isHover: false,
        name: ''
      },
      createDocVisible: false,
      newDoc: {
        projectId: '',
        folderId: '',
        name: '',
        type: 0 //0在项目内,1在项目外
      },
      renameDocVisible: false,
      renameDoc: {
        docId: '',
        newName: '',
        type: '',
        projectId: '',
        folderId: '',
        content: {},
        openType: '',
      },
      username:'',
      projectsFolder,
      otherFolders,
      currentDoc:{
        project_id: '',
        folder_id: '',
        docId: '',
        docName: '',
        docRoom: '',
        openType:'',
        content: {},
        type: '',
      },
    }
  },
  methods: {

    changeType(item) {
      item.openType = '';
    },

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

    beClose(){
      this.renameDocVisible = false; this.renameDoc={id:'',newName:'',docId:'',type:'',projectId:'',folderId: '',content: '',openType: ''};
      this.createDocVisible = false; this.newDoc={projectId: '', folderId: '', name: '', type: 0};
      this.createFolderVisible = false; this.newFolder.name='';
    },
    showIcon(item){item.isHover=true},
    hideIcon(item){item.isHover=false},
    reverseVisible(item){item.isActive = !item.isActive;},
    showCreateFolder(){this.createFolderVisible = true;},
    showRenameDoc(doc,type,id){
      this.renameDoc = {
        docId: doc.docId,
        newName: doc.docName,
        projectId: id,
        folderId: id,
        type: type===0 ? 'project_document':'other_document',
        content: doc.content,
        openType: doc.openType,
      }
      this.renameDocVisible = true;
    },
    showCreateDoc(type,id){
      if(type===0){
        this.newDoc.type = 0; //项目内
        this.newDoc.projectId = id;
      } else {
        this.newDoc.type = 1;
        this.newDoc.folderId = id;
      }
      this.createDocVisible = true;
    },
    openDoc(doc ,id){
      this.currentDoc = {
        project_id: id,
        folder_id: id,
        docId: doc.docId,
        docName: doc.docName,
        docRoom: doc.docRoom,
        openType: doc.openType,
        content: doc.content,
        type: doc.type,
      }
      this.$emit('input',this.currentDoc);
      this.$parent.changeRoom();
      doc.openType = '';
    },
    getNowUser() {
      this.$axios({
            method : 'post',
            url : 'http://101.42.160.94:8000/api/user_web/get_user',
            headers:{
              'Authorization':localStorage.getItem('Token'),
            }
          }
      ).then((ret) => {
        if (ret.data.errno === 0) {
          console.log(ret.data.data);
          this.username = ret.data.data.username;
          this.userId=ret.data.data.user_id;
        } else {
          this.$notify.error(ret.data.msg);
        }
      })
    },
    createFolder(){
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/create_folder',
          JSON.stringify({
            team_id: this.team_id,
            folder_name: this.newFolder.name,
          })
      ).then((res) => {
        console.log(res);
        if (res.data.errno === 0) {
          this.$message.success("文件夹 "+this.newFolder.name+" 创建成功");
          this.getTeamAllDocs();
          this.beClose();
        } else this.$notify.error(res.data.msg);
      }).catch((error)=>{console.log(error)})
    },
    createDoc() {
      this.chooseModel(this.createMod)
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/create_document',
          JSON.stringify({
            project_id: this.newDoc.projectId,
            folder_id: this.newDoc.folderId,
            title: this.newDoc.name,
            document_type: this.newDoc.type===0?'project_document':'other_document',
            content: this.tempModelJson,
          })
      ).then((res)=>{
        console.log(res);
        if(res.data.errno===0){
          this.$message.success("文档创建成功");
          this.getTeamAllDocs();
          this.beClose();
        } else this.$notify.error(res.data.msg);
      }).catch((error)=>{console.log(error)})
    },
    postRenameDoc(){
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/update_title',
          JSON.stringify({
            new_title: this.renameDoc.newName,
            document_id: this.renameDoc.docId,
            project_id: this.renameDoc.projectId,
            folder_id: this.renameDoc.folderId,
            document_type: this.renameDoc.type,
          })
      ).then((res)=>{
        if(res.data.errno===0){
          this.$message.success("重命名成功");
          this.getTeamAllDocs();
          if(this.currentDoc.docId===this.renameDoc.docId && this.currentDoc.type===this.renameDoc.type){
            this.currentDoc.docName = this.renameDoc.newName;
            this.$emit('input',this.currentDoc);
          }
          this.beClose();
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },
    confirmDelDoc(doc) {
      this.$confirm('将彻底删除文档 '+doc.docName+' （无法撤销），是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delDoc(doc)
      }).catch(()=>{})
    },
    delDoc(doc){
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/delete_document',
          JSON.stringify({
            document_id: doc.docId,
            document_type: doc.type
          })
      ).then((res)=>{
        if(res.data.errno===0){
          this.$notify.success("文档 "+doc.docName+" 已删除");
          this.getTeamAllDocs();
          if(this.currentDoc.docId===doc.docId && this.currentDoc.type===doc.type){
            this.currentDoc={project_id:'',folder_id:'',docId:'',docName:'',docRoom:'initial_#'+this.$route.query.teamId+'q6Ul'+this.$route.query.teamId+'Q3nC3'+this.$route.query.teamId+'g3XEo'+this.$route.query.teamId[0],openType:'',content:{},type:'',};
            this.openDoc(this.currentDoc)
          }
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },
    confirmDelFolder(folder) {
      this.$confirm('将彻底删除文件夹 '+folder.folderName+' 及其下的文档，是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delFolder(folder)
      }).catch(()=>{})
    },
    delFolder(folder){
      this.$axios.post(
          'http://101.42.160.94:8000/api/user_web/delete_folder',
          JSON.stringify({
            folder_id: folder.folderId
          })
      ).then((res)=>{
        if(res.data.errno===0){
          this.$notify.success("文件夹 "+folder.folderName+" 已整体删除");
          this.getTeamAllDocs();
          if(this.currentDoc.folder_id===folder.folderId){
            this.currentDoc={project_id:'',folder_id:'',docId:'',docName:'',docRoom:'initial_#'+this.$route.query.teamId+'q6Ul'+this.$route.query.teamId+'Q3nC3'+this.$route.query.teamId+'g3XEo'+this.$route.query.teamId[0],openType:'',content:{},type:'',};
            this.openDoc(this.currentDoc)
          }
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },
    getAllProjectsDocs(){
      this.projectsFolder = {
        isActive: false,
        projectsList: []
      }
      this.$axios.post(
          "http://43.138.22.20:8000/api/user/check_team_project",
          qs.stringify({
            team_id: this.team_id,
          }))
          .then((res) => {
            if(res.data.errno===0){
              let array = res.data.data;
              for(let i in array){
                if(array[i].recycle===0){
                  this.projectsFolder.projectsList.push({
                    isHover: false,
                    isActive: false,
                    projectId: array[i].project_id,
                    projectName: array[i].project_name,
                    projectDocs: [],
                  });
                }
              }
              for (let i in this.projectsFolder.projectsList){
                this.$axios.post(
                    'http://43.138.22.20:8000/api/user/check_project_document',
                    qs.stringify({
                      project_id: this.projectsFolder.projectsList[i].projectId,
                    })
                ).then((res)=>{
                  if(res.data.errno===0){
                    let docArray = res.data.data;
                    for (let j in docArray){
                      this.projectsFolder.projectsList[i].projectDocs.push({
                        isHover: false,
                        docId: docArray[j].document_id,
                        docName: docArray[j].title,
                        docRoom: docArray[j].room_name,
                        type: 'project_document',
                        content: docArray[j].content,
                        openType: docArray[j].open_type
                      })
                    }
                  } else this.$notify.error(res.data.msg)
                }).catch((error)=>{console.log(error)})
              }
              //console.log(this.projectsFolder)
            } else this.$notify.error(res.data.msg);
          }).catch((error) => {console.log(error)})
    },
    getOtherFoldersDocs(){
      this.otherFolders = [];
      this.$axios.post(
          'http://43.138.22.20:8000/api/user/check_team_folder',
          qs.stringify({
            team_id: this.team_id,
          })
      ).then((res)=>{
        if(res.data.errno===0){
          let array = res.data.data;
          for(let i in array){
            this.otherFolders.push({
              isHover: false,
              isActive: false,
              folderId: array[i].folder_id,
              folderName: array[i].folder_name,
              folderDocs: [],
            })
          }
          for(let i in this.otherFolders){
            this.$axios.post(
                'http://43.138.22.20:8000/api/user/check_folder_document',
                qs.stringify({
                  folder_id: this.otherFolders[i].folderId
                })
            ).then((res)=>{
              if(res.data.errno===0){
                let docArray = res.data.data;
                for(let j in docArray){
                  this.otherFolders[i].folderDocs.push({
                    isHover: false,
                    docId: docArray[j].document_id,
                    docName: docArray[j].title,
                    docRoom: docArray[j].room_name,
                    type: 'other_document',
                    content: docArray[j].content,
                    openType: docArray[j].open_type
                  })
                }
              } else this.$notify.error(res.data.msg)
            }).catch((error)=>{console.log(error)})}
        } else this.$notify.error(res.data.msg)
      }).catch((error)=>{console.log(error)})
    },
    getTeamAllDocs(){
      this.getAllProjectsDocs();
      this.getOtherFoldersDocs();
    }
  },
  created() {
    this.getNowUser();
    this.getTeamAllDocs();
  },
  mounted() {
  }
}
</script>

<style scoped>
.v-enter {transform: translateY(-20%);opacity: 0;}
.v-enter-to {transform: translateY(0);opacity: 1;}
.v-enter-active {transition: 0.25s;}
.v-leave {opacity: 1;transform: translateY(0);}
.v-leave-to {transform: translateY(-20%);opacity: 0;}
.v-leave-active {transition: 0.25s;}
.font-1 {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
}
.dialog-box{
  width:60%;
  margin-left: 20%;
}
.multi-level-folders-box {
  position: relative;
  text-align: left;
  transition: all 0.25s;
  font-size: 20px;
  line-height: 35px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.multi-level-folders-title{
  text-align: center;
}
.multi-level-folders-content{
}
.first-folder{
  
}
.first-folder-title{
  cursor: pointer;
  transition: all 0.5s;
}
.first-folder-title:hover{
  background-color: whitesmoke;
  color: dodgerblue;
}
.first-folder-content{

}
.second-folder{

}
.second-folder-title{
  cursor: pointer;
  transition: all 0.5s;
}
.second-folder-title:hover{
  background-color: whitesmoke;
  color: dodgerblue;
}
.second-folder-content{

}
.doc-box{
  min-width: 0;
  max-width: 100%;
  cursor: pointer;
  transition: all 0.5s;
}
.doc-box:hover{
  color: dodgerblue;
  background-color: whitesmoke;
}
.doc-font{
  max-width: 198px;
  margin-right: 5px;
  width: 97%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.25s;
}
.doc-font:hover{
}
.folder-tool-icon{
  margin-top: 10px;
  font-size: 15px;
}
.folder-tool-icon-right{
  float: right;
  margin-left: 5px;
  margin-right: 5px;
}
</style>