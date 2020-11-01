---
title: MYSQL
date: 2020-11-1
categories:
	- java
cover: 
descrtion: 
---

# 基本概念

# 连接数据库

```mysql
-- username 则为自己的用户名，一般为root，password为密码
	mysql -u[username] -p[password]
	mysql -u[username] -p
-- 断开连接，即退出数据库操作页面
	exit
```

<div class='tip'>
    <p>
        MySQL的关键字是不区分大小写的，这里我全部用大写来记录。
    </p>
</div>


# 数据库的操作

## 创建数据库

```mysql
	CREATE DATABASE [数据库名];
	CREATE DATABASE IF NOT EXISTS [数据库名];
```

## 删除数据库

```mysql
	DROP DATABASE [数据库名];
	DROP DATABASE IF EXISTS [数据库名];
```

## 查看数据库

```mysql
-- 查看所有的数据库
	SHOW DATABASES;
-- 查看创建库使用的语句
	SHOW CREATE DATABASES [库名];
```

## 切换数据库

```mysql
-- 切换到指定的数据库
	USE [数据库名];
--  数据库名和表名如果是特殊的词，就需要用``来区分
```

# 表中的数据类型

## 数值类型

|   类型    |                    描述                    |  大小   |
| :-------: | :----------------------------------------: | :-----: |
|  tinyint  |               很小的一个数据               | 1个字节 |
| smallint  |               较小的一个数据               | 2个字节 |
| mediumint |             中等大小的一个数据             | 3个字节 |
|    int    |          标准大小的数据(整数常用)          | 4个字节 |
|  bigint   |                 较大的数据                 | 8个字节 |
|   float   |                单精度浮点数                | 4个字节 |
|  double   |                双精度浮点数                | 8个字节 |
|  decimal  | 字符串形式的浮点数(用来解决浮点数精度问题) |         |

## 字符串类型

|   类型   |              描述              |  大小   |
| :------: | :----------------------------: | :-----: |
|   char   |        固定大小的字符串        |  0~255  |
| varchar  | 可变的字符串，对应Java的String | 0~65535 |
| tinytext |            微型文本            |  2^8-1  |
|   text   |             文本串             | 2^16-1  |

## 时间与日期

|   类型    |            描述             |        格式         |
| :-------: | :-------------------------: | :-----------------: |
|   date    |            日期             |     YYYY-MM-DD      |
|   time    |            时间             |      HH:mm:ss       |
| datetime  | 常用的时间格式，即date+time | YYYY-MM-DD HH:mm:ss |
| timestamp | 1970.1.1到现在时间的毫秒数  |                     |
|   year    |          年份表示           |                     |

<div class='tip'>
    <p>
        MM与mm分大小写是为了区分月份和分钟。</br>
		HH大写是为了表示是24小时制，hh为12小时制。</br>
		YYYY表示week-based-year,即只要本周跨年，那这周就算入下一年。</br>
		yyyy就表示真实年份。
    </p>
</div>

## null

未知的数据类型，不建议参与运算。

# 字段属性

|        关键字        |              描述              |
| :------------------: | :----------------------------: |
|         NULL         |     该数据列可以包含NULL值     |
|       NOT NULL       |     该数据列不允许为NULL值     |
|       DEFAULT        |       为数据列指定默认值       |
|     PRIMARY KEY      |         设数据列为主键         |
|    AUTO_INCREMENT    | 设数据列为自动递增，设用于整数 |
|       UNSIGNED       |        设数据列为无符号        |
| CHARACTER SET [name] |     为数据列指定一个字符集     |
|       COMMENT        |              注释              |

# 表的操作

##  查看表

```mySQL
-- 进入数据库后查看该数据库所有的表
	SHOW TABLES [表名];
-- 查看创建表使用的语句
	SHOW CREATE TABLE [表名];
```

## 查看表中的信息

```mysql
-- 查看表中的具体信息，即结构
	DESCRIBE [表名];
	DESC [表名];
```

## 创建表

```mysql
	CREATE TABLE IF NOT EXISTS `[表名]`(属性)[表类型][设置字符集]
-- 例子
	CREATE TABLE IF NOT EXISTS `user`(
		`id` INT(5) NOT NULL AUTO_INCREMENT COMMENT 'id号',
        `name` VARCHAR(20) NOT NULL COMMENT '名字',
        `password` VARCHAR(20) NOT NULL COMMENT '密码',
        `sex` VARCHAR(2) COMMENT '性别',
        `birthday` DATETIME DEFAULT NULL COMMENT '生日',
        `address` VARCHAR(100) DEFAULT NULL COMMENT '地址',
        `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
        PRIMARY KEY(`id`)
    )ENGINE=INNODB DEFAULT CHARSET=utf8
```

## 修改表

```mysql
-- 修改表名
	ALTER TABLE [旧表名] RENAME AS [新表名]
-- 增加表的字段
	ALTER TABLE [表名] ADD [属性]
	ALTER TABLE user1 ADD age INT(10) DEFAULT NULL COMMENT '年龄'
-- 修改表的约束
	ALTER TABLE [表名] CHANGE [旧列名] [新列名] [类型]
	ALTER TABLE [表名] MODIFY [列名] [类型]
-- CHANGE可以更改列名
```


