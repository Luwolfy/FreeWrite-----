# FreeWrite
本脚本是一款针对超星学习通（chaoxing.com）等在线学习平台的自动答题辅助工具，基于 DeepSeek API 实现智能作答。主要功能包括：  - 自动处理视频/音频任务（支持倍速播放、自动续播） - 自动完成测验、作业、考试题目 - 支持单选题、多选题、填空题、判断题、简答题等多种常见题型 - 视频播放过程中的弹题自动识别与作答 - 智能搜题节流，避免请求过于频繁 - 可视化浮窗面板，支持 API Key 安全存储

FreeWrite 网课自主答题刷课助手（DeepSeek API 版）使用说明
[先看我！！！FreeWrite网课自主答题刷课脚本-使用说明.pdf](https://github.com/user-attachments/files/29050413/FreeWrite.-.pdf)


有图有真相，先看上面的pdf文件！！！那上面教程最全！！！

版本：v3.3.0
适用平台：

 
*.chaoxing.com	超星
*.xueyinonline.com	学银在线
*.sslibrary.com	超星电子图书 / 超星数字图书馆
*.neauce.com	东北农业大学继续教育学院
*.nbdlib.cn	宁波市数字图书馆
*.hnsyu.net	邵阳学院
*.qutjxjy.cn	青岛理工大学继续教育学院
*.ynny.cn	云南能源职业技术学院
*.hnvist.cn	湖南安全技术职业学院
*.fjlecb.cn	福建省终身教育学分银行（福建开放大学）
*.gdhkmooc.com	粤港澳大湾区高校在线开放课程联盟
*.cugbonline.cn	中国地质大学（北京）继续教育学院
*.zjelib.cn	浙江图书馆 / 浙江网络图书馆
*.cqrspx.cn	重庆人社培训网
*.zhihui-yun.com	武汉伟创聚赢科技有限公司旗下教育平台
*.cqie.cn	重庆科创职业学院
*.ccqmxx.com	长春全民学习网
*.jxgmxy.com	江西工业贸易职业技术学院
*.jnzyjsxy.cn	济宁职业技术学院
 


注意：
若要使用自主答题功能，需要核心引擎：
DeepSeek API（需自行申请API密钥）----后有教程

⚠️ 免责申明

请务必仔细阅读以下条款，使用本脚本即表示您已完全理解并接受：

1.	脚本仅供个人学习、研究和技术交流使用，不得用于任何商业或非法目的。
2.	本脚本是由油泼猴开源代码修改优化而来，请尊重原作者。
3.	使用本脚本可能违反相关在线教育平台的服务协议，请自行评估风险。若因使用脚本导致账号被封禁、成绩失效或其他损失，脚本作者及贡献者不承担任何责任。
4.	脚本调用第三方 API（DeepSeek）可能产生费用，请用户自行管理 API 密钥及账户余额，作者不承担任何费用责任。
5.	脚本作者不保证脚本的稳定性、准确性或兼容性，亦不承诺提供持续更新或技术支持。
6.	用户应尊重知识产权和学术诚信，刷课行为应仅限于已经合法选修的课程，且不得用于替代真实学习。
7.	作者保留对本声明随时修改的权利，更新后的声明将在脚本发布页公示。



———— FreeWrite
 
目录
FreeWrite 网课自主答题刷课助手（DeepSeek API 版）使用说明	1
⚠️ 免责申明	2
一、脚本安装	4
二、Deepseek API配置	10
三、脚本其他功能	12

 
一、脚本安装

1、访问篡改猴 - Microsoft Edge Addons官网：https://microsoftedge.microsoft.com/addons/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/iikmkjmpaadaobahmlepeloendndfphd?hl=zh-CN
<img width="865" height="502" alt="image" src="https://github.com/user-attachments/assets/d4e9a4c0-6b22-4357-8b46-4a94875e08c4" />

 
2、点击“获取”，并单击“添加扩展”
 <img width="865" height="707" alt="image" src="https://github.com/user-attachments/assets/77a0d42a-0a09-418d-81a9-b60c53b7e5c2" />


3、单击右上角三个点“ ... ”，单击“扩展”-“管理扩展” 
<img width="865" height="501" alt="image" src="https://github.com/user-attachments/assets/8631c8f5-a866-41b2-91d8-e47ab2363b18" />

4、单击打开“开发人员选项” 
<img width="865" height="707" alt="image" src="https://github.com/user-attachments/assets/a5fbe864-df1b-4d74-9853-3bd2d2dd2f8c" />

5、单击“篡改猴”的“详细信息”按键。
6、向下找到并开启“允许用户脚本”
 <img width="865" height="399" alt="image" src="https://github.com/user-attachments/assets/8f75c9f7-691d-4e62-9a67-ee5fee3ebc3c" />

7、返回学习界面，找到浏览器上方的“扩展”按钮（被两个小星星夹着），并单击“篡改猴”
 <img width="487" height="573" alt="image" src="https://github.com/user-attachments/assets/701f0357-0f70-4167-acfb-f2f7d215cdf2" />

8、单击“添加新脚本” 
<img width="1055" height="429" alt="image" src="https://github.com/user-attachments/assets/3fb1cbe8-1786-434a-9634-6c5e762c9441" />


9、将文件夹中的“FreeWrite网课自主答题刷课.js”文件拖拽到浏览器中，
 <img width="637" height="624" alt="image" src="https://github.com/user-attachments/assets/bfb0867e-673f-46da-a4fe-e1e5af3a64d9" />

10、并单击“安装”。
 ![Uploading image.png…]()

11、返回课程界面，刷新界面即可出现脚本程序。
 
 
二、Deepseek API配置
1、	打开deepseek官网：DeepSeek | 深度求索（https://www.deepseek.com/）
2、	单击界面右上角“API开放平台”
 
3、	单击“充值”。
 
注意，DeepSeek API会消耗token
搜一个题大约会消耗几百个token，大约消费小于0、003元/次。
也就是说，充值10块钱，保你从大一用到大学毕业。
4、	充值好后，你将获得创建密钥的权利。


5、	单击“API Keys”，它会出现一串数字和字母，这就是你的密钥。
 
6、	复制你的密钥，将密钥复制到“刷课程序”中的“DeepSeek API Key”输入框中并点击保存。
 
7、	这样，出现习题部分脚本将会给您自动答题。



三、脚本其他功能
脚本是一款运行于 Tampermonkey / Violentmonkey 的油猴扩展，旨在辅助完成超星学习通等平台的课程任务点，包括：
视频 / 音频自动播放（支持倍速）
文档 / 阅读 / 读书任务自动完成
测验 / 作业 / 考试自动识别题型并调用 DeepSeek 大模型作答
智能处理视频弹题、填空题、简答题等
⚠️ 重要提示：脚本仅作为学习辅助工具，请合理使用，勿用于作弊或违反平台规定的行为。使用者需自行承担因使用本脚本所产生的所有后果。
🚀 功能特点
✅ 自动播放视频/音频（支持自定义倍速，最高 16 倍）
✅ 自动跳过已完成任务点
✅ 自动识别并处理：单选题、多选题、判断题、填空题、简答题、论述题、写作题、翻译题等
✅ 调用 DeepSeek API 智能作答（支持 deepseek-chat 和 deepseek-reasoner 模型
✅ 支持视频弹题自动作答（带重试和失败记录）
✅ 支持“好学生模式”（仅加粗答案，不自动选择，需手动提交）
✅ 支持“重做模式”（可重新覆盖已答题）
✅ 浮动控制面板（可拖拽、折叠、暂停/恢复）
✅ 多任务自动跳转，章节切换
✅ 防睡眠、防页面挂起
✅ 完善的日志输出（可查看实时状态）

📦 安装要求
浏览器：Chrome / Edge / Firefox 等支持油猴插件的现代浏览器

插件：Tampermonkey（推荐）或 Violentmonkey
网络：能正常访问 api.deepseek.com（需科学上网环境，若受限制请自行解决）
DeepSeek API Key：需在 DeepSeek 平台 注册并申请 API 密钥（付费或赠送额度）

调整常用参数（可选）
•	视频/音频倍速：面板中下拉选择（1× ~ 16×），过高可能被平台检测异常。
•	答题间隔：默认 2.5 秒，可适当调高（如 3~5 秒）避免请求过快。
•	测验自动提交：开启后，答题完成会自动提交；关闭则仅保存。
•	测验强制提交：开启后，即使有未答题目也强制提交（谨慎使用）。
•	好学生模式：开启后，脚本只将答案选项加粗，不自动点击，需要手动选择并提交。
•	重做模式：开启后，会重新对已答题进行 AI 作答并覆盖原有答案。




感谢使用
------FreeWrite


