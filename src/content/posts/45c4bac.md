---
title: "免杀-Veil、shellter"
date: "2020-11-22T16:09:59+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "信息收集", "MSF"]
legacyPath: "/posts/45c4bac.html"
topic: security
subtopic: pentest-basics
qualityScore: 53
---
<h3 id="Veil-evasion"><a href="#Veil-evasion" class="headerlink" title="Veil-evasion"></a>Veil-evasion</h3><ul>
<li><p>属于Veil-framework框架的一部分</p>
</li>
<li><p>由Python语言编写</p>
</li>
<li><p>用于自动生成免杀payload</p>
<ul>
<li><p>集成msf payload，支持自定义payload</p>
</li>
<li><p>集成各种注入技术</p>
</li>
<li><p>集成各种第三方工具</p>
<ul>
<li>Hyperion、PEScrambler、BackDoor Factory</li>
</ul>

</li>
<li><p>集成各种开发打包运行环境</p>
<ul>
<li>Python：pyinstaller py2exe</li>
<li>C#：mono for.NET</li>
<li>C：mingw32</li>
</ul>
</li>
</ul>
</li>
</ul>
<hr>
<h4 id="操作"><a href="#操作" class="headerlink" title="操作"></a>操作</h4><ul>
<li>按照指引使用payload生成一个exe，路径在<code>/var/lib/veil/output/compiled/xxx.exe</code></li>
<li>同时会生成一个msf配置文件在<code>/var/lib/veil/output/handlers/xxx.rc</code><ul>
<li><code>msfconsole -r xxx.rc</code>或者在msf命令行手动敲里面的命令，侦听reverseShell的连接</li>
</ul>
</li>
<li>在把python打包成exe时，可以使用pwnstaller进行混淆</li>
</ul>
<hr>
<h4 id="Veil-catapult"><a href="#Veil-catapult" class="headerlink" title="Veil-catapult"></a>Veil-catapult</h4><ul>
<li>Payload的投递工具<ul>
<li>集成veil-evasion生成免杀payload或自定义payload</li>
<li>使用Impacket上传二进制payload文件</li>
<li>利用SMB</li>
</ul>
</li>
</ul>
<hr>
<p>另一种免杀思路</p>
<ul>
<li>传统防病毒查杀原理<ul>
<li>查找文件特殊字符串，匹配查杀</li>
</ul>
</li>
<li>找到触发AV查杀的精确字符串，将其修改<ul>
<li>将执行程序分片成很多小段</li>
<li>将包含MZ头的第一个片段与后续片段依次组合后交给AV查杀</li>
<li>重复以上步骤，最终精确定位出</li>
<li>Evade、hexeditor</li>
</ul>
</li>
</ul>
<hr>
<ol>
<li>自己写</li>
<li>加密</li>
<li>不写文件</li>
<li>找到特征字符串</li>
</ol>
<hr>
<h4 id="shellter"><a href="#shellter" class="headerlink" title="shellter"></a>shellter</h4><ul>
<li>shellcode 注入工具，我们可以将shellcode注入到其它程序上，从而来躲避杀毒软件的查杀。</li>
<li>只支持32位PE程序，使用正常的exe文件作为模板，将payload代码加入模板内</li>
<li>参考：<a href="https://www.cnblogs.com/hkleak/p/12912706.html" target="_blank" rel="noopener">https://www.cnblogs.com/hkleak/p/12912706.html</a></li>
</ul>
