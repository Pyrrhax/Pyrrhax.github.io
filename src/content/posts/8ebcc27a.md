---
title: "WEP/WPA工作原理"
date: "2020-10-04T19:32:05+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "无线安全", "Windows"]
legacyPath: "/posts/8ebcc27a.html"
topic: security
subtopic: wireless-security
qualityScore: 73
---
<h2 id="WEP-WPA工作原理"><a href="#WEP-WPA工作原理" class="headerlink" title="WEP/WPA工作原理"></a>WEP/WPA工作原理</h2><h3 id="WEP加密"><a href="#WEP加密" class="headerlink" title="WEP加密"></a>WEP加密</h3><ul>
<li>使用Rivest Cipher4（RC4）算法加密流量内容，实现机密性</li>
<li>CRC32算法检查数据完整性</li>
<li>标准采用使用24位initialization vector（IV）</li>
</ul>

<h4 id="RC4算法"><a href="#RC4算法" class="headerlink" title="RC4算法"></a>RC4算法</h4><ul>
<li>RSA实验室研发的对称加密流算法<ul>
<li>实现简单</li>
<li>速度快</li>
</ul>
</li>
<li>加密：对明文流和密钥流进行XOR计算</li>
<li>解密：对密文流和密钥流进行XOR计算</li>
<li>RC4算法key由两个过程生成<ul>
<li>合并IV和PSK，利用Key Scheduling Algorithm（KSA）算法生成起始状态表。</li>
<li>Pseudo-Random Generation Algorithm（PRGA）算法生成最终密钥流。</li>
</ul>
</li>
</ul>
<h3 id="WPA安全系统"><a href="#WPA安全系统" class="headerlink" title="WPA安全系统"></a>WPA安全系统</h3><ul>
<li>Wi-Fi Protected Access</li>
<li>802.11i为提高无限安全，开发两个新的链路层加密协议<ul>
<li>Temporal Key Integrity Protocol(TKIP)<ul>
<li>WPA1(较之WEP可动态改变密钥)</li>
</ul>
</li>
<li>Counter Mode with CBC-MAC(CCMP)<ul>
<li>WPA2</li>
</ul>
</li>
</ul>
</li>
<li>WPA加密两种安全类型<ul>
<li>WPA个人：使用预设共享密钥实现身份认证</li>
<li>WPA企业：使用802.1x和Radius服务器实现AAA<ul>
<li>从客户端到AP用EAP协议</li>
</ul>
</li>
</ul>
</li>
<li>WPA1<ul>
<li>802.11i第三版草案</li>
<li>与WEP比较<ul>
<li>都采用逐包进行密钥加密</li>
<li>128位的key和48位的初向量（IV）</li>
<li>RC4流加密数据</li>
<li>帧计数器避免重放攻击</li>
<li>TKIP使用Michael算法进行完整性校验MIC<ul>
<li>WEP CRC32</li>
</ul>
</li>
<li>兼容早期版本硬件</li>
</ul>
</li>
</ul>
</li>
<li>WPA2<ul>
<li>依据802.11i完全重新设计实现<ul>
<li>也被称为Robust Security Network（RSN）</li>
<li>CCMP替代TKIP</li>
<li>AES加密算法取代了RC4</li>
<li>不兼容早期版本硬件</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="身份认证（WPA企业）"><a href="#身份认证（WPA企业）" class="headerlink" title="身份认证（WPA企业）"></a>身份认证（WPA企业）</h3><ul>
<li>身份认证基于Extensible Authentication Protocol（EAP实现）<ul>
<li>EAP-TLS，需要客户端和服务器证书</li>
<li>EAP-TTLS</li>
<li>PEAP混合身份验证，只需要服务器证书</li>
</ul>
</li>
<li>客户端选择身份认证方式</li>
<li>AP发送身份验证信息给RadiusServer</li>
<li>Radius Server返回”Radius Accept“表示认证成功<ul>
<li>其中包含MasterKey（MK）</li>
</ul>
</li>
<li>AP通过EAP消息通知STA认证成功</li>
</ul>
<h3 id="密钥交换"><a href="#密钥交换" class="headerlink" title="密钥交换"></a>密钥交换</h3><ul>
<li><p>无线网络设计用于一组无线通信设备</p>
<ul>
<li>关联到同一AP的设备共享无线信道</li>
<li>单播、广播、组播<ul>
<li>安全特性要求不同</li>
<li>单播通信需要单独密钥加密通信双方流量<ul>
<li>pairwise key：对偶密钥（PTK）（T是temporary，PTK由PMK得出）</li>
</ul>
</li>
<li>组播通信需要信任域内所有成员共享的同一密钥<ul>
<li>group key：组密钥（GTK）</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="PMK"><a href="#PMK" class="headerlink" title="PMK"></a>PMK</h4><ul>
<li><p>安全上下文的顶级密钥</p>
<ul>
<li>MK进行TLS-PRF加密得出PMK<ul>
<li>基于服务密钥</li>
</ul>
</li>
</ul>
</li>
<li><p>由上层身份验证方法服务器生成</p>
</li>
<li><p>从服务器通过radius传给AP</p>
</li>
<li><p>从AP通过EAP消息传递给所有STA</p>
<ul>
<li>基于PSK共享密钥（个人）</li>
</ul>
</li>
<li><p>Essid+PSK+迭代次数4096——Hash计算生成PMK——再生成PTK</p>
</li>
<li><p>STA和AP分别计算得出PMK，并不在网络中传递交换</p>
<ul>
<li>256位既32字节</li>
</ul>
<h4 id="四步握手生成PTK"><a href="#四步握手生成PTK" class="headerlink" title="四步握手生成PTK"></a>四步握手生成PTK</h4></li>
</ul>
<ul>
<li>AP发送Anonce给STA</li>
<li>STA生成Snonce计算出PTK</li>
<li>STA发送Snonce加PTK的MIC给AP</li>
<li>AP拿到Snonce计算出PTk</li>
<li>AP计算MIC与接收的MIC比对</li>
<li>MIC一致说明确定STA知道PMK</li>
<li>AP发GTK给STA</li>
<li>STA回复ACk并使用密钥加密</li>
</ul>
<h3 id="其它"><a href="#其它" class="headerlink" title="其它"></a>其它</h3><ul>
<li>集中身份验证：<ul>
<li>Radius</li>
<li>LADP</li>
<li>kerberos</li>
</ul>
</li>
</ul>
