---
title:  Javase
date: 2020-6-18
categories:
- Java
cover: https://img.yww52.com/2020/6/2020-6-18top_img.jpg
description: 这是我学习Java时候做的笔记，比较水。
---



## 前言

​		以前都是记笔记，每篇文章都很短而且很乱，现在学完很久了，有些东西都快忘了，最近又刚刚整完主题，所以索性就整理一下前面的文章，顺便整合起来复习一下。



<div class='tip success'>
    <p>这是我学习JavaSE的时候记的笔记，文章较长，建议目录直接跳转<p>
</div>



## 什么是JavaSE

​		复习前先来看看什么是JavaSE，来看看百度百科是怎么描述的。（大概了解一下就好了）

> Java SE（Java Standard Edition，Java 标准版）是Java技术的核心和基础，是Java ME和Java EE编程的基础 [1] 。Java SE是由Sun Microsystems公司于1995年5月推出的Java程序设计语言和Java平台的总称。



## Java环境配置

学习Java的第一件事情就是要先配置好Java所需要的环境，不然运行不了还怎么学习。

### 下载JDK

JDK是Java语言的软件开发工具包，是整个Java开发的核心，它包含了Java的运行环境和Java工具，所以这个是必须要下载的。

{% note info%}
下载的版本就选Java8好了，不一定最新的就是最好的，当然最新的也可以。至于IDE嘛，喜欢哪个用哪个，我用的就是idea
{% endnote %}

### 设置环境变量

1. 此电脑，右键，点击“属性”，点击“高级系统设置”，点击“高级”下的环境变量，配置下面三个变量，有就添加变量，没有就新建变量

2. 分别配置好以下三个环境变量

   - JAVA_HOME
     路径就填JDK的安装路径

   - PATH
     路径填JDK命令文件的位置，即bin目录的位置

   - CLASSPATH

     开头输入**“.;”**,然后填lib目录的位置

### 检查是否配置成功

配置完了之后就去检查一下有没有配置成功吧，以免之后出错。去cmd输入命令java-version，若有版本号出现就证明配置成功了。



## 省略一部分

时间不允许我写这么多了，所以我就跳过了一些基本知识，之后我在补（如果有机会的话）。

- 操作符
- 变量和常量
- 控制流程语句（for,if,while）

> 这些是跟很多编程语言都是一样的，特别是和C,C++，所以我省了

## 方法

方法也就是C语言里面的函数，也就是一段实现特定效果的语段。main方法就是主方法，程序的入口。

### 方法的简单使用

```Java
public class Hello {
    public static void main(String[] args) {
        //方法调用，若方法没加static修饰，就new一个Hello的对象，然后调用这个方法
        helloworld();
    }
//定义，修饰符，返回值加方法名，方法体
     static void helloworld(){
        System.out.println("Hello World!");
    }
}
```

### 方法重载

方法重载就在于方法名是一样的，参数列表不一样。

{% note warning%}
重载不是重写，这是两个概念，不要弄混了
{% endnote %}

```Java
public class Hello {
    public static void main(String[] args) {
        helloworld();
        helloworld(1);
    }
    static void helloworld(){
        System.out.println("Hello World!");
    }
    static void helloworld(int i){
        System.out.println("Hello World!");
    }
}
```

### 方法递归

递归的思想就是自己调用自己（套娃），比如下面这个求阶乘的方法。

```Java
public class Hello {
    public static void main(String[] args) {
        System.out.println(fnc(5));
    }
     static int fnc(int i){
        int res = i;
        if(i>1)
         res = res * fnc(i - 1);//套娃
        return res;
     }
}
```

## 面向对象

成天都说Java是面向对象的语言。那什么是面向对象编程呢？

> 面向对象是相对于面向过程来讲的，面向对象方法，把相关的数据和方法组织为一个整体来看待，从更高的层次来进行系统建模，更贴近事物的自然运行模式

大概了解一下就好了，Java是离不开类和对象的，所以之后就会感受到什么是面向对象编程。



## 类和对象

类就是一个抽象的概念，对象就是从类里实例化出来的个体。之后的Java学习都要用到。现在就来定义一个简单的类。

```java
//注意一个类文件里面只能有一个public类
public class demo{
    public int i;
    public void print(){
        System.out.println(i);
    }
}
```

### 类属性和类方法

上述的i和print()就本别是类属性和类方法。把类当作是一个整体，类属性就相当于是一个部件，类方法相当于部件实现的功能。

> 类属性和方法调用必须通过对象，比如demo类有个test对象，那就是test.i和test.print()

### 访问修饰符

上述类，属性，对象都用public来修饰，public就是一个访问修饰符，访问修饰符是来设定权限的，设定谁才能使用这个类，以下是四种Java的访问权限。

| 访问级别 | 访问修饰符 | 同类 | 同包不同类(不含子类) | 同包子类 | 不同的包(不含子类) | 不同包子类 |
| :------: | :--------: | :--: | :--: | :--: | :--: | :------: |
| 公开的   | public     | **√** | **√** | **√** |**√**| **√** |
| 受保护的 | protected  | **√** | **√** | **√** || **√** |
| 默认的   | 什么都不加 | **√** | **√** |  ||  |
| 私有     | private    | **√** |      |      ||  |


### 引用

如果一个变量的类型是 类类型，而非基本类型，那么该变量又叫做引用。

听起来很绕，写起来就知道什么意思了。

使用类就要创建这个类的对象。就比如new demo()。但也只是创建对象，无法访问到它，所以就用引用来代表这个对象。

```Java
//引用了d这个变量来代表新创建的demo对象
		demo d = new demo();
```

### 构造方法

类还有一个很重要的概念就是构造方法，也叫构造器。构造方法使用来创建类的，所以方法名与类名一模一样，没有返回值，如果要实例化对象，就一定会用到构造方法。

```java
public class Hello {
    public static void main(String[] args) {
    	demo d1 = new demo();
        demo d2 = new demo(1);
    }
}

class demo{
    public int i;
    public void print(int i){
        System.out.println(i);
    }
    //无参构造函数
    demo(){
    	i = 2;
    }
     //有参构造函数（重载）
    demo(int t ){
       i = t;
    }
}
```

> 需要注意的是，系统会默认提供无参的构造方法，所以你能使用new demo()来创建对象，但如果定义了有参的构造方法，无参的就会没了，所以就不能使用new demo()来创建对象，所以养成个好习惯，创建类的时候，顺便写上无参的构造方法。

### Java的三大特性

#### 继承

{% note info%}
关键字extends

{% endnote %}

子类继承父类的所有方法和属性，Java的继承包括两种：

1. 类的单继承，即只能继承一个父类
2. 接口的多继承，一个类可以实现（继承）多个接口

#### 封装

{% note info%}
关键字就是private,protected,public

{% endnote %}

封装就是将一个类里的属性和方法包装起来，严格控制访问权限。就比如JavaBean就是一个标准的封装

```Java
class demo{
    
    private String name;
    private  int id;
    
    public demo(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```



#### 多态

多态就是同一个行为具有多个不同表现形式或形态的能力。实现多态的三个必要条件有

1. 继承
2. 重写
3. 父类引用指向子类对象

可以先看个简单的例子

```Java
public class Test {
    public static void main(String[] args) {
      show(new Cat());  // 以 Cat 对象调用 show 方法
      show(new Dog());  // 以 Dog 对象调用 show 方法
                
      Animal a = new Cat();  // 向上转型  
      a.eat();               // 调用的是 Cat 的 eat
      Cat c = (Cat)a;        // 向下转型  
      c.work();        // 调用的是 Cat 的 work
  }  
    public static void show(Animal a)  {
      a.eat();  
        // 类型判断
        if (a instanceof Cat)  {  // 猫做的事情 
            Cat c = (Cat)a;  
            c.work();  
        } else if (a instanceof Dog) { // 狗做的事情 
            Dog c = (Dog)a;  
            c.work();  
        }  
    }  
}
abstract class Animal {  
    abstract void eat();  
}  
class Cat extends Animal {  
    public void eat() {  
        System.out.println("吃鱼");  
    }  
    public void work() {  
        System.out.println("抓老鼠");  
    }  
}  
class Dog extends Animal {  
    public void eat() {  
        System.out.println("吃骨头");  
    }  
    public void work() {  
        System.out.println("看家");  
    }  
}
```

### this与super关键字

#### this

this的本质是”创建好的对象的地址“，经常用为当前对象。下面举个例子来说明this的使用方法。

```Java
// 1
class A（int a,int b） 
{
	this.a = a;           		//this.a指的是这个对象中定义的a，与构造器定义的区分
	this.b = b;
}   
// 2
class A(int a,int b,int c)
{
    this(a,b);          	 	// 引用同个类的构造器，必须放在第一行，不能引用两个
    this.c = c;
}
// 3
	this.a();					//通过this来调用本类的方法
```

{% note warning%}
使用this关键字来调用重载的构造方法时，可以避免相同的初始化代码，但只能在构造方法中使用，而且须位于构造方法的第一句。

{% endnote %}

> this不能用于static方法中。因为static方法是属于类的，this是代表对象，具体详情可以参考下面关于static的描述

#### super

super可以理解为指向父类对象（离得最近的）的一个指针，使用方法也有三种。

```Java
public class demo {
    public  int id;
    demo(){
        id = 10;
    }
    public void print(){
        System.out.println(id);
    }
    public static void main(String[] args) {
    }
}


class demo_01 extends demo{
    demo_01(){
        super();					//1.引父类的无参构造方法
    }
    public void print(){
        id = super.id;				//2. 调用父类的成员
        super.print();				//3. 调用父类的方法，跟第二个使用很像
    }
}

```

#### 两者对比

- 子类的构造函数中要调用super()，一定要放在首行，即使不用系统也会自行调用super()，即子类调用自己的构造器时会先调用父类的，先创建一个父类的对象
- super是从子类中调用父类的方法或变量，而this为在同一类中调用其它方法或变量
- 从本质上来讲this是一个指向本对象的指针，而super是一个Java的关键字



## 数组

数组是一个固定长度的，包含了相同类型数据的容器。

### 一维数组

#### 数组的声明

```Java
// 优先使用这种方法声明
datatype[] arr_name;
// 这种是C/C++风格的声明，不推荐
datatype  arr_name[];
```

#### 数组的实例

```Java
// 优先使用这种方法实例
datatype[] arr;
//不推荐
datatype arr[];
```

#### 创建数组

```java
//dataType[] arr_name = new dataType[arraysize];
		int arr = new int[10];
```

#### 三种初始化方式

```Java
// 1.静态初始化
   type[]  arr_name={,,,}
//2. 默认初始化
   type[]  arr_name = new type[int]    //全初始化为默认值，Boolean为false，引用类型为为null
//3.动态初始化
   //先分配空间，然后一个个初始化
```

### 二维数组

二维数组可以理解为一个数组，这个数组存着几个一维数组,所以Java的数组可以是不规则的。

#### 二维数组创建：

```java
	type[][] arr_name= new type[int][int];
```

#### 二维数组的初始化

```Java
//1.静态初始化
		type[][] arr_name ={{},{},{}}
//2.动态初始化，可以使数组不规则
		 arr_name[0]=new type[]{,,,}
```

## 接口

接口时一个抽象的类型，跟抽象类有着差不多作用，但又不是类，相当于一个模板需要我们去完善，实现功能，所以接口是不能被实例化的，使用它就需要继承它来实现。

### 抽象类

抽象类是一种特殊的类，它的作用就是给子类提供了模板，**它不能被实例化**，所以抽象类是被当作父类去继承的。说到抽象类，就先聊聊什么是抽象类。类里有抽象方法的类被叫为抽象类，但要注意抽象类不是一定有抽象方法。

> 定义抽象类就用关键字abstract，将类声明为抽象类

### 抽象方法

有抽象方法的类被叫为抽象类，那什么是抽象方法呢，就是专门给我们去继承实现的方法。所以抽象方法是必须要被重写的，而且继承了该抽象类就必须重写抽象方法，不然系统会编译出错。

> 抽象方法的定义也是用关键字abstract，抽象方法是必须被重写的，所以它是不需要方法体的。

{% note warning%}

子类继承了抽象类，没重写其抽象方法子类就必须在声明为抽象类，还有的就是构造方法和用static修饰的类方法是不能被声明为抽象方法的。

{% endnote%}

### 接口

大致了解了抽象类和抽象方法就能理解接口是什么了吧。接口时抽象方法的集合，虽然也可以定义变量，但最好不要破坏了接口的特性，全是抽象方法就好了。

> 接口是用关键字interface来定义的，类通过关键字implements去实现接口，而且里面的方法是不能有抽象方法的，继承的类必须重写里面所有的抽象方法。

这是一个简单的例子

```Java
public class demo implements demotest {
    public static void main(String[] args)  {
        demo d = new demo();
        d.a();
        d.b();

    }
    public void a() {
        System.out.println("aaa");
    }

    public void b() {
        System.out.println("bbb");
    }
}

interface demotest {
    void a();
    void b();
}
```

### 接口的多继承

在知道了接口之后，就会有个疑问，既然有了抽象类的概念，为什么还要特意设计接口呢？这就要涉及到接口的一个特点了。

> 类是只支持单继承，而接口支持多继承。

人们在写程序的时候发现，在继承了一个类之后，人们就不能继续继承了，有些功能又要重新定义和实现，因为Java不想我们弄得很乱，不能像C++那样可以支持继承多个类，所以设计了接口来解决这种问题。可以通过下面的列子来大概了解接口的魅力。

```Java
//继承了demoA的方法，又继承了demoB的方法，如果还想添加功能可以再写接口在实现
public class demo implements demoA,demoB {
    public static void main(String[] args) {
        demo d = new demo();
        d.a();
        d.b();
    }
    public void a() {
        System.out.println("aaa");
    }
    public void b() {
        System.out.println("bbb");
    }
}

interface demoA {
    void a();
}
interface demoB {
    void b();
}
```

{% note warning%}

接口的每个方法都会被隐式的指定public abstract来修饰，变量会被隐式的指定 public static final修饰。

JDK8之后，接口也可以有方法体和静态方法了，但怎么说呢，在我看来还是不加的好

{% endnote%}

## Scanner类

```java
import java.util.Scanner

public class Main {
       public static void main(String[] args) {
        Scanner sc= new Scanner(System.in);
        String str1 = sc.next();
//        next方法只读去空格之前的数据，并且指向本行
        String str2 = sc.nextLine();
//        nextLine方法可以扫描到一行内容并作为一个字符串而被获取到
        int i  = sc.nextInt();
//        nextInt方法只读取数值
    }
}
```

### System.in和System.out

- 该方法只能从键盘获取一个字符，而且获取的是char类型的，其他类型的难处理
```java
import java.io.IOException;

public class Main {
    public static void main(String[] args)  {
        System.out.println("请输入一个字符：");
        char c = 0;
        try {
            c = (char) System.in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(c);
    }
}

```

### InputStreamReader和BufferedReader

- 可以获取字符串，但是获得int,float等类型需要转换
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args)  {
        System.out.println("请输入：");
        InputStreamReader is = new InputStreamReader(System.in);
        BufferedReader br = new BufferedReader(is);
        try {
            String msg =br.readLine();
            System.out.println(msg);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

```

## String类

在Java中，有个很重要的类-String类，注意S是大写，就是我们所说的字符串类，这使得我们使用字符串十分方便。

### String的简单应用

```Java
public class demo {
    public static void main(String[] args) {
        String str1 = "hello";
        String str2 = "world!";
        System.out.println(str1+str2);
        String str3 = str1+str2;
        System.out.println(str3);
    }
}
```

<div class='tip warning'>
	<p>
    	注意String创建了就是不可改变的。
	<p>
</div>

既然字符串是不可变的，那为什么会出现下面的操作呢？

```
public class demo {
    public static void main(String[] args) {
        String str1 = "hello";
        String str2 = "world!";
        String str3 = str1+str2;
        System.out.println(str3);
        str1 = "hello world!";
        System.out.println(str1);
    }
}
```

>  有人会好奇str1为什么还能继续赋值呢。其实说字符串不可变，是说字符串本身不可变，即“hello”等字符串不能改变，str1只是一个引用，继续赋值只是换了一个地址索引，原来的“hello”还是会存在内存中。

### 类里经常使用的方法

都是经常使用的一些方法

```Java
//返回 char指定索引处的值
	char charAt(int index) 
//将此字符串与指定对象进行比较
	boolean equals(Object anObject) 
//使用平台的默认字符集将此 String编码为字节序列，将结果存储到新的字节数组中 
	byte[] getBytes() 
//返回指定字符第一次出现的字符串内的索引 
	int indexOf(int ch)
//返回 true如果，且仅当 length()为0 
	boolean isEmpty()  
//返回此字符串的长度
	int length()  
//将此字符串转换为新的字符数组。 
	char[] toCharArray()  
```



## 异常

异常是导致程序中断的事件，它不是算是错误，错误error是值jvm运行你的Java程序出的问题。

> Exception类是所有异常类的父类

### RuntimeException(运行时异常)

- ArithmeticException                                                                 试图除以0异常
- NullpointerException                                                               空指针异常
- ClassCastException                                                                   强制转换异常（引用数据类型转换）
- ArraylndexOutOfBoundsException                                        数组索引越界异常    
- NumberFormatException                                                         数字格式化异常

### CheckedException(已检查异常) 

这类异常在编译时必须处理，否则无法通过编译   

### 处理异常的方法

1. 用try-catch-finally来捕获异常

   ```Java
   public class demo {
       public static void main(String[] args) {
           try						//try来捕获异常
           {	
               System.out.println("try");
               throw new Exception( );
           }
           catch(Exception e)		//catch来处理异常
           {
               System.err.println("catch");
               e.printStackTrace( );
           }
           finally					//finally是必须执行的语句
           {
               System.out.println("finally");
           }
       }
   }
   ```

2. throws抛出异常让系统解决

   ```Java
   public class demo {
       public static void main(String[] args) throws Exception {
           
       }
   }
   ```



## 泛型

泛型即参数化类型，本质为数据类型的参数化 ,也就是说所操作的数据类型被指定为一个参数的方式传递，类似于方法中的变量参数。可以用在类、接口、方法的创建中，分别简称为泛型类、泛型接口、泛型方法。

### 为什么要使用泛型呢？

首先举一个简单的例子	

```Java
public class Test {
    public static void main(String[] args) {
        List arrayList = new ArrayList();
        arrayList.add("aaaa");
        arrayList.add(100);
        for(int i = 0; i< arrayList.size();i++){
            String item = (String)arrayList.get(i);
            System.out.println("元素是" + item);
        }
    }
}
```

nbsp;运行后就会发现程序崩溃了，这是因为在ArrayList中加入了Integer和String类型的数据，转换就出现了异常，所以为了解决一些集合内的类型转换的问题，就出现了泛型，泛型的使用可以减少类型转换和转换异常的情况。

### 泛型的特性

1. 泛型只在编译阶段有效，编译后程序会采取去泛型化的措施，泛型是不会进入到运行阶段的
2. 泛型类型在逻辑上可以看成是不同的类型，实际上都是相同的基本类型

### 使用方法

泛型有三种使用方式，泛型类，泛型接口，泛型方法。





## 集合框架

### Collection

&nbsp;首先学容器之前还是学习一下Collection接口，毕竟List与Set接口都是继承的Collection的，所以List与Set都有它的方法，别与Collections类弄混了，前者是集合类的上层接口，后者是一个集合框架的帮助类

```java
//	先新建两个Collection
	Collection<String>  c1 = new ArrayList<>();
	Collection<String>  c2 = new ArrayList<>();
// 	size()，返回值是int，返回当前集合元素的个数
	System.out.println(c1.size());
//	isEmpty()，返回值是Boolean类型，如果集合是空的就返回true，反之返回false
	System.out.println(c1.isEmpty());
//	add()，向集合里加入元素
	c1.add("student");
//	remove()，移除集合中的元素，并不是删除
	c1.remove("student");
//	clear()，移除所有的元素
	c1.clear();
//	toArray()，转换一个Object数组
	Object[] objs = c1.toArray();
//	contains()，返回值为Boolean类型，判断元素是否在集合内
	System.out.println(c1.contains("student"));
//	containsAll()，返回值为Boolean类型,判断集c1是否包含有c2的所有元素
	c1.containsAll(c2);
//	addAll()，将c2的所有元素加入c1中
	c1.addAll(c2);
//	removeAll(),移除c1与c2共同的元素(移除c1与c2的交集)
	c1.removeAll(c2);
//	retainAll()，只保留c1与c2共同的元素(移除c1与c2非交集的元素)
	c1.retainAll(c2);
```

### List

#### 概念

List是有序，可重复的容器，List接口继承了Collection,因为是有序的，所以List是有索引位置的，因此相对与Collection接口，会有一些 特殊的关于索引位置的方法

#### 常用实现类

- **LinkedList**

  &nbsp;&nbsp;LinkedList底层用双向链表实现的储存。查询效率低，删减效率高，线程不安全

- **ArrayList**

   &nbsp;&nbsp;ArrayList底层是用数组实现的储存。查询效率高，增删效率低，线程不安全

- **Vector**

   &nbsp;&nbsp;Vector底层是用数组实现的List,相关的方法都加了同步检查，故线程安全,效率低

- 当需要线程安全时就用Vector实现类。查找多就用ArrayList实现类，增删多就用LinkList。

#### 特殊方法

```java
	List<String> list = new ArrayList<>();
// List重载了一个add()方法,在指定索引位置插入一个元素
	list.add(3，"sss");	
//List重载了一个remove()方法,移除指定索引位置的元素
	list.remove(3);
//	set()，将指定索引位置元素改为指定元素
	list.set(2,"student");
//	get(),返回指定索引位置的元素
	System.out.println(list.get(2));
//	indexOf()，返回指定元素的第一次的索引位置，若没有，返回-1
	System.out.println(list.indexOf("student"));
//	lastIndexOf(),返回指定元素的最后一次的索引位置，若没有，返回-1
	System.out.println(list.lastIndexOf("student"));
```

#### 一些要点

- List允许加重复的元素
- List允许存在null元素
- List是有索引位置的
- List是支持泛型的，所以尽量使用List时要加泛型



### Map

#### 概念

Map是存储Key与Value的容器，每个key都会对应一个Value值，所以键对象不能重复,如果存放相同的键对象，对应值对象会被新的值对象代替。

#### 常用实现类
- **HashMap**

底层是通过哈希表来实现的。线程不安全，但效率高。允许Key与Value为null。

- **HashTable**

   &nbsp;&nbsp;底层实现与HashMap几乎一样，只是方法添加了synchronized来确保线程同步检查。所以线程安全，但效率低，且不允许Key与Value为null。

- **TreeMap**

   &nbsp;&nbsp;底层是通过红黑二叉树来实现的。HashMap效率高于TreeMap,需要排序时才会选择使用TreeMap，即按照Key递增的顺序排序，如果是类排序可以考虑使用comparable接口来实现

#### 常用的方法

```Java
	 Map<Integer,String> map1 = new HashMap<>();
	 Map<Integer,String> map2 = new HashMap<>();
//	put()，存放键值对
	map1.put(1,"student1");
//	get()，通过键对象得到对应的值对象
	map1.get(1);
//	remove()，删除键对象对应的键值对
	map1.remove(1);
//	containsKey()与containsValue()，判断是否包含键对象或值对象是否存在改容器
	map1.containsKey(1);
	map1.containsValue("student1");
//	size()，返回容器中键值对的数量
	System.out.println(map1.size());
//	isEmpty(),判断容器是否为空，返回值为Boolean类型
	System.out.println(map1.isEmpty());
//	putAll(),将map2所有的键值对存放到map1里
	map1.putAll(map2);
//	clear(),清空所有键值对
	map1.clear();
```

### Set
#### 概念

Set是**无序而且是不可重复的**，与List一样继承Collection接口。即没有索引只能遍历查找，通过equals方法为true的不能放入，即使是NULL也只能有一个。往Set里面加入元素，本质就是把这个元素作为Key加入到内部的Map里，由于Map里的key是不重复的所以Set也不重复

#### 常用实现类

- **HashSet**

  	底层是采用HashMap实现的，本质是简化版的HashMap，因此查询与增删效率较高。

- **TreeSet**

#### 常用方法

> 因为Set继承与Collection接口，而且没有新增方法，所以方法与Collection是一样的。

### 迭代器

#### 概念

迭代器是一种对象，它能够用来遍历标准模板库容器中的部分或全部元素，每个迭代器对象代表容器中的确定的地址。

#### 使用

- 遍历List容器

  ```Java
  	List<String> list = new ArrayList<>();
          list.add("1");
          list.add("2");
          list.add("3");
          list.add("4");
          list.add("5");
  //使用list里的iterator方法返回一个迭代器，使用该迭代器的hasNext方法得到下一个对象，进而遍历容器
          for(Iterator<String> iter = list.iterator();iter.hasNext();){
              String t = iter.next();
              System.out.println(t);
          }
  ```

- 遍历Set容器

  ```Java
  //遍历Set的方法与遍历List是一样的
  	Set<String> set = new HashSet<>();
          set.add("1");
          set.add("2");
          set.add("3");
          set.add("4");
          set.add("5");
          for(Iterator<String> iter = set.iterator();iter.hasNext();){
              String t = iter.next();
              System.out.println(t);
          }
  ```

- 遍历Map容器

  ```Java
  	Map<Integer,String> map = new HashMap<>();
          map.put(1, "student1");
          map.put(2, "student2");
          map.put(3, "student3");
  //通过Map.entrySet使用iterator遍历key和value
          Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
          while (it.hasNext()) {
              Map.Entry<Integer, String> entry = it.next();
              System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
          }
  ```

### 容器遍历汇总

#### List遍历

```Java
	List<String> list = new ArrayList<>();
        list.add("1");
        list.add("2");
        list.add("3");
        list.add("4");
        list.add("5");

//第一种，用for循环遍历
	for(int i = 0;i < list.size() ; i++){
            System.out.println(list.get(i));
        }
// 第二种，用迭代器遍历
	for(Iterator<String> iter = list.iterator();iter.hasNext();){
            String t = iter.next();
            System.out.println(t);
        }
//第三种，用增强for循环来遍历
	for(String s :list){
            System.out.println(s);
        }
//第四种，用foreach遍历
	list.forEach(item -> {
            System.out.println(item);
        });
//第五种，用list.stream().forEach
	list.stream().forEach(item -> {
            System.out.println(item);
        });
//经过测试，第一种是效率最高的，也是最推荐的，接下来是第二种，第三种，第四种，第五种
```

#### Set遍历

```Java
//Set的遍历与List大同小异,只是没有用索引遍历
Set<String> set = new HashSet<>();
        set.add("1");
        set.add("2");
        set.add("3");
        set.add("4");
        set.add("5");
//第一种，用迭代器遍历
        for(Iterator<String> iter = set.iterator();iter.hasNext();){
            String t = iter.next();
            System.out.println(t);
        }
//第二种，用增强for循环来遍历
		for(String s :set){
            System.out.println(s);
        }
//第三种，用foreach遍历
		set.forEach(item -> {
             System.out.println(item);
        });
//第四种，用set.stream().forEach 
        set.stream().forEach(item -> {
                System.out.println(item);
            });
//效率比较与List的遍历时一样的
```

#### Map遍历

```java
//第一种，用增强for循环遍历
	 for (Integer key : map.keySet()) {
            System.out.println("key= "+ key + " and value= " + map.get(key));
        }
//第二种，通过Map.entrySet使用iterator遍历key和value
	Iterator<Map.Entry<Integer, String>> it = map.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Integer, String> entry = it.next();
            System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
        }
//第三种，这种方法仅遍历，无法在for循环时实现remove等操作  
      for(Map.Entry<Integer,String>entry:map.entrySet()){
                System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
            }
//第四种，只能获取values，不能获取key
        for(String t:map.values()){
                    System.out.println("value= "+t);
                }
//一般使用第一种，但因为第一种方法是二次取值，所以效率会比第二第三种都要低
```

### Collections工具类

#### 概念

类java.util.Collections提供了对Set,List,Map的辅助方法

#### 常用方法

```Java
	List<String> list = new ArrayList<>();
//	sort(),对list容器内的元素从小到大排序
        Collections.sort(list);
//	shuffle(),对list容器内的元素随机排序
        Collections.shuffle(list);
//	reverse(),对list容器内的元素逆序排序
        Collections.reverse(list);
//	fill(),用一个指定对象重写容器
        Collections.fill(list,"student");
//	binarySearch(),对于顺序的list容器，采用二分法查找特定对象
		 Collections.sort(list);
        Collections.binarySearch(list, "student");
```



## IO流

### IO流的分类

- 根据处理数据的类型不同分为：字符流和字节流
- 根据数据流向的不同分为：输入流和输出流

### 节点流

1. **文件字节流**( 数据源为文件)

   - FileInputStream                   通过字节的方式从文件到程序，读取文件               

   - FileOutputStream                 通过字节的方式从程序到文件，写入文件

2. **文件字符流**( 数据源为文件)

   - FileReader                            通过字符的方式从文件到程序 

   - FileWriter                             通过字符的方式从程序到文件

     >  处理的是字符数组 char

3. **字节数组流**(数据源为字节数组对象)

   - ByteArrayInputStream                通过字节的方式从字节数组到程序    

   - ByteArrayOutputStream            拖过字节的方式从程序到字节数组 



{% note warning%}

使用流之后需要释放流，字节数组流不需要释放，系统会自动释放的

在cry - with -resources 工具类里，在抛出异常的try{}后加入流的声明，则会帮你自动释放资源，比如try(is;os;is1;os2){}

{% endnote %}



### 处理流

1. **字节缓冲流：**

   - **BufferedInputStream**

   - **BufferedOutputStream**

   - 默认是缓存8K，可以自己修改，原理类似于修饰模式。

   - 可以提升性能，运输效率，只用关闭外层的流即可，内层会自动关。手动关闭的话要从里往外关闭

2. **字符缓冲流：**

   - **BufferedReader**
     	readLine()        读取一行文字

   - **BufferedWriter**
         newLine()            换行符

   - 不要用父类引用指向子类对象，不然用不了这些新增方法

3. **转换流：**

   - **InputStreamReader**           

   - **OutputStreamWriter**            

   - 将字节流转为字符流，方便处理（字节流需全文本）

   - 能为字节流指定字符集

4. **数据流：**

   - **DataInputStream**

   - **DataOutputStream**

   - 保留数据类型，读取的顺序与写出保持一致

   - 数据流里放的是InputStream与OutputStream的字节流

5. **对象流：**

   - **ObjectInputStream**               反序列化

   - **ObjectOutputStream**            序列化

   - 先写出后读取，读取的顺序与写出的顺序保持一致

   - 不是所有的对象都能序列化，必须是实现了Serializable接口

   - 方法和数据流差不多，多了writeobject和readObject

   - 如果不需要序列化某个对象的值，就用transient来修饰类的对象

6. **打印流：**

   - **PrintfStream**

   - **PrintWriter**

7. **随机访问：**

   - **RandomAcessFile**

   - 两个模式(mode)  
     "r"读     "rw"读写

8. **合并：**

   - **SequenceInputStream**

   - 先用Vector容器来储存输入流，然后用该容器的elements()方法返回SequenceInputStream的参数，从而合成一个流



 

## TCP与UDP的简单实现

### TCP

- 使用基于TCP协议的Socket网络编程

- TCP协议基于请求- 响应模式

- 利用IO流实现数据的传输

- TCP使用的基本流程

```java
  import java.io.DataInputStream;
  import java.net.ServerSocket;
  import java.net.Socket;
  
  /**
   * 创建服务器
   * 1. 使用ServerSocket创建服务器   需要指定端口
   * 2. 阻塞式的等待连接  accept返回一个socket对象
   * 3. 输入输出流操作	
   * 4. 释放资源
   *
   */
  public class TCP_Setver {
      public static void main(String[] args) throws Exception{
  //        1.
          ServerSocket server = new ServerSocket(9999);
  //        2.
          Socket client = server.accept();
          System.out.println("一个客户端建立了连接");
  //        3.
          DataInputStream dis = new DataInputStream(client.getInputStream());
          String data = dis.readUTF();
          System.out.println(data);
  //        4.
          dis.close();
  
      }
  }
  
```

```java
  import java.io.DataOutputStream;
  import java.net.Socket;
  
  /**
   * 创建客户端
   * 1. 使用Socket创建客户端   指定服务器的地址和端口
   * 2. 输入输出流操作
   * 3. 释放资源
   */
  public class TCP_Client {
      public static void main(String[] args) throws Exception {
  //        1.
          Socket client = new Socket("localhost",9999);
  //        2.
          DataOutputStream dos =new DataOutputStream(client.getOutputStream());
          String data = "hello";
          dos.writeUTF(data);
          dos.flush();
  //        3.
          dos.close();
          client.close();
      }
  }
```

### UDP

- 基于UDP协议的Socket网络编程实现

- 不需要IO流实现数据传输，数据被打包成包裹发送到目的地（注意传输的包裹不要太大）

- 用到的两个类： 
	1. DatagramPacket
	2. DatagramSocket
	
- 代码实现	
	
```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
	   
	   /**
	    *                      发送端
	    *
	    * 1. 使用DatagramSocket(int port)指定端口,创建发送端
	    * 2. 准备数据(一定要转成字节数组)
	    * 3. 将字节数组封装成DatagramPacket包裹，需要指定目的地
	    * 4. 用send(DatagramPacket p)
	    * 5. 释放资源
	    */
	   public class UDP_Client {
	       public static void main(String[] args) throws Exception{
	   //        1.
	           DatagramSocket client = new DatagramSocket(8888);
	   
	   //        2.  比如发送一段文字
	           String msg = "你好!";
	           byte[] datas = msg.getBytes();
	   
	   //        3.  指定的端口要是接收端创建时指定的端口
	           DatagramPacket packet = new DatagramPacket(datas,0,datas.length,
	                   new InetSocketAddress("localhost",6666));
	   
	   //        4.
	           client.send(packet);
	   
	   //        5.
	           client.close();
	   
	       }
	   }
	   
```

```java
   import java.net.DatagramPacket;
   import java.net.DatagramSocket;
   
   /**
    *                 接收端
    *   1. 使用DatagramSocket(int port)指定端口,创建接收端
    *   2. 准备容器，封装成DatagramPacket包裹，用来接收发送端的包裹
    *   3. 用seceive(DatagramPacket p)阻塞式的接收包裹
    *   4. 分析数据，比如用getData()和getLengeth()方法
    *   5. 释放资源
    */
   public class UDP_Server {
       public static void main(String[] args) throws Exception{
   //        1.
           DatagramSocket server = new DatagramSocket(6666);
   
   //        2.
           byte[] datas = new byte[1024*10];
           DatagramPacket packet = new DatagramPacket(datas,0,datas.length);
   
   //        3.
           server.receive(packet);
   
   //        4.
           byte[] flush = packet.getData();
           int len = packet.getLength();
           System.out.println(new String(flush,0,flush.length));
   
   //        5.
           server.close();
       }
   }
```

## 多线程

> 笔记丢了，下次在补







<div class='tip success'>
    <p>终于整理完了，暂时不写了，如果想到有些漏的，在加上，还有一些其他的知识，我会用单独的文章来写<p>
</div>





> 笔记有一些是网上的，所以要是有侵犯到你的权益可以通知我删除。