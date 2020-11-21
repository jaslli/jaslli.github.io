---
title: HashMap
date: 2020-11-20
categories:
  - Java
description: HashMap是经常用到的一个集合，很有必要进行深入了解。
cover: https://img.yww52.com/2020/10/2020-10-23top_img.jpg
---

# 简介

# jdk1.7

HashMap在Java7中是采用数组和链表来进行存储的，主要使用数组，链表是辅助。下面就来看看大概的结构。为什么是这样的之后会讲到。

![](https://img.yww52.com/2020/11/2020-11-20/img1.png)

## 参数和变量

```Java
    /**
     * 默认的初始容量，必须是2的幂，默认16
     */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    /**
     * 这是HashMap的最大容量，值为1<<30。要是传入更高的值，就会使用这个最大容量
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;

    /**
     * HashMap默认的负载因子
     */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
```

```Java
    /**
     * 当表未膨胀时使用的空表实例
     */
    static final Entry<?,?>[] EMPTY_TABLE = {};

    /**
     *这个表根据需要调整长度大小，长度必须为2的幂
     */
    transient Entry<K,V>[] table = (Entry<K,V>[]) EMPTY_TABLE;

    /**
     * 键值对的数量
     */
    transient int size;

    /**
     * 下一个要调整大小的值，值为容量*负载系数
     * 如果table == EMPTY_TABLE,则值为初始容量
     * 膨胀时将会创建表格
     * @serial
     */
    int threshold;

    /**
     * 哈希表的负载因子
     * @serial
     */
    final float loadFactor;

    /**
     * 已对HashMap进行结构修改的次数结构修改是指更改HashMap中的映射数或
     * 以其他方式修改其内部结构（例如，重新哈希）的修改。 此字段用于使HashMap的Collection-view上
     * 的迭代器快速失败。 （请参见ConcurrentModificationException）。
     */
    transient int modCount;

    /**
     * 映射容量的默认阈值，高于该阈值时，字符串键将使用替代哈希。
     * 备用哈希可减少由于字符串键的哈希码计算能力较弱而导致的冲突发生率。
     * <p/>
     * 可以通过定义系统属性来覆盖这个值
     */
    static final int ALTERNATIVE_HASHING_THRESHOLD_DEFAULT = Integer.MAX_VALUE;

  /**
     * 与此实例相关联的随机化值，该值应用于键的哈希码，以使哈希冲突更难找到。 如果为0，则禁用备用哈希。
     */
    transient int hashSeed = 0;

    private transient Set<Map.Entry<K,V>> entrySet = null;

    // 判断版本
    private static final long serialVersionUID = 362498820763181265L;
```

## 构造器

```Java
    /**
     * 使用more默认的容量16和负载因子0.75创建HashMap
     */
    public HashMap() {
        this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR);
    }

    /**
     * 使用指定容量和默认的负载因子0.75创建HashMap
     */
    public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    /**
     * 使用指定容量和指定的负载因子创建HashMap
     */
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);

        this.loadFactor = loadFactor;
        threshold = initialCapacity;
        init();
    }

    /**
     * 创建一个大于Map键值对数量的HashMap，
     * 使用默认的负载因子0.75，和足以包含Map键值对数量的容量
     */
    public HashMap(Map<? extends K, ? extends V> m) {
        this(Math.max((int) (m.size() / DEFAULT_LOAD_FACTOR) + 1,
                      DEFAULT_INITIAL_CAPACITY), DEFAULT_LOAD_FACTOR);
        inflateTable(threshold);

        putAllForCreate(m);
    }
```

<div class='tip'>
    <p>
        从构造方法来看，HashMap(int initialCapacity, float loadFactor)这个方法才是主体。接下来就来分析一下这个类。
    </p>
</div>

```Java
    public HashMap(int initialCapacity, float loadFactor) {
        //  容量小于0，抛出异常
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        //  容量大于最大值1<<30，使用最大值当做容量
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        //  负载因子小于等于0或者非数字就抛出异常
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);

        this.loadFactor = loadFactor;
        threshold = initialCapacity;
        //  空方法，用来初始化HashMap，实现在其他类
        init();
    }
```

## get

## put

# jdk1.8

## 变量

## 构造器

## get

## put

# 常见问题
