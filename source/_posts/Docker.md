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



# 使用数据卷

## 自定义路径挂载

```shell
# 将容器内目录挂载到本地目录上
	docker run  -v [主机目录]:[容器目录]
# 例子
	docker run -it -v /home/test:/home centos
```

## 匿名挂载

```shell
# 不指定本地目录的挂载
	docker run -v [容器目录]
# 例子
	docker run -d -P --name nginxtest1 -v /etc/nginx nginx
```

## 具名挂载

```shell
# 指定卷名不指定本地目录挂载
	docker run -v [卷名]:[容器目录]
# 例子
	docker run -d -P --name nginxtest2 -v nginx-test:/etc/nginx nginx
```

## 查看数据卷信息

```shell
# 查看当前数据卷的使用信息
	docker volume ls 
# 指定卷名查看数据卷的具体信息,可以看到本地的挂载目录
	docker volume inspect [卷名]
```



# DockerFile

```shell
# 指定基础镜像
	FROM
# 指维护者的信息，姓名加邮箱
	MAINTAINER
# 运行的命令
	RUN
# COPY文件，添加内容，会自动解压
	ADD
# 设置当前工作目录
	WORKDIR
# 挂载主机目录，即设置卷
	VOLUME
# 暴露端口
	EXPOSE
# 指定容器启动
	RUN
# 指定容器启动运行的命令
	CMD				#会代替之前的命令
	ENTRYPOINT		#追加命令
# 拷贝文件到镜像中
	COPY
# 设置环境变量
	ENV
# 构建镜像
	docker build -f [dockerfile文件路径] -t [镜像名]:[TAG]
```

# 发布镜像

## Dockerhub

<https://www.docker.com/>

```shell
# 登陆dockerhub	
	docker login -u [username] -p [password]
# 发布镜像
	docker push
```

# 阿里云镜像

打开阿里云的容器镜像服务，创建命名空间和容器镜像，然后参考官方文档就能跟着发布了。



# Docker网络

## link

```shell
# 通过link可以简单的链接网络
	docker run -d -P --link [需要连接的容器名] [镜像]
# --link 其实就是为容器的host增加一条解析记录，所以在该容器就能ping通需要连接的容器名。
# 这个只是增加解析，所以是不能反向ping通的
```

## 自定义网络

``` shell
# 之前创建容器的时候，默认是与docker0进行桥接模式,下面两个命令是一样的
	docker run -d -P --net bridge [镜像]
	docker run -d -P [镜像]
# 在docker0的网络中，每个容器只能通过IP互相ping通，但是不能访问域名即容器名，可以通过--link单向打通
```

```shell
# 自定义网络就修复了docker0的缺陷，容器能通过容器名来ping通
# 创建自定义网络
	docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 [自定义网络名]
# 创建容器时指定所在网络
	docker run -d -P --net [自定义网络名] [镜像]
```

