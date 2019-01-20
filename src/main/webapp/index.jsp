<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>导出测试</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<script type="text/javascript" src="jquery/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="js/LkCommon.js"></script>
</head>
<body>
	<button id="exportBtn">导出</button>
	<button id="testBtn">测试</button>
	<script type="text/javascript">
		/*post请求下载文件
		 * options:{
		 * url:'',  //下载地址
		 * data:{name:value}, //要发送的数据
		 * method:'post'
		 * }
		 */
		var postDownLoadFile = function(options) {
			var config = $.extend(true, {
				method : 'post'
			}, options);
			var $iframe = $('<iframe id="down-file-iframe" />');
			var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
			$form.attr('action', config.url);
			for (var key in config.data) {
				$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
			}
			$iframe.append($form);
			$(document.body).append($iframe);
			$form[0].submit();
			$iframe.remove();
		}
		$("#exportBtn").click(function() {
			var req = {};
			req.operator = "李凯";
			postDownLoadFile({
				url : 'servlet/ExportExcelAPI',
				data : req,
				method : 'post'
			});
		});
		$("#testBtn").click(function(){
			var req = {};
			req.operator = "李凯";
			Af.rest("adnroidPostExportAPI.api",req,function(ans){
				Af.trace(ans);
			});
		});
	</script>
</body>

</html>
