<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
<script src="jquery/jquery-3.3.1.min.js "></script>
<jsp:include page="islogin.jsp"></jsp:include>
  </head>
  
  <body>
	你好，欢迎进入世界！
  </body>
</html>
