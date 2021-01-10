---
title: volatile
date: 2021-1-8
categories:
	- Java
	- JUC
description: volatile是Java提供的一个关键字，是一个轻量级的同步机制。
keywords:
	- volatile关键字
	- volatile详解
	- JMM
cover: https://img.yww52.com/2021/1/2021-1-8/top_img.jpg
---

# 什么是volatile

volatile是Java提供的一个关键字，是一种轻量级的同步机制，也可以理解为轻量级的synchronized。

# Java内存结构

Java的内存结构就是之前在学习Java虚拟机时的内存区域的划分。

![](https://img.yww52.com/2021/1/2021-1-8/img1.png)

> 绿色代表线程私有的内存区域，紫色的代表所有线程共享的内存区域。

Java内存结构在这里就不展开了，在JVM那里在详细说，这里提起是要说明哪些区域是线程私有的，哪些是线程共享的，还有就是和JMM区分开来。

# JMM

JMM，全称为`Java Memory Model`，Java内存模型。不要和Java内存结构搞混了。

Java内存模型是一组规范或者说是规则，每个线程执行都要遵循这个规范，是用来解决在线程的通信问题的。

JMM是一种规范，是一个抽象的概念，并不真实存在，内存结构才是真实存在的。

在讲解JMM之前先要理解两个概念，主内存和工作内存。

## 主内存

主内存是Java运行时在计算机存储数据的地方，是所有线程共享的，同时多个线程对这个主内存进行修改，就会出现很多的问题，这就是并发操作的问题，需要我们去解决。

## 工作内存

每个线程都有一个存储数据的地方，用来存储线程需要操作的数据，为什么要这样呢？

因为线程是不能直接对主内存中的数据进行修改的，只能修改线程工作内存中的数据，所以线程修改主内存中的数据时就会将主内存中的数据保存在自己的工作内存，然后在进行操作。

这样就会存在一个问题，每个线程都会对自己的工作内存进行操作，所以每一个线程都无法得知其他线程工作内存中的数据是怎么样的，这就是一个可见性的问题。

## JMM的抽象结构

![](https://img.yww52.com/2021/1/2021-1-8/img2.png)

以下是JMM对主内存数据操作时会执行的八个操作。（按顺序）

- lock
  将主内存中的数据变量标识为线程独占状态，即对该变量进行加锁操作，其他线程不能对其操作。

- read
  读取主内存中需要修改的变量，即上个经过加锁操作的变量。

- load

  将读取到的数据变量载入到线程的工作内存之中。

- use

  把工作内存中的变量传输给执行引擎，即对该变量进行操作。

- assign
  执行引擎对变量进行操作之后，将得到的变量的值放回工作内存。

- store
  将线程工作内存中的变量存储好。

- write
  将上述存储的变量写入主内存，实现刷新主内存中的值。

- unlock
  将该变量的锁释放，使其能让其他线程进行操作。



## JMM的三个特性

Java内存模型就是为了解决对共享数据中的可见性，原子性和有序性问题的一组规则。

即JMM的存在就是为了 保证这三个特性，现在具体来看看这三个特性。

### 可见性

可见性刚刚也讲工作内存的时候也是有提到的，这个其实很好理解，每个线程中的工作内存经过修改写回主内存之后，其他线程都可以看见主内存中的值发生变化，从而解决一些缓存不一致的情况。

### 原子性

原子性表示一个操作在执行中是不可以被中断的，有点类似事务的原子性，要么成功完成，要么直接失败。

### 有序性

有序性表示JMM会保证操作是有序执行的。或许有人会感到疑惑，难道程序不都是有序执行的吗？

这就要说到处理器的指令重排了，这涉及到了一些汇编的知识，所以不怎么展开了，大概了解一下。

为了提高CPU的使用率，在程序编译执行的时候，处理器会将指令进行重排优化，一般分为以下三个。

1. 编译器优化的重排
2. 指令并行的重排
3. 内存系统的重排

指令重排使得语句不一定是按从上到下执行的，可能会是乱序执行的，有些语句是存在数据依赖性的才会保持前后顺序。

为什么单线程的时候没有感觉呢？这是因为指令重排不会干扰到单线程执行的结果的，但是在多线程中乱序执行就会出现一些问题，导致得到的结果不一样。

# volatile的特点

根据上述JMM的三个特性来说说volatile的特点。

1. 保证可见性
2. 不保证原子性
3. 禁止指令重排

下面就仔细说说volatile的特点。

## 保证可见性

volatile是可以保证可见性的，现在来验证一下volatile的可见性。

```Java
package com.yw;

import java.util.concurrent.TimeUnit;

public class Test{
    public static void main(String[] args)  {
        Data data = new Data();
		System.out.println(Thread.currentThread().getName() + "线程开启");
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "线程开启！");
            // 保证main线程已经执行到循环的部分
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            data.modifydata();
            System.out.println(Thread.currentThread().getName() + "修改了资源值，当前值为" + data.datanum);
        },"第二个线程").start();

        while(data.datanum == 0) {
            // datanum等于0就一直循环
        }
        System.out.println(Thread.currentThread().getName() + "线程结束");
    }
}

class Data {
    int datanum = 0;

    public void modifydata() {
        this.datanum = 100;
    }
}
```

```运行结果
main线程开启
第二个线程线程开启！
第二个线程修改了资源值，当前值为100
```

这个程序的运行结果可以看到，main线程一直没有结束，一直在while循环里出不来。

因为main线程工作内存中`datanum`是一开始从主内存中拿到的0，在第二个线程将值改为100并刷新之后，由于main线程没收到通知主内存中的值发生了变化，故一直使用工作内存中的值，故一直会进行循环。

那接下来为这个资源变量增加一个volatile之后看看结果。

```Java
package com.yw;

import java.util.concurrent.TimeUnit;

public class Test{
    public static void main(String[] args)  {
        Data data = new Data();
		System.out.println(Thread.currentThread().getName() + "线程开启");
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "线程开启！");
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            data.modifydata();
            System.out.println(Thread.currentThread().getName() + "修改了资源值，当前值为" + data.datanum);
        },"第二个线程").start();

        while(data.datanum == 0) {
            // datanum等于0就一直循环
        }
        System.out.println(Thread.currentThread().getName() + "线程结束");

    }
}

class Data {
    volatile int datanum = 0;

    public void modifydata() {
        this.datanum = 100;
    }
}
```

```运行结果
main线程开启
第二个线程线程开启！
第二个线程修改了资源值，当前值为100
main线程结束
```

发现main线程是正常结束了，故可以知道main线程知道主内存中的值发生了改变，故该资源类对所有线程具有了可见性，故可以知道volatile是可以保证可见性的。

那么问题来了，volatile是怎么保证可见性的。

1. 用volatile修饰的变量在工作内存中被修改之后，就会将该值强制刷新到主内存当中去
2. 每个线程在修改volatile修饰的变量前，都会触发总线嗅探，保证工作内存中的值与主内存一样在进行修改。

<div class = 'tip'> <p>
     每个处理器通过嗅探总线上的资源类来确保自己工作内存的缓存值是否已经过期，如果过期就会将该缓存行设置为无效，然后重修读取主内存中的自己过期的值进行修改，这就是总线嗅探机制，当高并发多个线程不断进行总线嗅探就会导致总线风暴。
</p></div>



## 不保证原子性

这个其实很好验证，看以下代码。

```Java
package com.yw;

import java.util.concurrent.CountDownLatch;

public class Test{
    public static void main(String[] args) throws InterruptedException {
        Data data = new Data();
        //	用来辅助确保二十个线程全部执行完毕
        CountDownLatch countDownLatch = new CountDownLatch(20);
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                //	设置次数要多，太少结果不明显
                for (int j = 0; j < 1000; j++) {
                    data.addData();
                }
                countDownLatch.countDown();
            }).start();
        }
        countDownLatch.await();
        System.out.println("当前资源类的值为----->" + data.datanum);
    }
}

class Data {
    volatile int datanum = 0;
    public void addData() {
        datanum++;
    }
}
```

得到的结果按理说应该是20000,但是执行了很多次出来的结果都不是20000，都是比20000少的。这显而易见，每个线程并不能全部完成自己的任务，从而可知volatile不保证原子性。为什么不保证原子性呢？

假设存在两个线程，A和B。A和B将值读取到自己的工作内存当中，并将该值进行自增，当A即将将工作内存中的值写入到内存时，B也有可能会争抢写入到主内存，此时假设A成功抢到，并将主内存中的值刷新了，而由于计算机处理速度很快，在没有成功进行总线嗅探的时候也将工作内存的值写入到主内存，从而发生了丢失修改的错误，故结果总是低于20000（其实是有可能出现等于两万的，不过当并发量更大的时候，发生丢失修改的几率也会变大）。

出现这种情况的原因是自增这个复合操作不是原子性的，所以volatile是不能保证原子性的。

## 禁止指令重排

指令重排涉及到汇编，结果也会有随机性，只能进行云分析了，先看以下样例。

假设有a,b,x,y四个变量的值为0，然后两个线程对该变量进行修改。

| 线程A  | 线程B  |
| :----: | :----: |
| x = a  | y = b  |
| b = 10 | a = 10 |

正常的结果是得到`x=0,y=0`。

可是由于指令重排的存在，所以在小概率的情况下会出现先执行`b=1`或者是`a=2`，然后就会导致x与y的值不为0这种错误的结果。

这时候就可以使用volatile来禁止指令重排，使其顺序进行，从而使结果正确。

那么volatile是怎样禁止指令重排的呢？这就涉及到一个新的概念了，内存屏障。

### 内存屏障

内存屏障分为四类，如表。

|      屏障类型       |         指令示例         |                             说明                             |
| :-----------------: | :----------------------: | :----------------------------------------------------------: |
|  LoadLoad Barriers  |   Load1;LoadLoad;Load2   |      确保Load1数据装载先于Load2及所有后续装载指令的装载      |
| StoreStore Barriers | Store1;StoreStore;Store2 | 确保Store1数据对其他处理器可见（刷新到内存）先于Store2及所有后续存储指令的存储 |
| LoadStore Barriers  |  Load1;LoadStore;Store2  |  确保Load1数据装载先于Store2及所有后续存储指令的刷新到内存   |
| SroreLoad Barriers  |  Store1;StoreLoad;Load2  | 确保Store1数据对其他处理器可见（刷新到内存）先于Load2及所有后续装载指令的装载<br />该指令会使屏障之前所有内存访问指令完成之后才执行该屏障之后的内存访问指令 |

接下来的就是JMM针对编译器制定的volatile重排序规则表。

| 是否能够重排序 | 普通读/写 | volatile读 |volatile写 |
| :------------: | :--------: | :--: | :--: |
| 普通读/写 |            |      | NO |
| volatile读 | NO | NO | NO |
| volatile写 |            | NO | NO |

左边为第一个操作，右边为第二个操作。比如第三行第二列的NO就表示，如果第一个操作为volatile读，第二个操作为普通读/写，则编译器不能重排序这两个操作。

### volatile写

- 在每个volatile写操作前面插入一个`StoreStore Barriers`
- 在每个volatile写操作后面插入一个`StoreLoad Barriers`

![](https://img.yww52.com/2021/1/2021-1-8/img3.png)

### volatile读

- 在每个volatile读操作后面插入一个`LoadLoad Barriers`
- 在每个volatile读操作后面插入一个`LoadStore Barriers`

![](https://img.yww52.com/2021/1/2021-1-8/img4.png)

# 参考资料

- [Java并发编程的艺术](https://book.douban.com/subject/26591326/)
- [并发编程网](http://ifeve.com/)