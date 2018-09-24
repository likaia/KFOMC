<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
  </head>
  
  <body>
<script type="text/javascript">
$(function(){
    	//当前session会话里的用户权限
      	var USER = <%= com.lk.jsp.JspSession.getString(request, "user", "") %>;
	    var ROLE = <%= com.lk.jsp.JspSession.getString(request, "role", "") %>;
    })

</script>
  </body>
</html>
