#!/bin/bash

# 安装依赖
cnpm install

# 打包
npm run build

# 删除 ngnix 指向的文件夹下的文件
rm -rf /home/www/*

# 将打包好的文件复制过去
mv /tmp/vue-automated-deployment/dist/* /home/www

# 删除 clone 的代码
rm -rf /tmp/vue-automated-deployment