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






