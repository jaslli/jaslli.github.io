---
title: synchronized
date: 2021-1-11
categories:
	- Java
	- JUC
description: synchronized是Java提供的一个关键字，是一种同步锁。
keywords:
	- synchronized关键字
	- synchronized详解
	- synchronized锁种类
cover: https://img.yww52.com/2021/1/2021-1-11/top_img.jpg
---

# 应用方式

首先要知道synchronized实现同步的基础为Java中每一个对象都可以作为锁，synchronized一般的使用方法有以下三个。

1. 在普通方法上加synchronized，为方法的对象加锁。
2. 在静态方法上加synchronized，为该方法的类模板加锁。
3. 同步方法块，为给定对象加锁。

每一个线程执行到同步块或者是同步方法（对共享内存进行访问的程序片段称为临界区），就会去申请获得锁。当同步的操作执行完或者是抛出异常时就会把该锁给释放掉。

# 简单应用

之前的volatile文章有提过，volatile是不保证原子性的，现在就用synchronized来保证那个例子的原子性。

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
    int datanum = 0;
    // 为该方法加锁，锁的是对象
    public synchronized void addData() {
        datanum++;
    }
    //	与上面等价，锁的是this对象
    public  void addData1() {
        synchronized(this) {
            datanum++;
        }
    }
}
```

由此可以看见测试了很多次，答案都是20000，从而用synchronized可以保证了这个例子的原子性。下面我用图来简单讲解一下为什么synchronized能够保持这个例子的原子性。

![](https://img.yww52.com/2021/1/2021-1-11/img1.png)

# Monitor

介绍synchronized的原理之前先了解一个重要的概念，Monitor。

Monitor又称监视器，是一种同步机制，synchronized就是通过这个机制来实现方法或者代码块的同步的。

> 实际上任何一个Java对象都可以作为Monitor机制的monitor object，每一个Object的类都在底层实现了ObjectMonitor模式（这是底层用C来实现的），我们一般看不到，只要知道每一个Object类的对象都可以作为monitor对象

同步代码块会在代码块开始位置插入一条`monitorenter`在代码块结尾插入一条`monitorexit`，用这两条指令来实现Monitor机制。

同步方法是通过一个`ACC_SYNCHRONIZED`标志来确定，执行方法时判断有无该标志位，然后会隐式调用上面两条指令。

起初在没有线程执行到临界区时，monitor的大概情况是这样子的。

![](https://img.yww52.com/2021/1/2021-1-11/img2.png)

当有一个线程进入临界区，Monitor中的Owner就会指向该线程。

![](https://img.yww52.com/2021/1/2021-1-11/img3.png)

此时要是有其他线程也执行到了临界区的范围，就会进入Enter Set，即将线程的状态转变为阻塞状态，故Enter Set也可以称为阻塞队列。

![](https://img.yww52.com/2021/1/2021-1-11/img4.png)

当Owner的线程1离开了临界区就会出现三种情况。

1. 线程1因某些原因发生了`wait`等待，Owner恢复为null，并进入`Wait set`,然后阻塞队列中的线程开始竞争Owner的位置。（这里假设线程2竞争到了）

   ![](https://img.yww52.com/2021/1/2021-1-11/img5.png)

2. 线程1正常离开临界区，Owner恢复为null，线程1之后不再进入临界区，阻塞队列中的线程就会开始竞争Owner的位置。（这里假设线程2竞争到了）

   ![](https://img.yww52.com/2021/1/2021-1-11/img6.png)

3. 线程1正常离开临界区，Owner恢复为null，线程1之后还会进入临界区，那线程1就会与阻塞队列中的线程竞争Owner的位置。（这里假设线程2竞争到了）

   ![](https://img.yww52.com/2021/1/2021-1-11/img7.png)




# Java对象头



Java对象头是存储对象的一些基础信息的集合。

| 长度  |          内容          |                   说明                   |
| :---: | :--------------------: | :--------------------------------------: |
| 32bit |       Mark Word        |       存储对象的hashCode或锁信息等       |
| 32bit | Class Metadata Address |         存储到对象类型数据的指针         |
| 32bit |      Arraylength       | 数组的长度（要是对象不是数组则没有该项） |



这里就不详细探讨后面两个了，这里的重点是`Mark Word`，现在我们来看看这里面具体存储了什么。

<table style="text-align:center;vertical-align:middle;">
<tr>
    <th rowspan="2">锁状态</th>
    <th colspan="2">25bit</th>  
    <th rowspan="2">4bit</th> 
    <th>1bit</th> 
    <th>2bit</th>
</tr>
<tr>
    <th>23bit</th> 
    <th>2bit</th> 
    <th>是否是偏向锁</th>
    <th>锁的标志位</th>
</tr>
<tr> 
    <td>无锁</td>
    <td colspan="2">对象的hashCode</td>
    <td>分代年龄</td>
    <td>0</td>
    <td>01</td>
</tr>
<tr> 
    <td>偏向锁</td>
    <td>线程ID</td>
    <td>Epoch</td>
    <td>对象分代年龄</td>
    <td>1</td>
    <td>01</td>
</tr>
<tr> 
    <td>轻量级锁</td>
    <td colspan="4">指向栈中锁记录的指针</td>
    <td>00</td>
</tr>
<tr> 
    <td>重量级锁</td>
    <td colspan="4">指向互斥量（重量级锁）的指针</td>
    <td>10</td>
</tr>
<tr> 
    <td>GC标志</td>
    <td colspan="4">空</td>
    <td>11</td>
</tr>
</table>

![](https://img.yww52.com/2021/1/2021-1-11/img8.png)

在JDK1.6之前，synchronized只是一个重量级的锁，当JDK1.6进行更新之后，引入了偏向锁和轻量级锁的概念，所以锁的状态变成了以上的四种。

# 偏向锁

偏向锁是JDK1.6之后引进的，HotSpot作者发现大多数情况锁不仅存在多线程竞争，而且总是由同一线程多次获得。如果是之前，该线程每次都要获得锁，这样代价也未免太大了一点，所以为了优化这种情况，就出现了偏向锁。

偏向锁，顾名思义，偏爱某个线程的锁。当一个线程访问同步块并获取锁，会在对象头和栈帧中的锁记录里存储偏向的线程ID。以后该线程再次来获取锁，就只需测试一下对象头的Mark Word里是否存储着指向当前线程的偏向锁就好了，不必再次进行CAS来操作加锁和解锁。

>1. 偏向锁在Java6中是默认开启的，但是要在应用程序启动几秒之后才会激活，也就是说是有延迟的，有必要也可以通过设置参数来设置延迟
>   -XX:BiasedLockingStartupDelay=0
>2. 当不希望使用偏向锁，也可以通过设置参数来关闭,默认进入轻量级锁
>   -XX:-UseBiasedLocking=false

## 加锁

1. 当一个线程进入同步块，查看对象的锁标志位与偏向锁标志位，若为无锁状态即(01和0),往就会通过CAS来将对象的`Mark Word`中的线程ID设置为当前线程的线程ID，获得偏向锁，将偏向锁标志位改为1。
2. 当一个线程进入同步块，发现`Mark Word`的线程ID是当前线程的ID，就会直接运行。
3. 当一个线程进入同步块，发现`Mark Word`的线程ID不是当前线程，被偏向的线程没有在执行同步块，会有可能出现重置偏向的情况（批量重偏向）。
4. 当线程出现竞争或一些情况，就会开始进行撤销偏向锁。

## 撤销偏向锁



# 参考资料

- [Java并发编程的艺术](https://book.douban.com/subject/26591326/)
- https://juejin.cn/post/6844903640197513230#heading-6
- https://segmentfault.com/a/1190000016417017