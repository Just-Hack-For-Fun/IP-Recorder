## 简介

大家好，我们是 **NOP Team**，我们是一家做安全服务的公司，平时在做渗透测试工作的过程中，经常会遇到一个问题，工作场景IP地址不固定，相信很多朋友也遇到，尤其是出差等场景。

常规情况下，渗透测试工作开始前需要在授权委托书中写明本次测试使用的IP地址，但是如果IP地址可能会变化，那么可能要求会放宽，也就是渗透测试结束后，提交在此期间使用过的IP地址

最近在练习 Electron 开发，于是开源了一款工具 —— `IP Recorder` 来解决这个问题


<br>

## 下载地址 

**Github**

> https://github.com/Just-Hack-For-Fun/IP-Recorder


**百度云盘**

> https://pan.baidu.com/s/1oDTbTX1XWvsJ8TqSfJ46dQ?pwd=9vn7


<br>

## 使用方法

程序主页面如下：

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2025-01-03-185352.png" alt="image-20250104025351265" style="zoom:50%;" />

功能比较直观，左侧显示IP信息，右侧是记录的控制按钮，最右侧为工具栏，可以点击设置按钮进入设置页面

<img src="http://mweb-tc.oss-cn-beijing.aliyuncs.com/2025-01-03-185604.png" alt="image-20250104025604369" style="zoom:50%;" />



设置页面可以进行相关配置

本程序记录IP地址以及IP归属地使用的接口如下

```
https://myip.ipip.net/json
https://api.ipify.org/?format=json  // 使用 https://ip.taobao.com 获取IP归属地
https://qifu-api.baidubce.com/ip/local/geo/v1/district
http://demo.ip-api.com/json/?lang=zh-CN
```


<br>

## 手工编译

如果大家希望手工编译，也非常简单，安装 `Node.js` 最新版，下载源代码，在源代码根目录执行以下命令

```bash
npm i 
npm run build:mac   # 编译 MacOS 版本
npm run build:win   # 编译 Windows 版本
npm run build:linux # 编译 Linux 版本
```

如果出现网络错误，可以考虑设置 npm 国内源

![image-20250104030222919](http://mweb-tc.oss-cn-beijing.aliyuncs.com/2025-01-03-190223.png)

之后在 dist 目录下就生成了打包好的程序

![image-20250104030249564](http://mweb-tc.oss-cn-beijing.aliyuncs.com/2025-01-03-190249.png)

