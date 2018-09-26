<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
	<%
     //取得session对象
          HttpSession hs = request.getSession();
          //从session会话里取得user值
          String nowUser = (String)hs.getAttribute("nowUser");
        if(nowUser==null)
        {
     	   	%>
			<jsp:forward page="login.jsp"/>
		<%
        }

 %>


