$(function() {
	var URL = "https://www.kaisir.cn/";
	var MAIN = {};
	/*用户名输入失去焦点*/
	$("#userNameInput").change(function(){
		var userName = $("#userNameInput").val();
		 MAIN.AvatarReadingFun(userName);
	});
	/*登录按钮事件*/
	$("#loginBtn").click(function(){
		var userName = $("#userNameInput").val();
		 var  passWord = $("#passwordInp").val();
		 MAIN.loginFun(userName,passWord,MAIN.loginVerification);
	});
	/*注册链接点击事件*/
	$("#SignLink").click(function(){
		MAIN.SignFun();
	});
	/*注册按钮点击事件*/
	$("#SignBtn").click(function(){
		var cellPhone = $("#signCellPhoneInput").val();
		var userName = $("#signUserNameInput").val();
		var passWord = $("#signPassWordInput").val();
		var codeInput = $("#codeInput").val();
		MAIN.registeredFun(cellPhone,userName,passWord,codeInput);
	});
	//登录函数
	 MAIN.loginFun = function(userName,passWord,loginVerification)
{
		//判断用户名或者密码是否为空
			if (userName == "" ||passWord == "" || !loginVerification) {
				if (!userName) {
					$('#userNameInputPanel').css({"border-color":"red"});
					$('#userNameInput').attr('placeholder',"用户名不能为空");
				} else {
					$('#userNameInputPanel').css({"border-color":"white"});
					$('#userNameInput').attr('placeholder',"");
				}
				if (!passWord) {
					$('#passWordInput').css({"border-color":"red"});
					$('#passwordInp').attr('placeholder',"密码不能为空");
				} else {
					$('#passWordInput').css({"border-color":"white"});
					$('#passwordInp').attr('placeholder',"");
				}
				if (!loginVerification) {
					ErroAlert("请完成滑块验证!");
				}
			} else {
				//密码框 用户名框颜色变白
				$('#userNameInputPanel').css({"border-color":"white"});
				$('#passWordInput').css({"border-color":"white"});
				/*向后台发送请求*/
				var req = {};
				req.userName = userName;
				//md5key加密
				md5PassWord = hex_hmac_md5("likai1195419506",passWord);
				req.passWord = md5PassWord;
				Af.rest("KFOMC/loginApi.api", req, function(ans) {
					if (ans.errorCode != 0) {
						ErroAlert(ans.msg);
					} else {
						//登录成功
						layer.msg("登录成功");
						setTimeout(function() {
							window.location.reload();
						}, 1600);
					}
				});
			}
	 };
	//头像读取函数
	 MAIN.AvatarReadingFun = function(userName)
	 {
		var req = {};
		req.userName = userName;
		Af.rest("KFOMC/AvatarQueryApi.api", req, function(ans) {
			if(ans.errorCode!=0)
			{
				$("#avatarImg").attr("src","img/login.png");
				layer.msg(ans.msg);
			}
			else
			{
				$("#avatarImg").attr("src",ans.data.userAvatar);
			}	
		});
	}
	//注册链接点击事件函数
	 MAIN.SignFun = function()
	 {
			$("#SignLink").css({"color":"red"});
			setTimeout(function() {
				$("#SignLink").css({"color":"white"});
			}, 150);
			//让登录消失
			$('#login-panel').animate({
				"top" : '-500px'
			}, 900, function() {
				$("#login-panel").css({
					"display" : "none"
				});
				//让注册显示
				$("#sign-panel").css({"display":"block"});
			});
	 };
	//忘记密码点击事件函数
	 MAIN.forgetPasswordFun = function()
	 {
		 
	 };
	//注册交互函数
	 MAIN.registeredFun = function(cellPhone,userName,passWord,codeInput)
	 {
		//判断用户输入的数据是否为空
			if (cellPhone == "" || userName == "" || passWord == "" || codeInput == "") {
				if (!cellPhone) {
					$('#siginCellPhoneInputPanel').css({"border-color":"red"});
					$('#signCellPhoneInput').attr('placeholder',"手机号不能为空");
				} else {
					$('#siginCellPhoneInputPanel').css({"border-color":"white"});
				}
				if (!userName) {
					$('#signUserNameInputPanel').css({"border-color":"red"});
					$('#signCellPhoneInput').attr('placeholder',"用户名不能为空");
				} else {
					$('#signUserNameInputPanel').css({"border-color":"white"});
				}
				if (!passWord) {
					$('#signPassWordInputPanel').css({"border-color":"red"});
					$('#signPassWordInput').attr('placeholder',"密码不能为空");
				} else {
					$('#signPassWordInputPanel').css({"border-color":"white"});
				}
				if (!codeInput) {
					$('#codeInputPanel').css({"border-color":"red"});
					$('#codeInput').attr('placeholder',"验证码不能为空");
				} else {
					$('#codeInputPanel').css({"border-color":"white"});
				}
			} else {
				$('#siginCellPhoneInputPanel').css({"border-color":"white"});
				$('#signUserNameInputPanel').css({"border-color":"white"});
				$('#signPassWordInputPanel').css({"border-color":"white"});
				$('#codeInputPanel').css({"border-color":"white"});
				//判断验证码是否输入正确
				
				if (codeInput.toLowerCase() == MAIN.verificationCode.toLowerCase()) {
					var req = {};
					req.type = 2;
					req.cellPhone = cellPhone;
					req.userName = userName;
					//md5key加密
					md5PassWord = hex_hmac_md5("likai1195419506",passWord);
					req.passWord = md5PassWord;
					req.cropPicPath = $("#signAvatarImg").attr("src");
					Af.rest("KFOMC/RegisteredApi.api", req, function(ans) {
						if (ans.errorCode == 0) {
							layer.msg("注册成功");
							//刷新当前页面
							window.location.reload();
						} else {
							ErroAlert(ans.msg);
						}
					})
				} else {
					ErroAlert("验证码输入错误!请检查或点击验证码更换!");
				}

			}
	 }
	
	 $("#passWordInput").keypress(function(e) {
		// 回车键事件
		if (e.which == 13) {
			//执行登录方法
			var userName = $("#userNameInput").val();
			 var  passWord = $("#passwordInp").val();
			 MAIN.loginFun(userName,passWord,MAIN.loginVerification);
		}
	});
	/*用户选择本地图片后上传*/
	layui.use('upload', function() {
		var upload = layui.upload;
		//执行实例
		var uploadInst = upload.render({
			elem : '#avatarUpload', //绑定元素
			url : URL + "KFOMC/servlet/UploadAPI", //上传接口
			done : function(ans) {
				//上传完毕回调
				if (ans.errorCode == 0) {
					$("#signAvatarImg").attr("src",ans.userPicPath);
				} else {
					ErroAlert(ans.msg);
				}

			},
			error : function() {
				//请求异常回调
				layer.msg("服务器错误");
			}
		});
	});
	//滑动验证
	$("#sliderPanel").slider({
		width : 371, // width
		height : 50, // height
		color : "#fff", // 文字颜色
		fontSize : 17, // 文字大小
		// 背景颜色
		sliderBg : "rgba(134, 134, 131,0.4)",
		callback : function(result) {
			MAIN.loginVerification = true;
		}
	});
	//错误信息弹出
	function ErroAlert(e) {
		var index = layer.alert(e, {
			icon : 5,
			time : 2000,
			offset : 't',
			closeBtn : 0,
			title : '错误信息',
			btn : [],
			anim : 2,
			shade : 0
		});
		layer.style(index, {
			color : '#777'
		});
	}
	//让浏览器全屏函数
	MAIN.fullScreen  = function(){
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

	//图片验证码
	/**
	 * 验证码
	 * @param {Object} o 验证码长度
	 */
	$.fn.code_Obj = function(o) {
		var _this = $(this);
		var options = {
			code_l : o.codeLength, //验证码长度
			codeChars : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
				'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
				'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
			],
			codeColors : [ '#f44336', '#009688', '#cddc39', '#03a9f4', '#9c27b0', '#5e4444', '#9ebf9f', '#ffc8c4', '#2b4754', '#b4ced9', '#835f53', '#aa677e' ],
			code_Init : function() {
				var code = "";
				var codeColor = "";
				var checkCode = _this.find("#data_code");
				for (var i = 0; i < this.code_l; i++) {
					var charNum = Math.floor(Math.random() * 52);
					code += this.codeChars[charNum];
				}
				for (var i = 0; i < this.codeColors.length; i++) {
					var charNum = Math.floor(Math.random() * 12);
					codeColor = this.codeColors[charNum];
				}
				//验证码赋值
				MAIN.verificationCode = code;
				if (checkCode) {
					checkCode.css('color', codeColor);
					checkCode.className = "code";
					checkCode.text(code);
					checkCode.attr('data-value', code);
				}
			}
		};

		options.code_Init(); //初始化验证码
		_this.find("#data_code").bind('click', function() {
			options.code_Init();
		});
	};
	/**
	 * 验证码
	 * codeLength:验证码长度
	 */
	$('#check-code').code_Obj({
		codeLength : 5
	});

});