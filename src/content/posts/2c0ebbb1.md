---
title: "主动信息收集--主机发现"
date: "2020-09-13T17:57:46+08:00"
description: "traceroute(发的UDP,IP段的TTL=0后会返回ICMP)，每一跳是路由器的内侧网口"
categories: ["信息安全","渗透测试"]
tags: ["渗透测试","Windows","信息安全"]
legacyPath: "/posts/2c0ebbb1.html"
---
<h1 id="主动信息收集"><a href="#主动信息收集" class="headerlink" title="主动信息收集"></a>主动信息收集</h1><ul>
<li><p>直接与目标系统交互通信</p>
</li>
<li><p>无法避免留下访问痕迹</p>
</li>
<li><p>使用受控的第三方电脑进行探测</p>
<ul>
<li>使用代理或已经被控制的主机</li>
<li>做好被封杀的准备</li>
<li>使用噪声迷惑目标，淹没真实的探测流量</li>
</ul>
</li>
<li><p>扫描</p>
<ul>
<li>发送不同的探测，根据返回结果判断目标状态</li>
</ul>

</li>
</ul>
<h1 id="发现"><a href="#发现" class="headerlink" title="发现"></a>发现</h1><ul>
<li>识别活着的主机<ul>
<li>潜在的被攻击目标</li>
</ul>
</li>
<li>输出一个IP地址列表</li>
<li>2、3、4层发现</li>
</ul>
<h2 id="二层发现"><a href="#二层发现" class="headerlink" title="二层发现"></a>二层发现</h2><ul>
<li><p>优点：扫描速度快，可靠。</p>
</li>
<li><p>缺点：不可路由</p>
</li>
<li><p>Arp协议</p>
<ul>
<li>抓包</li>
</ul>
</li>
<li><p>arping</p>
</li>
<li><p>arping 1.1.1.1 -c 1</p>
<ul>
<li>编写一个扫描本网段的脚本</li>
<li>编写一个扫描指定ip列表的脚本</li>
</ul>
</li>
<li><p>nmap -sn（nmap还发了一个反向域名解析请求）</p>
<ul>
<li>nmap -sn -iL</li>
</ul>
</li>
<li><p>Netdiscover</p>
<ul>
<li>专用于二层发现</li>
<li>可用于无线和交换网络</li>
<li>主动和被动探测<ul>
<li>主动：<ul>
<li>netdiscover -i eth0 -r 1.1.1.0/24</li>
<li>netdiscover -l iplist.txt</li>
</ul>
</li>
<li>被动：<ul>
<li>netdiscover -p</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li><p>Scapy</p>
<ul>
<li>Python库</li>
<li>也可作为单独的工具使用</li>
<li>抓包、分析、创建、修改、注入网络流量</li>
</ul>
</li>
<li><p>apt-get install python3-gnuplot</p>
</li>
<li><p>Scapy</p>
<ul>
<li>ARP().display()</li>
<li>sr1()</li>
<li>Python脚本</li>
</ul>
</li>
<li><p>在不同的环境下可使用的工具不确定。</p>
</li>
</ul>
<h1 id="三层发现"><a href="#三层发现" class="headerlink" title="三层发现"></a>三层发现</h1><ul>
<li><p>优点</p>
<ul>
<li>可路由</li>
<li>速度比较快</li>
</ul>
</li>
<li><p>缺点</p>
<ul>
<li>速度比二层慢</li>
<li>经常被边界防火墙过滤</li>
</ul>
</li>
<li><p>IP、ICMP协议</p>
</li>
<li><p>ping</p>
</li>
<li><p>traceroute(发的UDP,IP段的TTL=0后会返回ICMP)，每一跳是路由器的内侧网口</p>
</li>
<li><p>ping -R返回的是外侧网口 <a href="https://blog.csdn.net/weixin_42714910/article/details/108351817" target="_blank" rel="noopener">点这里了解更多关于ping -R </a></p>
<ul>
<li>编写ping扫描网段脚本</li>
</ul>
</li>
<li><p>Scapy</p>
<ul>
<li>分别用shell和python编写ping扫描网段脚本<ul>
<li>读取文件扫描ip列表</li>
</ul>
</li>
</ul>
</li>
<li><p>nmap -sn</p>
<ul>
<li>如果ip是本网段的就是二层扫描，否则是三层扫描。</li>
<li>发送了2个ICMP请求，type是8和13.发送了两个TCP消息，一个443 SYN,一个80 ACK。</li>
<li>对于每个消息如果目标没有响应就会再发一遍。两遍都没有响应就判定host is down.</li>
</ul>
</li>
<li><p>fping</p>
<ul>
<li>fping支持地址段扫描</li>
<li>fping -g 192.168.1.100 192.168.1.200 -c 1</li>
</ul>
</li>
<li><p>Hping</p>
<ul>
<li>能够发送激活任意TCP/IP包</li>
<li>功能强大但每次只能扫描一个目标</li>
</ul>
</li>
</ul>
<h1 id="四层发现"><a href="#四层发现" class="headerlink" title="四层发现"></a>四层发现</h1><ul>
<li><p>优点</p>
<ul>
<li>可路由且结果可靠</li>
<li>不太可能被防火墙过滤</li>
<li>甚至可以返现所有端口都被过滤的主机</li>
</ul>
</li>
<li><p>缺点</p>
<ul>
<li>基于状态过滤的防火墙可能过滤扫描</li>
<li>全端口扫描速度慢</li>
</ul>
</li>
<li><p>TCP</p>
<ul>
<li>未经请求的ACK——RST</li>
<li>SYN——SYN/ACK、RST</li>
</ul>
</li>
<li><p>UDP</p>
<ul>
<li>ICMP端口不可达、一去不复返</li>
</ul>
</li>
<li><p>ACK——TCP Port——RST</p>
<ul>
<li>Scapy</li>
<li>Python脚本</li>
</ul>
</li>
<li><p>nmap - x.x.x.x -PU53333 -sn  UDP扫描53333端口</p>
</li>
<li><p>nmap - x.x.x.x -PA53333 -sn  ACK扫描53333端口 (PS PA PU PY(SCTP))</p>
</li>
<li><p>hping3 –udp xxx -c 1</p>
</li>
</ul>
<h1 id="其他命令"><a href="#其他命令" class="headerlink" title="其他命令"></a>其他命令</h1><ul>
<li>|egrep -v “xxx”<ul>
<li>除符合xxx的字段</li>
</ul>
</li>
</ul>
