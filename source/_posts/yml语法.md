---
title: YAML基本语法
date: 2020-10-20
categories:
  - 其他技术
description: 简单学习一下yml的语法
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@master/2020/7/2020-7-7/top_img.jpg
---

# 基本语法

```
Key: value
```

注意冒号后面的空格是一定要有的，YAML语法对空格是十分敏感的，而且是用空格来控制层级关系，就比如下面这个例子。

```yml
server:
 port: 8081
 path: 
```

这就表示server这个配置有两个子配置，这两个子配置是port和path，它们都在同一个层级，主要是看首字母的列数，子配置的首字母列数是不能在父配置的左边的比如下面的这个列子就是错误。

```yml
 server:
port: 8081
```

