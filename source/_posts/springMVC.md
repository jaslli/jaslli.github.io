---
title: SpringMVC
date: 2020-7-7
categories:
  - Java
description: SpringMVC
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/top_img.jpg
---

# 什么是SpringMVC

Spring MVC是一个基于MVC架构的用来简化web应用程序开发的应用开发框架，它是Spring的一部分，它和Struts2一样都属于表现层的框架。

> MVC可参考之前的文章	[mvc架构](https://yww52.com/2020/06/06/JSP/#MVC)

# 第一个SpringMVC程序

1. 新建一个maven项目，取个名字一路next即可。

2. 添加web的支持
   ![1](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/img1.png)
   ![2](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/img2.png)

3. 在pom.xml导入依赖

   ```xml
   <dependencies>
          <!--spring-webmvc-->
          <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-webmvc</artifactId>
               <version>5.2.6.RELEASE</version>
          </dependency>
   </dependencies>
   ```

4. 在resources下创建配置springmvc的配置文件，我这里是springmvc-servlet.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/beans ">
   
   
       <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
   
       <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
   
       <!--注册并配置视图解析器-->
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
             id="InternalResourceViewResolver">
           <!--前缀-->
           <property name="prefix" value="/WEB-INF/jsp/"/>
           <!--后缀-->
           <property name="suffix" value=".jsp"/>
       </bean>
   
       <!--hello的Handler，匹配到创建的HelloController-->
       <bean id="/hello" class="com.chen.HelloController"/>
   </beans>
   ```

5. 配置web.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
                                http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
            version="4.0">
   
   <!--注册并配置DispatcherServlet-->
       <servlet>
           <servlet-name>springmvc</servlet-name>
           <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
           <!--
   			关联springmvc的配置文件,这里是springmvc-servlet.xml
   		-->
           <init-param>
               <param-name>contextConfigLocation</param-name>
               <param-value>classpath:springmvc-servlet.xml</param-value>
           </init-param>
           <!--启动级别-1-->
           <load-on-startup>1</load-on-startup>
       </servlet>
       
   <!--匹配请求-->
       <!--/ 匹配了除了jsp页面的所有请求-->
       <!--/* 匹配所有的请求-->
       <servlet-mapping>
           <servlet-name>springmvc</servlet-name>
           <url-pattern>/</url-pattern>
       </servlet-mapping>
       
   </web-app>
   ```

6. 在Java文件夹下创建HelloController
   
   ```Java
   public class HelloController implements Controller {
   //在idea有两个Controller接口，导入的是org.springframework.web.servlet.mvc下
       public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) 
           throws Exception {
               //ModelAndView
               ModelAndView mv = new ModelAndView();
               //封装对象
               mv.addObject("msg","HelloSpringMVC!");
               //封装要跳转的视图
               mv.setViewName("hello"); //: /WEB-INF/jsp/hello.jsp
               return mv;
       }
   }
   ```
   
7. 然后在WEB-INF的jsp的文件夹下创建hello.jsp文件，显示msg的信息

   ```jsp
   <%@ page contentType="text/html;charset=UTF-8" language="java" %>
   <html>
   <head>
       <title>Title</title>
   </head>
   <body>
       ${msg}
   </body>
   </html>
   ```

8. 配置tomcat启动就好

结构的目录为

![3](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/img3.png)

# 执行原理

跳转至该文章。[springmvc执行原理](https://yww52.com/2020/09/21/Springmvc%E6%89%A7%E8%A1%8C%E5%8E%9F%E7%90%86/)



# 用注解来开发

> 与上面的第一个Springmvc程序来对比

1. 首先是sprngmvc的配置程序

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           https://www.springframework.org/schema/context/spring-context.xsd
           http://www.springframework.org/schema/mvc
           https://www.springframework.org/schema/mvc/spring-mvc.xsd">
   
       <context:component-scan base-package="com.yw.controller"/>
   
       <mvc:default-servlet-handler/>
       <mvc:annotation-driven/>
   
   
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
           <property name="prefix" value="/WEB-INF/jsp/"/>
           <property name="suffix" value=".jsp"/>
    </bean>
       
   </beans>
   ```
   
2. 然后是Controller类

   ```java
   import org.springframework.stereotype.Controller;
   import org.springframework.ui.Model;
   import org.springframework.web.bind.annotation.RequestMapping;
   
   //自动视为一个Controller的类
   //@RequestMapping("/1")，这里也可以添加路径，这里加上了那下面的路径就是/1/hello了
   @Controller
   public class HelloController  {
   	// 访问的路径
       @RequestMapping("/hello")
       public String hello(Model model){
           model.addAttribute("msg","hello springmvc");
           return "hello";
           //返回给视图解析器拼接
       }
   }
   ```

3. web.xml用之前的就好，再写jsp页面就可以运行了。

{% note success%}
下载的版本就选Java8好了，不一定最新的就是最好的，当然最新的也可以。至于IDE嘛，喜欢哪个用哪个，我用的就是idea
{% endnote %}