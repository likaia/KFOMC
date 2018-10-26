<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
<title>登录</title>
<base href="<%=basePath%>">
<script src="jquery/jquery-3.3.1.min.js "></script>
<%-- 滑动验证 --%>
<script src="jquery/jquery.slider.min.js"></script>
<link rel="stylesheet" href="jquery/jquery.slider.css">
<%-- 引入md5 --%>
<script src="js/md5.js"></script>
<script type="text/javascript" src="layer/layer.js"></script>
<script src="layui/layui.js"></script>
<link rel="stylesheet" href="layui/css/layui.css">
<script src="js/LkCommon.js"></script>
<link rel="stylesheet" href="css/login.css">
<script src="js/Login.js"></script>
<!-- 百度验证 -->
<meta name="baidu-site-verification" content="JwUB1mxjFy" />
<link rel="shortcut icon" href="https://www.kaisir.cn/icon/favicon.ico">
</head>
<body>
	<%-- 登录--%>
	<div class="dowebok" id="login-panel">
		<!--头像-->
		<div class="avatar-panel">
			<img src="img/login.png" alt="" id="avatarImg">
		</div>
		<!--用户名-->
		<div class="form-item" id="userNameInputPanel">
			<div class="img-panel"></div>
			<div class="input-panel" id="">
				<input id="userNameInput" maxlength="10" type="text" autocomplete="on" class="layui-input" >
			</div>
		</div>
		<!--滑块验证-->
		<div class="slider-panel">
			<div id="sliderPanel" class="slider-panel"></div>
		</div>
		<!--密码-->
		<div id="passWordInput" class="form-item">
			<div class="img-panel password-panel"></div>
			<div class="input-panel">
				<input id="passwordInp" maxlength="14" type="password" autocomplete="on"
					class="layui-input">
			</div>
		</div>
		<!--登录-->
		<div class="form-item" style="border: none">
			<button id="loginBtn" class="layui-btn layui-btn-radius layui-btn-normal layui-btn-fluid">登录</button>
		</div>
		<!--立即注册 忘记密码-->
		<div class="reg-bar">
			<div class="registered-link-panel">
				<a href="javascript:;" id="SignLink">立即注册</a>
			</div>
			<div class="forget-link-panel">
				<a href="javascript:;">忘记密码</a>
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
				<input  id="signCellPhoneInput" placeholder="请输入手机号" type="text" maxlength="11"
					autocomplete="on" class="layui-input">
			</div>
		</div>
		<!--用户名-->
		<div class="form-item" id="signUserNameInputPanel">
			<div class="img-panel"></div>
			<div class="input-panel">
				<input id="signUserNameInput" placeholder="请输入用户名"maxlength="10" type="text"
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
</body>
</html>