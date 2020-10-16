---
title: IntelliJ IDEA的优化
date: 2020-7-11
categories:
  - 其他技术
description: IDEA配置好可以极大提升你的体验的。
cover: https://img.yww52.com/2020/7/2020-7-11/top_img.jpg
---

# 前言

闲着没事升级了一下我的idea，现在版本为2020.1.3，顺便记录一下idea的配置与优化，方便以后再改。

#  主题方面

一个好的主题会让你喜欢上idea，所以可以去换一个喜欢的主题，体验超好。网上有很多去下载就好了，我就不放地址了。
点击下载一般都会下一个jar包，随便找个地方放就好。

然后在idea里的File -> Manage IDE settings -> import settings,把jar包导进去重启就好了。

# 设置优化

1. idea主色配置
   File -> Settings -> Appearance & Behavior -> Appearance
   ![](https://img.yww52.com/2020/7/2020-7-11/img1.png)
   
   > 这个看个人喜欢了，我用多了还是深色的好。
   
2. 自动导包
	File -> Settings -> Editor -> General -> Auto Import
	![](https://img.yww52.com/2020/7/2020-7-11/img2.png)
	
	> 这个就不用多说了吧，自动导包还是很方便的。
	
3. 字体缩放
   File -> Settings -> Editor -> General，勾选第一个选项。
   ![](https://img.yww52.com/2020/7/2020-7-11/img3.png)

   > 然后按着CTRL+滑动滚轮就可以控制字体大小了，很好用的。

4. 大小写不敏感
   File -> Settings -> Editor -> General -> Code Completion，取消第一个的勾选。
    ![](https://img.yww52.com/2020/7/2020-7-11/img4.png)

    > 这个就会让你在打错大小写的情况下还会提醒你。

5. 设置背景图片
   File -> Settings -> Appearance & Behavior -> Appearance
   ![](https://img.yww52.com/2020/7/2020-7-11/img5.png)

6. 取消自动打开项目
   File -> Settings -> Appearance & Behavior -> System Settings，取消第一个勾选
   ![](https://img.yww52.com/2020/7/2020-7-11/img6.png)

   > 取消了之后就不会每次打开idea就会进入到上次关闭的项目了，当然这个看个人喜好。

7. 显示方法分隔线和行号
   File -> Settings -> Editor -> General -> Appearance,勾选上选项。
   ![](https://img.yww52.com/2020/7/2020-7-11/img7.png)

   > 这个会让方法与方法之间出现分隔线，左边出现行号。

8. 快捷键更换
   File -> Settings -> Keymap
   ![](https://img.yww52.com/2020/7/2020-7-11/img8.png)

   > 有些人习惯了Eclipse的快捷键，从这里就可以改成Eclipse的，下面的快捷键也可以自行修改。

9. 设置方法模板
   File -> Settings -> Editor -> Live Templates
   ![](https://img.yww52.com/2020/7/2020-7-11/img9.png)

   > 方法模板可以在下面设置，不过比较常用的就是psvm和sout生成主方法和输出语句，第一个选项就是输入了sout之后点空格就会生成模板，我比较喜欢空格，自行选择。

10. 类模板的设置
    File -> Settings -> Editor -> File and Code Templates -> Class

    ![](https://img.yww52.com/2020/7/2020-7-11/img10.png)

    > 这段注释就是生成类自动帮你生成的模板，可以自行修改。

# Maven环境配置

File -> Settings -> Build, Execution, Deployment -> Build Tools -> Maven

![](https://img.yww52.com/2020/7/2020-7-11/img11.png)

> 第一个是maven所在位置，第二个是maven里的配置文件setting.xml的位置，第三个是maven-repomaven里的仓库文件夹的位置。



# 插件

用idea就不能少了插件，插件可以让你的体验在上升一个档次哦。

## 插件安装方法

1. 在idea上直接安装
   File -> Settings -> Plugins，直接搜索名字就好了。
   有时候有些插件会下载很慢，可以直接去官网下载。

2. 官网下载离线插件
   官网地址----><https://plugins.jetbrains.com/>
   ![](https://img.yww52.com/2020/7/2020-7-11/img12.png)

   下载之后点这里导入插件就好了。

## 插件推荐

1. CodeGlance
   安装了这个插件就会在idea右侧生成一个代码地图，用过Vscode都应该知道这个的好处。

2. Translation
   顾名思义，一个翻译插件，可以帮你在IDE里翻译源码和控制台的一些不会的英文语句，挺方便的。

3. Rainbow Brackets
   彩虹括号，让你的每个括号都带上颜色，一对括号一个颜色，好看又能让你快速分辨。还有更多用法可参照[官方文档](https://github.com/izhangzhihao/intellij-rainbow-brackets)

4. Chinese

   其实这个我不用，idea中文插件，用中文没得灵魂。

5. Grep Console

   日志配色。

6. Alibaba Java Coding Guidelines
   阿里巴巴代码规范，提醒你不规范的地方

   



