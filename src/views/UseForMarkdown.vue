<template>
  <div>
    <article v-html="htmlText" class="markdown-body"></article>
    <article v-html="htmlCode" class="markdown-body"></article>
  </div>
</template>
<script>
import "/node_modules/github-markdown-css/github-markdown.css"
import showdown from 'showdown';
let converter = new showdown.Converter();
// 显示表格
converter.setOption("tables",true);

export default {
  name: "Home",
  data(){
    return{
      htmlText: '',
      htmlCode: ''
    }
  },
  mounted(){
    this.test();
  },
  methods: {
    test(){
      let text= `# hello`;
      this.htmlText = converter.makeHtml(text);

      let code = `
            public void main(){
                System.out.println();
            }`;
      this.htmlCode=converter.makeHtml(code);

    }
  }
}
</script>
<style scoped>
</style>
