---
title: Shiro
date: 2021-1-25
categories:
	- SpringBoot
description: Apache Shiro（发音为“ shee-roh”，日语为“ castle”）是一种功能强大且易于使用的Java安全框架，它执行身份验证，授权，加密和会话管理，可用于保护任何应用程序的安全-从命令行应用程序，移动应用程序到最大的Web和企业应用程序。
keywords:
	- Shiro
	- 权限管理
cover: https://img.yww52.com/2021/1/2021-1-25/top_img.jpg
---

# 简介

网上最流行的两个Java安全框架就是Shiro和spring security。spring security功能更加强大，而Shiro是更加简单。这次就先来学习一下Shiro。首先我们来看看官网上对Shiro的描述。

> **Apache Shiro™** is a powerful and easy-to-use Java security framework that performs authentication, authorization, cryptography, and session management. With Shiro’s easy-to-understand API, you can quickly and easily secure any application – from the smallest mobile applications to the largest web and enterprise applications.
>
> Apache Shiro是一个功能强大且易于使用的Java安全框架，用于执行身份验证，授权，加密和会话管理。 使用Shiro易于理解的API，您可以快速轻松地保护任何应用程序-从最小的移动应用程序到最大的Web和企业应用程序。

# 核心架构

在官网中的参考文档可以看到Shiro的框架架构图和一些解释。

![](https://img.yww52.com/2021/1/2021-1-25/img1.png)

- Subject
  `Subject`表示需要认证的数据，可以理解为登陆的用户，一般有一个用户表示身份的信息和验证身份的密码，表示身份的信息一定要由唯一性。

- Security Manager

  `Security Manager`是Shiro框架的核心，该对象会协调其内部的安全组件。

- Realm

  可以以称为域，充当Shiro和程序安全数据的桥梁，也就是匹配的数据，用来确定Subject登陆是否能够成功。

> 下面这张就是更加详细的架构图。

![](https://img.yww52.com/2021/1/2021-1-25/img2.png)

1. 上面的部分其实就是上图的`Subject`，可以Shiro是可以支持不同语言的服务的。

2. 中间蓝色的就是框架的核心`Security Manager`。

   - Authenticator（认证）

     用来负责认证用户登陆是否成功。当用户尝试登陆时，会通过`Authenticator`去与单个或多个的`Realms`去验证该用户是否为合法用户。

   - Authenticator（授权）

     `Authenticator`是用来确定用户在应用程序中的访问控制。即表示该用户经过认证后，在程序中被允许做什么事情。

   - Session Manager

     用来创建和管理用户`Session`的生命周期，管理会话。**SessionDAO**算是实现会话管理操作的接口。

   - Cache Manager

     用来管理缓存，如果每次执行操作都要去认证授权，那会大幅降低效率，加入了缓存，那就可以不用每次都进行认证和授权了。

3. Cryptography

   翻译为密码术或者称密码学。其实就是用来加密和解密的。

4. 下面的部分就为`Realms`。可以看到可以支持多种方式来验证用户的合法性。

# 认证

从上面的架构图的各部分的功能可以了解了用户认证的过程。

1. `Subject`从应用程序过来寻求认证。
2. Shiro将`Subject`交给`Security Manager`去管理。
3. 然后就会交给`Authenticator`去认证，`Authenticator`又会从`Realms`去获取安全数据与`Subject`去比较，确认`Subject`的合法性。

现在就来简单的实现一下这个认证的流程。

## ini配置文件

首先是创建一个简单的Maven项目，并导入依赖。

```Java
    <dependency>
      <groupId>org.apache.shiro</groupId>
      <artifactId>shiro-core</artifactId>
      <version>1.7.0</version>
    </dependency>
```

在resources文件夹下创建`shiro.ini`配置文件。

```Java
[users]
yww=1141
```

这里就是用户的数据，用户名为`yww`，密码为`1141`。

然后就是实现了。

```Java
package com.yww;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.subject.Subject;

public class test {
    public static void main(String[] args) {
        // 1. 创建Security Manager对象
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        // 2. 给Security Manager对象设置Realms，这里就为resources文件夹下的shiro.ini配置文件
        securityManager.setRealm(new IniRealm("classpath:shiro.ini"));
        // 3. 为SecurityUtils工具类绑定一个Security Manager对象
        SecurityUtils.setSecurityManager(securityManager);
        // 4. 使用工具类为Security Manager对象绑定一个Subject
        Subject subject = SecurityUtils.getSubject();
        // 5. 创建token，需要包括用户
        UsernamePasswordToken token = new UsernamePasswordToken("yww","1141");
        // 6. 用户登陆
        try{
            System.out.println("认证状态--->" + subject.isAuthenticated());
            subject.login(token);
            System.out.println("认证状态--->" + subject.isAuthenticated());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

```运行结果
认证状态---false
认证状态---true
```

现在修改一下登陆用户的信息。

```Java
        UsernamePasswordToken token = new UsernamePasswordToken("yw","1141");
```

```java 
认证状态---false
org.apache.shiro.authc.UnknownAccountException: Realm [org.apache.shiro.realm.text.IniRealm@573fd745] was unable to find account data for the submitted AuthenticationToken [org.apache.shiro.authc.UsernamePasswordToken - yw, rememberMe=false].
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doSingleRealmAuthentication(ModularRealmAuthenticator.java:184)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doAuthenticate(ModularRealmAuthenticator.java:273)
	at org.apache.shiro.authc.AbstractAuthenticator.authenticate(AbstractAuthenticator.java:198)
	at org.apache.shiro.mgt.AuthenticatingSecurityManager.authenticate(AuthenticatingSecurityManager.java:106)
	at org.apache.shiro.mgt.DefaultSecurityManager.login(DefaultSecurityManager.java:275)
	at org.apache.shiro.subject.support.DelegatingSubject.login(DelegatingSubject.java:260)
	at com.yww.test.main(test.java:31)
```

发现了这个`UnknownAccountException`异常，表示找不到该用户，即没有该用户。

在修改一下登陆用户的信息。

```Java
        UsernamePasswordToken token = new UsernamePasswordToken("yww","555");
```

```java 
认证状态---false
org.apache.shiro.authc.IncorrectCredentialsException: Submitted credentials for token [org.apache.shiro.authc.UsernamePasswordToken - yww, rememberMe=false] did not match the expected credentials.
	at org.apache.shiro.realm.AuthenticatingRealm.assertCredentialsMatch(AuthenticatingRealm.java:603)
	at org.apache.shiro.realm.AuthenticatingRealm.getAuthenticationInfo(AuthenticatingRealm.java:581)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doSingleRealmAuthentication(ModularRealmAuthenticator.java:180)
	at org.apache.shiro.authc.pam.ModularRealmAuthenticator.doAuthenticate(ModularRealmAuthenticator.java:273)
	at org.apache.shiro.authc.AbstractAuthenticator.authenticate(AbstractAuthenticator.java:198)
	at org.apache.shiro.mgt.AuthenticatingSecurityManager.authenticate(AuthenticatingSecurityManager.java:106)
	at org.apache.shiro.mgt.DefaultSecurityManager.login(DefaultSecurityManager.java:275)
	at org.apache.shiro.subject.support.DelegatingSubject.login(DelegatingSubject.java:260)
	at com.yww.test.main(test.java:31)
```

会发现另一个异常`IncorrectCredentialsException`，表示认证不通过，一般就是密码不正确。

常见的就是这两个异常了，现在完善一下认证的程序。

```Java
package com.yww;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.subject.Subject;

public class test {
    public static void main(String[] args) {
        // 1. 创建securityManager对象
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        // 2. 给securityManager设置realm
        securityManager.setRealm(new IniRealm("classpath:shiro.ini"));
        // 3. 为SecurityUtils工具类设置一个安全管理器
        SecurityUtils.setSecurityManager(securityManager);
        // 4. 设置subject主体
        Subject subject = SecurityUtils.getSubject();
        // 5. 创建令牌
        UsernamePasswordToken token = new UsernamePasswordToken("yww","555");
        // 6. 用户登陆
        try{
            System.out.println("认证状态---" + subject.isAuthenticated());
            subject.login(token);
            System.out.println("认证状态---" + subject.isAuthenticated());
        } catch (IncorrectCredentialsException e) {
            System.out.println("认证不通过，密码不正确");
        } catch (UnknownAccountException e) {
            System.out.println("认证不通过，该用户不存在");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 自定义Realms

导入依赖后，创建Realms的实现类，继承`AuthorizingRealm`,并重写其中的两个方法。

```Java
public class CustomRealms extends AuthorizingRealm {
    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }
    // 认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 1. 从token中获取subject的用户名
        String principal = (String) authenticationToken.getPrincipal();
        // 2. 通过用户名从数据库获取用户密码，这里使用假数据模拟
        // 3. 比较用户名和密码
        if ("yww".equals(principal)) {
            //	第一个参数为需要认证的用户名，第二个是数据库存储的真正密码，第三个realm名字一般为this.getName()
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(principal,"555",this.getName());
            return simpleAuthenticationInfo;
        }
        return null;
    }
}
```

认证过程主要是`doGetAuthenticationInfo`这个方法，上面的授权方法先不重写。

然后是测试类。

```Java
package com.yww;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;

public class test {
    public static void main(String[] args) {
        // 1. 创建securityManager对象
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        // 2. 给securityManager设置realm
        securityManager.setRealm(new CustomRealms());
        // 3. 为SecurityUtils工具类设置一个安全管理器
        SecurityUtils.setSecurityManager(securityManager);
        // 4. 设置subject主体
        Subject subject = SecurityUtils.getSubject();
        // 5. 创建令牌
        UsernamePasswordToken token = new UsernamePasswordToken("yww", "555");
        // 6. 认证
        try{
            System.out.println("认证状态---" + subject.isAuthenticated());
            subject.login(token);
            System.out.println("认证状态---" + subject.isAuthenticated());
        } catch (IncorrectCredentialsException e) {
            System.out.println("认证不通过，密码不正确");
        } catch (UnknownAccountException e) {
            System.out.println("认证不通过，该用户不存在");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

# 加密

这里就使用到了三种加密方法，md5,salt和hash散列，具体是怎么加密的就不详细了解了，大概知道就好了。

1. MD5信息摘要算法，一种被广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值，用于确保信息传输完整一致。
2. salt就是使用随机的字符串加到密码后进行md5加密，加的位置不知道也会让解密困难。
3. Hash算法可以将一个数据转换为一个标志，这个标志和源数据的每一个字节都有十分紧密的关系。Hash算法还具有一个特点，就是很难找到逆向规律。

下面简单的测试下加密方法。

```Java
public class Encryption {
    public static void main(String[] args) {
        // 假设密码为123456
        String password = "123456";

        // 使用md5加密
        Md5Hash md5Hash1 = new Md5Hash(password);
        System.out.println(md5Hash1.toHex());

        // 使用MD5 + salt加密，这里的salt默认加在前面
        // 这里用固定字符串，用随机字符串更加安全，但要保存salt值
        Md5Hash md5Hash2 = new Md5Hash(password,"k*63");
        System.out.println(md5Hash2.toHex());

        // 使用MD5 + salt + hash散列加密
        Md5Hash md5Hash3 = new Md5Hash(password, "k*63", 1024);
        System.out.println(md5Hash3.toHex());
   }
}
```

```运行结果
e10adc3949ba59abbe56e057f20f883e
a57ba7884ad33d967db809552d96c6f6
c9222f707633cc9a650286ca3bbadbe7
```

接下来就来测试一下如何使用加密。

首先也是先创建自定义的realms。

```Java
public class CustomRealms extends AuthorizingRealm {
    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }
    // 认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 1. 从token中获取subject的用户名
        String principal = (String) authenticationToken.getPrincipal();
        // 2. 通过用户名从数据库获取用户密码，这里使用假数据模拟
        // 3. 比较用户名和密码
        if ("yww".equals(principal)) {
            SimpleAuthenticationInfo simpleAuthenticationInfo = new SimpleAuthenticationInfo(principal,"555",this.getName());
            return simpleAuthenticationInfo;
        }
        return null;
    }
}
```

1. 解决MD5加密，先创建一个hash凭证匹配器，在将该匹配器给realms。

   ```java 
   package com.yww;
   
   import org.apache.shiro.SecurityUtils;
   import org.apache.shiro.authc.IncorrectCredentialsException;
   import org.apache.shiro.authc.UnknownAccountException;
   import org.apache.shiro.authc.UsernamePasswordToken;
   import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
   import org.apache.shiro.mgt.DefaultSecurityManager;
   import org.apache.shiro.subject.Subject;
   
   public class test {
       public static void main(String[] args) {
           // 1. 创建securityManager对象
           DefaultSecurityManager securityManager = new DefaultSecurityManager();
           // 2. 设置hash凭证匹配器
           HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
           // 	表示使用md5加密后在匹配认证
           hashedCredentialsMatcher.setHashAlgorithmName("md5");
           // 3. 给securityManager设置realm
           CustomRealms realms = new CustomRealms();
           //  为该realms设置凭证匹配器
           realms.setCredentialsMatcher(hashedCredentialsMatcher);
           securityManager.setRealm(realms);
           // 4. 为SecurityUtils工具类设置一个安全管理器
           SecurityUtils.setSecurityManager(securityManager);
           // 5. 设置subject主体
           Subject subject = SecurityUtils.getSubject();
           // 6. 创建令牌
           UsernamePasswordToken token = new UsernamePasswordToken("yww", "555");
           // 7. 认证
           try{
               System.out.println("认证状态---" + subject.isAuthenticated());
               subject.login(token);
               System.out.println("认证状态---" + subject.isAuthenticated());
           } catch (IncorrectCredentialsException e) {
               System.out.println("认证不通过，密码不正确");
           } catch (UnknownAccountException e) {
               System.out.println("认证不通过，该用户不存在");
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
   ```


2. salt的处理，在匹配的时候加上salt就好。

   ```Java
       // 认证
       @Override
       protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
           // 1. 从token中获取subject的用户名
           String principal = (String) authenticationToken.getPrincipal();
           // 2. 通过用户名从数据库获取用户密码，这里使用假数据模拟
           // 3. 比较用户名和密码
           if ("yww".equals(principal)) {
               //	加上salt值，这里使用固定值，密码是md5+salt处理后的值
               SimpleAuthenticationInfo simpleAuthenticationInfo = 
                   new SimpleAuthenticationInfo(principal,"a57ba7884ad33d967db809552d96c6f6",
                                                ByteSource.Util.bytes("k*63")
                                                this.getName());
               return simpleAuthenticationInfo;
           }
           return null;
       }
   ```

3. hash散列的处理，设置匹配器的时候加上散列的次数。

   ```Java
   package com.yww;
   
   import org.apache.shiro.SecurityUtils;
   import org.apache.shiro.authc.IncorrectCredentialsException;
   import org.apache.shiro.authc.UnknownAccountException;
   import org.apache.shiro.authc.UsernamePasswordToken;
   import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
   import org.apache.shiro.mgt.DefaultSecurityManager;
   import org.apache.shiro.subject.Subject;
   
   public class test {
       public static void main(String[] args) {
           // 1. 创建securityManager对象
           DefaultSecurityManager securityManager = new DefaultSecurityManager();
           // 2. 设置hash凭证匹配器
           HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
           // 表示使用md5加密后在匹配认证
           hashedCredentialsMatcher.setHashAlgorithmName("md5");
           // 表示散列多少次后在匹配认证
           hashedCredentialsMatcher.setHashIterations(1024);
           // 3. 给securityManager设置realm
           CustomRealms realms = new CustomRealms();
           //  为该realms设置凭证匹配器
           realms.setCredentialsMatcher(hashedCredentialsMatcher);
           securityManager.setRealm(realms);
           // 4. 为SecurityUtils工具类设置一个安全管理器
           SecurityUtils.setSecurityManager(securityManager);
           // 5. 设置subject主体
           Subject subject = SecurityUtils.getSubject();
           // 6. 创建令牌
           UsernamePasswordToken token = new UsernamePasswordToken("yww", "555");
           // 7. 认证
           try{
               System.out.println("认证状态---" + subject.isAuthenticated());
               subject.login(token);
               System.out.println("认证状态---" + subject.isAuthenticated());
           } catch (IncorrectCredentialsException e) {
               System.out.println("认证不通过，密码不正确");
           } catch (UnknownAccountException e) {
               System.out.println("认证不通过，该用户不存在");
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
   ```

# 授权

## 对于角色的授权

```Java
    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 获取主身份信息，这里即为用户名
        String primaryPrincipal = (String)principalCollection.getPrimaryPrincipal();
        // 根据身份信息获取当前用户的权限
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        // 将数据库中查询的角色信息赋值给权限对象，这里的admin为设定的角色，具体权限角色需要自定义
        simpleAuthorizationInfo.addRole("admin");   // 添加admin的角色权限
        return simpleAuthorizationInfo;
    }
```

```Java
package com.yww;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;

import java.util.Arrays;

public class test {
    public static void main(String[] args) {
        // 1. 创建securityManager对象
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        // 2. 设置hash凭证匹配器
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        // 表示使用md5加密后在匹配认证
        hashedCredentialsMatcher.setHashAlgorithmName("md5");
        // 表示散列多少次后在匹配认证
        hashedCredentialsMatcher.setHashIterations(1024);
        // 3. 给securityManager设置realm
        CustomRealms realms = new CustomRealms();
        //  为该realms设置凭证匹配器
        realms.setCredentialsMatcher(hashedCredentialsMatcher);
        securityManager.setRealm(realms);
        // 4. 为SecurityUtils工具类设置一个安全管理器
        SecurityUtils.setSecurityManager(securityManager);
        // 5. 设置subject主体
        Subject subject = SecurityUtils.getSubject();
        // 6. 创建令牌
        UsernamePasswordToken token = new UsernamePasswordToken("yww", "555");
        // 7. 认证
        try{
            subject.login(token);
        } catch (IncorrectCredentialsException e) {
            System.out.println("认证不通过，密码不正确");
        } catch (UnknownAccountException e) {
            System.out.println("认证不通过，该用户不存在");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // 认证通过，便进行授权操作，然后就进行判断权限
        if(subject.isAuthenticated()) {
            // 判断subject主体是否由admin权限，结果为true
            System.out.println(subject.hasRole("admin"));
            // 判断subject主体是否同时具有admin和user权限，结果为false
            System.out.println(subject.hasRoles(Arrays.asList("admin","user")));
            // 判断主体具有的权限,结果集中为true和false
            boolean[] booleans = subject.hasRoles(Arrays.asList("admin", "user"));
        }

    }
}
```

## 对决资源的授权

> 这里涉及到权限字符串，大概了解一下字符串的写法和格式。
>
> 资源标识符:操作:资源类型
>
> 可以使用*号代表所有
>
> admin:create:*
>
> 这个权限代表当前角色对admin中所有资源由创建的权限
>
> admin:*:01
>
> 这个权限代表当前角色对admin中01用户存在所有权限

```Java
    // 授权
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        // 获取主身份信息，这里即为用户名
        String primaryPrincipal = (String)principalCollection.getPrimaryPrincipal();
        // 根据身份信息获取当前用户的权限
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        // 为该用户赋予对admin中的所有角色由创建权限
        simpleAuthorizationInfo.addStringPermission("admin:create:*");
        return simpleAuthorizationInfo;
    }
```

```Java
package com.yww;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.subject.Subject;

public class test {
    public static void main(String[] args) {
        // 1. 创建securityManager对象
        DefaultSecurityManager securityManager = new DefaultSecurityManager();
        // 2. 设置hash凭证匹配器
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        // 表示使用md5加密后在匹配认证
        hashedCredentialsMatcher.setHashAlgorithmName("md5");
        // 表示散列多少次后在匹配认证
        hashedCredentialsMatcher.setHashIterations(1024);
        // 3. 给securityManager设置realm
        CustomRealms realms = new CustomRealms();
        //  为该realms设置凭证匹配器
        realms.setCredentialsMatcher(hashedCredentialsMatcher);
        securityManager.setRealm(realms);
        // 4. 为SecurityUtils工具类设置一个安全管理器
        SecurityUtils.setSecurityManager(securityManager);
        // 5. 设置subject主体
        Subject subject = SecurityUtils.getSubject();
        // 6. 创建令牌
        UsernamePasswordToken token = new UsernamePasswordToken("yww", "555");
        // 7. 认证
        try{
            subject.login(token);
        } catch (IncorrectCredentialsException e) {
            System.out.println("认证不通过，密码不正确");
        } catch (UnknownAccountException e) {
            System.out.println("认证不通过，该用户不存在");
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 认证通过，便进行授权操作
        if(subject.isAuthenticated()) {
            // 判断当前主体是否对该资源存在权限,结果为true
            System.out.println(subject.isPermitted("admin:create:*"));
            // 判断当前主体是否对该资源存在所有的权限,结果为false
            System.out.println(subject.isPermittedAll("admin:create:*","admin:update:*"));
            // 判断当前主体分别存在哪些权限,结果为true和true
            boolean[] booleans = subject.isPermitted("admin:create:*","admin:create:01");
        }

    }
}
```





# 参考链接

- [官网](http://shiro.apache.org/)
- [shiro视频](https://www.bilibili.com/video/BV1uz4y197Zm?p=1)