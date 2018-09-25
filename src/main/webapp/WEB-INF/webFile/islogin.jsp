<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html>
  <head>
	<%
     //取得session对象
          HttpSession hs = request.getSession();
          //从session会话里取得user值
          String user = (String)hs.getAttribute("user");
        if(user==null)
        {
        	System.out.println(user);
     	   	%>
			<jsp:forward page="login.jsp"/>
		<%
        }

 %>

  </head>
  
  <body>

  </body>
</html>
