---
title: swagger
date: 2020-10-26
categories:
- Java
cover: https://img.yww52.com/2020/10/2020-10-26/top_img.jpg
description: swagger是一款让你更好的书写API文档的框架。
---

# 简单的集成swagger

1. 为你的项目导入两个依赖

   ```xml
   	<dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger2</artifactId>
          <version>2.9.2</version>
   	</dependency>
   	<dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger-ui</artifactId>
   	</dependency>
   ```

2. 创建一个配置类

   ```Java
   package com.yww.config;

   import org.springframework.context.annotation.Configuration;
   import springfox.documentation.swagger2.annotations.EnableSwagger2;

   @Configuration
   @EnableSwagger2		//开启swagger2
   public class SwaggConfig {
   }
   ```

3. 开启项目，打开url<http://localhost:8080/swagger-ui.html>，就能看到ui界面
   ![](https://img.yww52.com/2020/10/2020-10-26/img1.png)

# 配置文档信息

1. 因为swagger的实例Bean是Docker，所以用Docker来配置swagger。

    ```Java
    package com.yww.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import springfox.documentation.service.ApiInfo;
    import springfox.documentation.service.Contact;
    import springfox.documentation.spi.DocumentationType;
    import springfox.documentation.spring.web.plugins.Docket;
    import springfox.documentation.swagger2.annotations.EnableSwagger2;

    import java.util.ArrayList;

    @Configuration
    @EnableSwagger2
    public class SwaggConfig {
        @Bean
        public Docket docket(){
            //调用apiInfo方法来传入信息
            return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo());
        }
        //自定义apiInfo方法实现自定义信息配置
        private ApiInfo apiInfo(){
            //创建一个contact对象以便输入
            Contact contact = new Contact("yw", "localhost:8080/", "1141950370@qq.com");
            return new ApiInfo(
                    "Yw的swagger文档",				   //标题
                    "永远相信美好的事情即将发生",		//描述
                    "v1.0",							//版本号
                    "urn:tos",						//termsOfServiceUrl
                    contact,						//contact对象
                    "Apacher 2.0",					//许可信息	
                    "http://www.apache.org/licenses/LINCENSE-2.0 ",		//许可信息的链接
                    new ArrayList());
        }
    }
    ```

2. 配置完成以后就可以打开<http://localhost:8080/swagger-ui.html>看到信息了。
    ![](https://img.yww52.com/2020/10/2020-10-26/img2.png)

