<%@page import="com.lk.db.User" %>
<%@page import="org.json.JSONObject" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
+ path + "/";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <base href="<%=basePath%>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>凯枫网络--后台管理</title>
    <%--引入jQuery --%>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <%--头像裁减 --%>
    <link href="https://cdn.bootcss.com/jquery-jcrop/2.0.4/css/Jcrop.min.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery-jcrop/2.0.4/js/Jcrop.min.js"></script>
    <%--引入Vue --%>
    <script src="https://cdn.bootcss.com/vue/2.5.17/vue.min.js"></script>
    <%--引入jquery打印插件 --%>
    <script type="text/javascript" src="jquery/jquery.jqprint-0.3.js"></script>
    <script>
        jQuery.browser = {};
        (function () {
            jQuery.browser.msie = false;
            jQuery.browser.version = 0;
            if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
                jQuery.browser.msie = true;
                jQuery.browser.version = RegExp.$1;
            }
        })();
    </script>
    <%--引入Layer --%>
    <script src="https://cdn.bootcss.com/layer/2.3/layer.js"></script>
    <link href="https://cdn.bootcss.com/layer/2.3/skin/layer.css" rel="stylesheet">
    <!--Bootstrap.min css-->
    <link rel="stylesheet" href="assets/plugins/bootstrap/css/bootstrap.min.css">
    <!--图标 css-->
    <link rel="stylesheet" href="assets/css/icons.css">
    <!--顶部导航 css-->
    <link rel="stylesheet" href="assets/css/style.css">
    <!--自定义滚动条 css-->
    <link rel="stylesheet" href="assets/plugins/scroll-bar/jquery.mCustomScrollbar.css">
    <!--侧菜单 css-->
    <link rel="stylesheet" href="assets/plugins/toggle-menu/sidemenu.css">
    <!--当前页面布局与交互文件 -->
    <script src="assets/js/index.js"></script>
    <link rel="stylesheet" href="assets/css/index.css">
    <%--引入Layui --%>
    <script src="layui/layui.js"></script>
    <link rel="stylesheet" href="layui/css/layui.css">
    <!--md5加密需要-->
    <script src="assets/crypto-js/core.js"></script>
    <script src="assets/crypto-js/md5.js"></script>
    <script src="assets/crypto-js/evpkdf.js"></script>
    <script src="assets/crypto-js/enc-base64.js"></script>
    <script src="assets/crypto-js/cipher-core.js"></script>
    <script src="assets/crypto-js/aes.js"></script>
    <script src="assets/crypto-js/hmac.js"></script>
    <script src="assets/crypto-js/sha1.js"></script>
    <script src="assets/crypto-js/sha256.js"></script>
    <script src="assets/js/LkCommon.js"></script>
    <script src="assets/js/imageCompression.js"></script>
    <%-- 引入工具类--%>
    <script src="js/LkCommon.js"></script>
    <!--图片压缩上传-->
    <script src="js/imageCompression.js"></script>
    <%--网页加载进度条插件 --%>
    <link rel="stylesheet" href="nprogress/nprogress.css">
    <script src="nprogress/nprogress.js"></script>
    <%--106监听 --%>
    <script src="js/LkTableupdate-min.js"></script>
    <%--打印模板样式 --%>
    <link rel="stylesheet" href="css/Preview.css">
    <%--银行卡归属地查询 --%>
    <script src="js/bankCardAttribution-min.js"></script>
    <!--favicon-->
    <link rel="shortcut icon" href="https://www.kaisir.cn/icon/favicon.ico">
    <%--
    <jsp:include page="islogin.jsp"></jsp:include>
    --%>
    <!--标签打印样式-->
    <link rel="stylesheet" href="css/tagPrint.css">
    <%--扩展函数库 --%>
    <script src="assets/js/underscore-min.js"></script>
    <!--二维码生成工具-->
    <script src="js/qrCode/qrcode.min.js"></script>
    <%--赋值到剪切版工具--%>
    <!--<script src="js/clipboard/clipboard.min.js"></script>-->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
    <%--获取当前用户信息 --%>
    <%-- <%
    //取得session对象
    HttpSession hs = request.getSession();
    String Version = (String) hs.getAttribute("Version");
    String nickName = (String) hs.getAttribute("nickName");
    String avatarUrl = (String) hs.getAttribute("avatarUrl");
    String sysUseAuthority = (String) hs.getAttribute("sysUseAuthority");
    %> --%>

</head>

<body class="app">
<div id="spinner"></div>
<div id="app">
    <div class="main-wrapper">
        <!--顶部功能栏-->
        <nav class="navbar navbar-expand-lg main-navbar" id="nav-panel">
            <a class="header-brand" href="javascript:;">
                <img src="assets/img/brand/logo.png" class="header-brand-img" alt="KFOMC logo">
            </a>
            <form class="form-inline mr-auto">
                <ul class="navbar-nav mr-3">
                    <!--点击收缩-->
                    <!--<li><a href=" javascript:;" data-toggle="sidebar" class="nav-link nav-link-lg"><i
                            class="ion ion-navicon-round"></i></a></li>-->
                    <li><a href=" javascript:;"  class="nav-link nav-link-lg d-md-none navsearch"><i
                            class="ion ion-search"></i></a></li>
                </ul>
                <div class="search-element">
                    <input class="form-control" type="search" placeholder="搜索订单、客户名称" aria-label="Search">
                    <button @click="orderSearchFun" type="button" class="btn btn-primary"><i class="ion ion-search"></i></button>
                </div>
            </form>
            <ul class="navbar-nav navbar-right">
                <!--客户留言-->
                <li class="dropdown dropdown-list-toggle">
                    <a id="clientMessagesPanel" href="javascript:;" data-toggle="dropdown"
                       class="nav-link notification-toggle nav-link-lg beep">
                        <i class="ion-ios-email-outline"></i>
                    </a>
                    <div class="dropdown-menu dropdown-list dropdown-menu-right">
                        <div class="dropdown-header">客户留言
                            <div class="float-right">
                                <a href="javascript:;" @click="viewClientAllFun">查看全部</a>
                            </div>
                        </div>
                        <div class="dropdown-list-content">
                            <a href=" javascript:;" class="dropdown-item dropdown-item-unread">
                                <img alt="image" src="assets/img/avatar/avatar-1.png"
                                     class="rounded-circle dropdown-item-img">
                                <div class="dropdown-item-desc">
                                    <div class="dropdownmsg d-flex">
                                        <div class="">
                                            <b>康宁玻璃厂</b>
                                            <p>老板,您好,现在镀膜中空价格是多少?</p>
                                        </div>
                                        <div class="time">6小时前</div>
                                    </div>

                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item dropdown-item-unread">
                                <img alt="image" src="assets/img/avatar/avatar-2.jpeg.jpg"
                                     class="rounded-circle dropdown-item-img">
                                <div class="dropdown-item-desc">
                                    <div class="dropdownmsg d-flex">
                                        <div class="">
                                            <b>永兴玻璃装饰</b>
                                            <p>老板,你好,现在中空玻璃还有货没?</p>
                                        </div>
                                        <div class="time">45分钟前</div>
                                    </div>
                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item">
                                <img alt="image" src="assets/img/avatar/avatar-4.jpeg"
                                     class="rounded-circle dropdown-item-img">
                                <div class="dropdown-item-desc">
                                    <div class="dropdownmsg d-flex">
                                        <div class="">
                                            <b>德胜装饰</b>
                                            <p>老板您好,我的订单什么时候发货?</p>
                                        </div>
                                        <div class="time">8小时前</div>
                                    </div>
                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item">
                                <img alt="image" src="assets/img/avatar/avatar-3.jpeg.jpeg"
                                     class="rounded-circle dropdown-item-img">
                                <div class="dropdown-item-desc">
                                    <div class="dropdownmsg d-flex">
                                        <div class="">
                                            <b>勇盈装饰</b>
                                            <p>老板,您好,我的这个订单还剩多少玻璃没发货?</p>
                                        </div>
                                        <div class="time">3小时前</div>
                                    </div>
                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item">
                                <img alt="image" src="assets/img/avatar/avatar-5.jpeg.jpeg"
                                     class="rounded-circle dropdown-item-img">
                                <div class="dropdown-item-desc">
                                    <div class="dropdownmsg d-flex">
                                        <div class="">
                                            <b>王先生</b>
                                            <p>老板,您好,这个账单不对,您能帮我核实下吗?</p>
                                        </div>
                                        <div class="time">15分钟前</div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </li>
                <!--系统通知-->
                <li class="dropdown dropdown-list-toggle">
                    <a href=" javascript:;" data-toggle="dropdown" class="nav-link  nav-link-lg beep" id="SysMsgPanel">
                        <i class="ion-ios-bell-outline"></i>
                    </a>
                    <div class="dropdown-menu dropdown-list dropdown-menu-right">
                        <div class="dropdown-header">系统通知
                            <div class="float-right">
                                <a href="javascript:;" @click="viewSysMsgAllFun">查看全部</a>
                            </div>
                        </div>
                        <div class="dropdown-list-content">
                            <a href=" javascript:;" class="dropdown-item">
                                <i class="fa fa-users text-primary"></i>
                                <div class="dropdown-item-desc">
                                    <b>您正在使用的系统为体验版</b>
                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item">
                                <i class="fa fa-exclamation-triangle text-danger"></i>
                                <div class="dropdown-item-desc">
                                    <b>订单预警:您有一个订单,今天为最后期限....</b>
                                </div>
                            </a>
                            <a href=" javascript:;" class="dropdown-item">
                                <i class="fa fa-comment text-primary"></i>
                                <div class="dropdown-item-desc">
                                    <b>其他消息</b>
                                    <div class="float-right"><span
                                            class="badge badge-pill badge-danger badge-sm">67</span></div>
                                </div>
                            </a>
                        </div>
                    </div>
                </li>
                <!--全屏-->
                <li class="dropdown dropdown-list-toggle">
                    <a href=" javascript:;" class="nav-link nav-link-lg full-screen-link">
                        <i class="ion-arrow-expand" id="fullscreen-button"></i>
                    </a>
                </li>
                <!--头像模块-->
                <li class="dropdown"><a href=" javascript:;" data-toggle="dropdown"
                                        class="nav-link dropdown-toggle nav-link-lg">
                    <!--头像地址-->
                    <img src="assets/img/avatar/avatar-1.png" alt="profile-user" class="rounded-circle w-32">
                    <!--用户名称-->
                    <div class="d-sm-none d-lg-inline-block">系统管理员</div>
                </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <!--profile.html-->
                        <a @click="systemVersionFun" href="javascript:;" class="dropdown-item has-icon">
                            <i class="ion ion-android-person"></i> 体验版
                        </a>
                        <a @click="systemSettingsFun" href="javascript:;" class="dropdown-item has-icon">
                            <i class="ion ion-gear-a"></i> 系统设置
                        </a>
                        <a @click="exitSystemFun" href="javascript:;" class="dropdown-item has-icon">
                            <i class="ion-ios-redo"></i> 退出系统
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
        <!--侧边导航栏-->
        <aside class="app-sidebar">
            <div class="app-sidebar__user">
                <div class="dropdown" id="orderCustomerPanel">
                    <div class="item-panel">
                        <div class="Icon-panel">
                            <img src="assets/img/sideMenu/top_1.png" height="200" width="200"/>
                        </div>
                        <div class="Text-panel">
                            <span>订单管理</span>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="Icon-panel">
                            <img src="assets/img/sideMenu/top_2.png" height="200" width="200"/>
                        </div>
                        <div class="Text-panel">
                            <span>客户管理</span>
                        </div>
                    </div>
                </div>
            </div>
            <ul class="side-menu" id="sideMenu">
                <li class="slide">
                    <div class="tip_bg">
                        <div class="LiteralPanel">
                            <span class="side-menu__label">管理</span>
                        </div>
                    </div>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href="javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_1.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">进货管理</span>
                    </a>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href="javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_2.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">出货管理</span>
                    </a>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_3.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">库存报表</span>
                    </a>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_4.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">考勤管理</span>
                    </a>
                </li>
                <li class="slide">
                    <div class="tip_bg">
                        <div class="LiteralPanel">
                            <span class="side-menu__label">基础信息</span>
                        </div>
                    </div>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_5.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">原片信息</span>
                    </a>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_6.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">配件信息</span>
                    </a>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon"><img src="assets/img/sideMenu/side_icon_7.png" height="48"
                                                        width="48"/></i>
                        <span class="side-menu__label">供应商信息</span>
                    </a>
                </li>
                <li class="slide">
                    <div class="tip_bg">
                        <div class="LiteralPanel">
                            <span class="side-menu__label">设置</span>
                        </div>
                    </div>
                </li>
                <li class="slide">
                    <a class="side-menu__item" data-toggle="slide" href=" javascript:;">
                        <i class="side-menu__icon fa"><img src="assets/img/sideMenu/setting_img.png"/></i>
                        <span class="side-menu__label">系统设置</span>
                    </a>
                </li>
            </ul>
        </aside>
        <!--正文部分-->
        <div class="app-content" id="vue-panel" v-cloak>
            <section class="section" id="mainBodyPanel">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href=" javascript:;">订单管理</a></li>
                    <li class="breadcrumb-item active" aria-current="page">页面1</li>
                </ol>
                <!--支出报表 收入报表 员工考勤分析 tab切换-->
                <div class="row">
                    <div class="nav-panel">
                        <ul id="navBar">
                            <li class="active"><a href="javascript:void(0)">支出报表</a></li>
                            <li><a href="javascript:void(0)">收入报表</a></li>
                            <li><a href="javascript:void(0)">员工考勤分析</a></li>
                        </ul>
                    </div>
                </div>
                <!--根据条件查询切换卡-->
                <div class="row">
                    <ul id="timeNav">
                        <li class="active"><span>今天</span></li>
                        <li><span>昨天</span></li>
                        <li><span>最近七天</span></li>
                        <li><span>本月</span></li>
                        <li><span>其他</span></li>
                    </ul>
                    <div class="right-panel">
                        <span class="tips-panel">支出总额:</span>
                        <span class="val-panel">读取中...</span>
                    </div>
                </div>
                <!--折线图区域-->
                <div class="row">
                    <div class="lineChart-panel" id="outlayChart">

                    </div>
                </div>
                <!--表格区域-->
                <div class="row">
                    <div class="BottomTable-panel">
                        <table id="expenditureInfoList" lay-filter="expenditureInfoList"></table>
                    </div>
                </div>
            </section>
        </div>

        <footer class="main-footer">
            <div class="text-center">
                Copyright &copy;2018-2019 陕西省凯枫网络科技有限公司 版权所有 陕ICP备18013752号-1</a>
            </div>
        </footer>

    </div>
</div>
<%-- 新页面需要的文件 --%>

<!--Bootstrap.min js-->
<script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
<!--自定义滚动条 js-->
<script src="assets/plugins/scroll-up-bar/dist/scroll-up-bar.min.js"></script>
<script src="assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js"></script>
<!--侧滑菜单 页面加载时显示侧边栏的样式，点击按钮切换侧边栏状态-->
<!--<script src="assets/plugins/toggle-menu/sidemenu.js"></script>-->
<!--页面正常加载需要的 js-->
<script src="assets/js/scripts.js"></script>
<script src="assets/js/apexcharts.js"></script>
<!--ECharts-->
<script src="https://cdn.bootcss.com/echarts/4.2.1-rc1/echarts.min.js"></script>
<%-- 新页面需要的文件 --%>

</body>
</html>