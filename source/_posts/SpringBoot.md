---
title: SpringBoot
date: 2020-10-15
categories:
  - SpringBoot
description: 学习SpeingBoot的笔记
cover: https://img.yww52.com/2020/10/2020-10-15top_img.jpg
---

# SpringBoot

SpringBoot是一个全新开源的轻量级框架。它基于Spring4.0设计，进一步简化了Spring的配置，更加简单的完成整个搭建和开发。

# 微服务架构

https://martinfowler.com/articles/microservices.html

# 第一个SpringBoot程序

可以去[官网](https://start.spring.io/)去创建一个springboot的项目（用idea自带创建也是通过官网创建的），配置什么的自己选择，注意要添加一个Spring Web的依赖，不然不能用作Web开发，然后GENERATE下载项目到本地，用idea导入项目就可以了。

在项目自带的Application类的同级目录下（一定要同级目录，不然SpringBoot无法扫描到你写的类）创建包和类，现创建一个Hello的类。

```Java
@Controller
@ResponseBody//将返回的数据写给浏览器，对象就会返回JSON数据
//这两个由@RestController替换，因为这两个注解已经被RestController注解包括了。
public class Hello {
    @GetMapping("/hello")
    public String hello(){
        return "Hello World!";
    }
}
```

然后通过Application类来运行，然后打开你的<http://localhost:8080/hello>就能看到HelloWorld了。

# SpringBoot程序详解

分析一下我们的第一个SpringBoot程序。

## Pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.4.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.yw</groupId>
	<artifactId>demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>demo</name>
	<description>My first springboot demo</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
        <!--Web场景启动器-->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

	</dependencies>
	 	<!--打包工具-->
	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

1. 父项目

   ```xml
   <!--Springboot的父项目-->
   <parent>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-parent</artifactId>
           <version>2.3.4.RELEASE</version>
           <relativePath/> <!-- lookup parent from repository -->
   </parent>
   <!--点进去发现还有一个父项目-->
   <parent>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-dependencies</artifactId>
       <version>2.3.4.RELEASE</version>
   </parent>
   <!--
   点进去看到有很多properties，这些都是依赖的版本，即这个父项目管理了所有用到的依赖的版本，这就是为什么导入依赖时候不用声明版本号的原因。
   -->
   ```

2. 导入的Spring Web的依赖

   ```Xml
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   ```

   ```xml
   <!--spring-boot-starter-web里的内容-->
   <?xml version="1.0" encoding="UTF-8"?>
   <project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns="http://maven.apache.org/POM/4.0.0"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
     <!-- This module was also published with a richer model, Gradle metadata,  -->
     <!-- which should be used instead. Do not delete the following line which  -->
     <!-- is to indicate to Gradle or any Gradle module metadata file consumer  -->
     <!-- that they should prefer consuming it instead. -->
     <!-- do_not_remove: published-with-gradle-metadata -->
     <modelVersion>4.0.0</modelVersion>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
     <version>2.3.4.RELEASE</version>
     <name>spring-boot-starter-web</name>
     <description>Starter for building web, including RESTful, applications using Spring MVC. Uses Tomcat as the default embedded container</description>
     <url>https://spring.io/projects/spring-boot</url>
     <organization>
       <name>Pivotal Software, Inc.</name>
       <url>https://spring.io</url>
     </organization>
     <licenses>
       <license>
         <name>Apache License, Version 2.0</name>
         <url>https://www.apache.org/licenses/LICENSE-2.0</url>
       </license>
     </licenses>
     <developers>
       <developer>
         <name>Pivotal</name>
         <email>info@pivotal.io</email>
         <organization>Pivotal Software, Inc.</organization>
         <organizationUrl>https://www.spring.io</organizationUrl>
       </developer>
     </developers>
     <scm>
       <connection>scm:git:git://github.com/spring-projects/spring-boot.git</connection>
       <developerConnection>scm:git:ssh://git@github.com/spring-projects/spring-boot.git</developerConnection>
       <url>https://github.com/spring-projects/spring-boot</url>
     </scm>
     <issueManagement>
       <system>GitHub</system>
       <url>https://github.com/spring-projects/spring-boot/issues</url>
     </issueManagement>
     <dependencies>
       <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter</artifactId>
         <version>2.3.4.RELEASE</version>
         <scope>compile</scope>
       </dependency>
       <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-json</artifactId>
         <version>2.3.4.RELEASE</version>
         <scope>compile</scope>
       </dependency>
       <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-tomcat</artifactId>
         <version>2.3.4.RELEASE</version>
         <scope>compile</scope>
       </dependency>
       <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-web</artifactId>
         <version>5.2.9.RELEASE</version>
         <scope>compile</scope>
       </dependency>
       <dependency>
         <groupId>org.springframework</groupId>
         <artifactId>spring-webmvc</artifactId>
         <version>5.2.9.RELEASE</version>
         <scope>compile</scope>
       </dependency>
     </dependencies>
   </project>
   ```

   <div class='tip' ><p>
    spring-boot-starter,SpringBoot的场景启动器。那什么是场景启动器呢？在SpringBoot框架中，开发者已经帮我们模拟了很多个使用SpringBoot的开发场景，并将这些场景需要的依赖和配置全部写入到这些场景启动器当中。比如我们现在是开发web的场景，我们就导入了这个Spring Web的依赖，主要就是这个spring-boot-starter-web的web场景启动器，里面都是我们开发web需要的依赖以及一些配置。
   <p></div>

## 主程序

```Java
@SpringBootApplication
public class SpringbootApplication {
	public static void main(String[] args) {
		SpringApplication.run(SpringbootApplication.class, args);
	}
}
```

> @SpringBootApplication这个注解标注了这是SpringBoot的主配置类，SpringBoot通过这个主配置类的main方法来启动这个SpringBoot的应用。查看里面的源码就会发现这个注解是由很多注解组成的，下面详细分析一下。

```Java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
```

### @SpringBootConfiguration

这个注解表示这个类是一个SpringBoot的配置类，点开里面发现还有个**@Configuration**注解，这个注解表示这是个Spring的配置类。

```Java
@Configuration
public @interface SpringBootConfiguration {
```

在点开就发现了这个**@Component**，所以发现这个配置类是容器的一个组件。

```Java
@Component
public @interface Configuration {
```

### @EnableAutoConfiguration

这个注解告诉了SpringBoot要开启自动配置功能。

```Java
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
```

**@Import(AutoConfigurationImportSelector.class)**这是导入组件的选择器，会给容器导入很多这个场景所需要的所有组件并配置号这些组件。

**@AutoConfigurationPackage**这个注解表示自动配置包，点进去发现有一个这样的注解

```Java
@Import(AutoConfigurationPackages.Registrar.class)
```

这个注解是Spring的底层注解，@Import指定了AutoConfigurationPackages.Registrar.class这个类给容器导入一些组件。

**所以这个@EnableAutoConfiguration就是将主配置类同目录下的包与类的所有组件扫描到Spring容器里面，这就是为什么一定要在同目录下创建包与类，因为不同目录就不会扫描得到。**



## Resource文件夹

1. static文件夹
   保存静态资源的文件夹，比如js,css文件等。

2. templates文件夹
   保存模板页面的文件夹，因为SpringBoot默认jar包嵌入式的Tomcat，所以不支持JSP页面，所以需要用到模板引擎来配置页面。

3. application.properties（application.yml）
   SpringBoot的配置文件（名字是固定的不能修改）,因为SpringBoot已经帮我们配置好了很多配置，想要修改这些默认配置就需要在这个配置文件自己修改，这个配置文件由两种形式，properties和yml形式。

   > 1. application.properties的格式是	key=value	
   > 子配置就用点，比如service下的port配置就表示为service.port=value
   > 2. application.yml的格式是	key: value	注意有空格，因为yml文件对空格很敏感，
   >     具体语法可参照[YAML语法](https://yww52.com/2020/10/20/yml语法/),之后就用yaml的这种格式来写配置文件

# 配置文件值的注入

首先先写个需要注入值的类。

```Java
@Component
@ConfigurationProperties(prefix = "user")
public class User {
    private String name;
    private int age;
    private Date birth;
    private Boolean happy;
    private Map<String,Object> family;
    private List<Object> hobby;
    private Dog dog;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Boolean getHappy() {
        return happy;
    }

    public void setHappy(Boolean happy) {
        this.happy = happy;
    }

    public Map<String, Object> getFamily() {
        return family;
    }

    public void setFamily(Map<String, Object> family) {
        this.family = family;
    }

    public List<Object> getHobby() {
        return hobby;
    }

    public void setHobby(List<Object> hobby) {
        this.hobby = hobby;
    }

    public Dog getDog() {
        return dog;
    }

    public void setDog(Dog dog) {
        this.dog = dog;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", birth=" + birth +
                ", happy=" + happy +
                ", hobby=" + hobby +
                ", family=" + family +
                ", dog=" + dog +
                '}';
    }
}
```

```Java
@Component
public class Dog {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Dog{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

<div class='tip'><p>
    1. @Component表示这是spring的组件，会被注入到spring的容器中进行管理</br>
    2. @ConfigurationProperties(prefix = "user")表示绑定配置文件中的user的配置，这样就可以进行值的注入了
</p></div>

然后导入一个配置文件处理器的依赖（不导入会爆红虽然没影响），可以去配置文件注入值了。

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-configuration-processor</artifactId>
</dependency>
```

这样就可以成功的将值注入了，可以去测试类进行一下测试。

```Java
@SpringBootTest
class DemoApplicationTests {
	@Autowired
	User user;	//其实不一定要与配置类中的名称一致，user01也能读取出值
	@Test
	void contextLoads() {
		System.out.println(user);
	}
}
```

 得到答案

```
User{name='Yw', age=20, birth=Wed Oct 21 00:00:00 CST 2020, happy=true, hobby=[play, game], family={father=yww1, mother=yww2}, dog=Dog{name='wwangwang', age=3}}
```



# 导入文件资源

## @PropertySource

在上述的示例当中，要是总是把注入的值都加进全局的配置文件中就会显得很乱，所以可以新建一个文件在通过@PropertySource标签导入进去也可以实现值的注入，这样application.properties中就可以不用写user的值了，值都写在user.properties即可。

```Java
@Component
@ConfigurationProperties(prefix = "user")
@PropertySource(value = {"classpath:user.properties"})
public class User {
```

<div class='tip'><p>
注意@PropertySource这个标签导入的是properties的文件，yml文件会出问题。
</p></div>

## @ImportResource

这个标签是用来导入spring的配置文件到springBoot中的（即xml格式）

```Java
@ImportResource(locations = {"classpath:beans.xml"})
```

## @Bean

这个标签的功能与@ImportResource类似，也是为了导入配置，给容器添加一个组件的。比如写一个配置类。

```Java
@Configuration	//表示这个类是一个配置类，就像是一个spring的配置文件
public class Config {
    @Bean	//将方法的返回值注入到容器之中，类似spring配置中
    public Hello hello(){
        return new Hello();
    }
}
```

<div class='tip'><p>
    1. @Configuration 表示这个类是一个配置类，就像是一个spring的配置文件</br>
	2. @Bean 将方法的返回值注入到容器之中，类似spring配置中<beans></beans>注入bean的操作，方法名就是这个bean的id。
</p></div>

# Profile

## properties的多文档

首先就是主要的配置文件`application.properties`，创建多文档的方式就是按照`application-[name].properties`的形式命名创建在resources目录下。就比如我创建了一个测试环境的配置，命名为`application-dev.properties`

## yaml的多文档

这个就很方便了，直接在`application.yml`中就可以创建多个文档配置了。只要通过`---`就能将配置文件分成不同的文档配置，通过`spring.profiles: [name]`这个配置就能为这个文档配置取个名字了。

```yaml
server:
  port: 8085
---
server:
  port: 8086
spring:
  profiles: dev
---
```

## 激活指定的Profile

### properties

在主配置文件，即`application.properties`下增加这个配置，就可以激活相应名字的文档配置文件。

```properties
spring.profiles.active=dev
```

### yaml

yaml形式也是通过这个配置spring.profiles.active=dev，就能激活相应名字的文档配置文件。

```yaml
server:
  port: 8085
spring:
  profiles:
    active: dev
---
server:
  port: 8086
spring:
  profiles: dev
```

### 共同的激活方式

1. 命令行
   比如在打了jar包之后，在命令行运行jar包的时候增加配置就能激活指定配置文件生效。

   ```cmd
   java -jar ---.jar --spring.profiles.active=dev
   ```

2. 虚拟机参数
   修改虚拟机参数也可以修改。

   ```
   -Dspring.profiles.active=dev
   ```



# 配置文件的优先级

配置文件的优先级由高到低分别为：

1. 项目路径下的config文件夹中的配置文件
2. 项目路径下的配置文件
3. 资源路径下的config文件夹中的配置文件
4. 资源路径下的配置文件

springboot会通过优先级来加载配置文件，要是有不止一个配置文件，springboot也是会全部加载这些配置文件。对于设置了相同的配置，优先级高的配置文件设置的就会覆盖掉优先级低的配置文件的设置。就比如每个配置文件都设置了不同的打开端口，就会以优先级高的配置文件的为准。其他不冲突的配置也是生效的。



# JDBC

1. 首先导入所需要的依赖。

    ```xml
    <dependencies>
            //JDBC的场景启动器
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-jdbc</artifactId>
            </dependency>
            //WEB的场景启动器
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
            </dependency>
            //Mysql
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <scope>runtime</scope>
            </dependency>
            //单元测试
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

2. 然后去配置文件配置链接数据库。（这里我就用yaml形式的配置文件配置）

    ```yaml
    spring:
      datasource:
        username: root
        password: password
        url: jdbc:mysql://localhost:3306/shop?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
        driver-class-name: com.mysql.cj.jdbc.Driver
    ```

3. 然后就可以写一个简单的CRUD了。

    ```Java
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



# Druid

Druid是的一个阿里巴巴的开源项目，它是一个数据库连接池的实现。Druid能够提供强大的监控和扩展功能。

1. 首先就是添加Druid数据源的依赖，以上面JDBC依赖的基础上加。

    ```xml
    <dependency>
         <groupId>com.alibaba</groupId>
         <artifactId>druid</artifactId>
         <version>1.2.1</version>
    </dependency>
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
    ```

2. 将springboot默认的数据源切换到Druid数据源，在springboot的配置文件里修改配置。我这里就是将这里的配置放在了一个datasource.yml文件。

   ```yaml
   spring:
     datasource:
       username: root
       password: password
       url: jdbc:mysql://localhost:3306/shop?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
       driver-class-name: com.mysql.cj.jdbc.Driver
       type: com.alibaba.druid.pool.DruidDataSource	#就是添加了这句指定数据源
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
       #配置监控统计拦截的filters，stat:监控统计、log4j：日志记录、wall：防御sql注入
       filters: stat,wall,log4j
       maxPoolPreparedStatementPerConnectionSize: 20
       useGlobalDataSourceStat: true
       connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
   ```

3. 手动绑定这些配置注入到容器当中。

   ```Java
   package com.yww.config;
   
   import com.alibaba.druid.pool.DruidDataSource;
   import org.springframework.boot.context.properties.ConfigurationProperties;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import javax.sql.DataSource;
   
   @Configuration
   public class DruidConfig {
       @Bean
       @ConfigurationProperties(prefix = "spring.datasource")
       public DataSource dataSource(){
           return new DruidDataSource();
       }
   }
   ```

4. 配置Druid数据源监控。

   ```Java
   package com.yww.config;
   
   import com.alibaba.druid.pool.DruidDataSource;
   import com.alibaba.druid.support.http.StatViewServlet;
   import org.springframework.boot.context.properties.ConfigurationProperties;
   import org.springframework.boot.web.servlet.ServletRegistrationBean;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import javax.sql.DataSource;
   import java.util.HashMap;
   import java.util.Map;
   
   @Configuration
   public class DruidConfig {
       @Bean
       @ConfigurationProperties(prefix = "spring.datasource")
       public DataSource dataSource(){
           return new DruidDataSource();
       }
       @Bean
       public ServletRegistrationBean statViewServlet() {
           ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
           Map<String, String> initParams = new HashMap<>();
           initParams.put("loginUsername", "admin"); //后台管理界面的登录账号
           initParams.put("loginPassword", "123456"); //后台管理界面的登录密码
           bean.setInitParameters(initParams);
           return bean;
       }
   }
   ```

   >配置好之后访问<http://localhost:8080/druid/login.html>就可以看到Druid为我们提供的用于监控的web界面。

5. 配置filter过滤器

   ```Java
   package com.yww.config;
   
   import com.alibaba.druid.pool.DruidDataSource;
   import com.alibaba.druid.support.http.StatViewServlet;
   import org.springframework.boot.context.properties.ConfigurationProperties;
   import org.springframework.boot.web.servlet.ServletRegistrationBean;
   import org.springframework.context.annotation.Bean;
   import org.springframework.context.annotation.Configuration;
   import javax.sql.DataSource;
   import java.util.HashMap;
   import java.util.Map;
   
   @Configuration
   public class DruidConfig {
       //注入Druid的配置
       @Bean
       @ConfigurationProperties(prefix = "spring.datasource")
       public DataSource dataSource(){
           return new DruidDataSource();
       }
       //配置Druid的监控
       @Bean
       public ServletRegistrationBean statViewServlet() {
           ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
           Map<String, String> initParams = new HashMap<>();
           initParams.put("loginUsername", "admin"); //后台管理界面的登录账号
           initParams.put("loginPassword", "123456"); //后台管理界面的登录密码
           bean.setInitParameters(initParams);
           return bean;
       }
       //配置filter过滤器
       @Bean
   	public FilterRegistrationBean webStatFilter() {
       	FilterRegistrationBean bean = new FilterRegistrationBean();
       	bean.setFilter(new WebStatFilter());
       	Map<String, String> initParams = new HashMap<>();
       	initParams.put("exclusions", "*.js,*.css,/druid/*,/jdbc/*");
       	bean.setInitParameters(initParams);
       	//"/*" 表示过滤所有请求
       	bean.setUrlPatterns(Arrays.asList("/*"));
       	return bean;
   	}
   }
   ```




# 整合mybatis

1. 首先就要添加mybatis与spring boot的整合的启动器。

   ```xml
     <dependencies>
           <dependency>
               <groupId>org.mybatis.spring.boot</groupId>
               <artifactId>mybatis-spring-boot-starter</artifactId>
               <version>2.1.1</version>
           </dependency>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-jdbc</artifactId>
           </dependency>
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-web</artifactId>
           </dependency>
   
           <dependency>
               <groupId>mysql</groupId>
               <artifactId>mysql-connector-java</artifactId>
               <scope>runtime</scope>
           </dependency>
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
   
           <dependency>
               <groupId>com.alibaba</groupId>
               <artifactId>druid</artifactId>
               <version>1.2.1</version>
           </dependency>
   
           <dependency>
               <groupId>log4j</groupId>
               <artifactId>log4j</artifactId>
               <version>1.2.17</version>
           </dependency>
   
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

2. 定义实体类

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

3. 定义mapper接口

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

4. 创建绑定mapper接口的mybatis的配置文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
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

5. 配置好application，我这里使用yaml的形式

   ```yaml
   spring:
     datasource:
       username: root
       password: password
       url: jdbc:mysql://localhost:3306/shop?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
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
   
   mybatis:
     type-aliases-package: com.yww.pojo					#绑定实体类，不然配置文件识别不出User
     mapper-locations: classpath:mybatis/mapper/*.xml		#绑定mybatis的配置文件
   ```

6. 然后就能写controller了

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

   

