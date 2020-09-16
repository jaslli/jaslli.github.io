---
title: 简单的Web基础
date: 2020/6/4
categories:
  - Java
description: 刚学web就要先了解一些基础。
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2020/6/2020-6-4/top_img.jpg
---

## web应用

web应用程序是一个可以提供浏览器访问的程序，一个web服务器应该是由多部份组成的，前端页面，webService功能，和Java程序，等等

## 静态web

​		静态网站是最初的建站方式，浏览者所看到的每个页面是建站者上传到服务器上的一个 html （ htm ）文件，这种网站每增加、删除、修改一个页面，都必须重新对服务器的文件进行一次下载上传。网页内容一经发布到网站服务器上，无论是否有用户访问，每个静态网页的内容都是保存在网站服务器上的，也就是说，静态网页是实实在在保存在服务器上的文件，每个网页都是一个独立的文件

![静态web](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@v1.5/2020/6/2020-6-4/img1.png)

## 动态web

​		动态web有点类似静态web，但不是那种有图片动，轮播图的那些伪动态，它的资源数据不是一成不变的，就比如是淘宝，不同的人会有不同的推荐
​		![动态web](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@v1.5/2020/6/2020-6-4/img2.png)

## web服务器

​		web服务器用来处理用户的请求，然后返回响应。有LLS,Tomcat服务器，我们主要学的就是Tomcat服务器。现在来了解一下Tomcat服务器。

## Tomcat

​			Tomcat是Apache 软件基金会（Apache Software Foundation）的Jakarta 项目中的一个核心项目，由于有了Sun 的参与和支持，最新的Servlet 和JSP 规范总是能在Tomcat 中得到体现。因为Tomcat 技术先进、性能稳定，而且免费，因而深受Java 爱好者的喜爱并得到了部分软件开发商的认可，成为目前比较流行的Web 应用服务器。

​			Tomcat 服务器是一个免费的开放源代码的Web 应用服务器，属于轻量级应用服务器，在中小型系统和并发访问用户不是很多的场合下被普遍使用，是开发和调试JSP 程序的首选。对于一个初学者来说，可以这样认为，当在一台机器上配置好Apache 服务器，可利用它响应HTML（标准通用标记语言下的一个应用）页面的访问请求。实际上Tomcat是Apache 服务器的扩展，但运行时它是独立运行的，所以当你运行tomcat 时，它实际上作为一个与Apache 独立的进程单独运行的。

​			Apache 为HTML页面服务，而Tomcat 实际上运行JSP 页面和Servlet。另外，Tomcat和IIS等Web服务器一样，具有处理HTML页面的功能，另外它还是一个Servlet和JSP容器，独立的Servlet容器是Tomcat的默认模式。不过，Tomcat处理静态HTML的能力不如Apache服务器。

​			这是百度对Tomcat的描述，其实在现在看来，我们淘汰了JSP这项技术，但Tomcat依旧是十分主流的web服务器。

![](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@v1.5/2020/6/2020-6-4/img3.png)

​		这就Tomcat所有的文件，大致都可以了解一下，**bin为一些脚本文件，比如启动和关闭的脚本文件，conf为配置文件，lib是一些所需的依赖jar包，logs为日志，webapps用来存放网站**。

- 可以配置启动的端口号

  ```xml
  <!--conf/server.xml-->
   <Connector port="8080" protocol="HTTP/1.1"
                 connectionTimeout="20000"
                 redirectPort="8443" 
                 URIEncoding="UTF-8"/>
  <!--默认是为8080端口，可以修改-->
  ```

- 可以配置主机名

  ```xml
  <!--conf/server.xml--> 
  <Host name="localhost"  appBase="webapps"
              unpackWARs="true" autoDeploy="true">
  <!--这里可以改主机名，但要去hosts文件里加个映射才能生效，也可以改存放网站的位置-->
  ```

  为什么要改hosts文件，这就涉及到网站是如何进行访问。

  1. 首先客户端输入域名发起请求

  2. 客户端先会对本机的hosts进行检查，检查是否有这个域名的映射，要是有就会返回这个域名对应的ip地址，然后就可以直接访问相关的web程序，要是没有检查到就会去DNS服务器上寻早该域名对应的ip(这也就是所理解的dns解析域名)，找到就返回ip，找不到就访问不了

     

