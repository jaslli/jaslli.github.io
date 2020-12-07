---
title: git常用命令
categories:
  - 工具
date: 2019-11-28
description: Git是目前世界上最先进的分布式版本控制系统，能够很好的帮你管理项目。
cover: https://img.yww52.com/2019/11/2019-11-28/top_img.jpg
---

## 本地库操作

### git的签名

```bash
#用户名和邮件地址又称签名
#系统用户级别的签名设置（这个是一定要设置的）
	git config --global user.name name
	git config --global user.email email
#仓库级别的签名设置
	git config user.name name 
	git config user.email email
#这两个签名就是范围不同，一个是全局的一个是部分的，当两个签名都存在时，就会使用仓库级别的签名
#注意的是，用户名不能是中文的
```

### git的添加和删除

```bash
#将操作提交的暂存区
	git add file
#将所有操作都提交到暂存区
	git add .
#将操作从暂存区删除掉
	git rm --cached file
```

### git提交

```bash
#将暂存区中没提交的操作提交到本地版本库
	git commit file
#因为git每次提交都需要写日志来清楚知道修改了什么，所以可以这么写
	git commit -m"message" (file)
#还能这么写,-a表示执行修改或删除的操作都提交到本地库，可以不用add操作
	git commit -a -m"message"
```

### git状态查看

```bash
#查看库中有无修改操作，即有无操作可以add或commit
	git status file
```

### 查看历史记录

```bash
#这些操作都是查看历史版本的，只是显示的方式不同
    git log 
    git log --pretty=oneline
    git log --oneline
    git reflog 			#这个方式比较好看出索引和易于前进后退
```

### 前进后退

```bash
# 基于索引操作
	git reset --hard "索引值"
# 用^来操作
	git reset --hard Head^^		#该操作只能后退，一个^后退一个版本
#用~来操作       
	git reset --hard Head~n		#这样表示后退n个版本    
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

```bash
#用rm命令把文件从工作区删除
	rm file
#此时用status命令可以发现该操作可以添加到暂存区
	git add file
#然后把该操作提交到本地版本库就可以从本地库中删除该文件
	git commit -m"delete a file"
```

### 比较文件差异

```bash
#将工作区中的文件和暂存区进行比较
	git diff file
#将工作区中的文件和本地库历史记录比较，不带文件名时多个文件比较
	git diff [历史版本] file      
```

## 分支操作

### 查看分支情况

```bash
	git branch
	git branch -v 
```

### 新建分支

```bash
	git branch branch_name
```

### 切换分支

```bash
	git checkout branch_name
```

### 合并分支

```bash
#切换到被合并的分支上，然后执行merge命令
	git merge branch_name		
```

## 关于远程仓库的操作 

### 关于远程仓库的地址

```bash
#查看现在库里保存的远程仓库的地址
	git remote -v
#设置远程仓库的地址，也可以理解为为origin创建一个别名
	git remote add origin (加上远程仓库的地址，就比如https)
#删除现在的远程仓库的地址
	git remote rm origin
```

### 本地库的推送

```bash
	git push origin master
#master可以改为其他分支，必须指定
```

### 克隆

```bash
	git clone (加上远程库的地址)
#克隆会帮你初始好本地库，并帮你把远程库下载到本地，还可以为你的origin创建好别名
```

### 拉取

```bash
#pull=fetch+merge
#抓取,该操作只是把远程仓库的东西下载下来，并没有修改你本地的文件
	git fetch origin master 
#这时你可以切换到origin/master这个分支上查看变化
	git checkout origin/master 
#然后通过两个分支的合并就可以变成远程仓库的样子
	git merge origin/master
#当然直接执行pull也可以
	git pull origin master
```

