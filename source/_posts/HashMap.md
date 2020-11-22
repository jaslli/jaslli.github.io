---
title: HashMap
date: 2020-11-20
categories:
  - Java
description: HashMap是经常用到的一个集合，很有必要进行深入了解。
cover: https://img.yww52.com/2020/10/2020-10-23top_img.jpg
---

# 简介

HashMap是Map经常使用的一个实现类,也是我们经常用到的一个集合，所以很有必要去了解一下。JDK8相对JDK7优化了不少，结构也改变了，所以这里就分开来学习了。

<div class='tip'>
    <p>
        因为我英语不是特别好，所以看源码时候的文档注释有些是机翻的，所以有些文档注释会看不懂，只能理解一下大概意思了。
    </p>
</div>

# JDK7

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
     * 的迭代器快速失败。（请参见ConcurrentModificationException）。
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

这里就看出，每个节点就是哈希表的最小组成单位了，现在就来看一下这个节点类。jdk1.7的节点类叫`Entry`。

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
        //  get和set方法
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
        //  重写equals
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
        //  重写hashCode方法
        public final int hashCode() {
            return Objects.hashCode(getKey()) ^ Objects.hashCode(getValue());
        }
        //  重写toString方法
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
        //  重新计算阈值 threshold = 容量 * 加载因子
        threshold = (int) Math.min(capacity * loadFactor, MAXIMUM_CAPACITY + 1);
        //  用最小的2次幂来创建一个新的数组
        table = new Entry[capacity];
        //  初始化哈希掩码值，将初始化推迟到我们真正需要它之前。
        initHashSeedAsNeeded(capacity);
    }
```

这个类就是用来创建数组的，通过`roundUpToPowerOf2`方法来确定最小的能大于需要长度`toSize`的二次幂，是有点绕，现在去看看这个方法。

```Java
    private static int roundUpToPowerOf2(int number) {
        //  1.如果这个需要的长度大于最大值，就用最大值来创建数组
        //  2.需要的长度小于1就用1当数组的长度，大于1就用highestOneBit确定长度。
        return number >= MAXIMUM_CAPACITY
                ? MAXIMUM_CAPACITY
                : (number > 1) ? Integer.highestOneBit((number - 1) << 1) : 1;
    }
    //  这个类就是怎么创建最小的二次幂的方法
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

### 第二步

```Java
    if (key == null)
        return putForNullKey(value);
```

判断传入的key是不是null值，如果是就返回`putForNullKey(value)`，不然就下一步。现在来看看这个方法。

```Java
    private V putForNullKey(V value) {
        /**
         *	遍历table[0]的链表，若有key==null，就用新的value覆盖原来的
         *	然后返回被覆盖的value，所以table[0]就只会有一个元素
         */
        for (Entry<K,V> e = table[0]; e != null; e = e.next) {
            if (e.key == null) {
                V oldValue = e.value;
                e.value = value;
                e.recordAccess(this);
                return oldValue;
            }
        }
        modCount++;
       /**
         *	要是没有key==null的键，就调用addEntry方法，将空键和值放入table[0]
         *	第一次table[0]是没有元素的，所以才能到这里添加空键和值
         */
        addEntry(0, null, value, 0);
        return null;
    }
```

### 第三步*

```Java
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
```

到这里就是最重要的一步了，确定插入的位置然后插入。首先就是调用`hash`方法来计算传入的`key`的哈希值。

```Java
    /**
     * 检索对象哈希码，并将补充哈希函数应用于结果哈希，以防止质量差的哈希函数。
     * 这很关键，只有HashMap使用2的幂的哈希表，不然哈希表在低位无差异时会遇到冲突。
     * 注意：空键始终映射到哈希0，因此索引为0。
     */
    final int hash(Object k) {
        int h = hashSeed;
        //	若哈希值不为0而且不是String类型，就返回一个哈希值
        if (0 != h && k instanceof String) {
            return sun.misc.Hashing.stringHash32((String) k);
        }
		// 异或
        h ^= k.hashCode();
        // 此函数可确保在每个位位置仅相差恒定倍数的hashCode具有一定数量的冲突（在默认的加载因子下约为8）。
        h ^= (h >>> 20) ^ (h >>> 12);
        return h ^ (h >>> 7) ^ (h >>> 4);
    }
```

得到哈希值之后，就调用`indexFor`方法来计算出应该插入的位置。

```Java
    /**
     * 返回计算出来的索引
     */
    static int indexFor(int h, int length) {
        // assert Integer.bitCount(length) == 1 : "长度必须为2的非零次幂";
        // h & (length-1)表示hash值与数组长度求余
        // 为什么必须是2的非零次幂，之后还会提到
        return h & (length-1);
    }
```

计算出具体插入的位置之后就开始插入了，这里就是用了一个for循环遍历。

```java
    //	遍历table[i]这个桶里是否这个key值，有就将原来的value覆盖，并返回原来的value
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
	//	没有就将这对键值对加入到表中
    addEntry(hash, key, value, i);
	//	第一次加入到桶就返回null值
    return null;
```

至此`put`的流程就结束了，到这里其实还是有问题。用`indexFor`这个方法来求数组的位置，刚刚也分析了这个方法，就是异或求余，那么就会有以下的问题，hash差一定的倍数，求余出来的位置就会一样，这个就是经常提到的`哈希冲突`了，为了解决哈希冲突这个问题，就引进了链表，这就是为什么哈希表底层是用数组和链表构成的了。现在来看个例子，看看链表是怎么解决哈希冲突的。

![](https://img.yww52.com/2020/11/2020-11-20/img2.png)

假设键值对3计算出来的`i`是3，就会被放到数组的第四个位置，直接放入。

假设键值对4计算出来的`i`是2，就会放到数组的第三个位置，但是这个位置已经有键值对1了，这种情况就会用到链表，`头插`到该链表。

![](https://img.yww52.com/2020/11/2020-11-20/img3.png)

但是这种情况下，就无法通过数组来寻找到键值对4了，所以还会进行位移，最后就会变成这样。

![](https://img.yww52.com/2020/11/2020-11-20/img4.png)

### addEntry

在上面put的第三步不难看到，在一个桶里只要有key相同，就覆盖，没有就使用`addEntry`这个方法加入到桶里。不难看出这个方法发生的情况，数组位置没有元素和发生哈希冲突时就会用到这个方法，现在来看看这个方法。

```Java
    /**
     * 将具有指定键，值和哈希码的Entry添加到指定存储桶
     * 如果有必要，该方法也会负责调整表的大小
     */
    void addEntry(int hash, K key, V value, int bucketIndex) {
        if ((size >= threshold) && (null != table[bucketIndex])) {
            resize(2 * table.length);
            hash = (null != key) ? hash(key) : 0;
            bucketIndex = indexFor(hash, table.length);
        }

        createEntry(hash, key, value, bucketIndex);
    }
```



## get

# JDK8

## 变量

## 构造器

## get

## put

# 常见问题
