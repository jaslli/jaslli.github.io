---
title: SpringBoot整合Druid
date: 2020-11-25
categories:
  - SpringBoot
description: SpringBoot整合使用Druid.
keywords: SpringBoot整合使用Druid,Druid
cover: https://img.yww52.com/2020/10/2020-10-15top_img.jpg
---

# 简介

Druid是的一个阿里巴巴的开源项目，它是一个数据库连接池的实现。Druid能够提供强大的监控和扩展功能。这次就用SpringBoot来整合Druid。

# 依赖

```xml
<dependencies>
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

# 配置SpringBoot配置文件

```yaml
# aplication.yaml使用
spring:
  datasource:
    username: root
    password: password
    url: jdbc:mysql://localhost:3306/shop?userUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource	#指定Druid为数据源
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

# 编写配置类

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

# 配置数据源监控

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

> 配置好之后访问<http://localhost:8080/druid/login.html>就可以看到Druid为我们提供的用于监控的web界面。

# 配置filter过滤器

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

