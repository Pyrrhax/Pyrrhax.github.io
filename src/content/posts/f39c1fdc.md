---
title: "CobaltStrike学习笔记"
date: "2021-08-03T17:23:08+08:00"
description: "也就是说,只要egress Beacon可以出网，p2p Beacon可以通过egress Beacon和teamserver通信"
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "信息收集", "MSF", "内网", "Windows"]
legacyPath: "/posts/f39c1fdc.html"
topic: security
subtopic: post-exploitation
qualityScore: 93
featured: true
featuredOrder: 4
---
<p>CS官方教程的学习笔记，目前进度到Weaponization。</p>

<h1 id="CobaltStrike-学习笔记"><a href="#CobaltStrike-学习笔记" class="headerlink" title="CobaltStrike 学习笔记"></a>CobaltStrike 学习笔记</h1><h2 id="1、Operations"><a href="#1、Operations" class="headerlink" title="1、Operations"></a>1、Operations</h2><h3 id="操作"><a href="#操作" class="headerlink" title="操作"></a>操作</h3><ul>
<li>/sc   // show channel</li>
<li>neo: xxxxxxx //对neo说话</li>
<li>/msg neo xxxx //给neo发私信</li>
</ul>
<h3 id="思路"><a href="#思路" class="headerlink" title="思路"></a>思路</h3><ul>
<li>多个teamserver各司其职:<ul>
<li>staginig</li>
<li>post-ex</li>
<li>longhaul</li>
</ul>
</li>
<li>红队单元<ul>
<li>AccessManagementCell</li>
<li>TargetCell</li>
</ul>
</li>
<li>团队角色<ul>
<li>Access<ul>
<li>Get in and expand foothold</li>
</ul>
</li>
<li>Post Exploitation<ul>
<li>Data mining,monitor users,key log,etc.</li>
</ul>
</li>
<li>Local Access Manager<ul>
<li>Manage Callbacks</li>
<li>Setup Infrastructure</li>
<li>Persistence</li>
<li>Pass sessions to and from global access manager</li>
</ul>
</li>
</ul>
</li>
</ul>
<h2 id="2、Infrastructure"><a href="#2、Infrastructure" class="headerlink" title="2、Infrastructure"></a>2、Infrastructure</h2><h3 id="概念"><a href="#概念" class="headerlink" title="概念"></a>概念</h3><h4 id="三种payload"><a href="#三种payload" class="headerlink" title="三种payload"></a>三种payload</h4><ul>
<li>egress //出网口payload</li>
<li>p2p //通过父payload通信</li>
<li>alias //对其它payload handler的引用</li>
</ul>
<p>也就是说,只要egress Beacon可以出网，p2p Beacon可以通过egress Beacon和teamserver通信</p>
<h4 id="Payload-Staging"><a href="#Payload-Staging" class="headerlink" title="Payload Staging"></a>Payload Staging</h4><ul>
<li><p>Stageless</p>
<ul>
<li>稳定</li>
</ul>
</li>
<li><p>Stager</p>
<ul>
<li>体积小、适用于资源有限的情况</li>
<li>较不安全</li>
<li>不稳定</li>
<li>更容易被AV发现</li>
</ul>
</li>
</ul>
<h4 id="名词"><a href="#名词" class="headerlink" title="名词"></a>名词</h4><ul>
<li>Payload controller<ul>
<li>MSF</li>
<li>CS //兼容MSF</li>
</ul>
</li>
<li>Staging protocal<ul>
<li>http</li>
<li>https</li>
<li>其它</li>
</ul>
</li>
</ul>
<h4 id="过程"><a href="#过程" class="headerlink" title="过程"></a>过程</h4><ol>
<li>Stager向Paylod controller发送http/https GET请求，并且URI的cheksum是一个固定值。</li>
<li>Payload controller校验请求后，响应一个位置独立的blob,在父程序内存中运行<ul>
<li>MSF:meterpreter payload</li>
<li>CS:beacon payload</li>
</ul>
</li>
</ol>
<ul>
<li>CS exp可以下载meterpreter payload，meterpreter exp也可以下载beacon payload</li>
</ul>
<h4 id="payload的行为"><a href="#payload的行为" class="headerlink" title="payload的行为"></a>payload的行为</h4><ul>
<li>间隔固定时间给teamserver发get请求，获取指令。</li>
<li>如果有指令，发送加密的指令。</li>
<li>如果是生成报告的指令，需要发送数据到teamserver，beacon会发送一个带有加密数据的post请求到。</li>
<li>以上只是默认设置，可以自己进行配置。</li>
</ul>
<h4 id="生成HTTPBeacon的参数"><a href="#生成HTTPBeacon的参数" class="headerlink" title="生成HTTPBeacon的参数"></a>生成HTTPBeacon的参数</h4><ul>
<li>HTTP Hosts                //home，域名，ip，ipv6都可以</li>
<li>HTTP Hosts(Stager) //Stager hosts（参考前面多个teamserver的思路）</li>
<li>HTTP Port(C2)          //beacon发请求的端口</li>
<li>HTTP Proxy               //beacon用的代理，甚至可以让beacon不用系统代理</li>
</ul>
<h4 id="HTTPS-Beacon"><a href="#HTTPS-Beacon" class="headerlink" title="HTTPS Beacon"></a>HTTPS Beacon</h4><ul>
<li>可以通过malleable C2 Profile配置一个可用的SSL 证书(非常推荐看下面的文档)<ul>
<li><a href="https://www.cobaltstrike.com/help-malleable-c2#validssl" target="_blank" rel="noopener">https://www.cobaltstrike.com/help-malleable-c2#validssl</a></li>
</ul>
</li>
</ul>
<h3 id="Redirectors"><a href="#Redirectors" class="headerlink" title="Redirectors"></a>Redirectors</h3><ul>
<li><p>可以迷惑对手，也可以负载均衡</p>
</li>
<li><p>可以用iptables,socat，apache或nginx反向代理，amazon cloudflare或者其他流量转发工具</p>
<ul>
<li><code>socat TCP4-LISTEN:80,fork TCP4:[team server]:80</code></li>
</ul>
</li>
</ul>
<h3 id="思路-1"><a href="#思路-1" class="headerlink" title="思路"></a>思路</h3><ul>
<li>用Redirector作为beacon的home host，和stager host</li>
<li>用CDN作为redirector(绝了，真没想到- -)</li>
</ul>
<h3 id="操作-1"><a href="#操作-1" class="headerlink" title="操作"></a>操作</h3><h4 id="用Socat作为转发器"><a href="#用Socat作为转发器" class="headerlink" title="用Socat作为转发器"></a>用Socat作为转发器</h4><ul>
<li>操作见教程，比较简单实用</li>
<li>实用screen，退出ssh的时候不会退出socat</li>
</ul>
<h4 id="用CDN作为转发器"><a href="#用CDN作为转发器" class="headerlink" title="用CDN作为转发器"></a>用CDN作为转发器</h4><ul>
<li><p>注意</p>
<ul>
<li>需要用有效的SSL证书</li>
<li>启用POST、GET</li>
<li>如果出现问题，可以在mellable C2 Profile改为 HTTP-GET only C2，即用GET请求回传数据</li>
<li>关闭CDN的缓存功能</li>
<li>注意有些CDN会修改请求，比如cloud front会改cookie里面的值的顺序，如果我们设置用cookie回传数据，就会出现问题。 </li>
</ul>
</li>
<li><p>域前置 domain fronting //太6了- -，不过好像一些CDN已经开始避免这种现象</p>
<ul>
<li>大概就是beacon请求a.com,HOST头写成b.com（CDN同时为a.com和b.com提供服务）</li>
<li>查DNS的时候查的是a.com,然后请求发到CDN</li>
<li>CDN收到http请求，会根据HOST头去请求b.com</li>
<li>防御方法就是检查URL和HOST,然后把HOST头改成URL里面的域</li>
<li>所以绕过防御的方法，就是用https（虽然CDN是MITM,也可以防御。但有个思路是，有些行业是不希望有MITM的，可以尝试）</li>
<li>还有一种防御方式，用SNI.也就是https在ssl层会提供的一个东西。</li>
</ul>
<h3 id="Server-Consolidation"><a href="#Server-Consolidation" class="headerlink" title="Server Consolidation"></a>Server Consolidation</h3><ul>
<li>HTTP Port(Bind)<ul>
<li>beacon的http请求先发到redirector的HTTP Port(C2)端口，再被转发到teamserver的HTTP Port(Bind)端口</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="DNS-Beacon"><a href="#DNS-Beacon" class="headerlink" title="DNS Beacon"></a>DNS Beacon</h3><ul>
<li>三种Channel<ul>
<li>dns<ul>
<li>A record (4 bytes/request)</li>
</ul>
</li>
<li>dns6<ul>
<li>AAAA record (16 bytes/request)</li>
</ul>
</li>
<li>dns-txt<ul>
<li>TXT record (189 bytes/request)</li>
</ul>
</li>
</ul>
</li>
<li>有些dns服务器会拒绝超长的域名查询，所以DNS Beacon作为备选的尝试</li>
</ul>
<h3 id="SMB-Beacon"><a href="#SMB-Beacon" class="headerlink" title="SMB Beacon"></a>SMB Beacon</h3><ul>
<li><p>named pip beacon</p>
</li>
<li><p>在windows上使用命名管道的时候，消息会自动封装在SMB协议中(445端口)，所以叫SMB Beacon</p>
</li>
<li><p>可以通过 link [host name] [pip],unlink [host] [pid]来主动连接，断开</p>
</li>
</ul>
<h3 id="TCP-Beacon"><a href="#TCP-Beacon" class="headerlink" title="TCP Beacon"></a>TCP Beacon</h3><ul>
<li>和SMB Beacon类似</li>
</ul>
<h3 id="External-C2"><a href="#External-C2" class="headerlink" title="External C2"></a>External C2</h3><ul>
<li>自己写程序，从beacon 获取数据，然后发给teamserver，反之亦然，其中可以自己进行处理。这个程序可以写多个，只要最终达成beacon和teamserver的通信就可以。</li>
<li>可以通过这个功能适配一些特殊环境<ul>
<li>比如可以通过与另一台电脑上的文件共享，来读写信息.</li>
<li><a href="https://labs.f-secure.com/archive/tasking-office-365-for-cobalt-strike-c2/" target="_blank" rel="noopener">另一种用法</a></li>
</ul>
</li>
</ul>
<h2 id="3、C2"><a href="#3、C2" class="headerlink" title="3、C2"></a>3、C2</h2><h3 id="Malleable-C2"><a href="#Malleable-C2" class="headerlink" title="Malleable C2"></a>Malleable C2</h3><p>修改各种配置，包括</p>
<ul>
<li>Network traffic</li>
<li>In-memory content,characteristics,and behavior</li>
<li>Process injection behavior</li>
</ul>
<h3 id="Profile-Components"><a href="#Profile-Components" class="headerlink" title="Profile Components"></a>Profile Components</h3><ul>
<li><p>Options</p>
<ul>
<li>set key “value”<ul>
<li>value 要用双引号</li>
</ul>
</li>
</ul>
</li>
<li><p>Blocks</p>
<ul>
<li>http-get{ indicators here }<ul>
<li>download tasks</li>
</ul>
</li>
<li>http-post{  indicators here }<ul>
<li>upload outputs</li>
</ul>
</li>
<li>http-stager{  indicators here }</li>
</ul>
</li>
<li><p>Extraneous Indicators</p>
<ul>
<li></li>
</ul>
</li>
<li><p>Transforms</p>
<ul>
<li><p>自定义如何处理,自定义如何传输（放在uri，post体，header等）,作者称之为基于用户定义和储存的加密通信</p>
</li>
<li><p>主要有以下几个部分</p>
<ul>
<li>http-get<ul>
<li>Client:metadata</li>
<li>Server:output</li>
</ul>
</li>
<li>http-post<ul>
<li>Client:id,output</li>
</ul>
</li>
<li>http-stager</li>
<li>http-config</li>
<li>https-certificate</li>
<li>stage</li>
<li>post-ex</li>
<li>process-inject</li>
<li>code-signer</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="Chunked-Output"><a href="#Chunked-Output" class="headerlink" title="Chunked Output"></a>Chunked Output</h4><ul>
<li>当不用print的时候，比如uri-append,parameter,header.会自动分块传输，以适应这些位置的大小。</li>
<li>http-post{ set verb “GET”},http-get{set verb “post”}</li>
</ul>
<h4 id="Profile-Variants"><a href="#Profile-Variants" class="headerlink" title="Profile Variants"></a>Profile Variants</h4><ul>
<li>http-get “variant naame”{ }</li>
</ul>
<p>Testing Profiles</p>
<ul>
<li>写好profile之后，用c2lint 进行单元测试</li>
<li>./c2lint [profile]</li>
</ul>
<h4 id="The-C2-Problem-Set"><a href="#The-C2-Problem-Set" class="headerlink" title="The C2 Problem Set"></a>The C2 Problem Set</h4><ul>
<li>不能出网</li>
<li>IOC（indicator of compromise）检测</li>
<li>我们的基础设施被标记为teamserver</li>
</ul>
<h4 id="HTTP-S-Proxy-Details"><a href="#HTTP-S-Proxy-Details" class="headerlink" title="HTTP/S Proxy Details"></a>HTTP/S Proxy Details</h4><ul>
<li><p>使用WinINet AIP</p>
<ul>
<li>自动使用用户代理（与IE相同），就算代理有用户名密码</li>
<li>如果代理失败，会自动提权</li>
</ul>
</li>
<li><p>我们自定义的代理信息会被存到beacon的某个位置，有暴露风险</p>
</li>
</ul>
<h4 id="Egress-amp-Network-Evasion"><a href="#Egress-amp-Network-Evasion" class="headerlink" title="Egress&amp;Network Evasion"></a>Egress&amp;Network Evasion</h4><ul>
<li>Profile Tips:<ul>
<li>Don’t use public malleable C2 profile examples in production</li>
<li>默认情况下的心跳是get请求，响应200，长度0 //非常可疑，尽量避免</li>
<li>http-stager //也非常重要，改变stager流量的样子<ul>
<li>推荐Header 改成不是 Content-type:application/octet-stream//因为这是默认项</li>
<li>推荐output 进行处理，因为stage数据开头的decoder有指定字节是固定的<ul>
<li>prepend一些数据</li>
</ul>
</li>
</ul>
</li>
<li>http-config，也改一改- -不然前功尽弃</li>
<li>Use plausible set useragent value for target network</li>
<li>if you are in a tough egress situation,可以考虑get-only C2</li>
</ul>
</li>
</ul>
<h4 id="Network-Security-Monitoring"><a href="#Network-Security-Monitoring" class="headerlink" title="Network Security Monitoring"></a>Network Security Monitoring</h4><ul>
<li>Use an Apache,Nginx,or a CDN as a redirector<ul>
<li>other benefits:<ul>
<li>smooths CS-specific indicators,better JA3S fingerprint</li>
<li>header的顺序，内容，更没有teamserver 的fingerprint</li>
</ul>
</li>
<li>Invest in your infrastructure<ul>
<li>Host redirectors on different providers</li>
<li>Domains are better with age and categorization</li>
<li>do not use IPv4 addresses for C2</li>
<li>Have a valid SSL certificate</li>
</ul>
</li>
<li>Operate “low and slow”<ul>
<li>High Beacon sleep interval</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="JA3"><a href="#JA3" class="headerlink" title="JA3"></a>JA3</h4><ul>
<li>A way of looking at the handshake process of tls traffic and generating a hash on the algorithms that both sides present to each other as potential key lenght and ciphers they can use to communicate.</li>
<li>And it turns out that these presented ciphers and key lengths aere agreat way to fingerprint the applications on each side of communication.</li>
<li>简单来说就是通过https双方协商好的cipher suite判断双方的程序，如果用Apache或Ngingx服务器作为redirector，jar3看起来就不是在和jdkxxx通信,而是apache或nginx</li>
</ul>
<h4 id="DNS-C2-Tracdecraft"><a href="#DNS-C2-Tracdecraft" class="headerlink" title="DNS C2 Tracdecraft"></a>DNS C2 Tracdecraft</h4><ul>
<li>Split-Split DNS<ul>
<li>Don’t use DNS C2</li>
</ul>
</li>
<li>Volume of requests<ul>
<li>Use DNS C2 as low&amp;slow fallback option only</li>
</ul>
</li>
<li>Bogon IP addresses<ul>
<li>Change dns idle in profile</li>
<li>Avoid ‘mode dns’ as this will send bogon responses</li>
</ul>
</li>
<li>Length of request hostnames and responses<ul>
<li>Set dns max txt to limit TXT length</li>
<li>Set maxdns to limit hostname length</li>
</ul>
</li>
</ul>
<h4 id="Infrastructure-OPSEC"><a href="#Infrastructure-OPSEC" class="headerlink" title="Infrastructure OPSEC"></a>Infrastructure OPSEC</h4><ul>
<li>How to find team servers on the internet<ul>
<li>Default(self-signed!)SSL certificate<ul>
<li>Use a valid SSL  certificate</li>
<li>Use Apache,Nginx,or a CDN as a redirector</li>
<li>Only allow HTTP/S connections from redirectors</li>
</ul>
</li>
<li>0.0.0.0 DNS response<ul>
<li>Set dns_idle in Malleable C2 to aviod 0.0.0.0</li>
</ul>
</li>
<li>Port 50050 open<ul>
<li>Firewalll port 50050 and access via SSH tunnel</li>
</ul>
</li>
<li>Empty index page,404,text/plain Content-Type<ul>
<li>Host content on your redirectors</li>
</ul>
</li>
<li>Don’t want your payload fconfig available to all?<ul>
<li>Set host_stage to false in Malleable C2</li>
<li>(disables hosted payload for staging purposes)</li>
</ul>
</li>
</ul>
</li>
<li>How to verify team server<ul>
<li>Connect to it and ask for a payload(staging)</li>
<li>wget -U “Internet Explorer” http://[server]/vl6D<ul>
<li>vl6D这个地方的checksum必须是某个固定的值</li>
</ul>
</li>
</ul>
</li>
</ul>
<h1 id="4、Weaponization"><a href="#4、Weaponization" class="headerlink" title="4、Weaponization"></a>4、Weaponization</h1><ul>
<li>执行自己想要执行的artifact:exe、dll、ps1</li>
<li>Static Analysis<ul>
<li>heuristics<ul>
<li>Compile time</li>
<li>Compiler</li>
<li>import table</li>
<li>metadata resources<ul>
<li>clone 其它程序的</li>
</ul>
</li>
<li>signed?</li>
<li>entropy</li>
</ul>
</li>
<li>correlation<ul>
<li>与样本库中的程序对比相似性</li>
</ul>
</li>
</ul>
</li>
<li>Dynamic Analysis<ul>
<li>sandbox<ul>
<li>TIME</li>
<li>INCOMPLETE</li>
</ul>
</li>
</ul>
</li>
<li>Artifact Kit<ul>
<li>Source code Framework to generate EXEs,DLLs and Serevice EXEs</li>
<li>Obfuscate known bad in unknown executable</li>
<li>Fool AV product to stop emulating executable</li>
<li>De-obfuscate known bad execute it</li>
</ul>
</li>
<li>Application Whitelisting<ul>
<li>prevent execution of unapproved applications</li>
<li>Run payload via whitelisted program<ul>
<li>MS Office Macro</li>
<li>PowerShell</li>
<li>LOLbins</li>
<li>DLL Sideloading</li>
</ul>
</li>
</ul>
</li>
</ul>
<ul>
<li>Resource Kit<ul>
<li>混淆web delivery后在victim上执行的命令</li>
</ul>
</li>
<li>In-memory Detections<ul>
<li>1:16s</li>
</ul>
</li>
</ul>
