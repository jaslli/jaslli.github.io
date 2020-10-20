---
title: SpringBoot
date: 2020-10-15
categories:
  - Java
description: 学习SpeingBoot的笔记
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/top_img.jpg
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
   >   具体语法可参照[YAML语法](https://yww52.com/2020/10/20/yml语法/)

