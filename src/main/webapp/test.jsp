<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>">

<title>测试</title>
<script src="js/LkCommon.js"></script>
<script src="jquery/jquery-3.3.1.min.js "></script>

</head>
     <jsp:include page="header.jsp"/>
<body>
	<script type="text/javascript">
		/*向后台发送请求*/
		var req = {};
		req.userName = "李凯";
		req.passWord = "dc10a052aff4c8e78d4ce382af40c8ce";
		Af.rest("KFOMC/loginApi.api", req, function(ans) {
			if (ans.errorCode != 0) {
				
			} else {
		
			}
		});
	</script>
</body>
</html>
