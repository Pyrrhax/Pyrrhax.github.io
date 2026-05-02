---
title: "Web扫描工具-w3af"
date: "2020-10-12T17:13:50+08:00"
description: "最后安装webkit还有问题，libpango1.0-0 python-gek2 not installed 用下面的方法解决"
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "Web安全", "漏洞分析", "信息收集", "CSRF", "Hexo", "博客搭建"]
legacyPath: "/posts/aaf72ae0.html"
topic: security
subtopic: blogging
qualityScore: 53
---
<h2 id="w3af"><a href="#w3af" class="headerlink" title="w3af"></a>w3af</h2><ul>
<li>Web Application Attack and Audit Framework,基于python语言开发</li>
<li>此框架的目标是帮助你发现和利用所有WEB应用程序漏洞</li>
<li>9大类近150个plugin<ul>
<li>audit</li>
<li>infrastructure</li>
<li>grep</li>
<li>evasion</li>
<li>mangle 正则替换</li>
<li>auth</li>
<li>bruteforce</li>
<li>output</li>
<li>crawl</li>
</ul>
</li>
</ul>

<h3 id="安装"><a href="#安装" class="headerlink" title="安装"></a>安装</h3><p>cd ~<br>apt-get install -y python-pip<br>pip install –upgrade pip<br>git clone https/github.com/andresriancho/w3af.git<br>cd w3af<br>./w3af_console<br>. /tmp/w3af_dependency_install.sh</p>
<p>此时w3af_console可用，但是w3af_gui还有问题</p>
<p>安装python-webkit</p>
<ul>
<li><p>wget <a href="http://ftp.br.debian.org/debian/pool/main/p/pywebkitgtk/python-webkit_1.1.8-3_amd64.deb" target="_blank" rel="noopener">http://ftp.br.debian.org/debian/pool/main/p/pywebkitgtk/python-webkit_1.1.8-3_amd64.deb</a></p>
<ul>
<li><p>wget <a href="http://ftp.br.debian.org/debian/pool/main/w/webkitgtk/libjavascriptcoregtk-1.0-0_2.4.11-3_amd64.deb" target="_blank" rel="noopener">http://ftp.br.debian.org/debian/pool/main/w/webkitgtk/libjavascriptcoregtk-1.0-0_2.4.11-3_amd64.deb</a></p>
<ul>
<li>从<a href="http://ftp.de.debian.org/debian/pool/main/i/icu/" target="_blank" rel="noopener">http://ftp.de.debian.org/debian/pool/main/i/icu/</a> 下载libicu57</li>
</ul>
</li>
<li><p>wget <a href="http://ftp.br.debian.org/debian/pool/main/p/python-support/python-support_1.0.15_all.deb" target="_blank" rel="noopener">http://ftp.br.debian.org/debian/pool/main/p/python-support/python-support_1.0.15_all.deb</a></p>
<ul>
<li>补全python库环境</li>
</ul>
</li>
</ul>
</li>
<li><p><code>apt install python-dev build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev</code></p>
<ul>
<li>``````apt –fix-broken install```</li>
</ul>
<ul>
<li><p>wget <a href="http://ftp.br.debian.org/debian/pool/main/w/webkitgtk/libwebkitgtk-1.0-0_2.4.11-3_amd64.deb" target="_blank" rel="noopener">http://ftp.br.debian.org/debian/pool/main/w/webkitgtk/libwebkitgtk-1.0-0_2.4.11-3_amd64.deb</a></p>
<ul>
<li><code>apt-get install libegl1-mesa</code></li>
</ul>
</li>
<li><p><code>apt-get install libegl1-x11</code></p>
</li>
<li><p>最后安装webkit还有问题，libpango1.0-0 python-gek2 not installed 用下面的方法解决</p>
<ul>
<li><code>sudo apt-get install --reinstall python</code></li>
</ul>
</li>
<li><p><code>apt --fix-broken install</code></p>
</li>
</ul>
</li>
<li><p>python-webkit安装好后执行./tmp/w3af_dependency_install.sh。报没有python-gtksourceview2</p>
<ul>
<li><a href="https://packages.debian.org/stretch/amd64/python-gtksourceview2/download" target="_blank" rel="noopener">https://packages.debian.org/stretch/amd64/python-gtksourceview2/download</a> 这里下载<ul>
<li>安装时依赖 libgtksourceview2.0-0</li>
</ul>
</li>
</ul>
</li>
<li><p>python-pip 等需要安装什么 直接搜 xxx deb，就有可以下载的地方</p>
</li>
</ul>
<h3 id="操作"><a href="#操作" class="headerlink" title="操作"></a>操作</h3><ul>
<li>help一下就知道了- -</li>
<li>可以把命令写程一个脚本 直接<code>w3af_consol -s xxx.w3af</code></li>
</ul>
<h4 id="w3af身份认证"><a href="#w3af身份认证" class="headerlink" title="w3af身份认证"></a>w3af身份认证</h4><ul>
<li>http basic<ul>
<li>Authorization：basic</li>
<li>路由器就是这种， 字段，base64编码，抓包就可以直接看到用户名密码。</li>
</ul>
</li>
<li>ntlm<ul>
<li>http头Authorization：ntlm</li>
<li>微软专有的身份认证：<ul>
<li>首次GET，服务器会返回401此时在浏览器弹出输入框</li>
<li>输入点击确认后，会再次发起GET附带messg1</li>
<li>服务器返回401附带messg2，其中包含1个随机数</li>
<li>浏览器再次发起GET请求，附带messg3,包含加密后的随机数密文</li>
<li>服务端返回登陆结果</li>
</ul>
</li>
<li>参考博客：<a href="https://www.cnblogs.com/huangyong9527/articles/1844553.html" target="_blank" rel="noopener">https://www.cnblogs.com/huangyong9527/articles/1844553.html</a></li>
</ul>
</li>
<li>form<ul>
<li>基于表单的身份认证</li>
<li>图形界面操作</li>
</ul>
</li>
<li>Cookie<ul>
<li>双因素身份认证/anti-CSRF tokens</li>
<li>注意格式</li>
</ul>
</li>
<li>利用HTTP头完成身份认证</li>
</ul>
<h4 id="使用"><a href="#使用" class="headerlink" title="使用"></a>使用</h4><p>xxx略- -</p>
