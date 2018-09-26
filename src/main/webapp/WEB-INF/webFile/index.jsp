<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>首页</title>
    <%--引入jQuery --%>
     <script src="jquery/jquery-3.3.1.min.js"></script>
     <%--头像裁减 --%>
     <link rel="stylesheet" href="jquery/jquery.Jcrop.css">
    <script src="jquery/jquery.Jcrop.js"></script>
    <%--引入Vue --%>
     <script src="vue/vue.min.js"></script>
     <%--引入Layer --%>
    <script type="text/javascript" src="layer/layer.js"></script>
   <%--引入Layui --%> 
    <script src="layui/layui.js"></script>
    <%--引入Layui --%>
    <link rel="stylesheet" href="layui/css/layui.css">
    <%-- 引入工具类--%>
    <script src="js/LkCommon.js"></script>
    <%--当前页面布局与交互文件 --%>
    <script src="js/index.js"></script>
    <link rel="stylesheet" href="css/index.css">
    <%--引入字体库 --%>
    <link rel="stylesheet" href="font/iconfont.css">
      <jsp:include page="islogin.jsp"></jsp:include>
  </head>
       
  <body>
  </body>
</html>
