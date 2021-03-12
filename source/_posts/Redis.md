---
title: Redis
date: 2021-2-15
categories:
  - SpringBoot
description: 学习Redis的笔记
cover: https://img.yww52.com/2021/2/2021-2-15/top_img.jpg
---


# 什么是NoSQL

先来看看百度百科对NoSQL的描述。

> NoSQL，泛指非关系型的数据库。随着互联网web2.0网站的兴起，传统的关系数据库在处理web2.0网站，特别是超大规模和高并发的SNS类型的web2.0纯动态网站已经显得力不从心，出现了很多难以克服的问题，而非关系型的数据库则由于其本身的特点得到了非常迅速的发展。NoSQL数据库的产生就是为了解决大规模数据集合多重数据种类带来的挑战，特别是大数据应用难题。

NoSQL维基百科称其为`Not Only SQL`,在当今的大数据年代，仅仅是关系型数据库已经不能满足当前一些流量较大的Web应用，所以NoSQL就应运而生，就是用来解决数据量较大的问题。

NoSQL可以分成四个大类。

1. 键值存储数据库

2. 列存储数据库

3. 文档型数据库

4. 图形数据库

这里我就用百度百科上的表格，来简单了解一下这四个分类。

|       分类        |                     Examples举例                      |                         典型应用场景                         |                    数据模型                     |                             优点                             |                             缺点                             |
| :---------------: | :---------------------------------------------------: | :----------------------------------------------------------: | :---------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  键值存储数据库   | Tokyo Cabinet/Tyrant， Redis， Voldemort， Oracle BDB | 内容缓存，主要用于处理大量数据的高访问负载，也用于一些日志系统等等。 | Key 指向 Value 的键值对，通常用hash table来实现 |                          查找速度快                          |        数据无结构化，通常只被当作字符串或者二进制数据        |
|   列存储数据库    |               Cassandra， HBase， Riak                |                       分布式的文件系统                       |       以列簇式存储，将同一列数据存在一起        |         查找速度快，可扩展性强，更容易进行分布式扩展         |                         功能相对局限                         |
|   文档型数据库    |                   CouchDB， MongoDb                   | Web应用（与Key-Value类似，Value是结构化的，不同的是数据库能够了解Value的内容） |    Key-Value对应的键值对，Value为结构化数据     | 数据结构要求不严格，表结构可变，不需要像关系型数据库一样需要预先定义表结构 |            查询性能不高，而且缺乏统一的查询语法。            |
| 图形(Graph)数据库 |           Neo4J， InfoGrid， Infinite Graph           |           社交网络，推荐系统等。专注于构建关系图谱           |                     图结构                      |     利用图结构相关算法。比如最短路径寻址，N度关系查找等      | 很多时候需要对整个图做计算才能得出需要的信息，而且这种结构不太好做分布式的集群方案。 |

这次学习的就是键值存储数据库中的Redis。

# 什么是Redis

Redis是`Remote Dictionary Server `的缩写，翻译为远程字典调用，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

- [官网](https://redis.io/)
- [Github](https://github.com/redis/redis)

# 安装

## windows

windows的只需要下载他们提供的压缩包使用就好了。

![](https://img.yww52.com/2021/2/2021-2-15/img1.png)

打开服务后就能看到服务的信息，默认端口为6379

![](https://img.yww52.com/2021/2/2021-2-15/img2.png)

接下来来确认一下服务是否真的开启了，打开客户端，使用`ping`命令来测试，出现`PONG`表示已经连接到了Redis的服务。

![](https://img.yww52.com/2021/2/2021-2-15/img3.png)

<div class='tip'><p>
windows的版本活跃度很低，而且官网也不推荐使用windows，所以还是尽量使用Linux，之后的使用我也是使用Linux来测试。
</p></div>

## Linux

去到redis的github就能下载到压缩包使用。

因为Redis是使用C/C++写的，所以要想使用，还是需要先安装一下C/C++的环境。

```bash
# 安装环境
	yum install gcc-c++
# 配置
	make
	make install
```

> 要是make命令时出现了很多的error，大概率就是因为redis6版本是需要gcc版本是5以上的才行，所以需要先升级gcc的版本，这里是升级到了9。

```bash
    yum -y install centos-release-scl
    yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils 
    scl enable devtoolset-9 bash
# scl命令是临时启动，长期使用就需要配置环境
	echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile
```

Redis默认会安装到`/usr/local/bin`的目录里。

Redis不是默认启动的，为了方便学习，要设置成默认启动的，所以去修改`redis.conf`这个文件。

```conf
# 将这个选项设置为yes,默认为no	
	daemonize yes
```

启动Redis的服务。

```bash
# 以哪个配置文件来启动redis的服务	
	redis-server [conf的路径]
# 打开redis的客户端，连接6379端口
	redis-cli -p 6379
# 出现PONG表示连通
	ping
```

关闭Redis的服务

```bash
# 在客户端连接6379端口中
	SHUTDOWN
# 退出客户端
	exit
```

# 性能测试

Redis的目录下还会有一个命令`redis-benchmark`。

这个命令是官方自带的性能测试的命令，用来测试Redis的一些基础命令读写的速度，以下是命令的参数。

| 参数选项 |                    描述                    |  默认值   |
| :------: | :----------------------------------------: | :-------: |
|    -h    |              指定服务器主机名              | 127.0.0.1 |
|    -p    |               指定服务器端口               |   6379    |
|    -s    |             指定服务器 socket              |           |
|    -c    |               指定并发连接数               |    50     |
|    -n    |                 指定请求数                 |   10000   |
|    -d    |   以字节的形式指定 SET/GET 值的数据大小    |     2     |
|    -k    |          1=keep alive 0=reconnect          |     1     |
|    -r    | SET/GET/INCR 使用随机 key, SADD 使用随机值 |           |
|    -P    |         通过管道传输 <numreq> 请求         |     1     |
|    -q    |    强制退出 redis。仅显示 query/sec 值     |           |
|  --csv   |              以 CSV 格式输出               |           |
|    -l    |           生成循环，永久执行测试           |           |
|    -t    |       仅运行以逗号分隔的测试命令列表       |           |
|    -I    |  Idle 模式。仅打开 N 个 idle 连接并等待。  |           |

# 数据类型

Redis支持的数据类型有很多，官网也写的很清楚了。

> Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.

## String(字符串)

<div class = 'tip'><p>
   String一般使用是用来计数，比如用户的访问次数，热点文章的点击数，转发数等。
</p></div>

```bash
# 值为一个字符串

# 设置键值对
	svet [key] [value]
# 获取值
	get [key]
# 查看所有的键值对
	keys *
# 切换数据库（redis默认16个数据库，从0开始）
	select [index]
# 清空数据库
	flushdb	 # 当前数据库
	flushall # 所有的数据库 
# 判断键值对是否存在
	exists [key]
# 往值追加字符串
	append [key] [value]
# 获取字符串的长度
	strlen [key]
# 自增,注意该字符串是要是数字
	incr [key]	# 步长为1
	incrby [key] [length]
# 自减
	decr [key]
	decrby [key] [length]
# 获取区间的值
	getrange [key] [index1] [index2]
# 替换值,从第几个开始替换值
	setrange [key] [index] [value]
# 给给定键设置过期时间
	expire [key] [秒]
# 创建一个键值对并设置过期时间
	setex [key] [秒] [value]
# 查看是否过期，负数表示已过期的时间
	ttl [key]
#  如果不存在该键就设置键值对
	setnx [key] [value]
# 批量创建键值对
	mset [key1] [value1] [key2] [value3] ...
# 批量获取值
	mget [key1] [key2] ...
# 批量创建键值对,原子操作，若是有一个键已经存在，那就全部都会创建失败
	msetnx [key1] [value1] [key2] [value3] ...
# 先获取键值对在创建键值对
	getset [key] [value]
```

## List(列表)

<div class = 'tip'><p>
   List一般用来发布与订阅或者说消息队列、慢查询等场景。
</p></div>

```bash
# 值为类似一个双向的链表

# lpush表示从头部增加值，rpush从韦部增加值
	lpush [key] [value]
	rpush [key] [value]
# 获取列表中的值,从index1到index2区间获取值
	lrange [key] [index1] [index2]
	lrange [key] 0 -1 # 表示查询列表所有值
# lpop移除第一个值，rpop移除最后一个值
	lpop [key]
	rpop [key]
# 按下标获取值
	lindex [key] [index]
# 查询键的长度，即有多少个值
	llen [key]
# 移除指定的值
	lrem [key] [个数] [value]
# 截取列表,即修改列表中的值
	ltrim [key] [index1] [index2]
# 移除列表最后一个值，移动到另一个列表中
	rpoplpush [key1] [value] [key2]
# 替换列表中指定的值
	lset [key] [index] [value]
# 判断列表是否存在
	exists [key]
# 插入值
# 在列表的value1值的前面插入一个value2的值
	linsert [key] before [value1] [value2]
# 在列表的value1值的后面插入一个value2的值
	linsert [key] after [value1] [value2]	
```

## Set(集合)

<div class = 'tip'><p>
   Set的使用场景一般为，需要存放的数据不能重复以及需要获取多个数据源交集和并集等场景
</p></div>

```bash
# set不能重复添加相同的元素，类似于Java的HashSet，是一种无序集合

# 往集合中添加值
	sadd [key] [value]
# 查看集合的所有值
	smembers [key]
# 判断集合是否存在该元素
	sismember [key] [value]
# 查看集合中元素的个数
	scard [key]
# 移除指定元素
	srem [key] [value]
# 随机抽选元素
	srandmember [key] # 默认一个
	srandmember [key] [length]
# 随机移除一个元素
	spop [key]
# 将一个元素移动到另一个集合
	smove [key1] [value] [key2]
# 差集
	sdiff [key1] [key2]
# 交集
	sinter [key1] [key2]
# 并集
	sunion [key1] [key2]
```

## Hash(哈希)

<div class = 'tip'><p>
   Hash一般是用来进行对象的存储
</p></div>

``` bash
# hash的结构类似于Java8时候的HashMap

# 设置一个键值对
	hset [key] [key1] [value1]
# 获取值
	hget [key] [key1]
# 批量设置键值对
	hmset [key] [key1] [value1] [key2] [value2]...
# 批量获取值
	hmget [key] [key1] [key2]...
# 获取全部键值对	
	hgetall [key]
# 删除指定键值对
	hdel [key] [key1]
# 查看键值对的个数
	hlen [key]
# 判断一个键值对是否存在
	hexists [key] [key1]
# 获取所有的键
	hkeys [key]
# 获取所有的值
	hvals [key]
# 不存在可以创建
	hsetnx [key] [key1] [value1]
```

## Zset(有序的集合)

<div class = 'tip'><p>
   Zset一般使用在那些需要排序的场景。比如礼物排行榜，弹幕消息等。
</p></div>

```bash
# 在Set的基础上增加了权重参数，从而可以通过权重来进行排序

# 在指定位置增加值
	zadd [key] [index] [value]
	zadd [key] [index1] [value1] [index2] [value2]..
# 有顺序地显示区间内的值，可以说是增序排序 
	zrangebyscore [key] [min] [max]
	zrangebyscore [key] -inf +inf 		# 表示按增序顺序显示所有的值
# 有顺序地显示区间内的值，可以说是降序排序
	zrevrange [key] 0 -1	# 表示降序顺序显示所有的值
# 获取有序集合的个数
	zcrad [key]
# 获取指定区间的元素的个数
	zount [key] [index1] [index2]
```

## geospatial(地理位置)

```bash
# 用来表示地理位置，经纬度，实现底层就是Zset，所以一些命令也适用

# 添加一个地理位置
	geoadd [key] [经度] [纬度] [value]
# 获取指定值的经纬度
	geopos [key] [value]
# 获取两个位置之间的距离
	geodist [key] [value1] [value2] [单位]
# 指定某个位置和某个半径，返回半径内的值
	georadius [key] [经度] [纬度] [半径] [单位]
	georadius [key] [经度] [纬度] [半径] [单位] withdist	# 还会显示到中心位置的距离
	georadius [key] [经度] [纬度] [半径] [单位] withcoord	# 会显示值当前的经纬度
# 指定一个元素和某个半径，返回离这个元素位置半径内的值
	georadiusbymember [key] [value] [半径] [单位]
# 将指定位置经纬度转换为字符串
	geohash [key] [value]
```

## Hyperloglog(基数统计)

```bash
# 基数，表示不重复元素的个数，存在误差

# 添加键值对,值为一个集合
	pfadd [key] [value1] [value2] [value3]...
# 合并集合,不会重复
	pfmerge [key] [key1] [key2]
# 统计基数数量
	pfcount [key]
```

## Bitmaps(位图)

<div class = 'tip'><p>
   一般用来用户签到，统计活跃的用户和用户在线情况。
</p></div>

```bash
# 使用二进制来表示状态，用于那些只有两个状态

# 添加键值对
	setbit [key] [index] [1或0]
# 获取值的状态
	getbit [key] [index]
# 统计1的个数
	bitcount sign
```

## 总结

对Redis的数据类型进行一个小的总结。

Redis的数据类型其实大概分为两类。

- 五大数据类型

    1. String
    2. Set
    3. Hash
    4. List
    5. Zset

- 三个特殊的数据类型
  1. geospatial
  2. hyperloglog
  3. bitmaps

# 事务

- Redis的事务其实就是一组命令的队列
- Redis事务没有隔离级别的概念
- 一次性，顺序性，排他性
- Redis的单条命令存在原子性，但是事务是多条命令的集合，所以事务不具备原子性
- Redis的事务分为三个阶段
  1. 开启事务
  2. 命令入队
  3. 执行事务

- 在开启事务后，输入的命令会进入队列，但是没有直接执行，要等所有命令入队后，发出执行命令才会一次性，依次执行

```bash
# 开启事务
	multi

# 输入multi命令出现ok，表示开启事务，之后输入命令，命令会入队

# 执行队列中的命令
	exec
	
# 要是想放弃执行事务，可以直接放弃事务
	discard

```

<div class = 'tip warning'><p>
    1. 若是事务中存在错误的命令，那么整个事务的命令都不会被执行</br>
	2. 若是事务中只是命令语法有问题，那么该命令会抛出异常，但是其他命令会正常执行
</p></div>

# 监视

首先了解悲观锁和乐观锁这两个概念。

- 悲观锁

  悲观锁，顾名思义，什么时候都很悲观，每次访问公共数据，都会觉得别人会进行修改，所以每次获取该数据的时候，都会对数据加锁

- 乐观锁

  乐观锁，顾名思义，什么时候都很乐观，每次访问公共数据，都觉得别人不会进行修改，所以每次都不会去上锁，只有在更新该数据后会判断一下使用期间其他线程有没有修改该数据。可以使用版本号来实现。每次更新数据后，判断该数据的版本号是否发生变更，发生了变更，就会导致修改失效，若是没有就会修改成功并修改版本号。

```bash
# Redis的监控就是使用了乐观锁的操作
	watch [key]
	multi ... exec
# 使用watch来监视键值，一组事务执行后查看数据是否变更
# 若是已经变更，该事务就会失效，即执行失败
# 失败后就需要放弃监视,然后重新监视，执行事务，保证上锁的值是最新的值
	unwatch [key]
	watch [key]
```

# Jedis

Jedis是官网推荐的Java连接工具，类似就是在Java和Redis中增加一层辅助层，辅助你用Java使用Redis。

简单的测试一下使用。

首先创建一个maven项目，导入相关的依赖。

```xml
    <!-- Jedis -->
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>3.5.1</version>
    </dependency>
```

连接使用Redis

```Java
package com.yww;
import redis.clients.jedis.Jedis;

public class config {
    public static void main(String[] args) {
        // 创建Jedis对象，连接Redis,jedis对象相当于客户端
        // Redis命令就是使用该对象的方法
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        // 测试连接
        System.out.println(jedis.ping());
        // 关闭连接
        jedis.close();
    }
}
```

事务的使用。

```Java
package com.yww;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

public class config {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        
        // 创建事务
        Transaction multi = jedis.multi();
        try{
            
            // 组成事务的命令 
            
            // 执行事务
            multi.exec();
        } catch(Exception e) {
            // 放弃事务
            multi.discard();
            e.printStackTrace();
        } finally {
            // 关闭连接
            jedis.close();
        }
    }
}
```

# 整合SpringBoot

整合就先创建一个SpringBoot的项目，导入SpringData项目的redis依赖。

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
            <version>2.4.2</version>
        </dependency>
```

<div class='tip'><p>
    在比较新的SpringBoot版本中，放弃了Jedis对redis的直接连接，因为多个线程会出现线程不安全的情况，所以官方已经替换成了lettuce。</br>
	lettuce采用netty，实例可以在多个线程中进行共享，减少线程数量，不存在线程不安全的情况。
</p></div>

在配置文件中，配置Redis的连接。

```properties
# 配置Redis
spring.redis.host=127.0.0.1
spring.redis.port=6379
```

简单的测试。

```Java
package com.yww;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
class RedisTestApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void contextLoads() {
        /*
        *       数据类型的操作
        *   1. opsForValue  操作字符串
        *   2. opsForList   操作list
        *   3. opsForSet    操作set
        *   4. opsForHash   操作hash
        *   5. opsForZSet   操作Zest
        *   6. opsForGeo    操作geospatial
        *   7. opsForHyperLogLog    操作Hyperloglog
        *
        */
        redisTemplate.opsForValue().set("name","yww");
        System.out.println(redisTemplate.opsForValue().get("name"));
        
        // 获取Redis的连接对象
        RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
        connection.flushDb();
    }

}
```

上述的测试其实是没有经过序列化的，这是一个很不安全的操作，特别是传输对象的时候，没有序列化就会报错。

先简单的创建一个对象来测试。

```Java
package com.yww;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@NoArgsConstructor
@Data
// 实现Serializable序列化
public class User implements Serializable {
    private String name;
    private int age;
}
```

```Java
package com.yww;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
class RedisTestApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void contextLoads() throws JsonProcessingException {
        User user = new User("yww", 20);
        //  转换为JSON字符串，传输的对象要经过序列化，不然会报错
        String json = new ObjectMapper().writeValueAsString(user);
        
        redisTemplate.opsForValue().set("user",json);
        System.out.println(redisTemplate.opsForValue().get("user"));
        
    }
}
```

<div class='tip'><p>
    默认是会使用jdk的序列化方式，在后期使用会出现一些麻烦，所以开发中一般会自己定义RedisTemplate的序列化方式，所以就需要自己定义一个RedisTemplate来使用。
</p></div>



```Java
package com.yww.config;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.net.UnknownHostException;

@Configuration
public class RedisConfig {

    // 自定义RedisTemplate
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 连接工厂
        template.setConnectionFactory(redisConnectionFactory);
        // JSON序列化的配置
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

        // 配置RedisTemplate序列化方式
        // String的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value采用Jackson的JSON序列化
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value采用Jackson的JSON序列化
        template.setHashValueSerializer(jackson2JsonRedisSerializer);

        template.afterPropertiesSet();
        
        return template;
    }

}
```

测试。

```Java
package com.yww;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
class RedisTestApplicationTests {

    // 注意要注入的对象是配置类的对象，要是使用了原生的就配置无效了
    @Autowired
    @Qualifier("redisTemplate")
    private RedisTemplate redisTemplate;

    @Test
    void contextLoads() throws JsonProcessingException {
        User user = new User("yww", 20);
        redisTemplate.opsForValue().set("user",json);
        System.out.println(redisTemplate.opsForValue().get("user"));
    }

}
```

每次使用redisTemplate都要确定类型，所以一般都会对操作进行封装，所以我们使用一个封装的工具类。

```Java
package com.yww.utils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * @ClassName RedisUtil
 * @Descriprtion Redis操作的封装类
 * @Author yww
 * @Date 2021/2/16 5:05
 * @Version 1.0
 **/

@Component
public final class RedisUtil {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**********************  common  *****************************/
    /**
     * 为键值对设置缓存失效时间
     * @param key  键
     * @param time 时间(秒)
     * @return 返回true表示设置成功
     */
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据key 获取缓存过期时间
     * @param key 键 不能为null
     * @return 缓存过期时间(秒)
     */
    public long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }


    /**
     * 判断key是否存在
     * @param key 键
     * @return 返回true表示存在
     */
    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 删除缓存
     * @param key 可以传一个值 或多个
     */
    @SuppressWarnings("unchecked")
    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            } else {
                redisTemplate.delete(CollectionUtils.arrayToList(key));
            }
        }
    }


    /**********************  String  *****************************/

    /**
     * 普通缓存获取
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存放入
     * @param key   键
     * @param value 值
     * @return true成功 false失败
     */

    public boolean set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 普通缓存放入并设置时间
     * @param key   键
     * @param value 值
     * @param time  时间(秒) time要大于0 如果time小于等于0 将设置无限期
     * @return true成功 false 失败
     */

    public boolean set(String key, Object value, long time) {
        try {
            if (time > 0) {
                redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
            } else {
                set(key, value);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 递增
     * @param key   键
     * @param delta 要增加几(大于0)
     */
    public long incr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递增因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, delta);
    }


    /**
     * 递减
     * @param key   键
     * @param delta 要减少几(小于0)
     */
    public long decr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递减因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, -delta);
    }


    /**********************  Map  *****************************/

    /**
     * HashGet
     * @param key  键 不能为null
     * @param item 项 不能为null
     */
    public Object hget(String key, String item) {
        return redisTemplate.opsForHash().get(key, item);
    }

    /**
     * 获取hashKey对应的所有键值对
     * @param key 键
     * @return 对应的多个键值
     */
    public Map<Object, Object> hmget(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * HashSet
     * @param key 键
     * @param map 对应多个键值
     */
    public boolean hmset(String key, Map<String, Object> map) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * HashSet 并设置时间
     * @param key  键
     * @param map  对应多个键值
     * @param time 时间(秒)
     * @return true成功 false失败
     */
    public boolean hmset(String key, Map<String, Object> map, long time) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     *
     * @param key   键
     * @param item  项
     * @param value 值
     * @param time  时间(秒) 注意:如果已存在的hash表有时间,这里将会替换原有的时间
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value, long time) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 删除hash表中的值
     *
     * @param key  键 不能为null
     * @param item 项 可以使多个 不能为null
     */
    public void hdel(String key, Object... item) {
        redisTemplate.opsForHash().delete(key, item);
    }


    /**
     * 判断hash表中是否有该项的值
     *
     * @param key  键 不能为null
     * @param item 项 不能为null
     * @return true 存在 false不存在
     */
    public boolean hHasKey(String key, String item) {
        return redisTemplate.opsForHash().hasKey(key, item);
    }


    /**
     * hash递增 如果不存在,就会创建一个 并把新增后的值返回
     *
     * @param key  键
     * @param item 项
     * @param by   要增加几(大于0)
     */
    public double hincr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, by);
    }


    /**
     * hash递减
     *
     * @param key  键
     * @param item 项
     * @param by   要减少记(小于0)
     */
    public double hdecr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, -by);
    }


    /**********************  Set  *****************************/

    /**
     * 根据key获取Set中的所有值
     * @param key 键
     */
    public Set<Object> sGet(String key) {
        try {
            return redisTemplate.opsForSet().members(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 根据value从一个set中查询,是否存在
     *
     * @param key   键
     * @param value 值
     * @return true 存在 false不存在
     */
    public boolean sHasKey(String key, Object value) {
        try {
            return redisTemplate.opsForSet().isMember(key, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 将数据放入set缓存
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSet(String key, Object... values) {
        try {
            return redisTemplate.opsForSet().add(key, values);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 将set数据放入缓存
     *
     * @param key    键
     * @param time   时间(秒)
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSetAndTime(String key, long time, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().add(key, values);
            if (time > 0) {
                expire(key, time);
            }
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 获取set缓存的长度
     *
     * @param key 键
     */
    public long sGetSetSize(String key) {
        try {
            return redisTemplate.opsForSet().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 移除值为value的
     *
     * @param key    键
     * @param values 值 可以是多个
     * @return 移除的个数
     */

    public long setRemove(String key, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().remove(key, values);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**********************  List  *****************************/

    /**
     * 获取list缓存的内容
     *
     * @param key   键
     * @param start 开始
     * @param end   结束 0 到 -1代表所有值
     */
    public List<Object> lGet(String key, long start, long end) {
        try {
            return redisTemplate.opsForList().range(key, start, end);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 获取list缓存的长度
     *
     * @param key 键 不能为null
     */
    public long lGetListSize(String key) {
        try {
            return redisTemplate.opsForList().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }


    /**
     * 通过索引 获取list中的值
     *
     * @param key   键
     * @param index 索引 index>=0时， 0 表头，1 第二个元素，依次类推；index<0时，-1，表尾，-2倒数第二个元素，依次类推
     */
    public Object lGetIndex(String key, long index) {
        try {
            return redisTemplate.opsForList().index(key, index);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     */
    public boolean lSet(String key, Object value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     */
    public boolean lSet(String key, Object value, long time) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @return true成功 false失败
     */
    public boolean lSet(String key, List<Object> value) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }


    /**
     * 将list放入缓存
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     * @return true成功 false失败
     */
    public boolean lSet(String key, List<Object> value, long time) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 根据索引修改list中的某条数据
     *
     * @param key   键
     * @param index 索引
     * @param value 值
     * @return true成功 false失败
     */

    public boolean lUpdateIndex(String key, long index, Object value) {
        try {
            redisTemplate.opsForList().set(key, index, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 移除N个值为value
     *
     * @param key   键
     * @param count 移除多少个
     * @param value 值
     * @return 移除的个数
     */

    public long lRemove(String key, long count, Object value) {
        try {
            Long remove = redisTemplate.opsForList().remove(key, count, value);
            return remove;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }

    }

}
```

测试使用。

```Java
package com.yww;

import com.yww.utils.RedisUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class RedisTestApplicationTests {

    @Autowired
    private RedisUtil redisUtil;

    @Test
    public void contextLoads() {
        redisUtil.set("name", "yww");
        System.out.println(redisUtil.get("name"));
    }

}
```

# 持久化

存储在内存中的数据，一旦机器出现问题，那么内存中的数据就会丢失，所以为了尽量避免这个问题，Redis提供了两种持久化的方法，接下来来了解一下这两种持久化的方式。

## RDB

RDB持久化机制是将某个时刻的数据快照写入磁盘，也就是将某个时刻的数据保存下来，等到Redis服务启动，就会自动加载这个快照文件进行数据恢复。

### 手动触发

- save命令（不建议使用）

  save是一个同步的命令，也就是说执行save命令，会让Redis的服务器发生阻塞，直到RDB持久化完成，其他命令才能正常进行。

  ![](https://img.yww52.com/2021/2/2021-2-15/img4.png)

- bgsave命令

  bgsave是一个异步的命令，执行bgsave命令，Redis会`fork`一个子进程来进行RDB持久化，只有fork时才会阻塞，其他时间Redis正常运行。

  ![](https://img.yww52.com/2021/2/2021-2-15/img5.png)

### 自动触发

![](https://img.yww52.com/2021/2/2021-2-15/img6.png)

- 满足配置文件中save配置的文件，默认配置如下，可以自己配置

  ```bash
  # 当900秒内至少有1个键值对发生变动，触发持久化
  save 900 1
  # 当300秒内至少有10个键值对发生变动，触发持久化
  save 300 10
  # 当60秒内至少有10000个键值对发生变动，触发持久化
  save 60 10000
  ```

- 执行`flushall`命令清空数据库时，触发持久化

- 执行`shutdown`命令等手段退出Redis时，触发持久化

### RDB文件

从配置文件可以看到配置文件的默认路径和默认名。

```bash
# rdb文件的默认文件名
dbfilename dump.rdb

# rdb文件保存的目录
dir ./
```

## AOF

AOF持久化全称`Append Only File`，当我们执行的改变数据的操作时就会将该命令追加到一个AOF文件的末尾，当Redis服务重新启动的时候，就会重新执行AOF文件内的命令，用来同步数据。

<div class='tip'><p>
    AOF不是默认的持久化方式，故默认关闭的，需要去配置文件手动开启。
</p></div>



![](https://img.yww52.com/2021/2/2021-2-15/img7.png)

### AOF触发策略

```bash
# appendfsync always	
appendfsync everysec
# appendfsync no
```

- always

  每次有新的修改数据的命令，就会将缓冲区内的命令同步追加到AOF文件，十分安全，但是效率低

- evertsec

  默认的策略，每秒将缓冲区内的命令同步追加到AOF文件，但是无法做到实时持久化，还是会可能丢失一秒的数据

- no

  交给操作系统来决定什么时候去同步追加数据

### 重写机制

当命令不断被追加到AOF文件内，文件会越来越大，这对使用来说很不好，所以Redis提供了一个AOF的重写机制来解决这个问题，将AOF文件内的命令优化，重写为可以恢复到当前数据的最小指令集，从而减少文件的大小，达到压缩AOF文件的目的。

触发流程如下。

![](https://img.yww52.com/2021/2/2021-2-15/img8.png)

### 手动触发

手动输入`bgrewriteaof`命令触发重写机制。

### 自动触发

自动触发就需要自行修改配置文件内AOF重写的配置。

```bash
# 重写触发条件
# 当AOF文件大于64mb而且比上一次重写的文件体积大了至少一倍，就会AOF重写
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```



## 持久化流程

![](https://img.yww52.com/2021/2/2021-2-15/img9.png)



# 过期Key

## 为什么要设置过期Key

之前有提到过设置过期时间，那么就会有一个问题，为什么我们要多此一举去设置一个过期时间呢？

简而言之那就是，内存有限。

如果所有的Key都存在内存，数据量一大就会内存溢出了。

还有一个原因是用户希望存一个有过期时间的Key，就比如在一些场景下，过期Key就会显示很方便。Token的状态登陆或者是验证码的使用，都可以在Redis存储一个过期时间从而达到过期了就无法使用的目的。

不适用过期时间又想要实现这个功能，那就只能查询数据库获得记录，然后在判断是否过期，那也会有点麻烦。

## 如何判断Key过期

Redis 通过一个叫做过期字典（可以看作是hash表）来保存数据过期的时间。过期字典的键指向Redis数据库中的某个key(键)，过期字典的值是一个`long long`类型的整数，这个整数保存了key所指向的数据库键的过期时间（毫秒精度的UNIX时间戳）。

## 过期Key的删除策略

1. 定期删除

   每隔一段时间就会抽取一批Key来进行过期检查，过期了就进行删除。

2. 惰性删除

   每次从数据库获取Key时会判断该Key是否过期，要是过期了就会进行删除，没有过期就会返回数据给用户。

3. 定时删除

   在设置key的过期时间的同时，为该key创建一个定时器，让定时器在key的过期时间来临时，对key进行删除。

Redis默认使用的就是定期删除和惰性删除的配合。

# Redis的内存淘汰策略

刚才有提到过过期Key，从Redis的过期Key删除策略中可以看出这些删除策略并不能将每一个过期的Key都删掉，所以在数据量大的时候又加上过期的Key，就会出现内存满了的情况，那这种时候就需要淘汰掉一些内存数据了。

Redis提供有8种淘汰的策略。

1. **volatile-lru**：淘汰掉设置过期时间的数据集里最近最少使用的数据
2. **volatile-ttl**：淘汰掉设置过期时间的数据集里的将要过期的数据
3. **volatile-random**：随机选择设置过期时间的数据集里的数据来进行淘汰
4. **volatile-lfu**：淘汰掉设置过期时间的数据集里最不经常使用的数据
5. **allkeys-lru**：移除空间里最近最少使用的 key（这个是最常用的）
6. **allkeys-random**：从空间中任意选择数据来进行淘汰
7. **allkeys-lfu**：移除空间里最不经常使用的数据
8. **no-eviction**：不允许淘汰数据，当内存满了之后在进行新数据的写入就会报错





# 发布订阅

发布订阅是一种消息通信模式。

发送者发送消息，订阅者接受发送者的消息。

接下来进行一个简单的测试。

1. 订阅一个频道，这里订阅`yww`这个频道

   ```bash
   127.0.0.1:6379> subscribe yww
   Reading messages... (press Ctrl-C to quit)
   1) "subscribe"
   2) "yww"
   3) (integer) 1
   ```

2. 在打开一个Redis的客户端，然后往`yww`频道发送两条消息

   ```bash
   127.0.0.1:6379> publish yww "Hello Redis"
   (integer) 1
   127.0.0.1:6379> publish yww "Hello World"
   (integer) 1
   127.0.0.1:6379> 
   ```

3. 在订阅频道的订阅者的客户端就能接收到频道的消息了

   ```bash
   127.0.0.1:6379> subscribe yww
   Reading messages... (press Ctrl-C to quit)
   1) "subscribe"
   2) "yww"
   3) (integer) 1
   1) "message"
   2) "yww"
   3) "Hello Redis"
   1) "message"
   2) "yww"
   3) "Hello World"
   ```

以下是一些常用的API

```bash
# 订阅一个或多个符和给定模式的频道
psubscribe pattern[pattern...]

# 退订一个或多个给定模式的频道
punsubscribe [pattern[pattern]]

# 查看订阅与发布系统状态
pubsub subcommand [argument[argument...]]

# 将消息发送到指定的频道
publish channel message

# 订阅一个或多个频道的信息
subscribe channel[channel ...]

# 退订一个或多个频道的信息
unsubscribe [channel[channel...]]
```

# 主从复制，读写分离

当数据量过大的时候，服务器的压力就会提高，为了解决这个问题，Redis提供了`主从复制，读写分离`的方案，因为大部分的压力是读操作，所以可以搭建一个Redis集群（最低要求三台，一主二从)，主节点负责写操作，从节点用来提供读的服务，这样就能减少服务器的压力了。

![](https://img.yww52.com/2021/2/2021-2-15/img10.png)

当然还可以有以下这种情况

![](https://img.yww52.com/2021/2/2021-2-15/img11.png)

节点是既可以当主节点，又可以当子节点的。

Redis的主从复制表示只有主节点能进行写操作，从节点是不能进行写操作的，只能进行读操作，主节点的数据会同步到子节点，达到整个集群的数据一致。

## 同步机制

上边说到的同步方式根据是否是全量来分为`全量同步`和`增量同步`。

- 全量同步

  全量同步的数据复制一般只会发生在`slave从节点`连接主节点的时候，这时从节点会将主节点中的所有数据都复制到从节点中，从而从节点连接主节点后数据通同步。

  期间发生的具体步骤如下。

  1. 从节点连接主节点后，向主节点发出`SYNC`命令
  2. 主节点收到`SYNC`命令后，开始执行`BGSAVE`生成RDB文件，因为是异步的操作，所以主节点继续处理命令，并将被执行的命令放入缓冲区
  3. 生成RDB文件后，就会向从节点发送快照文件
  4. 从节点收到主节点发送的RDB文件后，就会放弃原来存在的旧数据，然后载入RDB文件同步数据
  5. 触发增量同步

  这样主节点的数据旧全量同步复制到了从节点上。

- 增量同步

  除了首次从节点的全量同步，一般数据的同步都是使用增量同步的方式

  1. 主节点将缓冲区中的命令发送给从节点
  2. 从节点接收到命令请求，就会执行这些命令，完成部分写命令带来的数据同步

## 模拟Redis集群

这里使用同一个服务器，不同端口搭建的Redis集群进行学习。

当然你有多台服务器可以使用不同服务器来搭建集群来学习。

再不然可以直接开三个容器来搭建Redis集群来学习。

首先是了解一个基本的命令。

```bash
# 查看当前服务的信息
info replication

127.0.0.1:6379> info replication
# Replication
role:master				# 角色为主节点，没有配置，默认每个服务都是主机
connected_slaves:0		# 连接从节点的个数
master_replid:fb2dce24da3d78a04f01a6f55abdd48e1751dda0
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```

创建三个配置文件，用来开启三个服务。

```bash
redis6379.conf  redis6380.conf  redis6381.conf
```

然后配置这三个文件。

```bash
# redis6379.conf	主节点的配置
logfile "6379log.log"
dbfilename dump6379.rdb

# redis6380.conf
port 6380
pidfile /var/run/redis_6380.pid
logfile "6380log.log"
dbfilename dump80.rdb

# redis6381.conf
port 6381
pidfile /var/run/redis_6381.pid
logfile "6381log.log
dbfilename dump6381.rdb

# 开启redis集群服务
# redis-server ./myconf/redis6379.conf 
# redis-server ./myconf/redis6380.conf 
# redis-server ./myconf/redis6381.conf 
# ps -ef |grep redis
root     19536 19481  0 20:19 pts/1    00:00:00 redis-cli
root     32040     1  0 22:30 ?        00:00:00 redis-server 127.0.0.1:6379
root     32052     1  0 22:30 ?        00:00:00 redis-server 127.0.0.1:6380
root     32062     1  0 22:30 ?        00:00:00 redis-server 127.0.0.1:6381
root     32106 30264  0 22:30 pts/2    00:00:00 grep --color=auto redis

# 开启三个客户端，这里使用主节点的客户端演示，子节点客户端另开窗口
# redis-cli -p 6379
```

然后是建立主从联系，这里使用6379的服务当成主节点，建立联系有两种方法。

- 在从节点中使用命令连接主机，这是简单的连接，要是从节点服务关闭了，之后重启旧连接不到主节点了，可以说是一次性的

  ```bash
  	SLAVEOF [host] [port]
  ```

- 使用配置设置，这种情况，从节点服务重启后就会继续连接主机

  ```bash
  ################################# REPLICATION #################################
  
  # 在这下面配置主节点服务地址就好了，样例已经给出
  # replicaof <masterip> <masterport>
  
  # 要是主节点服务有密码可以在这里配置
  # masterauth <master-password>
  ```

这里连接6379当成主节点。

```bash
# 配置6380从节点
127.0.0.1:6380> SLAVEOF 127.0.0.1 6379
OK
127.0.0.1:6380> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:3
master_sync_in_progress:0
slave_repl_offset:28
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:8ed59f23d41ec553e33eae6b5fb13cfd1d807e80
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:28
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:28


# 配置6381从节点
127.0.0.1:6381> SLAVEOF 127.0.0.1 6379
OK
127.0.0.1:6381> info replication
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:9
master_sync_in_progress:0
slave_repl_offset:42
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:8ed59f23d41ec553e33eae6b5fb13cfd1d807e80
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:42
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:15
repl_backlog_histlen:28 


# 查看6379主节点信息
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=127.0.0.1,port=6380,state=online,offset=70,lag=1
slave1:ip=127.0.0.1,port=6381,state=online,offset=70,lag=1
master_replid:8ed59f23d41ec553e33eae6b5fb13cfd1d807e80
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:70
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:70

```

然后在主机设置的数据，可以在从机中获取数据。

## 哨兵模式（Sentinel）

通过配置连接的子节点出现故障，重启服务后，因为配置连接的缘故那还是子节点，所以子节点出现故障的情况很简单。

<div class='tip'><p>
    要是这个子节点有子节点，那么主机故障后，子节点的role依旧是salve，所以还是不能进行写操作。
</p></div>

接下来重点了解一下主节点出现故障的情况。

当主节点出现故障后，它的子节点身份是不会变的，当主节点的服务重新启动后，集群依旧存在。

当我们不清楚主节点何时恢复，总不能一直不进行写操作，所以就需要重新推出一个主节点。

```bash
# 令从节点恢复master
SLAVEOF no one
# 然后在配置其他节点连接至该节点
```

 这是手动配置主节点，这其实还是挺麻烦的，所以为了解决这个问题，Redis从2.8的版本后就提供了`哨兵模式`这个方案。

---

哨兵模式其实就是自动推选主节点的一种方案。

先来简单了解一下哨兵模式。

哨兵是一个独立的进程，在Redis的命令中也能看到它`redis-sentinel`。

该进程通过向各个节点发送命令，通过节点返回的信息来监控节点的使用情况。

![](https://img.yww52.com/2021/2/2021-2-15/img12.png)

当主节点宕机了，哨兵向主节点发送命令却得不到返回信息，过段时间哨兵确认主节点宕机后，就会随机给从节点随机投票，获得投票的节点就会当选为主节点，然后通过发布订阅模式通知其他的从节点修改配置，让它们切换主节点对象，从而实现集群正常服务。

那要是哨兵宕机了怎么办呢？这样的设置还是会出现问题。所以哨兵不能只有一台，哨兵也要形成一个集群（最好三个起步），于是最终的解决方案就如下图。

![](https://img.yww52.com/2021/2/2021-2-15/img13.png)

多个哨兵进行监控，当有一个哨兵检测到主节点宕机，并不会马上切换，因为有可能是哨兵的问题，所以哨兵只会主观认为主节点宕机（这种情况叫主观下线）。

当一定个数（在哨兵的配置文件可以配置）的哨兵都认为主节点宕机后，那大概率就不是哨兵的问题了，那么哨兵之前就会对剩余的从节点投票，投票结束后，随机一个哨兵进行`failover`操作（这种情况叫客观下线）。

`failover`又称故障转移，它会从从节点中挑选一个作为Redis集群中的新的主节点。

1. 选择票数高的从节点当为主节点，若是不存在（同票的情况），就继续判断。
2. 选择主从复制，同步数据最完整的节点成为主节点，若是不存在就继续判断。
3. 选择启动最早的子节点当为新的主节点。

对选出来的主节点执行`slaveof no one`将身份转换成主节点，然后向其他的从节点发送订阅模式通知，各个哨兵就会让他们的节点切换主节点的对象为新的主节点。最后更新之前宕掉的节点的身份为从节点，当宕机恢复后，就自动成为该集群的从节点。

---

哨兵的启动需要先配置哨兵启动的配置文件`sentinel.conf`。

```bash
# Example sentinel.conf
 
# 哨兵sentinel运行的端口，默认26379
port 26379
 
# 哨兵sentinel的工作目录
dir /tmp
 
# 最主要的一个配置，这个是必定配置的
# master-name为主节点名称,ip为主节点的ip，port主节点Redis服务断开
# 哨兵对主节点主观下线的个数达到quorum个后，就会执行故障转移。(三个节点就用2)
# sentinel monitor <master-name> <ip> <redis-port> <quorum>
sentinel monitor mymaster 127.0.0.1 6379 2
 
# 设置哨兵sentinel 连接主从的密码 注意必须为主从设置一样的验证密码
# sentinel auth-pass <master-name> <password>

 
# 当哨兵向主节点发送命令后，超过times毫秒没得到回应，该哨兵就会认为主节点宕机，默认30秒
# sentinel down-after-milliseconds <master-name> <milliseconds>

 
# 这个配置项指定了在发生failover主备切换时最多可以有多少个slave同时对新的master进行同步
# sentinel parallel-syncs <master-name> <numslaves>

 

# 故障转移的超时时间 failover-timeout，默认三分钟
# sentinel failover-timeout <master-name> <milliseconds>

 
# SCRIPTS EXECUTION
# 配置当某一事件发生时所需要执行的脚本，对于脚本的运行结果有以下规则：
# 若脚本执行后返回1，那么该脚本稍后将会被再次执行，重复次数默认为10
# 若脚本执行后返回2，或者比2更高的一个返回值，脚本将不会重复执行。
# 如果脚本在执行过程中由于收到系统中断信号被终止了，则同返回值为1时的行为相同。
# 一个脚本的最大执行时间为60s，如果超过这个时间，脚本将会被一个SIGKILL信号终止，之后重新执行。
# 
#
# 通知型脚本，主要用于通知故障的情况
# sentinel notification-script <master-name> <script-path>

# 客户端重新配置主节点参数脚本
# 当一个master由于failover而发生改变时，这个脚本将会被调用，通知相关的客户端关于master地址已经发生改变的信息。
# 以下参数将会在调用脚本时传给脚本:
# <master-name> <role> <state> <from-ip> <from-port> <to-ip> <to-port>
# 目前<state>总是“failover”,
# <role>是“leader”或者“observer”中的一个。 
# 参数 from-ip, from-port, to-ip, to-port是用来和旧的master和新的master(即旧的slave)通信的
# 这个脚本应该是通用的，能被多次调用，不是针对性的。
# sentinel client-reconfig-script <master-name> <script-path>

```

```bash
# 开启哨兵线程
	redis-sentinel ./sentinel.conf
```



# redis.conf

```bash
################################## INCLUDES ###################################
# include /path/to/local.conf
# include /path/to/other.conf
# 包含多个配置文件

################################## NETWORK #####################################
# 绑定IP
bind 127.0.0.1
# 打开安全模式，默认是打开的
protected-mode yes
# 绑定端口
port 6379

################################# GENERAL #####################################
# 是否以守护线程方式开启服务，默认为no,建议改为yes
daemonize no
# 如果以后台方式运行，需要指定pid文件
pidfile /var/run/redis_6379.pid

# 日志形式
# This can be one of:
# debug (a lot of information, useful for development/testing)
# verbose (many rarely useful info, but not a mess like the debug level)
# notice (moderately verbose, what you want in production probably)
# warning (only very important / critical messages are logged)
loglevel notice

# 指定日志文件路径
logfile ""

# 数据库数量
databases 16


################################# REPLICATION #################################

# 在这下面配置主节点服务地址就好了，样例已经给出
# replicaof <masterip> <masterport>

# 要是主节点服务有密码可以在这里配置
# masterauth <master-password>


################################ SNAPSHOTTING  ################################
# 持久化设置
# save s k
# 表示在s秒内，若是有至少修改了k个键值对，就会进行持久化操作
save 900 1
save 300 10
save 60 10000

# 持久化出错是否继续工作
stop-writes-on-bgsave-error yes

# 是否压缩rdb文件
rdbcompression yes

# 对保存的rdb文件时进行校验检测
rdbchecksum yes

# rdb文件的默认文件名
dbfilename dump.rdb

# rdb文件保存的目录
dir ./

################################## SECURITY ###################################
# 设置密码，默认是没有设置该选项的
# requirepass foobared

################################### CLIENTS ####################################
# 设置最大连接的客户端数
# maxclients 10000

############################## MEMORY MANAGEMENT ################################
# 设置redis最大的内存容量
# maxmemory <bytes>

# 内存满了的处理策略
# maxmemory-policy noeviction
# 1. noeviction：当内存使用超过配置的时候会返回错误，不会驱逐任何键
# 2. allkeys-lru：加入键的时候，如果过限，首先通过LRU算法驱逐最久没有使用的键
# 3. volatile-lru：加入键的时候如果过限，首先从设置了过期时间的键集合中驱逐最久没有使用的键
# 4. allkeys-random：加入键的时候如果过限，从所有key随机删除
# 5. volatile-random：加入键的时候如果过限，从过期键的集合中随机驱逐
# 6. volatile-ttl：从配置了过期时间的键中驱逐马上就要过期的键
# 7. volatile-lfu：从所有配置了过期时间的键中驱逐使用频率最少的键
# 8. allkeys-lfu：从所有键中驱逐使用频率最少的键

############################## APPEND ONLY MODE ###############################
# 是否开启aof模式，默认不开启，使用rdb方式持久化
appendonly no

# 持久化的文件名字
appendfilename "appendonly.aof"

# 同步策略
# 每次都会同步
# appendfsync always	
# 每秒进行一次同步
appendfsync everysec
# 不执行同步，交给操作系统自己同步
# appendfsync no

# 执行重写时同步数据到AOF文件，默认为no，yes表示不同步直接写入新的AOF文件
no-appendfsync-on-rewrite no

# 重写触发条件
# 当AOF文件大于64mb而且比上一次重写的文件体积大了至少一倍，就会AOF重写
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

# 一些参考链接

- <https://zhuanlan.zhihu.com/p/105587132>
- <https://www.bilibili.com/video/BV1S54y1R7SB?p=1>
- <https://baijiahao.baidu.com/s?id=1654694618189745916&wfr=spider&for=pc>
- <https://blog.csdn.net/weixin_39040059/article/details/79120444>
- <https://www.runoob.com/redis/redis-tutorial.html>
- <https://www.cnblogs.com/daofaziran/p/10978628.html>
- <https://www.jianshu.com/p/06ab9daf921d>