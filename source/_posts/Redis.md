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

```bash
# 值为一个字符串

# 设置键值对
	set [key] [value]
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

```bash
# 值为类似一个双端的链表

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

```bash
# set不能重复添加相同的元素

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

``` bash
# 值为一个哈希表,语法和String差不多

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

```bash
# 在set基础上增加了序号

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

# redis.conf

Redis.conf是Redis的配置文件，学习一下配置文件。

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

```



# 一些参考链接

- <https://zhuanlan.zhihu.com/p/105587132>
- <https://www.bilibili.com/video/BV1S54y1R7SB?p=1>