---
title: YAML基本语法
date: 2020-10-20
categories:
  - 其他技术
description: 简单学习一下yml的语法
cover: https://img.yww52.com/2020/10/2020-10-20top_img.jpg
---

# 基本语法

```yaml
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



{%note warning%}

YAML对大小写敏感，所以不要弄错大小写。

{%endnote%}

# 值

1. 值为数字，字符串或者是布尔类型

   ```yml
   Key: value
   ```

   字符串默认是不用加引号的，也可以加上，单引号包括是换转义特殊字符的，而双引号不会，就比如经常写的\n换行等字符。

2. 对象和Map

   ```yml
   User:
    Name: student
    ID: 02
   ```

   ```yaml
   User: {Name: student,ID: 02}
   ```

3. 数组

   ```yaml
   User:
    - user01
    - user02
    - user03
   ```

   ```yaml
   User: [user01,user02,user03]
   ```

   



