---
title: git
categories:
  - 其他技术
date: 2019-11-28 20:20:10
description: Git是目前世界上最先进的分布式版本控制系统，能够很好的帮你管理项目。
cover: https://img.yww52.com/2019/11/2019-11-28top_img.jpg
---

# 版本控制系统

Git是目前世界上最先进的分布式改版控制系统。把这句话缩减一下，就变成Git是版本控制系统。

那什么是版本控制系统呢？Git官网上是这么描述的。版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统。简单来说就是帮你把文件的修改创建很多的版本，方便你能更好的管理这个文件。

版本控制分为了三种形式。

## 本地版本控制系统

本地版本控制系统的执行原理很好理解，那就是每进行一次改动之后就把你的项目全部复制保存下来，以此来保存各个不同的版本。这种十分简单，但弊端也很明显。

1. 这些版本控制起来很麻烦。
2. 只能保存在本地，别人想用就得去复制一份才能使用，人数一多，对于版本的统一也会变得很难。

![本地版本控制图解](https://git-scm.com/book/en/v2/images/local.png)

> 其中最流行的就是RCS了。现在计算机系统中还是用的很多的。RCS的工作原理是在硬盘上保存补丁集（补丁是指文件修订前后的变化）；通过应用所有的补丁，可以重新计算出各个版本的文件内容。

## 集中化版本控制系统

为了解决本地版本控制系统中团队协作很难执行的弊端，就出现了一种新的版本控制系统，那就是集中化版本控制系统。

这种系统都会有一个特定的服务器用来存储项目各个版本的文件，进行单一的集中管理。每个协同工作的人们都通过这个服务器得到最新的版本，然后进行修改之后在上传到这个集中管理的服务器，成为更新的版本。

这种集中化的版本控制系统算是十分标准的版本控制系统了，但还是会有不少弊端。比如因为版本的控制是集中化管理的，要是这个服务器出了故障，那么故障期间就无法更新版本的数据了，要是数据丢失，那就无法找回了，除非你正好保存有丢失的版本数据。

![集中化的版本控制图解](https://git-scm.com/book/en/v2/images/centralized.png)

> 集中化的版本控制系统中最流行的就是SVN了，虽然使用SVN的人少了很多，但还是有挺多人会用的。

## 分布式版本控制系统

为了解决集中化版本控制系统的一些弊端，就出现了分布式版本控制系统。

分布式代表每个人都会保存有所有版本的信息，即使某个地方故障了，也不会影响别人的进程。
![分布式版本控制图解](https://git-scm.com/book/en/v2/images/distributed.png)

# Git的下载

这里我就说下Windows的下载方法。

可以直接去到Git的官网去下载。<https://git-scm.com/downloads>

不知道为什么有的时候官网的下载会奇慢无比，有时候又会正常，这时候你可以使用一些手段去下载。

不然就去寻找Git的一些国内镜像去下载，我这里就提供一个。<https://npm.taobao.org/mirrors/git-for-windows/>

听说用迅雷下载也是挺快的。

安装的话就一路Next就可以了，这样算是很好的配置了。

# Git的配置



## git的一些基本信息

### 工作区

&nbsp;&nbsp;&nbsp;工作区指的就是你看到的这个文件夹，包含.git这个隐藏文件的文件夹

### 暂存区

&nbsp;&nbsp;&nbsp;暂存区一般存放在你git目录下的index文件中，你一般是不会看到的，用于临时存放你的改动

### 版本库

&nbsp;&nbsp;&nbsp;版本库就是你安全存放数据的位置，就是在你最后提交到的地方，也可以说是你之后存放文件的地方

### 关于它们的联系(我是这么理解的)

&nbsp;&nbsp;&nbsp;当你对你的文件夹进行操作，也就是对工作区进行操作，比如修改文件或者是删除文件，这些操作是在你的工作区里进行的，其实还没有对你的版本库进行到修改，所以你要你要线把这些改动操作添加的暂存区里，在暂存区里就会有这些没提交到版本库里的改动操作，你可以在暂存区里选择你要提交的改动操作，提交到版本库之后，版本库就会进行这些改动的操作，最后达到你想要的状态

## 本地库操作

### 关于签名

```java 
//签名就是辨别你身份的，有两个仓库级别和系统用户级别的，签名包含名字和email
//仓库级别，保存在.git里的config文件
	git config user.name name 
	git config user.email email
//系统用户级别，保存在~目录里的.gitconfig文件里面
	git config --global user.name name
	git config --global user.email email
//这两个签名就是范围不同，一个是全局的一个是部分的，当两个签名都存在时，会使用仓库级别的签名
//注意的是，用户名不能是中文的
```

### git的添加和删除

```java
//将操作提交的暂存区
	git add file
//将所有操作都提交到暂存区
	git add .
//将操作从暂存区删除掉
	git rm --cached file
```

### git提交

```Java
//将暂存区中没提交的操作提交到本地版本库
	git commit file
//因为git每次提交都需要写日志来清楚知道修改了什么，所以可以这么写
	git commit -m"message" (file)
//还能这么写,-a表示执行修改或删除的操作都提交到本地库，可以不用add操作
	git commit -a -m"message"
```

### git状态查看

```java
//查看库中有无修改操作，即有无操作可以add或commit
	git status file
```

### 查看历史记录

```java
//这些操作都是查看历史版本的，只是显示的方式不同
    git log 
    git log --pretty=oneline
    git log --oneline
    git reflog 			//这个方式比较好看出索引和易于前进后退
```

### 前进后退

```Java
// 基于索引操作
	git reset --hard "索引值"
// 用^来操作
	git reset --hard Head^^		//该操作只能后退，一个^后退一个版本
//用~来操作       
	git reset --hard Head~n		//这样表示后退n个版本    
```

### reset三个参数的对比

#### soft

- 仅仅时在本地库移动HEAD指针

#### mixed

- 在本地库移动HEAD指针

- 重置暂存区

#### hard

- 在本地库移动HEAD指针
- 重置暂存区
- 重置工作区

### 从本地库中删除文件

```Java
//用rm命令把文件从工作区删除
	rm file
//此时用status命令可以发现该操作可以添加到暂存区
	git add file
//然后把该操作提交到本地版本库就可以从本地库中删除该文件
	git commit -m"delete a file"
```

### 比较文件差异

```Java
//将工作区中的文件和暂存区进行比较
	git diff file
//将工作区中的文件和本地库历史记录比较，不带文件名时多个文件比较
	git diff [历史版本] file      
```

## 分支操作

### 查看分支情况

```Java
	git branch
	git branch -v 
```

### 新建分支

```Java
	git branch branch_name
```

### 切换分支

```java
	git checkout branch_name
```

### 合并分支

```java 
//切换到被合并的分支上，然后执行merge命令
	git merge branch_name		
```

## 关于远程仓库的操作 

### 关于远程仓库的地址

```Java
//查看现在库里保存的远程仓库的地址
	git remote -v
//设置远程仓库的地址，也可以理解为为origin创建一个别名
	git remote add origin (加上远程仓库的地址，就比如https)
//删除现在的远程仓库的地址
	git remote rm origin
```

### 本地库的推送

```Java
	git push origin master
//master可以改为其他分支，必须指定
```

### 克隆

```Java
	git clone (加上远程库的地址)
//克隆会帮你初始好本地库，并帮你把远程库下载到本地，还可以为你的origin创建好别名
```

### 拉取

```java
//pull=fetch+merge
//抓取,该操作只是把远程仓库的东西下载下来，并没有修改你本地的文件
	git fetch origin master 
//这时你可以切换到origin/master这个分支上查看变化
	git checkout origin/master 
//然后通过两个分支的合并就可以变成远程仓库的样子
	git merge origin/master
//当然直接执行pull也可以
	git pull origin master
```

