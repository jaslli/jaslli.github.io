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
# DDL数据定义语言
## 数据库的操作

### 创建数据库

```mysql
	CREATE DATABASE [数据库名];
	CREATE DATABASE IF NOT EXISTS [数据库名];
```

### 删除数据库

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

### 切换数据库

```mysql
-- 切换到指定的数据库
	USE [数据库名];
--  数据库名和表名如果是特殊的词，就需要用``来区分
```

## 表中的数据类型

### 数值类型

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

### 字符串类型

|   类型   |              描述              |  大小   |
| :------: | :----------------------------: | :-----: |
|   char   |        固定大小的字符串        |  0~255  |
| varchar  | 可变的字符串，对应Java的String | 0~65535 |
| tinytext |            微型文本            |  2^8-1  |
|   text   |             文本串             | 2^16-1  |

### 时间与日期

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

### null

未知的数据类型，不建议参与运算。

## 字段属性

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

## 表的操作

###  查看表

```mySQL
-- 进入数据库后查看该数据库所有的表
	SHOW TABLES [表名];
-- 查看创建表使用的语句
	SHOW CREATE TABLE [表名];
```

### 查看表中的信息

```mysql
-- 查看表中的具体信息，即结构
	DESCRIBE [表名];
	DESC [表名];
```

### 创建表

```mysql
	CREATE TABLE IF NOT EXISTS `[表名]`(属性)[表类型][设置字符集]
-- 例子
	CREATE TABLE IF NOT EXISTS `user`(
		`id` INT(5) NOT NULL AUTO_INCREMENT COMMENT 'id号',
        `username` VARCHAR(20) NOT NULL COMMENT '用户名',
        `password` VARCHAR(20) NOT NULL COMMENT '密码',
        `sex` VARCHAR(2) COMMENT '性别',
        `birthday` DATETIME DEFAULT NULL COMMENT '生日',
        `address` VARCHAR(100) DEFAULT NULL COMMENT '地址',
        `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
        PRIMARY KEY(`id`)
    )ENGINE=INNODB DEFAULT CHARSET=utf8
```

### 修改表

```mysql
-- 修改表名
	ALTER TABLE [旧表名] RENAME AS [新表名];
-- 增加表的字段
	ALTER TABLE [表名] ADD [属性];
	ALTER TABLE user1 ADD age INT(10) DEFAULT NULL COMMENT '年龄';
-- 修改表的约束
-- CHANGE可以更改列名和列类型，而MODIFY只能修改列类型
-- CHANGE只修改列类型的时候，也要写两个相同的列名
-- 所以只修改列类型建议用MODIFY
	ALTER TABLE [表名] CHANGE [旧列名] [新列名] [类型];
	ALTER TABLE [表名] MODIFY [列名] [类型];
-- 删除表的字段
	ALTER TABLE [表名] DROP [列名];
```

### 删除表

```mysql
	DROP TABLE [表名];
	DROP TABLE IF EXISTS [表名];
```

### 添加外键

```mysql
ALTER TABLE [当前表名] ADD CONSTRAINT `FK_[列名]` FOREIGN KEY([列名]) REFERENCES [对象表名]([列名]);
```



# DML数据操纵语言

## INSERT

```mysql
-- 插入一条数据
	INSERT INTO [表名]([列名1]，[列名2]，[列名3]) VALUES([值1]，[值2]，[值3]);
	INSERT INTO [表名] VALUES([值1]，[值2]，[值3]);
-- 插入多条语句
	INSERT INTO [表名]([列名1]，[列名2]，[列名3]) VALUES([值1]，[值2]，[值3]),([值1]，[值2]，[值3]);
	INSERT INTO [表名] VALUES([值1]，[值2]，[值3]),([值1]，[值2]，[值3]);
```

## UPDATE

```mysql
-- 条件一般使用WHERE
	UPDATE [表名] SET [列名]=[值] [条件];
	UPDATE [表名] SET [列名1]=[值1],[列名2]=[值2] [条件];
```

## DELETE

```mysql
-- 删除数据
	DELETE FORM [表名] [条件];
-- 清空表中数据
	TRUNCATE [表名];
-- TRUNCATE会让自增计数器清零
```



# DQL数据查询语言

```mysql
CREATE TABLE IF NOT EXISTS `user`(
	`id` INT(5) NOT NULL AUTO_INCREMENT COMMENT 'id号',
    `username` VARCHAR(20) NOT NULL COMMENT '名字',
    `password` VARCHAR(20) NOT NULL COMMENT '密码',
    `sex` VARCHAR(2) COMMENT '性别',
    `birthday` DATETIME DEFAULT NULL COMMENT '生日',
    `address` VARCHAR(100) DEFAULT NULL COMMENT '地址',
    `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
    PRIMARY KEY(`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8
```
> 建个表好进行之后的例子

## 简单的查询

```mysql
-- 查询表中所有信息
	SELECT * FROM [表名];
	SELECT * FROM `user`;
-- 查询表中指定信息
	SELECT [列名1],[列名2] FROM [表名];
	SELECT `id`,`name` FROM `user`;
-- 给结果的字段及表器别名,AS可以省略
	SELECT [列名1] AS [别名1],[列名2] AS [别名2] FROM [表名] AS [别名3];
	SELECT `username` AS '用户名',`password` AS '密码' FROM `user` AS '用户表';
-- 处理结果的信息，简单的字符串拼接
	SELECT CONCAT([message],[列名]) FROM [表名];
	SELECT CONCAT('用户名为',`username`) FROM `user`;
```

## 去重

```mysql
-- 去除同样的数据
	SELECT DISTINCT `username` FROM `user`;
```

## 一些常用连接符

| AND  |  &&  | A AND B |
| :--: | :--: | :-----: |
|  OR  | \|\| | A OR B  |
| NOT  |  !   |  NOT A  |

## LIKE

```mysql
-- %代表任意字符,_代表一个字符
	SELECT [列名] FROM [表名] LIKE '[通配符]';
-- 查询用户名第一个字陈的人
	SELECT `username` FROM `user` LIKE '陈%' ;
-- 查询用户名第一个字陈且名字中第三个字为明
	SELECT `username` FROM `user` LIKE '陈_明%' ;
```

## WHERE

```mysql
-- 查询id为300的用户信息，大于小于同理
	SELECT * FROM `user` WHERE id=300;
-- 查询id在300到400之间的用户信息
	SELECT * FROM `user` WHERE id>=300 AND id<=400;
	SELECT * FROM `user` WHERE id BETWEEN 300 AND 400;
-- 查询id为300，301，302的用户信息
	SELECT * FROM `user` WHERE id=300 AND id=301 AND id=302;
	SELECT * FROM `user` WHERE id IN (300,301,302);
-- 查询邮箱为空的用户信息
	SELECT * FROM `user` WHERE email='';
	SELECT * FROM `user` WHERE email IS NULL;
-- 查询邮箱不为空的用户信息
	SELECT * FROM `user` WHERE email IS NOT NULL;
```

## JOIN

```mysql
-- 首先假设有张部门表depart，有id和department两个属性
-- 查询用户的id，userrname和department这三个属性,相同的属性需要通过别名来划分
-- INNER JOIN
	SELECT s.id,username,departmen FROM student AS s INNER JOIN depart AS d ON s.id=d.id
-- RIGHT JOIN
	SELECT s.id,username,departmen FROM student AS s RIGHT JOIN depart AS d ON s.id=d.id
-- LEFT JOIN
	SELECT s.id,username,departmen FROM student AS s LEFT JOIN depart AS d ON s.id=d.id
-- FULL JOIN
	SELECT s.id,username,departmen FROM student AS s FULL JOIN depart AS d ON s.id=d.id
```

- INNER JOIN
  如果表中有至少一个匹配，则返回行。
- RIGHT JOIN
  即使左表中没有匹配，也从右表返回所有的行。
  假如depart有id=1000而user表中没有id=1000的数据也会查到id=1000数据，只是在user表的列数据为null。
  不会查到user表中有而depart表中没有的数据。
- LEFT JOIN
  即使右表中没有匹配，也从左表返回所有的行。
  假如user有id=1000而depart表中没有id=1000的数据也会查到id=1000数据，只是在depart表的列数据为null。
  不会查到depart表中有而user表中没有的数据。
- FULL JOIN
  只要其中一个表中存在匹配，则返回行。

