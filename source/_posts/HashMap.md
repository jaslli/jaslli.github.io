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
        //  空方法，用来初始化HashMap，有些类里就会有其实现
        init();
    }
```

## 数据结构

创建方法讲完了，就讲讲HashMap的数据结构了。jdk1.7的HashMap是数组加链表组成的，数组为主，链表为辅。大概结构如下。

![](https://img.yww52.com/2020/11/2020-11-20/img1.png)

<div class='tip'>
    <p>
        每个链表被称为哈希表的桶，每个节点都存储了一对键值对。
    </p>
</div>

这里就看到，每个节点就是哈希表的最小组成单位了，现在就来看一下这个节点类。jdk1.7的节点类叫`Entry`。

```Java
    static class Entry<K,V> implements Map.Entry<K,V> {
        final K key;
        V value;
        Entry<K,V> next;
        int hash;

        /**
         * 构造器
         */
        Entry(int h, K k, V v, Entry<K,V> n) {
            value = v;
            next = n;
            key = k;
            hash = h;
        }
		//	get和set方法
        public final K getKey() {
            return key;
        }
        public final V getValue() {
            return value;
        }
        public final V setValue(V newValue) {
            V oldValue = value;
            value = newValue;
            return oldValue;
        }
        //	重写equals，
        public final boolean equals(Object o) {
            if (!(o instanceof Map.Entry))
                return false;
            Map.Entry e = (Map.Entry)o;
            Object k1 = getKey();
            Object k2 = e.getKey();
            if (k1 == k2 || (k1 != null && k1.equals(k2))) {
                Object v1 = getValue();
                Object v2 = e.getValue();
                if (v1 == v2 || (v1 != null && v1.equals(v2)))
                    return true;
            }
            return false;
        }
		//	重写hashCode方法
        public final int hashCode() {
            return Objects.hashCode(getKey()) ^ Objects.hashCode(getValue());
        }
		//	重写toString方法
        public final String toString() {
            return getKey() + "=" + getValue();
        }

        /**
         * 在存在key下put，就会用该方法覆盖value值
         */
        void recordAccess(HashMap<K,V> m) {
        }

        /**
         * 删除键值对时就会用这个方法
         */
        void recordRemoval(HashMap<K,V> m) {
        }
    }
```

由此可以看出每个`Entry`都存储了四个值，一对键值对，一个hash，和一个next值。next指向链表的下一个节点，而hash则用来判断该节点放在数组哪一个位置。

## put

创建了哈希表之后，就用put方法来存放键值对，现在就来看看put方法的源码。

```Java
/**
 * 将指定值与指定的键相连，如果指定的键原来有值，就会覆盖掉旧的值
 * 返回与key关联的先前值；如果没有key的映射关系，则返回null 。
 * 返回null可能还表明该映射先前将null与key关联。
 */
public V put(K key, V value) {
    if (table == EMPTY_TABLE) {
        inflateTable(threshold);
    }
    
    if (key == null)
        return putForNullKey(value);
    
    int hash = hash(key);
    int i = indexFor(hash, table.length);
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }

    modCount++;
    addEntry(hash, key, value, i);
    return null;
}
```

put方法很有讲究，现在我们就来一步步解析。

### 第一步

```Java
    if (table == EMPTY_TABLE) {
        inflateTable(threshold);
    }
```

首先就是判断这个哈希表是不是一个空表。如果是就会调用`inflateTable(threshold);`这个语句，不是就进行下一步。我们去看看这个方法。

```Java
    private void inflateTable(int toSize) {
        // 传入容量大小的最小的2的次幂
        int capacity = roundUpToPowerOf2(toSize);
		//	重新计算阈值 threshold = 容量 * 加载因子
        threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1);
        //	用最小的2次幂来创建一个新的数组
        table = new Entry[capacity];
        //	初始化哈希掩码值，将初始化推迟到我们真正需要它之前。
        initHashSeedAsNeeded(capacity);
    }
```

这个类就是用来创建数组的，通过`roundUpToPowerOf2`方法来确定最小的能大于需要长度`toSize`的二次幂，是有点绕，现在去看看这个方法。

```Java
    private static int roundUpToPowerOf2(int number) {
        //	1.如果这个需要的长度大于最大值，就用最大值来创建数组
        //	2.需要的长度小于1就用1当数组的长度，大于1就用highestOneBit确定长度。
        return number >= MAXIMUM_CAPACITY
                ? MAXIMUM_CAPACITY
                : (number > 1) ? Integer.highestOneBit((number - 1) << 1) : 1;
    }
	//	这个类就是怎么创建最小的二次幂的方法
    public static int highestOneBit(int i) {
        // HD, Figure 3-1
        i |= (i >>  1);
        i |= (i >>  2);
        i |= (i >>  4);
        i |= (i >>  8);
        i |= (i >> 16);
        return i - (i >>> 1);
    }
```

> highestOneBit是怎样算出最小的二次幂的，就去看看我另一篇文章好了。

寻找到最小的二次幂之后，重新计算阈值，然后用最小的2次幂来创建一个新的数组，最后用`initHashSeedAsNeeded`来初始化哈希掩码值。

## get

# jdk1.8

## 变量

## 构造器

## get

## put

# 常见问题
