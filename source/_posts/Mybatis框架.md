---
title: Mybatis
date: 2020-6-8
categories:
  - Java
description: MyBatis 是一款优秀的持久层框架，还是挺重要的，经常被整合
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2020/6/2020-6-8/top_img.jpg
---

#### Mybatis简介

​		MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。可以参考官网学习[Mybatis](https://mybatis.org/mybatis-3/zh/index.html)



#### Mybatis简单使用

1. 创建maven项目，与之前的第一个servlet程序的流程一样

2. 配置环境，在父项目的pom.xml导入依赖,pom.xml如下

   ```xml
   <?xml version="1.0" encoding="UTF8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <groupId>com.chen</groupId>
       <artifactId>Mybatis-test</artifactId>
       <packaging>pom</packaging>
       <version>1.0-SNAPSHOT</version>
   <!--子项目-->
       <modules>
           <module>Mybatis-01</module>
       </modules>
   <!--导入依赖-->
       <dependencies>
           
           <!--mysql-->
           <dependency>
               <groupId>mysql</groupId>
               <artifactId>mysql-connector-java</artifactId>
               <version>5.1.47</version>
           </dependency>
           
           <!--mybatis-->
           <dependency>
               <groupId>org.mybatis</groupId>
               <artifactId>mybatis</artifactId>
               <version>3.5.4</version>
           </dependency>
   
           <!--junit单-->
           <dependency>
               <groupId>junit</groupId>
               <artifactId>junit</artifactId>
               <version>4.12</version>
           </dependency>
   
       </dependencies>
   
       <build>
           <resources>
               <resource>
                   <directory>src/main/resources</directory>
                   <includes>
                       <include>**/*.properties</include>
                       <include>**/*.xml</include>
                   </includes>
                   <filtering>true</filtering>
               </resource>
   
               <resource>
                   <directory>src/main/java</directory>
                   <includes>
                       <include>**/*.properties</include>
                       <include>**/*.xml</include>
                   </includes>
                   <filtering>true</filtering>
               </resource>
           </resources>
       </build>
   </project>
   ```

3. 在resource目录下编写Mybatis的核心配置文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
           PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-config.dtd">
   
   <!--configuration核心配置文件-->
   <configuration>
       <environments default="development">
           <environment id="development">
               <transactionManager type="JDBC"/>
               <dataSource type="POOLED">
                   <property name="driver" value="com.mysql.jdbc.Driver"/>	
                   <!--这里用&amp;代替&-->
                   <property name="url" value="jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC"/>
                   <property name="username" value="root"/>
                   <property name="password" value="password"/>
               </dataSource>
           </environment>
       </environments>
   <!--每一个xml都需要在核心配置里加载映射-->
       <mappers>
           <mapper resource="com/chen/dao/getUserList.xml"/>
       </mappers>
   
   </configuration>
   ```

4. 编写Mybatis工具类

   > ​		每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的。SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先配置的 Configuration 实例来构建出 SqlSessionFactory 实例。从 XML 文件中构建 SqlSessionFactory 的实例非常简单，建议使用类路径下的资源文件进行配置。 但也可以使用任意的输入流（InputStream）实例，比如用文件路径字符串或 file:// URL 构造的输入流。MyBatis 包含一个名叫 Resources 的工具类，它包含一些实用方法，使得从类路径或其它位置加载资源文件更加容易。

   ```java
   //sqlSessionFactory -->sqlSession
   public class Mybatisutils {
   
           private static SqlSessionFactory sqlSessionFactory;
   
           static{
   
               try {
                   //使用Mybatis第一步：获取sqlSessionFactory对象
                   String resource = "org/mybatis/example/mybatis-config.xml";
                   InputStream inputStream = Resources.getResourceAsStream(resource);
                    sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
               } catch (IOException e) {
                   e.printStackTrace();
               }
   
           }
   
           //既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
           // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法
           //你可以通过 SqlSession 实例来直接执行已映射的 SQL 语句。
           public static SqlSession getSqlSession(){
               return sqlSessionFactory.openSession();
           }
           
   }
   ```

5. 定义接口类

   ```Java
   public interface UserMapper {
   
       List<user> getUserList();
       user getUserById(int id);
   }
   ```

6. 编写xml文件(同目录下好管理)，**写好xml之后需要到核心配置处加载映射**

   ```xml
   <?xml version="1.0" encoding="UTF8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   
   <!--一个namespace绑定一个接口-->
   <mapper namespace="com.chen.dao.UserMapper">
       <!--id表示接口中的方法名，parameterType为接收的参数类型，resultType为返回的类型-->
   	<!--对应接口中的getUserList方法-->
       <select id="getUserList" resultType="com.chen.pojo.user">
       		select * from mybatis
       </select>
   	<!--对应接口中的getUserById方法-->
       <select id="getUserById" parameterType="int" resultType="com.chen.pojo.user">
          	    select *from mybatis where id= #{id}
           <!--#{id}是接收getUserById定义的参数-->
       </select>
       
   </mapper>
   ```

7. 调用

   1. 使用工具类中的getSqlSession方法获取sqlSession对象

   2. 通过sqlSession对象的getMapper方法获得接口的实现
   3. 然后通过实现的接口对象来调用方法
   4. 关闭sqlSession对象

   ```java
   public class UserDaoTest {
       @Test
       public void test(){
   //1
           SqlSession sqlSession = Mybatisutils.getSqlSession();
   //2
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);	//class对象获得接口信息
   //3
           List<user> userlist = mapper.getUserList();
           for(user u:userlist){ 
               System.out.println(u.getId()+"---"+u.getName()+"---"+u.getPwd());
           }
   //4
           sqlSession.close();
       }
   
       @Test
       public void getUserById(){
   //1
           SqlSession sqlSession = Mybatisutils.getSqlSession();
   //2
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
   //3
           user u = mapper.getUserById(1);
            System.out.println(u.getId()+"---"+u.getName()+"---"+u.getPwd());
   //4
           sqlSession.close();
       }
   
   }
   ```


#### 增删改查

​												**增删改都是需要提交事务的**

1. 接口

   ```Java
   package com.chen.dao;
   
   import com.chen.pojo.user;
   
   import java.util.List;
   
   public interface UserMapper {
       List<user> getUserList();
       user getUserById(int id);
       int addUser(user u);
       int updateUser(user u);
       int deleteUser(int id);
   }
   
   ```

2. 绑定的xml

   ```Java
   <?xml version="1.0" encoding="UTF8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   
   
   <mapper namespace="com.chen.dao.UserMapper">
       <select id="getUserList" resultType="com.chen.pojo.user">
           select * from mybatis
       </select>
   
       <select id="getUserById" parameterType="int" resultType="com.chen.pojo.user">
           select *from mybatis where id= #{id}
       </select>
   
       <insert id="addUser" parameterType="com.chen.pojo.user">
           insert into mybatis(id,name,pwd) values(#{id},#{name},#{pwd})
       </insert>
   
       <update id="updateUser" parameterType="com.chen.pojo.user">
           update mybatis set name=#{name},pwd=#{pwd} where id=#{id}
       </update>
   
       <delete id="deleteUser" parameterType="int">
           delete from mybatis where id = #{id}
       </delete>
   
   </mapper>
   ```

3. 测试类

   ```Java
   package com.chen.dao;
   
   import com.chen.pojo.user;
   import com.chen.utils.Mybatisutils;
   import org.apache.ibatis.session.SqlSession;
   import org.junit.Test;
   import java.util.List;
   
   public class UserDaoTest {
       @Test
       public void test(){
           //获得sqlSession对象
           SqlSession sqlSession = Mybatisutils.getSqlSession();
           //执行sql语句
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
           List<user> userlist = mapper.getUserList();
           for(user u:userlist){
               System.out.println(u.getId()+"---"+u.getName()+"---"+u.getPwd());
           }
           //关闭sqlSession
           sqlSession.close();
       }
       
       @Test
       public void getUserById(){
           SqlSession sqlSession = Mybatisutils.getSqlSession();
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
           user u = mapper.getUserById(1);
           System.out.println(u);
           sqlSession.close();
       }
       
   //			增删改的的操作都是需要commit提交事务的，不然实现不了
       
       @Test
       public void Adduser(){
           SqlSession sqlSession = Mybatisutils.getSqlSession();
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
           mapper.addUser(new user(4, "liuliu", "4"));
           sqlSession.commit();
           sqlSession.close();
       }
   
       @Test
       public void UpdateUser(){
           SqlSession sqlSession = Mybatisutils.getSqlSession();
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
           mapper.updateUser(new user(4,"六六","5"));
           sqlSession.commit();
           sqlSession.close();
       }
       
       @Test
       public void DelteUser(){
           SqlSession sqlSession = Mybatisutils.getSqlSession();
           UserMapper mapper = sqlSession.getMapper(UserMapper.class);
           mapper.deleteUser(4);
           sqlSession.commit();
           sqlSession.close();
       }
   
   }
   ```

#### Mybatis的配置详情

​		Mybatis配置文件就是resources文件下的mybatis-config.xml。虽然可以改名，官方推荐使用这个名字

> 需要注意的是，这些配置是按顺序的，比如环境配置是不能放在属性配置前面的，不然会报错

![](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2020/6/2020-6-8/img1.png)

##### 环境配置（envirnments）

> MyBatis 可以配置成适应多种环境，这种机制有助于将 SQL 映射应用于多种数据库之中， 现实情况下有多种理由需要这么做。例如，开发、测试和生产环境需要有不同的配置；或者想在具有相同 Schema 的多个生产数据库中使用相同的 SQL 映射。还有许多类似的使用场景。
>
> **不过要记住：尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**
>
> 所以，如果你想连接两个数据库，就需要创建两个 SqlSessionFactory 实例，每个数据库对应一个。而如果是三个数据库，就需要三个实例，依此类推

```xml
<environments default="development">
    
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    
        <environment id="test">
            <transactionManager type="JDBC"/>
             <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC"/>
                <property name="username" value="root"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    
    </environments>
```

- 环境的选择，如果没有环境参数就会选择默认环境，即上述default的环境id

  ```
  SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment);
  SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment, properties);
  ```

- 事务管理器的配置

  如果你正在使用 Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。

  ```xml
  <transactionManager type="JDBC"/>
  ```

- 数据源的配置

  ```xml
  <dataSource type="POOLED">
  ```

##### 属性（properties）

属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。

1. 固定的属性可以直接放在外部的配置文件，比如在resources资源目录下创建一个config-properties文件,&可以不用转译

   ```properties
   driver = com.mysql.jdbc.Driver
   url = jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC
   username = root
   password = password
   ```

   然后在配置文件中调用

   ```xml
   <configuration>
   
       <properties resource="config.properties"/>
       
       <environments default="development">
           <environment id="development">
               <transactionManager type="JDBC"/>
               <dataSource type="POOLED">
                   <property name="driver" value="${driver}"/>
                   <property name="url" value="${url}"/>
                   <property name="username" value="${username}"/>
                   <property name="password" value="${password}"/>
               </dataSource>
           </environment>
   
       </environments>
       <mappers>
           <mapper resource="com/chen/dao/UserMapper.xml"/>
       </mappers>
   </configuration>
   ```

2. 也可以动态的调用，比如

   ```properties
   driver = com.mysql.jdbc.Driver
   url = jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC
   ```

   在配置文件中

   ```xml
   <configuration>
   
       <properties resource="config.properties">
           <property name="username" value="root"/>
           <property name="password" value="password"/>
       </properties>
   
       <environments default="development">
           <environment id="development">
               <transactionManager type="JDBC"/>
               <dataSource type="POOLED">
                   <property name="driver" value="${driver}"/>
                   <property name="url" value="${url}"/>
                   <property name="username" value="${username}"/>
                   <property name="password" value="${password}"/>
               </dataSource>
           </environment>
       </environments>
       <mappers>
           <mapper resource="com/chen/dao/UserMapper.xml"/>
       </mappers>
   </configuration>
   ```

3. 注意的是，外部的优先级较高，在配置文件中properties属性与外部文件的属性冲突时是使用外部文件的属性

##### 类型别名（typeAliases）

类型别名可为 Java 类型设置一个缩写名字。 它仅用于 XML 配置，意在降低冗余的全限定类名书写。

1. 类

   ```xml
   <typeAliases>
     <typeAlias alias="user" type="com.chen.pojo.user"/>
   </typeAliases>
   ```

2. 包

   ```xml
   <typeAliases>
     <package name="com.chen.pojo"/>
   </typeAliases>
   ```

   > 指定一个包名，MyBatis 会在包名下面搜索需要的 Java Bean。在没有注解的情况下，会使用 Bean 的首字母小写的非限定类名来作为它的别名。比如在Mybatis会自动扫描路径上的包，在没有注解的情况下，里面的user类的别名就会定义为user

3. 通过注解来起别名

   ```Java
   @Alias("user")
   public class user {
       
   }
   ```

##### 设置（Settings）

这是 MyBatis 中极为重要的调整设置，它们会改变 MyBatis 的运行时行为。了解几个就行

| **设置名**         | **描述**                                                     | **有效值**                                                   | **默认值** |
| :----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------- |
| cacheEnabled       | 全局性地开启或关闭所有映射器配置文件中已配置的任何缓存。     | true\|false                                                  | true       |
| lazyLoadingEnabled | 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置 `fetchType` 属性来覆盖该项的开关状态。 | true\|false                                                  | false      |
| logImpl            | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。        | SLF4J\|LOG4J\|LOG4J2JDK_LOGGING\|<br />COMMONS_LOGGING\|<br />STDOUT_LOGGING<br />\|NO_LOGGING | 未设置     |

#####  映射器（mappers）

既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要来定义 SQL 映射语句了。 但首先，我们需要告诉 MyBatis 到哪里去找到这些语句。 在自动查找资源方面，Java 并没有提供一个很好的解决方案，所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件。 你可以使用相对于类路径的资源引用，或完全限定资源定位符（包括 `file:///` 形式的 URL），或类名和包名等。

1. 使用相对于类路径的资源引用，推荐使用这种

   ```xml
   <mappers>
     <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
     <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
     <mapper resource="org/mybatis/builder/PostMapper.xml"/>
   </mappers>
   ```

2. 使用完全限定资源定位符（URL）,不推荐

   ```xml
   <mappers>
     <mapper url="file:///var/mappers/AuthorMapper.xml"/>
     <mapper url="file:///var/mappers/BlogMapper.xml"/>
     <mapper url="file:///var/mappers/PostMapper.xml"/>
   </mappers>
   ```

3. 使用映射器接口实现类的完全限定类名

   > 1. 接口与Mapper配置文件同名
   > 2. 接口和它的Mapper配置文件同包

   ```xml
   <mappers>
     <mapper class="org.mybatis.builder.AuthorMapper"/>
     <mapper class="org.mybatis.builder.BlogMapper"/>
     <mapper class="org.mybatis.builder.PostMapper"/>
   </mappers>
   ```

4. 将包内的映射器接口实现全部注册为映射器

   > 1. 接口与Mapper配置文件同名
   > 2. 接口和它的Mapper配置文件同包，也可以将它的Mapper配置文件放在resources下创建相同路径的文件夹

   ```xml
   <mappers>
     <package name="org.mybatis.builder"/>
   </mappers>
   ```

#### 作用域（Scope）和生命周期

理解我们之前讨论过的不同作用域和生命周期类别是至关重要的，因为错误的使用会导致非常严重的并发问题。

##### SqlSessionFactoryBuilder

- 这个类可以被实例化、使用和丢弃，一旦创建了 SqlSessionFactory，就不再需要它了。
- 因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（也就是局部方法变量）。

##### SqlSessionFactory

- SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。
- 因此 SqlSessionFactory 的最佳作用域是应用作用域。

##### SqlSession

- 每个线程都应该有它自己的 SqlSession 实例。
- SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。
-  绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行，也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中。
- 如果你现在正在使用一种 Web 框架，考虑将 SqlSession 放在一个和 HTTP 请求相似的作用域中。 换句话说，每次收到 HTTP 请求，就可以打开一个 SqlSession，返回一个响应后，就关闭它。 这个关闭操作很重要，为了确保每次都能执行关闭操作，你应该把这个关闭操作放到 finally 块中。 

#### 属性名与字段不一致

在有些操作里，会因为pojo包里的属性名与数据库的字段名不一样而会达不到应有效果，比如有时候会查不到不同属性名的值，所以就要注意属性名要与字段一致，要是不一样还有一些其他的解决方法。

##### 起别名

为你不同的属性名取一个与字段一样的别名，这样就能实现属性名与字段一致，比如属性名为password,字段名为pwd，则为password起一个pwd的别名

```xml
<typeAliases>
        <typeAlias alias="pwd" type="password"/>
</typeAliases>
```

##### ResultMap

resultMap为结果集映射，将你的字段名映射为属性名，便能使属性名与字段一致

```xml
    <resultMap id="result" type="user">
   <!--column为数据库字段，映射类型为user，property为映射的属性名-->
		<result column="id" property="id"/>
        <result column="name" property="name"/>
        <!--一样的属性可以不用写，只写不同的就可以-->
        <result column="pwd" property="password"/>
    </resultMap>

						<!--resulMap值与上述id一致-->
    <select id="getUserById" parameterType="int" resultMap="result">
        select *from mybatis where id= #{id}
    </select>
```

#### 日志

Mybatis 通过使用内置的日志工厂提供日志功能。因为Mybatis的设置日志是为设置的，所以需要设置才能看得到
![](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@v1.5/2020/6/2020-6-8/img2.png)

##### STDOUT_LOGGING

```xml
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
			<!--name与value大小写不要错，空格不要多-->
```

![](https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@v1.5/2020/6/2020-6-8/img3.png)

##### Log4j

Log4j是Apache的一个开源项目，通过使用Log4j，我们可以控制日志信息输送的目的地是控制台、文件、GUI组件，甚至是套接口服务器、NT的事件记录器、UNIXSyslog守护进程等；我们也可以控制每一条日志的输出格式；通过定义每一条日志信息的级别，我们能够更加细致地控制日志的生成过程。最令人感兴趣的就是，这些可以通过一个配置文件来灵活地进行配置，而不需要修改应用的代码。

1. 导入依赖

   ```xml
   <!-- https://mvnrepository.com/artifact/log4j/log4j -->
           <dependency>
               <groupId>log4j</groupId>
               <artifactId>log4j</artifactId>
               <version>1.2.17</version>
           </dependency>
   ```

2. 在resouces目录下创建log4j.properties配置文件，并设置配置，网上很多可以去复制

   ```properties
   #将等级为DEBUG的日志信息输出到console和file两个目的地
   log4j.rootLogger=DEBUG,console,file
   
   #控制台输出的相关设置
   log4j.appender.console=org.apache.log4j.ConsoleAppender
   log4j.appender.console.Target=System.out
   log4j.appender.console.Threshold=DEBUG
   log4j.appender.console.layout=org.apache.log4j.PatternLayout
   log4j.appender.console.layout.ConversionPattern=[%c]-%m%n
   
   #文件输出的相关配置
   log4j.appender.file=org.apache.log4j.RollingFileAppender
   log4j.appender.file.File=./log/Mybatis.log
   log4j.appender.file.MaxFileSize=10mb
   log4j.appender.file.Threshold=DEBUG
   log4j.appender.file.layout=org.apache.log4j.PatternLayout
   log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}[%c]%m%n
   
   #日志输出级别
   log4j.logger.org.mybatis=DEBUG
   log4j.logger.java.sql=DEBUG
   log4j.logger.java.sql.Statement=DEBUG
   log4j.logger.java.sql.ResultSet=DEBUG
   log4j.logger.java.sql.PreparedStatement=DEBUG
   ```

3. 设置日志实现

   ```xml
    <settings>
           <setting name="logImpl" value="LOG4J"/>
       </settings>
   ```

#### 注解

对于像 BlogMapper 这样的映射器类来说，还有另一种方法来完成语句映射。 它们映射的语句可以不用 XML 来配置，而可以使用 Java 注解来配置。

1. 注解

   ```java
   public interface UserMapper {
   	@Select("select * from user")
       List<user> getUserList();
   }
   ```

2. 去核心配置文件处绑定接口

   ```xml
   <mappers>
   	<mapper class="com.chen.dao.UserMapper"/>
   </mappers>
   ```

> 使用注解来映射简单语句会使代码显得更加简洁，但对于稍微复杂一点的语句，Java 注解不仅力不从心，还会让你本就复杂的 SQL 语句更加混乱不堪。 因此，如果你需要做一些很复杂的操作，最好用 XML 来映射语句。