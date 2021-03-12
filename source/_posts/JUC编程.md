---
title: 初识JUC编程
date: 2021-1-2
categories:
	- Java
	- JUC
description: 初识JUC编程。
keywords:
	- JUC编程
	- 线程池
cover: https://img.yww52.com/2021/1/2021-1-2top_img.jpg
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

## 上下文切换

即使是单核的CPU也是支持多线程执行的，CPU通过给每个线程分配CPU时间片来实现这个机制，这个时间片非常短，所以我们觉得多个线程是一起执行的，但其实是CPU在不断的切换线程执行。

在切换线程前会保存这个线程任务的状态，然后加载下个线程任务的状态，这个过程就是一次上下文切换。

## 并发是否比串行执行速度快

刚刚提到了上下文切换，可以知道并发其实并不一定会比串行的速度快，因为并发会消耗一部分时间在上下文切换上，所以当并发执行的操作不超过百万次时，速度会比串行执行操作要慢。

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

这里就只学习Lock类的`ReentrantLock`这个实现类。

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



# synchronized和ReentrantLock区别

1. synchronized是一个关键字，是JVM层面的，而ReentrantLock是一个来实现类，是API层面的。
2. synchronized是自动加锁和释放锁的，而ReentrantLock是手动加锁的，所以也需要手动释放锁。
3. synchronized的锁是不可中断的，除非是临界区内的代码出现异常或者是正常结束释放锁，而ReentrantLock的锁是可以中断的，可以使用`trylock`方法设置超时方法。
4. synchronized是非公平锁，而ReentrantLock默认是非公平锁，但是可以通过构造方法设置成公平锁。
5. synchronized的线程阻塞后是只能随机唤醒进程，而ReentrantLock通过Condition类可以精准唤醒被绑定的线程。



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

阻塞队列顾名思义就是会阻塞的队列，是队列的子类，其类为`BlockingQueue`,数组的实现方式是`ArrayBlockingQueue`和链表的实现方式是`LinkedBlockingQueue`。

## 有返回值会抛出异常

```Java
public class Test{
    public static void main(String[] args) {
        ArrayBlockingQueue<String> arrayBlockingQueue = new ArrayBlockingQueue<>(3);
        // 队列满了在用add方法入队就会抛出异常
        // java.lang.IllegalStateException: Queue full
        arrayBlockingQueue.add("1");
        arrayBlockingQueue.add("2");
        arrayBlockingQueue.add("3");
        arrayBlockingQueue.add("4");
        //	返回队首元素
        System.out.println(arrayBlockingQueue.element());
        // 队列空了再用remove出队就会抛出异常
        // java.util.NoSuchElementException
        arrayBlockingQueue.remove();
        arrayBlockingQueue.remove();
        arrayBlockingQueue.remove();
        arrayBlockingQueue.remove();
    }
}
```

```Java
    // add的实现，add是用了父类的实现
    public boolean add(E e) {
        return super.add(e);
    }
	// 父类实现
	public boolean add(E e) {
        if (offer(e))
            return true;
        else
            throw new IllegalStateException("Queue full");
    }
	// remove方法的实现
    public E remove() {
        E x = poll();
        if (x != null)
            return x;
        else
            throw new NoSuchElementException();
    }
	//	element方法的实现
    public E element() {
        E x = peek();
        if (x != null)
            return x;
        else
            throw new NoSuchElementException();
    }
```

> 这里可以看出这三个方法都是调用了下面不抛出异常的三个方法，加以修饰让其抛出异常而已。

## 有返回值不抛出异常

```Java
public class Test{
    public static void main(String[] args) {
        ArrayBlockingQueue<String> arrayBlockingQueue = new ArrayBlockingQueue<>(3);
        // 用offer入队，满了也不会出异常，会返回false
        System.out.println(arrayBlockingQueue.offer("1"));
        System.out.println(arrayBlockingQueue.offer("2"));
        System.out.println(arrayBlockingQueue.offer("3"));
        System.out.println(arrayBlockingQueue.offer("4"));
        
        // 返回队首元素
        System.out.println(arrayBlockingQueue.peek());
        
		// 用poll出队，对空会返回null
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll());

    }
}
```

```Java
	// offer的实现
	public boolean offer(E e) {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            if (count == items.length)
                return false;
            else {
                enqueue(e);
                return true;
            }
        } finally {
            lock.unlock();
        }
	// poll的实现 
    public E poll() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return (count == 0) ? null : dequeue();
        } finally {
            lock.unlock();
        }
    }
    // peek的实现
    public E peek() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return itemAt(takeIndex); // null when queue is empty
        } finally {
            lock.unlock();
        }
    }
      
```

由此可以看出这三个方法都是用到了锁的，使得上面抛出异常的三个方法也是加锁了的。

## 阻塞等待

```Java
public class Test{
    public static void main(String[] args) throws InterruptedException {
        ArrayBlockingQueue<String> arrayBlockingQueue = new ArrayBlockingQueue<>(3);
		// 因为队满了在用put入队，就会一直等待
        arrayBlockingQueue.put("1");
        arrayBlockingQueue.put("2");
        arrayBlockingQueue.put("3");
        arrayBlockingQueue.put("4");
		// 因为队空了在用take出队，就会一直等待
        System.out.println(arrayBlockingQueue.take());
        System.out.println(arrayBlockingQueue.take());
        System.out.println(arrayBlockingQueue.take());
        System.out.println(arrayBlockingQueue.take());
    }
}
```

```Java
    // put的实现
    public void put(E e) throws InterruptedException {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == items.length)
                notFull.await();
            enqueue(e);
        } finally {
            lock.unlock();
        }
    }
	// take的实现
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0)
                notEmpty.await();
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
```

## 超时等待

```Java
public class Test{
    public static void main(String[] args) throws InterruptedException {
        ArrayBlockingQueue<String> arrayBlockingQueue = new ArrayBlockingQueue<>(3);
		// 在队满的时候在入队，可以设置一个时间，时间过了就不等待了
        arrayBlockingQueue.offer("1");
        arrayBlockingQueue.offer("2");
        arrayBlockingQueue.offer("3");
        arrayBlockingQueue.offer("4",2, TimeUnit.SECONDS);
		// 在队空的时候在出队，可以设置一个时间，时间过了就不等待了
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll());
        System.out.println(arrayBlockingQueue.poll(2,TimeUnit.SECONDS));
    }
}
```

```Java
	// 这是超时等待的offer方法
	public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {

        checkNotNull(e);
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == items.length) {
                if (nanos <= 0)
                    return false;
                nanos = notFull.awaitNanos(nanos);
            }
            enqueue(e);
            return true;
        } finally {
            lock.unlock();
        }
    }
	// 这是超时等待的poll方法
    public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0) {
                if (nanos <= 0)
                    return null;
                nanos = notEmpty.awaitNanos(nanos);
            }
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
```

## 总结

|     方法     | 有返回值抛出异常 | 有返回值不抛出异常 | 阻塞等待 |   超时等待    |
| :----------: | :--------------: | :----------------: | :------: | :-----------: |
|     入队     |       add        |       offer        |   put    | 带参数的offer |
|     出队     |      remove      |        poll        |   take   | 带参数的poll  |
| 返回队首元素 |     element      |        peek        |    -     |       -       |



## 同步队列

`BlockingQueue`还有一个实现类为同步队列`SynchronousQueue`，这个队列只能容纳一个元素，当元素满了再入队就会等待，当元素空了再出队也会等待，类似于上述的阻塞等待，但是只能容纳一个元素。

```Java
public class Test{
    public static void main(String[] args)  {
        BlockingQueue<String> blockingQueue = new SynchronousQueue<>();

        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName() + "put  1");
                blockingQueue.put("1");
                System.out.println(Thread.currentThread().getName() + "put  2");
                blockingQueue.put("2");
                System.out.println(Thread.currentThread().getName() + "put  3");
                blockingQueue.put("3");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"线程一").start();

        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName() + "take  1");
                System.out.println(blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName() + "take  2");
                System.out.println(blockingQueue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println(Thread.currentThread().getName() + "take  3");
                System.out.println(blockingQueue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"线程二").start();
    }
}
```

# 线程池

## 三个方法

1. 创建线程池的方法

   ```Java
   	// 创建一个单例线程池，即只有一个线程的线程池
   	ExecutorService pool1 = Executors.newSingleThreadExecutor();
   	// 创建一个自定义线程的线程池，这里表示该线程池有五个线程
       ExecutorService pool2 = Executors.newFixedThreadPool(5);
   	// 创建一个可伸缩的线程池，多个线程就有多个线程（看CPU）
       ExecutorService pool3 = Executors.newCachedThreadPool();
   ```

   ```Java
   // 看一下创建线程的底层实现
       public static ExecutorService newSingleThreadExecutor() {
           return new FinalizableDelegatedExecutorService
               (new ThreadPoolExecutor(1, 1,
                                       0L, TimeUnit.MILLISECONDS,
                                       new LinkedBlockingQueue<Runnable>()));
       }
       public static ExecutorService newFixedThreadPool(int nThreads) {
           return new ThreadPoolExecutor(nThreads, nThreads,
                                         0L, TimeUnit.MILLISECONDS,
                                         new LinkedBlockingQueue<Runnable>());
       }
       public static ExecutorService newCachedThreadPool() {
           return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                         60L, TimeUnit.SECONDS,
                                         new SynchronousQueue<Runnable>());
       }
   ```

   > 阿里巴巴编程规范不建议用这种方式开启线程池，建议使用原生的ThreadPoolExecutor来开辟。

2. 使用线程池里的线程

   ```Java
   	// 丢入Runnable即可
   	pool1.execute();
   	// 比如
       pool1.execute(()->{
           System.out.println(Thread.currentThread().getName());
       });
   ```

3. 使用完记得关闭线程池

   ```Java
   	pool1.shutdown();
   ```

## 七大参数

七大参数其实就是`ThreadPoolExecutor`的参数，先看一下构造方法。

```Java
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
             Executors.defaultThreadFactory(), defaultHandler);
    }
	// 点进this之后，上面只是简化版
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

|               参数                |                             含义                             |
| :-------------------------------: | :----------------------------------------------------------: |
|         int corePoolSize          |                          核心线程数                          |
|        int maximumPoolSize        | 最大并发的线程数，只有阻塞队列满了才会开启更多的线程直到最大并发数 |
|        long keepAliveTime         |              超时等候时间，时间到了就会释放线程              |
|           TimeUnit unit           |                设置时间长度，与上一个参数搭配                |
| BlockingQueue<Runnable> workQueue |                           阻塞队列                           |
|    ThreadFactory threadFactory    |                      线程工厂，一般固定                      |
| RejectedExecutionHandler handler  | 拒绝策略，即线程数多到使阻塞队列满了而且最大线程数不够用了才执行的策略 |

```Java
public class Test{
    public static void main(String[] args)  {
        ExecutorService pool = new ThreadPoolExecutor(
                2,
                5,
                3,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(5),
                Executors.defaultThreadFactory(),	//	一般都是这个
                new ThreadPoolExecutor.AbortPolicy()
        );
    }
}
```



## 四个拒绝策略

拒绝策略共有四个，都是当线程数大于最大并发数加阻塞队列容量的时候，才会采取的策略。

```Java
 * <ol>
 *
 * <li> In the default {@link ThreadPoolExecutor.AbortPolicy}, the
 * handler throws a runtime {@link RejectedExecutionException} upon
 * rejection. </li>
 *
 * <li> In {@link ThreadPoolExecutor.CallerRunsPolicy}, the thread
 * that invokes {@code execute} itself runs the task. This provides a
 * simple feedback control mechanism that will slow down the rate that
 * new tasks are submitted. </li>
 *
 * <li> In {@link ThreadPoolExecutor.DiscardPolicy}, a task that
 * cannot be executed is simply dropped.  </li>
 *
 * <li>In {@link ThreadPoolExecutor.DiscardOldestPolicy}, if the
 * executor is not shut down, the task at the head of the work queue
 * is dropped, and then execution is retried (which can fail again,
 * causing this to be repeated.) </li>
 *
 * </ol>
```

1. `AbortPolicy`
   这个拒绝策略可以看出，不会处理多出的线程并抛出异常

   ```Java
       public static class AbortPolicy implements RejectedExecutionHandler {
           /**
            * Creates an {@code AbortPolicy}.
            */
           public AbortPolicy() { }
   
           /**
            * Always throws RejectedExecutionException.
            *
            * @param r the runnable task requested to be executed
            * @param e the executor attempting to execute this task
            * @throws RejectedExecutionException always
            */
           public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
               throw new RejectedExecutionException("Task " + r.toString() +
                                                    " rejected from " +
                                                    e.toString());
           }
       }
   ```

   这是默认的一个拒绝策略，在类中也可以看到。

   ```Java
       private static final RejectedExecutionHandler defaultHandler =
           new AbortPolicy();
   ```

2. `CallerRunsPolicy`

   当线程数大于最大并发数加阻塞队列容量的时候，多出来的线程从哪里来就到哪里执行，一般从主线程来，所以多出来的线程就会是main线程在执行。

   ```Java
       public static class CallerRunsPolicy implements RejectedExecutionHandler {
           /**
            * Creates a {@code CallerRunsPolicy}.
            */
           public CallerRunsPolicy() { }
   
           /**
            * Executes task r in the caller's thread, unless the executor
            * has been shut down, in which case the task is discarded.
            *
            * @param r the runnable task requested to be executed
            * @param e the executor attempting to execute this task
            */
           public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
               if (!e.isShutdown()) {
                   r.run();
               }
           }
       }
   ```

3. `DiscardPolicy`
   当线程数大于最大并发数加阻塞队列容量的时候，就会抛弃多出的线程，不抛出异常

   ```Java
       public static class DiscardPolicy implements RejectedExecutionHandler {
           /**
            * Creates a {@code DiscardPolicy}.
            */
           public DiscardPolicy() { }
   
           /**
            * Does nothing, which has the effect of discarding task r.
            *
            * @param r the runnable task requested to be executed
            * @param e the executor attempting to execute this task
            */
           public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
           }
       }
   ```

4. `DiscardOldestPolicy`

   当线程数大于最大并发数加阻塞队列容量的时候，会尝试看看最早的线程是否要结束，快结束了就加入到队列。

   ```Java
       public static class DiscardOldestPolicy implements RejectedExecutionHandler {
           /**
            * Creates a {@code DiscardOldestPolicy} for the given executor.
            */
           public DiscardOldestPolicy() { }
   
           /**
            * Obtains and ignores the next task that the executor
            * would otherwise execute, if one is immediately available,
            * and then retries execution of task r, unless the executor
            * is shut down, in which case task r is instead discarded.
            *
            * @param r the runnable task requested to be executed
            * @param e the executor attempting to execute this task
            */
           public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
               if (!e.isShutdown()) {
                   e.getQueue().poll();
                   e.execute(r);
               }
           }
       }
   ```

## 关于最大并发线程数的设置

   1. CPU密集型
      CPU有几核就设置为多少个线程。

      ```Java
      	// 该方法可以返回CPU的核心数
      	Runtime.getRuntime().availableProcessors();
      ```

   2. IO密集型
      根据具体情况确定，若有15个任务，那最大并发线程数可以设置为大于15，比如设置为30

