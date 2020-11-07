---
title: swagger
date: 2020-10-26
categories:
    - API文档
cover: https://img.yww52.com/2020/10/2020-10-26/top_img.jpg
description: swagger是一款让你能更好书写API文档的框架。
---

# 简单的集成swagger

1. 为你的项目导入两个依赖

   ```xml
   	<dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger2</artifactId>
          <version>2.9.2</version>
   	</dependency>
   	<dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger-ui</artifactId>
   	</dependency>
   ```

2. 创建一个配置类

   ```Java
   package com.yww.config;

   import org.springframework.context.annotation.Configuration;
   import springfox.documentation.swagger2.annotations.EnableSwagger2;

   @Configuration
   @EnableSwagger2		//开启swagger2
   public class SwaggConfig {
   }
   ```

3. 开启项目，打开url<http://localhost:8080/swagger-ui.html>，就能看到ui界面
   ![](https://img.yww52.com/2020/10/2020-10-26/img1.png)

# 配置文档信息

1. 因为swagger的实例Bean是Docker，所以用Docker来配置swagger。

    ```Java
    package com.yww.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import springfox.documentation.service.ApiInfo;
    import springfox.documentation.service.Contact;
    import springfox.documentation.spi.DocumentationType;
    import springfox.documentation.spring.web.plugins.Docket;
    import springfox.documentation.swagger2.annotations.EnableSwagger2;

    import java.util.ArrayList;

    @Configuration
    @EnableSwagger2
    public class SwaggConfig {
        @Bean
        public Docket docket(){
            //调用apiInfo方法来传入信息
            return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo());
        }
        //自定义apiInfo方法实现自定义信息配置
        private ApiInfo apiInfo(){
            //创建一个contact对象以便输入
            Contact contact = new Contact("yw", "localhost:8080/", "1141950370@qq.com");
            return new ApiInfo(
                    "Yw的swagger文档",				   //标题
                    "永远相信美好的事情即将发生",		//描述
                    "v1.0",							//版本号
                    "urn:tos",						//termsOfServiceUrl
                    contact,						//contact对象
                    "Apacher 2.0",					//许可信息
                    "http://www.apache.org/licenses/LINCENSE-2.0 ",		//许可信息的链接
                    new ArrayList());
        }
    }
    ```

2. 配置完成以后就可以打开<http://localhost:8080/swagger-ui.html>看到信息了。
    ![](https://img.yww52.com/2020/10/2020-10-26/img2.png)



# 扫描接口的配置

使用Docket的select方法扫描，通过build方法来构建扫描的配置，**用apis方法来配置扫描的位置**，**paths方法来配置接口扫描过滤**。

## 扫描指定的包

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
            		//basePackage方法指定扫描的包
                .apis(RequestHandlerSelectors.basePackage("com.yww.control"))	
                .build();
    }
```

## 扫描全部的包

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
            		//any方法扫描全部的包
                .apis(RequestHandlerSelectors.any())
                .build();
    }
```

## 不扫描包

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
            		//none方法不扫描包
                .apis(RequestHandlerSelectors.none())
                .build();
    }
```

## 扫描类上的注解

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
            		//withClassAnnotation方法扫描类上带有Controller注解的包
                .apis(RequestHandlerSelectors.withClassAnnotation(Controller.class))
                .build();
    }
```

## 扫描方法上的注解

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
            		//withMethodAnnotation方法扫描方法上带有GetMapping注解的方法
                .apis(RequestHandlerSelectors.withMethodAnnotation(GetMapping.class))
                .build();
    }
```

## 扫描任何请求

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.yww.control"))
            		//any方法扫描全部请求
            	.paths(PathSelectors.any())
                .build();
    }
```

## 不扫描请求

```Java
	@Bean
	public Docket docket(){
    	return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(apiInfo())
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.yww.control"))
        		//none方法不扫描请求
        	.paths(PathSelectors.none())
            .build();
}
```
## 通过正则来扫描请求

```Java
		@Bean
    	public Docket docket(){
        	return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.yww.control"))
            		//regex方法通过正则匹配来扫描请求
            	.paths(PathSelectors.regex(final String pathRegex))
                .build();
    }
```

## 控制路径来扫描请求

```Java
		@Bean
    	public Docket docket(){
        	return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.yww.control"))
            		//ant方法通过路径来扫描请求
            	.paths(PathSelectors.ant("/yw/**"))
                .build();
    }
```



<div class='tip'><p>
    使用select配置扫描，用其中的apis方法配置扫描对象，用paths方法来指定扫描的请求
</p></div>



# 配置swagger的启动

```Java
	@Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
            	//使用enable方法来配置swagger是否启动，默认为true
                .enable(false)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.yww.control"))
                .build();
    }
```



# 配置swagger分组

```Java
package com.yww.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggConfig {
				//通过groupName方法分组，创建不同的api接口页面
    @Bean
    public Docket docket1(){
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("Yw1");
    }

    @Bean
    public Docket docket2(){
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("Yw2");
    }
    
}
```

![](https://img.yww52.com/2020/10/2020-10-26/img3.png)

# 实体类的配置

1. 首先创建一个实体类

   ```Java
   package com.yww.pojo;
   
   public class User {
       private String name;
       private String password;
       private String password;
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public String getPassword() {
           return password;
       }
   
       public void setPassword(String password) {
           this.password = password;
       }
   }
   ```

2. 然后再control层加入返回实体类的请求就可以看到实体类了。

   ```Java
   package com.yww.control;
   
   import com.yww.pojo.User;
   import org.springframework.web.bind.annotation.PostMapping;
   import org.springframework.web.bind.annotation.RestController;
   
   /**
    * @ClassName UserControl
    * @Descriprtion TODO
    * @Author Yw
    * @Date 2020/10/26 19:46
    * @Version 1.0
    **/
   @RestController
   public class UserControl {
       //通过返回的实体类就能看到User的信息了
       @PostMapping("/user")
       public User user(){
           return new User();
       }
   }
   ```

   ![](https://img.yww52.com/2020/10/2020-10-26/img4.png)

3. 配置注释

   ```Java
   //@ApiModel和@ApiModelProperty注释配置注释信息
   @ApiModel("用户类")
   public class User {
       @ApiModelProperty("用户名")
       private String name;
       @ApiModelProperty("密码")
       private String password;
   
       public String getName() {
           return name;
       }
       public void setName(String name) {
           this.name = name;
       }
       public String getPassword() {
           return password;
       }
       public void setPassword(String password) {
           this.password = password;
       }
   }
   ```

   ![](https://img.yww52.com/2020/10/2020-10-26/img5.png)

   ```java
   @RestController
   public class UserControl {
       @PostMapping("/user")
       public User user(){
           return new User();
       }
       //@ApiOperation为一个接口加注释，@ApiParam为参数加注释
       @ApiOperation("Hellor控制类")
       @GetMapping("/hello")
       public String hello(@ApiParam("用户名")String name){
           return "Hello"+name;
       }
   }
   ```

   ![](https://img.yww52.com/2020/10/2020-10-26/img6.png)



# 配置swagger的皮肤

## 默认的皮肤

```xml
<dependency>
      <groupId>io.springfox</groupId>
      <artifactId>springfox-swagger-ui</artifactId>
      <version>2.9.2</version>
</dependency>
```

这就是之前导入的依赖，页面ui地址<http://localhost:8080/swagger-ui.html>
![](https://img.yww52.com/2020/10/2020-10-26/img7.png)

## bootstrap的UI

```xml
<dependency>
   <groupId>com.github.xiaoymin</groupId>
   <artifactId>swagger-bootstrap-ui</artifactId>
   <version>1.9.1</version>
</dependency>
```

页面UI地址<http://localhost:8080/doc.html>

![](https://img.yww52.com/2020/10/2020-10-26/img8.png)

## Layui-ui

```xml
<dependency>
   <groupId>com.github.caspar-chen</groupId>
   <artifactId>swagger-ui-layer</artifactId>
   <version>1.1.3</version>
</dependency>
```

页面UI地址<http://localhost:8080/docs.html>

![](https://img.yww52.com/2020/10/2020-10-26/img9.png)

## mg-ui

```xml
<dependency>
   <groupId>com.zyplayer</groupId>
   <artifactId>swagger-mg-ui</artifactId>
   <version>1.0.6</version>
</dependency>
```

页面UI地址<http://localhost:8080/document.html>

![](https://img.yww52.com/2020/10/2020-10-26/img10.png)

<div class='tip'>
    <p>
        更多好看的ui可以去寻找哦。
    </p>
</div>

