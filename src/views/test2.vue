<!-- drag-test -->
<template>
  <v-row justify="center">
    <v-expansion-panels popout>
      <v-expansion-panel
          v-for="(item,i) in 5"
          :key="i"
      >
        <v-expansion-panel-header>Item</v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
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