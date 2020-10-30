---
title: Docker
date: 2020-10-27
categories:	
	- java
description:  Docker 是一个开源的应用容器引擎。
cover: https://img.yww52.com/2020/10/2020-10-27/top_img.jpg
---

# 官网

<https://www.docker.com/>

# Docker的安装

去到官方文档<https://docs.docker.com/get-docker/>，选择对应的操作系统安装就可以了。

我的环境是CentOS 7.8

```bash
# 下载需要的安装包
	yum install -y yum-utils
# 更新yum软件包的索引
	yum makecache fast
# 安装docker
	yum install docker-ce docker-ce-cli containerd.io
# 启动docker
	systemctl start docker
# 查看版本
	docker version
```

出现了docker版本的信息就代表安装成功了。

# HelloWrold

```bash
#启动hello-world
	docker run hello-world
```

![](https://img.yww52.com/2020/10/2020-10-27/img1.png)

> 其实刚安装docker是没有镜像的，这个命令找不到镜像，然后去官方网站拉取下来菜启动的。

```bash
# 查看docker的镜像
	docker images
```



# 阿里云镜像加速

1. 打开阿里云的官网。
2. 打开容器镜像服务。
3. 点击镜像中心下的镜像加速器。
4. 选择版本就输入命令就可以配置好阿里云的镜像加速了。



# Docker基本命令

## 信息命令

```bash
# 查看docker版本
	docker version
# 查看docker的信息
	docker info
# 查看帮助命令
	docker --help
```

## 镜像命令
### 查看镜像
```shell
# 查看镜像信息
    docker images
# 可选项
    docker images -a, --all		# 显示所有的镜像
    docker images -q, --quiet	# 只显示镜像的ID
```

### 搜索镜像

```shell
# 命令寻找镜像
	docker search [name]
```

### 拉取镜像

```shell
# 拉取镜像	
	docker pull [name]
# 选取版本下载，不选默认选择最新版本的镜像
	docker pull [name][:tag]
# 示例
	docker pull mysql
	docker pull mysql:5.7
```

### 删除镜像

```shell
# 通过镜像ID删除镜像
	docker rmi -f [ID]
# 删除多个镜像
	docker rmi -f [ID1] [ID2] ...
# 删除所有容器
	docker rmi -f $(docker images -aq)
```

## 容器命令

### 新建并启动容器

``` shell
docker run [可选参数] image

# 参数
docker run --name image		# 给容器取名字
docker run -d image			# 后台方式启动，需要一个前台进程，不然会自动停止
docker run -p 容器端口 image			# 指定端口
docker run -p 主机端口:容器端口 image
docker run -p ip:主机端口:容器端口
docker run -P image			# 随机指定端口
docker run -it image 		# 使用交互方式运行，进入容器查看内容
```

### 退出容器

```shell
# 通过命令来退出并关闭容器，返回本地
	exit
# 容器不停止退出
	CTRL + P + Q
```

### 查看运行的容器

``` shell
# 查看运行的容器
	docker ps 
# 查看容器运行的历史
	docker ps -a
# 查看正在运行的容器的容器ID
	docker ps -q 
```

### 删除容器

```shell
# 删除指定ID的容器，不能删除正在运行的容器
	docker rm [容器ID]
# 强制删除治党ID的容器
	docker rm -f [容器ID]
# 删除所有容器
	docker rm -f $(docker ps -aq)
```

### 启动容器

```shell
# 启动容器
	docker start [容器ID]
# 重启容器
	docker restart [容器ID]
```

### 停止容器

```shell
# 停止容器
	docker stop [容器ID]
# 强制停止容器，即杀死容器
	docker kill [容器ID]
```

## 其他常用命令

### 查看日志

```shell
# 显示日志
	docker logs [容器ID]
# 显示所有的日志并带上时间
	docker logs -tf [容器ID]
# 显示指定条数的日志
	docker logs -tf --tail [numbers] [容器ID]
```

### 查看容器信息

```shell
# 查看容器内部的进程信息
	docker top [容器ID]
# 查看容器全部的信息
	docker inspect [容器ID]
```

### 进入容器

```shell
# 进入容器开启新终端
	docker exec -it [容器ID] 
# 进入容器打开正在执行的终端
	docker attach [容器ID]
```

### 拷贝容器内的文件到主机

```shell
# 将容器内的文件拷贝到主机的目录
	docker cp [容器ID]:[文件路径] [主机路径]
```

# 部署Nginx

1. 拉取Nginx的镜像

   ```she
   	docker pull nginx
   ```

2. 启动容器

   ```shell
   # 5000端口映射到容器内nginx的80端口，注意要放行5000端口,才能通过公网访问
   	docker run -d --name nginxtest -p 5000:80 nginx
   ```

3. 打开公网ip的5000端口，或者服务器内部的localhost的5000端口就能看到页面了。

# 部署Tomcat

1. 拉取Tomcat的镜像

   ```shell
   	docker pull tomcat
   ```

2. 启动容器

   ```shell
   # 启动容器	
   	docker run -d --name tomcattest -p 5000:8080 tomcat
   # 一次性的测试容器
   	docker run -it --rm tomcat
   ```

3. 打开公网ip的5000端口，或者服务器内部的localhost的5000端口就能看到页面了。因为下载的镜像是被处理过的，所以看不到index页面。

4. 进入容器

   ```shell
   	docker exec -it tomcattest /bin/bash
   # 进入到webapps发现没有任何的网站信息，发现是被存储到了webapps.dist里了，所以要想看到index，就需要拷贝过来
   	cp -r ./webapps.dist/ROOT/ webapps
   # 然后就能看见index页面了
   ```

   

# 提交生成镜像

```shell
# 将自定义的容器提交成镜像
	docker commit -m="message" -a="Author" [容器ID] [要生成镜像的名字]:[TAG]
# 查看镜像就能看到自定义的镜像
	docker images 
```

