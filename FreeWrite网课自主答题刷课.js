// ==UserScript==
// @name                FreeWrite网课刷课助手（DeepSeek-API）
// @version             3.3.0
// @description         基于原 ChatGPT 学习通助手修改，使用 DeepSeek API 作答。改进：API解析增强、填空分隔符§、视频弹题重试限制、视频超时刷新限制、字体解密容错、无任务点延迟10秒、全局Promise错误捕获等。
// @match               *://*.chaoxing.com/*
// @match               *://*.edu.cn/*
// @match               *://*.org.cn/*
// @match               *://*.ac.cn/*
// @match               *://*.xueyinonline.com/*
// @match               *://*.sslibrary.com/*
// @match               *://*.neauce.com/*
// @match               *://*.nbdlib.cn/*
// @match               *://*.hnsyu.net/*
// @match               *://*.qutjxjy.cn/*
// @match               *://*.ynny.cn/*
// @match               *://*.hnvist.cn/*
// @match               *://*.fjlecb.cn/*
// @match               *://*.gdhkmooc.com/*
// @match               *://*.cugbonline.cn/*
// @match               *://*.zjelib.cn/*
// @match               *://*.cqrspx.cn/*
// @match               *://*.zhihui-yun.com/*
// @match               *://*.cqie.cn/*
// @match               *://*.ccqmxx.com/*
// @match               *://*.jxgmxy.com/*
// @match               *://*.jnzyjsxy.cn/*
// @connect             api.deepseek.com
// @run-at              document-end
// @grant               unsafeWindow
// @grant               GM_xmlhttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_deleteValue
// @grant               GM_info
// @grant               GM_getResourceText
// @require             https://gptjs.808860.xyz/libs/TyprMd5.js
// @require             https://gptjs.808860.xyz/libs/sweetalert2-11.1.0.all.min.js
// @require             https://gptjs.808860.xyz/libs/jquery-3.7.1.min.js
// @resource            Table https://gptjs.808860.xyz/libs/table.json
// @icon                data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2Utd2lkdGg9IjEuNSIgY2xhc3M9ImgtNiB3LTYiIHJvbGU9ImltZyI+PHRpdGxlPkNoYXRHUFQ8L3RpdGxlPjx0ZXh0IHg9Ii05OTk5IiB5PSItOTk5OSI+Q2hhdEdQVDwvdGV4dD48cGF0aCBkPSJNMzcuNTMyNCAxNi44NzA3QzM3Ljk4MDggMTUuNTI0MSAzOC4xMzYzIDE0LjA5NzQgMzcuOTg4NiAxMi42ODU5QzM3Ljg0MDkgMTEuMjc0NCAzNy4zOTM0IDkuOTEwNzYgMzYuNjc2IDguNjg2MjJDMzUuNjEyNiA2LjgzNDA0IDMzLjk4ODIgNS4zNjc2IDMyLjAzNzMgNC40OTg1QzMwLjA4NjQgMy42Mjk0MSAyNy45MDk4IDMuNDAyNTkgMjUuODIxNSAzLjg1MDc4QzI0Ljg3OTYgMi43ODkzIDIzLjcyMTkgMS45NDEyNSAyMi40MjU3IDEuMzYzNDFDMjEuMTI5NSAwLjc4NTU3NSAxOS43MjQ5IDAuNDkxMjY5IDE4LjMwNTggMC41MDAxOTdDMTYuMTcwOCAwLjQ5NTA0NCAxNC4wODkzIDEuMTY4MDMgMTIuMzYxNCAyLjQyMjE0QzEwLjYzMzUgMy42NzYyNCA5LjM0ODUzIDUuNDQ2NjYgOC42OTE3IDcuNDc4MTVDNy4zMDA4NSA3Ljc2Mjg2IDUuOTg2ODYgOC4zNDE0IDQuODM3NyA5LjE3NTA1QzMuNjg4NTQgMTAuMDA4NyAyLjczMDczIDExLjA3ODIgMi4wMjgzOSAxMi4zMTJDMC45NTY0NjQgMTQuMTU5MSAwLjQ5ODkwNSAxNi4yOTg4IDAuNzIxNjk4IDE4LjQyMjhDMC45NDQ0OTIgMjAuNTQ2NyAxLjgzNjEyIDIyLjU0NDkgMy4yNjggMjQuMTI5M0MyLjgxOTY2IDI1LjQ3NTkgMi42NjQxMyAyNi45MDI2IDIuODExODIgMjguMzE0MUMyLjk1OTUxIDI5LjcyNTYgMy40MDcwMSAzMS4wODkyIDQuMTI0MzcgMzIuMzEzOEM1LjE4NzkxIDM0LjE2NTkgNi44MTIzIDM1LjYzMjIgOC43NjMyMSAzNi41MDEzQzEwLjcxNDEgMzcuMzcwNCAxMi44OTA3IDM3LjU5NzMgMTQuOTc4OSAzNy4xNDkyQzE1LjkyMDggMzguMjEwNyAxNy4wNzg2IDM5LjA1ODcgMTguMzc0NyAzOS42MzY2QzE5LjY3MDkgNDAuMjE0NCAyMS4wNzU1IDQwLjUwODcgMjIuNDk0NiA0MC40OTk4QzI0LjYzMDcgNDAuNTA1NCAyNi43MTMzIDM5LjgzMjEgMjguNDQxOCAzOC41NzcyQzMwLjE3MDQgMzcuMzIyMyAzMS40NTU2IDM1LjU1MDYgMzIuMTExOSAzMy41MTc5QzMzLjUwMjcgMzMuMjMzMiAzNC44MTY3IDMyLjY1NDcgMzUuOTY1OSAzMS44MjFDMzcuMTE1IDMwLjk4NzQgMzguMDcyOCAyOS45MTc4IDM4Ljc3NTIgMjguNjg0QzM5Ljg0NTggMjYuODM3MSA0MC4zMDIzIDI0LjY5NzkgNDAuMDc4OSAyMi41NzQ4QzM5Ljg1NTYgMjAuNDUxNyAzOC45NjM5IDE4LjQ1NDQgMzcuNTMyNCAxNi44NzA3Wk0yMi40OTc4IDM3Ljg4NDlDMjAuNzQ0MyAzNy44ODc0IDE5LjA0NTkgMzcuMjczMyAxNy42OTk0IDM2LjE1MDFDMTcuNzYwMSAzNi4xMTcgMTcuODY2NiAzNi4wNTg2IDE3LjkzNiAzNi4wMTYxTDI1LjkwMDQgMzEuNDE1NkMyNi4xMDAzIDMxLjMwMTkgMjYuMjY2MyAzMS4xMzcgMjYuMzgxMyAzMC45Mzc4QzI2LjQ5NjQgMzAuNzM4NiAyNi41NTYzIDMwLjUxMjQgMjYuNTU0OSAzMC4yODI1VjE5LjA1NDJMMjkuOTIxMyAyMC45OThDMjkuOTM4OSAyMS4wMDY4IDI5Ljk1NDEgMjEuMDE5OCAyOS45NjU2IDIxLjAzNTlDMjkuOTc3IDIxLjA1MiAyOS45ODQyIDIxLjA3MDcgMjkuOTg2NyAyMS4wOTAyVjMwLjM4ODlDMjkuOTg0MiAzMi4zNzUgMjkuMTk0NiAzNC4yNzkxIDI3Ljc5MDkgMzUuNjg0MUMyNi4zODcyIDM3LjA4OTIgMjQuNDgzOCAzNy44ODA2IDIyLjQ5NzggMzcuODg0OVpNNi4zOTIyNyAzMS4wMDY0QzUuNTEzOTcgMjkuNDg4OCA1LjE5NzQyIDI3LjcxMDcgNS40OTgwNCAyNS45ODMyQzUuNTU3MTggMjYuMDE4NyA1LjY2MDQ4IDI2LjA4MTggNS43MzQ2MSAyNi4xMjQ0TDEzLjY5OSAzMC43MjQ4QzEzLjg5NzUgMzAuODQwOCAxNC4xMjMzIDMwLjkwMiAxNC4zNTMyIDMwLjkwMkMxNC41ODMgMzAuOTAyIDE0LjgwODggMzAuODQwOCAxNS4wMDczIDMwLjcyNDhMMjQuNzMxIDI1LjExMDNWMjguOTk3OUMyNC43MzIxIDI5LjAxNzcgMjQuNzI4MyAyOS4wMzc2IDI0LjcxOTkgMjkuMDU1NkMyNC43MTE1IDI5LjA3MzYgMjQuNjk4OCAyOS4wODkzIDI0LjY4MjkgMjkuMTAxMkwxNi42MzE3IDMzLjc0OTdDMTQuOTA5NiAzNC43NDE2IDEyLjg2NDMgMzUuMDA5NyAxMC45NDQ3IDM0LjQ5NTRDOS4wMjUwNiAzMy45ODExIDcuMzg3ODUgMzIuNzI2MyA2LjM5MjI3IDMxLjAwNjRaTTQuMjk3MDcgMTMuNjE5NEM1LjE3MTU2IDEyLjA5OTggNi41NTI3OSAxMC45MzY0IDguMTk4ODUgMTAuMzMyN0M4LjE5ODg1IDEwLjQwMTMgOC4xOTQ5MSAxMC41MjI4IDguMTk0OTEgMTAuNjA3MVYxOS44MDhDOC4xOTM1MSAyMC4wMzc4IDguMjUzMzQgMjAuMjYzOCA4LjM2ODIzIDIwLjQ2MjlDOC40ODMxMiAyMC42NjE5IDguNjQ4OTMgMjAuODI2NyA4Ljg0ODYzIDIwLjk0MDRMMTguNTcyMyAyNi41NTQyTDE1LjIwNiAyOC40OTc5QzE1LjE4OTQgMjguNTA4OSAxNS4xNzAzIDI4LjUxNTUgMTUuMTUwNSAyOC41MTczQzE1LjEzMDcgMjguNTE5MSAxNS4xMTA3IDI4LjUxNiAxNS4wOTI0IDI4LjUwODJMNy4wNDA0NiAyMy44NTU3QzUuMzIxMzUgMjIuODYwMSA0LjA2NzE2IDIxLjIyMzUgMy41NTI4OSAxOS4zMDQ2QzMuMDM4NjIgMTcuMzg1OCAzLjMwNjI0IDE1LjM0MTMgNC4yOTcwNyAxMy42MTk0Wk0zMS45NTUgMjAuMDU1NkwyMi4yMzEyIDE0LjQ0MTFMMjUuNTk3NiAxMi40OTgxQzI1LjYxNDIgMTIuNDg3MiAyNS42MzMzIDEyLjQ4MDUgMjUuNjUzMSAxMi40Nzg3QzI1LjY3MjkgMTIuNDc2OSAyNS42OTI4IDEyLjQ4MDEgMjUuNzExMSAxMi40ODc5TDMzLjc2MzEgMTcuMTM2NEMzNC45OTY3IDE3Ljg0OSAzNi4wMDE3IDE4Ljg5ODIgMzYuNjYwNiAyMC4xNjEzQzM3LjMxOTQgMjEuNDI0NCAzNy42MDQ3IDIyLjg0OSAzNy40ODMyIDI0LjI2ODRDMzcuMzYxNyAyNS42ODc4IDM2LjgzODIgMjcuMDQzMiAzNS45NzQzIDI4LjE3NTlDMzUuMTEwMyAyOS4zMDg2IDMzLjk0MTUgMzAuMTcxNyAzMi42MDQ3IDMwLjY2NDFDMzIuNjA0NyAzMC41OTQ3IDMyLjYwNDcgMzAuNDczMyAzMi42MDQ3IDMwLjM4ODlWMjEuMTg4QzMyLjYwNjYgMjAuOTU4NiAzMi41NDc0IDIwLjczMjggMzIuNDMzMiAyMC41MzM4QzMyLjMxOSAyMC4zMzQ4IDMyLjE1NCAyMC4xNjk4IDMxLjk1NSAyMC4wNTU2Wk0zNS4zMDU1IDE1LjAxMjhDMzUuMjQ2NCAxNC45NzY1IDM1LjE0MzEgMTQuOTE0MiAzNS4wNjkgMTQuODcxN0wyNy4xMDQ1IDEwLjI3MTJDMjYuOTA2IDEwLjE1NTQgMjYuNjgwMyAxMC4wOTQzIDI2LjQ1MDQgMTAuMDk0M0MyNi4yMjA2IDEwLjA5NDMgMjUuOTk0OCAxMC4xNTU0IDI1Ljc5NjMgMTAuMjcxMkwxNi4wNzI2IDE1Ljg4NThWMTEuOTk4MkMxNi4wNzE1IDExLjk3ODMgMTYuMDc1MyAxMS45NTg1IDE2LjA4MzcgMTEuOTQwNUMxNi4wOTIxIDExLjkyMjUgMTYuMTA0OCAxMS45MDY4IDE2LjEyMDcgMTEuODk0OUwyNC4xNzE5IDcuMjUwMjVDMjUuNDA1MyA2LjUzOTAzIDI2LjgxNTggNi4xOTM3NiAyOC4yMzgzIDYuMjU0ODJDMjkuNjYwOCA2LjMxNTg5IDMxLjAzNjQgNi43ODA3NyAzMi4yMDQ0IDcuNTk1MDhDMzMuMzcyMyA4LjQwOTM5IDM0LjI4NDIgOS41Mzk0NSAzNC44MzM0IDEwLjg1MzFDMzUuMzgyNiAxMi4xNjY3IDM1LjU0NjQgMTMuNjA5NSAzNS4zMDU1IDE1LjAxMjhaTTE0LjI0MjQgMjEuOTQxOUwxMC44NzUyIDE5Ljk5ODFDMTAuODU3NiAxOS45ODkzIDEwLjg0MjMgMTkuOTc2MyAxMC44MzA5IDE5Ljk2MDJDMTAuODE5NSAxOS45NDQxIDEwLjgxMjIgMTkuOTI1NCAxMC44MDk4IDE5LjkwNThWMTAuNjA3MUMxMC44MTA3IDkuMTgyOTUgMTEuMjE3MyA3Ljc4ODQ4IDExLjk4MTkgNi41ODY5NkMxMi43NDY2IDUuMzg1NDQgMTMuODM3NyA0LjQyNjU5IDE1LjEyNzUgMy44MjI2NEMxNi40MTczIDMuMjE4NjkgMTcuODUyNCAyLjk5NDY0IDE5LjI2NDkgMy4xNzY3QzIwLjY3NzUgMy4zNTg3NiAyMi4wMDg5IDMuOTM5NDEgMjMuMTAzNCA0Ljg1MDY3QzIzLjA0MjcgNC44ODM3OSAyMi45MzcgNC45NDIxNSAyMi44NjY4IDQuOTg0NzNMMTQuOTAyNCA5LjU4NTE3QzE0LjcwMjUgOS42OTg3OCAxNC41MzY2IDkuODYzNTYgMTQuNDIxNSAxMC4wNjI2QzE0LjMwNjUgMTAuMjYxNiAxNC4yNDY2IDEwLjQ4NzcgMTQuMjQ3OSAxMC43MTc1TDE0LjI0MjQgMjEuOTQxOVpNMTYuMDcxIDE3Ljk5OTFMMjAuNDAxOCAxNS40OTc4TDI0LjczMjUgMTcuOTk3NVYyMi45OTg1TDIwLjQwMTggMjUuNDk4M0wxNi4wNzEgMjIuOTk4NVYxNy45OTkxWiIgZmlsbD0iY3VycmVudENvbG9yIj48L3BhdGg+PC9zdmc+
// @homepage            https://scriptcat.org/script-show-page/1027
// @license             All Rights Reserved
// ==/UserScript==

/********************************* 自定义配置区 ********************************/
var setting = {
    showBox: 1,     // 显示脚本浮窗，0为关闭，1为开启，不建议关闭
    task: 0,        // 只处理任务点任务，0为关闭，1为开启
    video: 1,       // 处理视频，0为关闭，1为开启
    audio: 1,       // 处理音频，0为关闭，1为开启
    rate: 1,        // 视频/音频倍速，默认 1（正常），可在浮窗设置中调整（最高 16）
    review: 0,      // 复习模式，0为关闭，1为开启可以补挂视频时长
    work: 1,        // 测验自动处理，0为关闭，1为开启，开启将会处理测验，关闭会跳过测验
    time: 2500,     // 答题与搜题时间间隔，默认2.5s=2500
    sub: 1,         // 测验自动提交，0为关闭,1为开启，当没答案时测验将不会提交，如需提交请设置force：1
    force: 0,       // 测验强制提交，0为关闭，1为开启，开启此功能将会强制提交测验（无论作答与否）
    decrypt: 1,     // 字体解密，0为关闭，1为开启，推荐开启，方法来自wyn665817大佬
    redo: 0,        // 重做模式，0为关闭，1为开启，开启后不跳过已答题，重新AI作答覆盖旧答案
    examTurn: 0,     // 考试自动跳转下一题，0为关闭，1为开启
    examTurnTime: 0, // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
    goodStudent: 1,  // 好学生模式,不自动选择答案,仅将单选题和多选题的ABCD加粗
    alterTitle: 1,  //修改题目,将AI回复的答案插入题目中,不建议关闭,AI回复不能完全匹配答案,题目显示答案供手动选择
    autoLogin: 0,   // 自动登录，0为关闭，1为开启，开启此功能请配置登陆配置项
    phone: '',      // 登录配置项：登录手机号/超星号
    password: ''    // 登录配置项：登录密码
};

// 调试开关
var DEBUG_MODE = false;      // 控制台详细日志
var LOG_LEVEL = 2;           // 0:静默 1:仅错误 2:普通 3:调试

// 全局状态变量
var _mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c, $okBtn;
var _currentQuestionMeta = null;
var _ne21NextAiAllowedAt = 0;
var _videoRefreshCount = new Map();   // 记录每个视频任务的刷新次数
var _quizRetryRounds = new Map();     // 记录每个视频弹题的重试轮数

// 辅助函数
function logger(str, color) {
    if (LOG_LEVEL === 0) return;
    var _time = new Date().toLocaleTimeString();
    var colorMap = { red:'#dc2626', green:'#059669', blue:'#2563eb', yellow:'#ca8a04', orange:'#ea580c', purple:'#7c3aed', pink:'#db2777', gray:'#64748b' };
    var c = colorMap[color] || color || '#334155';
    var $p = $('<p><span class="ne21-time">[' + _time + ']</span><span class="ne21-msg" style="color:' + c + ';">' + str + '</span></p>');
    $('#ne-21log', window.parent.document).prepend($p);
    if (DEBUG_MODE) console.log('[NE21]', str);
    return $p;
}
function updateLogEntry($p, str, color) {
    if (!$p || !$p.length) return;
    var colorMap = { red:'#dc2626', green:'#059669', blue:'#2563eb', yellow:'#ca8a04', orange:'#ea580c', purple:'#7c3aed', pink:'#db2777', gray:'#64748b' };
    var c = colorMap[color] || color || '#334155';
    $p.find('.ne21-msg').css('color', c).html(str);
}

// 基于 GM_getValue/GM_setValue 实现跨子域名共享的 localStorage 代理
var localStorage = {
    _getPrefix: function () {
        try {
            var host = window.location.hostname;
            var matches = host.match(/([^.]+\.(?:com|net|org|edu)\.cn|[^.]+\.[^.]+)$/i);
            return (matches ? matches[0] : host) + ':';
        } catch (e) {
            return '';
        }
    },
    getItem: function (key) {
        var prefixedKey = this._getPrefix() + key;
        var val = undefined;
        try {
            val = GM_getValue(prefixedKey);
        } catch (e) { }
        if (val === undefined || val === null) {
            try {
                val = window.localStorage.getItem(key);
                if (val !== null) {
                    GM_setValue(prefixedKey, val);
                }
            } catch (e) { }
        }
        return (val !== undefined && val !== null) ? val : null;
    },
    setItem: function (key, value) {
        var prefixedKey = this._getPrefix() + key;
        try {
            GM_setValue(prefixedKey, String(value));
        } catch (e) { }
        try {
            window.localStorage.setItem(key, String(value));
        } catch (e) { }
    },
    removeItem: function (key) {
        var prefixedKey = this._getPrefix() + key;
        try {
            GM_deleteValue(prefixedKey);
        } catch (e) { }
        try {
            window.localStorage.removeItem(key);
        } catch (e) { }
    }
};

var _w = unsafeWindow,
    _l = location,
    _d = _w.document,
    $ = _w.jQuery || top.jQuery,
    md5 = md5 || window.md5,
    UE = _w.UE,
    Swal = Swal || window.Swal;

// 劫持页面失去焦点与后台检测
try {
    Object.defineProperty(unsafeWindow, 'onblur', {
        get: function () { return function () { }; },
        set: function () { }
    });
    document.hasFocus = function () { return true; };
    Object.defineProperty(document, 'visibilityState', {
        get: function () { return 'visible'; },
        configurable: true
    });
    Object.defineProperty(document, 'hidden', {
        get: function () { return false; },
        configurable: true
    });
} catch (e) {
    console.error('[NE21] 劫持失败', e);
}

$('.navshow').find('a:contains(体验新版)')[0] ? $('.navshow').find('a:contains(体验新版)')[0].click() : '';

// 字体解密（增加异常处理）
function decryptFont() {
    if (!setting.decrypt) return;
    try {
        var $tip = $('style:contains(font-cxsecret)');
        if (!$tip.length) return;
        var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
        font = Typr.parse(base64ToUint8Array(font))[0];
        var table = JSON.parse(GM_getResourceText('Table'));
        var match = {};
        for (var i = 19968; i < 40870; i++) {
            $tip = Typr.U.codeToGlyph(font, i);
            if (!$tip) continue;
            $tip = Typr.U.glyphToPath(font, $tip);
            $tip = md5(JSON.stringify($tip)).slice(24);
            match[i] = table[$tip];
        }
        $('.font-cxsecret').html(function (index, html) {
            $.each(match, function (key, value) {
                key = String.fromCharCode(key);
                key = new RegExp(key, 'g');
                value = String.fromCharCode(value);
                html = html.replace(key, value);
            });
            return html;
        }).removeClass('font-cxsecret');
    } catch(e) {
        logger('字体解密失败，跳过', 'orange');
    }
}
setting.decrypt ? decryptFont() : '';

// 同步本地缓存的全局设置
if (localStorage.getItem('GPTJsSetting.time') !== null) {
    var _savedTime = parseFloat(localStorage.getItem('GPTJsSetting.time'));
    if (isFinite(_savedTime) && _savedTime >= 0) {
        setting.time = _savedTime * 1000;
    }
}

// F9 显示/隐藏面板
function toggleBoxVisibility() {
    var $box = $('#ne-21box');
    if ($box.length === 0) {
        try { $box = $('#ne-21box', top.document); } catch (_) { }
    }
    if ($box.length === 0) return;
    if (localStorage.getItem('GPTJsSetting.showBox') === 'hide') {
        $box.css('display', '');
        localStorage.setItem('GPTJsSetting.showBox', 'show');
        try { logger('F9 显示面板'); } catch (_) { }
    } else {
        $box.css('display', 'none');
        localStorage.setItem('GPTJsSetting.showBox', 'hide');
    }
}
$(document).on('keydown.ne21f9', function (e) {
    if (e.keyCode === 120) toggleBoxVisibility();
});
try {
    if (top !== window) {
        $(top.document).on('keydown.ne21f9', function (e) {
            if (e.keyCode === 120) toggleBoxVisibility();
        });
    }
} catch (_) { }

function waitForJQueryElement(selector, timeout) {
    return new Promise(function (resolve) {
        var interval = setInterval(function () {
            if ($(selector).length > 0) {
                clearInterval(interval);
                if (timer) clearTimeout(timer);
                resolve(true);
            }
        }, 500);
        var timer = null;
        if (timeout && timeout > 0) {
            timer = setTimeout(function () {
                clearInterval(interval);
                resolve(false);
            }, timeout);
        }
    });
}

if (window === top) {
    showBox();
}

// 根据 URL 路由执行不同任务
if (_l.hostname.startsWith('i.mooc.') || _l.hostname.startsWith('i.chaoxing.com') || _l.hostname === 'i.chaoxing.com') {
    if (window === top) {
        logger('DeepSeek自动刷课助手已就绪（全面改进版），进入课程视频、作业或考试页面即可自动运行', 'green');
    }
} else if (_l.pathname == '/login') {
    showBox()
    if (setting.autoLogin) waitForJQueryElement('#phone').then(function () { autoLogin() });
} else if (_l.pathname.includes('/mycourse/studentstudy')) {
    showBox()
    $('#ne-21log', window.parent.document).html('初始化完毕！')
    setupAntiSleep()
    setupAutoRefresh()
    setInterval(function () {
        try {
            if (typeof window.checkJob === 'function' && !window._gptCheckJobHooked) {
                window._gptCheckJobHooked = true;
                window.checkJob = function () { return false; };
            }
        } catch (_) { }
        try {
            if (window.PCount && typeof window.PCount.next === 'function' && !window.PCount._gptHooked) {
                var _origPCountNext = window.PCount.next;
                window.PCount.next = function () {
                    if (window._gptJsJumpAllowed) {
                        window._gptJsJumpAllowed = false;
                        return _origPCountNext.apply(this, arguments);
                    }
                    console.log('[NE21] 拦截 PCount.next 自动跳转');
                    return false;
                };
                window.PCount._gptHooked = true;
            }
        } catch (_) { }
    }, 1000);
    var _blankSectionChecks = 0;
    var _lastBlankSectionUrl = '';
    var _blankSkipping = false;
    setInterval(function () {
        if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') return;
        if (_blankSkipping) return;
        var cardsDoc = null;
        try {
            for (var i = 0; i < window.frames.length; i++) {
                try {
                    var f = window.frames[i];
                    var doc = f.document || f.contentDocument;
                    if (doc && doc.location && doc.location.pathname.includes('/knowledge/cards')) {
                        cardsDoc = doc;
                        break;
                    }
                } catch (e) { }
            }
        } catch (e) { }
        if (!cardsDoc) return;
        var unfinished = cardsDoc.querySelectorAll('.ans-attach-ct:not(.ans-job-finished), .ans-job-ct:not(.ans-job-finished)');
        if (unfinished.length > 0) {
            _blankSectionChecks = 0;
            _lastBlankSectionUrl = '';
            return;
        }
        var anyExists = cardsDoc.querySelectorAll('.ans-attach-ct, .ans-job-ct, .chapter-item').length;
        if (anyExists > 0) {
            _blankSectionChecks = 0;
            _lastBlankSectionUrl = '';
            return;
        }
        var currentUrl = '';
        try { currentUrl = cardsDoc.location.href; } catch (e) { }
        if (currentUrl !== _lastBlankSectionUrl) {
            _blankSectionChecks = 0;
            _lastBlankSectionUrl = currentUrl;
        }
        _blankSectionChecks++;
        if (_blankSectionChecks >= 2) {
            _blankSectionChecks = 0;
            _lastBlankSectionUrl = '';
            _blankSkipping = true;
            logger('检测到无任务点，自动跳过', 'red');
            setTimeout(function () {
                try { window._gptJsJumpAllowed = true; } catch (_) { }
                var nextBtn = document.querySelector('#mainid > .prev_next.next');
                if (nextBtn) { nextBtn.click(); }
                else {
                    var focusBtn = document.querySelector('#prevNextFocusNext');
                    if (focusBtn) { focusBtn.click(); }
                }
                setTimeout(function () { _blankSkipping = false; }, 5000);
            }, 500);
        } else {
            logger('检测到无任务点，等待确认', 'orange');
        }
    }, 5000);
} else if (_l.pathname.includes('/knowledge/cards')) {
    setupAntiSleep()
    var params = getTaskParams()
    var parsedParams = null;
    if (params && params !== '$mArg') {
        try { parsedParams = $.parseJSON(params); } catch (e) { parsedParams = null; }
    }
    if (!parsedParams || !parsedParams['attachments'] || parsedParams['attachments'].length <= 0) {
        logger('检测到无任务点（无任务参数），自动跳过', 'red')
        setTimeout(function () { toNext() }, 2000)
    } else {
        // 延长等待时间至10秒，避免异步加载延迟误判
        waitForJQueryElement('.wrap .ans-cc .ans-attach-ct', 10000).then(function (found) {
            if (!found) {
                var anyExists = document.querySelectorAll('.ans-attach-ct, .ans-job-ct, .chapter-item').length;
                if (anyExists > 0) {
                    logger('章节任务均已完成，准备跳转', 'green')
                } else {
                    logger('检测到无任务点（DOM 无任务节点），自动跳过', 'red')
                }
                setTimeout(function () { toNext() }, 2000)
                return;
            }
            try { if (typeof top.checkJob === 'function') top.checkJob = function () { return false; }; } catch (_) { }
            var _checkJobGuard = setInterval(function () {
                try { if (typeof top.checkJob === 'function') top.checkJob = function () { return false; }; } catch (_) { }
            }, 3000);
            _domList = []
            _mlist = parsedParams['attachments']
            _defaults = parsedParams['defaults']
            $.each($('.wrap .ans-cc .ans-attach-ct'), (i, t) => {
                _domList.push($(t).find('iframe'))
            })
            missonStart()
        });
    }
} else if (_l.pathname.includes('/exam/test/reVersionTestStartNew')) {
    showBox()
    waitForJQueryElement('.mark_table .whiteDiv').then(function () { missonExam() });
} else if (_l.pathname.includes('/mooc2/exam/preview')) {
    showBox()
    waitForJQueryElement('.mark_table .questionLi').then(function () { missonExamPreview() });
} else if (_l.pathname.includes('/mooc2/work/dowork')) {
    showBox()
    waitForJQueryElement('.mark_table form').then(function () { missonHomeWork() });
} else if (_l.pathname.includes('/work/phone/doHomeWork')) {
    var _oldal = _w.alert
    _w.alert = function (msg) {
        if (msg == '保存成功') {
            return;
        }
        return _oldal(msg)
    }
    var _oldcf = _w.confirm
    _w.confirm = function (msg) {
        if (msg.includes('确认提交') || msg.includes('未做完')) {
            return true
        }
        return _oldcf(msg)
    }
} else {
    if (window === top) {
        logger('DeepSeek自动刷课助手已就绪，进入课程视频、作业或考试页面即可自动运行', 'green');
    }
}

// ===================== 增强的 API 响应解析 =====================
function extractAnswerFromText(answer, type, optionsCount) {
    if (!answer) return null;
    var s = answer.trim();
    // 判断题
    if (type === 3) {
        var lower = s.toLowerCase();
        if (/正确|对|是|√|true|right|yes/.test(lower)) return '正确';
        if (/错误|错|否|×|false|wrong|no/.test(lower)) return '错误';
        return null;
    }
    // 单选题
    if (type === 0) {
        var match = s.match(/\b([A-Z])\b/);
        if (match) return match[1];
        return s;
    }
    // 多选题
    if (type === 1) {
        var letters = s.match(/[A-Z]/g);
        if (letters && letters.length) return letters.join('|');
        if (s.includes('|')) return s;
        return s;
    }
    // 填空题：优先使用 § 分隔，兼容旧版 |
    if (type === 2) {
        if (s.includes('§')) return s.split('§').map(function(t){ return t.trim(); }).join('|');
        if (s.includes('|')) return s;
        return s;
    }
    return s;
}

// ===================== 填空答案分割辅助函数 =====================
function splitFillAnswers(answer) {
    if (!answer) return [];
    if (answer.includes('§')) return answer.split('§').map(s => s.trim());
    return answer.split('|').map(s => s.trim());
}

// ===================== 核心：调用 DeepSeek API（改进版） =====================
function getAnswer(_t, _q, retryCount, skipThrottle) {
    retryCount = retryCount || 0;
    skipThrottle = skipThrottle || false;

    var apiKey = GM_getValue('deepseekApiKey', '');
    var model = GM_getValue('deepseekModel', 'deepseek-chat');
    var baseUrl = 'https://api.deepseek.com/v1/chat/completions';

    if (!apiKey) {
        logger('请先在脚本浮窗设置中填写 DeepSeek API Key', 'red');
        return Promise.reject({ c: 0 });
    }

    var _payload, _display;
    if (_q && typeof _q === 'object' && (_q.payload != null || _q.display != null)) {
        _payload = _q.payload != null ? String(_q.payload) : '';
        _display = _q.display != null ? String(_q.display) : _payload;
    } else {
        _payload = _q == null ? '' : String(_q);
        _display = _payload;
    }

    var _qPrefix = '';
    if (_currentQuestionMeta) {
        var _m = _currentQuestionMeta;
        _qPrefix = '第' + ((_m.index != null ? _m.index : -1) + 1);
        if (_m.total) _qPrefix += '/' + _m.total;
        _qPrefix += '题 [' + (_m.typeName || '未知') + '] ';
    }
    logger(_qPrefix + '题目:' + _display, 'pink');

    var _thinkingHtml = '<span class="ne21-log-spinner"></span>AI 思考中<span class="ne21-log-dots"><i></i><i></i><i></i></span>' + (retryCount > 0 ? '（第' + (retryCount + 1) + '次）' : '');
    var $thinkingLog = logger(_thinkingHtml, 'gray');

    return new Promise((resolve, reject) => {
        var requestCompleted = false;
        var longWaitTimer = null;

        var _intervalMs = Math.min(60000, setting.time !== undefined ? setting.time : 2500);
        var _nowTs = Date.now();
        var _waitMs = skipThrottle ? 0 : Math.max(0, _ne21NextAiAllowedAt - _nowTs);
        if (!skipThrottle) _ne21NextAiAllowedAt = Math.max(_nowTs, _ne21NextAiAllowedAt) + _intervalMs;

        if (_waitMs > 0) {
            updateLogEntry($thinkingLog, '搜题间隔限制，等待 ' + Math.round(_waitMs / 1000) + 's 后发起请求...', 'gray');
        }

        longWaitTimer = setTimeout(() => {
            if (!requestCompleted) {
                requestCompleted = true;
                updateLogEntry($thinkingLog, '请求超过5分钟未响应，重新发起...（第' + (retryCount + 1) + '次重试）', 'orange');
                getAnswer(_t, _q, retryCount + 1, true).then(resolve).catch(reject);
            }
        }, 300000 + _waitMs);

        setTimeout(() => {
            if (requestCompleted) return;

            var promptText = '';
            try {
                var parsed = JSON.parse(_payload);
                var qText = parsed.question || '';
                var opts = parsed.options || [];
                var type = parsed.type || '';
                var format = parsed.answer_format || '';
                promptText = '题型：' + type + '\n题目：' + qText;
                if (opts.length) promptText += '\n选项：' + opts.join(' | ');
                if (format) promptText += '\n答案格式：' + format;
                promptText += '\n请只输出答案，不要输出任何解释。对于填空题，多个填空之间用“§”分割。';
            } catch(e) {
                promptText = _payload;
            }

            var requestBody = {
                model: model,
                messages: [
                    { role: 'system', content: '你是一个答题助手，根据题目输出答案。对于判断题输出“正确”或“错误”；对于多选题用“|”分割选项内容或字母；对于填空题用“§”分割各空答案。不要输出多余解释。' },
                    { role: 'user', content: promptText }
                ],
                temperature: 0.3,
                max_tokens: 500
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify(requestBody),
                timeout: 120000,
                onload: function(xhr) {
                    if (requestCompleted) return;
                    requestCompleted = true;
                    clearTimeout(longWaitTimer);

                    if (xhr.status === 200) {
                        try {
                            var obj = JSON.parse(xhr.responseText);
                            var raw = obj.choices[0].message.content.trim();
                            var answer = extractAnswerFromText(raw, _t, 0);
                            if (!answer) answer = raw;
                            answer = answer.replace(/[。！？；：，、]$/, '').trim();
                            updateLogEntry($thinkingLog, "答案:" + answer, 'purple');
                            resolve(answer);
                        } catch(e) {
                            updateLogEntry($thinkingLog, '解析 AI 响应失败', 'red');
                            reject({ c: 0 });
                        }
                    } else if (xhr.status === 401) {
                        updateLogEntry($thinkingLog, 'API Key 无效，请在设置中检查', 'red');
                        reject({ c: 401 });
                    } else if (xhr.status === 429) {
                        updateLogEntry($thinkingLog, '请求频率过高，请稍后再试', 'red');
                        reject({ c: 429 });
                    } else {
                        updateLogEntry($thinkingLog, `API 错误 (${xhr.status})`, 'red');
                        reject({ c: 0 });
                    }
                },
                onerror: function() {
                    if (requestCompleted) return;
                    requestCompleted = true;
                    clearTimeout(longWaitTimer);
                    updateLogEntry($thinkingLog, '网络请求失败', 'red');
                    reject({ c: 0 });
                },
                ontimeout: function() {
                    if (requestCompleted) return;
                    requestCompleted = true;
                    clearTimeout(longWaitTimer);
                    updateLogEntry($thinkingLog, '请求超时', 'red');
                    reject({ c: 0 });
                }
            });
        }, _waitMs);
    });
}

// ===================== 视频弹题处理（增加重试轮数限制） =====================
function handleVideoQuiz(doc, media, taskName) {
    if (!setting.work || localStorage.getItem('GPTJsSetting.isPaused') === 'true') return false;
    var container = doc.querySelector('.ans-videoquiz');
    var submitBtn = doc.querySelector('#videoquiz-submit');
    if (!container || !submitBtn) return false;

    var quizText = container.innerText || '';
    if (quizText.indexOf('恭喜你，答对了！') !== -1 || quizText.indexOf('继续学习') !== -1) {
        logger('弹题已答对，尝试点击“继续学习”并清理弹窗', 'green');
        var btn = Array.prototype.slice.call(container.querySelectorAll('a, button, span, div')).find(function(el) {
            var txt = (el.innerText || el.textContent || '').trim();
            return txt === '继续学习' || txt.indexOf('继续') !== -1;
        });
        if (btn) { try { btn.click(); } catch(_) { } }
        setTimeout(function() {
            try {
                if (container && container.parentNode) container.parentNode.removeChild(container);
                Array.prototype.forEach.call(doc.querySelectorAll('.x-component-default'), function(node) { node.style.display = 'none'; });
                if (media && media.paused && localStorage.getItem('GPTJsSetting.isPaused') !== 'true') media.play();
            } catch(_) { }
        }, 800);
        return true;
    }

    if (container.getAttribute('data-ne21-status') === 'processing') return true;

    var optionNodes = Array.prototype.slice.call(container.querySelectorAll('.ans-videoquiz-opt label'));
    if (optionNodes.length === 0) optionNodes = Array.prototype.slice.call(container.querySelectorAll('label'));
    if (optionNodes.length === 0) return false;

    container.setAttribute('data-ne21-status', 'processing');
    try { media.pause(); } catch(_) { }

    var optionTexts = optionNodes.map(function(label) { return (label.innerText || label.textContent || '').trim(); });
    var inputTypes = optionNodes.map(function(label) {
        var input = label.querySelector('input');
        return input ? String(input.type || '').toLowerCase() : '';
    });
    var isMultiple = inputTypes.indexOf('checkbox') !== -1;
    var isJudge = !isMultiple && optionTexts.length === 2 && optionTexts.some(function(t) { return /正确|错误|对|错|是|否|true|false/i.test(t); });
    var question = getVideoQuizText(container, optionNodes) || '视频弹题';
    var typeName = isMultiple ? '多选题' : (isJudge ? '判断题' : '单选题');

    // 重试轮数限制
    var quizKey = taskName || question.slice(0, 50);
    if (!_quizRetryRounds.has(quizKey)) _quizRetryRounds.set(quizKey, 0);
    var currentRound = _quizRetryRounds.get(quizKey);
    var MAX_ROUNDS = 3;

    window._failedVideoQuizzes = window._failedVideoQuizzes || {};
    if (!window._failedVideoQuizzes[question]) {
        window._failedVideoQuizzes[question] = { triedIndexes: [], lastTriedIndexes: [] };
    }
    var quizRecord = window._failedVideoQuizzes[question];

    if (currentRound >= MAX_ROUNDS) {
        logger('视频弹题已尝试 ' + MAX_ROUNDS + ' 轮，无法自动通过，请手动处理', 'red');
        container.removeAttribute('data-ne21-status');
        return false;
    }

    if (quizRecord.lastTriedIndexes && quizRecord.lastTriedIndexes.length > 0) {
        quizRecord.triedIndexes = quizRecord.triedIndexes.concat(quizRecord.lastTriedIndexes);
        quizRecord.triedIndexes = quizRecord.triedIndexes.filter(function(item, pos, self) { return self.indexOf(item) === pos; });
        quizRecord.lastTriedIndexes = [];
    }

    if (quizRecord.triedIndexes.length >= optionTexts.length) {
        _quizRetryRounds.set(quizKey, currentRound + 1);
        quizRecord.triedIndexes = [];
    }

    var doSubmit = function(indexes) {
        quizRecord.lastTriedIndexes = indexes;
        indexes.forEach(function(idx) {
            var label = optionNodes[idx];
            if (!label) return;
            label.style.fontWeight = 'bold';
            label.style.color = '#dc2626';
            if (localStorage.getItem('GPTJsSetting.goodStudent') !== 'true') {
                setTimeout(function() { label.click(); }, 100);
            }
        });
        if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
            logger('视频弹题答案已加粗，当前为好学生模式，请手动选择并提交', 'orange');
            container.removeAttribute('data-ne21-status');
            return;
        }
        setTimeout(function() {
            submitBtn.click();
            logger('视频弹题已提交，准备继续播放', 'green');
            setTimeout(function() {
                try {
                    var quiz = doc.querySelector('#video .ans-videoquiz, .ans-videoquiz');
                    if (quiz) {
                        var txt = quiz.innerText || '';
                        if (txt.indexOf('恭喜你，答对了！') !== -1 || txt.indexOf('继续学习') !== -1) {
                            var btn = Array.prototype.slice.call(quiz.querySelectorAll('a, button, span, div')).find(function(el) {
                                var t = (el.innerText || el.textContent || '').trim();
                                return t === '继续学习' || t.indexOf('继续') !== -1;
                            });
                            if (btn) { try { btn.click(); } catch(_) { } }
                            setTimeout(function() {
                                if (quiz && quiz.parentNode) quiz.parentNode.removeChild(quiz);
                                Array.prototype.forEach.call(doc.querySelectorAll('.x-component-default'), function(node) { node.style.display = 'none'; });
                                if (media && media.paused && localStorage.getItem('GPTJsSetting.isPaused') !== 'true') media.play();
                            }, 800);
                        } else {
                            quiz.removeAttribute('data-ne21-status');
                            container.removeAttribute('data-ne21-status');
                        }
                    } else {
                        Array.prototype.forEach.call(doc.querySelectorAll('.x-component-default'), function(node) { node.style.display = 'none'; });
                        if (media && media.paused && localStorage.getItem('GPTJsSetting.isPaused') !== 'true') media.play();
                    }
                } catch(_) { }
            }, 1500);
        }, 600);
    };

    if (quizRecord.triedIndexes.length > 0) {
        var remainingIndexes = [];
        optionTexts.forEach(function(_, idx) {
            if (quizRecord.triedIndexes.indexOf(idx) === -1) remainingIndexes.push(idx);
        });
        if (remainingIndexes.length === 0) {
            quizRecord.triedIndexes = [];
            remainingIndexes = optionTexts.map(function(_, idx) { return idx; });
        }
        var nextIndexes = [remainingIndexes[0]];
        logger('视频弹题上一选项错误，排除后尝试新选项: ' + nextIndexes.map(function(i) { return optionTexts[i]; }).join(','), 'orange');
        doSubmit(nextIndexes);
    } else {
        var prompt = buildPrompt({
            type: typeName,
            question: question,
            options: optionTexts,
            answer_format: isMultiple ? "用'|'分割多个答案，或回答选项字母" : (isJudge ? '只回答正确或错误，或回答选项字母' : '只回答一个选项字母或选项内容')
        });
        logger('检测到视频中题目，开始处理：' + (taskName || ''), 'purple');
        getAnswer(isMultiple ? 1 : (isJudge ? 3 : 0), prompt, 0, false).then(function(answer) {
            var indexes;
            if (isJudge) {
                var parsed = parseJudgeAnswer(answer);
                if (parsed) {
                    indexes = [];
                    optionTexts.forEach(function(text, idx) {
                        var norm = normalizeChoiceText(text);
                        if (parsed === 'true' && /正确|对|是|true|√/i.test(norm)) indexes.push(idx);
                        if (parsed === 'false' && /错误|错|否|false|×/i.test(norm)) indexes.push(idx);
                    });
                }
            }
            if (!indexes || indexes.length === 0) {
                indexes = findVideoQuizMatchIndexes(optionTexts, answer, isMultiple);
            }
            if (indexes.length === 0) {
                logger('视频弹题未能匹配到选项，已暂停等待手动处理', 'red');
                container.removeAttribute('data-ne21-status');
                return;
            }
            doSubmit(indexes);
        }).catch(function() {
            logger('视频弹题 AI 作答失败，已暂停等待手动处理', 'red');
            container.removeAttribute('data-ne21-status');
        });
    }
}

// ===================== 视频任务（增加刷新次数限制） =====================
function missonVideo(dom, obj) {
    var taskId = (obj.property && (obj.property.objectid || obj.property._jobid)) || (obj.jobid) || ('video_' + Date.now());
    if (!_videoRefreshCount.has(taskId)) _videoRefreshCount.set(taskId, 0);
    var refreshCount = _videoRefreshCount.get(taskId);
    var MAX_REFRESH = 2;

    const { isPassed, property } = obj;
    const { name, module } = property;
    const isAudioTask = module === 'insertaudio';
    const taskLabel = isAudioTask ? '音频' : '视频';

    if (isAudioTask ? !setting.audio : !setting.video) {
        logger(`用户设置不处理${taskLabel}任务，准备开始下一个任务。`, 'red');
        return setTimeout(switchMission, 3000);
    }
    if (!setting.review && isPassed === true) {
        logger(`${taskLabel}：${name} 检测已完成，准备处理下一个任务`, 'green');
        return switchMission();
    }

    let mediaType = isAudioTask ? 'audio' : 'video';
    logger(`处理${taskLabel}：${name}，正在解析`);
    window._failedVideoQuizzes = {};
    let executed = false;
    let _parseDebugLogged = false;
    const PARSE_TIMEOUT_MS = 60 * 1000;
    const parseStartTime = Date.now();

    function searchIframesForMedia(iframes) {
        for (var fi = 0; fi < iframes.length; fi++) {
            var frame = iframes[fi];
            var frameDoc;
            try {
                frameDoc = frame.contentDocument || frame.contentWindow.document;
            } catch (_) { continue; }
            if (!frameDoc) continue;
            var m = frameDoc.querySelector('video') || frameDoc.querySelector('audio');
            if (m) {
                if (m.tagName.toLowerCase() === 'audio') mediaType = 'audio';
                return { media: m, doc: frameDoc };
            }
            try {
                var nested = frameDoc.querySelectorAll('iframe');
                for (var ni = 0; ni < nested.length; ni++) {
                    var nDoc;
                    try { nDoc = nested[ni].contentDocument || nested[ni].contentWindow.document; } catch (_) { continue; }
                    if (!nDoc) continue;
                    m = nDoc.querySelector('video') || nDoc.querySelector('audio');
                    if (m) {
                        if (m.tagName.toLowerCase() === 'audio') mediaType = 'audio';
                        return { media: m, doc: nDoc };
                    }
                }
            } catch (_) { }
        }
        return null;
    }

    const intervalId = setInterval(() => {
        if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') return;
        if (!executed && Date.now() - parseStartTime > PARSE_TIMEOUT_MS) {
            clearInterval(intervalId);
            if (refreshCount < MAX_REFRESH) {
                _videoRefreshCount.set(taskId, refreshCount + 1);
                logger(`${taskLabel}：${name} 解析超时（超过60秒未加载），正在刷新页面重试（第 ${refreshCount+1} 次）`, 'red');
                setTimeout(() => { location.reload(); }, 2000);
            } else {
                logger(`${taskLabel}：${name} 解析超时次数已达 ${MAX_REFRESH} 次，跳过该任务`, 'red');
                switchMission();
            }
            return;
        }
        var result = dom && dom.length > 0 ? searchIframesForMedia(dom) : null;
        if (!result) {
            try {
                var allIframes = _d.querySelectorAll('.ans-attach-ct iframe');
                if (allIframes.length > 0) result = searchIframesForMedia(allIframes);
            } catch (_) { }
        }
        if (!_parseDebugLogged) {
            _parseDebugLogged = true;
            var domSrcs = [];
            if (dom && dom.length > 0) { for (var di=0; di<dom.length; di++) domSrcs.push(dom[di].src || '(无src)'); }
            console.log('[NE21 Debug] dom iframes:', domSrcs, '| 找到媒体:', !!result);
        }
        if (result && !executed) {
            executed = true;
            clearInterval(intervalId);
            var media = result.media;
            var doc = result.doc;
            const userRate = getRate();
            const finalRate = userRate;
            if (mediaType === 'video' && isPlaybackRateDisabled(doc) && userRate > 1) {
                logger(`${name} 超星倍速菜单不可用，已改用脚本强制倍速：${userRate}×`, 'orange');
            } else if (userRate > 1) {
                logger(`已开启倍速：${userRate}×（高倍速可能被超星判定异常）`, 'orange');
            }
            logger(`${name} - ${mediaType} 播放成功，开始控制播放（${finalRate}×）`);
            const runPlayback = () => {
                return new Promise((resolve, reject) => {
                    const reloadInterval = setInterval(() => {
                        const errorDiv = doc.querySelector(".vjs-modal-dialog-content");
                        if (["视频文件损坏","网络错误导致视频下载中途失败","视频因格式不支持","网络的问题无法加载"].some(s => errorDiv && errorDiv.innerText.includes(s))) {
                            logger("检测到视频/音频加载失败，即将跳过。", "red");
                            clearInterval(reloadInterval);
                            if (quizIntervalId) clearInterval(quizIntervalId);
                            setTimeout(resolve, 3000);
                        }
                    }, 3000);
                    const quizIntervalId = mediaType === 'video' ? setInterval(function() { handleVideoQuiz(doc, media, name); }, 1500) : null;
                    const playFunction = async () => {
                        if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') return;
                        if (mediaType === 'video' && doc.querySelector('.ans-videoquiz')) return;
                        if (media.ended === false) {
                            await new Promise(r => setTimeout(r, 1000));
                            if (media.paused && media.ended === false) {
                                media.muted = true;
                                try {
                                    media.play().then(() => { hookMediaRate(media, finalRate); }).catch(async (e) => {
                                        console.log('[NE21] 后台恢复播放失败，尝试静音并重新播放:', e);
                                        media.muted = true;
                                        await playMedia(() => media.play());
                                        hookMediaRate(media, finalRate);
                                    });
                                } catch (err) { console.error(err); }
                            }
                        }
                    };
                    media.addEventListener("pause", playFunction);
                    let rateRestored = finalRate <= 1;
                    const onTimeUpdate = () => {
                        if (!rateRestored && isFinite(media.duration) && media.duration - media.currentTime < 10) {
                            rateRestored = true;
                            try { delete media.playbackRate; } catch(_) { }
                            hookMediaRate(media, 1);
                            media.removeEventListener('timeupdate', onTimeUpdate);
                        }
                    };
                    if (!rateRestored) media.addEventListener('timeupdate', onTimeUpdate);
                    media.addEventListener("ended", () => {
                        logger(`${name} - ${mediaType} 已播放完成`);
                        media.removeEventListener("pause", playFunction);
                        media.removeEventListener('timeupdate', onTimeUpdate);
                        if (quizIntervalId) clearInterval(quizIntervalId);
                        clearInterval(reloadInterval);
                        resolve();
                    });
                    media.muted = true;
                    media.currentTime = 0;
                    setTimeout(() => {
                        playMedia(() => media.play()).then(() => { hookMediaRate(media, finalRate); }).catch(reject);
                    }, 200);
                });
            };
            runPlayback().then(() => { setTimeout(switchMission, 1000); }).catch(err => {
                logger(`${name} - 播放异常: ${err}，即将切换下一任务`, 'red');
                setTimeout(switchMission, 1000);
            });
        }
    }, 2500);
}

// ===================== 全局 Promise 错误捕获 =====================
window.addEventListener('unhandledrejection', function(e) {
    logger('未捕获的 Promise 错误: ' + (e.reason && e.reason.message ? e.reason.message : e.reason), 'red');
});

// ===================== 以下为原脚本其余函数（保持不变） =====================
function parseUrlParams() {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let _p = {}
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        _p[pair[0]] = pair[1]
    }
    return _p
}

function updateLocalStorage(event) {
    var checkbox = event.target;
    localStorage.setItem(checkbox.id, checkbox.checked);
}

function isRedoMode() {
    var stored = localStorage.getItem('GPTJsSetting.redo');
    if (stored !== null) return stored === 'true';
    return !!setting.redo;
}

function isFuzzyMatchEnabled() {
    return true;
}

function stringSimilarity(s1, s2) {
    if (!s1 && !s2) return 1;
    if (!s1 || !s2) return 0;
    s1 = s1.toLowerCase().trim();
    s2 = s2.toLowerCase().trim();
    if (s1 === s2) return 1;
    var len1 = s1.length, len2 = s2.length;
    if (len1 === 0 || len2 === 0) return 0;
    var prev = [], curr = [];
    for (let j = 0; j <= len2; j++) prev[j] = j;
    for (let i = 1; i <= len1; i++) {
        curr[0] = i;
        for (let j = 1; j <= len2; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
            }
        }
        var tmp = prev; prev = curr; curr = tmp;
    }
    var maxLen = Math.max(len1, len2);
    return 1 - prev[len2] / maxLen;
}

function findBestFuzzyMatch(optionTexts, aiAnswer, threshold) {
    if (!isFuzzyMatchEnabled()) return -1;
    if (!aiAnswer || !optionTexts || optionTexts.length === 0) return -1;
    threshold = (threshold !== undefined) ? threshold : 0.5;
    var bestIndex = -1, bestScore = 0;
    for (var i = 0; i < optionTexts.length; i++) {
        var score = stringSimilarity(optionTexts[i], aiAnswer);
        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }
    if (bestScore >= threshold) {
        logger('相似度匹配: 最佳匹配项[' + bestIndex + '] 相似度=' + (bestScore * 100).toFixed(1) + '%', 'blue');
        return bestIndex;
    }
    logger('相似度匹配: 所有选项相似度均低于阈值(' + (threshold * 100) + '%)，最高=' + (bestScore * 100).toFixed(1) + '%', 'orange');
    return -1;
}

function findFuzzyMatchMultiple(optionTexts, aiAnswer, threshold) {
    if (!isFuzzyMatchEnabled()) return [];
    if (!aiAnswer || !optionTexts || optionTexts.length === 0) return [];
    threshold = (threshold !== undefined) ? threshold : 0.5;
    var parts = aiAnswer.split('|');
    var matched = [];
    for (var p = 0; p < parts.length; p++) {
        var part = parts[p].trim();
        if (!part) continue;
        var bestIndex = -1, bestScore = 0;
        for (var i = 0; i < optionTexts.length; i++) {
            var score = stringSimilarity(optionTexts[i], part);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }
        if (bestScore >= threshold && matched.indexOf(bestIndex) === -1) {
            matched.push(bestIndex);
            logger('相似度匹配(多选): "' + part + '" → 选项[' + bestIndex + '] 相似度=' + (bestScore * 100).toFixed(1) + '%', 'blue');
        }
    }
    return matched;
}

function normalizeChoiceText(text) {
    return String(text == null ? '' : text)
        .replace(/^[A-Z]\s*[\.、．:：)]?\s*/i, '')
        .replace(/\s+/g, '')
        .trim();
}

function getAnswerLetterIndexes(answer, optionCount) {
    var s = String(answer == null ? '' : answer).toUpperCase();
    var result = [];
    var letterPattern = /(?:^|[^A-Z])([A-Z])(?:$|[^A-Z])/g;
    var m;
    while ((m = letterPattern.exec(s)) !== null) {
        var idx = m[1].charCodeAt(0) - 65;
        if (idx >= 0 && idx < optionCount && result.indexOf(idx) === -1) result.push(idx);
    }
    if (result.length === 0 && /^[A-Z]+$/.test(s.trim())) {
        for (var i = 0; i < s.trim().length; i++) {
            var charIdx = s.trim().charCodeAt(i) - 65;
            if (charIdx >= 0 && charIdx < optionCount && result.indexOf(charIdx) === -1) result.push(charIdx);
        }
    }
    return result;
}

function splitAiAnswers(answer) {
    return String(answer == null ? '' : answer)
        .split(/[|#;；、,，\n]+/)
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
}

function findVideoQuizMatchIndexes(optionTexts, aiAnswer, isMultiple) {
    var result = getAnswerLetterIndexes(aiAnswer, optionTexts.length);
    if (result.length > 0) return isMultiple ? result : [result[0]];
    var normalizedOptions = optionTexts.map(normalizeChoiceText);
    var parts = splitAiAnswers(aiAnswer);
    if (parts.length === 0 && aiAnswer) parts = [String(aiAnswer).trim()];
    for (var p = 0; p < parts.length; p++) {
        var normalizedAnswer = normalizeChoiceText(parts[p]);
        if (!normalizedAnswer) continue;
        for (var i = 0; i < normalizedOptions.length; i++) {
            if (result.indexOf(i) !== -1) continue;
            if (normalizedOptions[i] === normalizedAnswer ||
                normalizedOptions[i].indexOf(normalizedAnswer) !== -1 ||
                normalizedAnswer.indexOf(normalizedOptions[i]) !== -1) {
                result.push(i);
                break;
            }
        }
    }
    if (result.length === 0) {
        result = isMultiple ? findFuzzyMatchMultiple(normalizedOptions, aiAnswer, 0.45) : [findBestFuzzyMatch(normalizedOptions, aiAnswer, 0.45)];
        result = result.filter(function (idx) { return idx >= 0; });
    }
    return isMultiple ? result : result.slice(0, 1);
}

function getVideoQuizText(container, optionNodes) {
    var clone = container.cloneNode(true);
    try {
        Array.prototype.forEach.call(clone.querySelectorAll('.ans-videoquiz-opt, #videoquiz-submit, button, input, label'), function (node) {
            if (node.parentNode) node.parentNode.removeChild(node);
        });
    } catch (_) { }
    var text = (clone.innerText || clone.textContent || '').trim();
    if (!text) {
        var title = container.querySelector('.ans-videoquiz-title, .ans-videoquiz-subject, .ans-videoquiz-question, .videoquiz-title, .videoquiz-question');
        text = title ? (title.innerText || title.textContent || '').trim() : '';
    }
    optionNodes.forEach(function (label) {
        var optText = (label.innerText || label.textContent || '').trim();
        if (optText) text = text.replace(optText, '');
    });
    return text.replace(/\s+/g, ' ').trim();
}

function getRate() {
    var stored = localStorage.getItem('GPTJsSetting.rate');
    var n = stored !== null ? parseFloat(stored) : (setting.rate || 1);
    if (!isFinite(n) || n <= 0) n = 1;
    if (n > 16) n = 16;
    return n;
}

function parseJudgeAnswer(agrs) {
    if (!agrs) return null;
    var s = agrs.replace(/[。，.,!！\s]/g, '').toLowerCase();
    var trueWords = ['正确', '是', '对', '√', 't', 'true', 'ri', 'right', 'yes'];
    var falseWords = ['错误', '否', '错', '×', 'f', 'false', 'wr', 'wrong', 'no'];
    for (let i = 0; i < trueWords.length; i++) {
        if (s === trueWords[i]) return 'true';
    }
    for (let i = 0; i < falseWords.length; i++) {
        if (s === falseWords[i]) return 'false';
    }
    for (let i = 0; i < falseWords.length; i++) {
        if (s.indexOf(falseWords[i]) !== -1) return 'false';
    }
    for (let i = 0; i < trueWords.length; i++) {
        if (s.indexOf(trueWords[i]) !== -1) return 'true';
    }
    return null;
}

function findJudgeOptionIndex(optionTexts, isTrue) {
    var trueWords = ['正确', '是', '对', '√', 'T', 'ri'];
    var falseWords = ['错误', '否', '错', '×', 'F', 'wr'];
    var words = isTrue ? trueWords : falseWords;
    for (var i = 0; i < optionTexts.length; i++) {
        var t = optionTexts[i];
        for (var j = 0; j < words.length; j++) {
            if (t.indexOf(words[j]) !== -1) return i;
        }
    }
    return -1;
}

function findAnswerTextareas($container) {
    if (!$container || $container.length === 0) return $();
    var $eles = $container.find('textarea[name^="answerEditor"]');
    if ($eles.length > 0) return $eles;
    $eles = $container.find('.subEditor textarea, .Answer .divText textarea, .stem_answer textarea, .edui-editor textarea');
    if ($eles.length > 0) return $eles;
    return $container.find('textarea');
}

// ===================== UI 浮窗（含 DeepSeek API 设置） =====================
function showBox() {
    if (setting.showBox && top.document.querySelector('#ne-21notice') == undefined) {
        if (!top.document.getElementById('ne-21style')) {
            var styleEl = top.document.createElement('style');
            styleEl.id = 'ne-21style';
            styleEl.textContent = `
            /* === Liquid Glass UI 样式 === */
            #ne-21box{position:fixed;top:5%;right:16%;width:340px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;font-size:13px;color:rgba(15,23,42,.86);background:linear-gradient(180deg,rgba(255,255,255,.62) 0%,rgba(241,245,249,.55) 100%);backdrop-filter:blur(22px) saturate(180%) brightness(1.04);-webkit-backdrop-filter:blur(22px) saturate(180%) brightness(1.04);border:1px solid rgba(255,255,255,.65);border-radius:22px;box-shadow:0 0 0 1px rgba(15,23,42,.09),0 24px 48px -12px rgba(15,23,42,.45),0 10px 26px -8px rgba(15,23,42,.3),inset 0 1px 0 rgba(255,255,255,.9),inset 0 -1px 0 rgba(15,23,42,.06);overflow:hidden;transition:opacity .25s ease,transform .25s ease;animation:ne21-in .4s cubic-bezier(.2,.9,.3,1) both;}
            @keyframes ne21-in{from{opacity:0;transform:translateY(-8px) scale(.98)}to{opacity:1;transform:none}}
            #ne-21box .ne21-header{position:relative;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(180deg,rgba(255,255,255,.72) 0%,rgba(248,250,252,.35) 100%);color:rgba(15,23,42,.92);border-bottom:1px solid rgba(15,23,42,.07);cursor:move;user-select:none;}
            #ne-21box .ne21-header::after{content:'';position:absolute;left:14px;right:14px;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);pointer-events:none;}
            #ne-21box.ne21-collapsed .ne21-body{display:none;}
            #ne-21box.ne21-collapsed .ne21-header{border-bottom:none;}
            #ne-21box.ne21-collapsed .ne21-header::after{display:none;}
            #ne-21box .ne21-title{display:flex;align-items:center;gap:9px;font-weight:600;font-size:14px;letter-spacing:.3px;margin:0;color:inherit;}
            #ne-21box .ne21-dot{width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.98),rgba(255,255,255,.5) 55%,rgba(15,23,42,.18) 100%);box-shadow:0 0 0 0 rgba(255,255,255,.7),inset 0 1px 1px rgba(255,255,255,.95);animation:ne21-pulse 2s infinite;flex-shrink:0;}
            @keyframes ne21-pulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.7),inset 0 1px 1px rgba(255,255,255,.95)}70%{box-shadow:0 0 0 8px rgba(255,255,255,0),inset 0 1px 1px rgba(255,255,255,.95)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0),inset 0 1px 1px rgba(255,255,255,.95)}}
            #ne-21box #ne-21close, #ne-21box #ne-21pause{margin:0;width:24px;height:24px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:0;line-height:1;color:rgba(15,23,42,.7);cursor:pointer;border:1px solid rgba(255,255,255,.65);border-radius:50%;background:rgba(255,255,255,.55);box-shadow:0 0 0 1px rgba(15,23,42,.06),inset 0 1px 0 rgba(255,255,255,.8),0 1px 2px rgba(15,23,42,.08);transition:background .2s,color .2s,transform .15s;user-select:none;}
            #ne-21box #ne-21close:hover, #ne-21box #ne-21pause:hover{background:rgba(255,255,255,.78);color:rgba(15,23,42,.92);box-shadow:0 0 0 1px rgba(15,23,42,.08),inset 0 1px 0 rgba(255,255,255,.9),0 1px 2px rgba(15,23,42,.1);}
            #ne-21box #ne-21close:active, #ne-21box #ne-21pause:active{transform:scale(.92);}
            #ne-21box .ne21-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
            #ne-21box .ne21-kbd{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;font-size:10.5px;font-weight:500;letter-spacing:.2px;color:rgba(15,23,42,.66);background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.72);border-radius:8px;box-shadow:0 0 0 1px rgba(15,23,42,.06),inset 0 1px 0 rgba(255,255,255,.85),0 1px 2px rgba(15,23,42,.06);user-select:none;cursor:default;font-family:"SF Mono","Cascadia Code",Consolas,Menlo,monospace;line-height:1;white-space:nowrap;}
            #ne-21box .ne21-kbd b{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;font-weight:600;color:rgba(15,23,42,.78);}
            #ne-21box .ne21-body{padding:14px 16px 16px;}
            #ne-21box #ne-21notice{border-top:none!important;margin:0 0 6px!important;overflow:visible;}
            #ne-21box .ne21-uid{display:flex;align-items:center;gap:6px;color:rgba(15,23,42,.62);font-size:12px;margin-bottom:10px;padding:8px 12px;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.7);border-radius:12px;box-shadow:0 0 0 1px rgba(15,23,42,.05),inset 0 1px 0 rgba(255,255,255,.75),0 1px 2px rgba(15,23,42,.05);}
            #ne-21box .ne21-uid b{color:rgba(15,23,42,.92);font-weight:600;}
            #ne-21box .ne21-row{display:flex;gap:8px;align-items:center;}
            #ne-21box .ne21-btn{display:inline-flex;align-items:center;justify-content:center;padding:7px 14px;font-size:12px;font-weight:500;border-radius:14px;cursor:pointer;border:1px solid rgba(255,255,255,.7);transition:transform .15s,box-shadow .2s,background .2s,color .2s;white-space:nowrap;}
            #ne-21box .ne21-btn-primary{color:rgba(15,23,42,.92);background:rgba(255,255,255,.72);box-shadow:0 0 0 1px rgba(15,23,42,.07),inset 0 1px 0 rgba(255,255,255,.95),inset 0 -6px 12px -6px rgba(15,23,42,.08),0 4px 10px -2px rgba(15,23,42,.22);}
            #ne-21box .ne21-btn-primary:hover{transform:translateY(-1px);background:rgba(255,255,255,.88);box-shadow:0 0 0 1px rgba(15,23,42,.09),inset 0 1px 0 rgba(255,255,255,1),inset 0 -6px 12px -6px rgba(15,23,42,.1),0 6px 14px -2px rgba(15,23,42,.28);}
            #ne-21box .ne21-btn-secondary{color:rgba(15,23,42,.78);background:rgba(255,255,255,.45);box-shadow:0 0 0 1px rgba(15,23,42,.06),inset 0 1px 0 rgba(255,255,255,.75),0 1px 2px rgba(15,23,42,.06);}
            #ne-21box .ne21-btn-secondary:hover{background:rgba(255,255,255,.65);color:rgba(15,23,42,.92);box-shadow:0 0 0 1px rgba(15,23,42,.08),inset 0 1px 0 rgba(255,255,255,.85),0 2px 4px rgba(15,23,42,.08);}
            #ne-21box .ne21-btn:active{transform:translateY(0) scale(.98);}
            #ne-21box .ne21-select{padding:5px 8px;font-size:12px;border-radius:10px;border:1px solid rgba(255,255,255,.65);background:rgba(255,255,255,.5);color:rgba(15,23,42,.86);cursor:pointer;outline:none;min-width:80px;flex-shrink:0;box-shadow:0 0 0 1px rgba(15,23,42,.05),inset 0 1px 0 rgba(255,255,255,.75);transition:background .2s,box-shadow .2s;}
            #ne-21box .ne21-select:hover{background:rgba(255,255,255,.7);}
            #ne-21box .ne21-select:focus{background:rgba(255,255,255,.72);box-shadow:0 0 0 1px rgba(15,23,42,.08),inset 0 1px 0 rgba(255,255,255,.82),0 0 0 3px rgba(15,23,42,.06);}
            #ne-21box #userInfo{margin:10px 0 0;padding:10px 12px;background:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.7);border-radius:12px;box-shadow:0 0 0 1px rgba(15,23,42,.05),inset 0 1px 0 rgba(255,255,255,.75);font-size:12px;color:rgba(15,23,42,.66);line-height:1.6;overflow:hidden;}
            #ne-21box #userInfo:empty{display:none;}
            #ne-21box #userInfo b{color:rgba(15,23,42,.9);font-weight:600;}
            #ne-21box #moreSettings{padding:4px 14px;background:rgba(255,255,255,.42);border:1px solid rgba(255,255,255,.65);border-radius:14px;box-shadow:0 0 0 1px rgba(15,23,42,.05),inset 0 1px 0 rgba(255,255,255,.7);margin:10px 0 0;}
            #ne-21box #moreSettings label{display:flex;flex-direction:row-reverse;align-items:center;justify-content:space-between;margin:0;padding:8px 2px;font-size:12px;color:rgba(15,23,42,.78);cursor:pointer;user-select:none;line-height:1.4;}
            #ne-21box #moreSettings label + label{border-top:1px dashed rgba(15,23,42,.1);}
            #ne-21box #moreSettings input[type=checkbox]{appearance:none;-webkit-appearance:none;width:34px;height:20px;border:1px solid rgba(15,23,42,.08);border-radius:20px;cursor:pointer;position:relative;transition:background .25s,box-shadow .25s;background:rgba(15,23,42,.16);box-shadow:inset 0 1px 2px rgba(15,23,42,.12);margin:0 0 0 10px;flex-shrink:0;}
            #ne-21box #moreSettings input[type=checkbox]::before{content:'';position:absolute;top:1px;left:1px;width:16px;height:16px;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,.85));box-shadow:0 1px 3px rgba(15,23,42,.25),inset 0 1px 0 rgba(255,255,255,1);transition:transform .25s cubic-bezier(.2,.9,.3,1);}
            #ne-21box #moreSettings input[type=checkbox]:hover{background:rgba(15,23,42,.24);}
            #ne-21box #moreSettings input[type=checkbox]:checked{background:rgba(255,255,255,.78);border-color:rgba(15,23,42,.1);box-shadow:inset 0 1px 0 rgba(255,255,255,.95),inset 0 -2px 4px rgba(15,23,42,.08),0 0 0 1px rgba(15,23,42,.06);}
            #ne-21box #moreSettings input[type=checkbox]:checked:hover{background:rgba(255,255,255,.92);}
            #ne-21box #moreSettings input[type=checkbox]:checked::before{transform:translateX(14px);}
            #ne-21box #ne-21thinking{display:none!important;}
            @keyframes ne21-spin{to{transform:rotate(360deg)}}
            @keyframes ne21-dot{0%,80%,100%{transform:scale(.5);opacity:.4}40%{transform:scale(1);opacity:1}}
            #ne-21box #ne-21log .ne21-log-spinner{display:inline-block;width:9px;height:9px;margin-right:5px;border:1.5px solid rgba(15,23,42,.18);border-top-color:rgba(15,23,42,.7);border-radius:50%;vertical-align:-1px;animation:ne21-spin .8s linear infinite;}
            #ne-21box #ne-21log .ne21-log-dots{display:inline-flex;gap:2px;margin-left:3px;vertical-align:1px;}
            #ne-21box #ne-21log .ne21-log-dots i{width:3px;height:3px;border-radius:50%;background:currentColor;opacity:.65;animation:ne21-dot 1.2s infinite ease-in-out both;}
            #ne-21box #ne-21log .ne21-log-dots i:nth-child(2){animation-delay:.16s;}
            #ne-21box #ne-21log .ne21-log-dots i:nth-child(3){animation-delay:.32s;}
            #ne-21box #ne-21log{max-height:140px;overflow-y:auto;margin:12px 0 0;padding:10px 12px;background:rgba(15,23,42,.06);border:1px solid rgba(255,255,255,.55);border-radius:14px;box-shadow:0 0 0 1px rgba(15,23,42,.06),inset 0 1px 0 rgba(255,255,255,.6),inset 0 0 16px rgba(15,23,42,.06);font-family:"SF Mono","Cascadia Code",Consolas,Menlo,monospace;font-size:11px;line-height:1.6;color:rgba(15,23,42,.78);}
            #ne-21box #ne-21log:empty{display:none;}
            #ne-21box #ne-21log::-webkit-scrollbar{width:5px;}
            #ne-21box #ne-21log::-webkit-scrollbar-thumb{background:rgba(15,23,42,.2);border-radius:4px;}
            #ne-21box #ne-21log::-webkit-scrollbar-thumb:hover{background:rgba(15,23,42,.32);}
            #ne-21box #ne-21log p{margin:0;padding:2px 0;word-break:break-all;}
            #ne-21box #ne-21log hr{display:none;}
            #ne-21box #ne-21log .ne21-time{color:rgba(15,23,42,.4);margin-right:6px;}
            `;
            top.document.head.appendChild(styleEl);
        }
        var box_html = `
            <div id="ne-21box">
                <div class="ne21-header" title="按住标题栏可拖动 / 按 F9 显示或隐藏面板 / 点击右侧按钮收起">
                    <h3 class="ne21-title"><span class="ne21-dot"></span>DeepSeek 学习通助手</h3>
                    <div class="ne21-actions">
                        <span class="ne21-kbd" title="按 F9 可显示/隐藏整个面板">F9 <b>显隐</b></span>
                        <button id="ne-21pause" type="button" aria-label="暂停/继续" style="margin-right:4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg></button>
                        <button id="ne-21close" type="button" aria-label="收起"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
                    </div>
                </div>
                <div class="ne21-body">
                    <div id="ne-21notice"></div>
                    <div id="userInfo"></div>
                    <div id="moreSettings" style="display:none;">
                        <label title="倍速过高可能导致异常"><select id="GPTJsSetting.rate" class="ne21-select"><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option><option value="3">3×</option><option value="4">4×</option><option value="6">6×</option><option value="8">8×</option><option value="16">16×</option></select>视频/音频倍速</label>
                        <label title="题目作答间隔与 AI 搜题节流间隔（秒），默认 2.5 秒">
                            <input type="number" id="GPTJsSetting.time" class="ne21-select" min="0" max="60" step="0.5" style="min-width:56px;width:56px;padding:5px 8px;">答题间隔 (秒)
                        </label>
                        <p></p>
                        <label><input type="checkbox" id="GPTJsSetting.sub">测验自动提交</label>
                        <label><input type="checkbox" id="GPTJsSetting.force">测验强制提交</label>
                        <label><input type="checkbox" id="GPTJsSetting.examTurn">考试自动跳转</label>
                        <p></p>
                        <label><input type="checkbox" id="GPTJsSetting.goodStudent">答案加粗不选择</label>
                        <label><input type="checkbox" id="GPTJsSetting.alterTitle" checked>答案插入题目后</label>
                        <p></p>
                        <label><input type="checkbox" id="GPTJsSetting.redo">重做模式 (不跳过已答题)</label>
                        <hr style="margin:8px 0; border-top:1px solid rgba(15,23,42,.12);">
                        <label style="flex-direction:column; align-items:stretch; gap:8px;">
                            <span>DeepSeek API Key：</span>
                            <input type="password" id="deepseekApiKeyInput" placeholder="sk-..." style="width:100%; padding:6px 8px; border-radius:12px; border:1px solid rgba(0,0,0,0.1); background:rgba(255,255,255,0.7); font-size:12px;">
                        </label>
                        <label style="flex-direction:row; justify-content:space-between;">
                            <span>模型：</span>
                            <select id="deepseekModelSelect" class="ne21-select" style="width:auto;">
                                <option value="deepseek-chat">deepseek-chat</option>
                                <option value="deepseek-reasoner">deepseek-reasoner</option>
                            </select>
                        </label>
                        <button id="saveDeepSeekBtn" class="ne21-btn ne21-btn-secondary" style="margin-top:8px; width:100%;">保存 API 设置</button>
                    </div>
                    <div id="ne-21thinking">
                        <div class="ne21-thinking-spinner"></div>
                        <span class="ne21-thinking-text">AI 思考中<span class="ne21-thinking-dots"><i></i><i></i><i></i></span></span>
                    </div>
                    <div id="ne-21log"></div>
                </div>
            </div>
        `;
        $(box_html).appendTo('body');
        (function () {
            var $box = $('#ne-21box');
            try {
                var savedPos = localStorage.getItem('GPTJsSetting.boxPosition');
                if (savedPos) {
                    var pos = JSON.parse(savedPos);
                    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
                        var vw = window.innerWidth, vh = window.innerHeight;
                        var w = $box.outerWidth() || 340;
                        var nx = Math.max(40 - w, Math.min(pos.left, vw - 40));
                        var ny = Math.max(0, Math.min(pos.top, vh - 40));
                        $box.css({ left: nx + 'px', top: ny + 'px', right: 'auto' });
                    }
                }
            } catch (_) { }
            if (localStorage.getItem('GPTJsSetting.boxCollapsed') === 'true') {
                $box.addClass('ne21-collapsed');
                $('#ne-21close').html('<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>').attr('aria-label', '展开');
            }
            if (localStorage.getItem('GPTJsSetting.showBox') === 'hide') {
                $box.css('display', 'none');
            }
        })();
        $('#ne-21box').on('mousedown', '#ne-21pause', function (e) {
            e.stopPropagation();
        }).on('click', '#ne-21pause', function (e) {
            e.stopPropagation();
            var isPaused = localStorage.getItem('GPTJsSetting.isPaused') === 'true';
            isPaused = !isPaused;
            localStorage.setItem('GPTJsSetting.isPaused', isPaused);
            $(this).html(isPaused ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-left:1px"><path d="M7 4v16l13-8z"/></svg>' : '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>');
            $(this).attr('title', isPaused ? '已暂停，点击继续' : '运行中，点击暂停');
            if (isPaused) {
                try { logger('脚本已暂停运行', 'orange'); } catch (_) { }
            } else {
                try { logger('脚本已恢复运行', 'green'); } catch (_) { }
            }
        });
        (function () {
            var isPaused = localStorage.getItem('GPTJsSetting.isPaused') === 'true';
            var $pauseBtn = $('#ne-21pause');
            $pauseBtn.html(isPaused ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-left:1px"><path d="M7 4v16l13-8z"/></svg>' : '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>');
            $pauseBtn.attr('title', isPaused ? '已暂停，点击继续' : '运行中，点击暂停');
        })();
        $('#ne-21close').on('mousedown', function (e) {
            e.stopPropagation();
        }).on('click', function (e) {
            e.stopPropagation();
            var collapsed = $('#ne-21box').toggleClass('ne21-collapsed').hasClass('ne21-collapsed');
            $(this).html(collapsed ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14"/></svg>');
            $(this).attr('aria-label', collapsed ? '展开' : '收起');
            try { localStorage.setItem('GPTJsSetting.boxCollapsed', collapsed ? 'true' : 'false'); } catch (_) { }
        });
        (function () {
            var $box = $('#ne-21box');
            var $header = $box.find('.ne21-header');
            var dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
            $header.on('mousedown', function (e) {
                if (e.which !== 1) return;
                if ($(e.target).closest('#ne-21close').length) return;
                dragging = true;
                var rect = $box[0].getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                $box.css({ left: startLeft + 'px', top: startTop + 'px', right: 'auto' });
                $('body').css('user-select', 'none');
                e.preventDefault();
            });
            $(document).on('mousemove.ne21drag', function (e) {
                if (!dragging) return;
                var nx = startLeft + (e.clientX - startX);
                var ny = startTop + (e.clientY - startY);
                var w = $box.outerWidth();
                var vw = window.innerWidth;
                var vh = window.innerHeight;
                nx = Math.max(40 - w, Math.min(nx, vw - 40));
                ny = Math.max(0, Math.min(ny, vh - 40));
                $box.css({ left: nx + 'px', top: ny + 'px' });
            }).on('mouseup.ne21drag', function () {
                if (!dragging) return;
                dragging = false;
                $('body').css('user-select', '');
                try {
                    var rect = $box[0].getBoundingClientRect();
                    localStorage.setItem('GPTJsSetting.boxPosition', JSON.stringify({ left: rect.left, top: rect.top }));
                } catch (_) { }
            });
        })();
        (function () {
            var moreSettings = document.getElementById('moreSettings');
            var userInfo = document.getElementById('userInfo');
            if (!moreSettings || !userInfo) return;
            var isSettingsVisible = false;
            $('#ne-21box').on('click', '#moreSettingsBtn', function () {
                userInfo.style.display = isSettingsVisible ? 'block' : 'none';
                moreSettings.style.display = isSettingsVisible ? 'none' : 'block';
                this.textContent = isSettingsVisible ? '设置' : '返回';
                isSettingsVisible = !isSettingsVisible;
            });
            if (localStorage.getItem('GPTJsSetting.alterTitle') === null) {
                localStorage.setItem('GPTJsSetting.alterTitle', 'true');
            }
            if (localStorage.getItem('GPTJsSetting.fuzzyMatch') === null) {
                localStorage.setItem('GPTJsSetting.fuzzyMatch', 'true');
            }
            if (localStorage.getItem('GPTJsSetting.sub') === null) {
                localStorage.setItem('GPTJsSetting.sub', 'true');
            }
            ['sub', 'force', 'examTurn', 'goodStudent', 'alterTitle', 'redo', 'fuzzyMatch'].forEach(function (settingId) {
                var checkbox = document.getElementById('GPTJsSetting.' + settingId);
                if (!checkbox) return;
                checkbox.addEventListener('change', updateLocalStorage);
                checkbox.checked = localStorage.getItem('GPTJsSetting.' + settingId) === 'true';
            });
            var rateSelect = document.getElementById('GPTJsSetting.rate');
            if (rateSelect) {
                rateSelect.value = localStorage.getItem('GPTJsSetting.rate') || '1';
                rateSelect.addEventListener('change', function () {
                    localStorage.setItem('GPTJsSetting.rate', rateSelect.value);
                });
            }
            var timeInput = document.getElementById('GPTJsSetting.time');
            if (timeInput) {
                var savedTime = localStorage.getItem('GPTJsSetting.time');
                timeInput.value = (savedTime !== null && isFinite(parseFloat(savedTime))) ? savedTime : String((setting.time || 2500) / 1000);
                timeInput.addEventListener('change', function () {
                    var v = parseFloat(timeInput.value);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    timeInput.value = String(v);
                    localStorage.setItem('GPTJsSetting.time', String(v));
                    setting.time = v * 1000;
                });
            }
            // DeepSeek API 设置
            var apiKeyInput = document.getElementById('deepseekApiKeyInput');
            var modelSelect = document.getElementById('deepseekModelSelect');
            var saveBtn = document.getElementById('saveDeepSeekBtn');
            if (apiKeyInput && modelSelect && saveBtn) {
                var storedKey = GM_getValue('deepseekApiKey', '');
                var storedModel = GM_getValue('deepseekModel', 'deepseek-chat');
                apiKeyInput.value = storedKey;
                modelSelect.value = storedModel;
                saveBtn.addEventListener('click', function () {
                    var newKey = apiKeyInput.value.trim();
                    var newModel = modelSelect.value;
                    GM_setValue('deepseekApiKey', newKey);
                    GM_setValue('deepseekModel', newModel);
                    logger('DeepSeek API 设置已保存（密钥已安全存储）', 'green');
                });
            }
        })();
    } else {
        $('#ne-21log', window.parent.document).html('')
    }
    let _u = getCk('_uid') || getCk('UID')
    $('#ne-21notice').html(`
        <div class="ne21-uid">学习通账号 UID：<b>${_u || '-'}</b></div>
        <div class="ne21-row">
            <button class="ne21-btn ne21-btn-secondary" id="moreSettingsBtn">设置</button>
        </div>
    `);
}

function getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}

function getTaskParams() {
    try {
        var _iframeScripts = _d.scripts,
            _p = null;
        for (let i = 0; i < _iframeScripts.length; i++) {
            if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf('==UserScript==') == -1) {
                _p = getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), 'try{mArg=', ';}catch');
                return _p
            }
        }
        return _p
    } catch (e) {
        return null
    }
}

function getCk(name) {
    return document.cookie.match(`[;\\s+]?${name}=([^;]*)`)?.pop();
}

function autoLogin() {
    logger('用户已设置自动登录', 'green')
    if (setting.phone.length <= 0 || setting.password.length <= 0) {
        logger('用户未设置登录信息', 'red')
        return
    }
    setTimeout(() => {
        $('#phone').val(setting.phone)
        $('#pwd').val(setting.password)
        $('#loginBtn').click()
    }, 3000)
}

function toNext() {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(toNext, 3000);
        return;
    }
    refreshCourseList().then((res) => {
        function detectSubTabPosition() {
            try {
                var selectors = ['#prev_tab > li', '.prev_ul > li', '#prevTabBox > li'];
                for (var i = 0; i < selectors.length; i++) {
                    var nodes = top.document.querySelectorAll(selectors[i]);
                    if (!nodes || nodes.length === 0) continue;
                    var tabs = Array.prototype.slice.call(nodes);
                    var activeIdx = -1;
                    for (var j = 0; j < tabs.length; j++) {
                        if (tabs[j].classList && tabs[j].classList.contains('active')) {
                            activeIdx = j;
                            break;
                        }
                    }
                    if (activeIdx === -1) continue;
                    return {
                        activeIndex: activeIdx,
                        total: tabs.length,
                        hasNext: activeIdx < tabs.length - 1,
                        tabs: tabs
                    };
                }
                var currents = top.document.querySelector('span.currents');
                if (currents) {
                    var nextSibs = [];
                    var sib = currents.nextElementSibling;
                    while (sib) {
                        if (sib.tagName === 'SPAN') nextSibs.push(sib);
                        sib = sib.nextElementSibling;
                    }
                    if (nextSibs.length > 0) {
                        return { activeIndex: 0, total: nextSibs.length + 1, hasNext: true, tabs: null };
                    }
                }
            } catch (e) { }
            return null;
        }
        function clickNextPageBtn() {
            $('#ne-21log', window.parent.document).html('')
            try { top._gptJsJumpAllowed = true; } catch (_) { }
            var nextBtn = top.document.querySelector('#mainid > .prev_next.next')
            if (nextBtn) { nextBtn.click(); return true }
            return false
        }
        function clickNextChapterBtn() {
            $('#ne-21log', window.parent.document).html('')
            try { top._gptJsJumpAllowed = true; } catch (_) { }
            var nextBtn = top.document.querySelector('#mainid > .prev_next.next')
            if (nextBtn) { nextBtn.click(); return true }
            var focusBtn = top.document.querySelector('#prevNextFocusNext')
            if (focusBtn) { focusBtn.click(); return true }
            return false
        }
        var sub = detectSubTabPosition()
        if (sub && sub.hasNext) {
            logger('当前课时存在未完成页面（' + (sub.activeIndex + 1) + '/' + sub.total + '），准备切换到下一页', 'blue')
            setTimeout(() => {
                if (!clickNextPageBtn()) {
                    logger('未找到本课时下一页按钮，回退到下一章节跳转', 'orange')
                    clickNextChapterBtn()
                }
            }, 2000)
            return
        }
        if (setting.review || !setting.work) {
            logger('本课时已无未完成页面，准备切换到下一章节', 'blue')
            setTimeout(() => { clickNextChapterBtn() }, 2000)
            return
        }
        let _t = []
        $.each($(res).find('li'), (_, t) => {
            let curid = $(t).find('.posCatalog_select').attr('id'),
                status = $(t).find('.prevHoverTips').text(),
                name = $(t).find('.posCatalog_name').attr('title');
            if (curid.indexOf('cur') != -1) {
                _t.push({ 'curid': curid, 'status': status, 'name': name })
            }
        })
        let _curChaterId = $('#coursetree', window.parent.document).find('.posCatalog_active').attr('id')
        let _curIndex = _t.findIndex((item) => item['curid'] == _curChaterId)
        for (_curIndex; _curIndex < _t.length - 1; _curIndex++) {
            if (_t[_curIndex]['status'].indexOf('待完成') != -1) {
                var subAgain = detectSubTabPosition()
                if (subAgain && subAgain.hasNext) {
                    logger('兜底检测到本课时仍有未完成页面（' + (subAgain.activeIndex + 1) + '/' + subAgain.total + '），切换到下一页', 'blue')
                    setTimeout(() => {
                        if (!clickNextPageBtn()) clickNextChapterBtn()
                    }, 2000)
                    return
                }
            }
            let t = _t[_curIndex + 1]
            if (t['status'].indexOf('待完成') != -1) {
                setTimeout(() => {
                    clickNextChapterBtn()
                    showBox()
                }, 2000)
                return
            } else if (t['status'].indexOf('闯关') != -1) {
                logger('当前为闯关模式，存在未完成任务点，脚本已暂停运行，请手动完成并点击下一章节', 'red')
                return
            } else if (t['status'].indexOf('开放') != -1) {
                logger('章节未开放', 'red')
                return
            } else {
                //  console.log(t)
            }
        }
        logger('此课程处理完毕', 'green')
        return
    })
}

function missonStart() {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(missonStart, 3000);
        return;
    }
    if (_mlist.length <= 0) {
        logger('此页面任务处理完毕，准备跳转页面', 'green')
        return toNext()
    }
    let _type = _mlist[0]['type'],
        _dom = _domList[0],
        _task = _mlist[0];
    if (_type == undefined) {
        _type = _mlist[0]['property']["module"]
    }
    switch (_type) {
        case "video":
            if (_mlist[0]['property']['module'] == 'insertvideo') {
                logger('开始处理视频', 'purple')
                missonVideo(_dom, _task)
                break
            } else if (_mlist[0]['property']['module'] == 'insertaudio') {
                logger('开始处理音频', 'purple')
                missonVideo(_dom, _task)
                break
            } else {
                logger('未知类型任务，请联系作者，跳过', 'red')
                switchMission()
                break
            }
        case "workid":
            logger('开始处理测验', 'purple')
            missonWork(_dom, _task)
            break
        case "document":
            logger('开始处理文档', 'purple')
            missonDoucument(_dom, _task)
            break
        case "read":
            logger('开始处理阅读', 'purple')
            missonRead(_dom, _task)
            break
        case "insertbook":
            logger('开始处理读书', 'purple')
            missonBook(_dom, _task)
            break
        default: {
            let GarbageTasks = ['insertimage', 'insertanswerquestion', 'insertshare', 'insertquestion', 'insertdiscuss', 'insertsubject']
            if (GarbageTasks.indexOf(_type) != -1) {
                logger('发现无需处理任务（' + _type + '），跳过。', 'red')
                switchMission()
            } else {
                logger('暂不支持处理此类型:' + _type + '，跳过。', 'red')
                switchMission()
            }
        }
    }
}

async function playMedia(playFunction) {
    const tryPlayMedia = () => {
        return new Promise((resolve, reject) => {
            try {
                const playRes = playFunction();
                if (playRes) {
                    playRes.then(resolve).catch(reject);
                } else {
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    try {
        await tryPlayMedia();
        return true;
    } catch (err) {
        console.error(err);
        if (String(err).includes("failed because the user didn't interact with the document first")) {
            return new Promise((resolve) => {
                const content = "播放音视频失败，由于浏览器的用户隐私保护措施，如果要播放带有音量的视频，或者某些无法自动播放音视频的网站，您必须先点击一次页面上的任意位置脚本才能进行音视频的播放，后续无需重新点击。";
                if (typeof Swal !== 'undefined' && Swal.fire) {
                    Swal.fire({
                        title: "提示",
                        text: content,
                        icon: "warning",
                        confirmButtonText: "确定"
                    }).then(async () => {
                        try {
                            await tryPlayMedia();
                            resolve(true);
                        } catch (e) {
                            console.error(e);
                            resolve(false);
                        }
                    });
                } else {
                    alert(content);
                    tryPlayMedia().then(() => resolve(true)).catch(() => resolve(false));
                }
            });
        } else if (String(err).includes("The element has no supported sources")) {
            logger("当前视频无法播放。", "red");
        } else if (String(err).includes("background media was paused to save power") || String(err).includes("interrupted because video-only") || String(err).includes("interrupted by a call to pause")) {
            console.log("[NE21] 忽略浏览器播放中断:", err);
        } else {
            logger("播放视频时发生未知错误：" + String(err), "red");
        }
        return false;
    }
}

function hookMediaRate(media, rate) {
    try { media.playbackRate = rate; } catch (_) { }
    try {
        Object.defineProperty(media, 'playbackRate', {
            configurable: true,
            get: function () { return rate; },
            set: function () { }
        });
    } catch (_) {
        try {
            media.addEventListener('ratechange', function () {
                if (media.playbackRate !== rate) {
                    try { media.playbackRate = rate; } catch (__) { }
                }
            });
        } catch (___) { }
    }
}

function isPlaybackRateDisabled(iframeDocument) {
    try {
        var items = iframeDocument.querySelectorAll('.vjs-playback-rate .vjs-menu-content .vjs-menu-item');
        return items.length === 0;
    } catch (_) {
        return false;
    }
}

function missonBook(dom, obj) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { missonBook(dom, obj) }, 3000);
        return;
    }
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['bookname'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('读书：' + name + '检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('读书：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('读书：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        },
    })
}

function missonDoucument(dom, obj) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { missonDoucument(dom, obj) }, 3000);
        return;
    }
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['name'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('文档：' + name + '检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job/document?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('文档：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('文档：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        },
    })
}

function missonRead(dom, obj) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { missonRead(dom, obj) }, 3000);
        return;
    }
    if (setting.task) {
        if (obj['jobid'] == undefined) {
            logger("当前只处理任务点任务,跳过", 'red')
            switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['title'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        logger('阅读：' + name + ',检测已完成，准备执行下一个任务。', 'green')
        switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job/readv2?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                logger('阅读：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                logger('阅读：' + name + '处理异常,跳过。', 'red')
            }
            switchMission()
            return
        }
    })
}

function missonWork(dom, obj) {
    if (!setting.work) {
        logger('用户设置不自动处理测验，准备处理下一个任务', 'green')
        switchMission()
        return
    }
    let isDo;
    if (setting.task) {
        logger("当前只处理任务点任务", 'red')
        if (obj['jobid'] == undefined ? false : true) {
            isDo = true
        } else {
            isDo = false
        }
    } else {
        logger("当前默认处理所有任务（包括非任务点任务）", 'red')
        isDo = true
    }
    if (isDo) {
        if (obj['jobid'] !== undefined) {
            var phoneWeb = _l.protocol + '//' + _l.host + '/work/phone/work?workId=' + obj['jobid'].replace('work-', '') + '&courseId=' + _defaults['courseid'] + '&clazzId=' + _defaults['clazzId'] + '&knowledgeId=' + _defaults['knowledgeid'] + '&jobId=' + obj['jobid'] + '&enc=' + obj['enc']
            setTimeout(() => { startDoPhoneCyWork(0, dom, phoneWeb) }, 3000)
        } else {
            setTimeout(() => { startDoCyWork(0, dom) }, 3000)
        }
    } else {
        logger('用户设置只处理属于任务点的任务，准备处理下一个任务', 'green')
        switchMission()
        return
    }
}

function doPhoneWork($dom) {
    let $cy = $dom.find('.Wrappadding form')
    $subBtn = $cy.find('.zquestions .zsubmit .btn-ok-bottom')
    $okBtn = $dom.find('#okBtn')
    $saveBtn = $cy.find('.zquestions .zsubmit .btn-save')
    let TimuList = $cy.find('.zquestions .Py-mian1')
    startDoPhoneTimu(0, TimuList)
}

function startDoPhoneTimu(index, TimuList) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { startDoPhoneTimu(index, TimuList) }, 3000);
        return;
    }
    if (index == TimuList.length) {
        if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
            logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
            logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else {
            logger('测验处理完成，存在无答案题目或用户设置不自动提交，自动保存！', 'green')
            setTimeout(() => {
                $saveBtn.click()
                setTimeout(() => {
                    logger('保存成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { switchMission() }, 3000)
                }, 3000)
            }, 5000)
        }
        return
    }
    let contextWindow = TimuList[index] ? (TimuList[index].ownerDocument.defaultView || unsafeWindow) : unsafeWindow;
    let questionFull = $(TimuList[index]).find('.Py-m1-title').html()
    let _question = tidyQuestion(questionFull).replace(/.*?\[.*?题\]\s*\n\s*/, '').trim()
    let typeName = questionFull.match(/.*?\[(.*?)]|$/)[1];
    let _type = ({
        单选题: 0, 单项选择题: 0, 单选: 0, 选择题: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    let _a = []
    let _answerTmpArr
    var check_answer_flag = 0;
    if (_type === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');
        let singleChoiceList = $(TimuList[index]).find('.answerList.singleChoice li');
        let multiChoiceList = $(TimuList[index]).find('.answerList.multiChoice li');
        if (singleChoiceList && singleChoiceList.length > 0) {
            _type = 0;
            logger('自动识别为单选题', 'green');
        } else if (multiChoiceList && multiChoiceList.length > 0) {
            _type = 1;
            logger('自动识别为多选题', 'green');
        } else {
            let tkList = $(TimuList[index]).find('.blankList2 input');
            if (tkList && tkList.length > 0) {
                _type = 2;
                logger('自动识别为填空题', 'green');
            } else {
                let panduanList = $(TimuList[index]).find('.answerList.panduan li');
                if (panduanList && panduanList.length > 0) {
                    _type = 3;
                    logger('自动识别为判断题', 'green');
                } else {
                    let textareaList = $(TimuList[index]).find('textarea');
                    let editorList = $(TimuList[index]).find('.edui-editor');
                    if ((textareaList && textareaList.length > 0) || (editorList && editorList.length > 0)) {
                        _type = 4;
                        logger('自动识别为简答题或材料题', 'green');
                    }
                }
            }
        }
    }
    _currentQuestionMeta = { index: index, total: TimuList.length, typeName: typeName }
    switch (_type) {
        case 0: {
            _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).click()
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
                    $.each(_answerTmpArr, (i, t) => {
                        _a.push(tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim())
                    })
                    let _i = _a.findIndex((item) => item == agrs)
                    if (_i == -1) {
                        _i = findBestFuzzyMatch(_a, agrs)
                    }
                    if (_i == -1) {
                        logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    } else {
                        $(_answerTmpArr[_i]).click()
                        logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            }
        }
            break
        case 1: {
            _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).click()
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    if (agrs == '暂无答案') {
                        logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    } else {
                        _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
                        let _multiOptions = []
                        $.each(_answerTmpArr, (i, t) => {
                            _multiOptions.push(tidyStr($(t).html()).replace(/^[A-Z]\s*\n\s*/, '').trim())
                        })
                        let _matchedAny = false
                        $.each(_answerTmpArr, (i, t) => {
                            if (agrs.indexOf(_multiOptions[i]) != -1) {
                                _matchedAny = true
                                setTimeout(() => { $(_answerTmpArr[i]).click() }, 300)
                            }
                        })
                        if (!_matchedAny) {
                            let fuzzyIndices = findFuzzyMatchMultiple(_multiOptions, agrs)
                            for (var fi = 0; fi < fuzzyIndices.length; fi++) {
                                (function (idx) {
                                    setTimeout(function () { $(_answerTmpArr[idx]).click() }, 300)
                                })(fuzzyIndices[fi])
                            }
                        }
                        let check = 0
                        setTimeout(() => {
                            $.each(_answerTmpArr, (i, t) => {
                                if (($(_answerTmpArr[i]).attr('class') || '').indexOf('cur') != -1) {
                                    check = 1
                                }
                            })
                            if (check) {
                                logger('自动答题成功，准备切换下一题', 'green')
                            } else {
                                logger('未能正确选择答案，请手动选择，跳过此题', 'red')
                                localStorage.setItem('GPTJsSetting.sub', false)
                            }
                            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        }, 1000)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            }
        }
            break
        case 2: {
            let tkList = $(TimuList[index]).find('.blankList2 input')
            let tkEditorBlocks = $(TimuList[index]).find('[data-editorindex]')
            if (tkEditorBlocks && tkEditorBlocks.length > 0) {
                let firstTextarea = $(TimuList[index]).find('textarea[name^="answer"]')
                if (firstTextarea.length > 0 && $(firstTextarea[0]).val() && $(firstTextarea[0]).val().trim() !== '' && !isRedoMode()) {
                    logger("此题已作答,跳过", "green");
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30);
                    break
                }
                _question = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" })
                getAnswer(_type, _question).then((agrs) => {
                    if (agrs == '暂无答案') {
                        logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        return
                    }
                    let answers = splitFillAnswers(agrs)
                    let editorBlocks = $(TimuList[index]).find('[data-editorindex]')
                    $.each(editorBlocks, (i, block) => {
                        let editorIndex = $(block).attr('data-editorindex')
                        let itemId = $(block).attr('data-itemid')
                        let answerContent = answers[i] || answers[0] || agrs
                        setTimeout(() => {
                            try {
                                let ueditor = null
                                if (contextWindow.editors && contextWindow.editors[editorIndex]) {
                                    ueditor = contextWindow.editors[editorIndex].ueditor
                                }
                                if (!ueditor && contextWindow.UE && contextWindow.UE.instants) {
                                    let instantKey = 'ueditorInstant' + editorIndex
                                    ueditor = contextWindow.UE.instants[instantKey]
                                }
                                if (!ueditor && itemId && contextWindow.UE && contextWindow.UE.getEditor) {
                                    ueditor = contextWindow.UE.getEditor('ananas-editor-answer' + itemId)
                                }
                                if (ueditor) {
                                    ueditor.setContent(answerContent)
                                    logger(`填空题第${i + 1}空已填入 (Index: ${editorIndex})`, 'green')
                                } else {
                                    logger(`填空题第${i + 1}空未找到编辑器实例 (Index: ${editorIndex}, ItemId: ${itemId})`, 'yellow')
                                }
                                if (itemId) {
                                    let textarea = $('#answer' + itemId)
                                    if (textarea.length > 0) {
                                        textarea.val(answerContent)
                                        try {
                                            if (textarea[0].value === answerContent) {
                                                textarea[0].dispatchEvent(new Event('change'))
                                                textarea[0].dispatchEvent(new Event('input'))
                                            }
                                        } catch (e) { }
                                    }
                                }
                            } catch (e) {
                                logger('填空题填入详情失败：' + e.message, 'red')
                            }
                        }, 500 * (i + 1))
                    })
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time + 300 * editorBlocks.length)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            } else if (tkList && tkList.length > 0) {
                if ($(tkList[0]).val() && $(tkList[0]).val().trim() !== '' && !isRedoMode()) {
                    logger("此题已作答,跳过", "green");
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30);
                    break
                }
                _question = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" })
                getAnswer(_type, _question).then((agrs) => {
                    if (agrs == '暂无答案') {
                        logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        return
                    }
                    let answers = splitFillAnswers(agrs)
                    let inputList = $(TimuList[index]).find('.blankList2 input')
                    $.each(inputList, (i, t) => {
                        setTimeout(() => {
                            $(t).val(answers[i] || answers[0] || agrs)
                            $(t).trigger('input').trigger('change')
                        }, 200)
                    })
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            } else {
                logger('未找到填空题输入区域，跳过此题', 'red')
                localStorage.setItem('GPTJsSetting.sub', false)
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).click()
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                _question = buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
                getAnswer(_type, _question).then((agrs) => {
                    let judgeResult = parseJudgeAnswer(agrs)
                    if (judgeResult === null) {
                        logger('答案匹配出错，准备切换下一题', 'red')
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        return
                    }
                    let _i = findJudgeOptionIndex(_a, judgeResult === 'true')
                    if (_i === -1) {
                        logger('未匹配到正确选项，跳过', 'red')
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        return
                    }
                    setTimeout(() => {
                        $(_answerTmpArr[_i]).click()
                        logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }, 300)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            }
            break
        }
        case 4: {
            _question = buildPrompt({ type: '简答题或材料题', question: _question })
            let jdEditorBlocks = $(TimuList[index]).find('[data-editorindex]')
            let jdTextareas = $(TimuList[index]).find('textarea[name^="answer"]')
            let jdIsAnswered = false
            if (jdEditorBlocks && jdEditorBlocks.length > 0) {
                if (jdTextareas.length > 0 && $(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !isRedoMode()) {
                    logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                    break
                }
                getAnswer(_type, _question).then((agrs) => {
                    if (agrs == '暂无答案') {
                        logger('AI无法匹配答案，请手动完成', 'red')
                        localStorage.setItem('GPTJsSetting.sub', false)
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        return
                    }
                    let firstBlock = jdEditorBlocks.first()
                    if (firstBlock.length > 0) {
                        let editorIndex = firstBlock.attr('data-editorindex')
                        let itemId = firstBlock.attr('data-itemid')
                        if (!itemId && jdTextareas.length > 0) {
                            let tid = $(jdTextareas[0]).attr('id')
                            if (tid) itemId = tid.replace('answer', '')
                        }
                        setTimeout(() => {
                            try {
                                let ueditor = null
                                if (contextWindow.editors && contextWindow.editors[editorIndex]) {
                                    ueditor = contextWindow.editors[editorIndex].ueditor
                                }
                                if (!ueditor && contextWindow.UE && contextWindow.UE.instants) {
                                    let instantKey = 'ueditorInstant' + editorIndex
                                    ueditor = contextWindow.UE.instants[instantKey]
                                }
                                if (!ueditor && itemId && contextWindow.UE && contextWindow.UE.getEditor) {
                                    ueditor = contextWindow.UE.getEditor('ananas-editor-answer' + itemId)
                                }
                                if (ueditor) {
                                    ueditor.setContent(agrs)
                                    logger(`简答题已填入 (Index: ${editorIndex})`, 'green')
                                } else {
                                    logger(`简答题未找到编辑器实例 (Index: ${editorIndex}, ItemId: ${itemId})`, 'yellow')
                                }
                                if (jdTextareas.length > 0) {
                                    let ta = $(jdTextareas[0])
                                    ta.val(agrs)
                                    try {
                                        ta[0].dispatchEvent(new Event('change'))
                                        ta[0].dispatchEvent(new Event('input'))
                                    } catch (e) { }
                                }
                            } catch (e) {
                                logger('简答题填入失败：' + e.message, 'red')
                                if (jdTextareas.length > 0) {
                                    $(jdTextareas[0]).val(agrs)
                                    logger('简答题通过textarea填入答案', 'blue')
                                }
                            }
                        }, 500)
                    } else {
                        if (jdTextareas.length > 0) {
                            $(jdTextareas[0]).val(agrs)
                            logger('简答题通过textarea填入答案', 'blue')
                        }
                    }
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }
                })
            } else if (jdTextareas && jdTextareas.length > 0) {
                if ($(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !isRedoMode()) {
                    logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    jdIsAnswered = true
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, 30)
                } else {
                    getAnswer(_type, _question).then((agrs) => {
                        if (agrs == '暂无答案') {
                            logger('AI无法匹配答案，请手动完成', 'red')
                            localStorage.setItem('GPTJsSetting.sub', false)
                        } else {
                            $(jdTextareas[0]).val(agrs)
                            $(jdTextareas[0]).trigger('input').trigger('change')
                            logger('简答题自动答题成功，准备切换下一题', 'green')
                        }
                        setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                    }).catch((agrs) => {
                        if (agrs && agrs['c'] == 0) {
                            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                        }
                    })
                }
            } else {
                logger('无法找到简答题输入区域，请手动完成', 'red')
                localStorage.setItem('GPTJsSetting.sub', false)
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }
            break
        }
        case 5: {
            getAnswer(_type, _question).then((agrs) => {
                localStorage.setItem('GPTJsSetting.sub', false)
                logger('此类型题目无法区分单/多选，请手动选择答案', 'red')
                setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
                }
            })
            break
        }
        default:
            logger('暂不支持处理此类型题目：' + questionFull.match(/.*?\[(.*?)]|$/)[1] + '，跳过！请手动作答。', 'red')
            localStorage.setItem('GPTJsSetting.sub', false)
            setTimeout(() => { startDoPhoneTimu(index + 1, TimuList) }, setting.time)
            break
    }
}

function pollForElement(iframeDom, selector, interval, maxAttempts) {
    interval = interval || 2000;
    maxAttempts = (typeof maxAttempts === 'number' && maxAttempts > 0) ? maxAttempts : 60;
    return new Promise(function (resolve) {
        var attempts = 0;
        var check = function () {
            try {
                var doc = $(iframeDom).contents()[0];
                if (doc) {
                    var el = doc.querySelector(selector);
                    if (el) return resolve(el);
                }
            } catch (e) { }
            attempts++;
            if (attempts >= maxAttempts) {
                logger('框架等待超时（' + Math.round(attempts * interval / 1000) + 's），上层将重试或跳过', 'red');
                return resolve(null);
            }
            if (attempts % 15 === 0) {
                logger('框架仍在加载中，已等待' + (attempts * interval / 1000) + '秒...请耐心等待', 'orange');
            }
            setTimeout(check, interval);
        };
        check();
    });
}

var _ne21AntiSleepStarted = false;
function setupAntiSleep() {
    if (_ne21AntiSleepStarted) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    function tryStart() {
        if (_ne21AntiSleepStarted) return;
        try {
            var ac = new AC();
            var osc = ac.createOscillator();
            var gain = ac.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start();
            _ne21AntiSleepStarted = true;
            document.addEventListener('visibilitychange', function () {
                try { if (ac.state === 'suspended') ac.resume(); } catch (_) { }
            });
        } catch (_) { }
    }
    tryStart();
    if (!_ne21AntiSleepStarted) {
        var onUserGesture = function () {
            tryStart();
            if (_ne21AntiSleepStarted) {
                document.removeEventListener('click', onUserGesture, true);
                document.removeEventListener('keydown', onUserGesture, true);
                document.removeEventListener('touchstart', onUserGesture, true);
            }
        };
        document.addEventListener('click', onUserGesture, true);
        document.addEventListener('keydown', onUserGesture, true);
        document.addEventListener('touchstart', onUserGesture, true);
    }
}

function setupAutoRefresh() {
    var stored = localStorage.getItem('GPTJsSetting.autoRefresh');
    var enabled = stored !== null ? (stored === 'true') : false;
    if (!enabled) return;
    var minutes = parseInt(localStorage.getItem('GPTJsSetting.autoRefreshMinutes'), 10);
    if (!isFinite(minutes) || minutes < 5) minutes = 30;
    setTimeout(function () {
        logger('已达到自动刷新时间（' + minutes + '分钟），3 秒后刷新页面...', 'orange');
        setTimeout(function () { try { window.location.reload(); } catch (_) { } }, 3000);
    }, minutes * 60 * 1000);
}

function startDoPhoneCyWork(index, doms, phoneWeb) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { startDoPhoneCyWork(index, doms, phoneWeb) }, 3000);
        return;
    }
    if (index == doms.length) {
        logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(missonStart, 5000)
        return
    }
    logger('等待测验框架加载...', 'purple')
    pollForElement(doms[index], 'iframe').then(element => {
        let workIframe = element
        if (!workIframe) {
            setTimeout(() => { startDoPhoneCyWork(index, doms, phoneWeb) }, 5000)
            return
        }
        let workStatus = $(workIframe).contents().find('.newTestCon .newTestTitle .testTit_status').text().trim()
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(missonStart, 2000)
            return
        }
        if (isRedoMode() && workStatus.indexOf("已完成") != -1) {
            logger('测验：' + (index + 1) + ',重做模式下重新处理已完成测验', 'blue')
            $(workIframe).attr('src', phoneWeb)
            getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
                setTimeout(() => { doPhoneWork($(element).contents()) }, 3000)
            })
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1) {
            var isRedoStatus = workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1
            logger('测验：' + (index + 1) + (isRedoStatus ? ',未达到及格线,准备重做...' : ',准备处理此测验...'), 'purple')
            $(workIframe).attr('src', phoneWeb)
            getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
                setTimeout(() => { doPhoneWork($(element).contents()) }, 3000)
            })
        } else if (workStatus.indexOf('待批阅') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        } else if (workStatus.indexOf('已完成') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',已完成,跳过', 'green')
            setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        } else {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',未知状态[' + workStatus + '],跳过', 'red')
            setTimeout(() => { startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        }
    })
}

function startDoCyWork(index, doms) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { startDoCyWork(index, doms) }, 3000);
        return;
    }
    if (index == doms.length) {
        logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(missonStart, 5000)
        return
    }
    logger('等待测验框架加载...', 'purple')
    pollForElement(doms[index], 'iframe').then(element => {
        let workIframe = element
        if (!workIframe) {
            setTimeout(() => { startDoCyWork(index, doms) }, 5000)
            return
        }
        let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim()
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(missonStart, 2000)
            return
        }
        if (isRedoMode() && workStatus.indexOf("已完成") != -1) {
            logger('测验：' + (index + 1) + ',重做模式下重新处理已完成测验', 'blue')
            setTimeout(() => { doWork(index, doms, workIframe) }, 5000)
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1) {
            var isRedoStatus = workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1
            logger('测验：' + (index + 1) + (isRedoStatus ? ',未达到及格线,准备重做...' : ',准备处理此测验...'), 'purple')
            setTimeout(() => { doWork(index, doms, workIframe) }, 5000)
        } else if (workStatus.indexOf('待批阅') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
        } else if (workStatus.indexOf('已完成') != -1) {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',已完成,跳过', 'green')
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
        } else {
            _mlist.splice(0, 1)
            _domList.splice(0, 1)
            logger('测验：' + (index + 1) + ',未知状态[' + workStatus + '],跳过', 'red')
            setTimeout(() => { startDoCyWork(index + 1, doms) }, 5000)
        }
    })
}

function getElement(parent, selector, timeout = 0) {
    return new Promise(resolve => {
        var result = parent.querySelector(selector);
        if (result) return resolve(result);
        var timer;
        const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
        if (mutationObserver) {
            const observer = new mutationObserver(mutations => {
                for (var mutation of mutations) {
                    for (var addedNode of mutation.addedNodes) {
                        if (addedNode instanceof Element) {
                            result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                            if (result) {
                                observer.disconnect();
                                timer && clearTimeout(timer);
                                return resolve(result);
                            }
                        }
                    }
                }
            });
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            if (timeout > 0) {
                timer = setTimeout(() => {
                    observer.disconnect();
                    return resolve(null);
                }, timeout);
            }
        } else {
            const listener = e => {
                if (e.target instanceof Element) {
                    result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
                    if (result) {
                        parent.removeEventListener('DOMNodeInserted', listener, true);
                        timer && clearTimeout(timer);
                        return resolve(result);
                    }
                }
            };
            parent.addEventListener('DOMNodeInserted', listener, true);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    parent.removeEventListener('DOMNodeInserted', listener, true);
                    return resolve(null);
                }, timeout);
            }
        }
    });
}

function missonHomeWork() {
    logger('开始处理作业', 'green')
    let $_homeworktable = $('.mark_table').find('form')
    let TimuList = $_homeworktable.find('.questionLi')
    doHomeWork(0, TimuList)
}

function doHomeWork(index, TiMuList) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { doHomeWork(index, TiMuList) }, 3000);
        return;
    }
    if (index == TiMuList.length) {
        logger('作业题目已全部完成', 'green')
        return
    }
    function handleNormalTextarea(textareaList, jdt, index, TiMuList) {
        if (!textareaList || textareaList.length === 0) {
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
            return;
        }
        getAnswer(4, jdt).then((agrs) => {
            $.each(textareaList, (i, t) => {
                let _id = $(t).attr('id') || $(t).attr('name');
                setTimeout(() => {
                    try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                }, 300 + i * 200);
            });
            logger('自动答题成功，准备切换下一题', 'green');
            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time + 200 * textareaList.length);
        }).catch((agrs) => {
            if (agrs && agrs['c'] == 0) {
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
            }
        });
    }
    let typeName = $(TiMuList[index]).attr('typename');
    let _type = ({
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    _currentQuestionMeta = { index: index, total: TiMuList.length, typeName: typeName }
    let _questionFull = $(TiMuList[index]).find('.mark_name').html()
    let _question = tidyQuestion(_questionFull).replace(/^[(].*?[)]/, '').trim()
    let _a = []
    let _answerTmpArr, _textareaList
    var check_answer_flag = 0;
    if (_type === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');
        _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _type = 0;
            let multiChoiceCheck = $(TiMuList[index]).find('.stem_answer input[type="checkbox"]');
            if (multiChoiceCheck && multiChoiceCheck.length > 0) {
                _type = 1;
                logger('自动识别为多选题', 'green');
            } else {
                logger('自动识别为单选题', 'green');
            }
        } else {
            _textareaList = $(TiMuList[index]).find('.stem_answer').find('.subEditor textarea, .Answer .divText textarea, .Answer .divText .textDIV textarea, textarea[name^="answerEditor"], .edui-editor textarea');
            if (_textareaList && _textareaList.length > 0) {
                _type = 4;
                logger('自动识别为简答题', 'green');
            }
        }
    }
    switch (_type) {
        case 0: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                } else {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    $.each(_answerTmpArr, (i, t) => {
                        _a.push(tidyStr($(t).html()))
                    })
                    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + "<p></p>" + agrs)
                    }
                    let _i = _a.findIndex((item) => item == agrs)
                    if (_i == -1) {
                        _i = findBestFuzzyMatch(_a, agrs)
                    }
                    if (_i == -1) {
                        logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    } else {
                        setTimeout(() => {
                            let check = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                            if (check.indexOf('check_answer') == -1) {
                                $(_answerTmpArr[_i]).parent().click()
                            }
                            logger('自动答题成功，准备切换下一题', 'green')
                            setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                        }, 300)
                    }
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
        }
            break
        case 1: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                } else {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                        break
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下取消旧答案', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                }
            }
            if (check_answer_flag == 0) {
                getAnswer(_type, _question).then((agrs) => {
                    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + "<p></p>" + agrs)
                    }
                    let _multiOptions = []
                    $.each(_answerTmpArr, (i, t) => {
                        _multiOptions.push(tidyStr($(t).html()))
                    })
                    let _matchedAny = false
                    $.each(_answerTmpArr, (i, t) => {
                        if (agrs.indexOf(_multiOptions[i]) != -1) {
                            _matchedAny = true
                            setTimeout(() => {
                                let check = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                                if (check.indexOf('check_answer_dx') == -1) {
                                    $(_answerTmpArr[i]).parent().click()
                                }
                            }, 300)
                        }
                    });
                    if (!_matchedAny) {
                        let fuzzyIndices = findFuzzyMatchMultiple(_multiOptions, agrs)
                        for (var fi = 0; fi < fuzzyIndices.length; fi++) {
                            (function (idx) {
                                setTimeout(function () {
                                    let check = $(_answerTmpArr[idx]).parent().find('span').attr('class') || ''
                                    if (check.indexOf('check_answer_dx') == -1) {
                                        $(_answerTmpArr[idx]).parent().click()
                                    }
                                }, 300)
                            })(fuzzyIndices[fi])
                        }
                    }
                    logger('自动答题成功，准备切换下一题', 'green')
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
        }
            break
        case 2: {
            _question = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" });
            _textareaList = findAnswerTextareas($(TiMuList[index]));
            if (!_textareaList || _textareaList.length === 0) {
                logger('未找到填空题输入区域，跳过此题', 'red');
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                break
            }
            let _id = $(_textareaList[0]).attr('id') || $(_textareaList[0]).attr('name');
            let firstAnswered = false;
            try {
                if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') firstAnswered = true;
            } catch (e) { firstAnswered = false; }
            if (firstAnswered && !isRedoMode()) {
                logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30);
            } else {
                getAnswer(_type, _question).then((agrs) => {
                    let _answerTmpArr = splitFillAnswers(agrs);
                    $.each(_textareaList, (i, t) => {
                        let _currentId = $(t).attr('id') || $(t).attr('name');
                        let val = _answerTmpArr[i] !== undefined ? _answerTmpArr[i] : (_answerTmpArr[0] || agrs);
                        setTimeout(() => {
                            try { UE.getEditor(_currentId).setContent(val) } catch (e) { }
                        }, 300 + i * 200);
                    });
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time + 200 * _textareaList.length);
                    logger('自动答题成功，准备切换下一题', 'green');
                }).catch((agrs) => {
                    if (agrs && agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                    }
                });
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                } else {
                    if (!isRedoMode()) {
                        logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                    } else {
                        logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                _question = buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
                getAnswer(_type, _question).then((agrs) => {
                    if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + "<p></p>" + agrs)
                    }
                    let judgeResult = parseJudgeAnswer(agrs)
                    if (judgeResult === null) {
                        logger('答案匹配出错，准备切换下一题', 'red')
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                        return
                    }
                    let _i = findJudgeOptionIndex(_a, judgeResult === 'true')
                    if (_i === -1) {
                        logger('未匹配到正确选项，跳过', 'red')
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                        return
                    }
                    setTimeout(() => {
                        let check = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                        if (check.indexOf('check_answer') == -1) {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }, 300)
                    logger('自动答题成功，准备切换下一题', 'green')
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                }).catch((agrs) => {
                    if (agrs['c'] == 0) {
                        setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                    }
                })
            }
            break
        }
        case 4: {
            let _answerEle = findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle || _answerEle.length === 0) {
                logger((index + 1) + ' 未找到文本作答区域，跳过此题', 'red')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                break
            }
            let _isAnswered4 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered4 = true } catch (e) { }
            })
            if (_isAnswered4 && !isRedoMode()) {
                logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt = buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            getAnswer(_type, jdt).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + "<p></p>" + agrs)
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time + 200 * _answerEle.length);
            }).catch(() => {
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            });
        }
            break
        case 5: {
            let _answerEle5 = findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle5 || _answerEle5.length === 0) {
                logger((index + 1) + ' 未找到写作题文本框，跳过此题', 'red')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                break
            }
            let _isAnswered5 = false
            $.each(_answerEle5, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered5 = true } catch (e) { }
            })
            if (_isAnswered5 && !isRedoMode()) {
                logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt5 = buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            getAnswer(_type, jdt5).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + "<p></p>" + agrs)
                }
                $.each(_answerEle5, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time + 200 * _answerEle5.length);
            }).catch(() => {
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            });
        }
            break
        case 6: {
            let _answerEle6 = findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle6 || _answerEle6.length === 0) {
                logger((index + 1) + ' 未找到翻译题文本框，跳过此题', 'red')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
                break
            }
            let _isAnswered6 = false
            $.each(_answerEle6, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered6 = true } catch (e) { }
            })
            if (_isAnswered6 && !isRedoMode()) {
                logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt6 = buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            getAnswer(_type, jdt6).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + "<p></p>" + agrs)
                }
                $.each(_answerEle6, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time + 200 * _answerEle6.length);
            }).catch(() => {
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            });
        }
            break
        default: {
            if (_type === undefined) {
                logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time)
            } else {
                _textareaList = $(TiMuList[index]).find('.stem_answer').find('textarea, .subEditor textarea, .divText textarea, .eidtDiv textarea, .divText .edui-editor, textarea[name^="answerEditor"]');
                if (_textareaList && _textareaList.length > 0) {
                    logger('检测到文本输入区域，尝试回答', 'green');
                    let jdt = buildPrompt({ type: typeName || '未知题型', question: _question, answer_format: "请根据题目作答" })
                    let editorTextareas = $(TiMuList[index]).find('.stem_answer textarea[name^="answerEditor"]');
                    if (editorTextareas && editorTextareas.length > 0) {
                        let editorId = $(editorTextareas[0]).attr('id');
                        if (editorId) {
                            getAnswer(_type || 4, jdt).then((agrs) => {
                                setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                                logger('使用富文本编辑器ID回答成功，准备切换下一题', 'green');
                                setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                            }).catch((agrs) => {
                                if (agrs['c'] == 0) {
                                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                                }
                            });
                        } else {
                            logger('找到富文本编辑器但无法获取ID，改用普通方法', 'yellow');
                            handleNormalTextarea(_textareaList, jdt, index, TiMuList);
                        }
                    } else {
                        handleNormalTextarea(_textareaList, jdt, index, TiMuList);
                    }
                } else {
                    logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    setTimeout(() => { doHomeWork(index + 1, TiMuList) }, setting.time);
                }
            }
        }
    }
}

function missonExam() {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(missonExam, 3000);
        return;
    }
    let $_examtable = $('.mark_table').find('.whiteDiv')
    let _questionFull = tidyStr($_examtable.find('h3.mark_name').html().trim())
    let typeName = _questionFull.match(/[(](.*?),.*?分[)]|$/)[1];
    let _qType = ({
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    let _examCurIdx = null
    try {
        let $curLi = $('.mark_table .mark_li_list li.active, .mark_table .mark_li_list li.current')
        if ($curLi.length) _examCurIdx = parseInt($curLi.text().trim()) - 1
    } catch (_) { }
    _currentQuestionMeta = { index: isFinite(_examCurIdx) ? _examCurIdx : null, total: null, typeName: typeName }
    let _question = tidyQuestion(_questionFull.replace(/[(].*?分[)]/, '').replace(/^\s*/, ''))
    let $_ansdom = $_examtable.find('#submitTest').find('.stem_answer')
    let _answerTmpArr;
    let _a = []
    function handleStandardExamTextarea(standardTextareas, _question) {
        logger('检测到标准文本输入区域，尝试回答', 'green');
        let jdt = buildPrompt({ type: typeName || '未知题型', question: _question, answer_format: "请根据题目作答" })
        getAnswer(4, jdt).then((agrs) => {
            $.each(standardTextareas, (i, t) => {
                let _id = $(t).attr('id')
                setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300)
            })
            logger('自动答题成功，准备切换下一题', 'green')
            toNextExam()
        }).catch((agrs) => {
            if (agrs['c'] == 0) {
                toNextExam()
            }
        })
    }
    if (_qType === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');
        _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p');
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _qType = 0;
            let multiChoiceCheck = $_ansdom.find('.clearfix.answerBg input[type="checkbox"]');
            if (multiChoiceCheck && multiChoiceCheck.length > 0) {
                _qType = 1;
                logger('自动识别为多选题', 'green');
            } else {
                logger('自动识别为单选题', 'green');
            }
        } else {
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea, .Answer .divText .edui-editor, .Answer .divText textarea, textarea[name^="answerEditor"]');
            if (_textareaList && _textareaList.length > 0) {
                _qType = 4;
                logger('自动识别为简答题', 'green');
            }
        }
    }
    switch (_qType) {
        case 0: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            let _answeredIdxE0 = -1
            for (let _ai = 0; _ai < _answerTmpArr.length; _ai++) {
                let _cls = $(_answerTmpArr[_ai]).parent().find('span').attr('class') || ''
                if (_cls.indexOf('check_answer') !== -1) { _answeredIdxE0 = _ai; break }
            }
            if (_answeredIdxE0 !== -1 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            if (_answeredIdxE0 !== -1 && isRedoMode()) {
                logger('此题已作答，重做模式下重新作答', 'blue')
                $(_answerTmpArr[_answeredIdxE0]).parent().click()
            }
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            getAnswer(_qType, _question).then((agrs) => {
                $.each(_answerTmpArr, (i, t) => {
                    _a.push(tidyStr($(t).html()))
                })
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                let _i = _a.findIndex((item) => item == agrs)
                if (_i == -1) {
                    _i = findBestFuzzyMatch(_a, agrs)
                }
                if (_i == -1) {
                    logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                    setTimeout(toNextExam, 5000)
                } else {
                    setTimeout(() => {
                        if (($(_answerTmpArr[_i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                            if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                setTimeout(() => { $(_answerTmpArr[_i]).parent().click() }, 300)
                            }
                            logger('自动答题成功，准备切换下一题', 'green')
                            toNextExam()
                        } else {
                            logger('此题已作答，准备切换下一题', 'green')
                            toNextExam()
                        }
                    }, 300)
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
        }
            break
        case 1: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            let _alreadyAnsweredE1 = $_ansdom.find('.clearfix.answerBg span.check_answer_dx, .clearfix.answerBg span.check_answer').length > 0
            if (_alreadyAnsweredE1 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            if (_alreadyAnsweredE1 && isRedoMode()) {
                logger('此题已作答，重做模式下重新作答', 'blue')
                $.each(_answerTmpArr, function (_i2, _t2) {
                    var _cls2 = $(_t2).parent().find('span').attr('class') || ''
                    if (_cls2.indexOf('check_answer') !== -1) {
                        $(_t2).parent().click()
                    }
                })
            }
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            getAnswer(_qType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                {
                    let _multiOptions = []
                    $.each(_answerTmpArr, (i, t) => {
                        _multiOptions.push(tidyStr($(t).html()))
                    })
                    let _matchedAny = false
                    $.each(_answerTmpArr, (i, t) => {
                        if (agrs.indexOf(_multiOptions[i]) != -1) {
                            _matchedAny = true
                            if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                setTimeout(() => { $(_answerTmpArr[i]).parent().click() }, 300)
                            }
                        }
                    });
                    if (!_matchedAny) {
                        let fuzzyIndices = findFuzzyMatchMultiple(_multiOptions, agrs)
                        for (var fi = 0; fi < fuzzyIndices.length; fi++) {
                            (function (idx) {
                                if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                    $(_answerTmpArr[idx]).parent().find('span').css('font-weight', 'bold');
                                } else {
                                    setTimeout(function () { $(_answerTmpArr[idx]).parent().click() }, 300)
                                }
                            })(fuzzyIndices[fi])
                        }
                    }
                    logger('自动答题成功，准备切换下一题', 'green')
                    toNextExam()
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
        }
            break
        case 2: {
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea')
            let _alreadyAnsweredE2 = false
            $.each(_textareaList, function (_i2, _t2) {
                let _eid = $(_t2).attr('id')
                try {
                    if (_eid && typeof UE !== 'undefined' && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') {
                        _alreadyAnsweredE2 = true
                    }
                } catch (_e) { }
            })
            if (_alreadyAnsweredE2 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            if (_alreadyAnsweredE2 && isRedoMode()) {
                logger('此题已作答，重做模式下重新作答', 'blue')
                $.each(_textareaList, function (_i2, _t2) {
                    let _eid = $(_t2).attr('id')
                    try { if (_eid && UE.getEditor(_eid)) UE.getEditor(_eid).setContent('') } catch (_e) { }
                })
            }
            _question = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" });
            getAnswer(_qType, _question).then((agrs) => {
                let _answerTmpArr = splitFillAnswers(agrs)
                $.each(_textareaList, (i, t) => {
                    let _id = $(t).attr('id')
                    setTimeout(() => { UE.getEditor(_id).setContent(_answerTmpArr[i]) }, 300)
                })
                logger('自动答题成功，准备切换下一题', 'green')
                toNextExam()
            }).catch((agrs) => {
                if (agrs && agrs['c'] == 0) { toNextExam() }
            })
            break
        }
        case 3: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            let _answeredIdxE3 = -1
            for (let _ai = 0; _ai < _answerTmpArr.length; _ai++) {
                let _cls = $(_answerTmpArr[_ai]).parent().find('span').attr('class') || ''
                if (_cls.indexOf('check_answer') !== -1) { _answeredIdxE3 = _ai; break }
            }
            if (_answeredIdxE3 !== -1 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            if (_answeredIdxE3 !== -1 && isRedoMode()) {
                logger('此题已作答，重做模式下重新作答', 'blue')
                $(_answerTmpArr[_answeredIdxE3]).parent().click()
            }
            _question = buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" });
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            getAnswer(_qType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                let judgeResult = parseJudgeAnswer(agrs)
                if (judgeResult === null) {
                    logger('答案匹配出错，准备切换下一题', 'red')
                    toNextExam()
                    return
                }
                let _i = findJudgeOptionIndex(_a, judgeResult === 'true')
                if (_i === -1) {
                    logger('未匹配到正确选项，跳过', 'red')
                    toNextExam()
                    return
                }
                if (($(_answerTmpArr[_i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                    if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                        setTimeout(() => { $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold'); }, 300)
                    } else {
                        $(_answerTmpArr[_i]).parent().click()
                    }
                    logger('自动答题成功，准备切换下一题', 'green')
                    toNextExam()
                } else {
                    logger('此题已作答，准备切换下一题', 'green')
                    toNextExam()
                }
            }).catch((agrs) => {
                if (agrs['c'] == 0) {
                    toNextExam()
                }
            })
            break
        }
        case 4: {
            let _answerEle = findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { toNextExam(); break }
            let _isAnsweredE4 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE4 = true } catch (e) { }
            })
            if (_isAnsweredE4 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            let jdt = buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            getAnswer(_qType, jdt).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                setTimeout(toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { toNextExam(); });
        }
            break
        case 5: {
            let _answerEle = findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { toNextExam(); break }
            let _isAnsweredE5 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE5 = true } catch (e) { }
            })
            if (_isAnsweredE5 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            let jdt = buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            getAnswer(_qType, jdt).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                setTimeout(toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { toNextExam(); });
        }
            break
        case 6: {
            let _answerEle = findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { toNextExam(); break }
            let _isAnsweredE6 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE6 = true } catch (e) { }
            })
            if (_isAnsweredE6 && !isRedoMode()) {
                logger('此题已作答，准备切换下一题', 'green')
                toNextExam()
                break
            }
            let jdt = buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            getAnswer(_qType, jdt).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + agrs)
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200);
                });
                setTimeout(toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { toNextExam(); });
        }
            break
        default: {
            if (_qType === undefined) {
                logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                toNextExam()
            } else {
                let standardTextareas = $_ansdom.find('.Answer .divText .subEditor textarea');
                let richEditors = $_ansdom.find('.Answer .divText .edui-editor');
                let editorTextareas = $_ansdom.find('textarea[name^="answerEditor"]');
                if (editorTextareas && editorTextareas.length > 0) {
                    logger('检测到材料题富文本编辑器，尝试回答', 'green');
                    let editorId = $(editorTextareas[0]).attr('id');
                    if (editorId) {
                        let jdt = buildPrompt({ type: '材料题', question: _question, answer_format: "请根据材料详细回答" })
                        getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                            logger('材料题自动答题成功，准备切换下一题', 'green');
                            toNextExam();
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                toNextExam();
                            }
                        });
                    } else {
                        logger('找到材料题编辑器但无法获取ID，尝试其他方法', 'yellow');
                        handleStandardExamTextarea(standardTextareas, _question);
                    }
                } else if (standardTextareas && standardTextareas.length > 0) {
                    handleStandardExamTextarea(standardTextareas, _question);
                } else if (richEditors && richEditors.length > 0) {
                    logger('检测到富文本编辑器，尝试查找编辑器ID', 'green');
                    let editorScripts = $('script:contains("UE.getEditor")');
                    let editorIdMatch = null;
                    if (editorScripts && editorScripts.length > 0) {
                        let scriptContent = editorScripts.text();
                        let matches = scriptContent.match(/UE\.getEditor\(['"](.*?)['"]/);
                        if (matches && matches.length > 1) {
                            editorIdMatch = matches[1];
                            logger('从脚本中发现编辑器ID: ' + editorIdMatch, 'green');
                        }
                    }
                    if (editorIdMatch) {
                        let jdt = buildPrompt({ type: '材料题', question: _question, answer_format: "请根据材料详细回答" })
                        getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorIdMatch).setContent(agrs) }, 300);
                            logger('使用脚本找到的编辑器ID回答成功，准备切换下一题', 'green');
                            toNextExam();
                        }).catch((agrs) => {
                            if (agrs['c'] == 0) {
                                toNextExam();
                            }
                        });
                    } else {
                        logger('无法找到有效的编辑器ID，跳过此题', 'red');
                        toNextExam();
                    }
                } else {
                    logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    toNextExam();
                }
            }
        }
    }
}

function toNextExam() {
    if (localStorage.getItem('GPTJsSetting.examTurn') === 'true') {
        let $_examtable = $('.mark_table').find('.whiteDiv')
        let $nextbtn = $_examtable.find('.nextDiv a.jb_btn')
        setTimeout(() => {
            $nextbtn.click()
        }, setting.examTurnTime ? 2000 + (Math.floor(Math.random() * 5 + 1) * 1000) : 2000)
    } else {
        logger('用户设置不自动跳转下一题，请手动点击', 'blue')
    }
}

function missonExamPreview() {
    logger('进入整卷预览页面，开始处理考试', 'green')
    let TiMuList = $('.mark_table').find('.questionLi')
    if (!TiMuList || TiMuList.length === 0) {
        logger('未解析到题目，请确认页面已渲染', 'red')
        return
    }
    logger('共解析到 ' + TiMuList.length + ' 道题', 'blue')
    doExamPreview(0, TiMuList)
}

function getExamPreviewDelay() {
    let base = (setting && setting.time) ? setting.time : 2500
    return base + Math.floor(Math.random() * 1500)
}

function getExamPreviewType($timu) {
    let typeMap = {
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    }
    let typeName = $timu.attr('typename')
    if (typeName && typeMap[typeName] !== undefined) {
        return { type: typeMap[typeName], typeName: typeName }
    }
    let prefixText = $timu.find('.colorShallow').text() || $timu.find('.mark_name').text() || ''
    let m = prefixText.match(/(单选题|多选题|填空题|判断题|简答题|论述题|写作题|翻译题)/)
    if (m && typeMap[m[1]] !== undefined) {
        return { type: typeMap[m[1]], typeName: m[1] }
    }
    let qid = $timu.attr('data') || $timu.find('.questionId').val() || $timu.find('input.questionId').val()
    if (qid) {
        let typeVal = $('[name="type' + qid + '"]').val()
        if (typeVal !== undefined && typeVal !== null && typeVal !== '') {
            let n = parseInt(typeVal)
            if (!isNaN(n) && n >= 0 && n <= 6) {
                return { type: n, typeName: typeName || ('类型' + n) }
            }
        }
    }
    let $opts = $timu.find('.answerBg .answer_p')
    if ($opts && $opts.length > 0) {
        let hasCheckbox = $timu.find('.answerBg input[type="checkbox"]').length > 0
        return { type: hasCheckbox ? 1 : 0, typeName: typeName || (hasCheckbox ? '多选题' : '单选题') }
    }
    let $textareas = $timu.find('textarea[name^="answerEditor"], .subEditor textarea')
    if ($textareas && $textareas.length > 0) {
        return { type: 4, typeName: typeName || '简答题' }
    }
    return { type: undefined, typeName: typeName || '未知' }
}

function doExamPreview(index, TiMuList) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { doExamPreview(index, TiMuList) }, 3000);
        return;
    }
    if (index >= TiMuList.length) {
        logger('整卷预览答题已完成，请人工核对后手动交卷', 'green')
        return
    }
    let $timu = $(TiMuList[index])
    let typeInfo = getExamPreviewType($timu)
    let _type = typeInfo.type
    let typeName = typeInfo.typeName
    let _questionFull = $timu.find('.mark_name').html() || ''
    let _question = tidyQuestion(_questionFull).replace(/^[(].*?[)]/, '').trim()
    let _a = []
    let _answerTmpArr, _textareaList
    let alreadyAnswered = 0
    let prefix = '第' + (index + 1) + '题: '
    function nextSoon() {
        setTimeout(function () { doExamPreview(index + 1, TiMuList) }, getExamPreviewDelay())
    }
    function nextFast() {
        setTimeout(function () { doExamPreview(index + 1, TiMuList) }, 30)
    }
    _currentQuestionMeta = { index: index, total: TiMuList.length, typeName: typeName }
    if (_type === undefined) {
        logger(prefix + '无法识别题型(' + typeName + ')，跳过此题', 'red')
        return nextSoon()
    }
    switch (_type) {
        case 0: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                logger(prefix + '未找到选项，跳过', 'red')
                return nextSoon()
            }
            let mergedAnswers = []
            _answerTmpArr.each(function () {
                mergedAnswers.push($(this).text().replace(/[ABCD]/g, '').trim())
            })
            let prompt = buildPrompt({ type: '单选题', question: _question, options: mergedAnswers })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!isRedoMode()) {
                        logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                    } else {
                        logger(prefix + '已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                    break
                }
            }
            if (alreadyAnswered) return nextFast()
            getAnswer(_type, prompt).then(function (agrs) {
                $.each(_answerTmpArr, function (i, t) { _a.push(tidyStr($(t).html())) })
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p></p>' + agrs)
                }
                let _i = _a.findIndex(function (item) { return item === agrs })
                if (_i === -1) {
                    _i = findBestFuzzyMatch(_a, agrs)
                }
                if (_i === -1) {
                    logger(prefix + 'AI无法完美匹配正确答案，请手动选择', 'red')
                    return nextSoon()
                }
                setTimeout(function () {
                    let cls = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                    if (cls.indexOf('check_answer') === -1) {
                        if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold')
                        } else {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }
                    logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
            }).catch(function () { nextSoon() })
            break
        }
        case 1: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                logger(prefix + '未找到选项，跳过', 'red')
                return nextSoon()
            }
            let mergedAnswers = []
            _answerTmpArr.each(function () {
                mergedAnswers.push($(this).text().replace(/[ABCD]/g, '').trim())
            })
            let prompt = buildPrompt({ type: '多选题', question: _question, options: mergedAnswers, answer_format: "用'|'分割多个答案" })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!isRedoMode()) {
                        logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                        break
                    } else {
                        logger(prefix + '已作答，重做模式下取消旧答案', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                }
            }
            if (alreadyAnswered) return nextFast()
            getAnswer(_type, prompt).then(function (agrs) {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p></p>' + agrs)
                }
                let _multiOptions = []
                $.each(_answerTmpArr, function (i, t) {
                    _multiOptions.push(tidyStr($(t).html()))
                })
                let _matchedAny = false
                $.each(_answerTmpArr, function (i, t) {
                    if (agrs.indexOf(_multiOptions[i]) !== -1) {
                        _matchedAny = true
                        if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[i]).parent().find('span').css('font-weight', 'bold')
                        } else {
                            let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                            if (cls.indexOf('check_answer_dx') === -1) {
                                setTimeout(function () { $(_answerTmpArr[i]).parent().click() }, 300)
                            }
                        }
                    }
                })
                if (!_matchedAny) {
                    let fuzzyIndices = findFuzzyMatchMultiple(_multiOptions, agrs)
                    for (var fi = 0; fi < fuzzyIndices.length; fi++) {
                        (function (idx) {
                            if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[idx]).parent().find('span').css('font-weight', 'bold')
                            } else {
                                let cls = $(_answerTmpArr[idx]).parent().find('span').attr('class') || ''
                                if (cls.indexOf('check_answer_dx') === -1) {
                                    setTimeout(function () { $(_answerTmpArr[idx]).parent().click() }, 300)
                                }
                            }
                        })(fuzzyIndices[fi])
                    }
                }
                logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            break
        }
        case 2: {
            _textareaList = $timu.find('textarea[name^="answerEditor"]')
            if (!_textareaList || _textareaList.length === 0) {
                _textareaList = $timu.find('.subEditor textarea')
            }
            if (!_textareaList || _textareaList.length === 0) {
                logger(prefix + '未找到填空文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered = false
            $.each(_textareaList, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered = true
                    }
                } catch (e) { }
            })
            if (isAnswered && !isRedoMode()) {
                logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" })
            getAnswer(_type, prompt).then(function (agrs) {
                let parts = splitFillAnswers(agrs)
                $.each(_textareaList, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    let val = parts[i] !== undefined ? parts[i] : (parts[parts.length - 1] || '')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(val) } catch (e) { }
                    }, 300 + i * 200)
                })
                logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            break
        }
        case 3: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                logger(prefix + '未找到判断选项，跳过', 'red')
                return nextSoon()
            }
            $.each(_answerTmpArr, function (i, t) { _a.push($(t).text().trim()) })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!isRedoMode()) {
                        logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                    } else {
                        logger(prefix + '已作答，重做模式下重新作答', 'blue')
                        $(_answerTmpArr[i]).parent().click()
                    }
                    break
                }
            }
            if (alreadyAnswered) return nextFast()
            let prompt = buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
            getAnswer(_type, prompt).then(function (agrs) {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p></p>' + agrs)
                }
                let judgeResult = parseJudgeAnswer(agrs)
                let _i = judgeResult !== null ? findJudgeOptionIndex(_a, judgeResult === 'true') : -1
                if (_i === -1) {
                    logger(prefix + '答案匹配出错，跳过', 'red')
                    return nextSoon()
                }
                setTimeout(function () {
                    let cls = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                    if (cls.indexOf('check_answer') === -1) {
                        if (localStorage.getItem('GPTJsSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold')
                        } else {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }
                    logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
            }).catch(function () { nextSoon() })
            break
        }
        case 4: {
            let _answerEle = findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered = true
                    }
                } catch (e) { }
            })
            if (isAnswered && !isRedoMode()) {
                logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            getAnswer(_type, prompt).then(function (agrs) {
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200)
                })
                logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            break
        }
        case 5: {
            let _answerEle = findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered5 = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered5 = true
                    }
                } catch (e) { }
            })
            if (isAnswered5 && !isRedoMode()) {
                logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            getAnswer(_type, prompt).then(function (agrs) {
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200)
                })
                logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            break
        }
        case 6: {
            let _answerEle = findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered6 = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered6 = true
                    }
                } catch (e) { }
            })
            if (isAnswered6 && !isRedoMode()) {
                logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            getAnswer(_type, prompt).then(function (agrs) {
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { }
                    }, 300 + i * 200)
                })
                logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            break
        }
        default: {
            logger(prefix + '无法处理此题型: ' + typeName + '，跳过', 'red')
            nextSoon()
        }
    }
}

function refreshCourseList() {
    let _p = parseUrlParams()
    return new Promise((resolve, reject) => {
        $.ajax({
            url: _l.protocol + '//' + _l.host + '/mycourse/studentstudycourselist?courseId=' + _p['courseid'] + '&chapterId=' + _p['knowledgeid'] + '&clazzid=' + _p['clazzid'] + '&mooc2=1',
            type: 'GET',
            dateType: 'html',
            success: function (res) {
                resolve(res)
            }
        })
    })
}

var _ne21ThinkingCount = 0;
function showThinking() {
    _ne21ThinkingCount++;
    if (_ne21ThinkingCount === 1) {
        $('#ne-21thinking', window.parent.document).addClass('ne21-active');
    }
}
function hideThinking() {
    if (_ne21ThinkingCount > 0) _ne21ThinkingCount--;
    if (_ne21ThinkingCount === 0) {
        $('#ne-21thinking', window.parent.document).removeClass('ne21-active');
    }
}

function buildPrompt(opts) {
    opts = opts || {}
    let q = opts.question != null ? String(opts.question) : ''
    let payloadObj = {}
    if (opts.type) payloadObj.type = String(opts.type)
    if (opts.answer_format) payloadObj.answer_format = String(opts.answer_format)
    payloadObj.question = q
    if (Array.isArray(opts.options) && opts.options.length > 0) {
        payloadObj.options = opts.options.map(function (s) { return String(s == null ? '' : s).trim() })
    }
    let payload = JSON.stringify(payloadObj, null, 2)
    let display = q
    if (payloadObj.options && payloadObj.options.length) {
        display += '\n' + payloadObj.options.join(' | ')
    }
    return { payload: payload, display: display }
}

function doWork(index, doms, dom) {
    $frame_c = $(dom).contents();
    let $CyHtml = $frame_c.find('.CeYan')
    let TiMuList = $CyHtml.find('.TiMu')
    $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
    $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
    startDoWork(index, doms, 0, TiMuList)
}

function startDoWork(index, doms, c, TiMuList) {
    if (localStorage.getItem('GPTJsSetting.isPaused') === 'true') {
        setTimeout(() => { startDoWork(index, doms, c, TiMuList) }, 3000);
        return;
    }
    if (c == TiMuList.length) {
        if (localStorage.getItem('GPTJsSetting.sub') === 'true') {
            logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('GPTJsSetting.force') === 'true') {
            logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    logger('提交成功，准备切换下一个任务。', 'green')
                    _mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else {
            logger('测验处理完成，存在无答案题目或者用户设置不提交。', 'red')
        }
        return
    }
    let questionFull = $(TiMuList[c]).find('.Zy_TItle.clearfix > div').html()
    questionFull = tidyQuestion(questionFull).replace("/<span.*?>.*?</span>/", "");
    let _question = tidyQuestion(questionFull)
    let typeName = questionFull.match(/^【(.*?)】|$/)[1];
    let _TimuType = {
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4
    }[typeName]
    _currentQuestionMeta = { index: c, total: TiMuList.length, typeName: typeName }
    let _a = []
    let _answerTmpArr
    if (_TimuType === undefined) {
        logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');
        let choiceList = $(TiMuList[c]).find('.Zy_ulTop li');
        if (choiceList && choiceList.length > 0) {
            if (choiceList.length === 2 &&
                ($(choiceList[0]).text().includes('对') || $(choiceList[0]).text().includes('√')) &&
                ($(choiceList[1]).text().includes('错') || $(choiceList[1]).text().includes('×'))) {
                _TimuType = 3;
                logger('自动识别为判断题', 'green');
            } else {
                _TimuType = 0;
                logger('自动识别为单选题', 'green');
            }
        } else {
            let fillBlankList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1');
            if (fillBlankList && fillBlankList.length > 0) {
                _TimuType = 2;
                logger('自动识别为填空题', 'green');
            } else {
                let editorList = $(TiMuList[c]).find('.edui-editor');
                if (editorList && editorList.length > 0) {
                    _TimuType = 4;
                    logger('检测到富文本编辑器，识别为简答题', 'green');
                } else {
                    _TimuType = 4;
                    logger('无法准确判断题型，按简答题处理', 'blue');
                }
            }
        }
    }
    switch (_TimuType) {
        case 0: {
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            $.each(_answerTmpArr, (i, t) => {
                _a.push(tidyStr($(t).html()))
            })
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                let _i = _a.findIndex((item) => item == agrs)
                if (_i == -1) {
                    _i = findBestFuzzyMatch(_a, agrs)
                }
                if (_i == -1) {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                }
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        }
        case 1: {
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/[ABCD]/g, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                let _multiOptions = []
                $.each(_answerTmpArr, (i, t) => {
                    _multiOptions.push(tidyStr($(t).html()))
                })
                let _matchedAny = false
                $.each(_answerTmpArr, (i, t) => {
                    if (agrs.indexOf(_multiOptions[i]) != -1) {
                        _matchedAny = true
                        $(_answerTmpArr[i]).parent().click();
                        _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][i])
                    }
                })
                if (!_matchedAny) {
                    let fuzzyIndices = findFuzzyMatchMultiple(_multiOptions, agrs)
                    for (var fi = 0; fi < fuzzyIndices.length; fi++) {
                        $(_answerTmpArr[fuzzyIndices[fi]]).parent().click();
                        _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][fuzzyIndices[fi]])
                    }
                }
                let id = getStr($(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick'), 'addcheck(', ');').replace('(', '').replace(')', '')
                if (_a.length <= 0) {
                    logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
                }
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        }
        case 2: {
            _question = buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'§'分隔" })
            let _textareaList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                let _answerList = splitFillAnswers(agrs)
                $.each(_textareaList, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        }
        case 3: {
            _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
            let _true = "正确|是|对|√|T|ri";
            $.each(_answerTmpArr, (i, t) => {
                _a.push(tidyStr($(t).html()));
            });
            _question = buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
            getAnswer(_TimuType, _question).then((agrs) => {
                if (localStorage.getItem('GPTJsSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + agrs)
                }
                agrs = _true.indexOf(agrs) != -1 ? "对" : "错";
                let _i = _a.findIndex((item) => item == agrs);
                if (_i == -1) {
                    _i = findBestFuzzyMatch(_a, agrs)
                }
                if (_i == -1) {
                    logger("未匹配到正确答案，跳过", "red");
                    localStorage.setItem('GPTJsSetting.sub', false)
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                }
                setTimeout(() => {
                    startDoWork(index, doms, c + 1, TiMuList);
                }, setting.time);
            }).catch((agrs) => {
                setTimeout(() => {
                    startDoWork(index, doms, c + 1, TiMuList);
                }, setting.time);
            });
            break;
        }
        case 4: {
            let _textareaLista = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            getAnswer(_TimuType, _question).then((agrs) => {
                if (agrs == '暂无答案') {
                    localStorage.setItem('GPTJsSetting.sub', false)
                }
                let _answerList = agrs.split("#")
                $.each(_textareaLista, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            }).catch((agrs) => {
                setTimeout(() => { startDoWork(index, doms, c + 1, TiMuList) }, setting.time)
            })
            break
        }
    }
}

function switchMission() {
    _mlist.splice(0, 1)
    _domList.splice(0, 1)
    setTimeout(missonStart, 5000)
}

function tidyStr(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').trim().replace(/&nbsp;/g, '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null
    }
}

function tidyQuestion(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[.、]/, '').trim().replace(/&nbsp;/g, '').replace('javascript:void(0);', '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null
    }
}

function base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}
