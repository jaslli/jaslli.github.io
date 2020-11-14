---
title: Mybatis-plus
date: 2020-11-14
categories:
  - SpringBoot
descrition: 顾名思义，plus就是Mybatis的升级版，能帮助你更简便的使用Mybatis。基于springboot的学习，springmvc部分配置有些不同。
cover: https://img.yww52.com/2020/11/2020-11-14/top_img.jpg
---

# 简介

MyBatis-Plus（简称 MP）是一个 MyBatis的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

- [官网地址](https://baomidou.com/)

# 快速开始

<div class='tip'>
    <p>
        参照官网快速开始的样例，官网用的是h2数据库，我这里用的是Mysql。
    </p>
</div>

1. 创建数据库`schema`，并执行以下脚本。

   ```mysql
   DROP TABLE IF EXISTS user;
   
   CREATE TABLE user
   (
   	id BIGINT(20) NOT NULL COMMENT '主键ID',
   	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
   	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
   	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
   	PRIMARY KEY (id)
   );
   
   DELETE FROM user;
   
   INSERT INTO user (id, name, age, email) VALUES
   (1, 'Jone', 18, 'test1@baomidou.com'),
   (2, 'Jack', 20, 'test2@baomidou.com'),
   (3, 'Tom', 28, 'test3@baomidou.com'),
   (4, 'Sandy', 21, 'test4@baomidou.com'),
   (5, 'Billie', 24, 'test5@baomidou.com');
   ```

2. 添加依赖

   ```xml
   <dependencies>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter</artifactId>
           </dependency>
           <!--数据库驱动-->
           <dependency>
               <groupId>mysql</groupId>
               <artifactId>mysql-connector-java</artifactId>
           </dependency>
           <!--lombok-->
           <dependency>
               <groupId>org.projectlombok</groupId>
               <artifactId>lombok</artifactId>
               <optional>true</optional>
           </dependency>
           <!--mybatis-plus-->
           <dependency>
               <groupId>com.baomidou</groupId>
               <artifactId>mybatis-plus-boot-starter</artifactId>
               <version>3.4.1</version>
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

3. 创建一个实体类

   ```Java
   package com.yw.pojo;
   import lombok.Data;
   
   @Data
   public class User {
       private Long id;
       private String name;
       private Integer age;
       private String email;
   }
   ```

4. 创建Mapper接口

   ```Java
   package com.yw.Mapper;
   
   import com.baomidou.mybatisplus.core.mapper.BaseMapper;
   import com.yw.pojo.User;
   import org.springframework.stereotype.Repository;
   
   @Repository
   public interface UserMapper extends BaseMapper<User> {}
   ```

5. 配置数据源和日志

   ```yaml
   # 配置MySQL
   spring:
    datasource:
     username: root
     password: password
     url: jdbc:mysql://localhost:3306/schema?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
     driver-class-name: com.mysql.cj.jdbc.Driver
   # 配置日志，以便更好查看结果 
   mybatis-plus:
     configuration:
      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
   ```

6. 扫描Mapper文件

   ```Java
   package com.yw;
   
   import org.mybatis.spring.annotation.MapperScan;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   
   @SpringBootApplication
   @MapperScan("com.yw.Mapper")
   public class DemoApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoApplication.class, args);
       }
   }
   ```

7. 测试类

   ```Java
   package com.yw;
   
   import com.yw.Mapper.UserMapper;
   import com.yw.pojo.User;
   import org.junit.jupiter.api.Test;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.test.context.SpringBootTest;
   import java.util.List;
   
   @SpringBootTest
   class DemoApplicationTests {
   
       @Autowired
       private UserMapper userMapper;
   
       @Test
       public void testSelect() {
           List<User> userList = userMapper.selectList(null);
           System.out.println(userList);
       }
       
   }
   ```

> 然后就完成了。这的确比mybatis简单了不少。
>
> mybatis大概流程是导入依赖，定义实体类，定义mapper接口，创建绑定mapper接口的xml配置文件,配置数据源并绑定mybatis的配置文件和实体类，然后才能使用。现在简单了很多。

