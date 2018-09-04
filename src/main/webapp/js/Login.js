$(function () {
    //实例化vue
    var vm = new Vue({
        //绑定的元素
        el: '#login-panel',
        //数据
        data: {
            //用户名 密码 (数据的双向绑定:v-model)
            userName:"",
            passWord:"",
            showUserErr:false,
            showPsddErr:false,
            BtnBg:"#FFFFFF",
            btnColor:"#396C4E",
            userTipVal:"用户名错误相关提示",
            psddTipVal:"密码错误相关提示"
        },
        methods: {
            //登录函数
            loginFun:function () {
                var that = this;
                //改变按钮背景颜色 字体颜色
                this.BtnBg = "#688F93";
                this.btnColor = "white";
                setTimeout(function () {
                    that.BtnBg = "#FFFFFF";
                    that.btnColor = "#396C4E";
                },150);
                //判断用户名或者密码是否为空
                if(!this.userName)
                {
                    this.showUserErr = true;
                    this.userTipVal = "用户名不能为空"
                }
                else{
                    this.showUserErr = false;
                }
                if(!this.passWord)
                {
                    this.showPsddErr = true;
                    this.psddTipVal = "密码不能为空"
                }
                else
                {
                    this.showPsddErr = false;
                }
                if(this.userName==""||this.passWord=="")
                {

                }
                else {
                    fullScreen();
                    /*向后台发送请求*/
              var req = {};
                    req.userName = this.userName;
                    req.passWord = this.passWord;
                    Af.rest("KFOMC/loginApi.api",req,function (ans) {
                        console.log("后台返回数据:")
                        console.log(ans);
                        if(ans.errorCode!=0)
                        {
                            ErroAlert(ans.msg);
                        }
                        else {
                            //登录成功
                            layer.msg("登录成功");
                        }
                    });
                }



            }
        }
    });
    //错误信息弹出
    function ErroAlert(e) {
        var index = layer.alert(e, { icon: 5, time: 2000, offset: 't', closeBtn: 0, title: '错误信息', btn: [], anim: 2, shade: 0 });
        layer.style(index, {
            color: '#777'
        });
    }

    //让浏览器全屏函数
    function fullScreen() {
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
            el.mozRequestFullScreen || el.msRequestFullScreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
            //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    });