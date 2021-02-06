---
title: JSP
date: 2020-6-6
categories:
   - Java
   - javaweb
description: JSP也算Javaweb的基础，还是有必要学的。
cover: https://img.yww52.com/2020/6/2020-6-6/top_img.jpg
---

#### 前言

​		JSP是一门比较老的技术了，在这个前后端分离大火的时代，JSP基本已经被淘汰了，但是JSP还是有学习的必要的，学习了JSP有助于了解JavaWeb，能更好的理解后面所学的框架。

#### 什么是JSP

​		JSP全称为JavaServer Pages,Java服务端页面，是一种动态网页技术，用于实现动态web。JSP部署于网络服务器上，可以响应客户端发送的请求，并根据请求内容动态地生成HTML,XML或其他格式文档的web网页，然后返回给请求者。JSP技术以Java语言作为脚本语言，为用户的HTTP请求提供服务，并能与服务器上的其它Java程序共同处理复杂的业务需求。

#### JSP原理

##### JSP是怎么实现动态web

​		JSP页面，比如index.jsp的页面会在tomcat服务器运行的时候会转变成一个Java程序，你可以在idea目录下找到对应的Java程序与字节码文件，点进去看源码会发现，这个Java程序继承了HttpJspBase，而HttpJspBase继承了Sevlet，所以可以看出**JSP本质上就是Servlet**,我们在JSP中用HTML来写，而系统自动用一个Servlet来帮你写出这个JSP，所以Servlet实现了动态Web,从而JSP也实现了动态Web。

> 我的目录地址为C:\Users\Yw\.IntelliJIdea2019.1\system\tomcat\Unnamed_javaweb01\work\Catalina\localhost\web01_war\org\apache\jsp

##### JSP的一些源码分析

1. 首先处理JSP文件

   ```Java
   // 初始化
     public void _jspInit() {
     }
   //销毁
     public void _jspDestroy() {
     }
   //JSPService，处理请求响应
     public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
         throws java.io.IOException, javax.servlet.ServletException {
   
       if (!javax.servlet.DispatcherType.ERROR.equals(request.getDispatcherType())) {
         final java.lang.String _jspx_method = request.getMethod();
         if ("OPTIONS".equals(_jspx_method)) {
           response.setHeader("Allow","GET, HEAD, POST, OPTIONS");
           return;
         }
         if (!"GET".equals(_jspx_method) && !"POST".equals(_jspx_method) && !"HEAD".equals(_jspx_method)) {
           response.setHeader("Allow","GET, HEAD, POST, OPTIONS");
           response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "JSP 只允许 GET、POST 或 HEAD。Jasper 还允许 OPTIONS");
           return;
         }
       }
   ```

2. 判断请求

3. 其中还内置了一些对象

   ```Java
   	final javax.servlet.jsp.PageContext pageContext;			//页面上下文
       javax.servlet.http.HttpSession session = null;				//Session
       final javax.servlet.ServletContext application;				//application
       final javax.servlet.ServletConfig config;					//config
       javax.servlet.jsp.JspWriter out = null;						//out
       final java.lang.Object page = this;							//当前页
       
   ```

4. 输出页面前，还多了一些源码

   ```Java
    response.setContentType("text/html");		//设置响应的页面类型
    pageContext = _jspxFactory.getPageContext(this, request, response,
         			null, true, 8192, true);
    _jspx_page_context = pageContext;
    application = pageContext.getServletContext();
    config = pageContext.getServletConfig();
    session = pageContext.getSession();
    out = pageContext.getOut();
    _jspx_out = out;
   //这些对象可以在JSP页面中直接使用
   ```

5. 输出页面，比如Index.jsp

   ```Java
    	  out.write("<html>\n");
         out.write("<body>\n");
         out.write("<h2>Hello World!</h2>\n");
         out.write("</body>\n");
         out.write("</html>\n");		
   ```

6. 所以基本上除了输出页面的代码，也就是我们在JSP上写的HTML的代码是不一样的以外，其他的基本上都是一样的，系统帮我写好了实现HTML同样效果的Servlet

7. 所以可以得出这样JSP实现的流程。首先客户端向服务器发起了一个请求，服务器中的Web容器会接收请求，找到对应的JSP页面，然后系统会自动将JSP页面转化为Java程序，编译得到class文件，然后web容器帮我们处理这样的class文件，也就是Servlet，Web容器就发起响应，所以我们所看到的就是这个Java程序，也就是Servlet

> 在JSP中
>
> 写HTML的代码，会被转换成out.write("")的形式，例如上面的输出页面
>
> 写Java代码，就会是Java的代码

#### MVC三层架构

##### MVC

​		Model,View,Controller。即模型，视图，控制器。 

##### Controller 控制器

> 实质就是Servlet，大概有三个作用

1. 接收用户的请求
2. 响应交给业务层处理对应代码
3. 视图跳转

##### View 视图

> 实质是JSP，也是Servlet，大概有两个作用

1. 展示数据
2. 提供链接发起Servlet请求

> 因为Controller与View都算是Servlet，但为了更好的管理，便规定为Controller写Servlet，View专注于显示界面

##### 早期架构

早期的架构只有控制器和视图两层，即以下的结构

![](https://img.yww52.com/2020/6/2020-6-6/img1.png)

> 这种架构是在控制器中直接写对用户的操作，例如增删改查，但这样的话，Servlet中就会有很多代码，处理起来十分麻烦，所以便加多了一层Model层

##### Model 模型

Model其实包括了业务层Service，用户类JavaBean和Dao层

##### 在优化下，才出现了如今的MVC三层架构

![](https://img.yww52.com/2020/6/2020-6-6/img2.png)





#### 总结

​	由此可以知道**JSP其实就是Servlet**，所以能实现动态Web，不过因为这种技术是在HTML中嵌入Java的代码，这是一件令人头疼的事情，毕竟这样的话做一个项目就要同时学习前端和后端，所以前后端分离的思想出来之后，JSP就逐渐被淘汰了。



