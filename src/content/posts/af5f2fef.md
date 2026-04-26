---
title: "计算机取证"
date: "2020-12-29T12:26:07+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["KaliLinux渗透测试学习笔记","渗透测试","文件上传","信息安全"]
legacyPath: "/posts/af5f2fef.html"
---
<h4 id="取证科学"><a href="#取证科学" class="headerlink" title="取证科学"></a>取证科学</h4><ul>
<li>Forensic<ul>
<li>法医的、用于法庭的、辩论学、法医学</li>
<li>为了侦破案件还原事实真相，收集法庭证据的一系列科学方法</li>
</ul>
</li>
<li>CSI：物理取证<ul>
<li>指纹、DNA、弹道、血迹</li>
<li>物理取证的理论基础是物质交换原则</li>
</ul>
</li>
<li>关注：数字取证/计算机取证/电子取证<ul>
<li>智能设备、计算机、手机平板、IoT、有线及无线通信、数据存数</li>
</ul>
</li>
</ul>

<h4 id="通用原则"><a href="#通用原则" class="headerlink" title="通用原则"></a>通用原则</h4><ul>
<li>维护证据完整性<ul>
<li>数字取证相比物理取证，可以有无限数量的拷贝进行分析。</li>
<li>数字hash值验证数据完整性</li>
</ul>
</li>
<li>维护监管链<ul>
<li>物理证物保存在证物袋中，每次取出使用严格记录，避免污染破坏</li>
<li>数字证物原始版写保护，使用拷贝进行分析</li>
</ul>
</li>
<li>标准的操作步骤<ul>
<li>证物使用严格按照规范流程，即使事后证明流程有误（免责）</li>
</ul>
</li>
<li>取证分析全部过程记录文档</li>
</ul>
<h4 id="数字取证者的座右铭"><a href="#数字取证者的座右铭" class="headerlink" title="数字取证者的座右铭"></a>数字取证者的座右铭</h4><ul>
<li>不要破坏数据现场（看似简单、几乎无法实现）</li>
<li>寄存器、CPU缓存、I/O设备缓存等易失性数据几乎无法获取</li>
<li>系统内存是主要的非易失性存储介质取证对象，不修改无法获取其中数据</li>
<li>非易失性存储介质通常使用完整镜像拷贝保存</li>
</ul>
<h4 id="证据搜索"><a href="#证据搜索" class="headerlink" title="证据搜索"></a>证据搜索</h4><ul>
<li>数据</li>
<li>信息</li>
<li>证据</li>
</ul>
<h4 id="作为安全从业者"><a href="#作为安全从业者" class="headerlink" title="作为安全从业者"></a>作为安全从业者</h4><ul>
<li>通过取证还原黑客入侵轨迹</li>
<li>作为渗透测试和黑客攻击区分标准</li>
</ul>
<h4 id="活取证"><a href="#活取证" class="headerlink" title="活取证"></a>活取证</h4><ul>
<li>抓取文件metadata、创建时间线、命令历史、分析日志文件、哈希摘要、转存内存信息</li>
<li>使用未受感染的干净程序执行取证</li>
<li>U盘、网络 存储手机到的数据</li>
</ul>
<h4 id="死取证"><a href="#死取证" class="headerlink" title="死取证"></a>死取证</h4><ul>
<li>关机后制作硬盘镜像、分析镜像（MBR、GPT、LVM）</li>
</ul>
<h4 id="实操"><a href="#实操" class="headerlink" title="实操"></a>实操</h4><ul>
<li>内存dump工具<ul>
<li>Dumpit：<a href="http://www.moonsols.com/wp-content/uploads/downloads/2017/07/Dumplt.zip" target="_blank" rel="noopener">http://www.moonsols.com/wp-content/uploads/downloads/2017/07/Dumplt.zip</a></li>
<li>内存文件与内存大小接近或者稍微大一点，raw格式</li>
</ul>
</li>
</ul>
