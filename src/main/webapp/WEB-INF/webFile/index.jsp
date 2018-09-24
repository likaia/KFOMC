<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
<script src="jquery/jquery-3.3.1.min.js "></script>
     <jsp:include page="islogin.jsp"/>
  </head>
  
  <body>
    	
  </body>
</html>
