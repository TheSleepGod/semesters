<!-- drag-test -->
<template>
  <el-container>
      <el-aside class="aside" style="background-color: #ffd;">
          <div class="newCreate" @click="switchVis"><i class="el-icon-document-add"></i>&nbsp&nbsp新建原型图</div>
        <el-dialog title="新建原型图" :visible.sync="createVisible" style="width:60%;margin-left: 20%">
          <div style="margin-bottom: 30px">
          <el-select v-model="model_value" placeholder="请选择" @change="getModel">
            <el-option
                v-for="item in models"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
          </div>
          <el-input v-model="newName" placeholder="请输入原型图名称" maxlength="20" show-word-limit>
            <el-button slot="append" @click="CreatePic">确认</el-button>
          </el-input>
        </el-dialog>
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
            <div @contextmenu.prevent="onContextmenu($event,item)" @click="loadDesign(item.id)"  style="position: relative; float: left">
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon v-else>
                {{ files[item.file]}}
              </v-icon>
            </div>
            <div @contextmenu.prevent="onContextmenu($event,item)" style="height: 30px; width: 200px; position: relative; float: right; margin-right: -200px;" @click="loadDesign(item.id)"></div>
          </template>
        </v-treeview>
      </el-aside>

      <el-main class="main_area">
        <div id="example">
        <div class="container">
          <div id="bar">
            <h1 style="margin-left: 60px">{{this.name}}</h1>
            <button v-on:click="saveDesign">保存页面</button>
            <button v-on:click="exportHtml">导出页面</button>
            <button v-on:click="shareDesign">共享页面</button>
          </div>

            <EmailEditor ref="emailEditor" v-on:load="editorLoaded" v-on:ready="editorReady" />
          </div>
        </div>
      </el-main>

  </el-container>

</template>

<script>
import Contextmenu from "vue-contextmenujs"
import qs from 'qs'
Vue.use(Contextmenu);
import { EmailEditor } from '../components'
import sample from '../data/sample.json';
import Vue from  'vue'
export default {
  name: 'exampleView',
  components: {
    EmailEditor
  },
  data(){
    let nowProjectId;
    return{
      name:'设计图1',
      design:{},
      newName:'',
      createVisible:false,
      project_id:0,
      initiallyOpen: ['原型图列表'],
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
        name:'原型图列表',
        children: [

        ]
      }
      ],
      nowProjectId,
      model_value:0,
      model_id:0,
      models_list:[
        {
          id:1,
          content:{"body": {"id": "e2GMI9z2f3", "rows": [{"id": "WZZinwj54m", "cells": [1], "values": {"_meta": {"htmlID": "u_row_13", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "DXpVpOu8m7", "values": {"_meta": {"htmlID": "u_column_16", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "_f-n1oDkni", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_6", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "5px", "displayCondition": null}}]}]}, {"id": "aRNgKLMGp8", "cells": [1, 1, 1], "values": {"_meta": {"htmlID": "u_row_1", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "zbO-jB6wGz", "values": {"_meta": {"htmlID": "u_column_1", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "kWbxbD92Qx", "type": "menu", "values": {"menu": {"items": [{"key": "1606923979328", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "NEWS"}, {"key": "1606924033905", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "SERVICE"}]}, "_meta": {"htmlID": "u_content_menu_3", "htmlClassNames": "u_content_menu"}, "align": "center", "anchor": "", "layout": "horizontal", "padding": "5px 15px", "fontSize": "14px", "hideable": true, "deletable": true, "draggable": true, "linkColor": "#0068A5", "separator": "", "textColor": "#444444", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "25px 10px 10px", "displayCondition": null}}]}, {"id": "R7xQJsw939", "values": {"_meta": {"htmlID": "u_column_2", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "bSa-do6zGe", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606906849237-logo.png", "width": 248, "height": 56, "maxWidth": "77%", "autoWidth": false}, "_meta": {"htmlID": "u_content_image_1", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "_override": {"mobile": {"src": {"maxWidth": "58%", "autoWidth": false}}}, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "20px 10px", "displayCondition": null}}]}, {"id": "wmkU4S4UUO", "values": {"_meta": {"htmlID": "u_column_3", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "Vc7rwyjtPu", "type": "menu", "values": {"menu": {"items": [{"key": "1606923979328", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "ABOUT"}, {"key": "1606924033905", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "CONTACT"}]}, "_meta": {"htmlID": "u_content_menu_2", "htmlClassNames": "u_content_menu"}, "align": "center", "anchor": "", "layout": "horizontal", "padding": "5px 15px", "fontSize": "14px", "hideable": true, "deletable": true, "draggable": true, "linkColor": "#0068A5", "separator": "", "textColor": "#444444", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "25px 10px 30px", "displayCondition": null}}]}]}, {"id": "fcsuah3IFN", "cells": [1], "values": {"_meta": {"htmlID": "u_row_3", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "https://cdn.templates.unlayer.com/assets/1606924485372-1.jpg", "cover": false, "width": 626, "center": true, "height": 500, "repeat": false, "fullWidth": false}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "-kBllEXJCq", "values": {"_meta": {"htmlID": "u_column_5", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "5wF5CeEKuM", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_2", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "150px 10px 10px", "displayCondition": null}}, {"id": "VnM9_ERzdf", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-family: Montserrat, sans-serif; font-size: 14px; line-height: 19.6px;\"><strong><span style=\"font-size: 44px; line-height: 61.6px;\">NEW ARRIVAL</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_1", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "FwbdJ6Mn94", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<strong><span style=\"font-size: 14px; line-height: 16.8px;\">VIEW MORE</span></strong>", "_meta": {"htmlID": "u_content_button_1", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "12px 22px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#463a41", "hoverColor": "#FFFFFF", "backgroundColor": "#ffffff", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 134, "calculatedHeight": 40, "containerPadding": "10px 10px 50px", "displayCondition": null}}]}]}, {"id": "O9kV5tZSPu", "cells": [1], "values": {"_meta": {"htmlID": "u_row_5", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "k6gEAGoWRi", "values": {"_meta": {"htmlID": "u_column_7", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "zShZNjqeJI", "type": "text", "values": {"text": "<p style=\"line-height: 140%; font-size: 14px;\"><span style=\"line-height: 33.6px; font-size: 24px; font-family: 'Playfair Display', serif;\"><span style=\"line-height: 33.6px; font-size: 24px;\"><strong>Purchasing Focal Just got easier</strong></span></span></p>", "_meta": {"htmlID": "u_content_text_2", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "40px 10px 10px", "displayCondition": null}}, {"id": "BR7uRoNV2m", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">Lorem ipsum dolor sit amet,&nbsp;</span></p>", "_meta": {"htmlID": "u_content_text_11", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "0px 10px 40px", "displayCondition": null}}]}]}, {"id": "J_QtlBAmat", "cells": [1, 1], "values": {"_meta": {"htmlID": "u_row_4", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "76P0VfXgRc", "values": {"_meta": {"htmlID": "u_column_6", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "PeMPTKUlGF", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606934810497-02.png", "width": 626, "height": 418}, "_meta": {"htmlID": "u_content_image_3", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "wobdBjUHWQ", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">Ray-Ban</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_3", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px 10px 0px", "displayCondition": null}}, {"id": "4cJlL7AvBi", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">$20</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_4", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "MK5XuDmwq1", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<span style=\"font-size: 14px; line-height: 16.8px;\">Buy Now</span>", "_meta": {"htmlID": "u_content_button_2", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "10px 20px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#FFFFFF", "hoverColor": "#FFFFFF", "backgroundColor": "#262425", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 104, "calculatedHeight": 36, "containerPadding": "10px", "displayCondition": null}}]}, {"id": "V-xrZ3AQ41", "values": {"_meta": {"htmlID": "u_column_10", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "iSf2g08b2P", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606932761674-2.jpg", "width": 626, "height": 417}, "_meta": {"htmlID": "u_content_image_2", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "VfG64opnnf", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">Ray-Ban</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_5", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px 10px 0px", "displayCondition": null}}, {"id": "mqHGLyzAkZ", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">$25</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_6", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "H5QomT8Uhk", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<span style=\"font-size: 14px; line-height: 16.8px;\">Buy Now</span>", "_meta": {"htmlID": "u_content_button_3", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "10px 20px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#FFFFFF", "hoverColor": "#FFFFFF", "backgroundColor": "#262425", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 104, "calculatedHeight": 36, "containerPadding": "10px", "displayCondition": null}}]}]}, {"id": "n3Ng2XCA5I", "cells": [1], "values": {"_meta": {"htmlID": "u_row_8", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "CiwS3z6DVI", "values": {"_meta": {"htmlID": "u_column_11", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "64uw8gjQ92", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 160%;\"><span style=\"font-size: 14px; line-height: 22.4px;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;</span></p>", "_meta": {"htmlID": "u_content_text_7", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "160%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "30px 30px 40px", "displayCondition": null}}]}]}, {"id": "9zZkbJnYcI", "cells": [1], "values": {"_meta": {"htmlID": "u_row_7", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "https://cdn.templates.unlayer.com/assets/1606937518713-ASASS.png", "cover": false, "width": 600, "center": true, "height": 500, "repeat": false, "fullWidth": false}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "dnOvK9l79S", "values": {"_meta": {"htmlID": "u_column_9", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "YRU55GVJKb", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 120%;\"><span style=\"font-size: 32px; line-height: 38.4px;\"><strong><span style=\"line-height: 38.4px; font-size: 32px;\">ABOUT OUR</span></strong></span></p>\n<p style=\"font-size: 14px; line-height: 120%;\"><span style=\"font-size: 32px; line-height: 38.4px;\"><strong><span style=\"line-height: 38.4px; font-size: 32px;\"> PRODUCT</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_8", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "left", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "60px 30px 0px", "displayCondition": null}}, {"id": "2x6Vl-zwKZ", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">Lorem ipsum dolor sit amet, consectetur </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">adipiscing elit, sed do eiusmod tempor </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">incididunt ut labore et dolore magna </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">aliqua.</span><span style=\"line-height: 19.6px; font-size: 14px;\">enim ad minim veniam, quis nostrud </span></span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">exercitation ullamco</span><span style=\"line-height: 19.6px; font-size: 14px;\">&nbsp;</span></span></p>", "_meta": {"htmlID": "u_content_text_9", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "left", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "22px 30px 10px", "displayCondition": null}}, {"id": "HCivtnzw3g", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<strong><span style=\"font-size: 14px; line-height: 16.8px;\">VIEW MORE</span></strong>", "_meta": {"htmlID": "u_content_button_4", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "12px 25px", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "textAlign": "left", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#252324", "hoverColor": "#FFFFFF", "backgroundColor": "#ffffff", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 139, "calculatedHeight": 40, "containerPadding": "10px 30px 40px", "displayCondition": null}}]}]}, {"id": "PpFmGrdRFj", "cells": [1], "values": {"_meta": {"htmlID": "u_row_9", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "5Rt1f2y_m7", "values": {"_meta": {"htmlID": "u_column_12", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "rZIE89v57C", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_4", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "15px", "displayCondition": null}}]}]}, {"id": "qbI32Ef7CN", "cells": [1], "values": {"_meta": {"htmlID": "u_row_11", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#d4ae7f"}, "columns": [{"id": "-yzQHACtld", "values": {"_meta": {"htmlID": "u_column_14", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "DSoilNCWZe", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; font-family: Montserrat, sans-serif;\"><strong><span style=\"line-height: 19.6px; font-size: 14px;\">FOLLOW&nbsp; US&nbsp; ON</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_10", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "20px 10px 10px", "displayCondition": null}}, {"id": "LeZA5GEP9f", "type": "social", "values": {"_meta": {"htmlID": "u_content_social_1", "htmlClassNames": "u_content_social"}, "align": "center", "icons": {"icons": [{"url": "https://facebook.com/", "name": "Facebook"}, {"url": "https://instagram.com/", "name": "Instagram"}, {"url": "https://twitter.com/", "name": "Twitter"}], "editor": {"data": {"customIcons": [], "customOptions": [], "showDefaultIcons": true, "showDefaultOptions": true}}, "iconType": "circle-white"}, "anchor": "", "spacing": 10, "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "0px 10px 20px", "displayCondition": null}}]}]}, {"id": "LdkYiSLv-J", "cells": [1], "values": {"_meta": {"htmlID": "u_row_12", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "NDfS_v0BdS", "values": {"_meta": {"htmlID": "u_column_15", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "9YBwq-I7gZ", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_5", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}]}]}], "values": {"_meta": {"htmlID": "u_body", "htmlClassNames": "u_body"}, "linkStyle": {"body": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textColor": "#000000", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "popupWidth": "600px", "popupHeight": "auto", "borderRadius": "10px", "contentAlign": "center", "contentWidth": "600px", "popupPosition": "center", "preheaderText": "", "backgroundColor": "#e8d4bb", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "contentVerticalAlign": "center", "popupBackgroundColor": "#FFFFFF", "popupBackgroundImage": {"url": "", "cover": true, "center": true, "repeat": false, "fullWidth": true}, "popupCloseButton_action": {"name": "close_popup", "attrs": {"onClick": "document.querySelector('.u-popup-container').style.display = 'none';"}}, "popupCloseButton_margin": "0px", "popupCloseButton_position": "top-right", "popupCloseButton_iconColor": "#000000", "popupOverlay_backgroundColor": "rgba(0, 0, 0, 0.1)", "popupCloseButton_borderRadius": "0px", "popupCloseButton_backgroundColor": "#DDDDDD"}}, "counters": {"u_row": 13, "u_column": 16, "u_content_menu": 3, "u_content_text": 11, "u_content_image": 3, "u_content_button": 4, "u_content_social": 1, "u_content_divider": 6}, "schemaVersion": 9}
        },
        {
          id:2,
          content: {"body": {"id": "O7pz-xezpp", "rows": [{"id": "PXcJdgfcZW", "cells": [1], "values": {"_meta": {"htmlID": "u_row_13", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "286dDAr1so", "values": {"_meta": {"htmlID": "u_column_16", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "B7Z3RAIeE8", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_6", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "5px", "displayCondition": null}}]}]}, {"id": "6OwvnzfDxv", "cells": [1, 1, 1], "values": {"_meta": {"htmlID": "u_row_1", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "cY_Jcl37_0", "values": {"_meta": {"htmlID": "u_column_1", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "XI4g4_Wu6m", "type": "menu", "values": {"menu": {"items": [{"key": "1606923979328", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "NEWS"}, {"key": "1606924033905", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "SERVICE"}]}, "_meta": {"htmlID": "u_content_menu_3", "htmlClassNames": "u_content_menu"}, "align": "center", "anchor": "", "layout": "horizontal", "padding": "5px 15px", "fontSize": "14px", "hideable": true, "deletable": true, "draggable": true, "linkColor": "#0068A5", "separator": "", "textColor": "#444444", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "25px 10px 10px", "displayCondition": null}}]}, {"id": "c5G0oOpNc-", "values": {"_meta": {"htmlID": "u_column_2", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "gItwUsmLk-", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606906849237-logo.png", "width": 248, "height": 56, "maxWidth": "77%", "autoWidth": false}, "_meta": {"htmlID": "u_content_image_1", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "_override": {"mobile": {"src": {"maxWidth": "58%", "autoWidth": false}}}, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "20px 10px", "displayCondition": null}}]}, {"id": "sVsb8NtLlx", "values": {"_meta": {"htmlID": "u_column_3", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "EgM3eCvXlO", "type": "menu", "values": {"menu": {"items": [{"key": "1606923979328", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "ABOUT"}, {"key": "1606924033905", "link": {"name": "web", "values": {"href": "", "target": "_self"}}, "text": "CONTACT"}]}, "_meta": {"htmlID": "u_content_menu_2", "htmlClassNames": "u_content_menu"}, "align": "center", "anchor": "", "layout": "horizontal", "padding": "5px 15px", "fontSize": "14px", "hideable": true, "deletable": true, "draggable": true, "linkColor": "#0068A5", "separator": "", "textColor": "#444444", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "25px 10px 30px", "displayCondition": null}}]}]}, {"id": "KsW9L1RMHB", "cells": [1], "values": {"_meta": {"htmlID": "u_row_3", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "https://cdn.templates.unlayer.com/assets/1606924485372-1.jpg", "cover": false, "width": 626, "center": true, "height": 500, "repeat": false, "fullWidth": false}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "qo0LbUWlO0", "values": {"_meta": {"htmlID": "u_column_5", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "Ilcw5qFNhQ", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-family: Montserrat, sans-serif; font-size: 14px; line-height: 19.6px;\"><strong><span style=\"font-size: 44px; line-height: 61.6px;\">NEW ARRIVAL</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_1", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "1RdSwtQRiF", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<strong><span style=\"font-size: 14px; line-height: 16.8px;\">VIEW MORE</span></strong>", "_meta": {"htmlID": "u_content_button_1", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "12px 22px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#463a41", "hoverColor": "#FFFFFF", "backgroundColor": "#ffffff", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 134, "calculatedHeight": 40, "containerPadding": "10px 10px 50px", "displayCondition": null}}]}]}, {"id": "ZIm73ojZtD", "cells": [1], "values": {"_meta": {"htmlID": "u_row_5", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "cttmIDU2-A", "values": {"_meta": {"htmlID": "u_column_7", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "vAMx_5XXml", "type": "text", "values": {"text": "<p style=\"line-height: 140%; font-size: 14px;\"><span style=\"line-height: 33.6px; font-size: 24px; font-family: 'Playfair Display', serif;\"><span style=\"line-height: 33.6px; font-size: 24px;\"><strong>Purchasing Focal Just got easier</strong></span></span></p>", "_meta": {"htmlID": "u_content_text_2", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "40px 10px 10px", "displayCondition": null}}, {"id": "hllSl66t51", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">Lorem ipsum dolor sit amet,&nbsp;</span></p>", "_meta": {"htmlID": "u_content_text_11", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "0px 10px 40px", "displayCondition": null}}]}]}, {"id": "LGYlSpg5ks", "cells": [1, 1], "values": {"_meta": {"htmlID": "u_row_4", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "p_rKsmOiwl", "values": {"_meta": {"htmlID": "u_column_6", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "TUWU0d6BIi", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606934810497-02.png", "width": 626, "height": 418}, "_meta": {"htmlID": "u_content_image_3", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "Wgqt0pQkFb", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">Ray-Ban</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_3", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px 10px 0px", "displayCondition": null}}, {"id": "Y_IOQtqEWS", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">$20</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_4", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "uNEflnfL7W", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<span style=\"font-size: 14px; line-height: 16.8px;\">Buy Now</span>", "_meta": {"htmlID": "u_content_button_2", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "10px 20px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#FFFFFF", "hoverColor": "#FFFFFF", "backgroundColor": "#262425", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 104, "calculatedHeight": 36, "containerPadding": "10px", "displayCondition": null}}]}, {"id": "N7p8G2FzcL", "values": {"_meta": {"htmlID": "u_column_10", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "ZRh1LHDdy8", "type": "image", "values": {"src": {"url": "https://cdn.templates.unlayer.com/assets/1606932761674-2.jpg", "width": 626, "height": 417}, "_meta": {"htmlID": "u_content_image_2", "htmlClassNames": "u_content_image"}, "action": {"name": "web", "values": {"href": "", "target": "_blank"}}, "anchor": "", "altText": "Image", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "uuIFRK2wZd", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">Ray-Ban</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_5", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px 10px 0px", "displayCondition": null}}, {"id": "twlJd9E8Id", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px;\"><strong><span style=\"line-height: 22.4px; font-size: 16px;\">$25</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_6", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}, {"id": "cquPk5_Vfy", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<span style=\"font-size: 14px; line-height: 16.8px;\">Buy Now</span>", "_meta": {"htmlID": "u_content_button_3", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "10px 20px", "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#FFFFFF", "hoverColor": "#FFFFFF", "backgroundColor": "#262425", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 104, "calculatedHeight": 36, "containerPadding": "10px", "displayCondition": null}}]}]}, {"id": "KixuaxDPrH", "cells": [1], "values": {"_meta": {"htmlID": "u_row_8", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "aGF8bP3TOm", "values": {"_meta": {"htmlID": "u_column_11", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "-nPCCqIFMN", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 160%;\"><span style=\"font-size: 14px; line-height: 22.4px;\">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;</span></p>", "_meta": {"htmlID": "u_content_text_7", "htmlClassNames": "u_content_text"}, "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "160%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "30px 30px 40px", "displayCondition": null}}]}]}, {"id": "0yHRgAEVFl", "cells": [1], "values": {"_meta": {"htmlID": "u_row_7", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "https://cdn.templates.unlayer.com/assets/1606937518713-ASASS.png", "cover": false, "width": 600, "center": true, "height": 500, "repeat": false, "fullWidth": false}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "LOdeqsyHyk", "values": {"_meta": {"htmlID": "u_column_9", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "YrkrdI5eyg", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 120%;\"><span style=\"font-size: 32px; line-height: 38.4px;\"><strong><span style=\"line-height: 38.4px; font-size: 32px;\">ABOUT OUR</span></strong></span></p>\n<p style=\"font-size: 14px; line-height: 120%;\"><span style=\"font-size: 32px; line-height: 38.4px;\"><strong><span style=\"line-height: 38.4px; font-size: 32px;\"> PRODUCT</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_8", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "left", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "60px 30px 0px", "displayCondition": null}}, {"id": "dmhsFdgQ3a", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">Lorem ipsum dolor sit amet, consectetur </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">adipiscing elit, sed do eiusmod tempor </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\">incididunt ut labore et dolore magna </span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">aliqua.</span><span style=\"line-height: 19.6px; font-size: 14px;\">enim ad minim veniam, quis nostrud </span></span></p>\n<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">exercitation ullamco</span><span style=\"line-height: 19.6px; font-size: 14px;\">&nbsp;</span></span></p>", "_meta": {"htmlID": "u_content_text_9", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "left", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "22px 30px 10px", "displayCondition": null}}, {"id": "7Bwujdxu2e", "type": "button", "values": {"href": {"name": "web", "values": {"href": "", "target": "_blank"}}, "size": {"width": "100%", "autoWidth": true}, "text": "<strong><span style=\"font-size: 14px; line-height: 16.8px;\">VIEW MORE</span></strong>", "_meta": {"htmlID": "u_content_button_4", "htmlClassNames": "u_content_button"}, "anchor": "", "border": {}, "padding": "12px 25px", "hideable": true, "_override": {"mobile": {"textAlign": "center"}}, "deletable": true, "draggable": true, "textAlign": "left", "hideMobile": false, "lineHeight": "120%", "selectable": true, "hideDesktop": false, "borderRadius": "0px", "buttonColors": {"color": "#252324", "hoverColor": "#FFFFFF", "backgroundColor": "#ffffff", "hoverBackgroundColor": "#3AAEE0"}, "duplicatable": true, "calculatedWidth": 139, "calculatedHeight": 40, "containerPadding": "10px 30px 40px", "displayCondition": null}}]}]}, {"id": "H7s_Wy2cMm", "cells": [1], "values": {"_meta": {"htmlID": "u_row_9", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#ffffff"}, "columns": [{"id": "HPOvf8_NO1", "values": {"_meta": {"htmlID": "u_column_12", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "G_DFt28qMi", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_4", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "15px", "displayCondition": null}}]}]}, {"id": "KNVLKyUDRL", "cells": [1], "values": {"_meta": {"htmlID": "u_row_11", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": "#d4ae7f"}, "columns": [{"id": "WeIMxH42f2", "values": {"_meta": {"htmlID": "u_column_14", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "MAedVmF6Wm", "type": "text", "values": {"text": "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; font-family: Montserrat, sans-serif;\"><strong><span style=\"line-height: 19.6px; font-size: 14px;\">FOLLOW&nbsp; US&nbsp; ON</span></strong></span></p>", "_meta": {"htmlID": "u_content_text_10", "htmlClassNames": "u_content_text"}, "color": "#ffffff", "anchor": "", "hideable": true, "deletable": true, "draggable": true, "linkStyle": {"inherit": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textAlign": "center", "hideMobile": false, "lineHeight": "140%", "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "20px 10px 10px", "displayCondition": null}}, {"id": "j_dPotONG-", "type": "social", "values": {"_meta": {"htmlID": "u_content_social_1", "htmlClassNames": "u_content_social"}, "align": "center", "icons": {"icons": [{"url": "https://facebook.com/", "name": "Facebook"}, {"url": "https://instagram.com/", "name": "Instagram"}, {"url": "https://twitter.com/", "name": "Twitter"}], "editor": {"data": {"customIcons": [], "customOptions": [], "showDefaultIcons": true, "showDefaultOptions": true}}, "iconType": "circle-white"}, "anchor": "", "spacing": 10, "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "0px 10px 20px", "displayCondition": null}}]}]}, {"id": "_67ORQTYeS", "cells": [1], "values": {"_meta": {"htmlID": "u_row_12", "htmlClassNames": "u_row"}, "anchor": "", "columns": false, "padding": "0px", "hideable": true, "deletable": true, "draggable": true, "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "noStackMobile": false, "backgroundColor": "", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "displayCondition": null, "columnsBackgroundColor": ""}, "columns": [{"id": "C8PeIapUGt", "values": {"_meta": {"htmlID": "u_column_15", "htmlClassNames": "u_column"}, "border": {}, "padding": "0px", "backgroundColor": ""}, "contents": [{"id": "pEVogd-VXE", "type": "divider", "values": {"_meta": {"htmlID": "u_content_divider_5", "htmlClassNames": "u_content_divider"}, "width": "100%", "anchor": "", "border": {"borderTopColor": "#BBBBBB", "borderTopStyle": "solid", "borderTopWidth": "0px"}, "hideable": true, "deletable": true, "draggable": true, "textAlign": "center", "hideMobile": false, "selectable": true, "hideDesktop": false, "duplicatable": true, "containerPadding": "10px", "displayCondition": null}}]}]}], "values": {"_meta": {"htmlID": "u_body", "htmlClassNames": "u_body"}, "linkStyle": {"body": true, "linkColor": "#0000ee", "linkUnderline": true, "linkHoverColor": "#0000ee", "linkHoverUnderline": true}, "textColor": "#000000", "fontFamily": {"url": "https://fonts.googleapis.com/css?family=Montserrat:400,700", "label": "Montserrat", "value": "'Montserrat',sans-serif", "defaultFont": true}, "popupWidth": "600px", "popupHeight": "auto", "borderRadius": "10px", "contentAlign": "center", "contentWidth": "600px", "popupPosition": "center", "preheaderText": "", "backgroundColor": "#e8d4bb", "backgroundImage": {"url": "", "cover": false, "center": true, "repeat": false, "fullWidth": true}, "contentVerticalAlign": "center", "popupBackgroundColor": "#FFFFFF", "popupBackgroundImage": {"url": "", "cover": true, "center": true, "repeat": false, "fullWidth": true}, "popupCloseButton_action": {"name": "close_popup", "attrs": {"onClick": "document.querySelector('.u-popup-container').style.display = 'none';"}}, "popupCloseButton_margin": "0px", "popupCloseButton_position": "top-right", "popupCloseButton_iconColor": "#000000", "popupOverlay_backgroundColor": "rgba(0, 0, 0, 0.1)", "popupCloseButton_borderRadius": "0px", "popupCloseButton_backgroundColor": "#DDDDDD"}}, "counters": {"u_row": 13, "u_column": 16, "u_content_menu": 3, "u_content_text": 11, "u_content_image": 3, "u_content_button": 4, "u_content_social": 1, "u_content_divider": 6}, "schemaVersion": 9},
        }
      ],
      models:[
        {
          label:"model1",
          value:0
        },
        {
          label:"model2",
          value:1
        }
      ],
    }
  },
  methods: {
    onContextmenu(event,item) {
      if(item.file){
        this.$contextmenu({
          items: [
            {
              label: "删除原型图",
              icon:'el-icon-document-delete',
              onClick: () => {
                let toSend={
                  test_id:item.id
                };
                //todo:删除原型图
                this.$axios({
                  method:'post',
                  url:'http://101.42.160.94:8000/api/user_web/delete_prototype',
                  data:JSON.stringify(toSend)
                }).then((res) =>{
                  console.log(res);
                  this.$message("del success");
                  this.ShowPrototype();
                })
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
    getModel(val){
      let obj={}
      obj = this.models.find((item)=>{
        return item.value === val;
      });
      let getName = ''
      getName = obj.value;
      this.model_value=getName;
      console.log(getName)
    },
    CreatePic(){
      this.design=this.models_list[this.model_value].content;
      this.$axios({
        method:'post',
        url : 'http://101.42.160.94:8000/api/user_web/try_prototype',
        data: this.design
      }).then((res) =>{
        console.log(res);
        this.putProToProject(res.data.test_id,this.project_id,this.newName);
        this.createVisible=false;
        this.$message('新建原型图成功！！');
        setTimeout(() =>{
          this.ShowPrototype();
        },500)
      })
    },
    switchVis(){
      this.createVisible=true;
    },
    // called when the editor is created
    editorLoaded() {
      console.log('editorLoaded');
      this.$refs.emailEditor.editor.loadDesign(sample);
    },
    // called when the editor has finished loading
    editorReady() {
      console.log('editorReady');
    },
    loadDesign(pid) {
      if(pid){
        let toSend = {id : pid};
        this.$axios({
          method:'post',
          url : 'http://101.42.160.94:8000/api/user_web/get_prototype',
          data : JSON.stringify(toSend)
        }).then((res) =>{
          console.log(res.data.data);
          this.design=res.data.data;
          console.log(this.design)
          setTimeout(() =>{
            this.$refs.emailEditor.editor.loadDesign(this.design);
          },500)
        });
      }
    },
    saveDesign() {
      this.$refs.emailEditor.editor.saveDesign(
          (design) => {
            this.$axios({
              method:'post',
              url : 'http://101.42.160.94:8000/api/user_web/try_prototype',
              data: design
            }).then((res) =>{
              console.log(res);
            })
            console.log('saveDesign');
            console.log(design);
            console.log(typeof design)
            this.design=design;
          }
      )
    },
    exportHtml() {
      this.$refs.emailEditor.editor.exportHtml(
          (data) => {
            console.log('exportHtml', data);
          }
      )
    },
    putProToProject(testId,projectId,title) {
      let param = {
        test_id: testId,
        title: title,
        project_id: projectId
      };
      this.$axios( {
        method: 'post',
        url: 'http://101.42.160.94:8000/api/user_web/update_prototype',
        data: JSON.stringify(param)
      }).then((res) => {
        console.log(res);
      }) 
    },
    //todo:分享页面
    shareDesign() {
      // this.saveDesign();
      // this.$axios.post(
      //     'http://101.42.160.94:8000/api/user_web/try_prototype',
      //     this.design
      // ).then((res)=>{
      //   if(res.data.errno===0){
      //     this.$message.success("上传成功,将为您生成共享界面");
      //     //Todo 绑定返回的 Id 和 projectId
      //   } else this.$notify.error(res.data.msg);
      // }).catch((error)=>{console.log(error)})
    },
    ShowPrototype(){
      this.items[0].children=[];
      let toSend = {
        project_id:this.project_id
      }
      this.$axios({
        method:'post',
        url:'http://43.138.22.20:8000/api/user/check_project_prototype',
        data:qs.stringify(toSend),
      }).then((res) =>{
        console.log(res);
        let ans=res.data;
        if(ans.errno===0){
          for(let i in ans.data){
            this.items[0].children.push({
              id:ans.data[i].prototype_id,
              name:ans.data[i].title,
              file: 'txt'
            })
          }
        }
      })
    }
  },
  mounted() {
    this.project_id = this.$route.query.projectId;
    setTimeout(() =>{
      this.ShowPrototype();
    },500);
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
.el-main  {
  padding: 0 !important;
}
.container{
  padding: 0 !important;
  max-width: 100% !important;
}
*, :after, :before {
  background-repeat: no-repeat;
  box-sizing: inherit;
}
#example {
  height: 100%;
  margin: 0px;
  padding: 0px;
  border: 0px;
}
#example .container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 800px;
}

#bar {
  flex: 1;
  background-color: #40B883;
  color: #FFF;
  padding: 10px;
  display: flex;
  max-height: 60px;
}

#bar h1 {
  flex: 1;
  font-size: 16px;
  text-align: left;
}

#bar button {
  flex: 1;
  padding: 10px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #000;
  color: #FFF;
  border: 0px;
  max-width: 150px;
  cursor: pointer;
}
.aside{
  border: 1px solid black;
}
.main_area{
  border: 1px solid black;
}
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

</style>