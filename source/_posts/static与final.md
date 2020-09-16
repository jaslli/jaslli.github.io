---
title: static与final
categories:
  - Java
date: 2019-10-31 19:25:01
description: static和final还是会弄乱的，特地整理一下
cover: https://cdn.jsdelivr.net/gh/jaslli/HexoFile1@latest/2019/10/2019-10-31top_img.jpg
---

## static

- static修饰的变量为类的变量，属于类，即所有的该类的实例化对象共同使用该static变量

- static方法中不能访问非static成员

  > 这个很容易理解，每个类都只有一份static的资源，还没类还没实例化就有了该static方法，但没有实例化的成员即非静态成员，所以静态方法是不能访问非static成员的

- static的变量和方法或者块都是属于类的，普通变量和方法是属于对象的。

## final

- 用final修饰类，表明中这个类是不能不继承的，类中的变量可以是非final的变量，但所有的方法都会被隐式地指定为final方法
- 使用final修饰方法原因有两个。一，把方法锁定，防止任何继承类重写该方法。二，提高效率。在早期的Java实现版本会将final方法转为内嵌调用，但如果方法过于庞大，可能看不到内嵌的优化效果，新的Java版本已经   不需要final方法来优化

- final不能修饰构造方法
- final修饰变量，即表示该变量被定义为一个常量，该常量被初始化赋值之后就不能修改

