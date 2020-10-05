---
title: SpringMVC执行原理
date: 2020-9-22
categories:
  - Java
description: SpringMVC的执行原理
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/9/2020-9-22/top_img.jpg
---

# springmvc的组件

1. 前端控制器（DispatcherServlet）

   前端控制器就是用来处理请求的中心，接收请求和响应结果都是由它控制的，也算是springmvc里的中心枢纽。

2. 处理器映射器（HandlerMapping）

   处理器映射器根据请求里的url来查找相应的处理器，即用来寻找处理器的。

3. 处理器（Handler）

   处理器是进行业务操作的。

4. 处理器适配器（HandlerAdapter）

   会把处理器包装成适配器，这样就可以支持多种类型的处理器，类比笔记本的适配器（适配器模式的应用）

5. 视图解析器（ViewResovler）

   即对返回来的视图进行解析，将代码解析成为对应的视图

#  工作流程

![工作流程](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/9/2020-9-22/img1.png)

# 具体分析

1. 用户发送请求，即在浏览器上输入url，DispatcherServlet会接收请求。
2. DispatcherServlet收到请求后就会调用HandlerMapping来寻找需要的Handler。
3. HandlerMapping找到Handler后就会返回给DispatcherServlet。
4. 前端控制器DispatcherServlet收到Handler后就会调用HandlerAdapter对Handler进行处理。
5. HandlerAdapter经过适配调用具体的Handler(Controller，也叫后端控制器)。
6. 执行完毕后就会将一个ModelAndView返回给HandlerAdapter。
7. HandlerAdapter将ModelAndView返回给DispatcherServlet。
8. DispatcherServlet将调用ViewReslover来解析这个ModelAndView。
9. ViewReslover解析ModelAndView后返回具体View给DispatcherServlet。
10. DispatcherServlet根据这个view就会渲染出所需要的页面。
11. DispatcherServlet将这个页面返回给用户，用户获取结果。

# 对于hellospringmvc的详解

1. 首先在web.xml里注册的就是DispatcherServlet前端控制器，用户发出的请求（即输入url）先到的是这里。

   {% note info%}
   这里DispatcherServlet收到请求就会获取有用的信息，就是将url拆分。
   就比如我输入的url，https://localhost:8080/helloSpringmvc/hello	就会拆分为三部分
   1. localhost:8080，这是tomcat开放的端口。
   2. helloSpringmvc，这个就是访问的你的项目名（可以自己更改），即tomcat的webapps下的helloSpringmvc文件夹。
   3. hello，即为控制器的id ,发出请求输入ur就是为了找到这个控制器。

   {% endnote %}

2. 然后经过关联的配置文件，即resource下的springmvc-servlet.xml。

   ```xml
   <servlet>
       <servlet-name>springmvc</servlet-name>
       <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
       <init-param>
           <param-name>contextConfigLocation</param-name>
           <param-value>classpath:springmvc-servlet.xml</param-value>
       </init-param>
       <load-on-startup>1</load-on-startup>
   </servlet>
   
   <servlet-mapping>
       <!--匹配到输入的url-->
           <servlet-name>springmvc</servlet-name>
           <url-pattern>/</url-pattern>
   </servlet-mapping>
   ```

3. springmvc-servlet.xml先是注册了HandlerMapping处理器映射器和HandlerAdapter处理器适配器，springmvc自动帮你调用这两个组件。

   ```xml
     <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
     <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
   ```

4. 在springmvc-servlet.xml注册的Handler控制器,这样DispatcherServlet就可以通过这里找到这个hello控制器，然后DispatcherServlet将该控制器交给HandlerAdapter进行处理该Handler所包含的业务逻辑，这里就是HelloController类里的业务操作。

   ```xml
                    <!--Handler-->
       <bean id="hello" class="com.chen.controller.HelloController"/>
   ```

5. HelloController中调用了Controller接口，即可以理解这就是mvc架构中Controller层，在这个类进行我们的业务逻辑操作，因为在springmvc中Control层的数据要交给DispatcherServlet处理的，所以返回了一个包装好的ModelAndView，Model存储数据，View存储视图。

   ```Java
   public class HelloController implements Controller {
       public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response)
           throws Exception {
                       //创建一个ModelAndView对象
                       ModelAndView mv = new ModelAndView();
                       //封装所需要的数据到ModelAndView的对象中
                       mv.addObject("msg","HelloSpringMVC!");
                       //封装要跳转的视图，放在ModelAndView中
                       mv.setViewName("hello"); 	//   /WEB-INF/jsp/hello.jsp
                       return mv;
       		}
   }
   ```

6. DispatcherServlet收到包装好的ModelAndView后，通过注册的视图解析器进行解析渲染视图。

   ```xml
   <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
         id="InternalResourceViewResolver">
           <!--前缀-->
           <property name="prefix" value="/WEB-INF/jsp/"/>
           <!--后缀-->
           <property name="suffix" value=".jsp"/>
   </bean>
```
   
   {% note info%}
这里就是对控制器进行拼接，比如hello控制器，加上前缀与后缀就成为了/WEB-INF/jsp/hello.jsp，然后就会在web目录下找到该视图进行跳转。
   
   {% endnote %}

{% note success %}
结合springmvc中第一个springmvc程序来看。由此可以看出springmvc帮我们做了很多事情，我们只需要配置好那几个重要的组件，然后编写业务逻辑和视图就能完成对于一个控制器的工作。
{% endnote %}

# 参考文章

1. https://www.cnblogs.com/xiaoxi/p/6164383.html