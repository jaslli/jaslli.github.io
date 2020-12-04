---
title: 初识JVM
date: 2020-12-4
categories:
  - JVM
description: 初步认识学习JVM。
cover: https://img.yww52.com/2020/12/2020-12-4/top_img.jpg
---

# 什么是JVM

认识JVM之前就先了解下面三个相近的概念。

- JDK
  英文名称为Java Development Kit。Java开发工具包，开发Java程序经常会使用它。

- JRE

  英文名称为Java Runtime Environment。Java运行环境，主要包括JVM和一些类库，保证Java程序运行的最小环境。

- JVM

  英文名称为Java Virtual Machine。Java虚拟机,具体是干什么的，之后在说。

通过概念就能看出来它们之间的关系，如下图。

![](https://img.yww52.com/2020/12/2020-12-4/img1.png)

更加详细的信息可以参考这个图。

![](https://img.yww52.com/2020/12/2020-12-4/img2.png)

# JVM的位置

JVM在我们的计算机当中是位于什么位置的呢？可以参考一下下图。

![](https://img.yww52.com/2020/12/2020-12-4/img3.png)

# 一次编译，到处运行

Java之所以那么火，这么多人使用，其中一个原因就是Java有一个特性，一次编译，到处运行。Java可以实现跨平台运行，这使得开发者在不同平台上都可以运行自己的Java程序，方便了开发者的部署。那么Java是怎么实现跨平台的特性的呢？

这就用到了Java虚拟机了。我们在IDE编写好自己的Java程序之后，就会有一个扩展名为`.java`的源代码文件。

然后我们可以通过一个简单的命令来编译Java这个源代码文件。

```bash
	javac hello.java
```

Java程序的编译不是直接编译为计算机可以看懂的序列，而是编译成为了一个扩展名为`.class`的字节码文件。这个字节码文件通过Java虚拟机的翻译，才能变成计算机看得懂的序列，计算机才能成功运行这个Java程序。

```bash
	java hello.class
```

到这应该就知道为什么Java可以实现跨平台了。Java的字节码文件不管放在哪个系统，只要系统装有JVM，就能将字节码文件翻译成系统看的懂的序列，所以就能运行了。系统不同的只是会导致虚拟机不同，但不会影响字节码文件。

# JVM的结构体系

![](https://img.yww52.com/2020/12/2020-12-4/img4.png)