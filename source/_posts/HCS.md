---
title: HCS
categories:
  - 其他技术
date: 2019-11-25
description: HTML+CSS+JavaScript
cover: https://img.yww52.com/2019/11/2019-11-25top_img.jpg
---

## HTML

> Hyper Text Markup Language 		超文本标记语言
> 由标签构成的语言，标记语言不是编程语言

- HTML文档后缀名为html或htm

- 标签可分为围堵标签和自闭和标签。围堵标签就是有开始标签和结束标签，比如<html></html>。自闭和标签就是开始标签和结束标签是在一起的，比如 <br/>

- 标签可以嵌套

- 在开始标签中可以定义属性。属性是由键值对构成的，值需要用引号引出，单引号或双引号都可以

- 标签不区分大小写

  ```html
  <html>
      <head>
          <title> title </title>
      </head>
      <body>
          <font color="red">Hello world</font>
      </body>
  </html> 
  ```



### 标签

### 文件标签

- html :  html文档的根标签
- head：头标签。用于指定html文档的一些属性。引入外部资源
- title：标题标签
- body：体标签
- <！DOCTYPE html> html5中定义该文档是html文档

### 文本标签

```
1.<!-- 注释内容 -->		 	
   2. <h1> to <h6>  </h1>to</h6>	<!--标题标签-->
   3.<br/>或<br>				   <!--换行-->	
   4.<hr>				<!--一条水平线，属性color,width,size,align-->
   5.<p></p>						<!--段落标签-->
   6.<b></b>						<!--字体加粗-->
   7.<i></i>						<!--字体倾斜-->
 8.<font></font>			<!--字体标签,属性color,size,face-->
```

### 图片标签

```html
<img/>		<!--src属性表示图片路径-->
			<!--       相对路径
				1. 以./开头，表示当前目录
				2. 以../开头，表示表示后退一级到父目录
			-->
```

### 列表标签

```html
<ol type='A'>			<!--有序列表,type可以定义排列的样式-->
	<li>1</li>
	<li>2</li>
</ol>						
<ul type='disc'>			<!--无序列表,type可以定义排列的样式-->
	<li>1</li>
	<li>2</li>
</ul>			
```

### 链接标签

```html
<a href="http://www.baidu.com" >name</a>	
	<!--超链接 a-->		
	<!--href属性，指定访问资源的URL-->
	<!--target属性，打开资源的方式，默认值为_self，原网站打开.
	_blank，从新页面打开链接.-->
```

### div和span：

```html
<div></div>  		<!--每一个div占满一整行。块级标签-->
<span></span>		<!--文本信息在一行展示，行内标签，内联标签-->
```

### 语义化标签：

```html
<header></header>  
<footer></footer>
<!-- h5中为了提高程序的可读性-->
```

### 表格标签

```html
<table></table>		<!--定义表格，可以通过调整其属性来调整表格属性-->
<tr></tr>					<!--定义行-->
<td></td>		<!--定义单元格，colspan,rowspan属性关于单元格合并-->
<th></th>					<!--定义表头单元格-->
<caption></caption>			<!--表格标题-->
<thead></thead>				<!--表示表格头部份-->
<tbody></tbody>				<!--表示表格体部份-->
<tfoot></tfoot>				<!--表示表格尾的部份-->
```

### 表单标签

- **表单是用来采集用户输入的数据的，用于和服务器进行交互，使用到的标签有：form**

  ```html
  <!-- form:可以定义一个范围，代表采集用户数据的范围
  属性：1.action		指定提交数据的URL
  	2.method	  指定提交的方式，一共7种，get和post比较常用
  			get的请求参数会在地址栏中，而post不会，会封装在请求体中
  			get请求参数大小有限制，post没有限制
  			get不太安全，post较为安全
  	要想表单的数据被提交，一定要指定其name属性
  -->
  <form action="#" method="post">
  用户名：<input name="username"><br>
  密码：<input name="password"><br>
      <input type="submit" value="login">
  
  </form>
  ```

### **表单项标签**

  - input：可以通过type属性值，改变元素展示的样式

    ```html
    <form action="#" method="post">
        <!-- input的type属性的值text，password，radio，checkbox，file,hidden.-->
     	<!-- text为文本输入框，默认。password为密码输入框。radio单选框，checkbox复选框,file文件选择框，hidden隐藏域。-->
        用户名：<input type="text" name="username"><br>
        密码：<input type="password" name="password"><br>
    <!-- radio:要想让多个单选框的值实现单选，多个单选框的name值要一样，只要你选了，提交的属性值都是on，所以一般要个每一个单选框提供value属性，指定选中后提交的值。checked属性可以指定默认值-->
        性别：<input type="radio" name="gender" value="male">男
        	 <input type="radio" name="gender" value="female">女
        <br>
        <!--checkbox，类似radio的使用方法-->
        爱好：<input type="checkbox" name="hobby" value="game">游戏
        	 <input type="checkbox" name="hobby" value="java"><br>java
        <br>
        <!--     -->
        图片：<input type="file" name="file"><br>
        隐藏域：<input type="hidden" name="hidden"><br>
        
       <label>用户名：</label> <input type="text" name="username"><br>
        
        <!--input type属性还可以定义按钮，比如sumit提按钮，button普通按钮，
    			  image图片提交按钮-->
    	<input type="sumit" value="login"><br>
        <input type="button" value="login"><br>
        <input type="image" src=" "><br>
         
        <!--input type一些有用的属性-->
        取色器：<input type="color" name="color"><br>
        生日：<input type="date" name="birthday"><br>
        生日：<input type="datetime-local" name="birthday"><br>
        邮箱：<input type="email" name="email"><br>
        年龄：<input type="number" name="number"><br>
    
    </form>
    ```

  - select：下拉列表

    ```html
    省份：<select name="province">	 <!--option是用来定义列表项的-->
         <option value="">--请选择--</option>
         <option value="1">广西</option>
         <option value="2">上海</option>
         <option value="3">北京</option>
    ```

  - testarea：文本域

    ```html
    文本域：
    <testarea cols="20" rows="5" name="me"></testarea>
    <!--
    	cols指定每一行有多少个字符
    	rows默认行数，多了会自动扩容
    -->
    ```

  - label标签：指定输入项的文字描述信息




## CSS

> Cascading    Style    Sheets		层叠样式表
>
> 层叠表示多个样式可以作用在同一个html元素上，使其同时生效

### CSS的基本使用

#### 内联样式

```html
<!--   
			内联样式
 在标签内使用style属性指定css代码
-->

<div style="color: brown">

    hello world

</div>
```

#### 内部样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>内部样式</title>
<!--
		内部样式
	在head标签里面定义style标签，style标签内写css的代码
-->
    <style>
        div{
            color: aqua;
        }
    </style>
</head>
<body>

<div>	hello world	</div>

</body>
</html>
```

#### 外部样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>外部样式</title>
<!--
					外部样式
	先定义一个cs资源文件(后缀名为css)，里面写css代码
	然后在head标签内定义link标签，引入这个资源文件
比如这个l.css内容为：
		 div{
            color: aqua;
        }
	不用link标签的话还可以写为
            <style>
            @import"l.css"
            </style>
-->
    <link rel="stylesheet" href="l.css">

</head>
<body>
    
<div>	hello world	</div>
    
</body>
</html>
```



### CSS语法

#### 选择器

- 基础选择器

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>基础选择器</title>
  	<!--
  	   基础选择器
  1.id选择器，#id属性值{}
  2.元素选择器，就是之前用的div{}
  3.类选择器：.class{}
  		id选择器优先级高于元素选择器，类选择器优先级比元素选择器高
  -->
      <style>
           #div1{
                  color: aqua;
          }
           div{
                  color:red;
          }
           .cls1{
                  color: darkblue;
          }
      </style>
  </head>
  <body>
  	<div id="div1">hello world  </div>
  	<div > hello world </div>
      <div class="cls1">hello world</div>
  </body>
  </html>
  ```

- 扩展选择器

  ```html
  <!--
  1. 选择所有的元素						   *{}
  2. 并集选择器						    选择器1,选择器2{ }
  3.子选择器，筛选1的元素下的选择器2			  选择器1 选择器2{ }
  4.父选择器，筛选了2的父元素的选择器1		 选择器1>选择器2{ }
  5.属性选择器，选择元素名称，属性名=属性值元素	元素名称[属性名="属性值"]{ }
  6.伪类选择器，选择一些元素具有的状态		元素:状态{ }
  	比如标签<a>,就有四种状态：初始化link,被访问过visited,
  					正在访问active，鼠标悬浮状态hover
  -->
  ```

#### 属性

- 文本，文字

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>属性</title>
  <!--	1.颜色color，2.字体大小font-size，
  		3.text-align对齐方式，4.line-height行高
  -->
      <style>
          p{
              color: brown;				
              font-size: 30px;
              text-align: center;
              line-height: 100px;
          }
      </style>
  </head>
  <body>
  <p>    hello world     </p>
      <div></div>
  </body>
  </html>
  ```

- 背景
  background

- 边框

  ```html
    <style>
          p{
              border:1px solid red;	/*	border:像素 实现 颜色，
              						这个是复合标签控制了边框的四条边*/
          }
      </style>
  ```

- 尺寸

  ```html
   <style>
          div{
              border: 1px solid red;
              height:200px;		/*height高度，width宽度*/
              width:200px;
          }
      </style>
  ```

- 控制布局

  ```html
  <!--	
  		1.margin	外边距
  		2.padding	内边距
  				内边距一般会影响整个边框的大小，可以设置一个属性
  					box-sizing:border-box来决定盒子的大小不会改变
  		3.flot		浮动
  -->
  ```



## JavaScript

> JavaScript是一门客户端脚本语言
>
> JavaScript是在客户端浏览器中运行的，不需要编译，直接就可以被浏览器解析
>
> JavaScript = ECMAScript + JavaScript特有特性(BOM+DOM)

### ECMAScript

#### 与html结合方式

```html
<!DOCTYPE html>
<html lang="en">
    <!--script标签可以放在各种位置，只是执行的顺序不同-->
<head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
<!--第一种结合方法：内部-->
    <script>
        alert("helloworold");
    </script>
<!--第二种结合方法外部-->
    <script src="1.js"></script>
</head>
<body>
</body>
```

#### 注释

- 单行	//注释内容
- 多行    /*注释内容*/

#### 数据类型

- 原始数据类型
  - number			数字。		整数/小数/NaN
  - string                字符串        "abc"  "a"  'a'
  - boolean            true和false
  - null                   一个对象为空的占位符
  - undefined         未定义。即没有给一个变量给初始化值，默认为undefined
- 引用数据类型

#### 变量

- Java是强类型的，在定义变量的时候会定义了该变量的类型，开辟的空间只能放该类型的数据
- JavaScript是弱类型的，不定义变量的类型，开辟好的空间可以放任意类型的值
- 定义变量                 var   变量名 = 初始值
- 可以使用typeof运算符来得出该变量的类型

#### 运算符

- +正号            		

在JS中，如果运算数不是所要求的类型，js就会进行自动转换，如

string转number，会按字面值转，如果是英文则会转成NaN（一个不是数字的数字）。

boolean转number，true转为1，false转为0

- 比较运算符(>		<	==)
  - 类型相同，直接比较，比如字符串比较，按字典顺序逐一比较
  - 类型不同，先转换在比较

- ===全等于

在比较前线判断类型，类型不一样直接返回false，比如"123"==123返回true，而"123"===123返回false

- 逻辑运算符(&&	||	!	)
  - number转boolean        0为假，非0为真
  - string转boolean            除了空字符串，其他都是true
  - null和undefined            都是false
  - 对象                                 所有对象都是true



#### 对象

##### Function对象

- **这是一个函数对象**，就像是Java中方法和对象的结合体，有点特殊

- 创建方式

  ```javascript
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Function对象</title>
  </head>
  <body>
  <script>
      // 1.		var fun = new Function(形参，方法体);
          var fun1 = new Function("a","b","alert(a+b)");
      fun1(1, 2);
      //2.		function fun(形参){	方法体	  }
          function fun2(a,b){
              alert(a + b);
          }
      fun2(1, 3);
      //3.		var fun = function(形参){  方法体  }
          var fun3 = function (a,b) {
              alert(a + b);
          }
      fun3(1, 4);
  
  </script>
  </body>
  </html>
  ```

- length属性
  表示形参的个数，有点像使用对象的属性，直接函数名.length就可以返回该函数的形参个数

- **注意的特殊地方**

  1. 形式参数不用定义，即不用var来定义形参

  2. 这里的函数其实就是对象，可以重新为该函数来赋值，即可以再次定义,这里就感觉像该对象被重新赋值，跟Java中的方法还是有很大区别

     ```JavaScript
     // 上面定义了fun3，现在也可以重新定义
     	fun3 = function(形参){	方法体		}
     ```

  3. 关于方法的调用。在Java中方法调用传入的数一定要和形参相同，而在JS中，方法的调用只与方法名称有关，传入的参数不和形参个数一样也能调用，即使不传参数也能调用。

  4. 在方法声明中会有一个隐藏的内置对象，即一个数组(arguments)，封装所有的实际参数，所以实际参数比形参个数要多时，它也会接收到多出来的实参

     ```JavaScript
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <title>Function对象</title>
     </head>
     <body>
     <script>
          function fun() {
             var sum = 0 ;
             for(var i = 1;i<arguments.length;i++){
                 sum = sum + arguments[i];
             }
             return sum;
         }
         var sum = fun(1, 2, 3);
         alert(sum);
         sum = fun(1, 2, 3,4,5);
         alert(sum);
     </script>
     </body>
     </html>
     ```

##### Array

- 创建方式

  ```JavaScript
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Array对象</title>
  </head>
  <body>
  <script>
      //1.      var array = new Array(元素)
          var array1 = new Array(1,2,3,4,5);
      document.write(array1,"<br>");
      //2.      var array = new Array(size)
          var array2 = new Array(5);
      document.write(array2,"<br>");
      //3.      var array = [元素]
          var array3 = [1,2,3,4,5];
      document.write(array3,"<br>");
  
  </script>
  </body>
  </html>
  ```

- length属性
  返回数组的长度

- 常用方法

  1. join(分隔符)
     将数组中的元素按照指定的分隔符拼接为字符串

  2. push(元素)

     为数组添加元素

- **注意的特殊地方**

  1. 数组里的数据可以是不同类型。在Java中数组定义时就规定了类型，而在JS中，数组时可以放进去不同类型的参数的
  2. JS中，数组的长度时可以变化的，即你访问了越界，即返回undefined值

##### Date

- 创建方式

  ```javascript
  	var date = new Date()
  ```

- 一些方法

  1. toLcaleString()			返回当前date对象对应的时间本地字符串格式
  2. getTime()                     返回当前对象的时间到1970年1月1日零点的毫秒差		

##### Math

- Math不用创建，直接使用方法就可以了，与Java类似
- 方法
  1. random()					返回0~1的随机数，含0不含1
  2. round(x)                      返回四舍五入为最接近的整数
  3. ceil(x)                           返回对数进行向上取整
  4. floor(x)                        返回对数进行向下取整





> 虽然大致学过一遍，久了又忘记了