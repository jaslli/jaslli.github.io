---
title: SpringBoot使用Mybatis
date: 2020-11-25
categories:
  - SpringBoot
description: 用SpringBoot整合Mybatis，并简单的使用
keywords: SpringBoot使用Mybatis,Mybatis
cover:https://img.yww52.com/2020/11/2020-11-25top_img3.jpg
---

# 简介

Mybaits是经常用到的持久化框架，这次用SpringBoot来整合使用Mybatis。

# 依赖

```xml
  <dependencies>
		<!--Mybatis场景启动器-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.1</version>
        </dependency>
		<!--web场景启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
		<!--MySQL驱动-->
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
		<!--Druid-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.2.1</version>
        </dependency>
		<!--log4j日志-->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
		<!--lombok-->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
            </dependency>
    </dependencies>
    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

# 定义实体类

```Java
package com.yww.pojo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor	//使用lombok偷懒
public class User {
    int ID;
    String name;
}
```

# 定义Mapper接口

```Java
package com.yww.mapper;
import com.yww.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface UserMapper {
    List<User> selectUserList();
    User selectUserByID(int ID);
    int addUser(User user);
    int updateUser(User user);
    int deleteUser(int id);
}
```

# 创建Mybatis配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
	<!--绑定mapper接口，位置要写对-->
<mapper namespace="com.yww.mapper.UserMapper">
    <select id="selectUserList" resultType="User">
        SELECT * FROM user
    </select>

    <select id="selectUserByID" resultType="User">
        SELECT * FROM user WHERE ID = #{ID}
    </select>

    <insert id="addUser" parameterType="User">
        INSERT INTO user (ID,name) VALUES (#{ID},#{name})
    </insert>

    <update id="updateUser" parameterType="User">
        UPDATE user SET name=#{name} WHERE ID = #{ID}
    </update>

    <delete id="deleteUser" parameterType="int">
        DELETE FROM user WHERE ID=#{ID}
    </delete>
</mapper>
```

# 配置SpringBoot配置文件

```yaml
# application.yml使用
# 连接数据库
spring:
  datasource:
    username: root
    password: password
    url: jdbc:mysql://localhost:3306/test?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource	
    # Druid的配置
    initialSize: 5
    minIdle: 5
    maxActive: 20
    max-wait: 60000
    timeBetweenEvictionRunsMillis: 60000
    minEvictableIdleTimeMillis: 300000
    validationQuery: SELECT 1 FROM DUAL
    testWhileIdle: true
    testOnBorrow: false
    testOnReturn: false
    poolPreparedStatements: true
    filters: stat,wall,log4j
    maxPoolPreparedStatementPerConnectionSize: 20
    useGlobalDataSourceStat: true
    connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
# mybatis设置
mybatis:
  type-aliases-package: com.yww.pojo					#绑定实体类，不然配置文件识别不出User
  mapper-locations: classpath:mybatis/mapper/*.xml		#绑定mybatis的配置文件
```

# 编写controller

```Java
package com.yww.controller;

import com.yww.mapper.UserMapper;
import com.yww.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
public class UserController {
    @Autowired
    private UserMapper userMapper;
    @GetMapping("/select")
    public List<User> selectUserList(){
        List<User> list = userMapper.selectUserList();
        return list;
    }
    @GetMapping("/selectbyid")
    public User selectByID(){
        User user = userMapper.selectUserByID(1);
        return user;
    }
    @GetMapping("/insert")
    public int addUser(){
        User user = new User(3, "王五");
        return  userMapper.addUser(user);
    }
    @GetMapping("/update")
    public int  updateUser(){
        User user = new User(3, "赵六");
        return userMapper.updateUser(user);
    }
    @GetMapping("/delete")
    public int  deleteUser(){
        return userMapper.deleteUser(3);
    }
}
```

