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

## Bitmaps(位)

```bash
# 使用二进制来表示状态，用于那些只有两个状态

# 添加键值对
	setbit [key] [index] [1或0]
# 获取值的状态
	getbit [key] [index]
# 统计1的个数
	bitcount sign
```

