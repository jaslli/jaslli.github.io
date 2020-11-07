---
title: Matlab
categories:
  - 无类可分
date: 2019-12-09
description: 数学软件，一些简单的操作。
---

#### 基本操作

```matlab
%	定义变量	
	syms a
%	清屏
	clc
%	清空所有
	clear
```

#### 矩阵的操作

```matlab
%	定义矩阵,空格或逗号分隔一行里的元素，分号是分行
	a = [ ; ; ]
%	定义元素全为1的矩阵
	A1 = ones(2,4)
%	定义元素全为0的矩阵
	A2 = zeros(3,3)
%	定义单位矩阵
	A3 = eye(4)	
%	定义随机数的矩阵
	A4 = rand(2,3)
%	定义魔方矩阵，每行每列没对角线的和相等
	A5 = magic(3)
```

```matlab
%	求A行列式的值
	det(A)
%	求A矩阵的秩(r(A))
	rank(A)
%	求A矩阵的迹(tr(A))
	trace(A)
%	求A行列式的逆矩阵
	inv(A)
%	求A的特征值与特征向量
	eig(A)
%	化简矩阵A
	rref(A)
```

##### 克莱姆法则求解

```matlab
% 克莱姆法则求解非齐次线性方程组的解
% 判断行列式是否为0，不为0即有唯一解
	D = det(A)
%然后用结果那一列换到行列式里，得D1,D2等
	x1 = D1/D 	x2 = D2/D ....
% 克莱姆法则求解齐次线性方程组的解
% 判断行列式是否为0，不为0即仅有零解，为0则有非零解
```

##### 求线性方程组得通解

```matlab
%A为系数矩阵，b为结果juz
%先用pinv求x0
	x0 = pinv(A)*b	(先format rat,然后x0 = A\b)
%然后求解
	z = null(A,'r')

```

#### 数学分析的基本运算

```matlab
%	复合函数
	z = compose(f,g)	%即Z(x)=f(g(x)) 
%	求解反函数
	gx = finverse(fx)
%	求数列与函数的极限
	limit(fx ,x,0)	%表示fx这个算式在x->0的情况下的极限值
%	求导数与偏导数
	diff(fx,x,1)	%表示求f的一阶导数
%	求不定积分
	int(y,x)		%表示y式的不定积分
%	求定积分
	int(fx,x,0,inf)	%表示fx在dx的情况下0到无穷大的定积分
```

##### 雅可比矩阵

```matlab
% 定义函数矩阵
f = [x*y*z; y; x+z];
v = [x,y,z];	%表示按dx,dy,dz的顺序求解jacobi矩阵
R = jacobian(f,v)
```

##### 求解多项式的根

```matlab
%比如多项式 x^3-6*x^2-72*x-27 = 0
	p = [1 -6 72 -27]
	r = roots(p)
```

#### 微分方程

```matlab
%	求解微分方程,fx为微分方程或方程组,cond为初始条件或边界条件，name表示变量，默认是t
	Y = dsolve('fx1,fx2...','cond1,cond2...','name')
```

#### Matlab作图

##### 作图的基本的操作

```matlab
	% 为图像起标题
		title('')
	%为x轴，y轴起标题
		xlabel('')
		ylabel('')
	%创建一个窗口
		figure
	%继续在这个窗口画图
		hold
	%起标识
		legend()
	%加网格线
		grid on
```

##### 作图

```matlab
	% 画散点图 
		scatter(X,Y,S,C)	%S是标记面积的大小，S为空则为默认大小，C为RGB值
%如scantter(X,Y,S，'r','filled')，用红色来画散点，filled为填充标记
	% 二维曲线
		plot(x,y)
		plot(x,y1,x,y2)
		plot(x,y,linespec)	%linespec为线型，标记，和颜色
	% rectangle函数作图
		rectangle('Position',[x,y,w,h])	%x，y为矩形左下角坐标，w为宽,h为高
		rectangle('Position',[x,y,w,h],'Curvature',cur)
		%加入曲率，cur为标量值，曲率从0-1，故[1 1]创建一个椭圆或者园
	% 产生网格
		meshgrid(x,y)	%从数组x,y产生网格
	% 画mesh图和surf图
		mesh(x,y,z)
		surf(x,y,z)
```

##### 动态

```matlab
	%二维彗星图
		comet(x,y,n)	%n表示轨迹尾线的长度，从0到1
```

