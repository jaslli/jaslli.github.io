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



# 注解的使用

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
   	
       <!--使用注解要添加扫描的包-->
       <context:component-scan base-package="com.yw.controller"/>
       <mvc:default-servlet-handler/>
       <mvc:annotation-driven/>
       <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
           <property name="prefix" value="/WEB-INF/jsp/"/>
           <property name="suffix" value=".jsp"/>
    </bean>
   </beans>
   ```

   > 1. \<mvc:default-servlet-handler/>
   >    
   >    因为之前配置DispatcherServlet的时候配置了拦截方式为“/”,故包括了静态资源，所有springmvc会将静态资源的请求当成是普通的请求，所以会找不到对应的处理器而导致错误。这条语句将把静态资源和非静态资源的请求分开，从而避免错误。
   >
   > 2. \<mvc:annotation-driven/>
   >    
   >    这个帮我们注册了很多的类 ，包括之前的BeanNameUrlHandlerMapping和SimpleControllerHandlerAdapter，并告知spring，启用了注解。

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
           //返回给视图解析器拼接，然后寻找视图
       }
   }
   ```


3. web.xml用之前的就好，再写jsp页面就可以运行了。

   {% note success%}

   springmvc-servlet.xml和web.xml基本都是不用怎么改变的，除了改一些路径。

   {% endnote %}

# 简单的标签详解

1. **@Controller**
   告诉spring该类为一个控制器，并交给spring来托管

2. **@RequestMapping**

   ```Java
   @Controller
   @RequestMapping("/hello1")
   public class HelloController  {
       //表示获取的路径，放在类上为父级，方法上为子级。全标签是这样@RequestMapping(value="/hello2")
       @RequestMapping("/hello2")
       //访问路径为http://localhost:8080/项目名/hello1/hello2
       public String hello(Model model){
           model.addAttribute("msg","hello springmvc");
           return "hello";
       }
       
       
       //@PathVariable表示绑定参数，method默认为GET，所以通过get方法就能访问，换成其他方法比如delete就会报错。
       @RequestMapping(value="/hello2/{a}/{b}",method = RequestMethod.GET)
       //通过访问路径http://localhost:8080/项目名/hello1/hello2/1/2就能获取a和b的值了
       public String hello1(@PathVariable int a,@PathVariable int b, Model model){
           int c = a + b;
           model.addAttribute("msg",c);
           return "hello";
       }
       
       
       //通过method参数就会有以下的衍生注解代表不同方法，不同的是衍生注解只能放在方法上
       /*
       @GetMapping("/hello2/{a}/{b}")
       @PostMapping("/hello2/{a}/{b}")
       @PutMapping("/hello2/{a}/{b}")
       @DeleteMapping("/hello2/{a}/{b}")
       @PatchMapping("/hello2/{a}/{b}")
       */
       @GetMapping("/hello2/{a}/{b}")
       public String hello1(@PathVariable int a,@PathVariable int b, Model model){
           int c = a + b;
           model.addAttribute("msg",c);
           return "hello";
       }
   }
   ```


# 关于重定向和转发

# 使用视图解析器

在SpringMvc的配置文件下注册了视图解析器，即下面的这段代码，就可以通过视图解析器来进行转发。

```xml
<!--在springmvc的配置文件中注册视图解析器-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
    id = "internalResourceViewResolver">
    	<!--前缀和后缀，前缀需手动索引-->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <property name="suffix" value=".jsp"/>
</bean>
```

```Java
@Controller
public class HelloController  {
    @GetMapping("/hello")
    public String hello(Model model){
        model.addAttribute("msg","Hello World!");
        return "hello";
        //返回给视图解析器就会拼接成/WEB-INF/jsp/hello.jsp
    }
}
```

## 不使用视图解析器

### 直接使用servlet的方法

```java
@Controller
public class HelloController  {
    //转发
    @GetMapping("/hello1")
    public void hello1(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().println("Hello World!");
    }
    //转发
    @GetMapping("/hello2")
    public void hello2(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect("index.jsp");
    }
    //重定向
    @GetMapping("/hello3")
    public void hello3(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setAttribute("msg","Hello World!");
        request.getRequestDispatcher("/WEB-INF/jsp/hello.jsp").forward(request,response);
    }
}
```

{%note warning%}

因为实质是servlet，所以是可以直接使用servlet的方法的，但是不推荐这么使用，过于繁琐。

{%endnote%}

### 使用前缀

```java
@Controller
public class HelloController  {
    //forward前缀 转发
    @GetMapping("/hello1")
    public String hello1(Model model){
        model.addAttribute("msg","Hello World!");
        return "forward:/WEB-INF/jsp/hello.jsp";
    }
    //forward前缀 跳转到目标方法
    @GetMapping("/hello2")
    public String hello2(Model model){
        model.addAttribute("msg","Hello World!");
        return "forward:/hello1";
    }
    //redirect前缀 重定向
    @GetMapping("/hello3")
    public String hello3(Model model){
        model.addAttribute("msg","Hello World!");
        return "redirect:/index.jsp";
    }
}
```

{%note info%}

前缀的优先级是比视图解析器大的，有前缀的前提下是不经过视图解析器的，建议还是注册视图解析器，转发不用前缀，重定向使用前缀进行。

{%endnote%}



# 数据处理

## 获取数据

1. 通过url相同的参数名获取数据

   ```Java
   @Controller
   public class HelloController  {
       @GetMapping("/hello1")
       //输入http://localhost:8080/项目名/hello?msg01=hello world!
       public String hello1(String msg01, Model model){
           model.addAttribute("msg",msg01);
           return "hello";
       }
       @GetMapping("/hello2")
       //输入http://localhost:8080/项目名/hello?msg01=hello&msg02= world!
       public String hello2(String msg01,String msg02,Model model){
           model.addAttribute("msg",msg01+msg02);
           return "hello";
       }
   }
   ```

2. 通过url不相同的参数名获取数据

   ```java
   @Controller
   public class HelloController  {
       @GetMapping("/hello")
       //输入http://localhost:8080/项目名/hello?msg0=hello world!
       //通过RequestParam标签绑定参数名字可以修改名字，但不能用回原来的参数名来获取了，即只能用msg0来获取
       public String hello(@RequestParam("msg0") String msg01, Model model){
           model.addAttribute("msg",msg01);
           return "hello";
       }
   }
   ```

3. 通过url来获取一个对象

   1. 首先创建一个实体类

      ```Java
      public class user {
          String name;
          int id;
          public user(String name, int id) {
              this.name = name;
              this.id = id;
          }
          public String getName() {
              return name;
          }
          public int getId() {
              return id;
          }
          @Override
          public String toString() {
              return "user{" +
                      "name='" + name + '\'' +
                      ", id=" + id +
                      '}';
          }
      }
      ```

   2. 获取对象

      ```Java
      @Controller
      public class HelloController  {
          @GetMapping("/hello")
          //输入http://localhost:8080/项目名/hello?name=he&id=2
          //注意的是，输入的参数要与构造器的顺序一样
          public String hello(User user, Model model){
              model.addAttribute("msg",user);
              return "hello";
          }
      }
      ```

## 解析到前端页面

1. 使用ModelAndView

   ```java
   public class HelloController implements Controller {
       public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
           ModelAndView mv = new ModelAndView();
           //封装数据
           mv.addObject("msg", "Hello World!");
           //封装跳转页面
           mv.setViewName("hello");
           return mv;
       }
   }
   ```

2. 使用Model

   ```java
   @Controller
   public class HelloController  {
       @GetMapping("/hello")
       public String hello(Model model){
           //封装数据
           model.addAttribute("msg","Hello World!");
           //返回跳转视图
           return "hello";
       }
   }
   ```

3. 使用ModelMap

   ```Java
   @Controller
   public class HelloController  {
       @GetMapping("/hello")
       public String hello(ModelMap modelMap){
           modelMap.addAttribute("msg","Hello World!");
           return "hello";
       }
   }
   ```

{%note infi%}

Model其实是一个接口实现类，一定程度上是继承了ModelMap，因为Model的实现也是要用到ModelMap的方法的，而ModelMap继承了LinkedHashMap，所以方法比Model多一些。

{%endnote%}