<%@page import="com.lk.db.User" %>
<%@page import="org.json.JSONObject" %>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
+ path + "/";
%>
<!DOCTYPE html>
<html>
<head>
    <base href="<%=basePath%>">
    <title>凯枫网络</title>
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
    <%--引入Layui --%>
    <script src="layui/layui.js"></script>
    <link rel="stylesheet" href="layui/css/layui.css">
    <!--加密需要-->
    <script src="crypto-js/core.js"></script>
    <script src="crypto-js/md5.js"></script>
    <script src="crypto-js/evpkdf.js"></script>
    <script src="crypto-js/enc-base64.js"></script>
    <script src="crypto-js/cipher-core.js"></script>
    <script src="crypto-js/aes.js"></script>
    <script src="crypto-js/hmac.js"></script>
    <script src="crypto-js/sha1.js"></script>
    <script src="crypto-js/sha256.js"></script>
    <%-- 引入工具类--%>
    <script src="js/LkCommon.js"></script>
    <!--图片压缩上传-->
    <script src="js/imageCompression.js"></script>
    <%--网页加载进度条插件 --%>
    <link rel="stylesheet" href="nprogress/nprogress.css">
    <script src="nprogress/nprogress.js"></script>
    <%--当前页面布局与交互文件 --%>
    <script src="js/index.js"></script>
    <link rel="stylesheet" href="css/index.css">
    <%--106监听 --%>
    <script src="js/LkTableupdate-min.js"></script>
    <%--打印模板样式 --%>
    <link rel="stylesheet" href="css/Preview.css">
    <%--引入字体库 --%>
    <link rel="stylesheet" href="font/iconfont.css">
    <%--银行卡归属地查询 --%>
    <script src="js/bankCardAttribution-min.js"></script>
    <link rel="shortcut icon" href="https://www.kaisir.cn/icon/favicon.ico">
    <jsp:include page="islogin.jsp"></jsp:include>
    <!--标签打印样式-->
    <link rel="stylesheet" href="css/tagPrint.css">
    <%--扩展函数库 --%>
    <script src="js/underscore-min.js"></script>
    <!--二维码生成工具-->
    <script src="js/qrCode/qrcode.min.js"></script>
    <%--赋值到剪切版工具--%>
    <!--<script src="js/clipboard/clipboard.min.js"></script>-->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>
    <%--获取当前用户信息 --%>
    <%
    //取得session对象
    HttpSession hs = request.getSession();
    String Version = (String) hs.getAttribute("Version");
    String nickName = (String) hs.getAttribute("nickName");
    String avatarUrl = (String) hs.getAttribute("avatarUrl");
    String sysUseAuthority = (String) hs.getAttribute("sysUseAuthority");
    %>
</head>
<body>
<div id="vue-panel" v-cloak>
    <div class="layui-layout layui-layout-admin">
        <!--头部区域-->
        <div class="layui-header" style="min-height: 80px"
             v-bind:style="{background:headerBgColor}">
            <div id="top" v-bind:style="{background:headerBgColor}">
                <input id="orderLinks" value="">
                <!--logo区域-->
                <div class="logoInfo-panel">
                    <div class="logo-panel">
                        <img v-bind:src="logoImg" alt="">
                    </div>
                    <div class="text-panel">
                        <span>佰益中空玻璃企业管理系统</span>
                    </div>
                </div>
                <!--用户信息-->
                <div class="MaterialInfo-panel">
                    <!--系统消息模块-->
                    <div class="Sysmsg-panel">
                        <!--图标-->
                        <div class="ico-panel">
                            <i class="layui-icon layui-icon-notice"
                               style="font-size: 30px;color: white"></i>
                        </div>
                        <div class="num-panel">
                            <span>{{msgNum}}</span>
                        </div>
                    </div>
                    <!--系统使用帮助模块-->
                    <div class="SysUseHelp-panel">
                        <span>系统使用帮助</span>
                    </div>
                    <!--用户个人资料模块-->
                    <div class="userInfo-panel" @click="materialFun">
                        <div class="avatar-panel">
                            <img src="<%=avatarUrl%>" alt="">
                        </div>
                        <div class="nickName-panel">
                            <span id="nickNameTextPanel"><%=nickName%></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--左侧导航栏 layui距离上边默认为60-->
        <div class="layui-side" style="top: 80px;"
             v-bind:style="{background:navColor}">
            <div class="layui-side-scroll">
                <div class="nav" v-bind:style="{background:navColor}">
                    <div class="nav-top">
                        <div id="mini"
                             style="border-bottom:1px solid rgba(255,255,255,.1)">
                            <img src="img/mini.png">
                        </div>
                    </div>
                    <ul>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-jinhuo"></i><span>进销存管理</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="IncomingGoodsFun"><a href="javascript:;"><span>进货管理</span></a></li>
                                <li @click="shipmentFun"><a href="javascript:;"><span>出货管理</span></a></li>
                                <li @click="stockFun"><a href="javascript:;"><span>库存管理</span></a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-dingdandaifukuan"></i><span>订单管理</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="OrderInfoFun"><a href="javascript:;"><span>所有订单</span></a></li>
                                <li @click="OrderMonthlyFun"><a href="javascript:;"><span>已完成订单</span></a></li>
                            </ul>
                        </li>

                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-caiwuguanli"></i><span>财务管理</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="revenueInfoFun"><a href="javascript:;"><span>收入管理</span></a></li>
                                <li @click="expenditureInfoLFun"><a href="javascript:;"><span>支出管理</span></a></li>
                                <li @click="financeReportFun"><a href="javascript:;"><span>财务报表</span></a></li>
                                <li @click="reconciliationFun"><a href="javascript:;"><span>客户对账</span></a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-tongjibaobiao"></i><span>统计报表</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="customerTrendFun"><a href="javascript:;"><span>客户趋势报表</span></a></li>
                                <li @click="orderTrendFun"><a href="javascript:;"><span>订单趋势报表</span></a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-yuangongguanli"></i><span>员工管理</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="AttendanceInfoFun"><a href="javascript:;"><span>考勤管理</span></a></li>
                                <li @click="salaryGivingFun"><a href="javascript:;"><span>工资发放</span></a></li>
                                <li @click="employeeInfoFun"><a href="javascript:;"><span>员工信息</span></a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-jichuxinxi"></i><span>基础信息</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="CustomerInfoFun"><a href="javascript:;"><span>客户信息</span></a></li>
                                <li @click="OriginalInfoFun"><a href="javascript:;"><span>原片信息</span></a></li>
                                <li @click="AttachmentInfoFun"><a href="javascript:;"><span>配件信息</span></a></li>
                                <li @click="SupplierFun"><a href="javascript:;"><span>供应商信息</span></a></li>
                            </ul>
                        </li>
                        <li class="nav-item"><a href="javascript:;"><i
                                class="my-icon nav-icon iconfont icon-xitong"></i><span>系统设置</span><i
                                class="my-icon nav-more iconfont icon-arrow-right"></i></a>
                            <ul>
                                <li @click="basicSettingsFun"><a href="javascript:;"><span>基本设置</span></a></li>
                                <li @click="contactUsFun"><a href="javascript:;"><span>联系我们</span></a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 内容主体区域 layui距离上边默认为60-->
        <!--财务报表-->
        <div class="layui-body" v-bind:style="{display:financeReportStatus}"
             style="top: 80px;">
            <!--当前总收入 当前总支出 当前总余额-->
            <div class="padding15-panel">
                <div class="layui-row content-panel">
                    <div class="layui-col-space20">
                        <div class="layui-col-md4">
                            <!--当前总收入-->
                            <div class="card-panel" style="background: #ff565d">
                                <div class="cardContent-panel">
                                    <div class="title-panel">
                                        <span>当前总收入:</span>
                                    </div>
                                    <div class="price-panel">
                                        <span>{{totalRevenue}}</span><span> 元</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md4">
                            <!--当前总支出-->
                            <div class="card-panel" style="background: #60C1B3">
                                <div class="cardContent-panel">
                                    <div class="title-panel">
                                        <span>当前总支出:</span>
                                    </div>
                                    <div class="price-panel">
                                        <span>{{totalExpenses}}</span><span> 元</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md4">
                            <!--当前余额-->
                            <div class="card-panel" style="background: #F6C157">
                                <div class="cardContent-panel">
                                    <div class="title-panel">
                                        <span>当前总余额:</span>
                                    </div>
                                    <div class="price-panel">
                                        <span>{{totalBalance}}</span><span> 元</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--数据表格区域-->
            <div class="padding15-panel">
                <div class="layui-row content-panel">
                    <!--表格头部工具栏-->
                    <div class="title-toolbar">
                        <div class="elem-panel">
                            <div class="input-panel">
                                <input id="startTime" readonly="readonly" type="text"
                                       placeholder="点击选择开始时间" autocomplete="off" class="layui-input">
                            </div>
                            <div class="text-panel">
                                <span>至</span>
                            </div>
                            <div class="input-panel">
                                <input id="endTime" readonly="readonly" type="text"
                                       placeholder="点击选择结束时间" autocomplete="off" class="layui-input">
                            </div>
                            <div class="btn-panel">
                                <button class="layui-btn layui-btn-normal">查询</button>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="List1Table">
                        <table id="List1" lay-filter="List1"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--订单信息管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:orderManagementStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="orderManagement-panel">
                    <div class="title-panel">
                        <span>订单信息管理</span>
                    </div>
                    <!--页面所展示的选择框-->
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">订单号</label>
                                    <div class="layui-input-block" id="orderFormSelectPanel">
                                        <select lay-search="" lay-filter="orderNumberSelectPanel"
                                                id="orderNumSelect" name="orderFormSelectPanel">
                                            <option value="">直接选择或手动输入订单号</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">客户名称</label>
                                    <div class="layui-input-block">
                                        <select lay-search="" lay-filter="orderClientNameSelectPanel"
                                                id="orderClientName" name="clientNameSelectPanel">
                                            <option value="">直接选择或手动输入客户名称</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">工程名称</label>
                                    <div class="layui-input-block">
                                        <select lay-search="" id="orderprojectNameSelectId"
                                                lay-filter="orderprojectNameSelectPanel"
                                                name="projectNameSelectPanel">
                                            <option value="">直接选择或手动输入工程名称</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">日期</label>
                                    <div class="layui-input-block">
                                        <input id="timeInterval" type="text" readonly="readonly"
                                               placeholder="点击选择日期" autocomplete="off"
                                               class="layui-input pointerStyle">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <%--
                    <!--折叠面板中的选择框-->
                    <div class="layui-collapse" lay-accordion="" style="margin-top: 15px">
                        <div class="layui-colla-item">
                            <h2 class="layui-colla-title">更多条件(点击展开)</h2>
                            <div class="layui-colla-content">
                                <div class="layui-row layui-col-space10">
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">送货地址</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="test"
                                                            name="deliveryAddressSelectPanel">
                                                        <option value="">直接选择或手动输入送货地址</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">联系电话</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="test"
                                                            name="contactNumberSelectPanel">
                                                        <option value="">直接选择或手动输入联系电话</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">制单人</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="" name="orderNumberSelectPanel">
                                                        <option value="">直接选择或手动输入制单人</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">备注</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="" name="RemarksSelectPanel">
                                                        <option value="">直接选择或手动备注</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-row layui-col-space10">
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">已结账</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="" name="CheckedOutSelectPanel">
                                                        <option value="">请选择</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">完成发货</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter=""
                                                            name="finishDeliverySelectPanel">
                                                        <option value="">请选择</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">标签打印</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="" name="labelPrintingSelectPanel">
                                                        <option value="">请选择</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">自定义模板</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="test"
                                                            name="CustomTemplateSelectPanel">
                                                        <option value="">请选择</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    --%>

                    <!--订单信息管理数据表格-->
                    <div class="layui-row">
                        <div id="orderInformationDataList">
                            <div class="title-BtnPanel">
                                <div class="btn-panel">
                                    <button @click="billingFun"
                                            class="layui-btn layui-btn-normal "
                                            v-bind:style="{background:BtnColor}">开单
                                    </button>
                                    <button class="layui-btn layui-btn-normal " id="uploadDocument" @click="uploadDocument"
                                            v-bind:style="{background:BtnColor}">上传单据
                                    </button>
                                    <button @click="startShippingFun" class="layui-btn layui-btn-normal "
                                            v-bind:style="{background:BtnColor}">开始发货
                                    </button>
                                    <button @click="orderBtnQueryFun"
                                            class="layui-btn layui-btn-normal"
                                            v-bind:style="{background:BtnColor}">查询
                                    </button>
                                    <button class="layui-btn layui-btn-normal"
                                            v-bind:style="{background:BtnColor}" @click="DeleteOrderFun">删除
                                    </button>
                                    <button class="layui-btn layui-btn-normal"
                                            @click="printOrderFun" v-bind:style="{background:BtnColor}">订单打印
                                    </button>
                                    <button class="layui-btn layui-btn-normal"
                                            @click="orderDetailsFun" v-bind:style="{background:BtnColor}">订单详情
                                    </button>
                                    <button class="layui-btn layui-btn-normal"
                                            @click="labelPrintingFun" v-bind:style="{background:BtnColor}">标签打印
                                    </button>
                                    <button class="layui-btn layui-btn-normal"
                                            @click="addRevenueFun" v-bind:style="{background:BtnColor}">添加收入
                                    </button>
                                </div>
                            </div>
                            <div class="ListDataTable-panel">
                                <table id="orderInfoList" lay-filter="orderInfoList"
                                       lay-data="{id:'orderInfoList'}"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--进货管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:IncomingGoodsStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="IncomingGoods-panel">
                    <div class="title-panel">
                        <span>进货管理</span>
                    </div>
                    <!--进货管理tab选项卡-->
                    <div class="layui-tab layui-tab-brief"
                         lay-filter="IncomingGoodsTab">
                        <ul class="layui-tab-title">
                            <li class="layui-this">原片采购</li>
                            <li>配件采购</li>
                        </ul>
                        <div class="layui-tab-content">
                            <!--原片采购-->
                            <div class="layui-tab-item layui-show">
                                <!--条件选择框-->
                                <div class="layui-row layui-col-space10">
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">单号</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="SingleNumberSelectPanel"
                                                            id="SingleNumberSelectPanel"
                                                            name="SingleNumberSelectPanel">
                                                        <option value="">直接选择或手动输入单号</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">日期</label>
                                                <div class="layui-input-block">
                                                    <input id="originalFilmPurchaseDate" type="text"
                                                           style="cursor: pointer;" readonly="readonly"
                                                           placeholder="点击选择时间" autocomplete="off"
                                                           class="layui-input">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">供货商</label>
                                                <div class="layui-input-block">
                                                    <select lay-search="" lay-filter="supplierSelectPanel"
                                                            id="supplierSelectPanel" name="supplierSelectPanel">
                                                        <option value="">直接选择或手动输入</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3">
                                        <div class="item-panel layui-form">
                                            <div class="layui-form-item">
                                                <label class="layui-form-label">备注</label>
                                                <div class="layui-input-block">
                                                    <select lay-search=""
                                                            lay-filter="originalFilmremarkSelectPanel"
                                                            id="originalFilmremarkSelectPanel"
                                                            name="originalFilmremarkSelectPanel">
                                                        <option value="">直接选择或手动输入</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--表格顶部按钮-->
                                <div class="topBtn-panel">
                                    <div class="btn-panel">
                                        <button class="layui-btn layui-btn-normal"
                                                @click="purchaseRegistrationFun"
                                                v-bind:style="{background:BtnColor}">采购登记
                                        </button>
                                        <button class="layui-btn layui-btn-normal"
                                                @click="PurchaseregistrationDelFun"
                                                v-bind:style="{background:BtnColor}">删除
                                        </button>
                                        <button class="layui-btn layui-btn-normal"
                                                @click="PurchaseregistrationQueryFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                    </div>
                                </div>
                                <!--原片采购数据表格1-->
                                <div class="OriginaFlilmListTable-panel">
                                    <table id="OriginaFlilmList" lay-filter="OriginaFlilmList"></table>
                                </div>
                            </div>
                            <!--配件采购-->
                            <div class="layui-tab-item">
                                <div class="layui-tab-item layui-show">
                                    <!--条件选择框-->
                                    <div class="layui-row layui-col-space10">
                                        <div class="layui-col-md3">
                                            <div class="item-panel layui-form">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">单号</label>
                                                    <div class="layui-input-block">
                                                        <select lay-search=""
                                                                lay-filter="FittingNumberSelectPanel"
                                                                id="FittingNumberSelectPanel"
                                                                name="FittingNumberSelectPanel">
                                                            <option value="">直接选择或手动输入单号</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3">
                                            <div class="item-panel layui-form">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">日期</label>
                                                    <div class="layui-input-block">
                                                        <input id="attachmentProcurementDate" type="text"
                                                               style="cursor: pointer;" readonly="readonly"
                                                               placeholder="点击选择时间" autocomplete="off"
                                                               class="layui-input">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3">
                                            <div class="item-panel layui-form">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">供货商</label>
                                                    <div class="layui-input-block">
                                                        <select lay-search=""
                                                                lay-filter="FittingsupplierSelectPanel"
                                                                id="FittingsupplierSelectPanel"
                                                                name="FittingsupplierSelectPanel">
                                                            <option value="">直接选择或手动输入</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3">
                                            <div class="item-panel layui-form">
                                                <div class="layui-form-item">
                                                    <label class="layui-form-label">备注</label>
                                                    <div class="layui-input-block">
                                                        <select lay-search=""
                                                                lay-filter="FittingremarkSelectPanel"
                                                                id="FittingremarkSelectPanel"
                                                                name="FittingremarkSelectPanel">
                                                            <option value="">直接选择或手动输入</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--表格顶部按钮-->
                                    <div class="topBtn-panel">
                                        <div class="btn-panel">
                                            <button class="layui-btn layui-btn-normal"
                                                    v-bind:style="{background:BtnColor}" @click="fittingAddFun">采购登记
                                            </button>
                                            <button class="layui-btn layui-btn-normal"
                                                    v-bind:style="{background:BtnColor}" @click="fittingDelFun">删除
                                            </button>
                                            <button class="layui-btn layui-btn-normal"
                                                    v-bind:style="{background:BtnColor}"
                                                    @click="fittingQueryFun">查询
                                            </button>
                                        </div>
                                    </div>
                                    <!--附件采购数据表格1-->
                                    <div class="OriginaFlilmListTable-panel">
                                        <table id="annexList" lay-filter="annexList"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--出货管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:shipmentStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="shipment-panel">
                    <div class="title-panel">
                        <span>出货管理</span>
                    </div>
                    <!--原片出库-->
                    <!--部分按钮与条件查询-->
                    <div class="layui-row" style="position: relative;height: 40px">
                        <div class="btnCondition-panel">
                            <!--日期查询-->
                            <div class="dateQuery-panel">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">日期</label>
                                    <div class="layui-input-block">
                                        <input style="cursor: pointer" id="outOfTheLibraryDate"
                                               type="text" name="title" readonly="readonly"
                                               placeholder="点击选择日期" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <!--按钮-->
                            <div class="btn-panel">
                                <button @click="shipmentQueryFun" class="layui-btn layui-btn-warm"
                                        v-bind:style="{background:BtnColor}">查询
                                </button>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="layui-row">
                        <!--表格顶部按钮区域-->
                        <div class="tableTopBtn-panel">
                            <div class="btn-panel">
                                <button @click="shipmentDelFun" class="layui-btn layui-btn-normal"
                                        v-bind:style="{background:BtnColor}">删除
                                </button>
                                <button @click="shipmentSeeDetails" class="layui-btn layui-btn-normal"
                                        v-bind:style="{background:BtnColor}">查看详情
                                </button>
                                <button @click="uploadDeliveryNoteFun" class="layui-btn layui-btn-normal" id="uploadDeliveryNote"
                                        v-bind:style="{background:BtnColor}">上传送货单
                                </button>
                                <input type="button" id = "btnHide" style="display: none">
                                <input type="button" id = "hideBtn" style="display: none">
                            </div>
                        </div>
                        <!--数据表格-->
                        <div class="originalFilmOutList-panel">
                            <table id="originalFilmOutList" lay-filter="originalFilmOutList"></table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--库存管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:stockStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="stock-panel">
                    <div class="title-panel">
                        <span>库存管理</span>
                    </div>
                    <!--库存管理-->
                    <!--页面所展示的选择框-->
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">原片名称</label>
                                    <div class="layui-input-block">
                                        <select lay-search="" lay-filter="stockProductNameSelectPanel"
                                                id="stockProductNameSelectPanel"
                                                name="stockProductNameSelectPanel">
                                            <option value="">直接选择或手动输入原片名称</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <button v-bind:style="{background:BtnColor}" @click="inventoryInquiryFun"
                                            class="layui-btn layui-btn-normal">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--库存管理数据表格-->
                    <div class="layui-row">
                        <!--表格顶部按钮区域-->
                        <div class="tableTopBtn-panel">
                            <div class="btn-panel">
                                <button v-bind:style="{background:BtnColor}" @click="stockDelFun"
                                        class="layui-btn layui-btn-normal">删除
                                </button>
                                <button v-bind:style="{background:BtnColor}" @click="stockExportFun"
                                        class="layui-btn layui-btn-normal">导出
                                </button>
                            </div>
                        </div>
                        <!--数据表格-->
                        <div class="originalFilmOutList-panel">
                            <table id="stockList" lay-filter="stockList"></table>
                        </div>
                    </div>

                    <!--

                    -->
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--已完成订单管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:OrderMonthStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="OrderMonth-panel">
                    <div class="title-panel">
                        <span>已完成订单</span>
                    </div>
                    <!--已完成订单根据客户名称查询查询-->
                    <div class="layui-row onlyNumber-panel layui-form">
                        <div class="condition-panel">
                            <div class="text-panel">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">客户名称:</label>
                                    <div class="layui-input-block">
                                        <select lay-search="" lay-filter="orderCompletedSelect"
                                                id="orderCompletedSelect"
                                                name="orderCompletedSelect">
                                            <option value="">选择或输入客户名称</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="btn-panel">
                                <button v-bind:style="{background:BtnColor}" @click="orderCompletedQueryFun"
                                        class="layui-btn layui-btn-normal">查询
                                </button>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="layui-row OrderMonthListBtn-panel">
                        <div class="btn-panel">
                            <button class="layui-btn layui-btn-normal"
                                    v-bind:style="{background:BtnColor}">删除
                            </button>
                            <button class="layui-btn layui-btn-normal"
                                    v-bind:style="{background:BtnColor}">导出
                            </button>
                        </div>
                    </div>
                    <div class="layui-row OrderMonthList-panel">
                        <table id="OrderMonthList" lay-filter="OrderMonthList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--客户信息管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:CustomerInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="CustomerInfo-panel">
                    <div class="title-panel">
                        <span>客户信息管理</span>
                    </div>
                    <!--条件选择区域-->
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">客户姓名</label>
                                    <div class="layui-input-block">
                                        <select lay-search="" lay-filter="customerNameSelectPanel"
                                                id="customerNameSelectPanel" name="customerNameSelectPanel">
                                            <option value="">直接选择或输入客户姓名</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">日期</label>
                                    <div class="layui-input-block">
                                        <input id="customerInfoDateInput" type="text"
                                               style="cursor: pointer;" readonly="readonly"
                                               placeholder="点击选择时间段筛选客户" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <button class="layui-btn layui-btn-normal" @click="ClientInfoQueryFun"
                                        v-bind:style="{background:BtnColor}">查询
                                </button>
                            </div>
                        </div>
                    </div>
                    <!--按钮区域-->
                    <div class="layui-row btnParent-panel">
                        <div class="btn-panel">
                            <button class="layui-btn layui-btn-normal" @click="addClientFun"
                                    v-bind:style="{background:BtnColor}">新增客户
                            </button>
                            <button class="layui-btn layui-btn-normal" @click="delClientFun"
                                    v-bind:style="{background:BtnColor}">删除客户
                            </button>
                            <button class="layui-btn layui-btn-normal" @click="editClientFun"
                                    v-bind:style="{background:BtnColor}">客户编辑
                            </button>
                        </div>
                    </div>
                    <!--客户信息数据表格区域-->
                    <div class="layui-row CustomerInfoList-panel">
                        <table id="CustomerInfoList" lay-filter="CustomerInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--收入管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:revenueInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="revenueInfo-panel">
                    <div class="title-panel">
                        <span>收入管理</span>
                    </div>
                    <!--条件选择区域-->
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">日期</label>
                                    <div class="layui-input-block">
                                        <input id="revenueInfoDateInput" type="text"
                                               style="cursor: pointer;" readonly="readonly"
                                               placeholder="点击选择时间段筛选收入记录" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <button class="layui-btn layui-btn-normal" @click="revenueQueryFun"
                                        v-bind:style="{background:BtnColor}">查询
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="revenueAddFun"
                                        v-bind:style="{background:BtnColor}">添加收入
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="revenueEditFun"
                                        v-bind:style="{background:BtnColor}">编辑条目
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="revenueDelFun"
                                        v-bind:style="{background:BtnColor}">删除条目
                                </button>
                            </div>
                        </div>
                        <div class="layui-col-md3"></div>
                    </div>
                    <!--按钮区域-->
                    <!--<div class="layui-row btnParent-panel">-->
                        <!--<div class="btn-panel">-->
                            <!--<button class="layui-btn layui-btn-normal"-->
                                    <!--v-bind:style="{background:BtnColor}">新增-->
                            <!--</button>-->
                            <!--<button class="layui-btn layui-btn-normal"-->
                                    <!--v-bind:style="{background:BtnColor}">导出-->
                            <!--</button>-->
                            <!--<button class="layui-btn layui-btn-normal"-->
                                    <!--v-bind:style="{background:BtnColor}">打印-->
                            <!--</button>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--数据表格区域-->
                    <div class="layui-row revenueInfoList-panel">
                        <table id="revenueInfoList" lay-filter="revenueInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--支出管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:expenditureInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="expenditureInfo-panel">
                    <div class="title-panel">
                        <span>支出管理</span>
                    </div>
                    <!--条件选择区域-->
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">日期</label>
                                    <div class="layui-input-block">
                                        <input id="expenditureInfoDateInput" type="text"
                                               style="cursor: pointer;" readonly="readonly"
                                               placeholder="点击选择时间段筛选支出记录" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md3">
                            <div class="item-panel layui-form">
                                <button class="layui-btn layui-btn-normal" @click="payQueryFun"
                                        v-bind:style="{background:BtnColor}">查询
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="payAddFun"
                                        v-bind:style="{background:BtnColor}">添加支出
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="payEditFun"
                                        v-bind:style="{background:BtnColor}">编辑条目
                                </button>
                                <button class="layui-btn layui-btn-normal" @click="payDelFun"
                                        v-bind:style="{background:BtnColor}">删除条目
                                </button>
                            </div>
                        </div>
                        <div class="layui-col-md3"></div>
                    </div>
                    <!--按钮区域-->
                    <!--<div class="layui-row btnParent-panel">
                        <div class="btn-panel">
                            <button class="layui-btn layui-btn-normal"
                                    v-bind:style="{background:BtnColor}">新增
                            </button>
                            <button class="layui-btn layui-btn-normal"
                                    v-bind:style="{background:BtnColor}">导出
                            </button>
                            <button class="layui-btn layui-btn-normal"
                                    v-bind:style="{background:BtnColor}">打印
                            </button>
                        </div>
                    </div>-->
                    <!--数据表格区域-->
                    <div class="layui-row expenditureInfoList-panel">
                        <table id="expenditureInfoList" lay-filter="expenditureInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--客户对账-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:customerReconciliationStatus}">
            <div class="padding15-panel" id="customerReconciliation-panel">
                <div class="layui-row content-panel" style="margin-bottom: 10px">
                    <div class="title-panel">
                        <span>客户对账</span>
                    </div>
                    <div class="btnParent-panel">
                        <div class="btn-panel">
                            <div class="layui-form-item">
                                <label class="layui-form-label">客户姓名</label>
                                <div class="layui-input-block layui-form">
                                    <select lay-search="" lay-filter="customerReconciliationSelect" id="customerReconciliationSelect"
                                            name="customerReconciliationSelect">
                                        <option value="">直接选择或输入客户姓名</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="queryBtn-panel">
                            <button class="layui-btn layui-btn-normal" @click="queryAllOrderFun"
                                    v-bind:style="{background:BtnColor}">查询
                            </button>
                            <button class="layui-btn layui-btn-normal" @click="downloadAllOrderFun"
                                    v-bind:style="{background:BtnColor}">单据下载
                            </button>
                        </div>
                    </div>
                    <!--数据表格列表-->
                    <div class="customerReconciliationList-panel">
                        <table id="customerReconciliationList"
                               lay-filter="customerReconciliationList"></table>
                    </div>
                </div>
                <div class="layui-row content-panel">
                    <div class="layui-col-space10">
                        <div class="layui-col-md4">
                            <!--客户原始单据-->
                            <div class="lump-panel" @click="OriginalDocumentFun" id="customerOriginalDocumentImgPanel">
                                <img src="img/bg1.jpeg" alt="" id="customerOriginalDocumentImg">
                                <div class="BlackSuspensionLayer">
                                    <span>客户原始单据(点击查看大图)</span>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md4">
                            <div class="lump-panel">
                                <!--单据统计-->
                                <div class="lump-panel">
                                    <img src="img/bg1.jpeg" alt="">
                                    <div class="BlackSuspensionLayer">
                                        <span>单据统计(点击查看大图)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md4">
                            <div class="lump-panel" @click="deliveryOrderFun">
                                <!--送货清单-->
                                <div class="lump-panel">
                                    <img src="img/bg1.jpeg" alt="" id="deliveryOrderPanel">
                                    <div class="BlackSuspensionLayer">
                                        <span>送货清单(点击查看大图)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--考勤管理-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:AttendanceInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="AttendanceInfo-panel">
                    <div class="title-panel">
                        <span>考勤管理</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" id="departmentSelectPanel"
                                                    lay-filter="departmentSelectPanel"
                                                    name="departmentSelectPanel">
                                                <option value="">直接选择或输入部门</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">姓名</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="AttendanceNameSelectPanel"
                                                    id="AttendanceNameSelectPanel"
                                                    name="AttendanceNameSelectPanel">
                                                <option value="">直接选择或输入姓名</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">工号</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="AttendanceJobNumberSelectPanel"
                                                    id="AttendanceJobNumberSelectPanel"
                                                    name="AttendanceJobNumberSelectPanel">
                                                <option value="">直接选择或手动输入工号</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="QueryAttendanceFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="EditAttendanceFun"
                                                v-bind:style="{background:BtnColor}">编辑条目
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="delAttendanceFun"
                                                v-bind:style="{background:BtnColor}">删除条目
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="AttendanceInfoList-panel">
                        <table id="AttendanceInfoList" lay-filter="AttendanceInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--工资发放-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:salaryGivingStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="salaryGiving-panel">
                    <div class="title-panel">
                        <span>工资发放</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">职位/岗位</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="SalaryInfoDivision"
                                                    name="SalaryInfoDivision" id="SalaryInfoDivision">
                                                <option value="">直接选择或输入部门</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">姓名</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="SalaryInfoName"
                                                    name="SalaryInfoName" id="SalaryInfoName">
                                                <option value="">直接选择或输入姓名</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">工号</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="SalaryInfoJobNumber"
                                                    name="SalaryInfoJobNumber" id="SalaryInfoJobNumber">
                                                <option value="">直接选择或手动输入工号</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="salaryQueryFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="salaryAddFun"
                                                v-bind:style="{background:BtnColor}">发放工资
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="salaryEditFun"
                                                v-bind:style="{background:BtnColor}">修改条目
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="salaryDelFun"
                                                v-bind:style="{background:BtnColor}">删除条目
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="salaryGivingList-panel">
                        <table id="salaryGivingList" lay-filter="salaryGivingList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--员工信息-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:employeeInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="employeeInfo-panel">
                    <div class="title-panel">
                        <span>员工信息</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="EmployeeDivision"
                                                    name="EmployeeDivision" id="EmployeeDivision">
                                                <option value="">直接选择或输入部门</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">姓名</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="EmployeeName"
                                                    name="EmployeeName" id="EmployeeName">
                                                <option value="">直接选择或输入姓名</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">工号</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="EmployeejobNumber"
                                                    name="EmployeejobNumber" id="EmployeejobNumber">
                                                <option value="">直接选择或手动输入工号</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="employeeQueryFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="employeeAddFun"
                                                v-bind:style="{background:BtnColor}">添加员工
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="employeeDelFun"
                                                v-bind:style="{background:BtnColor}">删除员工
                                        </button>
                                        <button class="layui-btn layui-btn-normal" @click="employeeEditFun"
                                                v-bind:style="{background:BtnColor}">修改员工
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="employeeInfoList-panel">
                        <table id="employeeInfoList" lay-filter="employeeInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--原片信息-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:OriginalInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="OriginalInfo-panel">
                    <div class="title-panel">
                        <span>原片信息</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">产品名称</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="OriginalInfoproductNameSelectPanel"
                                                    name="OriginalInfoproductNameSelectPanel"
                                                    id="OriginalInfoproductNameSelectPanel">
                                                <option value="">直接选择或输入产品名称</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="productNameQueryFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--按钮区域-->
                    <div class="btnParent-panel">
                        <div class="btn-panel">
                            <button class="layui-btn" @click="addProductFun" v-bind:style="{background:BtnColor}">新增
                            </button>
                            <button class="layui-btn" @click="delProductFun" v-bind:style="{background:BtnColor}">删除
                            </button>
                            <button class="layui-btn" @click="editProductFun" v-bind:style="{background:BtnColor}">编辑
                            </button>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="OriginalInfo-panel">
                        <table id="OriginalInfoList" lay-filter="OriginalInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--配件信息-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:AttachmentInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="AttachmentInfo-panel">
                    <div class="title-panel">
                        <span>配件信息</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">商品名称</label>
                                        <div class="layui-input-block">
                                            <select lay-search="OriginalInfoCommodityNameSelectPanel"
                                                    lay-filter="OriginalInfoCommodityNameSelectPanel"
                                                    id="OriginalInfoCommodityNameSelectPanel"
                                                    name="OriginalInfoCommodityNameSelectPanel">
                                                <option value="">直接选择或输入商品名称</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="queryFittingFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--按钮区域-->
                    <div class="btnParent-panel">
                        <div class="btn-panel">
                            <button class="layui-btn" @click="addFittingFun" v-bind:style="{background:BtnColor}">新增配件
                            </button>
                            <button class="layui-btn" @click="delFittingFun" v-bind:style="{background:BtnColor}">删除配件
                            </button>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="AttachmentInfo-panel">
                        <table id="AttachmentInfoList" lay-filter="AttachmentInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--供应商信息-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:SupplierInfoStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="SupplierInfo-panel">
                    <div class="title-panel">
                        <span>供应商信息</span>
                    </div>
                    <!--条件筛选区域-->
                    <div class="ConditionalScreening-panel">
                        <div class="layui-row layui-col-space10">
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <label class="layui-form-label">供应商名称</label>
                                        <div class="layui-input-block">
                                            <select lay-search="" lay-filter="SupplierInfoSelectPanel"
                                                    id="SupplierInfoSelectPanel"
                                                    name="SupplierInfoSelectPanel">
                                                <option value="">直接选择或输入供应商名称</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3">
                                <div class="item-panel layui-form">
                                    <div class="layui-form-item">
                                        <button class="layui-btn layui-btn-normal" @click="querySupplierFun"
                                                v-bind:style="{background:BtnColor}">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--按钮区域-->
                    <div class="btnParent-panel">
                        <div class="btn-panel">
                            <button class="layui-btn" @click="addSupplierFun" v-bind:style="{background:BtnColor}">
                                添加供应商
                            </button>
                            <button class="layui-btn" @click="delSupplierFun" v-bind:style="{background:BtnColor}">
                                删除供应商
                            </button>
                            <button class="layui-btn" @click="editSupplierFun" v-bind:style="{background:BtnColor}">
                                编辑供应商
                            </button>
                        </div>
                    </div>
                    <!--数据表格区域-->
                    <div class="AttachmentInfo-panel">
                        <table id="SupplierInfoList" lay-filter="AttachmentInfoList"></table>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--添加供应商悬浮层-->
        <div id="addSupplierSubmenu">
            <div class="contentArea">
                <div class="imageRow-panel">
                    <div class="img-panel" id="blackMask">
                        <div class="blackMask" id="supplierBlackTip">
                            <span>上传供应商logo</span>
                        </div>
                        <img v-bind:src="supplierLogoSrc" alt="">
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>供货商名称:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商名称" v-model="supplierName">
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>首要联系人:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入联系人姓名" v-model="supplierContact">
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>联系人电话:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商电话" v-model="supplierPhone">
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>供应商地址:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商地址" v-model="supplierAddress">
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="bankNmae-panel">
                        <span>银行卡号:</span>
                    </div>
                    <div class="bankVal-panel">
                        <input v-on:input="BankCardRealTimeInput" type="text" placeholder="输入银行卡号" class="layui-input"
                               maxlength="19" v-model="supplierBankCardNumber">
                    </div>
                    <div class="bankTip-panel">
                        <span id="supplierBankSpan">{{supplierBankPrompt}}</span>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>联系人微信:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入微信号" v-model="supplierWechat">
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnArea">
                <div class="btn-panel">
                    <button class="layui-btn" @click="addSupplierSubmitFun" v-bind:style="{background:BtnColor}">提交
                    </button>
                    <button class="layui-btn" @click="addSupplierCancelFun" v-bind:style="{background:BtnColor}">取消
                    </button>
                </div>
            </div>
        </div>
        <!--编辑供应商悬浮层-->
        <div id="editSupplierSubmenu">
            <div class="contentArea">
                <div class="imageRow-panel">
                    <div class="img-panel" id="editBlackMask">
                        <div class="blackMask">
                            <span>修改供应商logo</span>
                        </div>
                        <img v-bind:src="editSupplierLogoSrc" alt="">
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>供货商名称:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商名称" v-model="editSupplierName">
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>首要联系人:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入联系人姓名" v-model="editSupplierContact">
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>联系人电话:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商电话" v-model="editSupplierPhone">
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>供应商地址:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入供货商地址" v-model="editSupplierAddress">
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="bankNmae-panel">
                        <span>银行卡号:</span>
                    </div>
                    <div class="bankVal-panel">
                        <input v-on:input="editBankCardRealTimeInput" type="text" placeholder="输入银行卡号"
                               class="layui-input" maxlength="19" v-model="editSupplierBankCardNumber">
                    </div>
                    <div class="bankTip-panel">
                        <span id="editSupplierBankSpan">{{editSupplierBankPrompt}}</span>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="left-panel">
                            <span>联系人微信:</span>
                        </div>
                        <div class="right-panel">
                            <input type="text" class="layui-input" placeholder="输入微信号" v-model="editSupplierWechat">
                        </div>
                    </div>
                </div>
            </div>
            <div class="btnArea">
                <div class="btn-panel">
                    <button class="layui-btn" @click="editSupplierSubmitFun" v-bind:style="{background:BtnColor}">提交
                    </button>
                    <button class="layui-btn" @click="editSupplierCancelFun" v-bind:style="{background:BtnColor}">取消
                    </button>
                </div>
            </div>
        </div>
        <!--基本设置-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:basicSettingsStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="basicSettings-panel">
                    <div class="title-panel">
                        <span>基本设置</span>
                    </div>
                    <div class="layui-row cardParent-panel layui-col-space10">
                        <form class="layui-form" action="">
                            <div class="layui-form-item">
                                <label class="layui-form-label">企业名称：</label>
                                <div class="layui-input-block">
                                    <input type="text" name="title" required lay-verify="required"
                                           placeholder="佰益中空玻璃企业管理系统" autocomplete="off"
                                           class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">企业logo：</label>
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn">
                                        <i class="layui-icon">&#xe67c;</i>上传图片
                                    </button>
                                </div>
                                <div class="layui-form-mid layui-word-aux">辅助文字</div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">顶部配色：</label>
                                <div class="layui-input-inline">
                                    <div id="TopColorMatchingPanel"></div>
                                </div>
                                <div class="layui-form-mid layui-word-aux">点击左边选择颜色</div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">导航配色：</label>
                                <div class="layui-input-inline">
                                    <div id="navigationColorMatchingPanel"></div>

                                </div>
                                <div class="layui-form-mid layui-word-aux">点击左边选择颜色</div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-input-block">
                                    <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--联系我们-->
        <div class="layui-body" style="top: 80px;"
             v-bind:style="{display:contactUsStatus}">
            <div class="padding15-panel">
                <div class="layui-row content-panel" id="contactUs-panel">
                    <div class="title-panel">
                        <span>联系我们</span>
                    </div>
                    <div class="layui-row mainContent-panel">
                        <div class="row-panel" style="margin-top: 160px">
                            <span>技术支持:李凯</span>
                        </div>
                        <div class="row-panel">
                            <span>联系电话:13991480754</span>
                        </div>
                        <div class="row-panel">
                            <span>邮箱:1195419506@qq.com</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 底部固定区域 -->
            <div class="layui-footer">
                <%=Version%>
            </div>
        </div>
        <!--用户资料悬浮层-->
        <div id="SysmsgSubmenu" style="display: none">
            <div class="row-panel">
                <div class="text-panel">
                    <span>当前权限:</span>
                </div>
                <div class="input-panel">
                    <span><%=sysUseAuthority%></span>
                </div>
                <div class="btn-panel">
                    <button class="layui-btn">
                        <i class="layui-icon">&#xe608;</i> 权限分配
                    </button>
                </div>
            </div>
            <div class="row-panel">
                <div class="text-panel">
                    <span>密码操作:</span>
                </div>
                <div class="input-panel">
                    <span>********</span>
                </div>
                <div class="btn-panel">
                    <button class="layui-btn">
                        <i class="layui-icon layui-icon-edit"></i> 密码修改
                    </button>
                </div>
            </div>
            <div class="infoEdit-panel">
                <button class="layui-btn layui-btn-warm">资料修改</button>
            </div>
        </div>
        <!-- 开单管理悬浮层 -->
        <div id="billingManageSubmenu">
            <div class="top-panel">
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">客户名称:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="输入客户名称" autocomplete="off"
                                       id="billingClientName" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">工程名称:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="输入工程名称" autocomplete="off"
                                       id="billingprojectName" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">订单号:</label>
                            <div class="layui-input-block">
                                <input id="billingOrderNumber" type="text" placeholder="自动生成"
                                       autocomplete="off" readonly="readonly" class="layui-input"
                                       style="cursor:pointer">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">日期:</label>
                            <div class="layui-input-block">
                                <input id="billingDatePanel" type="text" placeholder="服务器获取"
                                       autocomplete="off" readonly="readonly" class="layui-input"
                                       style="cursor:pointer">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">送货地址:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="输入送货地址" autocomplete="off"
                                       id="billingdeliveryAddress" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">联系电话:</label>
                            <div class="layui-input-block">
                                <input type="number" placeholder="输入联系电话"
                                       id="billingcontactNumber"
                                       oninput="if(value.length>11)value=value.slice(0,11)"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel layui-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">发货方式:</label>
                            <div class="layui-input-block">
                                <select name="billingShippingMethod" lay-verify=""
                                        id="billingShippingMethod">
                                    <option value=""></option>
                                    <option value="0" selected>自取</option>
                                    <option value="1">货车发货</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="item-panel layui-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">制单人:</label>
                            <div class="layui-input-block">
                                <select name="" lay-verify="ShippingMethodSelect"
                                        id="billingPreparedBy">
                                    <option value=""></option>
                                    <option value="管理员" selected>管理员</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row-panel">
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">玻璃数量:</label>
                            <div class="layui-input-block">
                                <input style="cursor:pointer" readonly="readonly" type="text"
                                       id="billingGlassNum" placeholder="自动计算" autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">总面积:</label>
                            <div class="layui-input-block">
                                <input style="cursor:pointer" readonly="readonly" type="text"
                                       id="billingTotalArea" placeholder="自动计算" autocomplete="off"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">其他费用:</label>
                            <div class="layui-input-block">
                                <input type="number" placeholder="输入金额" autocomplete="off"
                                       id="billingOtherCost"
                                       oninput="if(value.length>11)value=value.slice(0,11)"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">总金额(元):</label>
                            <div class="layui-input-block">
                                <input style="cursor:pointer" type="text"
                                       id="billingtotalAmount" placeholder="自动计算" readonly="readonly"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Remarks-panel">
                    <div class="left-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">备注:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="输入备注" autocomplete="off"
                                       id="billingRemarks" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="right-panel">
                        <div class="item-panel">
                            <div class="layui-form-item">
                                <label class="layui-form-label">已付款(元):</label>
                                <div class="layui-input-block">
                                    <input style="cursor:pointer" type="text" id="billingPaid"
                                           maxlength="9" placeholder="请输入" autocomplete="off" value="0"
                                           class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="item-panel">
                            <div class="layui-form-item">
                                <label class="layui-form-label">未付款:</label>
                                <div class="layui-input-block">
                                    <input style="cursor:pointer" type="text" readonly="readonly"
                                           id="billingUnpaid" placeholder="自动计算" autocomplete="off"
                                           value="0元" class="layui-input">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-panel ">
                <button class="layui-btn" style="background:#009688"
                        @click="billingaddFun">
                    <i class="layui-icon">&#xe608;</i> 新增
                </button>
                <button onclick="delModelFun()" class="layui-btn"
                        style="background:#FF5722">
                    <i class="layui-icon">&#xe640;</i> 删除
                </button>
                <button @click="billingPrintFun" class="layui-btn"
                        style="background: #2F4056">
                    <i class="layui-icon"> &#xe641;</i> 打印
                </button>
                <button @click="billingPreciseMergerFun" class="layui-btn"
                        style="background: #2F4056">
                    <i class="layui-icon"> &#xe857;</i> 精确合并
                </button>
                <button @click="billingfuzzyMergerFun" class="layui-btn"
                        style="background: #2F4056">
                    <i class="layui-icon"> &#xe674;</i> 模糊合并
                </button>
            </div>
            <div class="billingContentPanel">
                <div id="submenu">
                    <div class="table-panel">
                        <div class="title-panel">
                            <div class="firstItem">
                                <span>序号</span>
                            </div>
                            <div class="specificationModel">
                                <span>品名型号</span>
                            </div>
                            <div class="item-panel">
                                <span>长度</span>
                            </div>
                            <div class="item-panel">
                                <span>宽度</span>
                            </div>
                            <div class="item-panel">
                                <span>数量</span>
                            </div>
                            <div class="item-panel">
                                <span>标记</span>
                            </div>
                            <div class="item-panel">
                                <span>面积</span>
                            </div>
                            <div class="item-panel">
                                <span>单价</span>
                            </div>
                            <div class="item-panel">
                                <span>合计金额</span>
                            </div>
                        </div>
                        <div class="content-panel layui-form">
                            <div class="row-panel row_1">
                                <div class="firstItem">
                                    <span>1</span>
                                </div>
                                <div class="specificationModel">
                                    <select name="customize1" lay-filter="customize1" id="customize1">
                                        <option value="">点击选择规格型号</option>
                                    </select>
                                </div>
                                <div class="item-panel">
                                    <input maxlength="5" type="text" placeholder="mm"
                                           class="layui-input getFocus glassLength"
                                           onkeypress="if(event.keyCode==13) focusNextInput(this);">
                                </div>
                                <div class="item-panel">
                                    <input maxlength='5' type='text' placeholder='mm'
                                           class='layui-input glassWidth'
                                           onkeypress='if(event.keyCode==13) focusNextInput(this);'>
                                </div>
                                <div class="item-panel">
                                    <input maxlength="5" type="text" placeholder="片"
                                           class="layui-input glassNum addRow">
                                </div>
                                <div class="item-panel">
                                    <input maxlength="5" type="text" placeholder="请输入"
                                           class="layui-input marks">
                                </div>
                                <div class="item-panel">
                                    <input type="text" placeholder="自动计算"
                                           class="layui-input not_allowed area" readonly="readonly">
                                </div>
                                <div class="item-panel">
                                    <input type="text" placeholder="自动读取"
                                           class="layui-input unitPrice">
                                </div>
                                <div class="item-panel">
                                    <input type="text" placeholder="自动计算"
                                           class="layui-input totalAmount not_allowed"
                                           readonly="readonly">
                                </div>
                            </div>
                        </div>
                        <div class="foot-panel">
                            <div class="right-panel">
                                <span>总面积:</span> <span class="foot_item_value" id="globalArea">平方</span>
                                <span>总金额:</span> <span class="foot_item_value"
                                                        id="globalPrice">￥</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- 订单详情页面 -->
    <!--微信二维码承载容器-->
    <div id="wechatQRCodePanel" style="display: none;">

    </div>
    <div id="orderDetailsSubmenu" style="display:none">
        <div class="row-panel">
            <div class="title-panel">
                <span>订单详情</span>
            </div>
            <!--微信二维码分享容器-->
            <!--<div class="wechat-panel" @click="wechatSharing">
                <i class="layui-icon layui-icon-login-wechat" style="font-size: 30px; color: #5FB878;"></i>
            </div>-->

            <!--分享区域-->

            <!-- <button class="partakeFun" data-clipboard-target="#orderLinks">
                 <div class="partake-panel partake_panel" @click="partakeFun" id="partakePanel" title="分享当前订单">
                     <img src="img/partakeImg.png" height="25" width="25"/>
                 </div>
             </button>-->
        </div>
        <div class="title-panel">
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">订单号</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderNumber" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">客户名称</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderClientName" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">工程名称</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderProjectName" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">下单日期</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderDate" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">已发货数量</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderShippedQuantity" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">已发货面积</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderShippedArea" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">未发货数量</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderUndeliveredQuantity" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">未发货面积</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderUnshippedArea" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">送货地址</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderdeliveryAddress" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">运输负责人</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderTransportationManager" @click="responsiblePersonDetailsFun"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">运输费用:</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="暂时没有发货记录"
                                   id="DetailsOrderTransportationCosts" autocomplete="off"
                                   class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">备注:</label>
                        <div class="layui-input-block">
                            <input type="text" readonly="readonly" placeholder="自动读取"
                                   id="DetailsOrderRemarks" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 表格渲染模块 -->
        <div class="orderTable-panel">
            <table class="layui-table" id="orderDetailsList" lay-filter="orderDetailsList">
                <thead>
                <tr>
                    <th class="layui-bg-cyan">序号</th>
                    <th class="layui-bg-cyan">长度</th>
                    <th class="layui-bg-cyan">宽度</th>
                    <th class="layui-bg-cyan">数量</th>
                    <th class="layui-bg-cyan">标记</th>
                    <th class="layui-bg-cyan">面积</th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div class="foot-panel">
            <div class="right-panel">
                <span>总金额: </span> <span class="val-panel"
                                         id="DetailsOrdertotalAmount">￥</span> <span>总面积: </span> <span
                    class="val-panel" id="DetailsOrdertheTotalArea">平方</span>
            </div>
        </div>
        <!--底部分享-->
        <div class="share-panel">
            <div class="sharingArea">
                <div class="textArea">
                    <span>分享到:</span>
                </div>
                <div class="iconArea" title="微信分享">
                    <div class="wechat-panel" @click="wechatSharing">
                       <i class="layui-icon layui-icon-login-wechat" style="font-size: 25px; color: #5FB878;"></i>
                   </div>
                    <div class="linksPanel">
                         <button class="partakeFun noneForButton" data-clipboard-target="#orderLinks" style="cursor: pointer;margin-top:6px">
                             <div class="partake-panel partake_panel" @click="partakeFun" id="partakePanel" title="链接分享">
                                 <img src="img/copyImg.png" height="25" width="25"/>
                             </div>
                         </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--标签打印悬浮层-->
    <div id="labelPrintingSubmenu" style="display: none" class="layui-form">
        <div class="row-panel">
            <div class="left-panel">
                <span>标签纸规格:</span>
            </div>
            <div class="right-panel">
                <input type="radio" name="labelRadio" value="1" title="5x13标签纸" lay-filter='labelRadio' checked>
                <input type="radio" name="labelRadio" value="2" title="4x11标签纸" lay-filter='labelRadio'>
            </div>
        </div>
    </div>
    <!--标签规格模板:5*13-->
    <div id="print-panel" style="display: none"></div>
    <!--标签规格模板:4*11-->
    <div id="secondPrint-panel" style="display: none"></div>
    <!--出货管理[发货单]打印模板开始-->
    <div id="invoicePrintTemplate">
        <h1>陕西伯益中空玻璃有限公司</h1>
        <h2>发货凭单</h2>
        <!-- 发货单客户基本信息 -->
        <div class="CustomerBasicInformatiofo-panel">
            <div class="item-panel">
                <div class="container-panel">
                    <span>客户名称:</span>
                </div>
                <div class="value-panel">
                    <span id="invoiceClientName">{{invoiceClientName}}</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>工程名称:</span>
                </div>
                <div class="value-panel">
                    <span id="invoiceProjectName">{{invoiceProjectName}}</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>订单号:</span>
                </div>
                <div class="value-panel">
                    <span id="invoiceOrderNumber">{{invoiceOrderNumber}}</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>联系电话:</span>
                </div>
                <div class="value-panel">
                    <span id="invoiceContactNumber">{{invoiceContactNumber}}</span>
                </div>
            </div>
            <div class="addressTimeFoot-panel">
                <div class="left-panel">
                    <div class="itemLeft-panel">
                        <span>送货地址:</span>
                    </div>
                    <div class="itemVal-panel">
                        <span style="line-height: 30px" id="invoiceDeliveryAddress">{{invoiceDeliveryAddress}}</span>
                    </div>
                </div>
                <div class="right-panel">
                    <div class="item-panel">
                        <div class="itemLeft-panel">
                            <span>订单日期:</span>
                        </div>
                        <div class="itemVal-panel">
                            <span style="line-height: 30px" id="invoiceOrderDate">{{invoiceOrderDate}}</span>
                        </div>
                    </div>
                    <div class="item-panel">
                        <div class="itemLeft-panel">
                            <span>发货日期:</span>
                        </div>
                        <div class="itemVal-panel">
                            <span style="line-height: 30px" id="invoiceDateOfShipment">{{invoiceDateOfShipment}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 表格渲染模块 -->
        <table class="layui-table" id="invoicePrintList"
               style="border:solid 2px black">
            <thead>
            <tr>
                <th>序号</th>
                <th>长度</th>
                <th>宽度</th>
                <th>数量</th>
                <th>标记</th>
                <th>面积</th>
                <th>单价</th>
                <th>合计金额</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
        <!--表格总数据汇总-->
        <div class="dataSummary-panel">
            <div class="item-panel">
                <span>总数量:</span> <span class="valPanel" id="invoiceTotalNumber">{{invoiceTotalNumber}}</span>
            </div>
            <div class="item-panel">
                <span>总面积:</span> <span class="valPanel" id="invoiceTotalArea">{{invoiceTotalArea}}</span>
            </div>
            <div class="item-panel">
                <span>总金额:</span> <span class="valPanel" id="invoiceTotalAmount">{{invoiceTotalAmount}}</span>
            </div>
            <div class="item-panel">
                <span>未付款:</span> <span class="valPanel" id="invoiceUnpaid">{{invoiceUnpaid}}</span>
            </div>
        </div>
        <!-- 公司信息提示信息区域 -->
        <div class="companyInfo-panel">
            <div class="row-panel">
                <span>温馨提示:请认真核对玻璃尺寸型号和数量,签字后视为确认,玻璃尺寸允许国际误差范围值正负3mm,</span>
            </div>
            <div class="row-panel">
                <span style="position: absolute;left: 70px">如玻璃有质量问题请在三个工作日提出,过后视为合格,有质量问题的玻璃我公司负责更换玻璃,不负责连带责任.</span>
            </div>
            <div class="row-panel">
                <div class="address-panel">
                    <div class="itemLeft-panel">
                        <span>地址:</span>
                    </div>
                    <div class="itemVal-panel">
                        <span>西安市未央区百花建材不锈钢市场南排44号</span>
                    </div>
                </div>
                <div class="addressTelephone-panel">
                    <div class="itemLeft-panel">
                        <span>电话:</span>
                    </div>
                    <div class="itemVal-panel">
                        <span>020-86207926</span>
                    </div>
                </div>
                <div class="addressTelephone-panel">
                    <div class="itemLeft-panel">
                        <span>传真:</span>
                    </div>
                    <div class="itemVal-panel">
                        <span>020-86207926</span>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="leftCon-panel">
                    <span>打印时间:</span> <span id="printTime"></span>
                </div>
                <div class="rightCon-panel">
                    <span>客户签字:</span> <span></span>
                </div>
            </div>
            <div class="row-panel">
                <div class="leftCon-panel">
                    <span>运输负责人:</span> <span id="transportationManager"></span>
                </div>
            </div>
        </div>
    </div>
    <!--出货管理[发货单]打印模板结束-->

    <!-- 开单打印模板开始 -->
    <div id="PrintTemplate">
        <h1>陕西伯益中空玻璃有限公司</h1>
        <h2>生产单</h2>
        <!-- 生产单客户基本信息 -->
        <div class="CustomerBasicInformatiofo-panel">
            <div class="item-panel">
                <div class="container-panel">
                    <span>客户名称:</span>
                </div>
                <div class="value-panel">
                    <span id="ProductionOrderName">xx</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>工程名称:</span>
                </div>
                <div class="value-panel">
                    <span id="ProductionOrderProdyctName">xxxx</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel" style="width:40%;text-align:center">
                    <span>单号:</span>
                </div>
                <div class="value-panel" style="width:60%;text-align:left">
                    <span id="ProductionOrderOrderNum">xxxx</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>联系电话:</span>
                </div>
                <div class="value-panel">
                    <span id="ProductionOrderProdyctCell">xxxx</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel">
                    <span>送货地址:</span>
                </div>
                <div class="value-panel">
                    <span id="ProductionOrderAddress">xxx</span>
                </div>
            </div>
            <div class="item-panel">
                <div class="container-panel" style="width:40%;text-align:center">
                    <span>日期:</span>
                </div>
                <div class="value-panel" style="width:60%;text-align:left">
                    <span id="ProductionOrderDate">xxxx</span>
                </div>
            </div>
        </div>
        <!-- 表格渲染模块 -->
        <table class="layui-table" id="ProductionOrderList"
               style="border:solid 2px black">
            <thead>
            <tr>
                <th>序号</th>
                <th>长度</th>
                <th>宽度</th>
                <th>数量</th>
                <th>标记</th>
                <th>面积</th>
                <th>附加工艺</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
        <!-- 公司信息区域 -->
        <div class="companyInfo-panel">
            <!--备注-->
            <div class="Remarks-panel">
                <div class="leftTops-pamnel">
                    <span>备注:</span>
                </div>
                <div class="RemarksVal-pamnel">
                    <p>各班在接前道工序流程卡时需要注意如下事项：</p>
                    <p>1.仔细核对客户名称,玻璃数量,规格,加工需求是否与加工单一致,标签是否与加工单一致</p>
                    <p>2.核对完成后在各工种栏里录入完成正次品数量,在各工种栏下签名确认,有次品及时回报补片.</p>
                </div>
            </div>
            <!--地址/电话/传真-->
            <div class="Address-telephone-fax-panel">
                <div class="item-panel">
                    <span>地址:</span> <span id="MerchantAddress">未央区百花建材不锈钢市场58-3</span>
                </div>
                <div class="item-panel">
                    <span>电话:</span> <span id="MerchantCell">13991480754</span>
                </div>
                <div class="item-panel">
                    <span>传真:</span> <span id="MerchantFax">13991480754</span>
                </div>
            </div>
        </div>
    </div>
    <!-- 打印模板结束 -->
    <!-- 采购登记悬浮层 -->
    <div id="PurchaseRegistrationSubmenu">
        <form class="layui-form layui-form-pane" action="" id="PurchaseForm">
            <div class="row-panel">
                <div class="layui-form-item">
                    <label class="layui-form-label">订单号:</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" style="cursor:pointer"
                               id="OriginalFilmorderNumber" readonly="readonly"
                               placeholder="自动生成" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">日期:</label>
                        <div class="layui-input-block">
                            <input type="text" style="cursor:pointer" readonly="readonly"
                                   placeholder="点击选择日期" name="date" id="OriginalFilmDateSelect"
                                   autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">供货商:</label>
                        <div class="layui-input-block">
                            <select lay-search="" lay-filter="OriginalFilmsupplier"
                                    id="OriginalFilmsupplier" name="OriginalFilmsupplier">
                                <option value="">点击选择供货商择名称</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">原片名称:</label>
                        <div class="layui-input-block">
                            <select lay-search="" lay-filter="OriginalFilmspecificationModel"
                                    id="OriginalFilmspecificationModel" name="OriginalFilmspecificationModel">
                                <option value="">点击选择原片名称</option>
                            </select>

                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">规格型号:</label>
                            <div class="layui-input-block">
                                <input type="text" id="OriginalFilmthickness"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">颜色:</label>
                            <div class="layui-input-block">
                                <input type="text" name="title" placeholder="请输入颜色"
                                       id="OriginalFilmcolor" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">数量:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="个" id="OriginalFilmquantity"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">单价:</label>
                            <div class="layui-input-block">
                                <input type="text" name="title" placeholder="￥"
                                       id="OriginalFilmunitPrice" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">采购总额:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="自动计算"
                                       id="OriginalFilmtotalPurchase" readonly="readonly"
                                       class="layui-input" style="cursor:not-allowed;">
                            </div>
                        </div>
                    </div>
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">运输费:</label>
                            <div class="layui-input-block">
                                <input type="text" name="title" placeholder="￥"
                                       id="OriginalFilmshippingFee" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">卸货费:</label>
                        <div class="layui-input-block">
                            <input type="text" placeholder="￥"
                                   id="OriginalunloadingFee" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
            <!--备注-->
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注:</label>
                <div class="layui-input-block">
        <textarea placeholder="请输入备注" class="layui-textarea"
                  id="OriginalFilmremarks"></textarea>
                </div>
            </div>
        </form>
        <!--按钮区域:写在表单外,防止表单内按钮触发表单提交-->
        <div class="row-panel">
            <div class="btns-panel">
                <button @click="purchaseRegistrationSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="purchaseRegistrationCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!-- 采购登记悬浮层结束 -->
    <!--配件采购悬浮层[新增]开始-->
    <div id="fittingAddSubmenu">
        <form class="layui-form layui-form-pane" action="">
            <div class="productImage-panel">
                <div class="layui-collapse">
                    <div class="layui-colla-item">
                        <h2 class="layui-colla-title">自定义添加配件时请点击</h2>
                        <div class="layui-colla-content" v-bind:class="{'layui-show': newAccessoriesState }">
                            <div class="productImagePanel" id="productUpIds">
                                <div class="blackElasticLayer" v-bind:style="{display:productLayerStatus}">
                                    <span>上传配件图片</span>
                                </div>
                                <img v-bind:src="productImageUrl" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">订单号:</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" style="cursor:pointer"
                                   id="fittingOrderNumberPanel" readonly="readonly"
                                   placeholder="自动生成" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">采购数量:</label>
                            <div class="layui-input-block">
                                <input type="text" placeholder="个" id="fittingpurchaseQuantity"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="details-panel">
                        <div class="layui-form-item">
                            <label class="layui-form-label">采购总额:</label>
                            <div class="layui-input-block">
                                <input type="text" name="title" placeholder="元"
                                       id="fittingtotalPurchase" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">日期:</label>
                        <div class="layui-input-block">
                            <input type="text" style="cursor:pointer" readonly="readonly"
                                   placeholder="点击选择日期" name="date" autocomplete="off"
                                   id="fittingOrderNumberDate" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">供货商:</label>
                        <div class="layui-input-block">
                            <select lay-search="" lay-filter="fittingSupplier"
                                    id="fittingSupplier" name="fittingSupplier">
                                <option value="">点击选择供货商择名称</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">配件名称:</label>
                        <div class="layui-input-block">
                            <%--配件采购(配件名称)： --%>
                            <select lay-search="" lay-filter="fittingSpecificationModel"
                                    id="fittingSpecificationModel" name="fittingSpecificationModel">
                                <option value="">直接搜索或选择</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <input type="text" name="title" placeholder="左边没有?点击此处手动输入" title="如果有选择配件名称,此处不可输入!"
                           class="layui-input" v-model="newAccessories" v-on:input="newAccessoriesInputFun"
                           @blur="newAccessoriesBlurFun" id="newAccessoriesInput">
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">付款明细:</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" placeholder="输入文本"
                                   id="fittingpaymentDetails" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="layui-form-item">
                        <label class="layui-form-label">其他费用:</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" placeholder="元"
                                   id="fittingOtherFee" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>
            <!--备注-->
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注:</label>
                <div class="layui-input-block">
        <textarea placeholder="请输入备注" class="layui-textarea"
                  id="fittingRemarks"></textarea>
                </div>
            </div>
        </form>
        <!--按钮区域:写在表单外,防止表单内按钮触发表单提交-->
        <div class="row-panel">
            <div class="btns-panel">
                <button @click="fittingSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="purchaseRegistrationCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--配件采购悬浮层[新增]结束-->

    <!--出货管理 编辑发货信息悬浮层-->
    <div id="editShippingInformation">

    </div>

    <!--
            出货管理新增悬浮层
    -->
    <div id="shipmentAddSubmenu">
        <div class="shipmentAddCon-panel layui-form">
            <!--当前所查询订单型号详情-->
            <div class="OrderModel-panel">
                <!-- 表格渲染模块 -->
                <table class="layui-table" id="OrderModelList" lay-filter="OrderModelList">
                    <thead>
                    <tr>
                        <th class="layui-bg-cyan">序号</th>
                        <th class="layui-bg-cyan">长度</th>
                        <th class="layui-bg-cyan">宽度</th>
                        <th class="layui-bg-cyan">总数量</th>
                        <th class="layui-bg-cyan">标记</th>
                        <th class="layui-bg-cyan">面积</th>
                        <th class="layui-bg-cyan">发货数量</th>
                        <th class="layui-bg-cyan">发货金额</th>
                        <th class="layui-bg-cyan">发货面积</th>
                        <th class="layui-bg-cyan">已发货数量</th>
                        <th class="layui-bg-cyan">剩余数量</th>
                        <th class="layui-bg-cyan">单价</th>
                        <th class="layui-bg-cyan">总金额</th>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
        <div class="foot-panel">
            <div class="btn-panel">
                <button class="layui-btn" @click="addShipmentSubmitFun" v-bind:style="{background:BtnColor}">提交</button>
                <button class="layui-btn" @click="shipmentAddCloseFun" v-bind:style="{background:BtnColor}">取消</button>
            </div>
        </div>
    </div>

    <!--出货管理{新增}提交数据时选择 运输负责人/运费/付款明细-->
    <div id="invoiceTransport-panel" class="layui-form">
        <div class="row-panel">
            <div class="itemLeft-panel">
                <span>运输负责人:</span>
            </div>
            <div class="itemRight-panel">
                <input type="text" v-model="invoiceTransportationManager" placeholder="请输入" class="layui-input">
            </div>
        </div>
        <div class="row-panel">
            <div class="itemLeft-panel">
                <span>运费:</span>
            </div>

            <div class="itemRight-panel">
                <input type="text" v-model="invoiceFreight"  placeholder="请输入" class="layui-input" style="width: 210px;float: left">
                <div style="float: left;margin-top: 5px;margin-left: 10px">
                    <input type="checkbox" title="已支付" style="float: left;" lay-filter="freightSwitch">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="itemLeft-panel">
                <span>付款明细:</span>
            </div>
            <div class="itemRight-panel">
                <textarea name="desc" v-model="invoicePaymentDetails" placeholder="请输入内容"
                          class="layui-textarea"></textarea>
            </div>
        </div>
    </div>

    <!--客户信息管理:新增客户悬浮层-->
    <div id="addClientSubmenu" class="layui-form">
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>客户类型:</span>
                </div>
                <div class="val-panel">
                    <select name="customerTypeSelectPanel" lay-filter="customerTypeSelectPanel"
                            id="customerTypeSelectPanel">
                        <option value=""></option>
                        <option value="0" selected="">普通用户</option>
                        <option value="1">vip用户</option>
                    </select>
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>客户名称:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="clientNameVal" class="layui-input" placeholder="2～5位汉字" maxlength="5">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>公司名称:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="companyNameVal" class="layui-input" placeholder="5~10位汉字"
                           maxlength="10">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>发票税号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="invoiceTaxNumberVal" class="layui-input" placeholder="15～20位税号码"
                           maxlength="20">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>联系地址:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="contactAddressVal" class="layui-input" placeholder="5~17位 汉字,数字,字母组合"
                           maxlength="17">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>手 机 号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="phoneNumberVal" class="layui-input" placeholder="11位纯数字" maxlength="11">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>微 信 号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="weChatNumberVal" class="layui-input" placeholder="6~14位 英文,字母,数字组合"
                           maxlength="14">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>电子邮箱:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="mailboxVal" class="layui-input" placeholder="12~21位 数字,符号,英文组合"
                           maxlength="21">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>开户银行:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="bankAccountVal" class="layui-input" placeholder="输入卡号自动读取所属银行" maxlength="19">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>银行卡号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" class="layui-input" placeholder="16~19位纯数字" v-on:input="addClientBankCardRealTimeInput" v-model="bankCardNumberVal" maxlength="19">
                </div>
            </div>
        </div>
        <!--       <div class="foot-panel">
                   <i class="layui-icon layui-icon-star-fill" style="font-size: 18px; color: #FF5722;"></i>
                   <span>贴心提示:为了节约您的宝贵时间,提交前请务必检查每一项数据的准确性!</span>
               </div>-->
    </div>
    <!--编辑客户悬浮层-->
    <div id="editClientSubmenu" class="layui-form">
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>客户类型:</span>
                </div>
                <div class="val-panel">
                    <select name="editCustomerTypeSelectPanel" lay-filter="editCustomerTypeSelectPanel"
                            id="editCustomerTypeSelectPanel">
                        <option value=""></option>
                        <option value="0" selected="">普通用户</option>
                        <option value="1">vip用户</option>
                    </select>
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>客户名称:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editClientNameVal" class="layui-input" placeholder="2～5位汉字"
                           maxlength="5">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>公司名称:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editCompanyNameVal" class="layui-input" placeholder="5~10位汉字"
                           maxlength="10">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>发票税号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editInvoiceTaxNumberVal" class="layui-input" placeholder="15～20位税号码"
                           maxlength="20">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>联系地址:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editContactAddressVal" class="layui-input"
                           placeholder="5~17位 汉字,数字,字母组合" maxlength="17">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>手 机 号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editPhoneNumberVal" class="layui-input" placeholder="11位纯数字"
                           maxlength="11">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>微 信 号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editWeChatNumberVal" class="layui-input" placeholder="6~14位 英文,字母,数字组合"
                           maxlength="14">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>电子邮箱:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editMailboxVal" class="layui-input" placeholder="12~21位 数字,符号,英文组合"
                           maxlength="21">
                </div>
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <div class="left-panel">
                    <span>开户银行:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editBankAccountVal" class="layui-input" placeholder="4~9位纯汉字"
                           maxlength="9">
                </div>
            </div>
            <div class="item-panel">
                <div class="left-panel">
                    <span>银行卡号:</span>
                </div>
                <div class="val-panel">
                    <input type="text" v-model="editBankCardNumberVal" class="layui-input" placeholder="16~19位纯数字"
                           maxlength="19">
                </div>
            </div>
        </div>
        <!--      <div class="foot-panel">
                  <i class="layui-icon layui-icon-star-fill" style="font-size: 18px; color: #FF5722;"></i>
                  <span>贴心提示:为了节约您的宝贵时间,提交前请务必检查每一项数据的准确性!</span>
              </div>-->
    </div>
    <!--基础信息[原片信息]新增悬浮层-->
    <div id="addProductSubmenu">
        <div class="row-panel">
            <div class="left-panel">
                <span>原片名称:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="productNameVal" class="layui-input" placeholder="原片名称(厚度|具体型号)"
                       maxlength="33">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>颜色:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="productColor" class="layui-input" placeholder="2～5位汉字"
                       maxlength="5">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>规格型号:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="productLength" class="length-panel layui-input">
                <span>x</span>
                <input type="text" v-model="productWidth" class="width-panel layui-input">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>单价:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="originalFilmUnitPriceVal" class="layui-input" placeholder="元"
                       maxlength="11">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>折扣价:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="originalFilmWholesalePriceVal" class="layui-input" placeholder="元"
                       maxlength="9">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>备注:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="originalFilmRemarksVals" placeholder="备注" class="layui-input">
            </div>
        </div>
    </div>
    <!--基础信息[原片采购][原片名称]多个规格型号选择-->
    <div id="MultipleSpecificationsSubmenu" class="layui-form" style="display: none">
        <div class="contentContainer">

        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button class="layui-btn" @click="MultipleSpeciSubmitFun"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button class="layui-btn" @click="MultipleSpeciCancelFun"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--基础信息[原片信息]编辑悬浮层-->
    <div id="editProductSubmenu">
        <div class="row-panel">
            <div class="left-panel">
                <span>原片名称:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editProductNameVal" class="layui-input" placeholder="原片名称(厚度|具体型号)"
                       maxlength="33"> 
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>颜色:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editProductColor" class="layui-input" placeholder="2～5位汉字"
                       maxlength="5">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>规格型号:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editProductLength" class="length-panel layui-input">
                <span>x</span>
                <input type="text" v-model="editProductWidth" class="width-panel layui-input">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>单价:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editOriginalFilmUnitPriceVal" class="layui-input" placeholder="元"
                       maxlength="11">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>折扣价:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editOriginalFilmWholesalePriceVal" class="layui-input" placeholder="元"
                       maxlength="9">
            </div>
        </div>
        <div class="row-panel">
            <div class="left-panel">
                <span>备注:</span>
            </div>
            <div class="val-panel">
                <input type="text" v-model="editOriginalFilmRemarksVals" placeholder="备注" class="layui-input">
            </div>
        </div>
    </div>
    <!--基础信息[配件信息]新增悬浮层-->
    <div id="addFittingSubmenu">
        <div class="imageRow-panel">
            <div class="image-panel" id="productImgPanel">
                <div class="blackElasticLayer" v-bind:style="{display:productLayerStatus}">
                    <span>上传配件图片</span>
                </div>
                <img v-bind:src="productImageUrl" alt="">
            </div>
        </div>
        <div class="row-panel">
            <div class="vessel-panel">
                <input type="text" class="layui-input" v-model="productModelVal" placeholder="输入规格型号">
            </div>
        </div>
    </div>
    <!--出货管理[查看详情]悬浮层--->
    <div id="shipmentSeeDetailsSubmenu">
        <div class="row-panel">
            <!--订单号/客户姓名/运输负责人/运费/运费支付状态-->
            <div class="item-panel">
                <span class="tips-panel" style="margin-left: 20px">订单号:</span>
                <span class="val-panel" id="shipOrderNumber"></span>
            </div>
            <div class="item-panel">
                <span class="tips-panel">客户姓名:</span>
                <span class="val-panel" id="shipClientName"></span>
            </div>
            <div class="item-panel">
                <span class="tips-panel">运输负责人:</span>
                <span class="val-panel" id="shipPeople"></span>
            </div>
            <div class="item-panel">
                <span class="tips-panel">运费:</span>
                <span class="val-panel" id="shipFreight"></span>
            </div>
            <div class="item-panel">
                <span class="tips-panel">运费支付状态:</span>
                <span class="val-panel" id="shipFreightPaymentStatus"></span>
            </div>
        </div>
        <!--当前所查询出货订单型号详情-->
        <div class="shipOrderModel-panel">
            <!-- 表格渲染模块 -->
            <table class="layui-table" id="shipOrderList" lay-filter="shipOrderList">
                <thead>
                <tr>
                    <th class="layui-bg-cyan">序号</th>
                    <th class="layui-bg-cyan">长度</th>
                    <th class="layui-bg-cyan">宽度</th>
                    <th class="layui-bg-cyan">总数量</th>
                    <th class="layui-bg-cyan">标记</th>
                    <th class="layui-bg-cyan">面积</th>
                    <th class="layui-bg-cyan">当前发货数量</th>
                    <th class="layui-bg-cyan">发货金额</th>
                    <th class="layui-bg-cyan">发货面积</th>
                    <th class="layui-bg-cyan">已发货数量</th>
                    <th class="layui-bg-cyan">剩余数量</th>
                    <th class="layui-bg-cyan">单价</th>
                    <th class="layui-bg-cyan">总金额</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    </div>
    <!--[收入管理]编辑条目悬浮层-->
    <div id="revenueEditSubmenu" style="display: none">
        <!--客户名称/工程名称/付款方式/卡号|账号/付款金额/收款人/备注-->
        <div class="row-panel">
            <div class="item-panel">
                <span>客户名称:</span>
                <input type="text" placeholder="客户名称" class="layui-input" v-model="EditRevenueClientName">
            </div>
            <div class="item-panel">
                <span>工程名称:</span>
                <input style="width: 235px" type="text" placeholder="工程名称" class="layui-input" v-model="EditRevenueProjuctName">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 15px">付款方式:</span>
                <input type="text" placeholder="工程名称" class="layui-input" v-model="EditRevenuePayMethod">
            </div>
            <div class="item-panel">
                <span>卡号/账号:</span>
                <input type="text" placeholder="卡号/账号" class="layui-input" v-model="EditRevenueCaedNum">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>付款金额:</span>
                <input type="text" placeholder="付款金额" class="layui-input" v-model="EditRevenuePayAmount">
            </div>
            <div class="item-panel">
                <span style="margin-right: 30px">收款人:</span>
                <input type="text" placeholder="收款人" class="layui-input" v-model="EditRevenuePayee">
            </div>
        </div>
        <div class="row-panel">
            <div class="remarks-panel">
                <span style="margin-right:40px">备注:</span>
                <input type="text" placeholder="备注" class="layui-input" v-model="EditRevenueRemarks">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button class="layui-btn" @click="revenueEditSubmitFun"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button class="layui-btn" @click="revenueEditCancelFun"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--[收入管理]添加其他收入项-->
    <div id="addOtherRevenueSubmenu" style="display: none">
        <!--客户名称 收款人 收款金额 收入备注-->
        <div class="row-panel" style="margin-top: 10px">
            <div class="item-panel">
                <span>客户名称:</span>
                <input type="text" class="layui-input" placeholder="客户名称" v-model="OtherRevenueClientName">
            </div>
            <div class="item-panel">
                <span style="margin-right: 20px">收款人:</span>
                <input type="text" class="layui-input" placeholder="收款人" v-model="OtherRevenuePayee">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>收款金额:</span>
                <input type="text" class="layui-input" placeholder="金额" v-model="OtherRevenueAmount">
            </div>
            <div class="item-panel">
                <span>收入备注:</span>
                <input type="text" class="layui-input" placeholder="备注" v-model="OtherRevenueAmountRemarks">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button class="layui-btn" @click="revenueSubmitFun"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button class="layui-btn" @click="revenueCancelFun"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--添加收入悬浮层-->
    <div id="addRevenueSubmenu" class="layui-form">
        <div class="inputArea">
            <div class="row-panel">
                <div class="item-panel">
                    <div class="left-panel">
                        <span>订单号:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input" placeholder="自动获取" v-model="addRevenueOrderVal">
                    </div>
                </div>
                <div class="item-panel">
                    <div class="left-panel">
                        <span>日期:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input not_allowed" placeholder="当前服务器时间"
                               v-model="addRevenueTime" readonly>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="left-panel">
                        <span>客户名称:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input" placeholder="自动获取" v-model="addRevenueClientNameVal">
                    </div>
                </div>
                <div class="item-panel">
                    <div class="left-panel">
                        <span>收款人:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input" placeholder="该客户没有录入收款人" v-model="addRevenuePayee">
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="left-panel">
                        <span>付款方式:</span>
                    </div>
                    <div class="right-panel">
                        <select name="incomePaymentMethod" lay-filter="incomePaymentMethod"
                                id="incomePaymentMethod">
                            <option value=""></option>
                            <option value="0" selected="">银行卡</option>
                            <option value="1">支付宝</option>
                            <option value="2">微信</option>
                            <option value="3">现金</option>
                        </select>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="left-panel">
                        <span>卡号(账号):</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" id="addRevenueCard" placeholder="支付宝/微信/银行卡号" class="layui-input"
                               v-model="addRevenueCardVal">
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <div class="item-panel">
                    <div class="left-panel">
                        <span>收款金额:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input" placeholder="¥" v-model="addRevenueCollectionAmount">
                    </div>
                </div>
                <div class="item-panel">
                    <div class="left-panel">
                        <span>备注:</span>
                    </div>
                    <div class="right-panel">
                        <input type="text" class="layui-input" placeholder="不是订单内收款清填写" v-model="addRevenueRemarks">
                    </div>
                </div>
            </div>
        </div>
        <div class="btnArea">
            <div class="btn-panel">
                <button @click="addRevenueSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="addRevenueCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--[添加支出]悬浮层-->
    <div id="payAddSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span>支出类别:</span>
                <input type="text" placeholder="支出类别" class="layui-input" v-model="payAddOutlayType">
            </div>
            <div class="item-panel">
                <span>付款方式:</span>
                <input type="text" placeholder="付款方式" class="layui-input" v-model="payAddPaymentMethod">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>付款金额:</span>
                <input type="text" placeholder="付款金额" class="layui-input" v-model="payAddPaymentAmount">
            </div>
            <div class="item-panel">
                <span style="margin-right:26px">收款人:</span>
                <input type="text" placeholder="收款人" class="layui-input" v-model="payAddBeneficiary">
            </div>
        </div>
        <div class="remarks-panel">
            <span style="margin-right:43px">备注:</span>
            <input type="text" placeholder="备注" class="layui-input" style="width: 387px" v-model="payAddRemarks">
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="payAddSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="payAddCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--[编辑支出]条目悬浮层-->
    <div id="payEditSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span>支出类别:</span>
                <input type="text" placeholder="支出类别" class="layui-input" v-model="payEditOutlayType">
            </div>
            <div class="item-panel">
                <span>付款方式:</span>
                <input type="text" placeholder="付款方式" class="layui-input" v-model="payEditPaymentMethod">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>付款金额:</span>
                <input type="text" placeholder="付款金额" class="layui-input" v-model="payEditPaymentAmount">
            </div>
            <div class="item-panel">
                <span style="margin-right:25px">供货商:</span>
                <input type="text" placeholder="供货商" class="layui-input" v-model="payEditSupperName">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right:25px">收款人:</span>
                <input type="text" placeholder="收款人" class="layui-input" v-model="payEditBeneficiary">
            </div>
            <div class="item-panel">
                <span style="margin-right:40px">备注:</span>
                <input type="text" placeholder="备注" class="layui-input" v-model="payEditRemarks">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="payEditSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="payEditCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--编辑考勤信息悬浮层-->
    <div id="EditAttendanceSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 42px">员工姓名:</span>
                <input type="text" class="layui-input" placeholder="员工姓名" v-model="EditAttendanceName">
            </div>
            <div class="item-panel">
                <span style="margin-right: 42px">员工工号:</span>
                <input type="text" class="layui-input specialStyle" placeholder="工号" v-model="EditAttendanceJobNumber">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 42px">员工部门:</span>
                <input type="text" class="layui-input" placeholder="部门" v-model="EditAttendanceDivision">
            </div>
            <div class="item-panel">
                <span style="margin-right: 42px">请假天数:</span>
                <input type="text" class="layui-input specialStyle" placeholder="请假天数" v-model="EditAttendanceAskForLeaveDays">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 42px">事假天数:</span>
                <input type="text" class="layui-input" placeholder="事假天数" v-model="EditAttendanceLeaveDays">
            </div>
            <div class="item-panel">
                <span style="margin-right: 42px">病假天数:</span>
                <input type="text" class="layui-input specialStyle" placeholder="病假天数" v-model="EditAttendanceSickLeaveDays">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>实际出勤天数:</span>
                <input type="text" class="layui-input" placeholder="实际出勤天数" v-model="EditAttendanceActualAttendanceDays">
            </div>
            <div class="item-panel">
                <span style="margin-right: 26px">应出勤天数:</span>
                <input type="text" class="layui-input specialStyle" placeholder="应出勤天数" v-model="EditAttendanceDaysToAttend">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="EditAttendanceSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="EditAttendanceCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--[发放工资]悬浮层-->
    <div id="salaryAddSubmenu" style="display: none" class="layui-form">
        <div class="row-panel">
            <div class="special-panel">
                <div class="tips-panel">
                    <span class="specialStyle" style="line-height: 40px">员工姓名:</span>
                </div>
                <div class="val-panel">
                    <select name="salaryAddNameOfWorker" id="salaryAddNameOfWorker" lay-filter="salaryAddNameOfWorker">
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="item-panel">
                <span>员工工号:</span>
                <input type="text" class="layui-input" placeholder="工号" style="width:260px" v-model="salaryAddJobNumber">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 22px">职位|岗位:</span>
                <input type="text" class="layui-input" placeholder="职位|岗位" v-model="salaryAddDepartment">
            </div>
            <div class="item-panel">
                <span>基本工资:</span>
                <input type="text" class="layui-input" placeholder="基本工资" style="width:260px" v-model="salaryAddBasicWage">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span class="specialStyle">岗位补贴:</span>
                <input type="text" class="layui-input" placeholder="岗位补贴" v-model="salaryAddJobSubsidy">
            </div>
            <div class="item-panel">
                <span>应发工资:</span>
                <input type="text" class="layui-input" placeholder="应发工资" style="width:260px" v-model="salaryAddPayable">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span class="specialStyle">考勤扣款:</span>
                <input type="text" class="layui-input" placeholder="考勤扣款" v-model="salaryAddAttendanceDeduction">

            </div>
            <div class="item-panel">
                <span>实发工资:</span>
                <input type="text" class="layui-input" placeholder="实发工资" style="width:260px" v-model="salaryAddRealWage">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>个人所得税:</span>
                <input type="text" class="layui-input" placeholder="个人所得税" v-model="salaryAddPersonalIncomeTax">
            </div>
            <div class="item-panel">
                <span style="margin-right:42px">备注:</span>
                <input type="text" class="layui-input" placeholder="备注" style="width:260px" v-model="salaryAddRemark">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="salaryAddSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="salaryAddCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <div id="salaryEditSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span>员工姓名:</span>
                <input type="text" class="layui-input" v-model="salaryEditNameOfWorker">
            </div>
            <div class="item-panel">
                <span style="margin-right:25px">员工工号:</span>
                <input type="text" class="layui-input" v-model="salaryEditEmployeeNumber">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span >基本工资:</span>
                <input type="text" class="layui-input" v-model="salaryEditBasicWage">
            </div>
            <div class="item-panel">
                <span style="margin-right:25px">岗位补贴:</span>
                <input type="text" class="layui-input" v-model="salaryEditJobSubsidy">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>应发工资:</span>
                <input type="text" class="layui-input" v-model="salaryEditPayable">
            </div>
            <div class="item-panel">
                <span style="margin-right:25px">考勤扣款:</span>
                <input type="text" class="layui-input" v-model="salaryEditAttendanceDeduction">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>实发工资:</span>
                <input type="text" class="layui-input" v-model="salaryEditRealWage">
            </div>
            <div class="item-panel">
                <span>个人所得税:</span>
                <input type="text" class="layui-input" v-model="salaryEditPersonalIncomeTax">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="salaryEditSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="salaryEditCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--添加员工-->
    <div id="employeeAddSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span>员工姓名:</span>
                <input type="text" class="layui-input" style="margin-right: 30px" v-model="employeeAddName">
            </div>
            <div class="item-panel">
                <span>出生年月:</span>
                <input type="text" class="layui-input" placeholder="点击选择日期" readonly="readonly" style="cursor: pointer" id="employeeAddBornDate">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>员工工号:</span>
                <input type="text" class="layui-input" style="margin-right: 30px" v-model="employeeAddJobNumber">
            </div>
            <div class="item-panel">
                <span>员工部门:</span>
                <input type="text" class="layui-input" v-model="employeeAddDivision">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>员工职务:</span>
                <input type="text" class="layui-input" style="margin-right: 30px" v-model="employeeAddPosition">
            </div>
            <div class="item-panel">
                <span>基本工资:</span>
                <input type="text" class="layui-input" v-model="employeeAddBasicWage">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 25px">手机号:</span>
                <input type="text" class="layui-input" style="margin-right: 30px;" v-model="employeeAddPhoneNumber">
            </div>
            <div class="item-panel">
                <span>入职日期:</span>
                <input type="text" class="layui-input" readonly="readonly" placeholder="点击选择日期" style="cursor: pointer" id="employeeAddDateOfEntryDate">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="employeeAddSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="employeeAddCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--[编辑员工]悬浮层-->
    <div id="employeeEditSubmenu" style="display: none">
        <div class="row-panel">
            <div class="item-panel">
                <span>员工姓名:</span>
                <input type="text" class="layui-input" v-model="employeeEditName">
            </div>
            <div class="item-panel">
                <span>出生年月:</span>
                <input type="text" class="layui-input" placeholder="点击选择日期" readonly="readonly" style="cursor: pointer" id="employeeEditBornDate">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>员工工号:</span>
                <input type="text" class="layui-input"  v-model="employeeEditJobNumber">
            </div>
            <div class="item-panel">
                <span>员工部门:</span>
                <input type="text" class="layui-input" v-model="employeeEditDivision">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span>员工职务:</span>
                <input type="text" class="layui-input" v-model="employeeEditPosition">
            </div>
            <div class="item-panel">
                <span>基本工资:</span>
                <input type="text" class="layui-input" v-model="employeeEditBasicWage">
            </div>
        </div>
        <div class="row-panel">
            <div class="item-panel">
                <span style="margin-right: 25px">手机号:</span>
                <input type="text" class="layui-input" v-model="employeeEditPhoneNumber">
            </div>
            <div class="item-panel">
                <span>入职日期:</span>
                <input type="text" class="layui-input" readonly="readonly" placeholder="点击选择日期" style="cursor: pointer" id="employeeEditDateOfEntryDate">
            </div>
        </div>
        <div class="row-panel">
            <div class="btn-panel">
                <button @click="employeeEditSubmitFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">提交
                </button>
                <button @click="employeeEditCancelFun" class="layui-btn"
                        v-bind:style="{background:BtnColor}">取消
                </button>
            </div>
        </div>
    </div>
    <!--加载动画-->
    <div id="loading" v-bind:style="{display:loadingStatus}">
        <div id="loading-center">
            <div id="loading-center-absolute">
                <div class="object" id="object_one"></div>
                <div class="object" id="object_two"></div>
                <div class="object" id="object_three"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>