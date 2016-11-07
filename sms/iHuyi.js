/**
 * Created by XadillaX on 14-2-12.
 * https://github.com/XadillaX/ihuyi106js
 */
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
};

var dom = require('xmldom').DOMParser;

var _baseUri = "http://106.ihuyi.com/webservice/sms.php?method=Submit";
var _userAgent = "node-ihuyi106-module by 死月 (admin@xcoder.in)";
//var url ="https://106.ihuyi.com/webservice/sms.php?method=Submit";
/**
 * iHuyi constructure.
 * @param account
 * @param password 查看密码请登录用户中心->验证码、通知短信->帐户及签名设置->APIKEY
 */
var iHuyi = function() {
    this.spidex = require("spidex");
    //this.spidex.setDefaultUserAgent(_userAgent);
    this.account = "cf_micodata";
    this.password = "69222ef0f5ea8dbbdddb509f8ac29ab7";
};

/**
 * send an SMS.
 * @param mobile
 * @param content
 * @param callback
 */
iHuyi.prototype.send = function(mobile, content, callback) {
    var data = {
        account         : this.account,
        password        : this.password,
        mobile          : mobile,
        content         : content
    };

    this.spidex.post(_baseUri,{data:data}, function(html, status) {
        if(status !== 200) {
            callback(new Error("短信发送服务器响应失败。"));
            return;
        }

        html = html.replaceAll("\r", "");
        html = html.replaceAll("\n", "");
        html = html.replaceAll(" xmlns=\"http://106.ihuyi.com/\"", "");

        //console.log(html);
        var doc = new dom().parseFromString(html);
        var result = doc.lastChild;
        var json = {};
        for(var node = result.firstChild; node !== null; node = node.nextSibling) {
            json[node.tagName] = node.firstChild.data;
        }

        //console.log(json);
        if(json.code == "2") {
            callback(null, json.smsid);
        } else {
            callback(new Error(json.msg, parseInt(json.code)));
        }
    }, data, "utf8").on("err", function(e) {
        callback(e);
    });
};

module.exports = iHuyi;
