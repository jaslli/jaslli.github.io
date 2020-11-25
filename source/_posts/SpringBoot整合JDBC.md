---
title: SpringBoot使用JDBC
date: 2020-11-25
categories:
  - SpringBoot
description: SpringBoot用jdbcTemplate来来进行JDBC操作。
keywords: SpringBoot使用JDBC,jdbcTemplate
cover: https://img.yww52.com/2020/10/2020-10-15top_img.jpg
---

# 简介

在SpringBoot中简单的使用JDBC,用jdbcTemplate简单的操作数据的增删改查，大型一点的项目建议使用Mybatis。

# 依赖

```xml
<dependencies>
        <!--JDBC的场景启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
    	<!--WEB的场景启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    	<!--Mysql驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--单元测试-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
</dependencies>
```

# 配置springboot配置文件

```yaml
# 这个是application.yaml版本
spring:
  datasource:
    username: root
    password: password
    # 可以根据情况来写url
    url: jdbc:mysql://localhost:3306/test?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
```

```properties
# 这个是application.properties版本
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.url=jdbc:mysql://localhost:3306/test?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

# 简单的CRUD

```java
package com.yww.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class JdbcController {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/select")
    public List<Map<String,Object>> userList(){
        String sql = "SELECT * FROM user";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        return maps;
    }

    @GetMapping("/add")
    public String addUser(){
        String sql = "INSERT INTO USER VALUES(3,'王五')";
        jdbcTemplate.update(sql);
        return "添加完成";
    }

    @GetMapping("/update/{id}")
    public String updateUser(@PathVariable("id") int id){
        String sql = "UPDATE user SET id=4,name='赵六' WHERE id="+id;
        jdbcTemplate.update(sql);
        return "修改完成";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") int id){
        String sql = "DELETE FROM user WHERE id=?";
        jdbcTemplate.update(sql,id);
        return "删除成功";
    }
}
```

<div class='tip'><p>
spring帮我们封装好了JDBC的操作，并做好了模板，就是上述的JdbcTemplate。</br>
JdbcTemplate的几个常用方法。</br>
1. execute()，用于执行任何SQL语句。</br>
2. update()，用于执行新增，修改删除等语句。</br>
3. batchUpdate()，用于执行批处理的语句。</br>
4. query()，用于执行查询语句。</br>
5. call()，用于执行存储过程和函数相关的语句。</br>
</p></div>