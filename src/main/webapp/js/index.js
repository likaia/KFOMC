function focusNextInput(thisInput) {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        // 如果是最后一个，则焦点回到第一个(如果想实现按顺序可以登陆，可以写入登陆方法)
        if (i == (inputs.length - 1)) {
            inputs[0].focus();
            break;
        } else if (thisInput == inputs[i]) {
            inputs[i + 1].focus();
            break;
        }
    }
}

//单击延时触发 (解决同时绑定单击和双击单击事件多次触发bug)
var clickTimeId;

/*出货管理[新增发货]弹出层表格行双击事件*/
function ModelItemFun(item, rowLine) {//参数说明:item:当前点击是第几行,rowLine:当前点击的条目属于第几行
    // 取消上次延时未执行的方法
    clearTimeout(clickTimeId);
    //Af.trace("当前点击行的是第"+rowLine+"项的第"+item+"行");
    $("#OrderModelList tbody .row_" + rowLine + "").eq(item).removeClass("rowLineSelectStyle");
    $("#OrderModelList tbody .row_" + rowLine + "").eq(item).removeAttr("data-rowLine");
    $("#OrderModelList tbody .row_" + rowLine + "").eq(item).removeAttr("data-item");
}

/*出货管理[新增发货]弹出层表格行单击事件*/
function ModelItemOneFun(item, rowLine) {
    // 取消上次延时未执行的方法
    clearTimeout(clickTimeId);
    //执行延时
    clickTimeId = setTimeout(function () {
        //此处为单击事件要执行的代码
        $("#OrderModelList tbody .row_" + rowLine + "").eq(item).addClass("rowLineSelectStyle");
        $("#OrderModelList tbody .row_" + rowLine + "").eq(item).attr("data-rowLine", "" + rowLine + ""); //添加当前选择项
        $("#OrderModelList tbody .row_" + rowLine + "").eq(item).attr("data-item", "" + item + ""); //选择当前选择条目
    }, 250);
}

function getUserSelect(index) {
    var req = {};
    req.operator = $("#nickNameTextPanel").html(); //--->获取用户名
    var selectData = []; //品名型号下拉列表数据
    Af.rest("productNameModelInquiry.api", req, function (ans) {
        if (ans.errorCode == 0) {
            var resultArray = ans.data; //--->JSONArray
            for (var i = 0; i < resultArray.length; i++) {
                var resultOBJ = {};
                resultOBJ['id'] = resultArray[i].id;
                resultOBJ['name'] = resultArray[i].productName;
                resultOBJ['unitPrice'] = resultArray[i].unitPrice;
                selectData.push(resultOBJ);
            }
            var parent_panel = "#submenu";
            var containerPanel = ".table-panel .content-panel"; //---->动态div之前的容器
            var row_line = " .row_"; //--->动态div名称
            var foot_panel = " .item-panel"; //---->每一个item
            var pricePanel = $(parent_panel + " " + containerPanel + row_line + index + foot_panel + " .unitPrice");
            var selectIds = $("select[name='customize" + index + "']").val();
            if (!Af.nullstr(selectIds)) {
                //给单价赋值
                pricePanel.val(selectData[selectIds - 1].unitPrice);
            }
        }
    });
}

$(function () {
    var URL = "https://www.kaisir.cn/";
    var MAIN = {};
    var globalVar = 1; //
    var marksPanel = $("#submenu .table-panel .content-panel .row_1 .marks");
    var parent_panel = "#submenu";
    var containerPanel = ".table-panel .content-panel"; //---->动态div之前的容器
    var row_line = " .row_"; //--->动态div名称
    var foot_panel = " .item-panel"; //---->每一个item
    var ansSelectData = [];
    var globalGlassNum = 0; //全局玻璃数量
    var timer;
    var globalArea = 0; //全局面积
    var globalPrice = 0; //全局单价
    var selectedModelArr = [];
    //实例化vue
    var vm = new Vue({
        //绑定元素
        el: "#vue-panel",
        //数据
        data: {
            //版本号
            Version: "体验版",
            //昵称
            nickName: "测试",
            /*顶部header颜色*/
            headerBgColor: "#1d1e22",
            //nav背景色
            navColor: "#0E0D10",
            //页面内所有按钮颜色
            BtnColor: "#003366",
            //头像
            avatarUrl: "img/admin.jpg",
            //消息条数
            msgNum: "0",
            purview: "开发者",
            logoImg: "img/logo.png",
            totalRevenue: "10000",
            totalExpenses: "5100",
            totalBalance: "4900",
            /*财务报表状态*/
            financeReportStatus: "none",
            /*订单管理状态*/
            orderManagementStatus: "block",
            /*进货管理状态*/
            IncomingGoodsStatus: "none",
            /*出货管理状态*/
            shipmentStatus: "none",
            /*库存管理状态*/
            stockStatus: "none",
            /*订单月结管理状态*/
            OrderMonthStatus: "none",
            /*客户信息管理状态*/
            CustomerInfoStatus: "none",
            /*收入管理状态*/
            revenueInfoStatus: "none",
            /*支出管理状态*/
            expenditureInfoStatus: "none",
            /*客户对账状态*/
            customerReconciliationStatus: "none",
            /*考勤管理状态*/
            AttendanceInfoStatus: "none",
            /*工资发放状态*/
            salaryGivingStatus: "none",
            /*员工信息状态*/
            employeeInfoStatus: "none",
            /*原片信息状态*/
            OriginalInfoStatus: "none",
            /*配件信息状态*/
            AttachmentInfoStatus: "none",
            /*基本设置状态*/
            basicSettingsStatus: "none",
            /*联系我们状态*/
            contactUsStatus: "none",
            //订单信息管理:订单号 用户选择数据
            orderNumber: "",
            //订单信息管理:客户名称 用户选择数据
            OrderClientName: "",
            //订单信息管理:工程名称 用户选择数据
            OrderProjectName: "",
            //订单信息管理:日期 用户选择数据
            dStart: "",
            dEnd: "",
            /*进货管理:原片采购*/
            originalFilmorderNumber: "", //--->订单号用户选择数据
            supplierSelectVal: "", //--->供货商用户选择数据
            originalFilmRemarksVal: "", //---->备注用户选择数据
            originalFilmdStart: "", //开始时间
            originalFilmEnd: "", //结束时间
            /*进货管理:配件采购*/
            FittingNumberSelectval: "", //-->订单号用户选择数据
            FittingsupplierSelectval: "", //供货商用户选择数据
            FittingremarkSelectval: "", //备注数据
            fittingdStart: "", //开始时间
            fittingEnd: "", //结束时间
            productImageUrl: "https://www.kaisir.cn/webPic/productImg/productUpLoad.jpg",
            newAccessories: "",//--->新增配件时实现数据双向绑定
            newAccessoriesState: false, //--->新增配件时配件图片折叠显隐状态
            productLayerStatus: "block",  //-->配件采购图片上传黑色遮罩显示状态
            /*出货管理*/
            ShipmentdStart: "",
            ShipmentdEnd: "",
            shipmentAddStart: "",
            shipmentAddEnd: "",
            shippingCustomerValArr: "",   //--->出货管理[新增发货]悬浮层,选择订单号后当前订单下的所有规格型号
            modelDetailsList: [],   //--->规格型号小条目展示
            invoiceClientName: "",    //--->发货单客户名称
            invoiceProjectName: "",    //--->发货单工程名称
            invoiceOrderNumber: "",    //--->发货单订单号
            invoiceContactNumber: "",   //--->发货单联系电话
            invoiceDeliveryAddress: "",  //--->发货单送货地址
            invoiceOrderDate: "",        //--->发货单订单日期
            invoiceDateOfShipment: "",    //--->发货单发货日期
            invoiceTotalNumber: "",      //--->发货单总数量
            invoiceTotalArea: "",        //--->发货单总面积
            invoiceTotalAmount: "",      //--->发货单总金额
            invoiceUnpaid: "",            //--->发货单未付款
            invoicePaymentDetails: "", //付款明细
            invoiceTransportationManager: "", //运输负责人
            invoiceFreight: "", //运费
            /*客户信息管理数据*/
            clientInfoName: "",   //--->客户姓名
            clientInfoStart: "", //--->开始时间
            clientInfoEnd: "", //--->结束时间
            clientNameVal: "",  //--->客户名称
            companyNameVal: "", //--->公司名称
            invoiceTaxNumberVal: "",  //--->发票税号
            contactAddressVal: "", //--->联系地址
            phoneNumberVal: "",   //--->手机号
            weChatNumberVal: "", //--->微信号
            mailboxVal: "", //--->邮箱
            bankAccountVal: "", //--->开户银行
            bankCardNumberVal: "", //银行卡号
            //编辑客户数据
            clientId:"", //--->客户id
            editClientNameVal: "",  //--->客户名称
            editCompanyNameVal: "", //--->公司名称
            editInvoiceTaxNumberVal: "",  //--->发票税号
            editContactAddressVal: "", //--->联系地址
            editPhoneNumberVal: "",   //--->手机号
            editWeChatNumberVal: "", //--->微信号
            editMailboxVal: "", //--->邮箱
            editBankAccountVal: "", //--->开户银行
            editBankCardNumberVal: "", //银行卡号
            /*原片信息数据*/
            originalInformationProductName:"",  //--->产品名称选择
            //原片信息新增数据
            productNameVal:"",   // 产品名称
            specificationVal:"",  // 规 格
            originalFilmColorVal:"",   // 颜 色
            originalFilmGrainVal:"",   // 纹 理
            originalFilmThicknessVal:"",  // 厚 度
            originalFilmUnitPriceVal:0, //  单 价
            originalFilmMemberPriceVal:0, //会 员 价
            originalFilmWholesalePriceVal:0, //批 发 价
            originalFilmRemarksVals:"",  //--->备注
            /*编辑*/
            editProductNameVal:"",
            editSpecificationVal:"",
            editOriginalFilmColorVal:"",
            editOriginalFilmGrainVal:"",
            editOriginalFilmThicknessVal:"",
            editOriginalFilmUnitPriceVal:"",
            editOriginalFilmMemberPriceVal:"",
            editOriginalFilmWholesalePriceVal:"",
            editOriginalFilmRemarksVals:"",
            profuctId:"",
            OriginalInfoCommodityNameSelectVal:"",
            productModelVal:"",
            /*员工管理[考勤管理]数据*/
            AttendanceDivision:"", //--->部门
            AttendanceNameOfWorker:"", //--->姓名
            AttendanceJobNumber:"",//---->工号
            /*员工管理[工资发放]数据*/
            SalaryInfoDivisionVal:"",//---->职位/岗位
            SalaryInfoNameVal:"",  //--->姓名
            SalaryInfoJobNumberVal:"", //--->工号
            /*员工管理[员工信息]数据*/
            EmployeeDivisionVal:"",
            EmployeeNameVal:"",
            EmployeejobNumberVal:""
        },
        methods: {
            materialFun: function () {
                layer.open({
                    title: "用户信息",
                    type: 1,
                    area: ['470px', '240px'],
                    shadeClose: true, //点击遮罩关闭
                    content: $("#SysmsgSubmenu")
                });
            },
            newAccessoriesInputFun: function () {
                //--->监听新的配件名称实时输入:决定配件图片上传显隐状态
                if (Af.nullstr(this.newAccessories)) {
                    this.newAccessoriesState = false;
                }
                else {
                    this.newAccessoriesState = true;
                }
            },
            newAccessoriesBlurFun: function () {
                //---->新增配件失去焦点事件
                var req = {};//--->读取头像地址 & 配件名称
                req.productImageUrl = this.productImageUrl;
                req.fittingName = this.newAccessories;
                if (Af.nullstr(req.fittingName)) {
                    return;
                }
                if (req.productImageUrl == "https://www.kaisir.cn/webPic/productImg/productUpLoad.jpg") {
                    MAIN.ErroAlert("请上传配件图片!");
                }
            },
            //财务报表点击函数
            financeReportFun: function () {
                this.financeReportStatus = "block";
                setTimeout(function () {
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
            IncomingGoodsFun: function () {
                this.IncomingGoodsStatus = "block";
                setTimeout(function () {
                    /*渲染原片采购数据表格*/
                    MAIN.OriginaFlilmList($("#nickNameTextPanel").html());
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
            /*进货管理:原片采购[采购登记点击事件]*/
            purchaseRegistrationFun: function () {
                //请求后台获取订单号
                Af.rest("getOrderNumber.api", {}, function (ans) {
                    $("#OriginalFilmorderNumber").val(ans.orderNumber);
                    $("#OriginalFilmDateSelect").val(ans.serverTime);
                });
                layer.open({
                    title: "原片采购",
                    type: 1,
                    area: ['970px', '640px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#PurchaseRegistrationSubmenu"),
                    end: function () { //弹层销毁出发回调
                        $("#OriginalFilmorderNumber").val("");
                        $("#OriginalFilmDateSelect").val("");
                        $("#OriginalFilmsupplier").val("");
                        $("#OriginalFilmspecificationModel").val("");
                        $("#OriginalFilmthickness").val("");
                        $("#OriginalFilmcolor").val("");
                        $("#OriginalFilmquantity").val("");
                        $("#OriginalFilmunitPrice").val("");
                        $("#OriginalFilmtotalPurchase").val("");
                        $("#OriginalFilmshippingFee").val("");
                        $("#OriginalFilmremarks").val("");
                    }
                });
            },
            /*进货管理:原片采购[采购登记{提交}点击事件]*/
            purchaseRegistrationSubmitFun: function () {
                /*获取用户输入的数据*/
                var req = {};
                req.orderNumber = $("#OriginalFilmorderNumber").val();
                req.purchaseDate = $("#OriginalFilmDateSelect").val();
                req.supplier = $("#OriginalFilmsupplier").val();
                req.specificationModel = $("#OriginalFilmspecificationModel").val();
                req.thickness = $("#OriginalFilmthickness").val();
                req.color = $("#OriginalFilmcolor").val();
                req.quantity = $("#OriginalFilmquantity").val();
                req.unitPrice = $("#OriginalFilmunitPrice").val();
                req.totalPurchase = $("#OriginalFilmtotalPurchase").val();
                req.shippingFee = $("#OriginalFilmshippingFee").val();
                req.remarks = $("#OriginalFilmremarks").val();
                req.operator = $("#nickNameTextPanel").html();
                req.addOrderData = "addOrderData";
                if (Af.nullstr(req.purchaseDate) || Af.nullstr(req.supplier) || Af.nullstr(req.specificationModel) || Af.nullstr(req.thickness) || Af.nullstr(req.color) || Af.nullstr(req.quantity) || Af.nullstr(req.unitPrice) || Af.nullstr(req.totalPurchase) || Af.nullstr(req.shippingFee) || Af.nullstr(req.remarks)) {
                    MAIN.ErroAlert("请检查红色必填项!")
                    if (Af.nullstr(req.purchaseDate)) {
                        $("#OriginalFilmDateSelect").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmDateSelect").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (Af.nullstr(req.supplier)) {
                        $("#OriginalFilmsupplier").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmsupplier").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.specificationModel)) {
                        $("#OriginalFilmspecificationModel").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmspecificationModel").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.thickness)) {
                        $("#OriginalFilmthickness").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmthickness").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (Af.nullstr(req.color)) {
                        $("#OriginalFilmcolor").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmcolor").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.quantity)) {
                        $("#OriginalFilmquantity").css({
                            "border-color": "red"
                        });
                    } else {

                        $("#OriginalFilmquantity").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (Af.nullstr(req.unitPrice)) {
                        $("#OriginalFilmunitPrice").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmunitPrice").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.totalPurchase)) {
                        $("#OriginalFilmtotalPurchase").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmtotalPurchase").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.shippingFee)) {
                        $("#OriginalFilmshippingFee").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmshippingFee").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.remarks)) {
                        $("#OriginalFilmremarks").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmremarks").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                } else {
                    Af.rest("PurchaseInfo.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.OriginaFlilmList($("#nickNameTextPanel").html());
                            layer.closeAll();
                            $("#OriginalFilmorderNumber").val("");
                            $("#OriginalFilmDateSelect").val("");
                            $("#OriginalFilmsupplier").val("");
                            $("#OriginalFilmspecificationModel").val("");
                            $("#OriginalFilmthickness").val("");
                            $("#OriginalFilmcolor").val("");
                            $("#OriginalFilmquantity").val("");
                            $("#OriginalFilmunitPrice").val("");
                            $("#OriginalFilmtotalPurchase").val("");
                            $("#OriginalFilmshippingFee").val("");
                            $("#OriginalFilmremarks").val("");
                            //清空select中除第一个以外的选项
                            $("#fittingSpecificationModel option:gt(0)").remove();
                            layer.msg("添加成功!");
                        } else {
                            layer.msg(ans.msg);
                        }
                    });
                    if (!Af.nullstr(req.purchaseDate)) {
                        $("#OriginalFilmDateSelect").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.supplier)) {
                        $("#OriginalFilmsupplier").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.specificationModel)) {
                        $("#OriginalFilmspecificationModel").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.thickness)) {
                        $("#OriginalFilmthickness").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.color)) {
                        $("#OriginalFilmcolor").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.quantity)) {
                        $("#OriginalFilmquantity").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.unitPrice)) {
                        $("#OriginalFilmunitPrice").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.totalPurchase)) {
                        $("#OriginalFilmtotalPurchase").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.shippingFee)) {
                        $("#OriginalFilmshippingFee").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.remarks)) {
                        $("#OriginalFilmremarks").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                }
            },
            /*进货管理:原片采购[采购登记{取消}点击事件]*/
            purchaseRegistrationCancelFun: function () {
                layer.closeAll();
            },
            /*进货管理:原片采购[查询]点击事件*/
            PurchaseregistrationQueryFun: function () {
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.orderNumber = this.originalFilmorderNumber; //---->订单号
                req.originalFilmSupplier = this.supplierSelectVal; //--->供货商
                req.originalFilmRemarks = this.originalFilmRemarksVal; //--->备注
                req.dStart = this.originalFilmdStart;
                req.dEnd = this.originalFilmEnd;
                if (Af.nullstr(req.orderNumber || req.originalFilmSupplier || req.originalFilmRemarks || req.dStart || req.dEnd)) {
                    MAIN.ErroAlert("请选择一个条件后,再点查询!");
                } else {
                    Af.rest("PurchaseInfo.api", req, function (ans) {
                        MAIN.OriginaFlilmDataList(ans.data);
                    });
                }
            },
            /*进货管理:原片采购[删除]点击事件*/
            PurchaseregistrationDelFun: function () {
                var req = {};
                //取出当前选择项订单号
                var ordersArray = MAIN.getSelectOrder("OriginaFlilmList");
                if (Af.nullstr(ordersArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选订单!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var ordersStr = ordersArray.toString();
                        req.orders = Af.strToIntArr(ordersStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delOrders = "delOrders";
                        Af.rest("PurchaseInfo.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.OriginaFlilmList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            /*进货管理:[配件采购]新增点击事件*/
            fittingAddFun: function () {
                var req = {};
                req.operator = $("#nickNameTextPanel").html();
                req.queryAll = "queryAll";
                /*请求后台获取订单号/配件名称/配件图片*/
                Af.rest("FittingPublic.api", req, function (ans) {
                    $("#fittingOrderNumberPanel").val(ans.orderNumber);
                    var data = ans.data;
                    var resultArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var resultObj = {};
                        resultObj["id"] = data[i].id;
                        resultObj["name"] = data[i].fittingName;
                        resultArray.push(resultObj);
                    }
                    //渲染配件名称select
                    MAIN.addSelectVal(resultArray, "fittingSpecificationModel");
                    //渲染日期
                    $("#fittingOrderNumberDate").val(ans.serverTime);
                });
                layer.open({
                    title: "配件采购",
                    type: 1,
                    area: ['970px', '640px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#fittingAddSubmenu"),
                    end: function () { //弹层销毁出发回调
                        $("#fittingOrderNumberPanel").val("");
                        $("#fittingOrderNumberDate").val("");
                        $("#fittingSupplier").val("");
                        $("#fittingSpecificationModel").val(""); //配件采购规格型号
                        $("#fittingpurchaseQuantity").val("");
                        $("#fittingtotalPurchase").val("");
                        $("#fittingpaymentDetails").val("");
                        $("#fittingOtherFee").val("");
                        $("#fittingRemarks").val("");
                        //清空select中除第一个以外的选项
                        $("#fittingSpecificationModel option:gt(0)").remove();
                    }
                });
            },
            /*进货管理:[配件采购{新增提交交互}]*/
            fittingSubmitFun: function () {
                /*获取用户输入的数据*/
                var req = {};
                req.orderNumber = $("#fittingOrderNumberPanel").val();
                req.fittingDate = $("#fittingOrderNumberDate").val();
                req.supplier = $("#fittingSupplier").val();
                req.specificationModel = $("#fittingSpecificationModel").find("option:selected").text();
                req.specificationModelVal = $("#fittingSpecificationModel").val();
                req.purchaseQuantity = $("#fittingpurchaseQuantity").val();
                req.totalPurchase = $("#fittingtotalPurchase").val();
                req.paymentDetails = $("#fittingpaymentDetails").val();
                req.otherFee = $("#fittingOtherFee").val();
                req.remarks = $("#fittingRemarks").val();
                req.operator = $("#nickNameTextPanel").html();
                req.addOrderData = "addOrderData";
                //获取用户自定义输入的配件名称
                req.fittingName = vm.newAccessories;
                req.fittingImgUrl = vm.productImageUrl;
                if (Af.nullstr(req.orderNumber) || Af.nullstr(req.fittingDate) || Af.nullstr(req.supplier) || Af.nullstr(req.purchaseQuantity) || Af.nullstr(req.totalPurchase)) {
                    MAIN.ErroAlert("请检查红色必填项!");
                    if (Af.nullstr(req.fittingDate)) {
                        $("#fittingOrderNumberDate").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#fittingOrderNumberDate").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (Af.nullstr(req.supplier)) {
                        $("#fittingSupplier").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#fittingSupplier").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                    if (Af.nullstr(req.purchaseQuantity)) {
                        $("#fittingpurchaseQuantity").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#fittingpurchaseQuantity").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (Af.nullstr(req.totalPurchase)) {
                        $("#fittingtotalPurchase").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#fittingtotalPurchase").css({
                            "border-color": "#E5E5E5"
                        });

                    }
                } else {
                    Af.rest("FittingInfo.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            $("#fittingOrderNumberPanel").val("");
                            $("#fittingOrderNumberDate").val("");
                            $("#fittingSupplier").val("");
                            $("#fittingSpecificationModel").val("");
                            $("#fittingpurchaseQuantity").val("");
                            $("#fittingtotalPurchase").val("");
                            $("#fittingpaymentDetails").val("");
                            $("#fittingOtherFee").val("");
                            $("#fittingRemarks").val("");
                            //数据表格重载
                            MAIN.annexList($("#nickNameTextPanel").html());
                            layer.closeAll();
                            layer.msg("添加成功!");
                        } else {
                            layer.msg(ans.msg);
                        }
                    });
                    if (!Af.nullstr(req.fittingDate)) {
                        $("#fittingOrderNumberDate").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.supplier)) {
                        $("#fittingSupplier").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.specificationModel)) {
                        $("#fittingSpecificationModel").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.purchaseQuantity)) {
                        $("#fittingpurchaseQuantity").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.totalPurchase)) {
                        $("#fittingtotalPurchase").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.paymentDetails)) {
                        $("#fittingpaymentDetails").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                    if (!Af.nullstr(req.otherFee)) {
                        $("#fittingOtherFee").css({
                            "border-color": "#E5E5E5"
                        });
                    }

                    if (!Af.nullstr(req.remarks)) {
                        $("#fittingRemarks").css({
                            "border-color": "#E5E5E5"
                        });
                    }
                }
            },
            /*进货管理[配件采购{删除}]交互*/
            fittingDelFun: function () {
                var req = {};
                //取出当前选择项订单号
                var ordersArray = MAIN.getSelectOrder("annexList");
                if (Af.nullstr(ordersArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选订单!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var ordersStr = ordersArray.toString();
                        req.orders = Af.strToIntArr(ordersStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delOrders = "delOrders";
                        Af.rest("FittingInfo.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.annexList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            /*进货管理[配件采购]查询交互*/
            fittingQueryFun: function () {
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.orderNumber = this.FittingNumberSelectval; //---->订单号
                req.originalFilmSupplier = this.FittingsupplierSelectval; //--->供货商
                req.originalFilmRemarks = this.FittingremarkSelectval; //--->备注
                req.dStart = this.fittingdStart;
                req.dEnd = this.fittingEnd;
                if (Af.nullstr(req.orderNumber || req.originalFilmSupplier || req.originalFilmRemarks || req.dStart || req.dEnd)) {
                    MAIN.ErroAlert("请选择一个条件后,再点查询!");
                } else {
                    Af.rest("FittingInfo.api", req, function (ans) {
                        MAIN.annexDataList(ans.data);
                    });
                }
            },
            //出货管理点击函数
            shipmentFun: function () {
                this.shipmentStatus = "block";
                setTimeout(function () {
                    /*渲染出货管理数据表格*/
                    MAIN.originalFilmOutList($("#nickNameTextPanel").html());
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
            //出货管理根据日期[查询]点击函数
            shipmentQueryFun: function () {
                var req = {};
                req.dStart = this.ShipmentdStart;
                req.dEnd = this.ShipmentdEnd;
                req.conditionalQuery = "conditionalQuery";
                req.operator = $("#nickNameTextPanel").html();
                if (Af.nullstr(req.dStart) || Af.nullstr(req.dEnd) || Af.nullstr(req.operator)) {
                    MAIN.ErroAlert("请选择查询条件");
                }
                else {
                    Af.rest("ShipmentInfo.api", req, function (ans) {
                        MAIN.originalFilmOutDataList(ans.data);
                    })
                }
            },
            //出货管理[新增]点击函数
            shipmentAddFun: function () {
                //清空select中除第一个以外的选项
                $("#shippingCustomerNameSelectPanel option:gt(0)").remove();
                $("#shippingOrderNumberSelectPanel option:gt(0)").remove();
                var req = {};
                req.queryType = ["clientName", "orderNumber"];
                req.operator = $("#nickNameTextPanel").html();
                //请求后台获取订单表内订单信息
                Af.rest("orderInfonQueiry.api", req, function (ans) {
                    var data = ans.data;
                    //取出客户名称(生成客户名称下拉列表所需要的数据)
                    var clientNameSelectData = [];
                    var orderNumberSelectData = [];
                    for (var i = 0; i < data.length; i++) {
                        var clientNameObj = {};
                        var orderNumberObj = {};
                        clientNameObj["id"] = data[i].id;
                        clientNameObj["name"] = data[i].clientName;
                        orderNumberObj["id"] = data[i].id;
                        orderNumberObj["name"] = data[i].orderNumber;
                        clientNameSelectData.push(clientNameObj);
                        orderNumberSelectData.push(orderNumberObj);
                    }
                    //渲染 客户名称 订单号
                    MAIN.addSelectVal(clientNameSelectData, "shippingCustomerNameSelectPanel");
                    MAIN.addSelectVal(orderNumberSelectData, "shippingOrderNumberSelectPanel");
                });
                layer.open({
                    title: "新增发货",
                    type: 1,
                    area: ['1170px', '740px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#shipmentAddSubmenu"),
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            itemCloseFun: function (index) {
                if (vm.modelDetailsList.length == 1) {
                    MAIN.ErroAlert("不能删除了");
                }
                else { //循环已发货数据找到相同itemID的元素并删除
                    for (let i = 0; i < vm.modelDetailsList.length; i++) {
                        if (index == vm.modelDetailsList[i].itemID) {
                            vm.modelDetailsList.splice(i--, 1);
                        }
                    }
                }
            },
            //出货管理[新增]悬浮层{添加发货}点击事件
            addShipmentFun: function () {
                layer.open({
                    title: "配送信息",
                    type: 1,
                    area: ['710px', '370px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#invoiceTransport-panel"),
                    anim: 1,//从上掉落
                    shade: 0, //关闭遮罩
                    btn: ['确定'],
                    yes: function (index, layero) {
                        if (Af.nullstr(vm.invoiceTransportationManager)) {
                            MAIN.ErroAlert("请输入运输负责人");
                        }
                        else {
                            layer.close(index);
                            var rawData = vm.shippingCustomerValArr;//-->用户选择客户名称后后台返回的用户规格型号
                            //获取当前元素表格下 已选择的元素(用find查找.rowLineSelectStyle的元素产生一个集合)
                            var elementCollection = $("#OrderModelList tbody").find(".rowLineSelectStyle");
                            //判断用户是否有勾选规格型号
                            if (elementCollection.length == 0) {
                                MAIN.ErroAlert("请选择要发货的规格型号!");
                                return;
                            }
                            for (var i = 0; i < elementCollection.length; i++) {   /*遍历得到的集合,取出每一项的自定义属性 */
                                var rowLine = elementCollection.eq(i).attr("data-rowLine");
                                var item = elementCollection.eq(i).attr("data-item");
                                var modelDetailsObj = {};//给已发货数据赋值
                                modelDetailsObj["id"] = rawData[rowLine][item].id;//--->id
                                modelDetailsObj["itemID"] = i;
                                modelDetailsObj["productName"] = rawData[rowLine][item].productName;//--->规格型号名称
                                modelDetailsObj["glassLength"] = rawData[rowLine][item].glassLength;//--->长度
                                modelDetailsObj["glassWidth"] = rawData[rowLine][item].glassWidth;//--->宽度
                                modelDetailsObj["glassNum"] = rawData[rowLine][item].glassNum; //--->数量
                                modelDetailsObj["glassArea"] = rawData[rowLine][item].glassArea;//--->面积
                                modelDetailsObj["totalAmount"] = rawData[rowLine][item].totalAmount;//--->总金额
                                modelDetailsObj["glassMark"] = rawData[rowLine][item].glassMark;//--->标记
                                vm.modelDetailsList.push(modelDetailsObj);//--->渲染型号详情蓝色小条目
                            }
                            $("#OrderModelList tbody .rowLineSelectStyle").remove();//--->删除表格内已选择的选项
                            $("#OrderModelTableSubmenu").css({"display": "block"}); //--->表格遮罩显示,禁止用户编辑
                            /*计算用户选择的规格型号,并产生将其归类结束*/
                        }
                    }
                });
            },
            //出货管理[新增]悬浮层{提交}点击函数
            addShipmentSubmitFun: function () {
                //--->判断用户是否有选择规格型号
                if (vm.modelDetailsList.length == 0) {
                    MAIN.ErroAlert("不能提交空数据!请勾选,想要发货的规格型号!");
                    return;
                }
                //--->定义(发货总数量/发货总面积/发货总金额/剩余数量/剩余面积)
                var theTotalNumber = 0;
                var theTotalArea = 0;
                var theTotalAmount = 0;
                var theRemainingAmount = 0;
                var remainingArea = 0;
                var req = {};
                var rawData = vm.shippingCustomerValArr;//-->用户选择客户名称后后台返回的用户规格型号
                /*计算未发货的玻璃规格型号:取出已发货的数组和总数组,未发货的数组 = 总数组 - 已发货数组*/
                var editRawData = [];
                fun(rawData);//--->将二维数组转成一维数组
                //取出已发货数组里数据
                var shippedDataList = vm.modelDetailsList;
                for (let i = 0; i < shippedDataList.length; i++) {
                    delete shippedDataList[i].itemID; //删除json中的itemID
                    //取出(玻璃数量/玻璃面积/金额/未付款)
                    let glassNum = shippedDataList[i].glassNum;
                    let glassArea = shippedDataList[i].glassArea;
                    let totalAmount = shippedDataList[i].totalAmount;
                    theTotalNumber = Af.accAdd(theTotalNumber, glassNum);
                    theTotalArea = Af.accAdd(theTotalArea, glassArea);
                    theTotalAmount = Af.accAdd(theTotalAmount, totalAmount);
                }
                //比对全部数据和已发货数据,删除已发货数据,计算未发货数据
                for (let i = 0; i < editRawData.length; i++) {
                    for (let j = 0; j < shippedDataList.length; j++) {
                        if (_.isEqual(editRawData[i], shippedDataList[j])) {//调用_.isEqual方法判断对象是否相等
                            //layer.msg("相同元素出现");
                            editRawData.splice(i--, 1);   //删除相同元素:得到未发货数据
                        }
                    }
                }
                //计算剩余数量 剩余面积
                for (let i = 0; i < editRawData.length; i++) {
                    let glassNum = editRawData[i].glassNum;
                    let glassArea = editRawData[i].glassArea;
                    theRemainingAmount = Af.accAdd(theRemainingAmount, glassNum);
                    remainingArea = Af.accAdd(remainingArea, glassArea);
                }
                var shippedDataArr = Af.getJSONArray(shippedDataList);//将即将发货的数据归类
                var unfinishedArr = Af.getJSONArray(editRawData);//将未发货的数组进行归类
                /*Af.trace("将要发货的数据:");
                Af.trace(shippedDataArr);
                Af.trace("剩余未发货的数据:");
                Af.trace(unfinishedArr);*/
                /*计算未发货的玻璃规格型号结束*/
                /*请求后台发送:已发货,剩余发货数据*/
                req.addOrderData = "addOrderData"; //--->新增发货字段
                req.clientName = Af.getSelectText("#shippingCustomerNameSelectPanel");//--->客户名称
                req.clientId = $("#shippingCustomerNameSelectPanel").val(); //--->拿出当前客户对应的id
                req.specificationModel = shippedDataArr; //已发货数据
                req.unfinishedArr = unfinishedArr; //剩余未发货数据
                req.operator = $("#nickNameTextPanel").html();
                req.numberShipments = theTotalNumber.toString(); //--->发货数量
                req.shipArea = theTotalArea.toString(); //--->发货面积
                req.theTotalAmount = theTotalAmount.toString(); //--->发货金额
                req.theRemainingAmount = theRemainingAmount.toString();//剩余数量
                req.remainingArea = remainingArea.toString(); //剩余面积
                req.paymentDetails = vm.invoicePaymentDetails; //付款明细
                req.transportationManager = vm.invoiceTransportationManager; //运输负责人
                req.freight = vm.invoiceFreight;//运费
                Af.rest("ShipmentInfo.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        MAIN.ErroAlert(ans.msg);
                    }
                    else {
                        var data = ans.orderInfo;
                        Af.trace(data);
                        //取出客户名称
                        $("#invoiceClientName").html(Af.getSelectText("#shippingCustomerNameSelectPanel"));
                        //从后台拿出(工程名称/订单号/联系电话/送货地址/订单日期/发货日期/未付款金额)
                        $("#invoiceProjectName").html(data.invoiceProjectName);
                        $("#invoiceOrderNumber").html(data.invoiceOrderNumber);
                        $("#invoiceContactNumber").html(data.invoiceContactNumber);
                        $("#invoiceDeliveryAddress").html(data.invoiceDeliveryAddress);
                        $("#invoiceOrderDate").html(data.invoiceOrderDate);
                        $("#invoiceDateOfShipment").html(data.invoiceDateOfShipment);
                        $("#invoiceUnpaid").html(data.unpaid);
                        //总数量,总面积,总金额 打印时间 运输负责人
                        $("#invoiceTotalNumber").html(theTotalNumber + "块");
                        $("#invoiceTotalArea").html(theTotalArea + "平方");
                        $("#invoiceTotalAmount").html(theTotalAmount + "元");
                        $("#printTime").html(data.invoiceDateOfShipment);
                        $("#transportationManager").html(vm.invoiceTransportationManager);
                        /*渲染打印模板表格区域*/
                        var num = 0;
                        for (var i = 0; i < shippedDataArr.length; i++) //--->渲染生产单表格区域
                        {
                            var trStart = "<tr>";
                            var trEnd = "</tr>";
                            var td,
                                td1,
                                td2,
                                td3,
                                td4,
                                td5,
                                td7,
                                td8;
                            var tdType = "<td colspan='7'>";
                            var dataArrayLength = Af.getJsonLength(shippedDataArr[i]); //---->获取当前JSONArray下的数据长度
                            if (dataArrayLength > 1) {
                                num++;
                                $("#invoicePrintList  tbody").append(trStart + tdType + "规格型号:" + shippedDataArr[i][0].productName + "</td>" + trEnd);
                                for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                {
                                    td = "<td>" + j + "</td>";
                                    td1 = "<td>" + shippedDataArr[i][j].glassLength + "</td>";
                                    td2 = "<td>" + shippedDataArr[i][j].glassWidth + "</td>";
                                    td3 = "<td>" + shippedDataArr[i][j].glassNum + "</td>";
                                    td4 = "<td>" + "  " + "</td>";
                                    td5 = "<td>" + shippedDataArr[i][j].glassArea + "</td>";
                                    td7 = "<td>" + "  " + "</td>";
                                    td8 = "<td>" + shippedDataArr[i][j].totalAmount + "</td>";
                                    $("#invoicePrintList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                                }

                            } else {
                                $("#invoicePrintList  tbody").append(trStart + tdType + "规格型号:" + shippedDataArr[i][0].productName + "</td>" + trEnd);
                                for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                {
                                    td = "<td>" + j + "</td>";
                                    td1 = "<td>" + shippedDataArr[i][j].glassLength + "</td>";
                                    td2 = "<td>" + shippedDataArr[i][j].glassWidth + "</td>";
                                    td3 = "<td>" + shippedDataArr[i][j].glassNum + "</td>";
                                    td4 = "<td>" + "  " + "</td>";
                                    td5 = "<td>" + shippedDataArr[i][j].glassArea + "</td>";
                                    td7 = "<td>" + "  " + "</td>";
                                    td8 = "<td>" + shippedDataArr[i][j].totalAmount + "</td>";
                                    $("#invoicePrintList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                                }
                            }
                        }
                        /*清空当前用户输入的数据*/
                        vm.shippingCustomerValArr = "";//--->后台返回的当前用户的未发货规格型号
                        vm.modelDetailsList = [];  //已选择的规格型号小条目
                        $("#OrderModelTableSubmenu").css({"display": "none"}); //--->禁止编辑遮罩层隐藏
                        $("#OrderModelList tbody").html("");//--->清空已经渲染的表格
                        layer.closeAll();
                        /*重载数据表格*/
                        MAIN.originalFilmOutList($("#nickNameTextPanel").html());
                        /*开始打印*/
                        $("#invoicePrintTemplate").css({
                            "display": "block"
                        });
                        setTimeout(function () {
                            $("#invoicePrintTemplate").css({
                                "display": "none"
                            });
                        }, 400);
                        $("#invoicePrintTemplate").jqprint({}); //---->打印函数
                        $("#invoicePrintList  tbody").html("");//--->清空渲染过的数据表格
                    }
                });

                /*多维数组转一维数组函数*/
                function fun(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (Array.isArray(arr[i])) {
                            fun(arr[i]);
                        } else {
                            editRawData.push(arr[i]);
                        }
                    }
                }
            },
            //出货管理[新增]悬浮层{取消}点击函数
            shipmentAddCloseFun: function () {
                layer.closeAll();
            },
            //出货管理[删除]点击事件
            shipmentDelFun: function () {
                var req = {};
                //取出当前选择项订单号
                var idsArray = MAIN.getSelectId("originalFilmOutList");
                if (Af.nullstr(idsArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选订单!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var idsStr = idsArray.toString();
                        req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delOrders = "delOrders";
                        Af.rest("ShipmentInfo.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.originalFilmOutList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            //出货管理[导出] 函数
            shipmentExportFun: function () {
                var tableTitle = ['序列号', '客户姓名', '发货日期', '发货数量', '发货面积', '剩余数量', '剩余面积', '发货金额', '运输负责人', '运费'];
                var selectDatas = MAIN.getShipmentDatas("originalFilmOutList");
                if (!Af.nullstr(selectDatas)) {
                    MAIN.exportFun(tableTitle, selectDatas);
                }
            },
            //库存管理点击事件
            stockFun: function () {
                this.stockStatus = "block";
                setTimeout(function () {
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
            OrderInfoFun: function () {
                this.orderManagementStatus = "block";
                setTimeout(function () {
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
            orderBtnQueryFun: function () {
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
                    Af.rest("orderInfonQueiry.api", req, function (ans) {
                        MAIN.orderInfoCustomizeList(ans.data);
                    });
                }
            },
            /*订单信息管理:开单按钮点击交互函数*/
            billingFun: function () {
                layer.open({
                    title: "正在开单",
                    type: 1,
                    area: ['1270px', '840px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#billingManageSubmenu"),
                    end: function () { //弹层销毁出发回调

                    }
                });
                /*请求后台获取 规格型号[产品名称] 集合*/
                var req = {};
                req.operator = $("#nickNameTextPanel").html(); //--->获取用户名
                req.queryType = ["productName", "unitPrice"];
                var selectData = []; //品名型号下拉列表数据
                Af.rest("productNameModelInquiry.api", req, function (ans) { //查询原片信息表
                    if (ans.errorCode == 0) {
                        var resultArray = ans.data; //--->JSONArray
                        for (var i = 0; i < resultArray.length; i++) {
                            var resultOBJ = {};
                            resultOBJ['id'] = resultArray[i].id;
                            resultOBJ['name'] = resultArray[i].productName;
                            resultOBJ['unitPrice'] = resultArray[i].unitPrice;
                            selectData.push(resultOBJ);
                            ansSelectData.push(resultOBJ);
                        }
                        //渲染品名型号下拉选择
                        MAIN.addSelectVal(selectData, "customize1");
                        //获取订单号并赋值
                        $("#billingOrderNumber").val(ans.serverTime);
                        MAIN.billingorderNumber = ans.serverTime;
                        //获取服务器时间并赋值
                        $("#billingDatePanel").val(ans.nowTime);
                    }
                });
                var selectId; //用户选择slect下拉框的id(打开弹出层时,设置一个定时器!用于监听用户是否选择下拉框)
                timer = setInterval(function () {
                    selectId = $("select[name='customize1']").val();
                    if (!Af.nullstr(selectId)) {
                        //给单价赋值
                        $("#submenu .table-panel .content-panel .row_1 .item-panel .unitPrice").val(selectData[selectId - 1].unitPrice);
                    }
                }, 100);
            },
            /*订单信息管理:开单悬浮层[新增] 数据交互*/
            billingaddFun: function () {
            },
            /*订单信息管理:开单悬浮层[删除] 数据交互*/
            billingDelFun: function () {
            },
            /*订单信息管理:开单悬浮层[打印]*/
            billingPrintFun: function () {
                /*获取用户输入的所有规格型号信息*/
                var userInputDatas = [];
                var userInputArray = [];
                for (var i = 1; i <= 300; i++) {
                    var userInputOBJ = {};
                    //获取容器
                    var lengthVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassLength");
                    var widthVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassWidth");
                    var numVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassNum");
                    var marksVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .marks");
                    var areaVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .area");
                    var totalAmountVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .totalAmount");
                    var userSelectData = $("#submenu .table-panel .content-panel .row_" + i + " .specificationModel select").find("option:selected").text();
                    if (Af.nullstr(userSelectData) || Af.nullstr(lengthVessel.val())) {
                        //退出循环
                        break;
                    }
                    var glassLength = lengthVessel.val();
                    var glassWidth = widthVessel.val();
                    var glassNum = numVessel.val();
                    var markval = marksVessel.val();
                    var areaVal = areaVessel.val();
                    var totalAmount = totalAmountVessel.val();
                    /*生成JSONArray*/
                    userInputOBJ['id'] = i;
                    userInputOBJ['productName'] = userSelectData; //-->型号
                    userInputOBJ['glassLength'] = glassLength; //-->长
                    userInputOBJ['glassWidth'] = glassWidth; //-->宽
                    userInputOBJ['glassNum'] = glassNum; //-->数量
                    userInputOBJ['glassMark'] = markval; //-->标记
                    userInputOBJ['glassArea'] = areaVal; //-->面积
                    userInputOBJ['totalAmount'] = totalAmount; //-->总金额
                    globalArea = Af.accAdd(areaVal, globalArea);
                    globalPrice = Af.accAdd(totalAmount, globalPrice);
                    $("#globalArea").html(globalArea);
                    $("#globalPrice").html(globalPrice);
                    //计算玻璃数量
                    globalGlassNum = Af.accAdd(glassNum, globalGlassNum);
                    $("#billingGlassNum").val(globalGlassNum);
                    $("#billingTotalArea").val(globalArea);
                    $("#billingtotalAmount").val(globalPrice);
                    //put Obj
                    userInputDatas.push(userInputOBJ);
                }
                //读取已付款
                var billingPaidValue = $("#billingPaid").val();
                if (Af.nullstr(billingPaidValue)) {
                    billingPaidValue = 0;
                }
                //计算未付款
                $("#billingUnpaid").val(globalPrice - billingPaidValue);
                //计算其他费用
                var billingOtherCostVal = $("#billingOtherCost").val();
                if (Af.nullstr(billingOtherCostVal)) {
                    var billingOtherCostVal = $("#billingOtherCost").val(0);
                }
                //JSONArray归类(相同的归为一类) :发送给后台
                userInputArray = Af.getJSONArray(userInputDatas);
                var req = {};
                req.operator = $("#nickNameTextPanel").html();
                req.clientName = $("#billingClientName").val(); //-->客户名称
                req.projectName = $("#billingprojectName").val(); //-->工程名称
                req.orderNumber = MAIN.billingorderNumber //-->订单号
                req.time = $("#billingDatePanel").val(); //-->日期
                req.deliveryAddress = $("#billingdeliveryAddress").val(); //--->送货地址
                req.contactNumber = $("#billingcontactNumber").val(); //--->联系电话
                req.ShippingMethod = $("#billingShippingMethod").find("option:selected").text(); //--->发货方式
                req.billingPreparedBy = $("#billingPreparedBy").find("option:selected").text(); //---->制单人
                req.glassNumber = $("#billingGlassNum").val(); //--->玻璃数量
                req.totalArea = $("#billingTotalArea").val(); //-->总面积
                req.otherCost = $("#billingOtherCost").val(); //-->其他费用
                req.totalAmount = $("#billingtotalAmount").val(); //--->总金额
                req.remarks = $("#billingRemarks").val(); //--->备注
                req.Paid = $("#billingPaid").val(); //--->已付款
                req.Unpaid = $("#billingUnpaid").val(); //--->未付款
                //数据发送后台
                req.data = userInputArray;
                req.addOrderData = "addOrderData";
                if (Af.nullstr(req.clientName) || Af.nullstr(req.projectName) || Af.nullstr(req.time) || Af.nullstr(req.deliveryAddress) || Af.nullstr(req.contactNumber)) {
                    MAIN.ErroAlert("清检查红色必填项!");
                    if (Af.nullstr(req.clientName)) {
                        $("#billingClientName").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#billingClientName").css({
                            "border-color": "#D7D7D7"
                        });
                    }
                    if (Af.nullstr(req.projectName)) {
                        $("#billingprojectName").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#billingprojectName").css({
                            "border-color": "#D7D7D7"
                        });
                    }
                    if (Af.nullstr(req.time)) {
                        $("#billingDatePanel").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#billingDatePanel").css({
                            "border-color": "#D7D7D7"
                        });
                    }
                    if (Af.nullstr(req.deliveryAddress)) {
                        $("#billingdeliveryAddress").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#billingdeliveryAddress").css({
                            "border-color": "#D7D7D7"
                        });
                    }
                    if (Af.nullstr(req.contactNumber)) {
                        $("#billingcontactNumber").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#billingcontactNumber").css({
                            "border-color": "#D7D7D7"
                        });
                    }
                } else {
                    //用户输入条件正确
                    $("#billingClientName").css({
                        "border-color": "#D7D7D7"
                    });
                    $("#billingprojectName").css({
                        "border-color": "#D7D7D7"
                    });
                    $("#billingDatePanel").css({
                        "border-color": "#D7D7D7"
                    });
                    $("#billingdeliveryAddress").css({
                        "border-color": "#D7D7D7"
                    });
                    $("#billingcontactNumber").css({
                        "border-color": "#D7D7D7"
                    });
                    //给打印模板传数据
                    $("#ProductionOrderName").html(req.clientName); //--->客户名称
                    $("#ProductionOrderProdyctName").html(req.projectName); //--->工程名称
                    $("#ProductionOrderOrderNum").html(req.orderNumber); //--->单号
                    $("#ProductionOrderProdyctCell").html(req.contactNumber); //--->联系电话
                    $("#ProductionOrderAddress").html(req.deliveryAddress); //--->送货地址
                    $("#ProductionOrderDate").html(req.time); //--->日期
                    //$("#MerchantAddress").html();//--->当前登陆企业的地址
                    //$("#MerchantCell").html();//--->当前登陆企业电话
                    //$("#MerchantFax").html();//--->当前登陆企业传真
                    Af.rest("orderInfonQueiry.api", req, function (ans) {
                        if (ans.errorCode != 0) {
                            layer.msg("处理异常:" + ans.msg);
                        } else {
                            MAIN.orderInfoList(ans.operator);
                        }
                    });
                    var num = 0;
                    for (var i = 0; i < userInputArray.length; i++) //--->渲染生产单表格区域
                    {
                        var trStart = "<tr>";
                        var trEnd = "</tr>";
                        var td,
                            td1,
                            td2,
                            td3,
                            td4,
                            td5,
                            td7;
                        var tdType = "<td colspan='7'>";
                        var dataArrayLength = Af.getJsonLength(userInputArray[i]); //---->获取当前JSONArray下的数据长度
                        if (dataArrayLength > 1) {
                            num++;
                            $("#ProductionOrderList  tbody").append(trStart + tdType + "规格型号:" + userInputArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + userInputArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + userInputArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + userInputArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + userInputArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + userInputArray[i][j].glassArea + "</td>";
                                td7 = "<td>" + "  " + "</td>";
                                $("#ProductionOrderList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + trEnd); //---->追加到页面
                            }

                        } else {
                            $("#ProductionOrderList  tbody").append(trStart + tdType + "规格型号:" + userInputArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + userInputArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + userInputArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + userInputArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + userInputArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + userInputArray[i][j].glassArea + "</td>";
                                td7 = "<td>" + "  " + "</td>";
                                $("#ProductionOrderList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + trEnd); //---->追加到页面
                            }
                        }
                    }
                    /*开始打印*/
                    $("#PrintTemplate").css({
                        "display": "block"
                    });
                    setTimeout(function () {
                        $("#PrintTemplate").css({
                            "display": "none"
                        });
                    }, 400);
                    $("#PrintTemplate").jqprint({}); //---->打印函数
                    layer.closeAll(); //关闭所有弹出层
                    //清空用户输入与自动计算数据
                    $("#billingClientName").val(""); //-->客户名称
                    $("#billingprojectName").val(""); //-->工程名称
                    MAIN.billingorderNumber = 0 //-->订单号
                    $("#billingDatePanel").val(""); //-->日期
                    $("#billingdeliveryAddress").val(""); //--->送货地址
                    $("#billingcontactNumber").val(""); //--->联系电话
                    $("#billingGlassNum").val(""); //--->玻璃数量
                    $("#billingTotalArea").val(""); //-->总面积
                    $("#billingOtherCost").val(""); //-->其他费用
                    $("#billingtotalAmount").val(""); //--->总金额
                    $("#billingRemarks").val(""); //--->备注
                    $("#billingPaid").val(0); //--->已付款
                    $("#billingUnpaid").val(0); //--->未付款
                    //清空动态Table中tbody中的数据
                    $("#ProductionOrderList tbody").html("");
                    //用户输入的品名型号表复位
                    for (var i = 2; i <= globalVar; i++) {
                        $("#submenu .table-panel .content-panel .row_" + i + "").remove();
                    }
                    //全局变量复位
                    globalVar = 1;
                    globalGlassNum = 0;
                    globalArea = 0;
                    globalPrice = 0;

                }

            },
            /*订单信息管理:删除订单交互函数*/
            DeleteOrderFun: function () {
                var req = {};
                //取出当前选择项订单号
                var ordersArray = MAIN.getSelectOrder("orderInfoList");
                if (Af.nullstr(ordersArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选订单!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var ordersStr = ordersArray.toString();
                        req.orders = Af.strToIntArr(ordersStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delOrders = "delOrders";
                        Af.rest("orderInfonQueiry.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.orderInfoList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            /*订单信息管理:订单导出函数*/
            ExportOrderFun: function () {
                var tableTitle = ['订单号', '日期', '客户名称', '工程名称', '玻璃数量', '总面积', '发货数量', '发货面积', '附加费用', '总金额', '已付款', '未付款', '完成发货', '制单人'];
                var selectDatas = MAIN.getSelectDatas("orderInfoList");
                if (!Af.nullstr(selectDatas)) {
                    MAIN.exportFun(tableTitle, selectDatas);
                }
            },
            /*订单信息管理:订单详情交互*/
            orderDetailsFun: function () {
                //清空订单详情表格
                $("#orderDetailsSubmenu  tbody").html("");
                //渲染订单详情表格
                var orders = orderNumber = MAIN.getSelectOrder("orderInfoList");
                if (Af.nullstr(orders)) {
                    MAIN.ErroAlert("请勾选一个订单");
                } else {
                    if (orders.length > 1) {
                        MAIN.ErroAlert("只能勾选一个订单号进行查询,请更改!");
                    } else {
                        var req = {};
                        req.orderNumber = orders[0];
                        req.queryModelDetails = "modelDetails";
                        req.operator = "";
                        Af.rest("orderInfonQueiry.api", req, function (ans) {
                            var dataArray = ans.data;
                            var nowOrderInfo = ans.nowOrderInfo;
                            if (!Af.nullstr(nowOrderInfo)) {
                                $("#DetailsOrderNumber").val(nowOrderInfo[0].orderNumber);
                                $("#DetailsOrderClientName").val(nowOrderInfo[0].clientName);
                                $("#DetailsOrderProjectName").val(nowOrderInfo[0].projectName);
                                $("#DetailsOrderDate").val(nowOrderInfo[0].orderDate);
                                $("#DetailsOrderShippedQuantity").val(nowOrderInfo[0].numberShipments);
                                $("#DetailsOrderShippedArea").val(nowOrderInfo[0].shipArea);
                                $("#DetailsOrderUndeliveredQuantity").val();//--->未发货数量
                                $("#DetailsOrderUnshippedArea").val();//--->未发货面积
                                $("#DetailsOrderdeliveryAddress").val(nowOrderInfo[0].deliveryAddress);
                                $("#DetailsOrderTransportationManager").val();//->运输负责人
                                $("#DetailsOrderTransportationCosts").val();//--->运输费用
                                $("#DetailsOrderRemarks").val(nowOrderInfo[0].remarks);

                                $("#DetailsOrdertotalAmount").html(nowOrderInfo[0].totalAmount);  //--->总金额
                                $("#DetailsOrdertheTotalArea").html(nowOrderInfo[0].totalArea);  //--->总面积
                            }
                            if (Af.nullstr(dataArray)) {
                                MAIN.ErroAlert("该订单下没有录入规格型号!");
                            } else {
                                var num = 0;
                                for (var i = 0; i < dataArray.length; i++) //--->渲染生产单表格区域
                                {
                                    var trStart = "<tr>";
                                    var trEnd = "</tr>";
                                    var td,
                                        td1,
                                        td2,
                                        td3,
                                        td4,
                                        td5;
                                    var tdType = "<td colspan='7' class='title'>";
                                    var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                                    if (dataArrayLength > 1) {
                                        num++;
                                        $("#orderDetailsSubmenu  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                        for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                        {
                                            td = "<td>" + j + "</td>";
                                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                            $("#orderDetailsSubmenu  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                                        }

                                    } else {
                                        $("#orderDetailsSubmenu  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                        for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                        {
                                            td = "<td>" + j + "</td>";
                                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                            $("#orderDetailsSubmenu  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                                        }
                                    }
                                }
                                layer.open({
                                    title: "订单详情",
                                    type: 1,
                                    area: ['1170px', '740px'],
                                    //shadeClose : true, //点击遮罩关闭
                                    content: $("#orderDetailsSubmenu"),
                                    end: function () { //弹层销毁出发回调

                                    }
                                });
                            }
                        });
                    }
                }
            },
            /*订单月结管理点击事件*/
            OrderMonthlyFun: function () {
                this.OrderMonthStatus = "block";
                setTimeout(function () {
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
            /*基础信息[客户信息]管理点击事件*/
            CustomerInfoFun: function () {
                this.CustomerInfoStatus = "block";
                setTimeout(function () {
                    /*渲染客户信息数据表格*/
                    MAIN.CustomerInfoList($("#nickNameTextPanel").html());
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
            /*基础信息[客户信息]管理:查询点击事件*/
            ClientInfoQueryFun: function () {
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.clientName = this.clientInfoName; //---->客户姓名
                req.dStart = this.clientInfoStart; //--->开始时间
                req.dEnd = this.clientInfoEnd;//--->结束时间
                if (Af.nullstr(req.clientName || req.dStart || req.dEnd)) {
                    MAIN.ErroAlert("请选择一个条件后,再点查询!");
                } else {
                    Af.rest("ClientInfo.api", req, function (ans) {
                        MAIN.CustomerInfoDataList(ans.data);
                    });
                }
            },
            /*基础信息[客户信息]管理:新增客户点击事件*/
            addClientFun: function () {
                layer.open({
                    title: "新增客户",
                    type: 1,
                    area: ['960px', '470px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#addClientSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.clientNameVal) || Af.nullstr(vm.companyNameVal) || Af.nullstr(vm.contactAddressVal) || Af.nullstr(vm.phoneNumberVal) || Af.nullstr(vm.bankAccountVal) || Af.nullstr(vm.bankCardNumberVal)) {
                            MAIN.ErroAlert("客户名称,公司名称,联系地址,手机号,开户银行,银行卡号为必填项!");
                            return;
                        }
                        //用正则表达式判断用户输入的数据是否符合规范
                        var regExpChinese = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                        var reqExpEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                        var regExpNum = new RegExp(/^\d{1,}$/);
                        if (!regExpChinese.test(vm.clientNameVal)) {
                            layer.msg("客户名称必须为纯中文!");
                            return;
                        }
                        if (!regExpChinese.test(vm.companyNameVal)) {
                            layer.msg("公司名称必须为纯中文!");
                            return;
                        }
                        if (!regExpNum.test(vm.bankCardNumberVal)) {
                            layer.msg("银行卡号格式不符合规范!");
                            return;
                        }
                        if (!Af.nullstr(vm.mailboxVal)) {
                            if (!reqExpEmail.test(vm.mailboxVal)) {
                                layer.msg("邮箱格式不符合规范!");
                                return;
                            }
                        }
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            addClient: "addClient",
                            customerType: $("#customerTypeSelectPanel").find("option:selected").text(),
                            clientName: vm.clientNameVal,
                            companyName: vm.companyNameVal,
                            taxNumber: vm.invoiceTaxNumberVal,
                            address: vm.contactAddressVal,
                            phoneNumber: vm.phoneNumberVal,
                            weChat: vm.weChatNumberVal,
                            email: vm.mailboxVal,
                            bankAccount: vm.bankAccountVal,
                            bankCardNumber: vm.bankCardNumberVal
                        };
                        Af.rest("ClientInfo.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.clientNameVal = "";
                                vm.companyNameVal = "";
                                vm.invoiceTaxNumberVal = "";
                                vm.contactAddressVal = "";
                                vm.phoneNumberVal = "";
                                vm.weChatNumberVal = "";
                                vm.mailboxVal = "";
                                vm.bankAccountVal = "";
                                vm.bankCardNumberVal = "";
                                layer.closeAll();
                                MAIN.CustomerInfoList($("#nickNameTextPanel").html());
                            }
                            layer.msg(ans.msg);
                        });

                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            /*基础信息[客户信息]管理:删除客户点击事件*/
            delClientFun: function () {
                var req = {};
                //取出当前选择项用户编号
                var idsArray = MAIN.getSelectId("CustomerInfoList");
                if (Af.nullstr(idsArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选要删除的用户!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var idsStr = idsArray.toString();
                        req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delClients = "delClients";
                        Af.rest("ClientInfo.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.CustomerInfoList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            /*基础信息[客户信息]管理:修改客户信息*/
            editClientFun: function () {
                //取出当前选择项的所有数据
                var datasArray = MAIN.getSelectData("CustomerInfoList");
                if (datasArray.length == 0) {
                    MAIN.ErroAlert("不能修改空数据,请勾选一个客户!");
                    return;
                } else if (datasArray.length > 1) {
                    MAIN.ErroAlert("不能修改大于一条的数据!");
                    return;
                }
                layer.open({
                    title: "编辑客户",
                    type: 1,
                    area: ['960px', '470px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#editClientSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    success:function(){
                        for(let i = 0;i<datasArray.length;i++){
                            vm.clientId = datasArray[i].id;
                            /*给表单赋值*/
                            vm.editClientNameVal = datasArray[i].clientName;  //--->客户名称
                            vm.editCompanyNameVal = datasArray[i].companyName; //--->公司名称
                            vm.editInvoiceTaxNumberVal = datasArray[i].taxNumber;  //--->发票税号
                            vm.editContactAddressVal = datasArray[i].address; //--->联系地址
                            vm.editPhoneNumberVal = datasArray[i].phoneNumber;    //--->手机号
                            vm.editWeChatNumberVal = datasArray[i].weChat; //--->微信号
                            vm.editMailboxVal = datasArray[i].email; //--->邮箱
                            vm.editBankAccountVal = datasArray[i].bankAccount; //--->开户银行
                            vm.editBankCardNumberVal = datasArray[i].bankCardNumber; //银行卡号
                        }
                    },
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.editClientNameVal) || Af.nullstr(vm.editCompanyNameVal) || Af.nullstr(vm.editContactAddressVal) || Af.nullstr(vm.editPhoneNumberVal) || Af.nullstr(vm.editBankAccountVal) || Af.nullstr(vm.editBankCardNumberVal)) {
                            MAIN.ErroAlert("客户名称,公司名称,联系地址,手机号,开户银行,银行卡号为必填项!");
                            return;
                        }
                        //用正则表达式判断用户输入的数据是否符合规范
                        var regExpChinese = new RegExp("^[\u4e00-\u9fa5]{0,}$");
                        var reqExpEmail = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                        var regExpNum = new RegExp(/^\d{1,}$/);
                        if (!regExpChinese.test(vm.editClientNameVal)) {
                            layer.msg("客户名称必须为纯中文!");
                            return;
                        }
                        if (!regExpChinese.test(vm.editCompanyNameVal)) {
                            layer.msg("公司名称必须为纯中文!");
                            return;
                        }
                        if (!regExpNum.test(vm.editBankCardNumberVal)) {
                            layer.msg("银行卡号格式不符合规范!");
                            return;
                        }
                        if (!Af.nullstr(vm.editMailboxVal)) {
                            if (!reqExpEmail.test(vm.editMailboxVal)) {
                                layer.msg("邮箱格式不符合规范!");
                                return;
                            }
                        }
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            updateClient: "updateClient",
                            customerType: $("#editCustomerTypeSelectPanel").find("option:selected").text(),
                            clientName: vm.editClientNameVal,
                            companyName: vm.editCompanyNameVal,
                            taxNumber: vm.editInvoiceTaxNumberVal,
                            address: vm.editContactAddressVal,
                            phoneNumber: vm.editPhoneNumberVal,
                            weChat: vm.editWeChatNumberVal,
                            email: vm.editMailboxVal,
                            bankAccount: vm.editBankAccountVal,
                            bankCardNumber: vm.editBankCardNumberVal,
                            clientId:vm.clientId
                        };
                        Af.rest("ClientInfo.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.editClientNameVal = "";
                                vm.editCompanyNameVal = "";
                                vm.editInvoiceTaxNumberVal = "";
                                vm.editContactAddressVal = "";
                                vm.editPhoneNumberVal = "";
                                vm.editWeChatNumberVal = "";
                                vm.editMailboxVal = "";
                                vm.editBankAccountVal = "";
                                vm.editBankCardNumberVal = "";
                                layer.closeAll();
                                MAIN.CustomerInfoList($("#nickNameTextPanel").html());
                            }
                            layer.msg(ans.msg);
                        });

                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            /*财务管理:收入管理点击事件*/
            revenueInfoFun: function () {
                this.revenueInfoStatus = "block";
                setTimeout(function () {
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
            expenditureInfoLFun: function () {
                this.expenditureInfoStatus = "block";
                setTimeout(function () {
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
            reconciliationFun: function () {
                this.customerReconciliationStatus = "block";
                setTimeout(function () {
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
            /*员工管理[考勤管理]点击事件*/
            AttendanceInfoFun: function () {
                this.AttendanceInfoStatus = "block";
                setTimeout(function () {
                    /*渲染订单月结管理数据表格*/
                    MAIN.AttendanceInfoList($("#nickNameTextPanel").html());
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
            /*员工管理[考勤管理]查询事件*/
            QueryAttendanceFun:function(){
                if(Af.nullstr(this.AttendanceDivision))
                {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.division = this.originalInformationProductName;
                req.nameOfWorker = this.AttendanceNameOfWorker;
                req.jobNumber = this.AttendanceJobNumber;
                Af.rest("AttendanceInfo.api",req,function(ans){
                    if(ans.errorCode!=0)
                    {
                        layer.msg(ans.msg);
                    }
                    else
                    {
                        MAIN.AttendanceInfoDataList(ans.data);
                    }
                });
            },
            /*员工管理[工资发放]点击事件*/
            salaryGivingFun: function () {
                this.salaryGivingStatus = "block";
                setTimeout(function () {
                    /*渲染订单月结管理数据表格*/
                    MAIN.salaryGivingList($("#nickNameTextPanel").html());
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
            /*员工管理[工资发放]查询事件*/
            salaryQueryFun:function(){
                if(Af.nullstr(this.SalaryInfoDivisionVal))
                {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.position = this.SalaryInfoDivisionVal;
                req.nameOfWorker = this.SalaryInfoNameVal;
                req.jobNumber = this.SalaryInfoJobNumberVal;
                Af.rest("AttendanceInfo.api",req,function(ans){
                    if(ans.errorCode!=0)
                    {
                        layer.msg(ans.msg);
                    }
                    else
                    {
                        MAIN.salaryGivingDataList(ans.data);
                    }
                });
            },
            /*员工管理[员工信息]点击事件*/
            employeeInfoFun: function () {
                this.employeeInfoStatus = "block";
                setTimeout(function () {
                    MAIN.employeeInfoList($("#nickNameTextPanel").html());
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
            /*员工管理[员工信息]查询点击事件*/
            employeeQueryFun:function(){
                if(Af.nullstr(this.EmployeeDivisionVal))
                {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.department = this.EmployeeDivisionVal;
                req.nameOfWorker = this.EmployeeNameVal;
                req.jobNumber = this.EmployeejobNumberVal;
                Af.rest("EmployeeInfo.api",req,function(ans){
                    if(ans.errorCode!=0)
                    {
                        layer.msg(ans.msg);
                    }
                    else
                    {
                        MAIN.employeeInfoDataList(ans.data);
                    }
                });
            },
            /*基础信息[原片信息]点击事件*/
            OriginalInfoFun: function () {
                this.OriginalInfoStatus = "block";
                setTimeout(function () {
                    MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                }, 100);
                /*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息隐藏 配件信息 隐藏*/
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
            /*基础信息[原片信息]查询事件*/
            productNameQueryFun:function(){
                if(Af.nullstr(this.originalInformationProductName))
                {
                    MAIN.ErroAlert("不能查询空数据,请选择一个产品名称!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.productName = this.originalInformationProductName;
                req.dStart = "";
                req.dEnd = "";
                Af.rest("productNameModelInquiry.api",req,function(ans){
                    if(ans.errorCode!=0)
                    {
                        layer.msg(ans.msg);
                    }
                    else
                    {
                        MAIN.OriginalInfoDataList(ans.data);
                    }
                });
            },
            /*基础信息[原片信息]新增事件*/
            addProductFun:function(){
                layer.open({
                    title: "新增原片信息",
                    type: 1,
                    area: ['960px', '620px'],
                    content: $("#addProductSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.productNameVal) || Af.nullstr(vm.originalFilmUnitPriceVal)) {
                            MAIN.ErroAlert("产品名称,单价为必填项!");
                            return;
                        }
                        //用正则表达式判断用户输入的数据是否符合规范
                        var regExpNum = new RegExp(/^\d{1,}$/);
                        if (!regExpNum.test(vm.originalFilmUnitPriceVal)) {
                            layer.msg("单价必须为纯数字!");
                            return;
                        }
                        if (!Af.nullstr(vm.originalFilmMemberPriceVal)) {
                            if (!regExpNum.test(vm.originalFilmMemberPriceVal)) {
                                layer.msg("会员价必须位为纯数字!");
                                return;
                            }
                        }
                        if (!Af.nullstr(vm.originalFilmWholesalePriceVal)) {
                            if (!regExpNum.test(vm.originalFilmWholesalePriceVal)) {
                                layer.msg("批发价必须位为纯数字!");
                                return;
                            }
                        }
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            addProduct: "addProduct",
                            productName: vm.productNameVal,
                            specification: vm.specificationVal,
                            color: vm.originalFilmColorVal,
                            texture: vm.originalFilmGrainVal,
                            thickness: vm.originalFilmThicknessVal,
                            unitPrice: parseInt(vm.originalFilmUnitPriceVal),
                            memberPrice: parseInt(vm.originalFilmMemberPriceVal),
                            wholesalePrice: parseInt(vm.originalFilmWholesalePriceVal),
                            remarks: vm.originalFilmRemarksVals
                        };
                        Af.rest("productNameModelInquiry.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.productNameVal = "";
                                vm.specificationVal = "";
                                vm.originalFilmColorVal = "";
                                vm.originalFilmGrainVal = "";
                                vm.originalFilmThicknessVal = "";
                                vm.originalFilmUnitPriceVal = "";
                                vm.originalFilmMemberPriceVal = "";
                                vm.originalFilmWholesalePriceVal = "";
                                vm.originalFilmRemarksVals = "";
                                layer.closeAll();
                                MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                            }
                            layer.msg(ans.msg);
                        });

                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            /*基础信息[原片信息]删除事件*/
            delProductFun:function(){
                var req = {};
                //取出当前选择项用户编号
                var idsArray = MAIN.getSelectId("OriginalInfoList");
                if (Af.nullstr(idsArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选要删除的规格型号!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var idsStr = idsArray.toString();
                        req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delProduct = "delProduct";
                        Af.rest("productNameModelInquiry.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            editProductFun:function(){
                //取出当前选择项的所有数据
                var datasArray = MAIN.getSelectData("OriginalInfoList");
                if (datasArray.length == 0) {
                    MAIN.ErroAlert("不能修改空数据,请勾选一个原片!");
                    return;
                } else if (datasArray.length > 1) {
                    MAIN.ErroAlert("不能修改大于一条的数据!");
                    return;
                }
                layer.open({
                    title: "原片信息编辑",
                    type: 1,
                    area: ['960px', '620px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#editProductSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    success:function(){
                        for(let i = 0;i<datasArray.length;i++){
                            vm.profuctId = datasArray[i].id;
                            /*给表单赋值*/
                            vm.editProductNameVal = datasArray[i].productName;  //--->产品名称
                            vm.editSpecificationVal = datasArray[i].specification; //--->规格
                            vm.editOriginalFilmGrainVal = datasArray[i].texture;  //--->纹理
                            vm.editOriginalFilmThicknessVal = datasArray[i].thickness; //--->厚度
                            vm.editOriginalFilmUnitPriceVal = datasArray[i].unitPrice;    //--->单价
                            vm.editOriginalFilmMemberPriceVal = datasArray[i].memberPrice; //--->会员价
                            vm.editOriginalFilmWholesalePriceVal = datasArray[i].wholesalePrice; //--->批发价
                            vm.editOriginalFilmRemarksVals = datasArray[i].remarks; //--->备注
                        }
                    },
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.editProductNameVal) || Af.nullstr(vm.editOriginalFilmUnitPriceVal)) {
                            MAIN.ErroAlert("产品名称,单价为必填项!");
                            return;
                        }
                        //用正则表达式判断用户输入的数据是否符合规范
                        var regExpNum = new RegExp(/^\d{1,}$/);
                        if (!regExpNum.test(vm.editOriginalFilmUnitPriceVal)) {
                            layer.msg("单价必须为纯数字!");
                            return;
                        }
                        if (!Af.nullstr(vm.editOriginalFilmMemberPriceVal)) {
                            if (!regExpNum.test(vm.editOriginalFilmMemberPriceVal)) {
                                layer.msg("会员价必须位为纯数字!");
                                return;
                            }
                        }
                        if (!Af.nullstr(vm.editOriginalFilmWholesalePriceVal)) {
                            if (!regExpNum.test(vm.editOriginalFilmWholesalePriceVal)) {
                                layer.msg("批发价必须位为纯数字!");
                                return;
                            }
                        }
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            updateProduct:"updateProduct",
                            productName: vm.editProductNameVal,
                            specification: vm.editSpecificationVal,
                            color: vm.editOriginalFilmColorVal,
                            texture: vm.editOriginalFilmGrainVal,
                            thickness: vm.editOriginalFilmThicknessVal,
                            unitPrice: parseInt(vm.editOriginalFilmUnitPriceVal),
                            memberPrice: parseInt(vm.editOriginalFilmMemberPriceVal),
                            wholesalePrice: parseInt(vm.editOriginalFilmWholesalePriceVal),
                            remarks: vm.editOriginalFilmRemarksVals,
                            profuctId:vm.profuctId
                        };
                        Af.rest("productNameModelInquiry.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.editProductNameVal = "";
                                vm.editSpecificationVal = "";
                                vm.editOriginalFilmColorVal = "";
                                vm.editOriginalFilmGrainVal = "";
                                vm.editOriginalFilmThicknessVal = "";
                                vm.editOriginalFilmUnitPriceVal = "";
                                vm.editOriginalFilmMemberPriceVal = "";
                                vm.editOriginalFilmWholesalePriceVal = "";
                                vm.editOriginalFilmRemarksVals = "";
                                layer.closeAll();
                                MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                            }
                            layer.msg(ans.msg);
                        });

                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            /*基础信息[配件信息]点击事件*/
            AttachmentInfoFun: function () {
                this.AttachmentInfoStatus = "block";
                setTimeout(function () {
                    MAIN.AttachmentInfoList($("#nickNameTextPanel").html());
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
            //基础信息[配件信息]新增函数
            addFittingFun:function(){
                layer.open({
                    title: "新增配件",
                    type: 1,
                    area: ['730px', '320px'],
                    content: $("#addFittingSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    yes: function (index, layero) {
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            addFitting: "addFitting",
                            fittingImgUrl:vm.productImageUrl,
                            fittingName:vm.productModelVal
                        };
                        if(Af.nullstr(req.fittingName))
                        {
                            MAIN.ErroAlert("请输入规格型号");
                            return;
                        }
                        Af.rest("FittingPublic.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.productImageUrl = "https://www.kaisir.cn/webPic/productImg/productUpLoad.jpg";
                                vm.productModelVal = "";
                                vm.productLayerStatus = "block";
                                layer.closeAll();
                                MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                            }
                            layer.msg(ans.msg);
                        });

                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                    },
                    end: function () { //弹层销毁出发回调

                    }
                });
            },
            /*基础信息[配件信息]查询函数*/
            queryFittingFun:function(){
                if(Af.nullstr(this.OriginalInfoCommodityNameSelectVal))
                {
                    MAIN.ErroAlert("不能查询空数据,请选择一个产品名称!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.fittingName = this.OriginalInfoCommodityNameSelectVal;
                req.conditionalQuery = "conditionalQuery";
                Af.rest("FittingPublic.api",req,function(ans){
                    if(ans.errorCode!=0)
                    {
                        layer.msg(ans.msg);
                    }
                    else
                    {
                        MAIN.AttachmentInfoDataList(ans.data);
                    }
                });
            },
            /*基础信息[配件信息]删除函数*/
            delFittingFun:function(){
                var req = {};
                //取出当前选择项用户编号
                var idsArray = MAIN.getSelectId("AttachmentInfoList");
                if (Af.nullstr(idsArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选要删除的规格型号!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var idsStr = idsArray.toString();
                        req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delFitting = "delFitting";
                        Af.rest("FittingPublic.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.AttachmentInfoList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            },
            /*基本设置 点击事件*/
            basicSettingsFun: function () {
                this.basicSettingsStatus = "block";
                /*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息 原片信息 配件信息 联系我们 隐藏*/
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
            contactUsFun: function () {
                this.contactUsStatus = "block";

                /*进货管理 财务报表 出货管理 订单信息管理 订单月结管理 客户信息管理 收入管理 支出管理 客户对账 考勤管理 工资发放 员工信息 原片信息 配件信息 基本设置 隐藏*/
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
            OriginalDocumentFun: function () {
            }
        }
    });
    /*左侧导航栏*/
    // nav收缩展开
    $('.nav-item>a').on('click', function () {
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
    $(window).resize(function () {
        var window_width = $(window).width(); //获取浏览器窗口宽度
        if (window_width < 1604) {
            $("#noticePanel").css({
                "display": "none"
            })
        } else {
            $("#noticePanel").css({
                "display": "block"
            })
        }

    });
    //nav-mini切换
    $('#mini').on('click', function () {
        if (!$('.nav').hasClass('nav-mini')) {
            $('.nav-item.nav-show').removeClass('nav-show');
            $('.nav-item').children('ul').removeAttr('style');
            /*左边nav容器收缩情况*/
            $('.nav').addClass('nav-mini');
            $('.layui-side').stop().animate({
                'width': '60px'
            }, 270);
            $('.layui-side-scroll').stop().animate({
                'width': '80px'
            }, 270);
            $('.layui-body').stop().animate({
                'left': '60px'
            }, 270);
            $('.layui-footer').stop().animate({
                'left': '60px'
            }, 270);
        } else {
            $('.nav').removeClass('nav-mini');
            /*左边nav容器收缩情况*/
            $('.layui-side').stop().animate({
                'width': '200px'
            }, 260);
            $('.layui-side-scroll').stop().animate({
                'width': '220px'
            }, 260);
            $('.layui-body').stop().animate({
                'left': '200px'
            }, 260);
            $('.layui-footer').stop().animate({
                'left': '200px'
            }, 260);
        }
    });
    /*左边nav收缩时,hover效果*/
    $(".nav-item").hover(function () {
        if ($('.nav').hasClass('nav-mini')) {
            $('.layui-side').stop().animate({
                'width': '200px'
            }, 260);
            $('.layui-side-scroll').stop().animate({
                'width': '220px'
            }, 260);
            $('.layui-body').stop().animate({
                'left': '200px'
            }, 260);
            $('.layui-footer').stop().animate({
                'left': '200px'
            }, 260);
        }
    }, function () {
        if ($('.nav').hasClass('nav-mini')) {
            $('.layui-side').stop().animate({
                'width': '60px'
            }, 270);
            $('.layui-side-scroll').stop().animate({
                'width': '80px'
            }, 270);
            $('.layui-body').stop().animate({
                'left': '60px'
            }, 270);
            $('.layui-footer').stop().animate({
                'left': '60px'
            }, 270);
        }
    });
    layui.use(['form', 'element', 'jquery', 'table', 'laydate', 'carousel', 'colorpicker', 'upload'], function () {
        var form = layui.form,
            element = layui.element,
            $ = layui.$,
            table = layui.table,
            laydate = layui.laydate,
            carousel = layui.carousel,
            colorpicker = layui.colorpicker,
            upload = layui.upload;

        /*        $("#OrderModelList").on("click","tbody tr", function() {
                    //--->出货管理[新增]悬浮层,规格详情下表格行点击事件
                    setTimeout(function () {
                        Af.trace($(this).attr("elementposition"));
                    },1200);
                });*/



        /*监听出货管理[新增发货]客户名称选择*/
        form.on('select(shippingCustomerNameSelectPanel)', function (data) {
            var thisSelectVal = data.value;  //--->根据id查询规格型号
            //清空表格数据
            $("#OrderModelList  tbody").html("");
            if (!Af.nullstr(thisSelectVal)) {
                var req = {};
                req.orderId = thisSelectVal;
                req.operator = $("#nickNameTextPanel").html();
                req.findModelById = "findModelById";
                Af.rest("orderInfonQueiry.api", req, function (ans) {
                    var dataArray = ans.data;
                    if (dataArray.length == 0) {
                        MAIN.ErroAlert("所选用户,没有未发货的规格型号!");
                        return;
                    }
                    vm.shippingCustomerValArr = dataArray;
                    var num = 0;
                    for (var i = 0; i < dataArray.length; i++) //--->渲染生产单表格区域
                    {
                        var trStart = "<tr>";
                        var trEnd = "</tr>";
                        var td,
                            td1,
                            td2,
                            td3,
                            td4,
                            td5;
                        var tdType = "<td colspan='7' class='title'>";
                        var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                        if (dataArrayLength > 1) {
                            num++;
                            $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' ondblclick='ModelItemFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                            }

                        } else {
                            $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' ondblclick='ModelItemFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                            }
                        }
                    }
                });
            }
            else {
                MAIN.ErroAlert("请选择订单号");
            }
        });
        /*监听出货管理[新增发货]订单号客户名称选择*/
        form.on('select(shippingOrderNumberSelectPanel)', function (data) {
            var thisSelectVal = data.value;
            //清空表格数据
            $("#OrderModelList  tbody").html("");
            if (!Af.nullstr(thisSelectVal)) {
                var req = {};  //--->根据id查询规格型号
                req.orderId = thisSelectVal;
                req.operator = $("#nickNameTextPanel").html();
                req.findModelById = "findModelById";
                Af.rest("orderInfonQueiry.api", req, function (ans) {
                    var dataArray = ans.data;
                    if (dataArray.length == 0) {
                        MAIN.ErroAlert("所选用户,没有未发货的规格型号!");
                        return;
                    }
                    vm.shippingCustomerValArr = dataArray;
                    var num = 0;
                    for (var i = 0; i < dataArray.length; i++) //--->渲染生产单表格区域
                    {
                        var trStart = "<tr>";
                        var trEnd = "</tr>";
                        var td,
                            td1,
                            td2,
                            td3,
                            td4,
                            td5;
                        var tdType = "<td colspan='7' class='title'>";
                        var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                        if (dataArrayLength > 1) {
                            num++;
                            $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' ondblclick='ModelItemFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                            }

                        } else {
                            $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td>" + j + "</td>";
                                td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' ondblclick='ModelItemFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                            }
                        }
                    }
                });
            }
            else {
                MAIN.ErroAlert("请选择订单号");
            }
        });
        /*监听配件名称选择*/
        form.on('select(fittingSpecificationModel)', function (data) {
            var thisSelectVal = data.value;
            if (!Af.nullstr(thisSelectVal)) {
                $("#newAccessoriesInput").addClass("noInput");
                $("#newAccessoriesInput").attr("disabled", "disabled");
            }
            else {
                $("#newAccessoriesInput").removeClass("noInput");
                $("#newAccessoriesInput").removeAttr('disabled');
            }
        });
        //配件图片上传
        var fileUpload = upload.render({
            elem: "#productUpIds", //绑定元素
            url: "servlet/UploadAPI", //上传接口
            done: function (ans) {
                //上传完毕回调
                if (ans.errorCode == 0) {
                    var userPicPath = URL + ans.userPicPath;
                    vm.productImageUrl = userPicPath;//--->配件图片赋值
                    vm.productLayerStatus = "none"; //---->配件图片黑色遮罩隐藏
                } else {
                    ErroAlert(ans.msg);
                    vm.productLayerStatus = "block";
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("服务器错误");
                vm.productLayerStatus = "block";
            }
        });
        var fileUploads = upload.render({
            elem: "#productImgPanel", //绑定元素
            url: "servlet/UploadAPI", //上传接口
            done: function (ans) {
                //上传完毕回调
                if (ans.errorCode == 0) {
                    var userPicPath = URL + ans.userPicPath;
                    vm.productImageUrl = userPicPath;//--->配件图片赋值
                    vm.productLayerStatus = "none"; //---->配件图片黑色遮罩隐藏
                } else {
                    ErroAlert(ans.msg);
                    vm.productLayerStatus = "block";
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("服务器错误");
                vm.productLayerStatus = "block";
            }
        });
        //错误信息弹出
        MAIN.ErroAlert = function (e) {
            var index = layer.alert(e, {
                icon: 5,
                time: 2000,
                offset: 't',
                closeBtn: 0,
                title: '错误信息',
                btn: [],
                anim: 2,
                shade: 0
            });
            layer.style(index, {
                color: '#777'
            });
        };

        /*订单信息管理:开单悬浮层多行数据录入逻辑处理*/
        /*数量框,按下回车键新增一行：并获取焦点*/
        $("#submenu").on("keypress", ".table-panel .content-panel .row-panel .item-panel .addRow", function (e) {
            if (e.which == 13) {
                //判断用户第一行是否勾选规格型号
                var firstLineSelectIds = $("select[name='customize1']").val();
                if (Af.nullstr(firstLineSelectIds)) {
                    layer.alert("致命错误!请选择品名型号!然后鼠标单击数量输入框，并按下回车进行下一个品名型号的录入!");
                    return;
                }
                //判断用户是否勾选品名型号
                var selectIds = $("select[name='customize" + globalVar + "']").val();
                if (Af.nullstr(selectIds)) { //为空代表没有勾选
                    var lastselectId = $("select[name='customize1']").val(); //--->获取 用户第一项选择的规格型号
                    $("select[name='customize" + globalVar + "']").val(lastselectId); //---->赋值当前选择框的数据
                    /*获取单价panel*/
                    var pricePanel = $(parent_panel + " " + containerPanel + row_line + globalVar + foot_panel + " .unitPrice");
                    //给单价赋值
                    pricePanel.val(ansSelectData[lastselectId - 1].unitPrice);
                }
                //清理当前单价定时器
                clearInterval(timer);
                //判断第一行用户是否有输入标记
                var first_row = $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").val();
                if (Af.nullstr(first_row)) {
                    MAIN.ErroAlert("请输入标记!");
                    //标记行获取标点
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").focus();
                } else {
                    globalVar++; //添加行
                    MAIN.addRow("#submenu .table-panel .content-panel");
                    //获取焦点
                    $("#submenu .table-panel .content-panel .row-panel .item-panel .getFocus").focus();
                }
            }
        });
        /*第一行标记框按下回车键响应*/
        $("#submenu").on("keypress", ".table-panel .content-panel .row_1 .item-panel .marks", function (e) {
            if (e.which == 13) {
                //判断第一行用户是否有输入标记
                var first_row = $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").val();
                if (Af.nullstr(first_row)) {
                    layer.msg("请输入标记");
                    //标记行获取标点
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").focus();
                } else {
                    globalVar++;
                    MAIN.addRow("#submenu .table-panel .content-panel");
                    //获取焦点
                    $("#submenu .table-panel .content-panel .row-panel .item-panel .getFocus").focus();
                }
            }
        });
        MAIN.addRow = function (elementDiv) {
            /*拼凑div变量*/
            var divStart = "<div onclick='getUserSelect(" + globalVar + ");' class='row-panel " + "row_" + globalVar + "'>"; //--->class="row"的div
            var firstItemStart = "<div class='firstItem'>"; //---->序号div
            var specificationModelDivStart = "<div class=\"specificationModel\">"; //---->规格型号div
            var itemDiv = "<div class=\"item-panel\">";
            var specificationModel = "<select  name='customize" + globalVar + "' lay-verify=\"required\">\n" + "<option value=\"\">点击选择规格型号</option>\n" + "</select>"; //--->规格型号标签 添加自定义属性/添加点击事件
            var inputLength = "<input  maxlength='5' type='text' rowLine='" + globalVar + "'  placeholder='mm' class='layui-input getFocus glassLength' onkeypress='if(event.keyCode==13) focusNextInput(this)'>"; //--->长度标签
            var inputWidth = "<input  maxlength='5' type='text' rowLine='\"+globalVar+\"'  placeholder='mm' class='layui-input glassWidth' onkeypress='if(event.keyCode==13) focusNextInput(this)'>"; //--->宽度标签
            var inputNum = "<input maxlength=\"5\" type=\"text\" rowLine='\"+globalVar+\"'  placeholder=\"片\" class=\"layui-input addRow glassNum\" >"; //---->数量标签
            var inputMark = "<input maxlength=\"5\" type=\"text\" placeholder=\"请输入\" class=\"layui-input marks\">"; //---->标记标签
            var inputArea = "<input type=\"text\" placeholder=\"自动计算\" class=\"layui-input not_allowed area\" readonly=\"readonly\">"; //---->面积标签
            var inputunitPrice = "<input type=\"text\" placeholder=\"自动读取\" class=\"layui-input unitPrice not_allowed\" readonly=\"readonly\">"; //--->单价标签
            var inputtotalAmount = "<input type=\"text\" placeholder=\"自动计算\" class=\"layui-input not_allowed totalAmount\" readonly=\"readonly\">"; //---->合计金额标签
            var endDiv = "</div>";
            /*数据拼凑*/
            var rowData = divStart + firstItemStart + "<span>" + globalVar + "</span>" + endDiv + specificationModelDivStart + specificationModel + endDiv + itemDiv + inputLength + endDiv + itemDiv + inputWidth + endDiv + itemDiv + inputNum + endDiv + itemDiv + inputMark + endDiv + itemDiv + inputArea + endDiv + itemDiv + inputunitPrice + endDiv + itemDiv + inputtotalAmount + endDiv + endDiv;
            //将拼凑的数据追加到 网页中
            $(elementDiv).append(rowData);
            //渲染select
            MAIN.addSelectVal(ansSelectData, "customize" + globalVar);
            //给新行设置定时器动态获取单价
            timer = setInterval(function () {
                var selectIds;
                var pricePanel = $(parent_panel + " " + containerPanel + row_line + globalVar + foot_panel + " .unitPrice");
                selectIds = $("select[name='customize" + globalVar + "']").val();
                if (!Af.nullstr(selectIds)) {
                    //给单价赋值
                    pricePanel.val(ansSelectData[selectIds - 1].unitPrice);
                }
            }, 100);
        };


        /*动态赋值select函数*/
        MAIN.addSelectVal = function (data, container) {
            var $html = "";
            if (data != null) {
                $.each(data, function (index, item) {
                    if (item.proType) {
                        $html += "<option class='generate' value='" + item.id + "'>" + item.proType + "</option>";
                    } else {
                        $html += "<option value='" + item.id + "'>" + item.name + "</option>";
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

        };
        /*监听进货管理tab选项卡切换:原片采购&配件采购*/
        element.on('tab(IncomingGoodsTab)', function (data) {
            if (data.index == 0) {
                //原片采购数据表格渲染
                MAIN.OriginaFlilmList($("#nickNameTextPanel").html());
            } else if (data.index == 1) {
                //附件数据表格渲染
                MAIN.annexList($("#nickNameTextPanel").html());
            }
            /*
			* layer.msg("切换到了"+data.index+this.innerHTML);
			* */

        });

        /*顶部轮播渲染*/
        carousel.render({
            elem: '#noticePanel',
            width: '710px', //设置容器宽度
            height: '80px', //设置高度
            arrow: 'none', //始终显示箭头
            anim: 'updown', //切换动画方式
            indicator: 'none' //指示器位置
        });
        /*颜色选择器*/
        colorpicker.render({
            elem: '#TopColorMatchingPanel' //系统顶部配色
        });
        colorpicker.render({
            elem: '#navigationColorMatchingPanel' //系统左侧导航配色
        });
        colorpicker.render({
            elem: '#originalFilmColorSelect', //原片颜色选择
            size:"sm", //大小
            done: function(color){
                vm.originalFilmColorVal = color;
            }
        });
        colorpicker.render({
            elem: '#editOriginalFilmColorSelect', //原片颜色选择
            size:"sm", //大小
            done: function(color){
                vm.editOriginalFilmColorVal = color;
            }
        });

        /*导出函数*/
        MAIN.exportFun = function (tableTitle, tableDats) {
            table.exportFile(tableTitle, tableDats, 'xls'); //默认导出 csv，也可以为：xls
        };

        //获取 出货管理,用户勾选的发货数据id
        MAIN.getSelectId = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            var SelectIds = [];
            for (var i = 0; i < data.length; i++) {
                SelectIds.push(data[i].id);
            }
            return SelectIds;
        };
        //获取当前数据表格选择项数据(订单号)
        MAIN.getSelectOrder = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            var orders = [];
            for (var i = 0; i < data.length; i++) {
                orders.push(data[i].orderNumber);
            }
            return orders;
        };
        //获取当前数据表格选择项全部数据
        MAIN.getSelectData = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            return data;
        };
        MAIN.getSelectDatas = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            if (Af.nullstr(data)) {
                MAIN.ErroAlert("不能导出空数据,请勾选要导出的订单!");
            } else {
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    var dataArr = [];
                    dataArr[0] = data[i].orderNumber;
                    dataArr[1] = data[i].orderDate;
                    dataArr[2] = data[i].clientName;
                    dataArr[3] = data[i].projectName;
                    dataArr[4] = data[i].glassNumber;
                    if (data[i].numberShipments) {
                        dataArr[5] = data[i].numberShipments;
                    } else {
                        dataArr[5] = "空";
                    }
                    if (data[i].shipArea) {
                        dataArr[6] = data[i].shipArea;
                    } else {
                        dataArr[6] = "空";
                    }
                    dataArr[7] = data[i].additionalFees;
                    dataArr[8] = data[i].totalAmount;
                    dataArr[9] = data[i].alreadyPaid;
                    dataArr[10] = data[i].unpaid;
                    if (data[i].finishDelivery) {
                        dataArr[11] = data[i].finishDelivery;
                    } else {
                        dataArr[11] = "空";
                    }
                    dataArr[12] = data[i].preparedBy;
                    dataArr[13] = data[i].operator;
                    datas.push(dataArr);
                }
                return datas;
            }
            return null;
        };
        /*出货管理:[导出]数据函数*/
        MAIN.getShipmentDatas = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            if (Af.nullstr(data)) {
                MAIN.ErroAlert("不能导出空数据,请勾选要导出的数据!");
            } else {
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    var dataArr = [];
                    dataArr[0] = data[i].id;
                    dataArr[1] = data[i].clientName;
                    dataArr[2] = data[i].dateOfShipment;
                    dataArr[3] = data[i].numberShipments;
                    dataArr[4] = data[i].shipArea;
                    if (data[i].theTotalAmount) {
                        dataArr[5] = data[i].theTotalAmount;
                    } else {
                        dataArr[5] = "空";
                    }
                    if (data[i].theRemainingAmount) {
                        dataArr[6] = data[i].theRemainingAmount;
                    } else {
                        dataArr[6] = "空";
                    }
                    dataArr[7] = data[i].remainingArea;
                    dataArr[8] = data[i].transportationManager;
                    dataArr[9] = data[i].freight;
                    datas.push(dataArr);
                }
                return datas;
            }
            return null;
        };
        /*时间选择渲染*/
        laydate.render({
            elem: '#startTime' //财务报表:开始时间
        });
        laydate.render({
            elem: '#endTime' //财务报表:结束时间
        });
        laydate.render({
            elem: '#timeInterval', //订单管理:日期区间选择
            range: true,
            calendar: true,
            done: function (value, date, endDate) {
                vm.dStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                vm.dEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
            }
        });

        laydate.render({
            elem: '#originalFilmPurchaseDate', //原片采购:日期区间选择
            range: true,
            calendar: true,
            done: function (value, date, endDate) {
                vm.originalFilmdStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                vm.originalFilmEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
            }
        });
        laydate.render({
            elem: '#OriginalFilmDateSelect', //原片采购[新增]:日期选择
            calendar: true,
            type: "datetime"
        });
        laydate.render({
            elem: '#fittingOrderNumberDate', //配件采购[新增日期选择]
            calendar: true,
            type: "datetime"
        });
        laydate.render({
            elem: '#attachmentProcurementDate', //配件采购:日期区间选择
            range: true,
            done: function (value, date, endDate) {
                vm.fittingdStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                vm.fittingEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
            }
        });
        laydate.render({
            elem: '#outOfTheLibraryDate', //出货管理:日期区间选择
            range: true,
            done: function (value, date, endDate) {
                if ($.isEmptyObject(date)) {
                    vm.ShipmentdStart = "";
                    vm.ShipmentdEnd = "";
                }
                else {
                    vm.ShipmentdStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.ShipmentdEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }

            }
        });
        laydate.render({
            elem: '#shipmentAddDatePanel', //出货管理:新增发货[下单时间]日期区间选择
            range: true,
            done: function (value, date, endDate) {
                if ($.isEmptyObject(date)) {
                    vm.shipmentAddStart = "";
                    vm.shipmentAddEnd = "";
                }
                else {
                    vm.shipmentAddStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.shipmentAddStart = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }
            }
        });
        laydate.render({
            elem: '#customerInfoDateInput', //客户信息管理:日期区间选择
            range: true,
            done: function (value, date, endDate) {
                if ($.isEmptyObject(date)) {
                    vm.clientInfoStart = "";
                    vm.clientInfoEnd = "";
                }
                else {
                    vm.clientInfoStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.clientInfoEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }
            }
        });
        laydate.render({
            elem: '#revenueInfoDateInput', //收入管理：日期区间选择
            range: true
        });
        laydate.render({
            elem: '#expenditureInfoDateInput', //支出管理:日期区间选择
            range: true
        });


        MAIN.List1Table = function () {
            table.render({
                url: URL + "/incomeRecordApi",
                //data:GetMemListData, //请求地址
                method: 'POST', //方式
                elem: '#List1',
                page: true,
                limits: [10, 15, 20, 25],
                id: "List1",
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },

                cols: [
                    [
                        {
                            field: 'CardID',
                            title: '名称待定',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '名称待定',
                            align: "center"
                        },
                        {
                            field: 'LevelName',
                            title: '名称待定',
                            align: "center"
                        },
                        {
                            field: 'Money',
                            title: '名称待定',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '名称待定',
                            align: "center"
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
        form.on('select(orderNumberSelectPanel)', function (data) {
            vm.orderNumber = data.value;
        });
        form.on('select(orderClientNameSelectPanel)', function (data) {
            vm.OrderClientName = data.value;
        });
        form.on('select(orderprojectNameSelectPanel)', function (data) {
            vm.OrderProjectName = data.value;
        });
        /*监听原片采购*/
        form.on('select(SingleNumberSelectPanel)', function (data) {
            vm.originalFilmorderNumber = data.value;
        });
        form.on('select(supplierSelectPanel)', function (data) {
            vm.supplierSelectVal = data.value;
        });
        form.on('select(originalFilmremarkSelectPanel)', function (data) {
            vm.originalFilmRemarksVal = data.value;
        });
        /*监听配件采购*/
        form.on('select(FittingNumberSelectPanel)', function (data) {
            vm.FittingNumberSelectval = data.value;
        });
        form.on('select(FittingsupplierSelectPanel)', function (data) {
            vm.FittingsupplierSelectval = data.value;
        });
        form.on('select(FittingremarkSelectPanel)', function (data) {
            vm.FittingremarkSelectval = data.value;
        });
        /*监听客户信息管理:客户姓名选择*/
        form.on('select(customerNameSelectPanel)', function (data) {
            vm.clientInfoName = data.value;
        });
        /*监听基础信息:[原片信息]产品名称选择*/
        form.on('select(OriginalInfoproductNameSelectPanel)', function (data) {
            vm.originalInformationProductName = data.value;
        });
        /*监听基础信息:[配件信息]产品名称选择*/
        form.on('select(OriginalInfoCommodityNameSelectPanel)', function (data) {
            vm.OriginalInfoCommodityNameSelectVal = data.value;
        });
        /*监听员工管理[考勤管理] (部门 姓名 工号)选择*/
        form.on('select(departmentSelectPanel)', function (data) {
            vm.AttendanceDivision = data.value;
        });
        form.on('select(AttendanceNameSelectPanel)', function (data) {
            vm.AttendanceNameOfWorker = data.value;
        });
        form.on('select(AttendanceJobNumberSelectPanel)', function (data) {
            vm.AttendanceJobNumber = data.value;
        });
        /*监听员工管理[工资发放](职位/姓名/工号)*/
        form.on('select(SalaryInfoDivision)', function (data) {
            vm.SalaryInfoDivisionVal = data.value;
        });
        form.on('select(SalaryInfoName)', function (data) {
            vm.SalaryInfoNameVal = data.value;
        });
        form.on('select(SalaryInfoJobNumber)', function (data) {
            vm.SalaryInfoJobNumberVal = data.value;
        });
        /*监听 员工管理[员工信息](部门,姓名,工号)*/
        form.on('select(EmployeeDivision)', function (data) {
            vm.EmployeeDivisionVal = data.value;
        });
        form.on('select(EmployeeName)', function (data) {
            vm.EmployeeNameVal = data.value;
        });
        form.on('select(EmployeejobNumber)', function (data) {
            vm.EmployeejobNumberVal = data.value;
        });
        /*订单信息数据表格(作为传值调用)*/
        MAIN.orderInfoCustomizeList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#orderInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '订单号',
                            align: "center"
                        },
                        {
                            field: 'orderDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'projectName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'glassNumber',
                            title: '玻璃总数量(块)',
                            align: "center"
                        },
                        {
                            field: 'totalArea',
                            title: '总面积(㎡)',
                            align: "center"
                        },
                        {
                            field: 'numberShipments',
                            title: '已发货数量(个)',
                            align: "center"
                        },
                        {
                            field: 'shipArea',
                            title: '已发货面积(㎡)',
                            align: "center"
                        },

                        {
                            field: 'totalAmount',
                            title: '总金额(元)',
                            align: "center"
                        },
                        {
                            field: 'alreadyPaid',
                            title: '已付款(元)',
                            align: "center"
                        },
                        {
                            field: 'unpaid',
                            title: '未付款(元)',
                            align: "center"
                        },
                        {
                            fixed: "right",
                            field: 'preparedBy',
                            title: '制单人',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#orderNumSelect option:gt(0)").remove();
                    $("#orderClientName option:gt(0)").remove();
                    $("#orderprojectNameSelectId option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

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
                            $.each(data, function (index, item) {
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
        };

        /*订单信息数据表格*/
        function orderInfoList(userName) {
            table.render({
                url: "orderInfonQueiry.api",
                //                data:testData, //请求地址
                method: 'POST', //方式
                elem: '#orderInfoList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '订单号',
                            align: "center"
                        },
                        {
                            field: 'orderDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'projectName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'glassNumber',
                            title: '玻璃总数量(块)',
                            align: "center"
                        },
                        {
                            field: 'totalArea',
                            title: '总面积(㎡)',
                            align: "center"
                        },
                        {
                            field: 'numberShipments',
                            title: '已发货数量(个)',
                            align: "center"
                        },
                        {
                            field: 'shipArea',
                            title: '已发货面积(㎡)',
                            align: "center"
                        },

                        {
                            field: 'totalAmount',
                            title: '总金额(元)',
                            align: "center"
                        },
                        {
                            field: 'alreadyPaid',
                            title: '已付款(元)',
                            align: "center"
                        },
                        {
                            field: 'unpaid',
                            title: '未付款(元)',
                            align: "center"
                        },
                        {
                            fixed: "right",
                            field: 'preparedBy',
                            title: '制单人',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#orderNumSelect option:gt(0)").remove();
                    $("#orderClientName option:gt(0)").remove();
                    $("#orderprojectNameSelectId option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

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
                            $.each(data, function (index, item) {
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

        /*作为全局变量调用:订单信息数据表格*/
        MAIN.orderInfoList = function (userName) {
            table.render({
                url: "orderInfonQueiry.api",
                //                data:testData, //请求地址
                method: 'POST', //方式
                elem: '#orderInfoList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '订单号',
                            align: "center"
                        },
                        {
                            field: 'orderDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'projectName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'glassNumber',
                            title: '玻璃总数量(块)',
                            align: "center"
                        },
                        {
                            field: 'totalArea',
                            title: '总面积(㎡)',
                            align: "center"
                        },
                        {
                            field: 'numberShipments',
                            title: '已发货数量(个)',
                            align: "center"
                        },
                        {
                            field: 'shipArea',
                            title: '已发货面积(㎡)',
                            align: "center"
                        },
                        {
                            field: 'totalAmount',
                            title: '总金额(元)',
                            align: "center"
                        },
                        {
                            field: 'alreadyPaid',
                            title: '已付款(元)',
                            align: "center"
                        },
                        {
                            field: 'unpaid',
                            title: '未付款(元)',
                            align: "center"
                        },
                        {
                            fixed: "right",
                            field: 'preparedBy',
                            title: '制单人',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#orderNumSelect option:gt(0)").remove();
                    $("#orderClientName option:gt(0)").remove();
                    $("#orderprojectNameSelectId option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

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
                            $.each(data, function (index, item) {
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
        };
        /*原片采购数据表格*/
        MAIN.OriginaFlilmList = function (userName) {
            table.render({
                url: "PurchaseInfo.api", //--->请求接口
                method: 'POST', //方式
                elem: '#OriginaFlilmList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '单号',
                            align: "center"
                        },
                        {
                            field: 'purchaseDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'specificationModel',
                            title: '规格型号',
                            align: "center"
                        },
                        {
                            field: 'thickness',
                            title: '厚度',
                            align: "center"
                        },
                        {
                            field: 'color',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'quantity',
                            title: '数量',
                            align: "center"
                        },
                        {
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'totalPurchase',
                            title: '采购总额',
                            align: "center"
                        },
                        {
                            field: 'shippingFee',
                            title: '运输费',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项

                    $("#SingleNumberSelectPanel option:gt(0)").remove();
                    $("#supplierSelectPanel option:gt(0)").remove();
                    $("#originalFilmremarkSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

                    /*渲染原片采购:单号 选择框*/
                    function orderNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].orderNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SingleNumberSelectPanel");
                    }

                    /*渲染原片采购:供货商选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].supplier;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "supplierSelectPanel");
                    }

                    /*渲染原片采购:备注选择框*/
                    function projectNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].remarks;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "originalFilmremarkSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*原片采购数据表格:作为传值调用*/
        MAIN.OriginaFlilmDataList = function (data) {
            table.render({
                data: data,
                //url :"PurchaseInfo.api",  //--->请求接口
                method: 'POST', //方式
                elem: '#OriginaFlilmList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '单号',
                            align: "center"
                        },
                        {
                            field: 'purchaseDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'specificationModel',
                            title: '规格型号',
                            align: "center"
                        },
                        {
                            field: 'thickness',
                            title: '厚度',
                            align: "center"
                        },
                        {
                            field: 'color',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'quantity',
                            title: '数量',
                            align: "center"
                        },
                        {
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'totalPurchase',
                            title: '采购总额',
                            align: "center"
                        },
                        {
                            field: 'shippingFee',
                            title: '运输费',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项

                    $("#SingleNumberSelectPanel option:gt(0)").remove();
                    $("#supplierSelectPanel option:gt(0)").remove();
                    $("#originalFilmremarkSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

                    /*渲染原片采购:单号 选择框*/
                    function orderNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].orderNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SingleNumberSelectPanel");
                    }

                    /*渲染原片采购:供货商选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].supplier;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "supplierSelectPanel");
                    }

                    /*渲染原片采购:备注选择框*/
                    function projectNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].remarks;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "originalFilmremarkSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*配件采购数据表格*/
        MAIN.annexList = function (userName) {
            table.render({
                url: "FittingInfo.api",
                method: 'POST', //方式
                elem: '#annexList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '单号',
                            align: "center"
                        },
                        {
                            field: 'fittingDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'specificationModel',
                            title: '配件名称',
                            align: "center"
                        },
                        {
                            field: 'purchaseQuantity',
                            title: '采购数量',
                            align: "center"
                        },
                        {
                            field: 'totalPurchase',
                            title: '采购总额',
                            align: "center"
                        },
                        {
                            field: 'paymentDetails',
                            title: '付款明细',
                            align: "center"
                        },
                        {
                            field: 'otherFee',
                            title: '其他费用',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#FittingNumberSelectPanel option:gt(0)").remove();
                    $("#FittingsupplierSelectPanel option:gt(0)").remove();
                    $("#FittingremarkSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

                    /*渲染原片采购:单号 选择框*/
                    function orderNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].orderNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingNumberSelectPanel");
                    }

                    /*渲染原片采购:供货商选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].supplier;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingsupplierSelectPanel");
                    }

                    /*渲染原片采购:备注选择框*/
                    function projectNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].remarks;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingremarkSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*配件采购数据表格[作为传值调用]*/
        MAIN.annexDataList = function (datas) {
            table.render({
                data: datas,
                method: 'POST', //方式
                elem: '#annexList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'orderNumber',
                            title: '单号',
                            align: "center"
                        },
                        {
                            field: 'fittingDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'specificationModel',
                            title: '配件名称',
                            align: "center"
                        },
                        {
                            field: 'purchaseQuantity',
                            title: '采购数量',
                            align: "center"
                        },
                        {
                            field: 'totalPurchase',
                            title: '采购总额',
                            align: "center"
                        },
                        {
                            field: 'paymentDetails',
                            title: '付款明细',
                            align: "center"
                        },
                        {
                            field: 'otherFee',
                            title: '其他费用',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#FittingNumberSelectPanel option:gt(0)").remove();
                    $("#FittingsupplierSelectPanel option:gt(0)").remove();
                    $("#FittingremarkSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    orderNumberSelectFun();
                    clientNameSelectFun();
                    projectNameSelectFun();

                    /*渲染原片采购:单号 选择框*/
                    function orderNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].orderNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingNumberSelectPanel");
                    }

                    /*渲染原片采购:供货商选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].supplier;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingsupplierSelectPanel");
                    }

                    /*渲染原片采购:备注选择框*/
                    function projectNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].remarks;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "FittingremarkSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*出货管理数据表格*/

        MAIN.originalFilmOutList = function (userName) {
            table.render({
                url: 'ShipmentInfo.api',
                method: 'POST', //方式
                elem: '#originalFilmOutList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户姓名',
                            align: "center"
                        },
                        {
                            field: 'dateOfShipment',
                            title: '发货日期',
                            align: "center"
                        },
                        {
                            field: 'numberShipments',
                            title: '发货数量',
                            align: "center"
                        },
                        {
                            field: 'shipArea',
                            title: '发货面积',
                            align: "center"
                        },
                        {
                            field: 'theRemainingAmount',
                            title: '剩余数量',
                            align: "center"
                        },
                        {
                            field: 'remainingArea',
                            title: '剩余面积',
                            align: "center"
                        },
                        {
                            field: 'theTotalAmount',
                            title: '发货金额',
                            align: "center"
                        },
                        {
                            field: 'transportationManager',
                            title: '运输负责人',
                            align: "center"
                        },
                        {
                            field: 'freight',
                            title: '运费',
                            align: "center"
                        },

                    ]
                ],
                done: function (res, curr, count) {
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*出货管理数据表格:作为全局变量赋值调用*/
        MAIN.originalFilmOutDataList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#originalFilmOutList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户姓名',
                            align: "center"
                        },
                        {
                            field: 'dateOfShipment',
                            title: '发货日期',
                            align: "center"
                        },
                        {
                            field: 'numberShipments',
                            title: '发货数量',
                            align: "center"
                        },
                        {
                            field: 'shipArea',
                            title: '发货面积',
                            align: "center"
                        },
                        {
                            field: 'theRemainingAmount',
                            title: '剩余数量',
                            align: "center"
                        },
                        {
                            field: 'remainingArea',
                            title: '剩余面积',
                            align: "center"
                        },
                        {
                            field: 'theTotalAmount',
                            title: '发货金额',
                            align: "center"
                        },
                        {
                            field: 'transportationManager',
                            title: '运输负责人',
                            align: "center"
                        },
                        {
                            field: 'freight',
                            title: '运费',
                            align: "center"
                        },
                    ]
                ],
                done: function (res, curr, count) {
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };


        /*出货管理数据表格结束*/

        /*库存管理数据表格*/
        MAIN.stockList = function () {
            table.render({
                url: URL + "/stockList",
                // data:testData, //请求地址
                method: 'POST', //方式
                elem: '#stockList',
                page: true,
                limits: [10, 15, 20, 25],
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '产品名称',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '规格',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '纹理',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '厚度',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '入库数量',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '出库数量',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '库存余量',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '库存面积',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*订单管理:订单月结管理*/
        MAIN.OrderMonthList = function () {
            table.render({
                url: URL + "/stockList",
                // data:testData, //请求地址
                method: 'POST', //方式
                elem: '#OrderMonthList',
                page: true,
                limits: [10, 15, 20, 25],
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '月结编号',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '订单数',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '总面积',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '总金额',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '已付款',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '月结付款',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '未付款',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '优惠金额',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*客户信息管理:数据表格*/
        MAIN.CustomerInfoList = function (userName) {
            table.render({
                url: "ClientInfo.api",
                method: 'POST', //方式
                elem: '#CustomerInfoList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'customerType',
                            title: '客户类型',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'companyName',
                            title: '公司名称',
                            align: "center"
                        },
                        {
                            field: 'taxNumber',
                            title: '税号',
                            align: "center"
                        },
                        {
                            field: 'address',
                            title: '地址',
                            align: "center"
                        },
                        {
                            field: 'phoneNumber',
                            title: '手机',
                            align: "center"
                        },
                        {
                            field: 'weChat',
                            title: '微信',
                            align: "center"
                        },
                        {
                            field: 'email',
                            title: '邮箱',
                            align: "center"
                        },
                        {
                            field: 'bankAccount',
                            title: '开户银行',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '银行卡号',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#customerNameSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    clientNameSelectFun();

                    /*渲染订单号选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].clientName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "customerNameSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*客户信息管理:传值调用*/
        MAIN.CustomerInfoDataList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#CustomerInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'customerType',
                            title: '客户类型',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'companyName',
                            title: '公司名称',
                            align: "center"
                        },
                        {
                            field: 'taxNumber',
                            title: '税号',
                            align: "center"
                        },
                        {
                            field: 'address',
                            title: '地址',
                            align: "center"
                        },
                        {
                            field: 'phoneNumber',
                            title: '手机',
                            align: "center"
                        },
                        {
                            field: 'weChat',
                            title: '微信',
                            align: "center"
                        },
                        {
                            field: 'email',
                            title: '邮箱',
                            align: "center"
                        },
                        {
                            field: 'bankAccount',
                            title: '开户银行',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '银行卡号',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#customerNameSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    clientNameSelectFun();

                    /*渲染订单号选择框*/
                    function clientNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].clientName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "customerNameSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*财务管理:收入管理 数据表格*/
        MAIN.revenueInfoList = function () {
            table.render({
                url: URL + "/revenueInfoList",
                // data:testData, //请求地址
                method: 'POST', //方式
                elem: '#revenueInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '订单号',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '收款人',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*财务管理:支出管理 数据表格*/
        MAIN.expenditureInfoList = function () {
            table.render({
                url: URL + "/expenditureInfoList",
                // data:testData, //请求地址
                method: 'POST', //方式
                elem: '#expenditureInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '订单号',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '支出类别',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*客户对账*/
        MAIN.customerReconciliationList = function () {
            table.render({
                url: URL + "/customerReconciliationList",
                // data:testData, //请求地址
                method: 'POST', //方式
                elem: '#customerReconciliationList',
                page: true,
                height: '270',
                limits: [10, 15, 20, 25],
                request: {
                    pageName: 'page', //页码的参数名称，默认：page
                    limitName: 'rows' //每页数据量的参数名，默认：limit
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '客户类型',
                            align: "center"
                        },
                        {
                            field: 'CardID',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'CardName',
                            title: '公司名称',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '税号',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '地址',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '手机',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '微信',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '邮箱',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '开户银行',
                            align: "center"
                        },
                        {
                            field: 'Point',
                            title: '银行卡号',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*员工管理[考勤管理] 数据表格*/
        MAIN.AttendanceInfoList = function (userName) {
            table.render({
                url: "AttendanceInfo.api",
                method: 'POST', //方式
                elem: '#AttendanceInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'division',
                            title: '部门',
                            align: "center"
                        },
                        {
                            field: 'daysToAttend',
                            title: '应出勤天数',
                            align: "center"
                        },
                        {
                            field: 'actualAttendanceDays',
                            title: '实际出勤天数',
                            align: "center"
                        },
                        {
                            field: 'askForLeaveDays',
                            title: '请假天数(合计)',
                            align: "center"
                        },
                        {
                            field: 'leaveDays',
                            title: '事假天数',
                            align: "center"
                        },
                        {
                            field: 'sickLeaveDays',
                            title: '病假天数',
                            align: "center"
                        },
                        {
                            field: 'remark',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项 渲染(部门,姓名,工号)
                    $("#departmentSelectPanel option:gt(0)").remove();
                    $("#AttendanceNameSelectPanel option:gt(0)").remove();
                    $("#AttendanceJobNumberSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    departmentSelectFun();
                    AttendanceNameSelectFun();
                    AttendanceJobNumberSelectFun();
                    /*渲染部门选择框*/
                    function departmentSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].division;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "departmentSelectPanel");
                    }
                    /*渲染姓名*/
                    function AttendanceNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].nameOfWorker;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "AttendanceNameSelectPanel");
                    }
                    /*渲染工号*/
                    function AttendanceJobNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].jobNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "AttendanceJobNumberSelectPanel");
                    }
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*员工管理[考勤管理] 数据表格(传值调用)*/
        MAIN.AttendanceInfoDataList = function(resultData){
            table.render({
                data:resultData,
                url: "AttendanceInfo.api",
                elem: '#AttendanceInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'division',
                            title: '部门',
                            align: "center"
                        },
                        {
                            field: 'daysToAttend',
                            title: '应出勤天数',
                            align: "center"
                        },
                        {
                            field: 'actualAttendanceDays',
                            title: '实际出勤天数',
                            align: "center"
                        },
                        {
                            field: 'askForLeaveDays',
                            title: '请假天数(合计)',
                            align: "center"
                        },
                        {
                            field: 'leaveDays',
                            title: '事假天数',
                            align: "center"
                        },
                        {
                            field: 'sickLeaveDays',
                            title: '病假天数',
                            align: "center"
                        },
                        {
                            field: 'remark',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*员工管理[工资发放 ]数据表格*/
        MAIN.salaryGivingList = function (userName) {
            table.render({
                url: "SalaryInfo.api",
                method: 'POST', //方式
                elem: '#salaryGivingList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'position',
                            title: '职位/岗位',
                            align: "center"
                        },
                        {
                            field: 'basicWage',
                            title: '基本工资',
                            align: "center"
                        },
                        {
                            field: 'jobSubsidy',
                            title: '岗位补贴',
                            align: "center"
                        },
                        {
                            field: 'payable',
                            title: '应发工资',
                            align: "center"
                        },
                        {
                            field: 'attendanceDeduction',
                            title: '考勤扣款',
                            align: "center"
                        },
                        {
                            field: 'personalIncomeTax',
                            title: '个人所得税',
                            align: "center"
                        },
                        {
                            field: 'realWage',
                            title: '实发工资',
                            align: "center"
                        },
                        {
                            field: 'signingTime',
                            title: '签领时间',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项 渲染(部门,姓名,工号)
                    $("#SalaryInfoDivision option:gt(0)").remove();
                    $("#SalaryInfoName option:gt(0)").remove();
                    $("#SalaryInfoJobNumber option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    departmentSelectFun();
                    AttendanceNameSelectFun();
                    AttendanceJobNumberSelectFun();
                    /*渲染职位/岗位选择框*/
                    function departmentSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].position;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoDivision");
                    }
                    /*渲染姓名*/
                    function AttendanceNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].nameOfWorker;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoName");
                    }
                    /*渲染工号*/
                    function AttendanceJobNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].jobNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoJobNumber");
                    }
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*员工管理[工资发放] 数据表格(传值调用)*/
        MAIN.salaryGivingDataList = function (resultData) {
            table.render({
                data:resultData,
                elem: '#salaryGivingList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'position',
                            title: '职位/岗位',
                            align: "center"
                        },
                        {
                            field: 'basicWage',
                            title: '基本工资',
                            align: "center"
                        },
                        {
                            field: 'jobSubsidy',
                            title: '岗位补贴',
                            align: "center"
                        },
                        {
                            field: 'payable',
                            title: '应发工资',
                            align: "center"
                        },
                        {
                            field: 'attendanceDeduction',
                            title: '考勤扣款',
                            align: "center"
                        },
                        {
                            field: 'personalIncomeTax',
                            title: '个人所得税',
                            align: "center"
                        },
                        {
                            field: 'realWage',
                            title: '实发工资',
                            align: "center"
                        },
                        {
                            field: 'signingTime',
                            title: '签领时间',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项 渲染(部门,姓名,工号)
                    $("#SalaryInfoDivision option:gt(0)").remove();
                    $("#SalaryInfoName option:gt(0)").remove();
                    $("#SalaryInfoJobNumber option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    departmentSelectFun();
                    AttendanceNameSelectFun();
                    AttendanceJobNumberSelectFun();
                    /*渲染职位/岗位选择框*/
                    function departmentSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].position;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoDivision");
                    }
                    /*渲染姓名*/
                    function AttendanceNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].nameOfWorker;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoName");
                    }
                    /*渲染工号*/
                    function AttendanceJobNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].jobNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SalaryInfoJobNumber");
                    }
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*员工管理[员工信息]数据表格*/
        MAIN.employeeInfoList = function (userName) {
            table.render({
                url: "EmployeeInfo.api",
                method: 'POST', //方式
                elem: '#employeeInfoList',
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'phoneNumber',
                            title: '手机号',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'department',
                            title: '部门',
                            align: "center"
                        },
                        {
                            field: 'position',
                            title: '职务',
                            align: "center"
                        },
                        {
                            field: 'dateOfBirth',
                            title: '出生年月',
                            align: "center"
                        },
                        {
                            field: 'dateOfEntry',
                            title: '入职日期',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项 渲染(部门,姓名,工号)
                    $("#EmployeeDivision option:gt(0)").remove();
                    $("#EmployeeName option:gt(0)").remove();
                    $("#EmployeejobNumber option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    departmentSelectFun();
                    AttendanceNameSelectFun();
                    AttendanceJobNumberSelectFun();
                    /*渲染部门*/
                    function departmentSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].department;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "EmployeeDivision");
                    }
                    /*渲染姓名*/
                    function AttendanceNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].nameOfWorker;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "EmployeeName");
                    }
                    /*渲染工号*/
                    function AttendanceJobNumberSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].jobNumber;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "EmployeejobNumber");
                    }
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*员工管理[员工信息]数据表格(传值调用)*/
        MAIN.employeeInfoDataList = function (resultData) {
            table.render({
                data:resultData,
                elem: '#employeeInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'nameOfWorker',
                            title: '员工姓名',
                            align: "center"
                        },
                        {
                            field: 'phoneNumber',
                            title: '手机号',
                            align: "center"
                        },
                        {
                            field: 'jobNumber',
                            title: '工号',
                            align: "center"
                        },
                        {
                            field: 'department',
                            title: '部门',
                            align: "center"
                        },
                        {
                            field: 'position',
                            title: '职务',
                            align: "center"
                        },
                        {
                            field: 'dateOfBirth',
                            title: '出生年月',
                            align: "center"
                        },
                        {
                            field: 'dateOfEntry',
                            title: '入职日期',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*基础信息:原片信息数据表格*/
        MAIN.OriginalInfoList = function (userName) {
            table.render({
                url:"productNameModelInquiry.api",
                method: 'POST', //方式
                elem: '#OriginalInfoList',
                page: true,
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'productName',
                            title: '产品名称',
                            align: "center"
                        },
                        {
                            field: 'specification',
                            title: '规格',
                            align: "center"
                        },
                        {
                            field: 'color',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'texture',
                            title: '纹理',
                            align: "center"
                        },
                        {
                            field: 'thickness',
                            title: '厚度',
                            align: "center"
                        },
                        {
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'memberPrice',
                            title: '会员价',
                            align: "center"
                        },
                        {
                            field: 'wholesalePrice',
                            title: '批发价',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#OriginalInfoproductNameSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    OriginalInfoFun();
                    /*渲染订单号选择框*/
                    function OriginalInfoFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].productName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "OriginalInfoproductNameSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*基础信息:原片信息数据表格(作为传值调用)*/
        MAIN.OriginalInfoDataList = function (resultData) {
            table.render({
                data:resultData,
                elem: '#OriginalInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'productName',
                            title: '产品名称',
                            align: "center"
                        },
                        {
                            field: 'specification',
                            title: '规格',
                            align: "center"
                        },
                        {
                            field: 'color',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'texture',
                            title: '纹理',
                            align: "center"
                        },
                        {
                            field: 'thickness',
                            title: '厚度',
                            align: "center"
                        },
                        {
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'memberPrice',
                            title: '会员价',
                            align: "center"
                        },
                        {
                            field: 'wholesalePrice',
                            title: '批发价',
                            align: "center"
                        },
                        {
                            field: 'remarks',
                            title: '备注',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*生产单数据表格渲染*/
        MAIN.ProductionOrderList = function (resultData) {
            table.render({
                //url : URL + "/AttachmentInfoList",
                data: resultData, //请求地址
                //method : 'POST', //方式
                elem: '#ProductionOrderList',
                totalRow: true, //--->开启合计行
                cols: [
                    [
                        {
                            field: 'productName',
                            title: '规格型号',
                            align: "center",
                            //width: "30%"
                        },
                        {
                            field: 'glassLength',
                            title: '长度',
                            align: "center",
                            //	width: "5%"
                        },
                        {
                            field: 'glassWidth',
                            title: '宽度',
                            align: "center",
                            //		width: "5%"
                        },
                        {
                            field: 'glassNum',
                            title: '数量',
                            align: "center",
                            totalRow: true, //开启合计
                            //	width: "5%"
                        },
                        {
                            field: 'glassMark',
                            title: '标记',
                            align: "center",
                            //	width: "15%"
                        },
                        {
                            field: 'glassArea',
                            title: '面积',
                            align: "center",
                            totalRow: true, //开启合计
                            //	width: "10%"
                        },
                        {
                            field: 'additionalProcess',
                            title: '附加工艺',
                            align: "center",
                            //	width:"30%"
                        }
                    ]
                ]
            });
        };
        /*基础信息:配件信息*/
        MAIN.AttachmentInfoList = function (userName) {
            table.render({
                url: "FittingPublic.api",
                method: 'POST', //方式
                elem: '#AttachmentInfoList',
                contentType: 'application/json', //发送到服务端的内容编码类型
                page: true,
                where: {
                    operator: userName
                },
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'fittingName',
                            title: '配件名称',
                            align: "center"
                        },
                        {
                            field: 'addAPerson',
                            title: '添加人',
                            align: "center"
                        },
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#OriginalInfoCommodityNameSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    fittingNameSelectFun();
                    /*渲染订单号选择框*/
                    function fittingNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].fittingName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "OriginalInfoCommodityNameSelectPanel");
                    }

                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
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
        };
        /*基础信息:配件信息[传值]*/
        MAIN.AttachmentInfoDataList = function (resultList) {
            table.render({
                data:resultList,
                elem: '#AttachmentInfoList',
                page: true,
                limits: [10, 15, 20, 25],
                cols: [
                    [
                        {
                            fixed: "left",
                            type: 'checkbox',
                            align: "center"
                        },
                        {
                            field: 'id',
                            title: '序列号',
                            align: "center"
                        },
                        {
                            field: 'fittingName',
                            title: '配件名称',
                            align: "center"
                        },
                        {
                            field: 'addAPerson',
                            title: '添加人',
                            align: "center"
                        },
                    ]
                ]
            });
        }

    });
    //让浏览器全屏函数
    MAIN.fullScreen = function () {
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
    };

    //打印方法
    MAIN.preview = function (printpage) {
        var headstr = "<html><head><title></title></head><body>";
        var footstr = "</body>";
        var newstr = document.all.item(printpage).innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr + newstr + footstr;
        window.print();
        document.body.innerHTML = oldstr;
        return false;
    };
    //订单信息管理:开单悬浮层[已付款]失去焦点事件
    $("#billingPaid").blur(function () {
        var totalAmount = Number($("#billingtotalAmount").val()) - Number($("#billingPaid").val());
        if (isNaN(totalAmount)) {
            MAIN.ErroAlert("请输入总金额和已付款金额");
        } else {
            $("#billingUnpaid").val(totalAmount + "元");
        }
    });
    //发货管理:原片采购[单价] 失去焦点事件
    $("#OriginalFilmunitPrice").blur(function () {
        var totalAmount = Number($("#OriginalFilmquantity").val()) * Number($("#OriginalFilmunitPrice").val());
        if (isNaN(totalAmount)) {
            MAIN.ErroAlert("请输入数量和单价");
        } else {
            $("#OriginalFilmtotalPurchase").val(totalAmount + "元");
        }
    });
    //发货管理:原片采购[运输费]失去焦点事件
    $("#OriginalFilmshippingFee").blur(function () {
        var totalAmount = Number($("#OriginalFilmquantity").val()) * Number($("#OriginalFilmunitPrice").val()) + Number($("#OriginalFilmshippingFee").val());
        if (isNaN(totalAmount)) {
            MAIN.ErroAlert("请输入数量和单价");
        } else {
            $("#OriginalFilmtotalPurchase").val(totalAmount + "元");
        }
    });

});