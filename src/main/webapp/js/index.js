$(function() {
	var URL = "https://www.kaisir.cn/KFOMC";
	var MAIN = {};
	MAIN.dataObj = {};
	//实例化vue
	var vm = new Vue({
		//绑定元素
		el : "#vue-panel",
		//数据
		data : {
			//版本号
			Version : "体验版",
			//昵称
			nickName : "测试",
			/*顶部header颜色*/
			headerBgColor : "#1d1e22",
			//nav背景色
			navColor : "#0E0D10",
			//页面内所有按钮颜色
			BtnColor : "#003366",
			//头像
			avatarUrl : "img/admin.jpg",
			//消息条数
			msgNum : "0",
			purview : "开发者",
			logoImg : "img/logo.png",
			totalRevenue : "10000",
			totalExpenses : "5100",
			totalBalance : "4900",
			/*财务报表状态*/
			financeReportStatus : "none",
			/*订单管理状态*/
			orderManagementStatus : "block",
			/*进货管理状态*/
			IncomingGoodsStatus : "none",
			/*出货管理状态*/
			shipmentStatus : "none",
			/*库存管理状态*/
			stockStatus : "none",
			/*订单月结管理状态*/
			OrderMonthStatus : "none",
			/*客户信息管理状态*/
			CustomerInfoStatus : "none",
			/*收入管理状态*/
			revenueInfoStatus : "none",
			/*支出管理状态*/
			expenditureInfoStatus : "none",
			/*客户对账状态*/
			customerReconciliationStatus : "none",
			/*考勤管理状态*/
			AttendanceInfoStatus : "none",
			/*工资发放状态*/
			salaryGivingStatus : "none",
			/*员工信息状态*/
			employeeInfoStatus : "none",
			/*原片信息状态*/
			OriginalInfoStatus : "none",
			/*附件信息状态*/
			AttachmentInfoStatus : "none",
			/*基本设置状态*/
			basicSettingsStatus : "none",
			/*联系我们状态*/
			contactUsStatus : "none",
			//订单信息管理:订单号 用户选择数据
			orderNumber : "",
			//订单信息管理:客户名称 用户选择数据
			OrderClientName : "",
			//订单信息管理:工程名称 用户选择数据 
			OrderProjectName : "",
			//订单信息管理:日期 用户选择数据
			dStart : "",
			dEnd : ""
		},
		methods : {
			materialFun : function() {
				layer.open({
					title : "用户信息",
					type : 1,
					area : [ '470px', '240px' ],
					shadeClose : true, //点击遮罩关闭
					content : $("#SysmsgSubmenu")
				});
			},
			//财务报表点击函数
			financeReportFun : function() {
				this.financeReportStatus = "block";
				setTimeout(function() {
					/*渲染List1数据表格*/
					MAIN.List1Table();
				}, 100);
				this.orderManagementStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.shipmentStatus = "none";
				this.stockStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			//进货管理点击函数
			IncomingGoodsFun : function() {
				this.IncomingGoodsStatus = "block";
				setTimeout(function() {
					/*渲染原片采购数据表格*/
					MAIN.OriginaFlilmList();
				}, 100);
				this.financeReportStatus = "none";
				this.orderManagementStatus = "none";
				this.shipmentStatus = "none";
				this.stockStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			//出货管理点击函数
			shipmentFun : function() {
				this.shipmentStatus = "block";
				setTimeout(function() {
					/*渲染原片采购数据表格*/
					MAIN.originalFilmOutList();
					MAIN.originalFilmOutList2();
				}, 100);
				/*进货管理 财务报表 订单信息管理 库存管理 隐藏*/
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.orderManagementStatus = "none";
				this.stockStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			//库存管理点击事件
			stockFun : function() {
				this.stockStatus = "block";
				setTimeout(function() {
					/*渲染库存管理数据表格*/
					MAIN.stockList();
				}, 100);

				/*进货管理 财务报表 订单信息管理 出货管理 隐藏*/
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.orderManagementStatus = "none";
				this.shipmentStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			//订单信息管理点击事件
			OrderInfoFun : function() {
				this.orderManagementStatus = "block";
				setTimeout(function() {
					/*渲染订单信息管理数据表格*/
					var userName = $("#nickNameTextPanel").html();
					MAIN.orderInfoList(userName);
				}, 100);
				/*进货管理 财务报表 出货管理 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*订单信息管理:查询按钮交互函数*/
			orderBtnQueryFun : function() {
				var req = {};
				//获取查询条件
				req.operator = $("#nickNameTextPanel").html();
				req.conditionalQuery = "conditionalQuery";
				req.orderNumber = this.orderNumber;
				req.clientName = this.OrderClientName;
				req.projectName = this.OrderProjectName;
				req.dStart = this.dStart;
				req.dEnd = this.dEnd;
				if (Af.nullstr(req.orderNumber || req.clientName || req.projectName || req.dStart || req.dEnd)) {
					MAIN.ErroAlert("请选择一个条件后,再点查询!");
				} else {
					Af.rest("orderInfonQueiry.api", req, function(ans) {
						MAIN.orderInfoCustomizeList(ans.data);
					});
				}
			},
			/*开单交互函数*/
			billingFun : function() {
				/*请求后台获取 规格型号[产品名称] 集合*/
				var req = {};
				//清空dataObj
				MAIN.dataObj = {};
				req.operator = $("#nickNameTextPanel").html();
				var selectData = [];  //品名型号下拉列表数据
				Af.rest("productNameModelInquiry.api",req,function(ans){
					if(ans.errorCode==0)
					{
						var resultArray = ans.data; //--->JSONArray
						for(var i=0;i<resultArray.length;i++)
						{
							var resultObj = resultArray[i];//--->JSONObject
							selectData[i] = resultObj.productName;//--->array
						}
					}
				});
				layer.open({
					title : "正在开单",
					type : 1,
					area : [ '1270px', '840px' ],
					shadeClose : true, //点击遮罩关闭
					content : $("#billingManageSubmenu")
				});
				/*渲染Excel表格*/
				var hotElement = document.querySelector('#excelTablePanel');//绑定容器
				var hotSettings = {
					data : MAIN.dataObj,
					//标题栏 
					columns : [
						{
							editor:'select',
							selectOptions: selectData,
							width:'300'
						},
						{
							data : 'glassLength',  //长度
							type : 'text'
						},
						{
							data : 'glassWidth',  //宽度
							type : 'text'
						},
						{
							data : 'glassNum',//数量
							type : 'text'
						},
						{
							data : 'glassMark',//
							type : 'text'   //标记
						},
						{
							data : 'glassArea',//面积
							type : 'text'
						},
						{
							data : 'glassUnitPrice',//单价
							type : 'text'
						},
						{
							data : 'additionalProcess', //附加工艺
							type : 'text'
						},
						{
							data : 'additionalTotalValue',//附加总值
							type : 'text',
						},
						{
							data : 'totalAmount', //合计金额
							type : 'text'
						},
						{
							data : 'addTime',//日期
							type : 'date',
							dateFormat : 'MM/DD/YYYY'
						},
					],
					stretchH : 'all',
					width : 1200,
					autoWrapRow : true,//自动换行
					height : 470,
					manualRowResize : true,//手动行调整大小
					manualColumnResize : true,//手动列调整大小
					rowHeaders : true,//行标题
					colHeaders : [
						'品名型号',
						'长度',
						'宽度',
						'数量',
						'标记',
						'面积',
						'单价',
						'附加工艺',
						'附加总值',
						'合计金额',
						'日期'
					],
					manualRowMove : true,
					columnSorting:true,//排序
					manualColumnMove : true,//手动列移动
					　 contextMenu: {
				            items: {
				                'mergeCells':{ name: '合并单元格' , },
				                'row_above': { name: '上方添加一行', },
				                'row_below': { name: '下方添加一行', },
				                'col_left': { name: '左侧添加一列', },
				                'col_right': { name: '右侧添加一列', },
				                'remove_row': { name: '移除此行', },
				                'remove_col': { name: '移除此列', },
				                'copy': { name: '复制', },
				                'cut': { name: '剪切', },
				                'make_read_only': { name: '禁止编辑选中项', },
				                'alignment': { },
				                'undo': { name: '还原上次操作', },
				                'redo': { name: '重复上次动作', },
				                'setAlias':{
				                    name:'设置别名',
				                    callback:function(){
				                        if( $(Ccell) != undefined ){
				                            addAliasDialog();
				                        }else{
				                            alert("请先选择单元格...");
				                        }                        
				                    }
				                }
				            }
				        },//右键菜单
					filters : true,//过滤器
					//minSpareRows: 1,  //为0时，handsontable 可去掉最后多余的一行
					dropdownMenu : true//下拉式菜单
				};
				//渲染Excel表格
				var hot = new Handsontable(hotElement, hotSettings);
			},
			/*订单月结管理点击事件*/
			OrderMonthlyFun : function() {
				this.OrderMonthStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.OrderMonthList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理  客户信息管理隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*客户信息管理点击事件*/
			CustomerInfoFun : function() {
				this.CustomerInfoStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.CustomerInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 收入管理 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*财务管理:收入管理点击事件*/
			revenueInfoFun : function() {
				this.revenueInfoStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.revenueInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 支出管理 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*财务管理：支出管理点击事件*/
			expenditureInfoLFun : function() {
				this.expenditureInfoStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.expenditureInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理  客户对账 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*客户对账点击事件*/
			reconciliationFun : function() {
				this.customerReconciliationStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.customerReconciliationList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理  支出管理隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*考勤管理点击事件*/
			AttendanceInfoFun : function() {
				this.AttendanceInfoStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.AttendanceInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理  支出管理 客户对账 工资发放 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*工资发放点击事件*/
			salaryGivingFun : function() {
				this.salaryGivingStatus = "block";
				setTimeout(function() {
					/*渲染订单月结管理数据表格*/
					MAIN.salaryGivingList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理  员工信息 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*员工信息点击事件*/
			employeeInfoFun : function() {
				this.employeeInfoStatus = "block";
				setTimeout(function() {
					MAIN.employeeInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 原片信息 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*原片信息点击事件*/
			OriginalInfoFun : function() {
				this.OriginalInfoStatus = "block";
				setTimeout(function() {
					MAIN.OriginalInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息隐藏 附件信息 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*附件信息点击事件*/
			AttachmentInfoFun : function() {
				this.AttachmentInfoStatus = "block";
				setTimeout(function() {
					MAIN.AttachmentInfoList();
				}, 100);
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息 原片信息 基本设置 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.basicSettingsStatus = "none";
				this.contactUsStatus = "none";
			},
			/*基本设置 点击事件*/
			basicSettingsFun : function() {
				this.basicSettingsStatus = "block";
				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息 原片信息 附件信息 联系我们 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.contactUsStatus = "none";
			},
			/*联系我们 点击事件*/
			contactUsFun : function() {
				this.contactUsStatus = "block";

				/*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息 原片信息 附件信息 基本设置 隐藏*/
				this.stockStatus = "none";
				this.IncomingGoodsStatus = "none";
				this.financeReportStatus = "none";
				this.shipmentStatus = "none";
				this.orderManagementStatus = "none";
				this.OrderMonthStatus = "none";
				this.CustomerInfoStatus = "none";
				this.revenueInfoStatus = "none";
				this.expenditureInfoStatus = "none";
				this.customerReconciliationStatus = "none";
				this.AttendanceInfoStatus = "none";
				this.salaryGivingStatus = "none";
				this.employeeInfoStatus = "none";
				this.OriginalInfoStatus = "none";
				this.AttachmentInfoStatus = "none";
				this.basicSettingsStatus = "none";
			},
			/*客户原始单据点击放大图片*/
			OriginalDocumentFun : function() {}
		}
	});
	/*左侧导航栏*/
	// nav收缩展开
	$('.nav-item>a').on('click', function() {
		if (!$('.nav').hasClass('nav-mini')) {
			if ($(this).next().css('display') == "none") {
				//展开未展开
				$('.nav-item').children('ul').slideUp(300);
				$(this).next('ul').slideDown(300);
				$(this).parent('li').addClass('nav-show').siblings('li').removeClass('nav-show');
			} else {
				//收缩已展开
				$(this).next('ul').slideUp(300);
				$('.nav-item.nav-show').removeClass('nav-show');
			}
		}
	});
	//浏览器窗口大小变化时
	$(window).resize(function() {
		var window_width = $(window).width(); //获取浏览器窗口宽度
		if (window_width < 1604) {
			$("#noticePanel").css({
				"display" : "none"
			})
		} else {
			$("#noticePanel").css({
				"display" : "block"
			})
		}

	});
	//nav-mini切换
	$('#mini').on('click', function() {
		if (!$('.nav').hasClass('nav-mini')) {
			$('.nav-item.nav-show').removeClass('nav-show');
			$('.nav-item').children('ul').removeAttr('style');
			/*左边nav容器收缩情况*/
			$('.nav').addClass('nav-mini');
			$('.layui-side').stop().animate({
				'width' : '60px'
			}, 270);
			$('.layui-side-scroll').stop().animate({
				'width' : '80px'
			}, 270);
			$('.layui-body').stop().animate({
				'left' : '60px'
			}, 270);
			$('.layui-footer').stop().animate({
				'left' : '60px'
			}, 270);
		} else {
			$('.nav').removeClass('nav-mini');
			/*左边nav容器收缩情况*/
			$('.layui-side').stop().animate({
				'width' : '200px'
			}, 260);
			$('.layui-side-scroll').stop().animate({
				'width' : '220px'
			}, 260);
			$('.layui-body').stop().animate({
				'left' : '200px'
			}, 260);
			$('.layui-footer').stop().animate({
				'left' : '200px'
			}, 260);
		}
	});
	/*左边nav收缩时,hover效果*/
	$(".nav-item").hover(function() {
		if ($('.nav').hasClass('nav-mini')) {
			$('.layui-side').stop().animate({
				'width' : '200px'
			}, 260);
			$('.layui-side-scroll').stop().animate({
				'width' : '220px'
			}, 260);
			$('.layui-body').stop().animate({
				'left' : '200px'
			}, 260);
			$('.layui-footer').stop().animate({
				'left' : '200px'
			}, 260);
		}
	}, function() {
		if ($('.nav').hasClass('nav-mini')) {
			$('.layui-side').stop().animate({
				'width' : '60px'
			}, 270);
			$('.layui-side-scroll').stop().animate({
				'width' : '80px'
			}, 270);
			$('.layui-body').stop().animate({
				'left' : '60px'
			}, 270);
			$('.layui-footer').stop().animate({
				'left' : '60px'
			}, 270);
		}
	});
	layui.use([ 'form', 'element', 'jquery', 'table', 'laydate', 'carousel', 'colorpicker' ], function() {
		var form = layui.form,
			element = layui.element,
			$ = layui.$,
			table = layui.table,
			laydate = layui.laydate,
			carousel = layui.carousel,
			colorpicker = layui.colorpicker;

		//错误信息弹出
		MAIN.ErroAlert = function(e) {
			var index = layer.alert(e, {
				icon : 5,
				time : 2000,
				offset : 't',
				closeBtn : 0,
				title : '错误信息',
				btn : [],
				anim : 2,
				shade : 0
			});
			layer.style(index, {
				color : '#777'
			});
		}
		/*监听进货管理tab选项卡切换*/
		element.on('tab(IncomingGoodsTab)', function(data) {
			if (data.index == 0) {
				//原片采购数据表格渲染
				MAIN.OriginaFlilmList();
				MAIN.OriginaFlilmList2();
			} else if (data.index == 1) {
				//附件数据表格渲染
				MAIN.annexList();
				MAIN.annexList2();
			}
			/*
			* layer.msg("切换到了"+data.index+this.innerHTML);
			* */

		});

		/*顶部轮播渲染*/
		carousel.render({
			elem : '#noticePanel',
			width : '710px', //设置容器宽度
			height : '80px', //设置高度
			arrow : 'none', //始终显示箭头
			anim : 'updown', //切换动画方式
			indicator : 'none' //指示器位置
		});
		/*颜色选择器*/
		colorpicker.render({
			elem : '#TopColorMatchingPanel' //系统顶部配色
		});
		colorpicker.render({
			elem : '#navigationColorMatchingPanel' //系统左侧导航配色
		});
		/*时间选择渲染*/
		laydate.render({
			elem : '#startTime' //财务报表:开始时间
		});
		laydate.render({
			elem : '#endTime' //财务报表:结束时间
		});
		laydate.render({
			elem : '#timeInterval', //订单管理:日期区间选择
			range : true,
			calendar : true,
			done : function(value, date, endDate) {
				vm.dStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
				vm.dEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
			}
		});
		laydate.render({
			elem : '#billingDatePanel', //订单管理:开单日期选择
			calendar : true,
			type : "datetime",
			done : function(value, date, endDate) {}
		});
		laydate.render({
			elem : '#originalFilmPurchaseDate', //原片采购:日期区间选择
			range : true
		});
		laydate.render({
			elem : '#attachmentProcurementDate', //附件采购:日期区间选择
			range : true
		});
		laydate.render({
			elem : '#outOfTheLibraryDate', //出货管理:日期区间选择
			range : true
		});
		laydate.render({
			elem : '#customerInfoDateInput', //客户信息管理:日期区间选择
			range : true
		});
		laydate.render({
			elem : '#revenueInfoDateInput', //收入管理：日期区间选择
			range : true
		});
		laydate.render({
			elem : '#expenditureInfoDateInput', //支出管理:日期区间选择
			range : true
		});
		MAIN.dateString = function() {
			var date = new Date("2018", "12", "1");
			Af.trace(date);
		}

		MAIN.List1Table = function() {
			table.render({
				url : URL + "/incomeRecordApi",
				//data:GetMemListData, //请求地址
				method : 'POST', //方式
				elem : '#List1',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				id : "List1",
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},

				cols : [
					[
						{
							field : 'CardID',
							title : '名称待定',
							align : "center"
						},
						{
							field : 'CardName',
							title : '名称待定',
							align : "center"
						},
						{
							field : 'LevelName',
							title : '名称待定',
							align : "center"
						},
						{
							field : 'Money',
							title : '名称待定',
							align : "center"
						},
						{
							field : 'Point',
							title : '名称待定',
							align : "center"
						}
					]
				]
			});
		};
		/*页面加载渲染订单信息管理数据表格*/
		var nowUser = $("#nickNameTextPanel").html();
		if (nowUser != "null") {
			orderInfoList(nowUser);
		} else {
			Af.trace(nowUser);
		}
		//监听订单号选择
		form.on('select(orderNumberSelectPanel)', function(data) {
			vm.orderNumber = data.value;
		});
		form.on('select(orderClientNameSelectPanel)', function(data) {
			vm.OrderClientName = data.value;
		});
		form.on('select(orderprojectNameSelectPanel)', function(data) {
			vm.OrderProjectName = data.value;
		});
		/*订单信息数据表格*/
		MAIN.orderInfoCustomizeList = function(resultData) {
			//订单信息数据表格 自定义数据
			table.render({
				//url : "orderInfonQueiry.api",
				data : resultData,
				elem : '#orderInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'orderNumber',
							title : '订单号',
							align : "center"
						},
						{
							field : 'orderDate',
							title : '日期',
							align : "center"
						},
						{
							field : 'clientName',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'projectName',
							title : '工程名称',
							align : "center"
						},
						{
							field : 'glassNumber',
							title : '玻璃数量(个)',
							align : "center"
						},
						{
							field : 'totalArea',
							title : '总面积(㎡)',
							align : "center"
						},
						{
							field : 'numberShipments',
							title : '发货数量(个)',
							align : "center"
						},
						{
							field : 'shipArea',
							title : '发货面积(㎡)',
							align : "center"
						},
						{
							field : 'additionalFees',
							title : '附加费用(元)',
							align : "center"
						},
						{
							field : 'totalAmount',
							title : '总金额(元)',
							align : "center"
						},
						{
							field : 'alreadyPaid',
							title : '已付款(元)',
							align : "center"
						},
						{
							field : 'unpaid',
							title : '未付款(元)',
							align : "center"
						},
						{
							field : 'finishDelivery',
							title : '完成发货(个)',
							align : "center"
						},
						{
							fixed : "right",
							field : 'preparedBy',
							title : '制单人',
							align : "center"
						}
					]
				]
			});
		}
		function orderInfoList(userName) {
			table.render({
				url : "orderInfonQueiry.api",
				//                data:testData, //请求地址
				method : 'POST', //方式
				elem : '#orderInfoList',
				page : true,
				contentType : 'application/json', //发送到服务端的内容编码类型
				where : {
					operator : userName
				},
				limits : [ 10, 15, 20, 25 ],
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'orderNumber',
							title : '订单号',
							align : "center"
						},
						{
							field : 'orderDate',
							title : '日期',
							align : "center"
						},
						{
							field : 'clientName',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'projectName',
							title : '工程名称',
							align : "center"
						},
						{
							field : 'glassNumber',
							title : '玻璃数量(个)',
							align : "center"
						},
						{
							field : 'totalArea',
							title : '总面积(㎡)',
							align : "center"
						},
						{
							field : 'numberShipments',
							title : '发货数量(个)',
							align : "center"
						},
						{
							field : 'shipArea',
							title : '发货面积(㎡)',
							align : "center"
						},
						{
							field : 'additionalFees',
							title : '附加费用(元)',
							align : "center"
						},
						{
							field : 'totalAmount',
							title : '总金额(元)',
							align : "center"
						},
						{
							field : 'alreadyPaid',
							title : '已付款(元)',
							align : "center"
						},
						{
							field : 'unpaid',
							title : '未付款(元)',
							align : "center"
						},
						{
							field : 'finishDelivery',
							title : '完成发货(个)',
							align : "center"
						},
						{
							fixed : "right",
							field : 'preparedBy',
							title : '制单人',
							align : "center"
						}
					]
				],
				done : function(res, curr, count) {
					//如果是异步请求数据方式，res即为接口返回的信息。
					//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
					//console.log(res);
					orderNumberSelectFun();
					clientNameSelectFun();
					projectNameSelectFun() ;
					/*渲染订单号选择框*/
					function orderNumberSelectFun() {
						var data = res.data;
						var nowData = [];
						for (var i = 0; i < data.length; i++) {
							var temporaryData = {};
							temporaryData.id = data[i].id;
							temporaryData.name = data[i].orderNumber;
							nowData.push(temporaryData);
						}
						addSelectVal(nowData, "orderFormSelectPanel");
					}
					/*渲染客户名称选择框*/
					function clientNameSelectFun() {
						var data = res.data;
						var nowData = [];
						for (var i = 0; i < data.length; i++) {
							var temporaryData = {};
							temporaryData.id = data[i].id;
							temporaryData.name = data[i].clientName;
							nowData.push(temporaryData);
						}
						addSelectVal(nowData, "clientNameSelectPanel");
					}
					/*渲染工程名称选择框*/
					function projectNameSelectFun() {
						var data = res.data;
						var nowData = [];
						for (var i = 0; i < data.length; i++) {
							var temporaryData = {};
							temporaryData.id = data[i].id;
							temporaryData.name = data[i].projectName;
							nowData.push(temporaryData);
						}
						addSelectVal(nowData, "projectNameSelectPanel");
					}
					/*动态赋值select函数*/
					function addSelectVal(data, container) {
						var $html = "";
						if (data != null) {
							$.each(data, function(index, item) {
								if (item.proType) {
									$html += "<option class='generate' value='" + item.id + "'>" + item.proType + "</option>";
								} else {
									$html += "<option value='" + item.name + "'>" + item.name + "</option>";
								}
							});
							$("select[name='" + container + "']").append($html);
							//反选
							//$("select[name='"+container+"']").val($("#???").val());
							//append后必须从新渲染
							form.render('select');
						} else {
							$html += "<option value='0'>没有任何数据</option>";
							$("select[name='" + container + "']").append($html);
							//append后必须从新渲染
							form.render('select');
						}

					}
				//                    //得到当前页码
				//                    console.log(curr); 
				//                    //得到数据总量
				//                    console.log(count);
				}
			});
		}


		/*作为全局变量调用（订单信息数据表格）*/
		MAIN.orderInfoList = function(userName) {
			table.render({
				url : "orderInfonQueiry.api",
				//                  data:testData, //请求地址
				method : 'POST', //方式
				elem : '#orderInfoList',
				page : true,
				contentType : 'application/json', //发送到服务端的内容编码类型
				where : {
					operator : userName
				},
				limits : [ 10, 15, 20, 25 ],
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'orderNumber',
							title : '订单号',
							align : "center"
						},
						{
							field : 'orderDate',
							title : '日期',
							align : "center"
						},
						{
							field : 'clientName',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'projectName',
							title : '工程名称',
							align : "center"
						},
						{
							field : 'glassNumber',
							title : '玻璃数量',
							align : "center"
						},
						{
							field : 'totalArea',
							title : '总面积',
							align : "center"
						},
						{
							field : 'numberShipments',
							title : '发货数量',
							align : "center"
						},
						{
							field : 'shipArea',
							title : '发货面积',
							align : "center"
						},
						{
							field : 'additionalFees',
							title : '附加费用',
							align : "center"
						},
						{
							field : 'totalAmount',
							title : '总金额',
							align : "center"
						},
						{
							field : 'alreadyPaid',
							title : '已付款',
							align : "center"
						},
						{
							field : 'unpaid',
							title : '未付款',
							align : "center"
						},
						{
							field : 'finishDelivery',
							title : '完成发货',
							align : "center"
						},
						{
							fixed : "right",
							field : 'preparedBy',
							title : '制单人',
							align : "center"
						}
					]
				]
			});
		};

		/*页面加载渲染订单信息管理数据表格结束*/

		/*原片采购数据表格*/
		MAIN.OriginaFlilmList = function() {
			table.render({
				url : URL + "/OriginaFlilmList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#OriginaFlilmList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '单号',
							align : "center"
						},
						{
							field : 'CardName',
							title : '日期',
							align : "center"
						},
						{
							field : 'LevelName',
							title : '供货商',
							align : "center"
						},
						{
							field : 'Money',
							title : '规格型号',
							align : "center"
						},
						{
							field : 'Money',
							title : '厚度',
							align : "center"
						},
						{
							field : 'Money',
							title : '颜色',
							align : "center"
						},
						{
							field : 'Point',
							title : '数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '单价',
							align : "center"
						},
						{
							field : 'Point',
							title : '采购总额',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款明细',
							align : "center"
						},
						{
							field : 'Point',
							title : '运输费',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*附件采购数据表格*/
		MAIN.annexList = function() {
			table.render({
				url : URL + "/annexList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#annexList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '单号',
							align : "center"
						},
						{
							field : 'CardName',
							title : '日期',
							align : "center"
						},
						{
							field : 'LevelName',
							title : '供货商',
							align : "center"
						},
						{
							field : 'LevelName',
							title : '规格型号',
							align : "center"
						},
						{
							field : 'Money',
							title : '采购数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '采购总额',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款明细',
							align : "center"
						},
						{
							field : 'Point',
							title : '其他费用',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*出货管理数据表格*/
		MAIN.originalFilmOutList = function() {
			table.render({
				url : URL + "/originalFilmOutList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#originalFilmOutList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '客户姓名',
							align : "center"
						},
						{
							field : 'CardID',
							title : '发货日期',
							align : "center"
						},
						{
							field : 'CardName',
							title : '规格型号',
							align : "center"
						},
						{
							field : 'Point',
							title : '发货数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '发货面积',
							align : "center"
						},
						{
							field : 'Point',
							title : '剩余数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '剩余面积',
							align : "center"
						},
						{
							field : 'Point',
							title : '货款金额',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款明细',
							align : "center"
						},
						{
							field : 'Point',
							title : '运输负责人',
							align : "center"
						},

					]
				]
			});
		};
		/*库存管理数据表格*/
		MAIN.stockList = function() {
			table.render({
				url : URL + "/stockList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#stockList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '产品名称',
							align : "center"
						},
						{
							field : 'CardID',
							title : '规格',
							align : "center"
						},
						{
							field : 'CardName',
							title : '颜色',
							align : "center"
						},
						{
							field : 'Point',
							title : '纹理',
							align : "center"
						},
						{
							field : 'Point',
							title : '厚度',
							align : "center"
						},
						{
							field : 'Point',
							title : '入库数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '出库数量',
							align : "center"
						},
						{
							field : 'Point',
							title : '库存余量',
							align : "center"
						},
						{
							field : 'Point',
							title : '库存面积',
							align : "center"
						}
					]
				]
			});
		};
		/*订单管理:订单月结管理*/
		MAIN.OrderMonthList = function() {
			table.render({
				url : URL + "/stockList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#OrderMonthList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '月结编号',
							align : "center"
						},
						{
							field : 'CardID',
							title : '订单数',
							align : "center"
						},
						{
							field : 'CardName',
							title : '总面积',
							align : "center"
						},
						{
							field : 'Point',
							title : '总金额',
							align : "center"
						},
						{
							field : 'Point',
							title : '已付款',
							align : "center"
						},
						{
							field : 'Point',
							title : '月结付款',
							align : "center"
						},
						{
							field : 'Point',
							title : '未付款',
							align : "center"
						},
						{
							field : 'Point',
							title : '优惠金额',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*客户信息管理:数据表格*/
		MAIN.CustomerInfoList = function() {
			table.render({
				url : URL + "/CustomerInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#CustomerInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '客户类型',
							align : "center"
						},
						{
							field : 'CardID',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'CardName',
							title : '公司名称',
							align : "center"
						},
						{
							field : 'Point',
							title : '税号',
							align : "center"
						},
						{
							field : 'Point',
							title : '地址',
							align : "center"
						},
						{
							field : 'Point',
							title : '手机',
							align : "center"
						},
						{
							field : 'Point',
							title : '微信',
							align : "center"
						},
						{
							field : 'Point',
							title : '邮箱',
							align : "center"
						},
						{
							field : 'Point',
							title : '开户银行',
							align : "center"
						},
						{
							field : 'Point',
							title : '银行卡号',
							align : "center"
						}
					]
				]
			});
		};
		/*财务管理:收入管理 数据表格*/
		MAIN.revenueInfoList = function() {
			table.render({
				url : URL + "/revenueInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#revenueInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '订单号',
							align : "center"
						},
						{
							field : 'CardID',
							title : '日期',
							align : "center"
						},
						{
							field : 'CardName',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款方式',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款金额',
							align : "center"
						},
						{
							field : 'Point',
							title : '收款人',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*财务管理:支出管理 数据表格*/
		MAIN.expenditureInfoList = function() {
			table.render({
				url : URL + "/expenditureInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#expenditureInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '订单号',
							align : "center"
						},
						{
							field : 'CardID',
							title : '日期',
							align : "center"
						},
						{
							field : 'CardName',
							title : '支出类别',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款方式',
							align : "center"
						},
						{
							field : 'Point',
							title : '付款金额',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*客户对账*/
		MAIN.customerReconciliationList = function() {
			table.render({
				url : URL + "/customerReconciliationList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#customerReconciliationList',
				page : true,
				height : '270',
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '客户类型',
							align : "center"
						},
						{
							field : 'CardID',
							title : '客户名称',
							align : "center"
						},
						{
							field : 'CardName',
							title : '公司名称',
							align : "center"
						},
						{
							field : 'Point',
							title : '税号',
							align : "center"
						},
						{
							field : 'Point',
							title : '地址',
							align : "center"
						},
						{
							field : 'Point',
							title : '手机',
							align : "center"
						},
						{
							field : 'Point',
							title : '微信',
							align : "center"
						},
						{
							field : 'Point',
							title : '邮箱',
							align : "center"
						},
						{
							field : 'Point',
							title : '开户银行',
							align : "center"
						},
						{
							field : 'Point',
							title : '银行卡号',
							align : "center"
						}
					]
				]
			});
		};
		/*员工管理:考勤管理 数据表格*/
		MAIN.AttendanceInfoList = function() {
			table.render({
				url : URL + "/AttendanceInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#AttendanceInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '姓名',
							align : "center"
						},
						{
							field : 'CardID',
							title : '工号',
							align : "center"
						},
						{
							field : 'CardName',
							title : '部门',
							align : "center"
						},
						{
							field : 'Point',
							title : '应出勤天数',
							align : "center"
						},
						{
							field : 'Point',
							title : '实际出勤天数',
							align : "center"
						},
						{
							field : 'Point',
							title : '请假天数(合计)',
							align : "center"
						},
						{
							field : 'Point',
							title : '事假天数',
							align : "center"
						},
						{
							field : 'Point',
							title : '病假天数',
							align : "center"
						},
						{
							field : 'Point',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*员工管理：工资发放 数据表格*/
		MAIN.salaryGivingList = function() {
			table.render({
				url : URL + "/salaryGivingList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#salaryGivingList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '姓名',
							align : "center"
						},
						{
							field : 'CardID',
							title : '工号',
							align : "center"
						},
						{
							field : 'Point',
							title : '职位/岗位',
							align : "center"
						},
						{
							field : 'Point',
							title : '基本工资',
							align : "center"
						},
						{
							field : 'Point',
							title : '岗位补贴',
							align : "center"
						},
						{
							field : 'Point',
							title : '应发工资',
							align : "center"
						},
						{
							field : 'CardID',
							title : '考勤扣款',
							align : "center"
						},
						{
							field : 'CardID',
							title : '个人所得税',
							align : "center"
						},
						{
							field : 'CardID',
							title : '实发工资',
							align : "center"
						},
						{
							field : 'CardID',
							title : '签领时间',
							align : "center"
						},
						{
							field : 'CardID',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*员工管理:员工信息*/
		MAIN.employeeInfoList = function() {
			table.render({
				url : URL + "/employeeInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#employeeInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '姓名',
							align : "center"
						},
						{
							field : 'CardID',
							title : '手机号',
							align : "center"
						},
						{
							field : 'Point',
							title : '工号',
							align : "center"
						},
						{
							field : 'Point',
							title : '性别',
							align : "center"
						},
						{
							field : 'Point',
							title : '员工状态',
							align : "center"
						},
						{
							field : 'Point',
							title : '部门',
							align : "center"
						},
						{
							field : 'CardID',
							title : '职务',
							align : "center"
						},
						{
							field : 'CardID',
							title : '员工生日',
							align : "center"
						},
						{
							field : 'CardID',
							title : '入职日期',
							align : "center"
						},
						{
							field : 'CardID',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*基础信息:原片信息*/
		MAIN.OriginalInfoList = function() {
			table.render({
				url : URL + "/OriginalInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#OriginalInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '产品名称',
							align : "center"
						},
						{
							field : 'CardID',
							title : '规格',
							align : "center"
						},
						{
							field : 'Point',
							title : '颜色',
							align : "center"
						},
						{
							field : 'Point',
							title : '纹理',
							align : "center"
						},
						{
							field : 'Point',
							title : '厚度',
							align : "center"
						},
						{
							field : 'Point',
							title : '单价',
							align : "center"
						},
						{
							field : 'CardID',
							title : '会员价',
							align : "center"
						},
						{
							field : 'CardID',
							title : '批发价',
							align : "center"
						},
						{
							field : 'CardID',
							title : '备注',
							align : "center"
						}
					]
				]
			});
		};
		/*基础信息:附件信息*/
		MAIN.AttachmentInfoList = function() {
			table.render({
				url : URL + "/AttachmentInfoList",
				// data:testData, //请求地址
				method : 'POST', //方式
				elem : '#AttachmentInfoList',
				page : true,
				limits : [ 10, 15, 20, 25 ],
				request : {
					pageName : 'page', //页码的参数名称，默认：page
					limitName : 'rows' //每页数据量的参数名，默认：limit
				},
				cols : [
					[
						{
							fixed : "left",
							type : 'checkbox',
							align : "center"
						},
						{
							field : 'CardID',
							title : '编号',
							align : "center"
						},
						{
							field : 'CardID',
							title : '商品名称',
							align : "center"
						},
						{
							field : 'CardID',
							title : '规格型号',
							align : "center"
						},
						{
							field : 'Point',
							title : '单位',
							align : "center"
						},
						{
							field : 'Point',
							title : '单价',
							align : "center"
						},
						{
							field : 'Point',
							title : '会员价',
							align : "center"
						},
						{
							field : 'Point',
							title : '批发价',
							align : "center"
						}
					]
				]
			});
		}
	});
	//让浏览器全屏函数
	MAIN.fullScreen = function() {
		var el = document.documentElement;
		var rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
		el.mozRequestFullScreen || el.msRequestFullScreen;
		if (typeof rfs != "undefined" && rfs) {
			rfs.call(el);
		} else if (typeof window.ActiveXObject != "undefined") {
			//for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript != null) {
				wscript.SendKeys("{F11}");
			}
		}
	}



});



/*渲染客户名称选择框*/
//addSelectVal(vm.clientNameDatas,"clientNameSelectPanel");
/*渲染送货地址选择框*/
//  addSelectVal(vm.deliveryAddressDatas,"deliveryAddressSelectPanel");
/*渲染联系电话选择框*/
//addSelectVal(vm.contactNumberDatas,"contactNumberSelectPanel");
/*渲染制单人选择框*/
//addSelectVal(vm.orderNumberDatas,"orderNumberSelectPanel");
/*渲染备注选择框*/
//addSelectVal(vm.RemarksDatas,"RemarksSelectPanel");
/*渲染已结账选择框*/
//addSelectVal(vm.CheckedOutDatas,"CheckedOutSelectPanel");
/*渲染完成发货选择框*/
//addSelectVal(vm.finishDeliveryDatas,"finishDeliverySelectPanel");
/*渲染标签打印选择框*/
// addSelectVal(vm.labelPrintingDatas,"labelPrintingSelectPanel");
/*渲染自定义模板选择框*/
//addSelectVal(vm.CustomTemplateDatas,"CustomTemplateSelectPanel");
/*渲染原片采购选择框:(单号)*/
//addSelectVal(vm.SingleNumberDatas,"SingleNumberSelectPanel");
/*渲染原片采购:供货商*/
// addSelectVal(vm.supplierDatas,"supplierSelectPanel");
/*渲染原片采购:备注*/
//addSelectVal(vm.originalFilmremarkDatas,"originalFilmremarkSelectPanel");
/*渲染进货管理:附件采购（单号）*/
//addSelectVal(vm.annexoddNumberDatas,"annexoddNumberSelectPanel");
/*渲染进货管理:附件采购(供应商)*/
//addSelectVal(vm.annexsupplierDatas,"annexsupplierSelectPanel");
/*渲染进货管理:附件采购(备注)*/
// addSelectVal(vm.annexRemarksDatas,"annexRemarksSelectPanel");
/*渲染出货管理:产品名称*/
//  addSelectVal(vm.outOfTheLibraryproductNameDatas,"outOfTheLibraryproductNameSelectPanel");
/*渲染库存管理:产品名称*/
//addSelectVal(vm.stockProductNameDatas,"stockProductNameSelectPanel");
/*渲染库存管理:规格*/
//addSelectVal(vm.stockspecificationDatas,"stockspecificationSelectPanel");
/*渲染库存管理:纹理*/
//addSelectVal(vm.stockTextureDatas,"stockTextureSelectPanel");
/*渲染库存管理:厚度*/
//addSelectVal(vm.stockthicknessDatas,"stockthicknessSelectPanel");
/*渲染月结编号*/
//addSelectVal(vm.OrderMonthDatas,"OrderMonthSelectPanel");
/*渲染客户信息管理：客户姓名*/
//addSelectVal(vm.customerNameDatas,"customerNameSelectPanel");
/*渲染员工管理：考勤管理(部门)*/
//addSelectVal(vm.departmentDatas,"departmentSelectPanel");
/*渲染员工管理：考勤管理(姓名)*/
//addSelectVal(vm.AttendanceNameDatas,"AttendanceNameSelectPanel");
/*渲染员工管理：考勤管理(工号)*/
//addSelectVal(vm.AttendanceJobNumberDatas,"AttendanceJobNumberSelectPanel");
/*渲染原片信息:产品名称*/
//addSelectVal(vm.OriginalInfoproductNameDatas,"OriginalInfoproductNameSelectPanel");
/*渲染附件信息:商品名称*/
//addSelectVal(vm.OriginalInfoCommodityNameDatas,"OriginalInfoCommodityNameSelectPanel");
/*财务报表数据表格*/

///*客户名称数据*/
//clientNameDatas : {},
///*送货地址数据*/
//deliveryAddressDatas : {},
///*联系电话数据*/
//contactNumberDatas : {},
///*制单人数据*/
//orderNumberDatas : {},
///*工程名称数据*/
//projectNameDatas : {},
///*备注数据*/
//RemarksDatas : {},
///*已结账数据*/
//CheckedOutDatas : {},
///*完成发货数据*/
//finishDeliveryDatas : {},
///*标签打印数据*/
//labelPrintingDatas : {},
///*自定义模板数据*/
//CustomTemplateDatas : {},
///*原片采购:(单号)数据*/
//SingleNumberDatas : {},
///*原片采购:供货商数据*/
//supplierDatas : {},
///*原片采购:备注数据*/
//originalFilmremarkDatas : {},
///*附件采购:单号数据*/
//annexoddNumberDatas : {},
///*附件采购:供货商数据*/
//annexsupplierDatas : {},
///*附件采购：备注数据*/
//annexRemarksDatas : {},
///*出货管理:产品名称数据*/
//outOfTheLibraryproductNameDatas : {},
///*库存管理:产品名称数据*/
//stockProductNameDatas : {},
///*库存管理:规格数据*/
//stockspecificationDatas : {},
///*库存管理:纹理查询数据*/
//stockTextureDatas : {},
///*库存管理:厚度数据*/
//stockthicknessDatas : {},
///*月结编号数据*/
//OrderMonthDatas : {},
///*客户信息管理：客户姓名数据*/
//customerNameDatas : {},
///*考勤管理:部门数据*/
//departmentDatas : {},
///*考勤管理:姓名数据*/
//AttendanceNameDatas : {},
///*考勤管理:工号数据*/
//AttendanceJobNumberDatas : {},
///*原片信息:产品名称*/
//OriginalInfoproductNameDatas : {},
///*附件信息:商品名称*/
//OriginalInfoCommodityNameDatas : {}