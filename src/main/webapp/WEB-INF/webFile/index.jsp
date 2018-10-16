<%@page import="com.lk.db.User"%>
<%@page import="org.json.JSONObject"%>
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
<title>首页</title>
<%--引入jQuery --%>
<script src="jquery/jquery-3.3.1.min.js"></script>
<%--头像裁减 --%>
<link rel="stylesheet" href="jquery/jquery.Jcrop.css">
<script src="jquery/jquery.Jcrop.js"></script>
<%--引入Vue --%>
<script src="vue/vue.min.js"></script>
<%--仿 Excel效果的表格插件 --%>
<script type="text/javascript"
	src="handsontable/handsontable.full.min.js"></script>
<link rel="stylesheet" href="handsontable/handsontable.full.min.css">
<%--引入jquery打印插件 --%>
<script type="text/javascript" src="jquery/jquery.jqprint-0.3.js"></script>
<script>
	jQuery.browser = {};
	(function() {
		jQuery.browser.msie = false;
		jQuery.browser.version = 0;
		if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
			jQuery.browser.msie = true;
			jQuery.browser.version = RegExp.$1;
		}
	})();
</script>
<%--引入Layer --%>
<script type="text/javascript" src="layer/layer.js"></script>
<%--引入Layui --%>
<script src="layui/layui.js"></script>
<link rel="stylesheet" href="layui/css/layui.css">
<%-- 引入工具类--%>
<script src="js/LkCommon.js"></script>
<%--当前页面布局与交互文件 --%>
<script src="js/index.js"></script>
<link rel="stylesheet" href="css/index.css">
<%--打印模板样式 --%>
<link rel="stylesheet" href="css/Preview.css">
<%--引入字体库 --%>
<link rel="stylesheet" href="font/iconfont.css">
<link rel="icon" type="image/x-icon" href="img/logo.ico" />
<jsp:include page="islogin.jsp"></jsp:include>
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
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-dingdandaifukuan"></i><span>订单管理</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="OrderInfoFun"><a href="javascript:;"><span>订单信息管理</span></a></li>
									<li @click="OrderMonthlyFun"><a href="javascript:;"><span>订单月结管理</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-kehuguanli"></i><span>客户管理</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="CustomerInfoFun"><a href="javascript:;"><span>客户信息管理</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-caiwuguanli"></i><span>财务管理</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="revenueInfoFun"><a href="javascript:;"><span>收入管理</span></a></li>
									<li @click="expenditureInfoLFun"><a href="javascript:;"><span>支出管理</span></a></li>
									<li @click="financeReportFun"><a href="javascript:;"><span>财务报表</span></a></li>
									<li @click="reconciliationFun"><a href="javascript:;"><span>客户对账</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-tongjibaobiao"></i><span>统计报表</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li><a href="javascript:;"><span>客户趋势报表</span></a></li>
									<li><a href="javascript:;"><span>订单趋势报表</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-yuangongguanli"></i><span>员工管理</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="AttendanceInfoFun"><a href="javascript:;"><span>考勤管理</span></a></li>
									<li @click="salaryGivingFun"><a href="javascript:;"><span>工资发放</span></a></li>
									<li @click="employeeInfoFun"><a href="javascript:;"><span>员工信息</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-jichuxinxi"></i><span>基础信息</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="CustomerInfoFun"><a href="javascript:;"><span>客户信息</span></a></li>
									<li @click="OriginalInfoFun"><a href="javascript:;"><span>原片信息</span></a></li>
									<li @click="AttachmentInfoFun"><a href="javascript:;"><span>附件信息</span></a></li>
								</ul></li>
							<li class="nav-item"><a href="javascript:;"><i
									class="my-icon nav-icon iconfont icon-xitong"></i><span>系统设置</span><i
									class="my-icon nav-more iconfont icon-arrow-right"></i></a>
								<ul>
									<li @click="basicSettingsFun"><a href="javascript:;"><span>基本设置</span></a></li>
									<li @click="contactUsFun"><a href="javascript:;"><span>联系我们</span></a></li>
								</ul></li>
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
                                    <select lay-search="" lay-filter="test" name="deliveryAddressSelectPanel">
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
		                                    <select lay-search="" lay-filter="test" name="contactNumberSelectPanel">
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
                                                    <select lay-search="" lay-filter="" name="finishDeliverySelectPanel">
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
                                                    <select lay-search="" lay-filter="test" name="CustomTemplateSelectPanel">
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
											v-bind:style="{background:BtnColor}">开单</button>
										<button @click="orderBtnQueryFun"
											class="layui-btn layui-btn-normal"
											v-bind:style="{background:BtnColor}">查询</button>
										<button class="layui-btn layui-btn-normal"
											v-bind:style="{background:BtnColor}" @click="DeleteOrderFun">删除</button>
										<button class="layui-btn layui-btn-normal"
											@click="ExportOrderFun" v-bind:style="{background:BtnColor}">导出订单</button>
										<button class="layui-btn layui-btn-normal"
											@click="orderDetailsFun" v-bind:style="{background:BtnColor}">订单详情</button>
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
														<select lay-search="" lay-filter=""
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
														<select lay-search="" lay-filter=""
															name="supplierSelectPanel">
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
														<select lay-search="" lay-filter="test"
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
												v-bind:style="{background:BtnColor}">采购登记</button>
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">报表</button>
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
										</div>
									</div>
									<!--原片采购数据表格1-->
									<div class="OriginaFlilmListTable-panel">
										<table id="OriginaFlilmList" lay-filter="OriginaFlilmList"></table>
									</div>
								</div>
								<!--附件采购-->
								<div class="layui-tab-item">
									<div class="layui-tab-item layui-show">
										<!--条件选择框-->
										<div class="layui-row layui-col-space10">
											<div class="layui-col-md3">
												<div class="item-panel layui-form">
													<div class="layui-form-item">
														<label class="layui-form-label">单号</label>
														<div class="layui-input-block">
															<select lay-search="" lay-filter=""
																name="annexoddNumberSelectPanel">
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
															<select lay-search="" lay-filter=""
																name="annexsupplierSelectPanel">
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
															<select lay-search="" lay-filter="test"
																name="annexRemarksSelectPanel">
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
												<button class="layui-btn layui-btn-normal">采购登记</button>
												<button class="layui-btn layui-btn-normal">报表</button>
												<button class="layui-btn layui-btn-normal">查询</button>
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
								<!--产品名称查询-->
								<div class="ProductNameCheck-panel layui-form">
									<div class="layui-form-item">
										<label class="layui-form-label">产品名称</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter=""
												name="outOfTheLibraryproductNameSelectPanel">
												<option value="">选择或输入产品名称</option>
											</select>
										</div>
									</div>
								</div>
								<!--按钮-->
								<div class="btn-panel">
									<button class="layui-btn layui-btn-warm">查询</button>
								</div>
							</div>
						</div>
						<!--数据表格区域-->
						<div class="layui-row">
							<!--表格顶部按钮区域-->
							<div class="tableTopBtn-panel">
								<div class="btn-panel">
									<button class="layui-btn layui-btn-normal">新增</button>
									<button class="layui-btn layui-btn-normal">删除</button>
									<button class="layui-btn layui-btn-normal">导出</button>
									<button class="layui-btn layui-btn-normal">报表</button>
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
										<label class="layui-form-label">产品名称</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter=""
												name="stockProductNameSelectPanel">
												<option value="">直接选择或手动输入产品名称</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="layui-col-md3">
								<div class="item-panel layui-form">
									<div class="layui-form-item">
										<label class="layui-form-label">规格</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter="test"
												name="stockspecificationSelectPanel">
												<option value="">直接选择或手动输入规格</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="layui-col-md3">
								<div class="item-panel layui-form">
									<div class="layui-form-item">
										<label class="layui-form-label">纹理查询</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter="test"
												name="stockTextureSelectPanel">
												<option value="">直接选择或手动输入纹理</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="layui-col-md3">
								<div class="item-panel layui-form">
									<div class="layui-form-item">
										<label class="layui-form-label">厚度</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter="test"
												name="stockthicknessSelectPanel">
												<option value="">直接选择或手动输入厚度</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--库存管理数据表格-->
						<div class="layui-row">
							<!--表格顶部按钮区域-->
							<div class="tableTopBtn-panel">
								<div class="btn-panel">
									<button class="layui-btn layui-btn-normal">新增</button>
									<button class="layui-btn layui-btn-normal">删除</button>
									<button class="layui-btn layui-btn-normal">导出</button>
									<button class="layui-btn layui-btn-normal">报表</button>
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
			<!--订单月结管理-->
			<div class="layui-body" style="top: 80px;"
				v-bind:style="{display:OrderMonthStatus}">
				<div class="padding15-panel">
					<div class="layui-row content-panel" id="OrderMonth-panel">
						<div class="title-panel">
							<span>订单月结管理</span>
						</div>
						<!--月结编号查询-->
						<div class="layui-row onlyNumber-panel layui-form">
							<div class="condition-panel">
								<div class="text-panel">
									<div class="layui-form-item">
										<label class="layui-form-label">月结编号</label>
										<div class="layui-input-block">
											<select lay-search="" lay-filter=""
												name="OrderMonthSelectPanel">
												<option value="">选择或输入月结编号</option>
											</select>
										</div>
									</div>
								</div>
								<div class="btn-panel">
									<button v-bind:style="{background:BtnColor}"
										class="layui-btn layui-btn-normal">查询</button>
								</div>
							</div>
						</div>
						<!--数据表格区域-->
						<div class="layui-row OrderMonthListBtn-panel">
							<div class="btn-panel">
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">收款登记</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">导出月单</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">报表</button>
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
											<select lay-search="" lay-filter=""
												name="customerNameSelectPanel">
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
									<button class="layui-btn layui-btn-normal"
										v-bind:style="{background:BtnColor}">查询</button>
								</div>
							</div>
						</div>
						<!--按钮区域-->
						<div class="layui-row btnParent-panel">
							<div class="btn-panel">
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">新增客户</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">删除客户</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">客户编辑</button>
							</div>
						</div>
						<!--数据表格区域-->
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
									<button class="layui-btn layui-btn-normal"
										v-bind:style="{background:BtnColor}">查询</button>
								</div>
							</div>
							<div class="layui-col-md3"></div>
						</div>
						<!--按钮区域-->
						<div class="layui-row btnParent-panel">
							<div class="btn-panel">
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">新增</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">导出</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">打印</button>
							</div>
						</div>
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
									<button class="layui-btn layui-btn-normal"
										v-bind:style="{background:BtnColor}">查询</button>
								</div>
							</div>
							<div class="layui-col-md3"></div>
						</div>
						<!--按钮区域-->
						<div class="layui-row btnParent-panel">
							<div class="btn-panel">
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">新增</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">导出</button>
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">打印</button>
							</div>
						</div>
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
										<select lay-search="" lay-filter=""
											name="customerNameSelectPanel">
											<option value="">直接选择或输入客户姓名</option>
										</select>
									</div>
								</div>
							</div>
							<div class="queryBtn-panel">
								<button class="layui-btn layui-btn-normal"
									v-bind:style="{background:BtnColor}">查询</button>
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
								<div class="lump-panel" @click="OriginalDocumentFun">
									<img src="img/bg1.jpeg" alt="">
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
								<div class="lump-panel">
									<!--客户原始单据-->
									<div class="lump-panel">
										<img src="img/bg1.jpeg" alt="">
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
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
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
											<label class="layui-form-label">部门</label>
											<div class="layui-input-block">
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
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
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
												<select lay-search="" lay-filter=""
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
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
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
												<select lay-search="" lay-filter=""
													name="OriginalInfoproductNameSelectPanel">
													<option value="">直接选择或输入产品名称</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div class="layui-col-md3">
									<div class="item-panel layui-form">
										<div class="layui-form-item">
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--按钮区域-->
						<div class="btnParent-panel">
							<div class="btn-panel">
								<button class="layui-btn" v-bind:style="{background:BtnColor}">新增</button>
								<button class="layui-btn" v-bind:style="{background:BtnColor}">删除</button>
								<button class="layui-btn" v-bind:style="{background:BtnColor}">导出</button>
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
			<!--附件信息-->
			<div class="layui-body" style="top: 80px;"
				v-bind:style="{display:AttachmentInfoStatus}">
				<div class="padding15-panel">
					<div class="layui-row content-panel" id="AttachmentInfo-panel">
						<div class="title-panel">
							<span>附件信息</span>
						</div>
						<!--条件筛选区域-->
						<div class="ConditionalScreening-panel">
							<div class="layui-row layui-col-space10">
								<div class="layui-col-md3">
									<div class="item-panel layui-form">
										<div class="layui-form-item">
											<label class="layui-form-label">商品名称</label>
											<div class="layui-input-block">
												<select lay-search="" lay-filter=""
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
											<button class="layui-btn layui-btn-normal"
												v-bind:style="{background:BtnColor}">查询</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--按钮区域-->
						<div class="btnParent-panel">
							<div class="btn-panel">
								<button class="layui-btn" v-bind:style="{background:BtnColor}">新增</button>
								<button class="layui-btn" v-bind:style="{background:BtnColor}">删除</button>
								<button class="layui-btn" v-bind:style="{background:BtnColor}">导出</button>
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
									<input id="billingDatePanel" type="text" placeholder="点击选择日期"
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
										id="billingtotalAmount" placeholder="请输入" autocomplete="off"
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
											maxlength="9" placeholder="请输入" autocomplete="off"
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
											class="layui-input">
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
					<button @click="billingDelFun" class="layui-btn"
						style="background:#FF5722">
						<i class="layui-icon">&#xe640;</i> 删除
					</button>
					<button @click="billingPrintFun" class="layui-btn"
						style="background: #2F4056">
						<i class="layui-icon"> &#xe641;</i> 打印
					</button>
				</div>
				<div class="billingContentPanel">
					<div id="excelTablePanel"></div>
				</div>
			</div>
		</div>

		<!-- 订单详情页面 -->
		<div id="orderDetailsSubmenu" style="display:none">
			<!-- 表格渲染模块 -->
			<table class="layui-table" id="orderDetailsList">
				<thead>
					<tr>
						<th class="layui-bg-cyan">序号</th>
						<th class="layui-bg-cyan">长度</th>
						<th class="layui-bg-cyan">宽度</th>
						<th class="layui-bg-cyan">数量</th>
						<th class="layui-bg-cyan">标记</th>
						<th class="layui-bg-cyan">面积</th>
						<th class="layui-bg-cyan">附加工艺</th>
					</tr>
				</thead>
				<tbody>

				</tbody>
			</table>
		</div>


		<!-- 打印模板开始 -->
		<div id="PrintTemplate" style="display:none">
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
			<form class="layui-form layui-form-pane" action="">
				<div class="layui-form-item">
					<label class="layui-form-label">订单号:</label>
					<div class="layui-input-block">
						<input type="text" name="title" style="cursor:pointer"
							readonly="readonly" placeholder="自动生成" class="layui-input">
					</div>
				</div>
				<div class="row-panel">
					<div class="item-panel">
						<div class="layui-form-item">
							<label class="layui-form-label">日期:</label>
							<div class="layui-input-block">
								<input type="text" style="cursor:pointer" readonly="readonly"
									name="date" id="OriginalFilmDateSelect" autocomplete="off"
									class="layui-input">
							</div>
						</div>
					</div>
					<div class="item-panel">
						<div class="layui-form-item">
							<label class="layui-form-label">供货商:</label>
							<div class="layui-input-block">
								<input type="text" name="title" placeholder="请输入供货商"
									class="layui-input">
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
<!-- 采购登记悬浮层结束 -->
	</div>

</body>
</html>