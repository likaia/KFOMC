<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
    <title>凯枫网络-后台登录</title>
    <base href="<%=basePath%>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <%-- 滑动验证 --%>
    <script src="jquery/jquery.slider.min.js"></script>
    <link rel="stylesheet" href="jquery/jquery.slider.css">
    <%-- 引入md5 --%>
    <script src="js/md5.js"></script>
    <script src="https://cdn.bootcss.com/layer/2.3/layer.js"></script>
    <link href="https://cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet">
    <script src="layui/layui.js"></script>
    <link rel="stylesheet" href="layui/css/layui.css">
    <script src="js/LkCommon.js"></script>
    <link rel="stylesheet" href="css/login.css">
    <script src="js/Login.js"></script>
    <%--网页加载进度条插件 --%>
    <link rel="stylesheet" href="nprogress/nprogress.css">
    <script src="nprogress/nprogress.js"></script>
    <link rel="shortcut icon" href="https://www.kaisir.cn/icon/favicon.ico">
    <%--新的登录界面样式引入--%>
    <meta name="keywords" content="" />
    <meta name="description" content=""/>
    <link href="https://cdn.bootcss.com/twitter-bootstrap/4.2.1/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="fonts/iconic/css/material-design-iconic-font.min.css">
    <link rel="stylesheet" type="text/css" href="css/util.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
</head>
<body>
<%-- 登录--%>
<div class="limiter" id="login-panel">
    <div class="container-login100" style="background-image: url('img/bg-01.jpg');">
        <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
            <form class="login100-form validate-form">
					<span>
                        <!--头像-->
                        <div class="avatar-panel">
                            <img src="img/login.png" alt="" id="avatarImg">
                        </div>
					</span>
                <div class="wrap-input100 validate-input m-b-23" data-validate="请输入用户名">
                    <span class="label-input100">用户名</span>
                    <input class="input100" id="userNameInput" maxlength="10" type="text" placeholder="请输入用户名" autocomplete="off">
                    <span class="focus-input100" data-symbol="&#xf206;"></span>
                </div>
                <div id="sliderPanelParent" class="wrap-input100 m-b-23">
                    <span class="label-input100">滑块验证</span>
                    <div class="slider-panel">
                        <div id="sliderPanel" style="margin-top: 7px" class="slider-panel"></div>
                    </div>
                </div>
                <div class="wrap-input100 validate-input"  data-validate="请输入密码">
                    <span class="label-input100">密码</span>
                    <input class="input100" type="password" id="passwordInp" maxlength="14" placeholder="请输入密码" autocomplete="off">
                    <span class="focus-input100" data-symbol="&#xf190;"></span>
                </div>

                <div class="text-right p-t-8 p-b-31">
                    <a href="javascript:">忘记密码？</a>
                </div>

                <div>
                    <div class="wrap-login100-form-btn">
                        <div class="login100-form-bgbtn"></div>
                        <button id="loginBtn" class="login100-form-btn">登 录</button>
                    </div>
                </div>

                <div class="txt1 text-center p-t-54 p-b-20">
                    <span>第三方登录</span>
                </div>

                <div class="flex-c-m">
                    <a href="javascript:;" class="login100-social-item bg1" id="wechatPanel">
                        <i class="fa fa-wechat"></i>
                    </a>

                    <a href="javascript:;" class="login100-social-item bg2" id="qqPanel">
                        <i class="fa fa-qq"></i>
                    </a>

                    <a href="javascript:;" class="login100-social-item bg3" id="cellPhonePanel">
                        <i class="layui-icon layui-icon-cellphone" style="font-size: 30px; color: #ffffff;"></i>
                    </a>
                </div>

                <div class="flex-col-c p-t-25">
                    <a href="javascript:" class="txt2" id="SignLink">立即注册</a>
                </div>
            </form>
        </div>
    </div>
</div>
<!--注册-->
<div class="dowebok" id="sign-panel" style="display:none">
    <!--头像-->
    <div id="avatarUpload" class="avatar-panel">
        <img id="signAvatarImg" src="img/upload.png" alt="">
    </div>
    <!--手机号-->
    <div class="form-item" id="siginCellPhoneInputPanel">
        <div class="img-panel cellPhone-panel"></div>
        <div class="input-panel">
            <input id="signCellPhoneInput" placeholder="请输入手机号" type="text" maxlength="11"
                   autocomplete="on" class="layui-input">
        </div>
    </div>
    <!--用户名-->
    <div class="form-item" id="signUserNameInputPanel">
        <div class="img-panel"></div>
        <div class="input-panel">
            <input id="signUserNameInput" placeholder="请输入用户名" maxlength="10" type="text"
                   autocomplete="on" class="layui-input">
        </div>
    </div>
    <!--密码-->
    <div class="form-item" id="signPassWordInputPanel">
        <div class="img-panel password-panel"></div>
        <div class="input-panel">
            <input id="signPassWordInput" placeholder="请输入密码" maxlength="14" type="password" autocomplete="on"
                   class="layui-input">
        </div>
    </div>
    <!--图文验证码-->
    <div class="VerificationCode-panel">
        <div class="codeImg-panel">
            <div id="check-code" style="overflow: hidden;">
                <div class="code" id="data_code"></div>
            </div>
        </div>
        <div class="input-panel" id="codeInputPanel">
            <input placeholder="请输入左侧验证码" id="codeInput" type="text" style="" autocomplete="off"
                   class="layui-input" maxlength="5">
        </div>
    </div>
    <!--注册-->
    <div class="form-item" style="border: none">
        <button class="layui-btn layui-btn-radius layui-btn-normal layui-btn-fluid" id="SignBtn">注册</button>
    </div>
</div>
<!-- 加载动画悬浮层 -->
<div id="Animation-loading">
    <section>
        <div class="loader loader-1">
            <div class="loader-outter"></div>
            <div class="loader-inner"></div>
        </div>
    </section>
</div>
<script src="js/main.js"></script>
</body>
</html>