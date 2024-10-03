## 简介

大家好，我们是 **NOP Team**，我们是一家做安全服务的公司，平时在做渗透测试工作的过程中，经常会遇到一个问题，工作场景IP地址不固定，相信很多朋友也遇到，尤其是出差等场景。

常规情况下，渗透测试工作开始前需要在授权委托书中写明本次测试使用的IP地址，但是如果IP地址可能会变化，那么可能要求会放宽，也就是渗透测试结束后，提交在此期间使用过的IP地址

最近在练习 Electron 开发，于是开源了一款工具 —— `IP Recorder` 来解决这个问题



## v1.1.0 版本更新日志

> 2024-10-03
>
> 修复程序一直获取IP地址的问题，这个问题的本质是 api.ipify.org  被封了，现在提供了多种选择，且提供了配置选项
>
> <img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-121452.png" style="zoom:50%;" />
>
> Windows 平台增加了自动创建桌面快捷方式
>
> <img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-121534.png" style="zoom:50%;" />
>
> 完善了配置功能，配置代理或者选择获取IP地址信息来源后，主页面显示当前IP信息处会实时更新



## 下载地址 

**Github**

> https://github.com/Just-Hack-For-Fun/IP-Recorder



**百度云盘**

> https://pan.baidu.com/s/1oDTbTX1XWvsJ8TqSfJ46dQ?pwd=9vn7



## 使用方法

在 MacOS 中，打开程序会跳出下面的窗口，经过排查，应该是因为存储使用了 `electron-store` ，而这个库在 MacOS 上存储加密导致出现下面的提示，直接点击拒绝即可 

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-061755.png" alt="image-20240911141754863" style="zoom:50%;" />

程序主页面如下：

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-062044.png" alt="image-20240911142043691" style="zoom:50%;" />

功能比较直观，左侧部分是控制开始、暂停、继续、停止的按钮，中间部分显示当前IP地址信息，右侧是设置以及导出结果

本程序记录IP地址以及IP归属地使用的接口如下

```
https://myip.ipip.net   // 默认接口
https://api.ipify.org/?format=json  // 使用 https://ip.taobao.com 获取IP归属地
https://webapi-pc.meitu.com/common/ip_location
http://demo.ip-api.com/json/?lang=zh-CN
```

可以通过程序设置 -> 数据接口 进行配置



目前程序可设置项如下

**代理设置**

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-122448.png" alt="image-20241003202447997" style="zoom: 50%;" />

每次设置代理后，主页面的当前IP会立即刷新，记录结果会在 1 分钟内刷新



**数据接口**

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-122606.png" alt="image-20241003202605887" style="zoom:50%;" />

目前第二个 (`ipify`) 被防火墙拦截，其他三个可直接使用，默认为第一个



**请求设置**

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-122704.png" alt="image-20241003202704519" style="zoom:50%;" />



**主题模式**

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-10-03-122717.png" alt="image-20241003202717574" style="zoom:50%;" />



程序运行后，会有一个托盘图标，这样即使不小心关闭了主窗口，也不会导致记录中断

![](http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-063515.png)



程序每次开始时会检测是否存在之前的记录，根据实际情况可以选择继续记录或者开启新记录

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-063600.png" alt="image-20240911143559659" style="zoom:50%;" />



渗透测试等工作结束后，可以停止记录，导出结果（当然可以随时导出结果）

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-063712.png" alt="image-20240911143711689" style="zoom:50%;" />

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-065705.png" alt="image-20240911145704651" style="zoom:50%;" />



## 手工编译

如果大家希望手工编译，也非常简单，安装 `Node.js` 最新版，下载源代码，在源代码根目录执行以下命令

```bash
npm i 
npm run make 
```

需要确保这两个命令执行环境可以访问 Github 等

最后一个命令执行后可能会报一个提示

![](http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-071948.png)

这个错误不影响结果



之后在 out 目录下就生成了打包好的程序

![](http://mweb-tc.oss-cn-beijing.aliyuncs.com/2024-09-11-072158.png)

