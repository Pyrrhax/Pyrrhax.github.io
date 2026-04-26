---
title: "Windows身份认证过程及工作组/域"
date: "2020-09-22T20:50:17+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["Windows","渗透测试","信息安全"]
legacyPath: "/posts/2d3c3cc.html"
---
<h2 id="Windows身份认证过程"><a href="#Windows身份认证过程" class="headerlink" title="Windows身份认证过程"></a>Windows身份认证过程</h2><ul>
<li>开机加载操作系统内核，windows启动之后，进入ntlogon.exe，即输入用户名和密码的界面。</li>
<li>当点击确定后，ntlogon.exe调用lsass.exe（Local Security Assistant）的LsaLogonUser API,该API 调用MSV_1_0身份验证程序包，MSV 身份验证包将用户记录存储在 SAM 数据库（C:\Windows\System32\config）中。
<ul>
<li>ntlogon.exe会计算密码的LM(LAN Managere) Hash和NT(Windows NT) Hash</li>
<li>lsass.exe会将这两种hash与SAM数据库中的进行对比。</li>
<li>登陆成功后，会指派一个权限令牌，在该用户的lsass.exe进程中。</li>
</ul>
</li>
<li>远程登陆也是在本地计算好LMHash和NTHash，在网络中传输的是Hash而不是明文密码。</li>
<li>不同的登陆方式，在服务器端处理的方式也不同,大概有十几种：<ul>
<li>本地登陆：NTML security package</li>
<li>域登陆：域控制器服务器kerbros协议来响应，kerbros security package</li>
<li>远程登陆：remote desktopsecurity package</li>
<li>在多个服务器端的安全包中，其中有1个包（wdigest）在内存中缓存了当前登陆用户的明文密码</li>
</ul>
</li>
<li>推荐阅读<a href="https://support.microsoft.com/zh-cn/help/102716/ntlm-user-authentication-in-windows" target="_blank" rel="noopener">Windows 中的 NTLM 用户身份验证</a></li>
</ul>
<h2 id="工作组"><a href="#工作组" class="headerlink" title="工作组"></a>工作组</h2><ul>
<li>工作组就类似于目录，谁想加入某个工作组只要把工作组名字改成那个工作组即可。</li>
<li>访问网络中的计算机（文件共享）默认使用Guest账号，需要在被访问的计算机启用Guest用户并允许Guest用户远程登陆<ul>
<li>启用Guest用户：此电脑–》管理–》本地用户和组–》用户–》Guest–》取消打勾“账户已禁用”。</li>
<li>允许用户远程登陆：控制面板–》管理工具–》本地安全策略–》本地策略–》用户权限分配–》找到 “拒绝从网络访问这台计算机”–》删掉其中的Guest这行。</li>
</ul>
</li>
</ul>
<h2 id="域"><a href="#域" class="headerlink" title="域"></a>域</h2><ul>
<li>而域则有一个域控制器（安装ActiveDirectory域控制服务的主机）来注册和管理域中的设备。</li>
<li>加入域的计算机在开机时或注销后可以选择登陆到域还是登陆到本机。</li>
<li>登陆到域需要使用域的用户和密码，一般管理员会给每个人都分配一个用户名和密码。</li>
</ul>
<h3 id="操作"><a href="#操作" class="headerlink" title="操作"></a>操作</h3><ul>
<li>Win+R运行dcpromo将本机升级为域控制器</li>
<li>Win=R运行dsa.msc管理域中的用户和设备</li>
</ul>
<h2 id="微软账户和本地用户"><a href="#微软账户和本地用户" class="headerlink" title="微软账户和本地用户"></a>微软账户和本地用户</h2><ul>
<li>本地用户在数据在重装系统后丢失，微软账户可以同步OneDrive，邮件等等内容。</li>
</ul>
<h2 id="用户密码和PIN"><a href="#用户密码和PIN" class="headerlink" title="用户密码和PIN"></a>用户密码和PIN</h2><ul>
<li>PIN是Windows系统新添加的一套本地密码策略，不仅提高安全性，而且也可以让很多和账户相关的操作变得更加方便。与微软账户和本地用户无关。<ul>
<li>设置PIN:设置–》账户–》登陆选项–》Windows Hello PIN</li>
</ul>
</li>
</ul>
<h2 id="远程连接"><a href="#远程连接" class="headerlink" title="远程连接"></a>远程连接</h2><ul>
<li>远程连接网络中的win10设备，需要在被连接的设备上设置”允许远程连接“，第一次连接需要输入用户名和密码，之后则需要在控制面板–》凭据管理器 中修改。</li>
<li>密码为空的账户默认无法远程登陆，需要在本地安全策略中修改。<ul>
<li>控制面板–》管理工具–》本地安全策略–》安全选项–》”账户：使用空密码的本地账户只允许进行控制台登陆“修改为禁用。</li>
</ul>
</li>
</ul>
<h2 id="其它"><a href="#其它" class="headerlink" title="其它"></a>其它</h2><p>微软相关认证MSCE,MCST等</p>
<p>SAM    (Security Account Manager)安全帐户管理器 </p>
<p>OWF    (One way function)单向函数</p>
