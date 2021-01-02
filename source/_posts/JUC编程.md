---
title: 代理模式
date: 2021-1-2
categories:
	- Java
description: 
cover: https://img.yww52.com/2020/6/2020-6-28top_img.jpg
---

# 什么是JUC

JUC是`java.util.concurrent`包的缩写，这个包是Java的并发编程的工具类，所以JUC编程可以理解为Java的并发编程。

# 一些基本的概念

## 程序，进程与线程

1. 程序是一组计算机能识别和执行的指令，只是一个静态的概念。
2. 进程是操作系统资源分配的基本单位，可以理解为一个程序的运行就为一个进程，它是一个动态的实体。
3. 线程可以理解为进程之内为了完成某一个任务的线路，一个进程为了完成任务，可能就会将该任务拆分为很多子任务，并开辟多个线程来完成这些子任务，从而加快完成总任务的速度。

## 开启线程的方式

1. 继承`Thread`类，重写`run()`方法，调用`start()`方法
2. 实现`Runnable`接口，重写`run()`方法，创建`Thread`实例，调用其中的`start()`方法。
3. 实现`Calleble`接口



## 串行，并发和并行

1. 串行很好理解，每个任务都会排队执行，上一个任务没有结束，下一个任务就无法开始。
2. 并发就是不用等待上一个任务执行完毕，下一个任务就能开始执行，每个任务交替执行，形成每个任务同时进行的假象。
3. 并行就是任务同时进行，而不是像并发一样交替执行。
4. 简单理解为并发就是交替做一件事，并行就是同时做不同的事 。
5. 即使是单核的CPU也能进行多线程的操作，但是做不到并行。

## Java进程的状态

从Java的`Thread`类中就可以看到Java进程的全部状态了。

```Java
    public enum State {
        /**
         * Thread state for a thread which has not yet started.
         */
        NEW,

        /**
         * Thread state for a runnable thread.  A thread in the runnable
         * state is executing in the Java virtual machine but it may
         * be waiting for other resources from the operating system
         * such as processor.
         */
        RUNNABLE,

        /**
         * Thread state for a thread blocked waiting for a monitor lock.
         * A thread in the blocked state is waiting for a monitor lock
         * to enter a synchronized block/method or
         * reenter a synchronized block/method after calling
         * {@link Object#wait() Object.wait}.
         */
        BLOCKED,

        /**
         * Thread state for a waiting thread.
         * A thread is in the waiting state due to calling one of the
         * following methods:
         * <ul>
         *   <li>{@link Object#wait() Object.wait} with no timeout</li>
         *   <li>{@link #join() Thread.join} with no timeout</li>
         *   <li>{@link LockSupport#park() LockSupport.park}</li>
         * </ul>
         *
         * <p>A thread in the waiting state is waiting for another thread to
         * perform a particular action.
         *
         * For example, a thread that has called <tt>Object.wait()</tt>
         * on an object is waiting for another thread to call
         * <tt>Object.notify()</tt> or <tt>Object.notifyAll()</tt> on
         * that object. A thread that has called <tt>Thread.join()</tt>
         * is waiting for a specified thread to terminate.
         */
        WAITING,

        /**
         * Thread state for a waiting thread with a specified waiting time.
         * A thread is in the timed waiting state due to calling one of
         * the following methods with a specified positive waiting time:
         * <ul>
         *   <li>{@link #sleep Thread.sleep}</li>
         *   <li>{@link Object#wait(long) Object.wait} with timeout</li>
         *   <li>{@link #join(long) Thread.join} with timeout</li>
         *   <li>{@link LockSupport#parkNanos LockSupport.parkNanos}</li>
         *   <li>{@link LockSupport#parkUntil LockSupport.parkUntil}</li>
         * </ul>
         */
        TIMED_WAITING,

        /**
         * Thread state for a terminated thread.
         * The thread has completed execution.
         */
        TERMINATED;
    }
```

# synchronized

首先来看个简单的例子。

```Java
public class Test implements Runnable{
    private int ticket = 30;
    private boolean flag = true;
    public static void main(String[] args) {
        Test test = new Test();
        new Thread(test,"第一个人").start();
        new Thread(test,"第二个人").start();
        new Thread(test,"第三个人").start();
    }
    /**
        买票的方法
     */
    public void buyTicket() {
        if(ticket <= 0) {
            flag = false;
            return;
        }
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "获得了第" + ticket-- + "张票");
    }
    /**
         run方法
     */
    @Override
    public void run() {
        while(flag) {
            buyTicket();
        }
    }
}
```

从上面这个例子就会出现两种不正常的情况。

1. 先买到了第n张票之后才买到第n-1张票
2. 出现负数的票

因为多线程难以统一资源所以会出现的这些异常情况，这是我们不想看到的。处理并发的有效的手段就是加锁，所以我们需要用加锁来解决这个问题。

这里使用了`synchronized`来对买票的方法进行加锁，可以解决一些简单的并发问题。

```Java
package com.yw;

/**
 * @ClassName Test
 * @Descriprtion TODO
 * @Author yww
 * @Date 2020/12/27 15:21
 * @Version 1.0
 **/
public class Test implements Runnable{
    private int ticket = 30;
    private boolean flag = true;
    public static void main(String[] args) {
        Test test = new Test();
        new Thread(test,"第一个人").start();
        new Thread(test,"第二个人").start();
        new Thread(test,"第三个人").start();
    }
    /**
        买票的方法
     */
    public synchronized void buyTicket() {
        if(ticket <= 0) {
            flag = false;
            return;
        }
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "获得了第" + ticket-- + "张票");
    }
    /**
         run方法
     */
    @Override
    public  void run() {
        while(flag) {
            buyTicket();
        }
    }
}
```

synchronized分为三种使用情况。

1. 在普通方法上使用synchronized关键字，锁住的是实例对象，每个实例都各自有自己的锁，互不干扰。
2. 在静态方法上使用synchronized关键字，锁住的是类，即每个实例对象共用这个锁。
3. 同步方法块，锁的对象不定，看个人行为。

# Lock锁

也可以不用`synchronized`来加锁，这里就来讲讲第二种方式。

现在只讲一下Lock的一个`ReentrantLock`这个实现类。

先探究一下这个实现类的构造方法。

```Java
    /**
     * Creates an instance of {@code ReentrantLock}.
     * This is equivalent to using {@code ReentrantLock(false)}.
     */
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    /**
     * Creates an instance of {@code ReentrantLock} with the
     * given fairness policy.
     *
     * @param fair {@code true} if this lock should use a fair ordering policy
     */
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }

```

由此可以看出，不加参数使用该实现类，这个锁就是`非公平锁`，加了true的参数，就是`公平锁`。

>简单的解释一下公平锁与非公平锁。
>
>1. 公平锁，表示先来先服务，按照申请锁的顺序去获得锁，每个申请锁的线程都会形成一个队列，一个个来获得锁。
>2. 非公平锁，表示每个线程都可以去申请获得锁，获取不到就等待，获取得到就可以获得锁。
>
>很多情况默认都是是非公平锁，synchronized也算是非公平锁，谁先抢到，谁就进行。

现在就用该实现类来解决一下上面买票的问题。

```Java
public class Test implements Runnable{
    private int ticket = 30;
    private boolean flag = true;
    Lock lock = new ReentrantLock();
    public static void main(String[] args) {
        Test test = new Test();
        new Thread(test,"第一个人").start();
        new Thread(test,"第二个人").start();
        new Thread(test,"第三个人").start();
    }
    /**
        买票的方法
     */
    public  void buyTicket() {
        //	加锁
        lock.lock();
        try {
            if(ticket <= 0) {
                flag = false;
                return;
            }
            Thread.sleep(100);
            System.out.println(Thread.currentThread().getName() + "获得了第" + ticket-- + "张票");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            // 解锁
            lock.unlock();
        }
    }
        /**
         run方法
     */
    @Override
    public  void run() {
        while(flag) {
            buyTicket();
        }
    }
}
```

这样就可以进行简单的加锁来解决一些线程出现的问题。

# 生产者和消费者的问题

## synchronzied

我们计划，当商品数量为1的时候，消费者进行消费，当商品数量为0的时候，生产者进行生产。

所以这会涉及到线程之间的通信，商品数量为0的时候消费者就会进入等待，并通知生成者进入就绪状态。商品数量为1的时候生成者就会进入等待，并通知消费者进入就绪状态

```java 
public class Test{
    public static void main(String[] args) {
        Shop shop = new Shop();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.buyShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"消费者").start();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.AddShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"生成者").start();
    }
}
class Shop {
    private int shopnum = 1;

    public synchronized void buyShop() throws InterruptedException {
        if(shopnum == 0) {
            this.wait();
        }
        System.out.println(Thread.currentThread().getName() + shopnum--);
        this.notifyAll();
    }
    public synchronized void AddShop() throws InterruptedException {
        if(shopnum == 1) {
            this.wait();
        }
        System.out.println(Thread.currentThread().getName() + shopnum++);
        this.notifyAll();
    }
}
```

这个代码还会有一个`虚假唤醒`的问题，当线程数增加到了两个以上，就会出现一些异常情况，比如票数会到达0与1之外的范围，这是因为使用if来进行判断等待状态，只会判断一次，所以可能会出现两个线程都判断成功的情况，所以必须要使用while来进行判断，这样可以防止虚假唤醒的问题。

```Java
public class Test{
    public static void main(String[] args) {
        Shop shop = new Shop();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.buyShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"消费者").start();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.AddShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"生成者").start();
    }
}
class Shop {
    private int shopnum = 1;

    public synchronized void buyShop() throws InterruptedException {
        // 进入等待
        while(shopnum == 0) {
            this.wait();
        }
        System.out.println(Thread.currentThread().getName() + shopnum--);
        // 通知唤醒
        this.notifyAll();
    }
    public synchronized void AddShop() throws InterruptedException {
        // 进入等待        
        while(shopnum == 1) {
            this.wait();
        }
        // 通知唤醒
        System.out.println(Thread.currentThread().getName() + shopnum++);
        this.notifyAll();
    }
}
```

## Lock锁

这里的Lock接口是没办法实现线程等待和唤醒的，所以就使用了一个`Condition`类的`await`方法和`signal`方法来代替wait和notifyall方法。

```Java
public class Test{
    public static void main(String[] args) {
        Shop shop = new Shop();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.buyShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"消费者1").start();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.AddShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"生成者1").start();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.buyShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"消费者2").start();
        new Thread(()->{
            for (int i = 0; i < 50; i++) {
                try {
                    shop.AddShop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        },"生成者2").start();
    }
}

class Shop {
    private int shopnum = 1;
    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();

    public  void buyShop() throws InterruptedException {
        lock.lock();
        try {
            while(shopnum == 0) {
                condition.await();
            }
            System.out.println(Thread.currentThread().getName() + shopnum--);
            condition.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
    public  void AddShop() throws InterruptedException {
        lock.lock();
        try {
            while(shopnum == 1) {
                condition.await();
            }
            System.out.println(Thread.currentThread().getName() + shopnum++);
            condition.signal();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

# 读写锁

读写锁，这个类其实和上面两个加锁方法差不多，该锁可以将封锁粒度减少一点。读写锁其实就是之前学到的排他锁和共享锁。

线程对一个资源加上排它锁，表示只允许该线程进行读写资源，不允许其他线程读写，直到该线程释放了排它锁。

线程对一个资源加上共享锁，表示该线程可以对该资源进行读操作，但不能修改资源，其他的线程可以对该资源加共享锁，但不能加排它锁进行修改该资源，直到所有线程释放了对该资源的共享锁才能为该资源加排它锁进行修改。

```Java
public class Test{
    public static void main(String[] args) {
        Mycache mycache = new Mycache();
        for(int i = 1; i <= 10; i++) {
            final int temp = i;
            new Thread(()->{
                mycache.put(temp + "",temp + "");
            },String.valueOf(i)).start();
        }
        for(int i = 1; i <= 10; i++) {
            final int temp = i;
            new Thread(()->{
                mycache.get(temp + "");
            },String.valueOf(i)).start();
        }
    }
}

class Mycache {
    private volatile Map<String,String> map = new HashMap<>();
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    public void put(String key,String value) {
        // 加上排它锁
        readWriteLock.writeLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "写入" + key);
            map.put(key,value);
            System.out.println(Thread.currentThread().getName() + "写入完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放排它锁
            readWriteLock.writeLock().unlock();
        }
    }

    public void get(String key) {
        //	加上共享锁
        readWriteLock.readLock().lock();
        try {
            System.out.println(Thread.currentThread().getName() + "读取" + key);
            String value = map.get(key);
            System.out.println(Thread.currentThread().getName() + "读取完成");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放共享锁
            readWriteLock.readLock().unlock();
        }
    }
}
```



# 集合类

经常使用的一些集合类在并发操作下很多都是不安全的，多个线程进行写入操作就会出现并发修改异常`ConcurrentModificationException`。所以现在来探讨一下解决的方案。

## List

1. 使用`Vector`实现类，这个实现类是线程安全的，为什么安全可以看一下它的add方法，它是使用了`synchronized`关键字的。

   ```Java
   public synchronized boolean add(E e) {
       modCount++;
       ensureCapacityHelper(elementCount + 1);
       elementData[elementCount++] = e;
       return true;
   }
   ```

2. 使用Collections工具类将Arraylist转换成安全的实现类。

   ```Java
   public class Test{
       public static void main(String[] args) {
           List<String> list = Collections.synchronizedList(new ArrayList<>());
           for(int i = 1; i <= 20; i++) {
               new Thread(()->{
                   list.add("1111");
                   System.out.println(list);
               },String.valueOf(i)).start();
           }
       }
   }
   ```

3. 使用`CopyOnWriteArrayList`实现类。

   ```Java
   public class Test{
       public static void main(String[] args) {
           List<String> list = new CopyOnWriteArrayList<>();
           for(int i = 1; i <= 20; i++) {
               new Thread(()->{
                   list.add("1111");
                   System.out.println(list);
               },String.valueOf(i)).start();
           }
       }
   }
   ```
## Set

   HashSet也和ArrayList一样不安全，所以需要进行一些操作。

   1. 使用Collections工具类将HashSet转换成安全的实现类。

      ```java 
      public class Test{
          public static void main(String[] args) {
              Set<String> set = Collections.synchronizedSet(new HashSet<>());
              for(int i = 1; i <= 20; i++) {
                  new Thread(()->{
                      set.add(UUID.randomUUID().toString());
                      System.out.println(set);
                  },String.valueOf(i)).start();
              }
          }
      }
      ```

   2. 使用`CopyOnWriteArrayList`实现类。

      ```Java
      public class Test{
          public static void main(String[] args) {
              Set<String> set = new CopyOnWriteArraySet<>();
              for(int i = 1; i <= 20; i++) {
                  new Thread(()->{
                      set.add(UUID.randomUUID().toString());
                      System.out.println(set);
                  },String.valueOf(i)).start();
              }
          }
      }
      ```

   ## Map

1. 使用Collections工具类将HashMap转换成安全的实现类。

   ```Java
   public class Test{
       public static void main(String[] args) {
           Map<String,String> map = Collections.synchronizedMap(new HashMap<>());
           for(int i = 1; i <= 20; i++) {
               new Thread(()->{
                   map.put(Thread.currentThread().getName(),UUID.randomUUID().toString());
                   System.out.println(map);
               },String.valueOf(i)).start();
           }
       }
   }
   ```

2. 使用`ConcurrentHashMap`实现类。

   ```Java
   public class Test{
       public static void main(String[] args) {
           Map<String,String> map = new ConcurrentHashMap<>();
           for(int i = 1; i <= 20; i++) {
               new Thread(()->{
                   map.put(Thread.currentThread().getName(),UUID.randomUUID().toString());
                   System.out.println(map);
               },String.valueOf(i)).start();
           }
       }
   }
   ```

# Callable

Callable是第三种开启线程的方式，但是线程的开启都是通过Thread类的start方法来开启的，而Callable的实现类是无法传入Thread类中的，所以需要借用中间类来实现。

```Java
public class Test{
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        HelloTest helloTest = new HelloTest();
        FutureTask futureTask = new FutureTask(helloTest);
        new Thread(futureTask,"线程").start();
        //	获取返回值，有缓存，所以会有可能出现线程阻塞
        String msg = (String) futureTask.get();
        System.out.println(msg);
    }
}
class HelloTest implements Callable<String>{
    @Override
    public String call() throws Exception {
        System.out.println("call方法调用");
        return "hello from Callable";
    }
}
```

> 其中的FutureTask是实现了RunnableFuture，而RunnableFuture接口继承了Runnable，其实借用FutureTask类打开线程本质就是接用Runnable来开启线程的。

# 常用辅助类

## CountDownLatch

这是一个减法计数器。

```Java
public class Test{
    public static void main(String[] args) throws InterruptedException {
        // 计数器初始赋值
        CountDownLatch countDownLatch = new CountDownLatch(10);
        for(int i = 1; i <= 10; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName() + "线程执行");
                // 计数器减一
                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }
        // 等待计数器为0
        countDownLatch.await();
        System.out.println("程序结束");
    }
}
```

## CyclicBarrier

这是一个加法计数器。

```Java
public class Test{
    public static void main(String[] args) throws InterruptedException, BrokenBarrierException {
        // 设置线程数到10执行创建的线程，以下就是线程开到10个才会进行打印线程
        CyclicBarrier cyclicBarrier = new CyclicBarrier(10,()->{
            System.out.println("所有线程开启成功");
        });
        for(int i = 1; i <= 10; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName() + "线程启动");
                try {
                    //	线程到10就会通知之前定义的线程
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

## Semaphore

一个计数信号量。

```Java
public class Test{
    public static void main(String[] args) {
        // 指定线程的最高开启数量
        Semaphore semaphore = new Semaphore(2);
        for(int i = 0; i <= 10; i++) {
            new Thread(() ->{
                try {
                    // 等待Semaphore中线程数少于限制的量，然后开启线程，将该线程计入Semaphore
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "开启了线程");
                    try {
                        TimeUnit.SECONDS.sleep(2);
                    } catch (InterruptedException interruptedException) {
                        interruptedException.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + "结束了线程");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    // 线程结束，将该线程从Semaphore释放
                    semaphore.release();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

# 阻塞队列

