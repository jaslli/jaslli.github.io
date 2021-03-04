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



# 增强

Swagger3还可以使用`knife4j`来增加Swagger的体验，这个前身是`swagger-bootstrap-ui`。

官方的文档。<https://doc.xiaominfo.com/knife4j/documentation/>

可以根据底层的不同来选择依赖，比如使用`OpenAPI3`结构的可使用以下版本。

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <!--在引用时请在maven中央仓库搜索3.X最新版本号-->
    <version>3.0.2</version>
</dependency>
```

使用后也是访问`doc.html`就能看到。

`knife4j`还有增强的特性，可以参考<https://doc.xiaominfo.com/knife4j/documentation/enhance.html>来开启增强模式。