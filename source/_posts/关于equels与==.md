---
title: 关于equels与==
categories:
  - Java
date: 2020-06-01 14:39:11
description: 在初学Java的时候，equels与==总是会感觉很混乱，这次特意来总结一下。
cover: https://img.yww52.com/2020/6/2020-6-1top_img.jpg
---

#### 前言

​		在初学Java的时候，equels与==总是会感觉很混乱，这次特意来总结一下。首先来大致了解一下这两个的意思。

- ==作用是来判断两个对象是不是同一个对象，因为Java只有值传递，所以对于==来说不管是基本的数据类型还是引用的数据类型，其本质比较的都是值，只是引用的数据类型变量的值是对象的地址。所以就会容易搞混

- equals方法也是比较两个对象是否相等。equals方法是Object类中的方法。

  ```Java
  public boolean equals(Object obj){
      return(this == obj);
  }//这是Object类中的equals方法
  ```



#### 在基本数据类型中的比较

​	基本数据类型不能算做为对象，所以并没有继承有equals的方法，所以只有==的比较

```Java
	 int num1 = 15;
     int num2 = 15;
    System.out.println(num1==num2);
// 运行结果为true，==判断值是否相等
```



#### 在引用数据类型中的比较

##### String类型中的比较

​	String类型是重写了equals方法的，所以这里会经常弄乱，重写后的equals方法为

```Java
 public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        if (anObject instanceof String) {
            String anotherString = (String) anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                            return false;
                    i++;
                }
                return true;
            }
        }
        return false;
    }
//String类重写的equals方法
```

###### 不new String的情况

```java
        String a = "ab";
        String b = "ab";
      System.out.println(a==b);
      System.out.println(a.equals(b));
//两个结果都是true
```

​	为什么两个都是True，这就要关系到字符串常量池了。当进行第一条语句的时候，编译器就会先在字符串常量池寻找有没有"ab"这个字符串，若没有就会将这个字符串放入字符串常量池。第二条语句进行的时候，就可以找到"ab"这个字符串，就会把字符串常量池里的引用地址给b，所以a与b的字符串是同一个地址的，所以==是true的。在上面的String重写的equals方法可以看出，equals方法是比较内容是否相同，所以第二个也是true。

###### new String的情况

```Java
       String a = new String("ab");
       String b = new String("ab");
     System.out.println(a==b);
     System.out.println(a.equals(b));
```

new String的语句是在堆内存中开辟一块空间用来存放"ab"这个字符串，然后在栈中开辟一块a或b的空间放着字符串的对象的引用，所以a,b两个虽然内容相同，但其实是两个对象，所以地址是不一样的，==在引用中比较的就是对象的地址，结果就是false。String的equals方法是比较内容的，内容相同就是true

##### 不在String中比较

```Java
		Scanner scanner = new Scanner(System.in);
        Scanner scanner2 = new Scanner(System.in);
       System.out.println(scanner.equals(scanner2));       //false
       System.out.println(scanner==scanner2);			   //false
        Scanner sc = scanner;
       System.out.println(scanner.equals(sc));            //true
       System.out.println(scanner==sc);   				  //true

```

​	这个就比较容易理解了，因为equals方法没被重写，所以是比较两个对象是否是同一个对象，==比较两个地址是否是一样，也是比较是否为同一个对象，所以这两者的作用在equals方法没被重写的时候是一样的。



#### 总结

- 在基本数据类型中

  ==比较两个值是否相同

- 在引用类型中

  - equals方法没被重写
    ==与equals方法比较的是两个的地址是否相同

  - equals方法被重写，以String类举例

    ==比较地址，equals比较方法

#### 一个特殊的例子

首先先看代码

```Java
		Integer num11 = 127;
        Integer num22 = 127;
      System.out.println(num11 == num22);				//true
	  System.out.println(num11 == 127);					//true
        Integer num111 = 128;
        Integer num222 = 128;
      System.out.println(num111 == num222);				//false
	  System.out.println(num111 == 128);				//true
```

​	按照所想，在Integer类当中，==是比较两个是否是同一个地址，但上述的运行结果中却出现了一个false，接下来在进行以下测试

```Java
		Integer num11 = new Integer(127);
        Integer num22 = new Integer(127);
      System.out.println(num11 == num22);			//false
      System.out.println(num11 == 127);				//true
        Integer num111 = new Integer(128);
        Integer num222 = new Integer(128);
      System.out.println(num111 == num222);			//false
      System.out.println(num111 == 128);			//true
```

> 由此可以看出
>
> 1. 第一段代码中，在-128~127的范围中，==的结果是为true，而不在这个范围中，==则为false
> 2. 第二段代码中，两个对象不一样，地址不一样，所以==的结果接就是就是false，没有任何异常的地方。
> 3. 直接用Integer类型与Int类型作比较，值相等就为true

最后在寻找过后得到结果

​	Java对于Integer是有一种缓存机制的，缓存了-128到127之间的数字，有点类似String，所以在第一个例子中，num11与num22其实是共享一个地址的，所以==的结果是true，不在缓存范围外的数字，并不是共享一个地址，所以==的结果就为false