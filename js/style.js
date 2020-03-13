// 第一步 初始化 speechsynthesis API
const synth = window.speechSynthesis;
// console.log(synth);

// 新消息自动滑倒最低端
function silder() {
    var div = document.getElementById('windows');
    // div.innerHTML = div.innerHTML + '<br />';
    div.scrollTop = div.scrollHeight;
}

function getTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var sencond = now.getSeconds();
    var time = hour + ':' + minute + ':' + sencond;
    return time;
}

function sendMessage() {
    // var data='输入的文字'
    $(document).ready(function() {
        $('#me').click(function() {
            var msg = $('#msg').val();
            var ini =
                "{'sessionId':'09e2aca4d0a541f88eecc77c03a8b393','robotId':'webbot','userId':'462d49d3742745bb98f7538c42f9f874','body':{'content':'" +
                msg +
                "'},'type':'txt'}&ts=1529917589648";
            var url =
                'http://i.xiaoi.com/robot/webrobot?&callback=__webrobot_processMsg&data=' +
                encodeURI(ini);
            var cookie = {
                cnonce: '808116',
                sig: '0c3021aa5552fe597bb55448b40ad2a90d2dead5',
                XISESSIONID: 'hlbnd1oiwar01dfje825gavcn',
                nonce: '273765',
                hibext_instdsigdip2: '1'
            };
            var hearder = {
                cookies: cookie
            };
            if (msg != '') {
                var newMsgChild = $(
                    "<div class='time' style='clear:both'>" +
                    getTime() +
                    "</div><div class = 'content2' style='clear:both' ><div class ='right'><p>" +
                    msg +
                    "</p> </div> <img src ='2.jpg'class = 'img2' title='自己' / ></div></br>"
                );
                $('.container').append(newMsgChild);
                $('#msg').val('');
                silder();

                //get请求
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    crossDomain: true,
                    url: url,
                    headers: hearder,
                    async: false,
                    jsonp: 'callback',
                    jsonpCallback: '__webrobot_processMsg', //callback值
                    success: function(data) {
                        var result = data.body.content;
                        console.log(result);
                        getMsg(result);
                    },
                    error: function(data) {
                        var result = '操作频繁,请稍后再试!';
                        getMsg(result);
                    }
                });
            } else {
                alert('请输入发送内容！');
            }
        });
    });
}
sendMessage();

function getMsg(result) {
    if (result != 'undefined') {
        var getMsgChild = $(
            "<audio src='newMsg.wav' autoplay='autoplay' display:none;></audio><div class='time' style='clear:both'>" +
            getTime() +
            "<div class='box1'><img src='1.jpeg' class='img1' ><div class='content1' ><div class='left' ><p >" +
            result +
            '</p></div></div></div>'
        );
        $('.container').append(getMsgChild);
        silder();
        speak(result);
    }
}

function speak(rs) {
    var reglex = /(<a href="https:\/\/)?([A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*)(">)/g;
    str = rs.replace(reglex, '');

    res = str.replace(/\s+/g, '');
    re = res.replace(/[<">']/g, '');

    console.log(re);
    // console.log(re);

    voices = synth.getVoices();
    // console.log(voices);
    // 验证是否在说话
    if (synth.speaking) {
        console.error('正在说话中...');
        return;
    }
    // 获得说话文本re
    const speakText = new SpeechSynthesisUtterance(re);
    // 说话结束触发
    speakText.onend = e => {
        console.log('说话结束');
    };
    // 发生阻止说出话语的错误就触发
    speakText.onerror = e => {
        console.error('抱歉出错了');
    };
    // 选择语音
    const selectedVoice = 'Google 普通话（中国大陆）';
    // 遍历voices
    voices.forEach(voice => {
        if (voice.name === selectedVoice) {
            speakText.voice = voice;
        }
    });
    // 设置音速和音调
    speakText.rate = 1;
    speakText.pitch = 1;
    // speak
    synth.speak(speakText);
}