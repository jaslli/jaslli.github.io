---
title: Spring5
date: 2020-6-26
categories:
- Java 
description: Spring 是一个轻量级的控制反转（IOC）和面向切面（AOP）的框架
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2020/6/2020-6-26top_img.jpg
sticky: 1
---

## 简介

​			Spring是Java EE编程领域的一个轻量级开源框架，该框架由一个叫Rod Johnson的程序员在 2002 年最早提出并随后创建，是为了解决企业级编程开发中的复杂性，实现敏捷开发的应用型框架 。Spring是一个开源容器框架，它集成各类型的工具，通过核心的Bean factory实现了底层的类的实例化和生命周期的管理。在整个框架中，各类型的功能被抽象成一个个的 Bean，这样就可以实现各种功能的管理，包括动态加载和切面编程。

> Spring 就是一个轻量级的控制反转[IOC](https://yww52.com/2020/06/23/IOC/)和面向切面[AOP](https://yww52.com/2020/06/30/AOP/)的框架。

参考网站：

- [官网](https://spring.io/projects/spring-framework#overview)
- [官方下载地址](https://repo.spring.io/release/org/springframework/spring/)
- [GitHub地址](https://github.com/spring-projects/spring-framework)



## 第一个Spring程序

1. 创建一个maven项目

2. 在pom.xml里导入依赖

   ```xml
   <dependencies>
           <dependency>
               <groupId>org.springframework</groupId>
               <artifactId>spring-webmvc</artifactId>
               <version>5.2.6.RELEASE</version>
           </dependency>
       </dependencies>
   ```

3. 创建一个类，比如我的HelloSpring类

   ```Java
   public class HelloSpring {
       private String str;
       public String getStr(){
           return  str;
       }
       public void setStr(String str){
           this.str = str;
       }
       @Override
       public String toString(){
           return "{"+"str="+str+"}";
       }
   }
   ```

4. 在resources资源目录下配置applicationContext.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
   <!--使用Spring来创建对象，这些对象都称为bean-->
       <bean id ="hello" class="com.chen.pojo.HelloSpring">
           <property name="str" value=" Hello Spring"/>
       </bean>
           
   </beans>
   ```

5. 测试类

   ```Java
   public class test01 {
       public static void main(String[] args) {
           ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
           HelloSpring hello = context.getBean("hello"，HelloSpring.class);
           System.out.println(hello.toString());
       }
   }
   //得到结果，输出	{str= Hello Spring}
   ```




## Spring配置

### 别名

为创建的对象起别名，即为bean的id起别名

```xml
<alias name="userserviceimpl" alias="user"></alias>
```

### Bean

以上面的例子为例

```xml
<bean id ="hello" class="com.chen.pojo.HelloSpring" name ="user,u1,u2">
        <property name="str" value=" Hello Spring"/>
    </bean>
```

{% note success %}

id为bean的标识符，即创建的对象名

class为对象对所对应的类名，注意是全限定名
name为别名，与alias差不多，可以起多个别名

property属性，为str这个参数赋值

{% endnote %}

### import

合并xml配置文件。



## 依赖注入

依赖注入DI，具体说法可参考我之前写的[有关IOC的文章](https://yww52.com/2020/06/23/IOC)

### 构造器注入

1. 使用无参构造器创建对象
   这种是Spring默认的创建对象的方式，在上述的Spring例子当中，HelloSpring的bean创建对象是用的无参构造器，若没有了无参构造器就会报错。

2. 使用有参构造器创建对象

   - 下标

     ```xml
     	<bean id ="hello" class="com.chen.pojo.HelloSpring">
             <constructor-arg index="0" value="helloSpring">;
                 <!--从0开始，依次为HelloSpring的有参构造器赋值-->
         </bean>
     ```

   - 类型

     ```xml
     	<bean id ="hello" class="com.chen.pojo.HelloSpring">
             <constructor-arg type="String" value="helloSpring">;
                 <!--按照类型来赋值，但相同类型多了就不行了，还是不推荐这种-->
         </bean>
     ```

   - 参数名

     ```xml
     	<bean id ="hello" class="com.chen.pojo.HelloSpring">
             <constructor-arg name="str" value="helloSpring">;
                 <!--按构造器的参数名来赋值，即为HelloSpring的构造器参数str赋值-->
         </bean>
     ```

{%note%}

   当bean被注册，加载到该配置文件，即使没有用到这个对象，也会生成。

{%endnote%}

### Set方式注入

注入到对象中的属性，例如我的这个例子。

```Java
public class Student {
    private String name;
    private Address address;
    private String[] books;
    private List<String> hobbies;
    private Map<String,String> card;
    private Set<String> games;
    private String ll;
    private Properties info;
    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", address=" + address +
                ", books=" + Arrays.toString(books) +
                ", hobbies=" + hobbies +
                ", card=" + card +
                ", games=" + games +
                ", ll='" + ll + '\'' +
                ", info=" + info +
                '}';
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Address getAddress() {
        return address;
    }
    public void setAddress(Address address) {
        this.address = address;
    }
    public String[] getBooks() {
        return books;
    }
    public void setBooks(String[] books) {
        this.books = books;
    }
    public List<String> getHobbies() {
        return hobbies;
    }
    public void setHobbies(List<String> hobbies) {
        this.hobbies = hobbies;
    }
    public Map<String, String> getCard() {
        return card;
    }
    public void setCard(Map<String, String> card) {
        this.card = card;
    }
    public Set<String> getGames() {
        return games;
    }
    public void setGames(Set<String> games) {
        this.games = games;
    }
    public String getLl() {
        return ll;
    }
    public void setLl(String ll) {
        this.ll = ll;
    }
    public Properties getInfo() {
        return info;
    }
    public void setInfo(Properties info) {
        this.info = info;
    }
}
```

1. 基本数据类型和String类型的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">	
   	<property name="name" value="student1"/>
   </bean>
   ```

2. 引用类型的注入

   ```xml
   <!--先注册好这个引用类型--> 	
   <bean id="adress" class="com.chen.pojo.Address"/>
   <bean id="student" class="com.chen.pojo.Student">	
   	<property name="address" ref="adress"/>
   </bean>
   ```

3. 数组的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">	
   	<property name="books">
               <array>
                   <value>a</value>
                   <value>b</value>
                   <value>c</value>
                   <value>d</value>
               </array>
           </property>
   </bean>
   ```

4. List的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">	
   	<property name="hobbies">
               <list>
                   <value>music</value>
                   <value>game</value>
               </list>
           </property>
   </bean>
   ```

5. Map的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">	
   	 <property name="card">
               <map>
                   <entry key="1" value="a"/>
                   <entry key="2" value="b"/>
                   <entry key="3" value="c"/>
                   <entry key="4" value="d"/>
               </map>
           </property>
   </bean>
   ```

6. Set的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">	
   	 <property name="games">
               <set>
                   <value>kkk</value>
                   <value>sss</value>
                   <value>www</value>
               </set>
           </property>
   </bean>
   ```

7. null注入即空值注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">
   	<property name="ll">
               <null/>
           </property>
   </bean>
   ```

8. Properties的注入

   ```xml
   <bean id="student" class="com.chen.pojo.Student">
   	<property name="info">
               <props>
                   <prop key="s">111</prop>
                   <prop key="ww">333</prop>
               </props>
           </property>
   </bean>
   ```

{% note warning %}
注入的时候是通过你创建的set方法注入的，所以创建类的时候要写上set方法，养成习惯get方法也写上,为了更好的测试，就重写toString方法
{% endnote %}

### 拓展方式注入

####  P命名空间的注入

想要使用这种方法，先得在bean元素上加入p的命名空间，如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       
       xmlns:p="http://www.springframework.org/schema/p"
       
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

```xml
<bean id="adress" class="com.chen.pojo.Address" p:address="this" p:a="18"/>
```

{% note %}
这种方式的注入是简单类型的注入，引用类型也可以,类似set注入，但能支持注入的类型少。
{% endnote %}

#### C命名空间注入

类似P命名空间，用前需要在bean元素上加入c的命名空间，如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

       xmlns:c="http://www.springframework.org/schema/c"

       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

```xml
<bean id="adress" class="com.chen.pojo.Address" c:address="this" c:a="18"/>
```

{% note %}
这种方式的是通过构造器注入的，想要注入的属性就要存在这样的有参构造器。注意因为创建对象要用到无参构造器，所以不要漏写。
{% endnote %}



## Bean的作用域（Scope）

### 单例模式

单例模式是指每次创建的bean都是同一个，这也是Spring默认的模式，比如

```xml
<!--singleton表示单例模式，不写scope也默认为单例-->
<bean id = "address" class="com.chen.pojo.Address" scope="singleton">
        <property name="a" value="1"/>
        <property name="address" value="s"/>
    </bean>
```

```Java
//测试类，两个get的对象都是一样的
public class test01 {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Address address1 =  context.getBean("address",Address.class);
        Address address2 =  context.getBean("address",Address.class);
        System.out.println(address1.hashCode());
        System.out.println(address2.hashCode());
    }
}
```

{% note success %}
单例模式表示bean只会创建一个对象，每次get的都是同一个
{% endnote %}

### 原型模式

原型模式就和单例模式相反，每次get的都不是同一个。

```xml
<!--每次创建都不是同一个对象-->
<bean id = "address" class="com.chen.pojo.Address" scope="prototype">
        <property name="a" value="1"/>
        <property name="address" value="s"/>
    </bean>
```

```Java
//测试类，两个get的对象都是一样的
public class test01 {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        Address address1 =  context.getBean("address",Address.class);
        Address address2 =  context.getBean("address",Address.class);
        System.out.println(address1.hashCode());
        System.out.println(address2.hashCode());
    }
}
```

{% note success %}
原型模式表示每次创建的bean都不是同一个对象
{% endnote %}



## Spring的自动装配

首先为了更好的测试，先创建两个类，之后的例子就从这两个类中测试。

```Java
public class User {
    private String name;
     private Score score;
    
    public Score getScore() {
        return score1;
    }
    public void setScore(Score score) {
        this.score1 = score;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

```Java
public class Score {
     private String name;
    
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "Score{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

> 自动装配是从bean的autowire属性配置的。

### byName的自动装配

byName的自动装配是从类中寻找具有相同属性的类，然后装配到bean里，比如在User中有Score类创建的对象，而且有set方法，所以可以自动将Score的对象装配到User类里。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="score" class="com.chen.pojo.Score">
        <property name="name" value="课程"/>
    </bean>
    <bean id="user" class="com.chen.pojo.User" autowire="byName">
        <property name="name" value="张三"/>
    </bean>
    <!--  自动装配等同于这样装配
        <bean id="user" class="com.chen.pojo.User" >
            <property name="name" value="张三"/>
            <property name="score" ref="score"/>
        </bean>
    -->
</beans>
```

```java
public class test01 {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = context.getBean("user", User.class);
        System.out.println(user.getScore());
    }
}
```

{% note warning%}
是按照User类里的Set方法寻找的，比如Score类在bean里注册的id为score，那User类里就要有setScore这个set方法，将set去掉，首字母小写，然后与id对应一致才能找的到，这是byName的自动装配。
{% endnote %}

### byTypee的自动装配

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="score11" class="com.chen.pojo.Score">
        <property name="name" value="课程"/>
    </bean>
    <!--这里修改了id,用byName是找不到的-->
    
    <bean id="user" class="com.chen.pojo.User" autowire="byType">
        <property name="name" value="张三"/>
    </bean>
    <!--  自动装配等同于这样装配
        <bean id="user" class="com.chen.pojo.User" >
            <property name="name" value="张三"/>
            <property name="score" ref="score"/>
        </bean>
    -->
</beans>
```

```java
public class test01 {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        User user = context.getBean("user", User.class);
        System.out.println(user.getScore());
    }
}
```

{% note warning%}
byType是寻找类里属性类型相同的bean，所以不关id的事情了，id都可以省略。弊端就是当一个类注册了两个bean的时候，byType不知道选择哪一个就会报错。
{% endnote %}

### 用注解实现自动装配

首先想用注解先要导入context约束和注解的支持，如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       
       xmlns:context="http://www.springframework.org/schema/context"
       
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
                           
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
">
    <!--开启注解-->
   <context:annotation-config/>
    
</beans>
```

@Autowired注解
这个注解可以放在属性名上，也可以放在set方法上，放在属性名上，连set方法都可以不用写，当然是引用的类里要有set方法。

```xml
<bean  class="com.chen.pojo.Score">
        <property name="name" value="课程"/>
    </bean>
<bean id="user" class="com.chen.pojo.User" >
    </bean>
```

```java
public class User {
     private String name;
     @Autowired
     private Score score;
    
    public Score getScore() {
        return score1;
    }
    public void setScore1(Score score) {
        this.score1 = score;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

> @Autowired里面有个属性是required，默认为true，表示不能为空值，可以手动关闭@Autowired(required = falser)。

{% note success %}

@Autowired是通过byType模式来寻找的，若是一个类有多个bean才会选择用byName来自动装配。

要是多个bean的id都不符合byName的时候，就需要使用@Qualifier(value="id")来配合使用，value的值为哪个bean的id，就使用哪个bean自动装配。

{% endnote %}

```xml
<bean id="score1" class="com.chen.pojo.Score">
        <property name="name" value="课程1"/>
    </bean>
<bean id="score2" class="com.chen.pojo.Score">
        <property name="name" value="课程2"/>
    </bean>
<bean id="score3" class="com.chen.pojo.Score">
        <property name="name" value="课程3"/>
    </bean>
    
<bean id="user" class="com.chen.pojo.User" >
    </bean>

<!--	
 user类里的score属性上注解，value值为哪个id就配置哪个id
	@Autowired
    @Qualifier(value = "score2")
    private Score score;
-->
```



## 使用注解开发

想使用注解来进行开发，先要确定好自己的配置。

1. 导入aop的包（之前导入的依赖包含了aop的包），注解使用不了就确定一下有没有aop的包导入

2. 导入context的约束，开启支持注解

3. 还要指定扫描的包，是包里的注解生效，比如例子的包

   ```xml
   <context:component-scan base-package="com.chen.pojo"/>
   ```

### 注册bean

在xml中注册bean

```xml
<bean id="score" class="com.chen.pojo.Score">
    </bean>
```

使用注解来注册bean

```Java
@Component
public class Score {
	private String name;
	
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "Score{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

{% note success %}

使用了@Component注解，会将这个类装配。可以指定id,在没有指定id的时候，这个类的bean的id就是当前类名首字母小写的字符串。

指定id可以这样写到@Component("xxx")。

{% endnote %}

{% note info%}

@Component 的三个衍生注解，在 web 开发中，会按照 mvc 三层架构分层。

- dao 层@Repository
- service 层@Service
- web 层@Controller

这四个注解功能都是一样的。

{% endnote %}

### 属性注入

```Java
@Component
public class Score {
    @Value("lll")
	private String name;
	
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "Score{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

{% note success %}

属性注入可以使用@Value("")的注解，当然简单的才会使用注解，复杂一点的注入还是xml配置注解好一点。

{% endnote %}

### 自动装配

就是之前得用注解实现自动装配

### 作用域

```Java
@Component
@Scope("prototype")
public class Score {

	@Value("chen")
    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "Score{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

{% note success %}

作用域可以使用@Scope("“)，里面是模式，常用的就是singleton和prototype，默认也是singleton。

{% endnote %}



## 使用Java的方式配置Spring

先看demo吧

1. 用户类

   ```Java
   public class User {
       @Value("chen")
       private String name;
   
       public String getName() {
           return name;
       }
       public void setName(String name) {
           this.name = name;
       }
   }
   ```

2. Java配置类

   ```Java
   @Configuration
   public class pojoconfig {
       @Bean
       public User getUser(){
           return new User();
       }
   }
   ```

3. 测试类

   ```Java
   public class test01 {
       public static void main(String[] args) {
           ApplicationContext context = new AnnotationConfigApplicationContext(pojoconfig.class);
           User user = context.getBean("getUser",User.class);
           System.out.println(user.getName());
       }
   }
   ```

> 一个个分析吧。
>
> 用户类没什么区别，主要是Java配置类。
>
> @Configuration表示这个类是个配置类，类似于xml。
>
> @Bean表示bean的配置。方法名就相当于id。



## AOP

关于AOP的介绍就放到另一篇文章里。[AOP](https://yww52.com/2020/06/30/AOP/)

这里就讲讲spring中AOP的具体实现。
首先要导入依赖，和aop的约束

```xml
<dependency>
     <groupId>org.aspectj</groupId>
     <artifactId>aspectjweaver</artifactId>
     <version>1.9.5</version>
   </dependency>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

</beans>
```

### 使用Spring的接口来实现

1. 首先定义好 接口，并创建好真实对象，即接口实现类

   ```Java
   public interface userService {
       void add();
       void delete();
       void update();
       void select();
   }
   ```

   ```Java
   public class userServiceImpl implements userService{
       public void add() {
           System.out.println("增加了一个用户");
       }
       public void delete() {
           System.out.println("删除了一个用户");
       }
       public void update() {
           System.out.println("修改了一个用户");
       }
       public void select() {
           System.out.println("查询了一个用户");
       }
   }
   ```

2. 定义一个功能类

   ```Java
   public class log implements MethodBeforeAdvice {
       public void before(Method method, Object[] objects, Object target) throws Throwable {
           System.out.println(target.getClass().getName()+"的"+method.getName()+"被执行了");
       }
   }
   ```

   > method表示目标对象的方法，objects表示参数,target目标对象。实验的例子是使用MethodBeforeAdvice这个接口，即在目标方法调用之前调用的Advice通知。
   >
   > MethodBeforeAdvice 			前置通知
   >
   > AfterReturningAdvice 		    后置通知，有返回值
   >
   > MethodInterceptor 			    环绕通知
   > ThrowsAdvice 						异常通知

3. 然后就要在applicationContext.xml里配置了

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/aop
           http://www.springframework.org/schema/aop/spring-aop.xsd">
   
   
   
   	<!--先注册真实对象和功能的类进入-->
       <bean id="userServiceImpl" class="com.chen.pojo.userServiceImpl"></bean>
       <bean id ="log" class="com.chen.pojo.log"></bean>
   
   
       <aop:config>
           <!--定义切入点,expression为执行的位置-->
           <aop:pointcut id="p" expression="execution(* com.chen.pojo.userServiceImpl.*(..))"/>
           <!--执行环绕，advice-ref表示哪一个通知，pointcut-ref表示切入位置-->
           <aop:advisor advice-ref="log" pointcut-ref="p"></aop:advisor>
       </aop:config>
   
   </beans>
   ```

   > 这里来解析一下execution的表达式。* com.chen.pojo.userServiceImpl..*  .*(..)
   >
   > 1. execution()为表达式主体，里面为表达式
   > 2. 第一个 * 表示返回的类型，*表示任意类型的返回值
   > 3. 表示需要拦截的包，即真实对象所在的位置
   > 4. 包名后面的,,*表示当前包以及子包
   > 5. 第二个 * 表示方法，*表示所有方法
   > 6. (..)表示方法可以有任意的参数

4. 测试类

   ```java
   public class test01 {
       public static void main(String[] args) {
           ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
           userService userService = context.getBean("userServiceImpl", userService.class);
           
           userService.add();
           userService.delete();
           userService.update();
           userService.select();
       }
   }
   ```

   > 注意这里的用的是接口而不是实现类。

### 使用自定义类来实现

1. 定义接口和实现类，和上述一样

2. 定义一个通知类

   ```java
   public class log {
       public  void before(){
           System.out.println("方法执行");
       }
   }
   ```

3. 配置xml文件

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/aop
           http://www.springframework.org/schema/aop/spring-aop.xsd">
       <bean id="userServiceImpl" class="com.chen.pojo.userServiceImpl"></bean>
       <bean id = "log" class="com.chen.pojo.log"/>
       <aop:config>
           <!--自己定义一个切面，引用刚刚的类-->
          <aop:aspect ref="log">
   		   <!--定义切入点-->
              <aop:pointcut id="point" expression="execution(* com.chen.pojo.userServiceImpl.*(..))"/>
              <!--环绕方式，method表示环绕方法，pointcut-ref在哪环绕-->
              <aop:before method="before" pointcut-ref="point"/>
          </aop:aspect>
   
       </aop:config>
   
   </beans>
   ```

> 这种方法还是不够好，简单的插入可以使用这种。



### 使用注解来实现

使用注解来实现跟自定义类实现其实差不多。

1. 定义接口和实现类，和上述一样

2. 定义通知类

   ```java
   //定义切面
   @Aspect
   public class log {
       //定义环绕方式，里面是切入点
       @Before("execution(* com.chen.pojo.userServiceImpl.*(..))")
       public void before(){
           System.out.println("方法执行");
       }
   }
   ```

3. 然后把这个类注册到spring里，并开启注解支持

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/aop
           http://www.springframework.org/schema/aop/spring-aop.xsd">
   
       <bean id="userServiceImpl" class="com.chen.pojo.userServiceImpl"></bean>
       <bean id ="log" class="com.chen.pojo.log"/>
       <!--开启注解支持-->
       <aop:aspectj-autoproxy/>
   
   </beans>
   ```

   > 开启注解支持还能设置动态代理模式
   > <aop:aspectj-autoproxy  proxy-target-class="false"/>
   >
   > 值为false表示使用JDK动态代理（默认），为true表示使用cglib动态代理



## Spring与Mybatis整合

### 导入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.chen</groupId>
    <artifactId>spring-study</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>spring-01</module>
    </modules>


    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>

        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.1.9.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.4</version>
        </dependency>

        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.2</version>
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

### 配置spring的xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--dateSource,用spring来代替原来的mybatis的数据源的配置文件-->
    <bean id="dateSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/test?useSSL=false&amp;serverTimezone=UTC"/>
        <property name="username" value="root"/>
        <property name="password" value="password"/>
    </bean>
    <!--sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!--绑定mybatis的数据源-->
        <property name="dataSource" ref="dateSource"/>
        <!--绑定mybatis的配置文件,其实不用mybatis-config.xml也可以-->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <!--绑定映射-->
        <property name="mapperLocations" value="classpath:...."/>
    </bean>
    <!--创建sqlSessionTemplate,效果于创建sqlSession一样，因为没有set方法，只能构造器注入-->
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>
</beans>
```

> 这个xml是可以代替原来Mybatis的配置文件，以后使用可以直接通过import导入就好了。





## 事务

### 导入约束

用Spring事务时先导入约束，如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">

</beans>
```

### 配置事务通知

```xml
<!--声明式事务-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource" />
    </bean>
<!--配置事务-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="select" propagation="REQUIRED"/> <!--方法名，里面有属性可以配置事务-->
        </tx:attributes>
    </tx:advice>
```

### 配置事务切入

```xml
<!--声明式事务-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <constructor-arg ref="dataSource" />
    </bean>
<!--配置事务-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="select" propagation="REQUIRED"/> <!--方法名，里面有属性可以配置事务-->
        </tx:attributes>
    </tx:advice>
<aop:config>
        <aop:pointcut id="txp" expression="execution(* com.chen.mapper..*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txp"/>
    </aop:config>
```





## 后话

spring终于结束了，说实话spring相对Mybatis还是简单很多的，但细节还是挺多的，学了几天，前面又忘了，还是得多看看细节才行。emm，我的笔记也比较水，还有一些细节还没写出来，看得云里雾里得也挺正常，大概就看看复习一下就好了。end。下个框架见。







































> 还没写完---