---
title: Redis
date: 2021-2-15
categories:
  - SpringBoot
description: 学习Redis的笔记
cover: https://img.yww52.com/2020/10/2020-10-15top_img.jpg
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

# Redis 性能测试

Redis的目录下还会有一个