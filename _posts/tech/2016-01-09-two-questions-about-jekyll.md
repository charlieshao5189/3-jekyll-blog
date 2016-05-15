---
layout: post
title: jekyll建站遇到的两个小问题
category: 技术
tags: 算法
keywords: 算法,排序,Sort,Algorithm
---
今天遇到了两个小问题：视频和标题不被markdown解析

## 1. 视频

想要添加一个已经上传到优酷的视频，按照网上添加视频的方法复制添加了如下代码：

```HTML
<iframe height=498 width=510 src="http://player.youku.com/embed/XOTIzMDI3Nzky" frameborder=0 allowfullscreen></iframe>
``` 
结果这段代码完整地被显示了出来，考虑原因应该是这段代码被markdown当成了普通文本，没有被解析嵌入html文件。在网上寻找没有显示的原因有很多解释：比如去掉allowfullscreen，"allowfullscreen"换成"allowfullscreen=1","</iframe>"前加空格,等等。试了之后通通没有效果，于是开始找别人的代码贴上去验证，下面的完美代码显示：

```
<iframe width="560" height="315" src="http://www.youtube.com/embed/SqYiglufb8Y" frameborder="0"> </iframe>
``` 
验证之后发现秘密在于参数的"",不加上就不能被markdown解析。

## 2. 标题
用"#"添加标题，没有显示效果，只显示"#标题"，解决办法是：在此行之前添加空行，并且"标题"之前加空格。
