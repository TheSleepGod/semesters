<!-- drag-test -->
<template>
  <v-navigation-drawer v-model="drawer" app right expand-on-hover>
      <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="items"
          activatable
          item-key="name"
          open-on-click
          style="text-align: left"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.file">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon>
            {{ files[item.file] }}
          </v-icon>
        </template>
      </v-treeview>
  </v-navigation-drawer>
</template>




<script>
import 'font-awesome/css/font-awesome.min.css'
export default {
  components: {

  },
  data() {
    return {
      initiallyOpen: ['public'],
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
      items: [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logo.png',
                file: 'png',
              }],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
        },
        {
          name: 'babel.config.js',
          file: 'js',
        },
        {
          name: 'package.json',
          file: 'json',
        },
        {
          name: 'README.md',
          file: 'md',
        },
        {
          name: 'vue.config.js',
          file: 'js',
        },
        {
          name: 'yarn.lock',
          file: 'txt',
        },
      ],
      drawer:true,
      projectList :[
        {
          teamId: 1,
          teamName: "ababab",
        },
        {
          teamId: 2,
          teamName: "cdcdcdcd",
        },
        {
          teamId: 3,
          teamName: "efefefef",
        },
        {
          teamId: 4,
          teamName: "ghghghghghg",
        }
      ],
      docList : [
        {
          projectId: 1,
          projectName: "test1",
        },
        {
          projectId: 2,
          projectName: "test2",
        },
        {
          projectId: 3,
          projectName: "test3",
        },
        {
          projectId: 4,
          projectName: "test4",
        }
      ],
      message:1,
      message2:2,
    }
  },
};
</script>

<style>
.el-menu{
  text-align: left;
}
.el-submenu{
  text-align: left;
}
.el-menu-item{
  text-align: left !important;
}
</style>