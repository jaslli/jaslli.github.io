---
title: Swagger3
date: 2020-11-3
categories:
    - SpringBoot
    - API文档
cover: https://img.yww52.com/2020/11/2020-11-3top_img.jpg
descrtion: 更加方便的整合swagger。
---

# 前言

学完之前的[swagger2](https://yww52.com/2020/10/25/Swagger/)之后,发现还有一个新的版本，swagger3，用起来更加的简单，而且是官方的starter。

# 使用

1. 首先导入依赖

   ```xml
   <dependency>
       <groupId>io.springfox</groupId>
       <artifactId>springfox-boot-starter</artifactId>
       <version>3.0.0</version>
   </dependency>
   ```

2. 创建swagger配置类。

   ```Java
   package com.yww.config;
   
   import org.springframework.context.annotation.Configuration;
   
   @Configuration
   public class swaggerConfig {
   }
   ```

3. 然后就能访问url<http://localhost:8088/swagger-ui/>找到文档了。

有很多的配置与swagger2是一样的，就不具体阐述了。



