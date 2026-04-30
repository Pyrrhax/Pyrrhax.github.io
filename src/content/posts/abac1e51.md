---
title: "Web扫描工具-Arachni"
date: "2020-10-12T22:22:00+08:00"
description: "安装后，输入用户名密码登录提示错误，google发现很多人有同样错误，暂时无解。"
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "Web安全", "漏洞分析", "信息收集", "CSRF", "Windows"]
legacyPath: "/posts/abac1e51.html"
topic: security
subtopic: web-security
qualityScore: 70
---
<h3 id="Arachni"><a href="#Arachni" class="headerlink" title="Arachni"></a>Arachni</h3><ul>
<li><p>官网</p>
<ul>
<li><a href="https://www.arachni-scanner.com/" target="_blank" rel="noopener">https://www.arachni-scanner.com/</a></li>
</ul>
</li>
<li><p>支持分布式扫描</p>
</li>
<li><p>支持调度，每隔多久扫描一次</p>
</li>
<li><p>安装后，输入用户名密码登录提示错误，google发现很多人有同样错误，暂时无解。</p>
</li>
</ul>

<h3 id="OWASP-ZAP"><a href="#OWASP-ZAP" class="headerlink" title="OWASP_ZAP"></a>OWASP_ZAP</h3><ul>
<li>Zed attack proxy</li>
<li>WEB Application继承渗透测试和漏洞挖掘工具</li>
<li>开源免费快平台简单易用</li>
<li>截断代理</li>
<li>主动、被动扫描</li>
<li>Fuzzy、暴力破解</li>
<li>API<ul>
<li><a href="http://zap/" target="_blank" rel="noopener">http://zap/</a></li>
</ul>
</li>
<li>功能<ul>
<li><code>netstat -pantu</code>发现zap自动在8080端口打开 代理，通过该代理访问的网页会显示在zap中</li>
<li>Mode–Safe、Protected、Standard、ATTACK</li>
<li>升级add-ons</li>
<li>ScanPolicy</li>
<li>Anti CSRF Tokens</li>
<li>https–CA<ul>
<li>把ZAP的证书导入到浏览器成信任的证书</li>
<li>在设置的Dynamic SSL Certificates里面</li>
</ul>
</li>
<li>Scope/Context/filter</li>
<li>Http Sessions</li>
<li>扫描结果可以添加Note/Tag</li>
<li>小绿点：截断。小灯泡：显示隐藏域。</li>
</ul>
</li>
</ul>
<h4 id="扫描工作流程"><a href="#扫描工作流程" class="headerlink" title="扫描工作流程"></a>扫描工作流程</h4><ul>
<li>设置代理</li>
<li>手动爬网</li>
<li>自动爬网</li>
<li>主动扫描</li>
</ul>
