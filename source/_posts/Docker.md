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

**我的环境是CentOS 7.8**

```bash
# 下载需要的安装包
	yum install -y yum-utils
# 更新yum软件包的索引
	yum makecache fast
# 安装docker
	yum install docker-ce docker-ce-cli containerd.io
# 启动docker
	systemctl start docker
# 建立docker组
	sudo groupadd docker
# 将当前用户加入docker组
	sudo usermod -aG docker $USER
# 查看版本
	docker version
# 查看docker的信息
	docker info
# 查看帮助命令
	docker --help
```

出现了docker版本的信息就代表安装成功了。

# HelloWrold

```bash
#创建hello-world容器
	docker run hello-world
```

![](https://img.yww52.com/2020/10/2020-10-27/img1.png)

# 阿里云镜像加速

1. 打开阿里云的官网。
2. 打开容器镜像服务。
3. 点击镜像中心下的镜像加速器。
4. 选择版本就输入命令就可以配置好阿里云的镜像加速了。

![](https://img.yww52.com/2020/10/2020-10-27/img2.png)

<div class='tip'>
    <p>
        这是阿里云的镜像加速，也可以找其他国内的源，不还源的话拉取镜像会很慢。
    </p>
</div>

# 镜像

## 拉取镜像

```shell
# 拉取镜像	
	docker pull [name]
# 选取版本下载，不选默认选择最新版本的镜像
	docker pull [name][:tag]
# 示例
	docker pull mysql
	docker pull mysql:5.7
```

## 查看镜像

```shell
# 查看顶层镜像信息
    docker images
	docker image ls
# 可选项
    docker images -a, --all		# 显示中间层的镜像
    docker images -q, --quiet	# 只显示镜像的ID
	docker images -f since=mongo:3.2, --filter		# 显示在mongo:3.2之后建立的镜像
	docker images -f before=mongo:3.2, --filter		# 显示在mongo:3.2之前建立的镜像
```

## 查看镜像的历史

```shell
	docker history [容器名]:[TAG]
```

## 搜索镜像

```shell
# 命令寻找镜像
	docker search [name]
```


## 删除镜像

```shell
# 通过镜像ID删除镜像
	docker rm [选项] [ID/名字]
# 删除多个镜像
	docker rm [选项] [ID1] [ID2] ...
# 删除所有容器
	docker rm -f $(docker images -aq)
# 删除所有镜像名为nginx
	docker image rm $(docker image ls -q nginx)
# 删除所有在mongo:3.2之前的镜像
	docker image rm $(docker image ls -q -f before=mongo:3.2)
```

## 提交生成镜像

```shell
# 将自定义的容器提交成镜像
	docker commit -m="message" -a="Author" [容器ID] [要生成镜像的名字]:[TAG]
	docker commit --author "Author" --message "message" [容器ID] [要生成镜像的名字]:[TAG]
# 查看镜像就能看到自定义的镜像
	docker images 
```

<div class='warning'>
    <p>
        慎用docker commit。因为这样生成的黑箱镜像会对其他人的维护工作造成很大压力。生成镜像建议使用Dockerfile。
    </p>
</div>

# 容器

## 新建并启动容器

``` shell
docker run [可选参数] image

# 参数
docker run --name image		# 给容器取名字
docker run -d image			# 以守护态运行启动，需要一个前台进程，不然会自动停止
docker run -p 容器端口 image			# 指定端口
docker run -p 主机端口:容器端口 image
docker run -p ip:主机端口:容器端口
docker run -P image			# 随机指定端口
docker run -it image 		# t表示分配一个伪终端，i表示让容器标准输入打开
```

## 退出容器

```shell
# 通过命令来退出容器，在一些情况退出容器会使容器停止
	exit
# 容器不停止退出
	CTRL + P + Q
```

## 查看运行的容器

``` shell
# 查看运行的容器
	docker ps 
	docker container ls
# 查看容器运行的历史
	docker ps -a
# 查看正在运行的容器的容器ID
	docker ps -q 
```

## 进入容器

```shell
# 进入容器开启新终端，从中使用exit不会使容器停止
	docker exec -it [容器ID] 
# 进入容器打开正在执行的终端，从中exit退出会使容器停止
	docker attach [容器ID]
```

## 启动容器

```shell
# 启动容器
	docker start [容器ID]
	docker container start [容器ID]
# 重启容器
	docker container restart [容器ID]
```

## 停止容器

```shell
# 停止容器
	docker container stop [容器ID]
# 强制停止容器，即杀死容器
	docker kill [容器ID]
```

## 删除容器

```shell
# 删除指定ID的容器，不能删除正在运行的容器
	docker rm  [容器ID]
	docker container rm [容器ID]
# 强制删除治党ID的容器
	docker rm -f [容器ID]
# 删除所有容器
	docker rm -f $(docker ps -aq)
```

## 查看日志

```shell
# 显示日志
	docker logs [容器ID]
# 显示所有的日志并带上时间
	docker logs -tf [容器ID]
# 显示指定条数的日志
	docker logs -tf --tail [numbers] [容器ID]
```

## 查看容器信息

```shell
# 查看容器信息
	docker container ls [容器ID]
# 查看容器内部的进程信息
	docker top [容器ID]
# 查看容器全部的信息
	docker inspect [容器ID]
```

## 拷贝容器内的文件到主机

```shell
# 将容器内的文件拷贝到主机的目录
	docker cp [容器ID]:[文件路径] [主机路径]
```

## 清理所有处于终止状态的容器

```shell 
docker container prune
```

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


# 数据卷

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

## 删除数据卷

```shell
docker volume rm [卷名]
```

## 删除无主的数据卷

```shell
docker volume prune
```

# DockerFile

## 一个简单的Dockerfile

1. 建一个新的文件夹，然后在里面建一个Dockerfile文件，内容为

   ```dockerfile
   FROM nginx
   RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
   ```

2. 然后生成镜像

   ```shell
   	docker build -t nginx:v2 .
   ```

3. 然后创建容器打开url，就能看到`Hello Docker!`了。

## 构建镜像

```shell
	docker build [选项] [镜像名]:[TAG] <上下文路径/URL/->
# 一般就为
	docker build  [镜像名]:[TAG] .
```

<div class='tip'>
    <p>
        注意这个最后这个点，这个是表示指定当前目录为上下文路径，后面有些指令就是从上下文路径开始指引，不一定是Dockerfile的路径，为了方便才让Dockerfile文件与上下文路径一致。
    </p>
</div>

## 指令

### FROM

FROM用来指定基础的镜像，即用这个镜像来进行二次开发。

这个指令是必须的，而且必须是第一条。

> Docker中有一个特殊的镜像，那就是`scratch`，表示一个空白的镜像。

### MAINTAINER

这个指令用来表示作者的信息。

```dockerfile
MAINTAINER <username email>
```

### RUN

用来执行命令。

```dockerfile
# shell格式
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
# exec格式
RUN ["可执行文件", "参数1", "参数2"]
```

<div class='warning'>
    <p>
        当有多个命令的时候，尽量在一个RUN指令中完成，而不是使用多个RUN。因为一个指令就是建立一层，多层的结构就会显得十分的臃肿。
    </p>
</div>

### COPY

从构建上下文的目录中将一个文件复制到镜像内的目标路径当中。

```dockerfile
COPY  [文件路径] [镜像内目标路径]
```

如果源路径为文件夹，复制的时候不是直接复制该文件夹，而是将文件夹中的内容复制到目标路径。

### ADD

ADD也是复制，与COPY差不多，但是能干更多的事情，比如复制的文件是tar压缩文件，会帮你自动解压到目标路径。

```dockerfile
ADD  [文件路径] [镜像内目标路径]
```

> ADD有很多复杂的功能，所以只拷贝文件的时候尽量使用COPY，需要自动解压就用ADD。

### WORKDIR

用来设置工作目录。

```dockerfile
WORKDIR <工作目录>
```

工作目录是用来指定整个镜像的，因为每一层都是隔离的，所以不指定工作目录就会出现目录的混乱，即上一层使用了cd进入了新的目录，而下一层一不小心就当成是上一层的目录继续操作。

### EXPOSE

暴露端口，类似之前的`-p`参数，声明容器运行时容器提供服务端口。注意仅仅是声明，不会自动进行端口映射。

### VOLUME

```  dockerfile
VOLUME ["<路径1>", "<路径2>"...]
VOLUME <路径>
```

这里的目录挂载之后就会在运行的时候自动挂载为匿名卷。

### ENV

设置环境变量。

### CMD

```dockerfile
# shell格式
CMD <命令>
# exec格式
CMD ["可执行文件", "参数1", "参数2"...]
# 例子
CMD echo $HOME
CMD ["sh","-c","echo $HOME"]
```

### ENTRYPOINT

ENTRYPOINT与CMD差不多，只不过在容器run后面加命令就会自动添加到ENTRYPOINT的参数去。

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
# 创建自定义网络,具体ip看情况定
	docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 [自定义网络名]
	docker network create -d bridge [自定义网络名]
# 创建容器时指定所在网络
	docker run -d -P --net [自定义网络名] [镜像]
```

## 连通网络

```shell
# docker0网络下的容器通过容器名是不能Ping通另一个网络的容器的
# 需要将容器直接连通另一个网络网卡
	docker network connect [另一个网络] [容器]
# 其实就是将容器加入到另一个网络
# 给了一个容器两个ip地址
```

# Dockercompose

## 下载安装

```shell
# 官方文档下载
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# 从github上下载会十分慢，建议换成国内源
sudo curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
# 下载完成后会在/usr/local/bin下面会有二进制文件docker-compose


# 将可执行权限应用于二进制文件
sudo chmod +x /usr/local/bin/docker-compose
```

## 卸载

```shell
# 使用curl安装的
	sudo rm /usr/local/bin/docker-compose
# 使用pip安装的
	pip uninstall docker-compose
```

