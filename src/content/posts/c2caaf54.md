---
title: "MSF-信息收集、发现和端口扫描"
date: "2020-11-26T16:16:47+08:00"
description: ""
categories: ["信息安全","渗透测试"]
tags: ["渗透测试","Windows","信息安全"]
legacyPath: "/posts/c2caaf54.html"
---
<h4 id="MSF–信息收集"><a href="#MSF–信息收集" class="headerlink" title="MSF–信息收集"></a>MSF–信息收集</h4><ul>
<li><p>Nmap扫描</p>
<ul>
<li>db_nmap -sV 192.168.0.1/24</li>
</ul>
</li>
<li><p>Auxiliary扫描模块</p>
<ul>
<li><p>主机发现</p>
<ul>
<li>search arp</li>
<li>use auxiliary/scanner/discovery/arp_sweep</li>
<li>set INTERFACE RHOSTS SHOST SMAC THREADS </li>
<li>run</li>
</ul>

</li>
<li><p>端口扫描</p>
<ul>
<li>search portscan</li>
<li>use auxiliary/scanner/portscan/syn</li>
<li>set INTERFACE、PORTS、RHOSTS、THREADS</li>
<li>run</li>
</ul>
</li>
<li><p>idle扫描</p>
<ul>
<li>查找ipidseq主机<ul>
<li>use auxiliary/scanner/ip/ipidseq</li>
<li>set rhosts 192.168.43.1/24</li>
<li>run</li>
</ul>
</li>
<li>nmap -PN -sI 192.168.43.117</li>
</ul>
</li>
<li><p>UDP扫描</p>
<ul>
<li>use /auxiliary/scanner/discovery/udp_sweep</li>
<li>~/udp_probe</li>
</ul>
</li>
</ul>
</li>
</ul>
<hr>
<ul>
<li><p>密码嗅探</p>
<ul>
<li>psnuffle，支持从pcap抓包文件提取密码，功能类似于dnsniff</li>
<li>支持pop3 imap ftp httpget</li>
</ul>
</li>
<li><p>SNMP扫描</p>
<ul>
<li>metasploitable：vi /etc/default/snmpd<ul>
<li>修改侦听地址</li>
</ul>
</li>
<li>use auxiliary/scanner/snmp/snmp_login</li>
<li>use auxiliary/scanner/snmp/snmp_enum</li>
<li>~enumusers</li>
<li>~enumshares</li>
</ul>
</li>
<li><p>SMB版本扫描</p>
<ul>
<li>use auxiliary/scanner/smb/smb_version</li>
</ul>
</li>
<li><p>扫描命名管道，判断SMB服务类型（账号，密码）</p>
<ul>
<li>use auxiliary/scanner/smb/pipe_auditor</li>
</ul>
</li>
<li><p>扫描通过SMB管道可以访问的DCERPC服务</p>
<ul>
<li>use auxiliary/scanner/smb/pipe_dcerpc_auditor</li>
</ul>
</li>
<li><p>SMB共享枚举（账号、密码）</p>
<ul>
<li>use auxiliary/scanner/smb/smb_enumshares</li>
</ul>
</li>
<li><p>SMB用户枚举</p>
<ul>
<li>use auxiliary/scanner/smb/smb_enumusers</li>
</ul>
</li>
<li><p>用户sid枚举</p>
<ul>
<li>use auxiliary/scanner/smb/smb_lookupsid</li>
</ul>
</li>
</ul>
<hr>
<ul>
<li><p>SSH版本扫描</p>
<ul>
<li>use auxiliary/scanner/ssh/ssh_version</li>
</ul>
</li>
<li><p>SSH密码爆破</p>
<ul>
<li>use auxiliary/scanner/ssh/ssh_login<ul>
<li>set userpass_file /usr/share/metasploit-framework/data/wordlists/root_userpass.txt</li>
<li>set verbose true</li>
<li>run</li>
</ul>
</li>
</ul>
</li>
<li><p>SSH公钥登陆</p>
<ul>
<li>use auxiliary/scanner/ssh/ssh_login_pubikey<ul>
<li>set key_file id_rsa(通过各种方式获得的key)</li>
<li>set username root</li>
<li>run</li>
</ul>
</li>
</ul>
</li>
<li><p>Windows缺少的补丁</p>
<ul>
<li><p>基于已经取得的session进行检测</p>
</li>
<li><p>use post/windows/gather/enum_patches</p>
</li>
<li><p>检查失败</p>
<ul>
<li>Known bug in WMI query, try migrating to another process</li>
<li>迁移到另一个进程再次尝试</li>
</ul>
</li>
</ul>
</li>
<li><p>Mssql扫描端口</p>
<ul>
<li>TCP 1433或动态端口/如果是动态端口，则在UDP1434查询TCP端口号</li>
<li>use auxiliary/scanner/mssql/mssql_ping</li>
</ul>
</li>
<li><p>爆破mssql密码</p>
<ul>
<li>use auxiliary/scanner/mssql/mssql_login</li>
</ul>
</li>
<li><p>远程执行代码</p>
<ul>
<li>use auxiliary/admin/mssql/mssql_exec</li>
<li>set cmd net user user pass /add</li>
</ul>
</li>
<li><p>FTP版本扫描</p>
<ul>
<li>search ftp_version</li>
</ul>
</li>
<li><p>FTP是否支持匿名登陆</p>
<ul>
<li>search anonymous</li>
<li>search ftp/anoymous</li>
<li>search ftp_login</li>
</ul>
</li>
<li><p>use auxiliary/scanner/[tab]</p>
<ul>
<li>多尝试，实操。</li>
</ul>
</li>
</ul>
