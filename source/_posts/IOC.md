---
title: IOC
date: 2020-6-23
categories:
  - Java
description: IOC是Spring的核心，想学好Spring就要了解IOC
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2020/6/2020-6-23top_img.jpg
---



## 前言

今天看见了Iteye的开涛对IOC的理解，[原文地址](http://jinnianshilongnian.iteye.com/blog/1413846)，对IOC的有了一些理解，所以来记录一下。

## 什么是IOC

IOC全称为Inversion of Control，即为控制反转。IOC并不是一种技术，而是一种设计思想。怎样理解这种思想呢？就先从IOC的名称上看吧。IOC称控制反转，包含了两个重要的词语，控制和反转。理解IOC就可以从这两个词语去理解，是怎样的控制，怎样的反转。

### 控制

在我们常规的JavaSE的设计思想来看，我们需要用到其他对象来是实现功能的时候，就会在当前类里new出一个对象来进行调用，进而实现自己想要的功能，这就是我们主动地创造了对象来使用。而IOC不一样，IOC思想是别人已经帮你创造好了一个IOC容器，这个IOC容器会帮你创建好你所需要的对象，你不需要自己去new对象，你只需要获取IOC容器中的对象即可。所以这个控制是指，IOC容器控制了对象，控制了你所需要的所有外部资源。

### 反转

什么是反转，这个问题在对控制的理解里差不多能体会到。我们去创造对象来进行调用，这就是正转，而IOC这种思想就不是这样，它是反转过来的，是IOC容器来控制对象，我们只是接收容器传出来的对象，所以说是反转。

### 理解

理解了控制和反转两个词语之后，就应该IOC是怎样的思想了。我们也可以举个简单的例子。假如你想要一个书桌来学习，按常规的设计思想来看，你就需要木材与工具，然后在做好这个书卓，然后在学习，这样来讲你是不是就会觉得这种思想在一定程度来说是挺蠢的。按IOC的思想来看，你需要一个书卓，你就只需要去家具店买就好了，家具店已经有做好的书卓给你。这么说应该就能理解了，家具店就像是一个IOC容器，你需要书卓，我就可以提供书卓给你，这就是IOC。

## IOC的优点

在我们常规的设计思想中，对象中创建对象，就会导致类与类之间的耦合度增高，从而让它们难以控制，而IOC的出现，人们不用自己创建对象，就能降低与类之间的耦合度，让程结构序更加的灵活，更好的测试。

> 耦合就类似钟表，钟表内每个齿轮都有着联系，当一个齿轮坏了，也会影响另一个，进而影响全部。所以类与类之间的耦合度高在一方面来看不算是什么好事，当代码多起来的时候，错一小处就会影响全局。



## DI

说到IOC,就不得不说到DI—Dependency Injection,即依赖注入。在了解了IOC之后，DI也就不难理解。有人认为DI是实现IOC的一种方法，其实差不多。依赖注入表示，程序需要依赖IOC容器提供创建的对象，在程序中需要一个对象，IOC容器就会创建好一个对象来注入到程序中，你只要使用这个对象就可以了，至于对象是什么时候创建的，怎样创建的，在哪创建的你都可以不用去管，你只需要使用这个对象去完成你所需要的功能就好了，这就是我理解的DI。



## 一个demo

到此，应该对IOC和DI有自己的理解了，下面就通过一个小demo来加深一下理解。在常规的写法，要实现一个功能，会有dao接口，业务层接口和它们的实现类，最后使用业务层的实现类来实现这个功能。

```Java
// Userdao 
public interface UserDao {
    void getUser();
}

//UserDaoImpl
public class UserDaoImpl implements UserDao {
    public void getUser() {
        System.out.println("实现第一个功能");
    }
}


//UserService
public interface UserService {
    void getuser();
}


//UserServiceImp
public class UserServiceImpl implements UserService {
    private UserDao userDao = new UserDaoImpl();
    public void getuser() {
        userDao.getUser();
    }
}


//最后就会获得用户的数据
public class test01 {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
            userService.getuser();		//实现第一个功能
    }
}

```

一个功能是不能满足的时候，就会想着增加第二个功能，就需要这样做

```Java
// Userdao 
public interface UserDao {
    void getUser();
}
//UserDaoImpl
public class UserDaoImpl implements UserDao {
    public void getUser() {
        System.out.println("实现第一个功能");
    }
}

//UserService
public interface UserService {
    void getuser();
}
public class UserDaoImpl2 implements UserDao {
    public void getUser() {
        System.out.println("实现第二个功能");
    }
}

//UserServiceImp
//要想实现第二个功能就要修改业务层，从而改变实现的功能
public class UserServiceImpl implements UserService {
    private UserDao userDao = new UserDaoImpl2();
    public void getuser() {
        userDao.getUser();
    }
}

//最后就会获得用户的数据
public class test01 {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
            userService.getuser();		//实现第二个功能
    }
}
```

当需要的功能多的时候，我们就会很难受，总是修改业务实现类，所以就出现了IOC这种思想来帮组我们解决这种问题。

```Java
// UserDao 
public interface UserDao {
    void getUser();
}
//UserDaoImpl
public class UserDaoImpl implements UserDao {
    public void getUser() {
        System.out.println("获取用户数据");
    }
}
//UserDaoImpl2
public class UserDaoImpl2 implements UserDao {
    public void getUser() {
        System.out.println("第二次获得用户数据");
    }
}
//Service
//增加了Set方法来设置获取的对象
public interface UserService {
    void getuser();
    void setUserDao(UserDao userDao);
}
//ServiceImpl
public class UserServiceImpl implements UserService {
    private UserDao userDao;	//先设置引用，对象由set方法后期获得
    public void setUserDao(UserDao userDao){
        this.userDao = userDao;
    }
    public void getuser() {
        userDao.getUser();
    }
}

public class test01 {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
        userService.setUserDao(new UserDaoImpl());
        userService.getuser();		//实现第一个功能
        userService.setUserDao(new UserDaoImpl2());
        userService.getuser();		//实现第二个功能
    }
}
```



{% note%}

这个set方法可以接收IOC容器提供的对象不同，从而使用不同的功能。

{%endnote%}