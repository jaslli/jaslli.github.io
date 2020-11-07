---
title: JDBC
categories:
  - Java
date: 2019-11-06 22:01:10
description: JDBC是用来规范客户端程序如何来访问数据库的应用程序接口。
cover: https://img.yww52.com/2019/11/2019-11-06top_img.jpg
---
## MySQL的安装

   去Mysql官网下载即可

## 数据库管理工具

   因为MySQL命令行操作在用起来十分繁琐，所以需要选择一个数据库的管理工具，方便使用MySQL，推荐使用  navicat

## 装载驱动

1. 为什么要装驱动
   			在编程中连接数据库时，必须先装载特定厂商的数据库驱动程序，不同的数据库有不同的装载方法。驱动就是各个数据库厂商实现的Sun公司提出的jdbc接口。即对connection等接口的实现类的jar文件。

2. 下载驱动

   首先要先去官网下载好对应版本的jar包，我的就是**mysql-connector-java-8.0.18**，版本要对应，不知道版本的可以使用命令行进去MySQL然后输入命令\s来查看版本

## 连接数据库

1. 旧版本的连接(8.0版本之前)	

     ```java
    //装载MySQL驱动
        Class.forName("com.mysql.jdbc.Driver");
    //连接MySQL数据库
        connection con = 
                DriverMannager("jdbc:mysql://host:localhost/database","user","password");
    ```

2. **MySQL8.0之后的版本连接数据库时不需要建立SSL连接，需要显示关闭，最后还要设置CST才能连接**

    ``` java
    //					装载驱动
    	Class.forName("com.mysql.cj.jdbc.Driver");
    //					连接MySQL数据库
    	connection con =DriverMannager("jdbc:mysql://localhost:port/database?useSSL=false&serverTimezone=UTC","user","password");
    ```

{% note info%}

localhost是你数据库的主机名,port数据库的端口,database时库名
user和password时用户名和密码，因人而异
连接对象内部其实包含了Socket对象，是一个远程连接，比较耗时

{% endnote%}

## 数据库的接口使用

### Statement接口

1. 由createStatement创建，用于发送简单的不带参数的sql语句

	``` java
    Statement stm = con.createStatement();
    String name = "学生1";
    String sql = "";				//这里就加入你想使用的sql语句
    stm.execute(sql);
	```

	 一般也不会使用Statement接口，因为会出现sql注入的危险，比如：

	``` java
    Stament stm = con.createStatement();
    String id = "5 or 1=1";				
		//如果外界恶意添加or 1=1或其他一些语句，就会使数据库不安全，这里就会删除很多数据
    String sql = "delete frome test where id ="+id;				
    stm.execute(sql);
	```

### Statement常用的三个方法

1. **execute()**			运行语句，返回是否有结果集，Boolean类型

2. **executeQuery()**		运行select语句，返回ResultSet结果集

    ```java
    String sql = "select * from jdbctest  where id>?";
     PreparedStatement ps = conn.prepareStatement(sql);
     ps.setObject(1,2);		//把id大于2的记录取出来
     ResultSet rs = ps.executeQuery();
     while(rs.next()){		//next()返回是Boolean值，游标会不断移动来判断数据是否存在
          System.out.println(rs.getInt(1)+"-----"+rs.getString(2)+"-----"+rs.getString(3));
    ```

3. **executeUpdate()**		运行insert/update/delete操作，返回更新的行数

### PreparedStatement类

**继承Statement接口**，由prepareStatement创建，用于发送含有一个或多个输入参数的sql语句，PrepareStatement对象比Statement对象效率更高，而且可以防止SQL注入，推荐使用

```java
  String sql = "insert into jdbctest (username,pwd) values(?,?)";	//?为占位符
         PreparedStatement ps = con.prepareStatement(sql);
//传入占位符里的参数，参数索引要从1开始，参数处理都可以用setObject()来代替
         ps.setString(1,"lili");			
         ps.setString(2,"1141");
         ps.execute();
//直接用setObject()也可以
		ps.setObject(1,"li");
```

## 关闭

``` java
  if(rs!=null){
                rs.close();	
            }
  if(ps!=null){
                ps.close();
            }
  if(conn!=null) {
                con.close();
            }
```

 **后打开的先关闭，比如resultset-->statment--->connection这样的顺序关闭，不要合在一起关闭哦**

## 批量处理

- Batch

- 对于大量数据的处理，建议使用Statement，因为PreparedStatement的预编译空间有限，数据多时会出现异常

- 还有就是设置为手动提交事务

  ```java
  package jabc_Test;
  import java.sql.*;
  
  public class demo01 {
      public static void main(String[] args) throws Exception {
  //          加载驱动类
           Class.forName("com.mysql.cj.jdbc.Driver");
  //         连接MySQL数据库
           Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC",
                   "root","password");
           Statement smt = con.createStatement();	//使用statement
  
          
           con.setAutoCommit(false);        //原本是自动提交事务的，现在设为手动
           for(int i =0; i<2000 ; i++ ){
               smt.addBatch("insert into jdbctest (username,pwd) values ('li"+i+"','11111')");
           }
          smt.executeBatch();
           con.commit();      //提交事务
  
          if(smt!=null){
              smt.close();
          }
          if(con!=null) {
              con.close();
          }
      }
  }
  ```

## 事务

### 基本概念

- 一组要么同时执行成功，要么同时执行失败的SQL语句，事务是数据库操作的一个执行单元
- 事务开始于：
  - 连接到数据库上，并执行一条DML语句(insert,update或delete)
  - 前一个事务结束后，又输入另外一条DML语句
- 事务结束于：
	- 执行了commit或rollback语句
	- 执行一条DDL语句，比如create table语句；这种情况下为自动执行了commit语句
	- 执行了一条DCL语句，例如grant语句；这种情况下为自动执行commit语句
	- 断开于数据库的连接
	- 执行了一条DML语句，但语句失败了，这种情况中会为这个无效的DML语句执行rollback语句

### 事务的四大特点(ACID)

- atomicity(原子性)
	表示一个事务内的所有操作时一个整体，要么全部成功，要么全部失败
- consistency(一致性)
	表示一个事务内一个操作失败时，所有更改的数据都会回到事务执行之前
- isolation(隔离性)
	事务查看数据时数据所处的状态，要么是另一事务修改它之前的状态，要么是另一事务修改它之后的状态，不会查看中间状态的数据，具体看下面的事务隔离级别
- durability(持久性)
	持久性事务完成之后，修改时永久的

### 事务隔离级别(从低到高)

- 读取未提交
- 读取已提交
- 可重复读
- 序列化
	

## CLOB与BLOB

### CLOB

- 用于存储大量的文本数据
- 大字段的操作常常是以流的方式来处理的
- MySQL相关的类型
  - tinytext							最大长度为255字符的TEXT列(2^8-1)
  - text                                    最大长度为65535字符的TEXT序列(2^16-1)
  - mediumtext                    最大长度为16777215字符的TEXT序列(2^24-1)
  - longtext                            最大长度为4294967295字符的TEXT序列(2^32-1)

```java
package jabc_Test;
import java.io.*;
import java.sql.*;
public class demo01 {
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection con = DriverManager.getConnection
                ("jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC", "root", "password");
        PreparedStatement ps = con.prepareStatement("insert into jdbctest(username,info1,info2) values (?,?,?)");    //info1,info2类型都是longtext
        ps.setString(1,"li");


//        1.将文本文件内容输入到数据库中
        ps.setClob(2,new FileReader(new File("li.txt")));
        
//        2.将字符串输入到数据库中
        ps.setClob(3, new BufferedReader(new InputStreamReader(new ByteArrayInputStream("hello".getBytes()))));
        
        ps.executeUpdate();
// 后面记得close
    }
}
```

### BLOB

- 用于存储大量的二进制数据
- 与CLOB类似，常常也是以流的方式处理
- MySQL中相关类型
  - tinyblob							最大长度为255字符的BLOB列(2^8-1)
  - blob                                    最大长度为65535字符的BLOB序列(2^16-1)
  - mediumblob                    最大长度为16777215字符的BLOB序列(2^24-1)
  - longblob                            最大长度为4294967295字符的BLOB序列(2^32-1)

```java
package jabc_Test;
import java.io.*;
import java.sql.*;
public class demo01 {
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection con = DriverManager.getConnection
                ("jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC", "root", "password");
        PreparedStatement ps = con.prepareStatement("insert into jdbctest(username,heading) values (?,?)");
        ps.setString(1,"li");

       ps.setBlob(2,new FileInputStream("background.png"));
        ps.execute();
    }
}
```



## 简单的dao层设置

```Java
public class Basedao {

    static{
        //加载驱动
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    //连接数据库
    public static Connection getconn(){
        //建立连接对线
        Connection conn = null;
        try {
            conn = DriverManager.getConnection
("jdbc:mysql://localhost:3306/shop?useSSL=false&serverTimezone=UTC","root","password");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }

    //执行sql语句操作
    public static int exectuIUD(String sql,Object[] params){
            int count = 0;
            Connection conn = Basedao.getconn();
        //准备SQL
        PreparedStatement ps = null;
        try {
            ps = conn.prepareStatement(sql);
            for(int i =0;i<params.length;i++){
                ps.setObject(i+1,params[i]);
            }
           count =  ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            Basedao.closeall(null,ps,conn);
        }
        return count;
    }

        //关闭所有连接
    public static void closeall(ResultSet rs,PreparedStatement ps,Connection conn){
            try {
                if(rs!=null)
                    rs.close();
                if(ps!=null)
                    ps.close();
                if(conn!=null)
                    conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
	}
```

