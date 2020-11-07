---
title: 第一个Servlet程序
date: 2020-6-5
categories:
- javaweb
cover: https://img.yww52.com/2020/6/2020-6-5/top_img.jpg
description: 简单使用servlet的小demo
---

1. 创建一个Maven项目，不用选择模板先

   ![](https://img.yww52.com/2020/6/2020-6-5/img1.png)

2. 导入依赖

    ```xml
    <!--在pom.xml的project标签里导入依赖-->  
    <dependencies>
    
            <dependency>
                <groupId>javax.servlet</groupId>
                <artifactId>javax.servlet-api</artifactId>
                <version>4.0.1</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>javax.servlet.jsp</groupId>
                <artifactId>jsp-api</artifactId>
                <version>2.1</version>
                <scope>provided</scope>
            </dependency>
    
        </dependencies>
    ```

3. 创建一个子模块，选择图中的模板

   ![](https://img.yww52.com/2020/6/2020-6-5/img2.png)

   > 接下来配置好maven和setting.xml和maven-repo的路径，大概如图所示

   ![](https://img.yww52.com/2020/6/2020-6-5/img8.png)

4. 创建好子模块后，更新web.xml

   ```xml
   <!--更新src/main/webapp/WEB-INF下的web.xml如下-->
   
   <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee     http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
            version="3.1">
   
   </web-app>
   ```

5. 还原配置

   在main下创建好java包和resources包，并在右键Mark Director as标记两个包，Java包为Sources Root,resources包为Resources Root类型，成功如图下

   ![](https://img.yww52.com/2020/6/2020-6-5/img3.png)

6. 在Java包里编写servle程序，若没有添加servlet程序选项可以自行创建类，然后继承HttpServlet接口

   ![](https://img.yww52.com/2020/6/2020-6-5/img4.png)

7. 编写好后点击右上角的设置，配置好Tomcat服务器的设置

   ![](https://img.yww52.com/2020/6/2020-6-5/img5.png)

   ![](https://img.yww52.com/2020/6/2020-6-5/img6.png)

   > 添加之后配置好部署，添加子模块的war包，就可以启动Tomcat了

   ![](https://img.yww52.com/2020/6/2020-6-5/img7.png)

   