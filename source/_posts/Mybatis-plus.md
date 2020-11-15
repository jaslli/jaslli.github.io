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



# 主键生成策略

## 雪花算法

首先来做个插入的测试。

```Java
package com.yw;

import com.yw.Mapper.UserMapper;
import com.yw.pojo.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {
    
    @Autowired
    private UserMapper userMapper;
    //用的还是官网给的测试数据库
    @Test
    public void testInsert() {
        User user = new User();
        user.setAge(20);
        user.setEmail("1141950370@qq.com");
        user.setName("yww");
        userMapper.insert(user);
    }
}
```

这个测试是没有设置主键`id`的值的，来看一下主键的生成。

插入成功之后看到数据是这样的。
![](https://img.yww52.com/2020/11/2020-11-14/img1.png)

这么一长串的`id`是什么东西呢，我们在官网看到主键有个注释`@TableId`，点进去看看源码。

```Java
package com.baomidou.mybatisplus.annotation;
import java.lang.annotation.*;
/**
 * 表主键标识
 *
 * @author hubin
 * @since 2016-01-23
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.ANNOTATION_TYPE})
public @interface TableId {
    /**
     * 字段名（该值可无）
     */
    String value() default "";
    /**
     * 主键类型
     * {@link IdType}
     */
    IdType type() default IdType.NONE;
}
```

这里就可以看到主键是可以可无的，下面是默认的主键生成策略，我们在点`IdType`进去看看有什么策略。

```Java
package com.baomidou.mybatisplus.annotation;
import lombok.Getter;

/**
 * 生成ID类型枚举类
 *
 * @author hubin
 * @since 2015-11-10
 */
@Getter
public enum IdType {
    /**
     * 数据库ID自增
     * <p>该类型请确保数据库设置了 ID自增 否则无效</p>
     */
    AUTO(0),
    /**
     * 该类型为未设置主键类型(注解里等于跟随全局,全局里约等于 INPUT)
     */
    NONE(1),
    /**
     * 用户输入ID
     * <p>该类型可以通过自己注册自动填充插件进行填充</p>
     */
    INPUT(2),

    /* 以下3种类型、只有当插入对象ID 为空，才自动填充。 */
    /**
     * 分配ID (主键类型为number或string）,
     * 默认实现类 {@link com.baomidou.mybatisplus.core.incrementer.DefaultIdentifierGenerator}(雪花算法)
     *
     * @since 3.3.0
     */
    ASSIGN_ID(3),
    /**
     * 分配UUID (主键类型为 string)
     * 默认实现类 {@link com.baomidou.mybatisplus.core.incrementer.DefaultIdentifierGenerator}(UUID.replace("-",""))
     */
    ASSIGN_UUID(4),
    /**
     * @deprecated 3.3.0 please use {@link #ASSIGN_ID}
     */
    @Deprecated
    ID_WORKER(3),
    /**
     * @deprecated 3.3.0 please use {@link #ASSIGN_ID}
     */
    @Deprecated
    ID_WORKER_STR(3),
    /**
     * @deprecated 3.3.0 please use {@link #ASSIGN_UUID}
     */
    @Deprecated
    UUID(4);

    private final int key;

    IdType(int key) {
        this.key = key;
    }
}
```

在这里就看到当主键为空的时候，会有一个默认的生成策略`ASSIGN_ID`，这个策略的默认实现算法是`雪花算法`。

![雪花算法](https://img.yww52.com/2020/11/2020-11-14/img2.png)

## 总结

官网已经将上述方法已经总结的很好了,我就直接放官方的表了。

|        值         |                             描述                             |
| :---------------: | :----------------------------------------------------------: |
|       AUTO        |            数据库ID自增(需要数据库也要设置为自增)            |
|       NONE        | 无状态,该类型为未设置主键类型(注解里等于跟随全局,全局里约等于 INPUT) |
|       INPUT       |                    insert前自行set主键值                     |
|     ASSIGN_ID     | 分配ID(主键类型为Number(Long和Integer)或String)(since 3.3.0),使用接口`IdentifierGenerator`的方法`nextId`(默认实现类为`DefaultIdentifierGenerator`雪花算法) |
|    ASSIGN_UUID    | 分配UUID,主键类型为String(since 3.3.0),使用接口`IdentifierGenerator`的方法`nextUUID`(默认default方法) |
|   ~~ID_WORKER~~   |     分布式全局唯一ID 长整型类型(please use `ASSIGN_ID`)      |
|     ~~UUID~~      |           32位UUID字符串(please use `ASSIGN_UUID`)           |
| ~~ID_WORKER_STR~~ |     分布式全局唯一ID 字符串类型(please use `ASSIGN_ID`)      |

> 从官网的删除线和源码来看，后面三种是已经不支持使用了的。
>
> 默认的生成策略是NONE，相当于INPUT，就是自己设置主键的值，当主键没有设值的时候，默认是使用ASSIGN_ID雪花算法。



> 有待更新。