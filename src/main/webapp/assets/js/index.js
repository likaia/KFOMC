
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
var globalData = [];
var currentSelection = null;  //--->开单悬浮层,用户是否有选择规格型号
var raw = 0;
var rawShippedNum = 0;

/*出货管理[新增发货]弹出层表格行单击事件*/
function ModelItemOneFun(item, rowLine) {
    //此处为单击事件要执行的代码
    $("#OrderModelList tbody .row_" + rowLine + " input").eq(item).bind("input propertychange", function (event) {
        let glassLengthVessel = $("#OrderModelList tbody .row_" + rowLine + " .glassLength").eq(item);//--->玻璃长度容器
        let glassWidthVessel = $("#OrderModelList tbody .row_" + rowLine + " .glassWidth").eq(item);//--->玻璃宽度容器
        let quantityInputVessel = $("#OrderModelList tbody .row_" + rowLine + " .quantityInput").eq(item); //--->当前输入数据的td容器
        let nowAmountVessel = $("#OrderModelList tbody .row_" + rowLine + " .nowAmount").eq(item); //--->发货金额容器
        let unitPriceVessel = $("#OrderModelList tbody .row_" + rowLine + " .unitPrice").eq(item); //--->单价容器
        let shipAreaVessel = $("#OrderModelList tbody .row_" + rowLine + " .shipArea").eq(item); //--->发货面积容器
        let shippedVessel = $("#OrderModelList tbody .row_" + rowLine + " .shippedQuantity").eq(item); //--->已发货数量容器
        let lastVessel = $("#OrderModelList tbody .row_" + rowLine + " .lastNum").eq(item); //--->剩余数量容器
        let totalNumVessel = $("#OrderModelList tbody .row_" + rowLine + " .totalNum").eq(item); //--->总数量容器
        let RawShippedQuantity = Number(shippedVessel.attr("data-rawData")); //--->已发货数量后台返回的数据
        let thisInputVal = Number($("#OrderModelList tbody .row_" + rowLine + " input").eq(item).val()); //--->获取当前输入
        let shippedQuantity = Number(shippedVessel.html()); //--->已发货数量
        let lastNum = Number(lastVessel.html()); //--->剩余数量
        if (thisInputVal == 0) {
            shippedQuantity = RawShippedQuantity; //如果用户没有输入,已发货数据 = 原始已发货数据
        }
        /*计算:发货金额,发货面积,已发货数量,剩余数量*/
        let numberShipments = thisInputVal * Number(unitPriceVessel.html());
        let shipArea = ((Number(glassLengthVessel.html()) * Number(glassWidthVessel.html()) * thisInputVal)/1000000).toFixed(2);
        shippedQuantity = thisInputVal + RawShippedQuantity; //--->后台返回的原始已发货数据 + 当前输入数据
        lastNum = Number(totalNumVessel.html()) - shippedQuantity;
        /*剩余数量负数判断*/
        if (lastNum < 0) {
            lastNum = lastNum + RawShippedQuantity;//重新计算剩余数量
            shippedQuantity = shippedQuantity - RawShippedQuantity; //重新计算已发货数量
            thisInputVal = thisInputVal - RawShippedQuantity; //重新计算当前输入的值
            numberShipments = thisInputVal * Number(unitPriceVessel.html()); //重新计算发货金额
            shipArea = ((Number(glassLengthVessel.html()) * Number(glassWidthVessel.html()) * thisInputVal)/1000000).toFixed(2);//重新计算发货面积
            $("#OrderModelList tbody .row_" + rowLine + " input").eq(item).val(thisInputVal); //更新发货数量输入框数据
        }
        shippedVessel.html(shippedQuantity);
        lastVessel.html(lastNum);
        nowAmountVessel.html(numberShipments.toFixed(2));
        shipAreaVessel.html(shipArea);
    });
}

/*开单悬浮层,规格型号删除函数*/
function delModelFun() {
    if (Af.nullstr(currentSelection)) {
        layer.msg("请在要删除的选项中,单击标记框,然后再点击删除！");
    } else {
        /*提示用户删除*/
        layer.confirm("你确定要删除第" + currentSelection + "行数据吗?", function (index) {
            $("#submenu .table-panel .content-panel .row_" + currentSelection + "").remove();
            layer.close(index);
            layer.msg("删除成功");
        });
    }
}

/*开单悬浮层,用户输入行点击函数*/
function getUserSelect(index) {
    currentSelection = index;  //--->赋值用户选择的第几个选项
    /*自定义查询原片信息表所需的数据*/
    if (globalData.length == 0) {  //判断globalData中是否有数据(是否为第一次请求后台)
        var req = {};
        req.queryType = ["productName", "unitPrice"];
        req.operator = $("#nickNameTextPanel").html(); //--->获取用户名
        Af.rest("productNameModelInquiry.api", req, function (ans) {
            if (ans.errorCode == 0) {
                var resultArray = ans.data; //--->JSONArray
                for (var i = 0; i < resultArray.length; i++) {
                    var resultOBJ = {};
                    resultOBJ['id'] = resultArray[i].id;
                    resultOBJ['name'] = resultArray[i].productName;
                    resultOBJ['unitPrice'] = resultArray[i].unitPrice;
                    globalData.push(resultOBJ);
                }
            }
        });
    }
    if (globalData.length != 0) {
        /*渲染单价数据*/
        var parent_panel = "#submenu";
        var containerPanel = ".table-panel .content-panel"; //---->动态div之前的容器
        var row_line = " .row_"; //--->动态div名称
        var foot_panel = " .item-panel"; //---->每一个item
        var pricePanel = $(parent_panel + " " + containerPanel + row_line + index + foot_panel + " .unitPrice");//--->玻璃单价容器
        var totalAmountPanel = $(parent_panel + " " + containerPanel + row_line + index + foot_panel + " .totalAmount"); //--->总金额容器
        var glassNumPanel = $(parent_panel + " " + containerPanel + row_line + index + foot_panel + " .glassNum");//--->玻璃数量容器
        var selectIds = $('option:selected', "select[name='customize" + index + "']").index(); //--->获取当前选择项的索引
        /*
        * 无法解决的问题
        *   1.点击当前行后赋值单价( pricePanel.val(selectIds-1).unitPrice;)
        *       缺点:
        *           程序自己赋值单价,用户不可以修改单价
        *           因为此处是行点击事件,点击当前行后读取当前规格型号对应的价格,然后赋值单价,用户修改单价后,点击当前行后计算总金额,又一次除触发了行事件,单价又会被赋值
        *           所以无解,请用户手动修改单价
        *
        * */

        if (selectIds <= 0) {
            return;
        }
        if (!Af.nullstr(selectIds)) {
            var nowPrice = pricePanel.val(); //--->当前新输入的单价
            var nowGlassNum = glassNumPanel.val(); //--->当前玻璃数量
            if (nowPrice != globalData[selectIds - 1].unitPrice) //--->判断用户是否修改单价
            {
                let total_amount = nowPrice * nowGlassNum; //--->计算总金额(用户新输入的单价*当前玻璃总数量)
                totalAmountPanel.val(total_amount); //--->总金额赋值
            }
        }
    }

}

window.onbeforeunload = function (event) {
    //页面刷新时执行
    NProgress.start();
};

$(function () {
    var MultipleSpeciLayer = "";
    var URL = "https://www.kaisir.cn/";
    var MAIN = {};
    var globalVar = 1; //
    var marksPanel = $("#submenu .table-panel .content-panel .row_1 .marks");
    var parent_panel = "#submenu";
    var containerPanel = ".table-panel .content-panel"; //---->动态div之前的容器
    var row_line = " .row_"; //--->动态div名称
    var foot_panel = " .item-panel"; //--->每一个item
    var ansSelectData = [];
    var globalGlassNum = 0; //全局玻璃数量
    var timer;
    var globalArea = 0; //全局面积
    var globalPrice = 0; //全局单价
    var printClicks = 0; //--->全局打印点击次数
    var selectedModelArr = [];
    /*创建监听(赋值到剪切版)*/
    var clipboard = new ClipboardJS('.partakeFun');
    /*实例化vue*/
    //顶部栏vue处理
    var nav_vm = new Vue({
        //绑定元素
        el: "#nav-panel",
        //数据
        data:{

        },
        methods:{
            //客户留言查看全部函数
            viewClientAllFun:function () {
                $("#clientMessagesPanel").removeClass("beep");
            },
            //系统通知查看全部函数
            viewSysMsgAllFun:function () {
                $("#SysMsgPanel").removeClass("beep");
            },
            //系统设置函数
            systemSettingsFun:function () {
                layer.alert("系统设置功能正在开发中...");
            },
            //系统版本函数
            systemVersionFun:function(){
                layer.alert("系统版本功能正在开发中...");
            },
            //退出登录函数
            exitSystemFun:function(){
                layer.alert("退出登录功能正在开发中...");
            },
            //订单信息搜索函数
            orderSearchFun:function () {
                layer.msg("搜索");
            }
        }
    });
    //正文vue处理
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
            /*供应商信息状态*/
            SupplierInfoStatus: "none",
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
            MultipleRadioVal:"",
            /*订单管理[开单]精确合并需要的数据,获取用户输入的所有规格型号*/
            allSpecificationModel: "",
            preciseMergerVal: "", //--->精确合并后的数据
            preciseMergerFlag: false, //--->精确合并状态
            /*订单管理[已完成订单]需要的数据*/
            orderCompletedRawData: "",  //--->后台返回的已完成订单数据
            orderCompletedSelectData: "", //--->监听下拉框选择
            loadingStatus: 'none',  //--->加载层状态
            /*订单管理[添加收入]需要的数据*/
            addRevenueOrderVal: "", //订单号
            addRevenueTime: "", //当前时间
            addRevenueClientNameVal: "", //客户名称
            addRevenuePayee: "", //收款人
            addRevenuePaymentMethod: "银行卡",//--->付款方式
            addRevenueCardVal: "", //--->卡号/账号
            addRevenueCollectionAmount: "", //收款金额
            addRevenueRemarks: "", //备注
            addRevenueVlientInfo: "new V",//--->客户详细信息
            addRevenueBankImg: URL + "webPic/bankImg/yinlianzhifu.png", //--->所选择的银行图片
            addRevenueProjectName: "",//--->工程名称
            OtherRevenueClientName:"",
            OtherRevenuePayee:"",
            OtherRevenueAmount:"",
            OtherRevenueAmountRemarks:"",
            EditRevenueClientName:"",
            EditRevenueProjuctName:"",
            EditRevenuePayMethod:"",
            EditRevenueCaedNum:"",
            EditRevenuePayAmount:"",
            EditRevenuePayee:"",
            EditRevenueRemarks:"",
            salaryGivingStaffData:"",
            RevenueManagementStart:"",
            RevenueManagementEnd:"",
            addProductStatus:false,
            //精确/模糊(合并)点击状态
            fuzzyState: false, //--->模糊状态
            preciseState: false, //--->精确状态
            fuzzyVal: "",  //--->模糊合并后的数据
            /*订单管理[标签打印]状态*/
            labelRadio: 1, //--->标签打印[标签纸]单选框选择
            labelFinalData: [],
            /*进货管理:原片采购*/
            originalFilmorderNumber: "", //--->订单号用户选择数据
            supplierSelectVal: "", //--->供货商用户选择数据
            originalFilmRemarksVal: "", //---->备注用户选择数据
            originalFilmdStart: "", //开始时间
            originalFilmEnd: "", //结束时间
            purchaseProductName: "", //新增配件下拉选择框
            originalFilmSupplierSelectVal: "", //原片采购供货商选择
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
            replacementFittingSupplierSelectVal: "",
            /*出货管理*/
            ShipmentdStart: "",
            ShipmentdEnd: "",
            shipmentAddStart: "",
            shipmentAddEnd: "",
            invoiceClientName: "",    //--->发货单客户名称
            invoiceProjectName: "",    //--->发货单工程名称
            freightPaymentStatus:false, //--->运费支付状态
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
            DataOrderNumber: "", //--->根据id查询数据时,被查询数据所对应的订单号
            invoiceFreight: "", //运费
            shippingOrderNumber:"",
            shippingOrderID:"",
            /*财务管理[支出管理]*/
            payAddOutlayType:"",
            payAddPaymentMethod:"",
            payAddPaymentAmount:"",
            payAddBeneficiary:"",
            payAddRemarks:"",
            payEditOutlayType:"",
            payEditPaymentMethod:"",
            payEditPaymentAmount:"",
            payEditSupperName:"",
            payEditBeneficiary:"",
            payEditRemarks:"",
            payStart:"",
            payEnd:"",
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
            clientBankCardNumber:'',
            //编辑客户数据
            clientId: "", //--->客户id
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
            originalInformationProductName: "",  //--->产品名称选择
            //原片信息新增数据
            productNameVal: "",   // 产品名称
            productColor: "",   // 颜 色
            productLength: "", //长度
            productWidth: "",   // 宽度
            originalFilmThicknessVal: "",  // 厚 度
            originalFilmUnitPriceVal: "", //  单 价
            originalFilmWholesalePriceVal: 0, //批 发 价
            originalFilmRemarksVals: "",  //--->备注
            /*编辑*/
            editProductNameVal: "", //原片名称
            editProductColor: "", //颜色
            editProductLength: "", //长度
            editProductWidth: "", //宽度
            editOriginalFilmThicknessVal: "",//厚度
            editOriginalFilmUnitPriceVal: "",//单价
            editOriginalFilmWholesalePriceVal: "",//批发价
            editOriginalFilmRemarksVals: "", //-->备注
            profuctId: "", //id
            //--->配件信息
            OriginalInfoCommodityNameSelectVal: "",
            productModelVal: "",
            /*员工管理[考勤管理]数据*/
            AttendanceDivision: "", //--->部门
            AttendanceNameOfWorker: "", //--->姓名
            AttendanceJobNumber: "",//---->工号
            /*员工管理[工资发放]数据*/
            SalaryInfoDivisionVal: "",//---->职位/岗位
            SalaryInfoNameVal: "",  //--->姓名
            SalaryInfoJobNumberVal: "", //--->工号
            /*员工管理[员工信息]数据*/
            EmployeeDivisionVal: "",
            EmployeeNameVal: "",
            EmployeejobNumberVal: "",
            /*进销存管理[库存管理]*/
            originalTitleName: "",
            /*出货管理需要的数据*/
            shipClientName:"",
            shipOrderNumber:"",
            /*供应商所需要的数据*/
            SupplierInfoSelectData: "",
            supplierLogoSrc: 'img/update.png',
            supplierName: '', //--->供应商名称
            supplierContact: '', //--->供应商联系人
            supplierPhone: '', //--->供应商联系电话
            supplierAddress: '', //---->供应商地址
            supplierBankCardNumber: '', //--->供应商银行卡号
            supplierBankPrompt: '', //--->所属银行提示
            supplierWechat: '', //--->供应商联系人微信
            /*供应商编辑弹层需要的数据*/
            editSupplierLogoSrc: 'img/update.png',
            editSupplierName: '', //--->供应商名称
            editSupplierContact: '', //--->供应商联系人
            editSupplierPhone: '', //--->供应商联系电话
            editSupplierAddress: '', //---->供应商地址
            editSupplierBankCardNumber: '', //--->供应商银行卡号
            editSupplierBankPrompt: '', //--->所属银行提示
            editSupplierWechat: '', //--->供应商联系人微信
            uploadDocumentForOrderNumber:'',
            /*编辑考勤信息*/
            EditAttendanceName:"",
            EditAttendanceJobNumber:"",
            EditAttendanceDivision:"",
            EditAttendanceAskForLeaveDays:"",
            EditAttendanceLeaveDays:"",
            EditAttendanceSickLeaveDays:"",
            EditAttendanceActualAttendanceDays:"",
            EditAttendanceDaysToAttend:"",
            /*财务管理[工资发放]*/
            salaryAddJobNumber:"",
            salaryAddBasicWage:"",
            salaryAddDepartment:"",
            salaryAddJobSubsidy:"",
            salaryAddPayable:"",
            salaryAddAttendanceDeduction:"",
            salaryAddRealWage:"",
            salaryAddPersonalIncomeTax:"",
            salaryAddRemark:"",
            salaryEditNameOfWorker:"",
            salaryEditEmployeeNumber:"",
            salaryEditBasicWage:"",
            salaryEditJobSubsidy:"",
            salaryEditPayable:"",
            salaryEditAttendanceDeduction:"",
            salaryEditRealWage:"",
            salaryEditPersonalIncomeTax:"",
            /*员工管理[添加员工]*/
            employeeAddName:"",
            employeeAddJobNumber:"",
            employeeAddDivision :"",
            employeeAddPosition:"",
            employeeAddBasicWage:"",
            employeeAddPhoneNumber:"",
            employeeAddDateOfBirth:"",
            employeeAddDateOfEntry:"",
            /*员工管理[编辑员工]*/
            employeeEditName:"",
            employeeEditJobNumber:"",
            employeeEditDivision:"",
            employeeEditPosition:"",
            employeeEditBasicWage:"",
            employeeEditPhoneNumber:"",
            /*客户对账*/
            customerReconciliationSelectVal:"",
            deliveryOrderJsonSrc:[], //--->送货请单图片地址
            customerOriginalDocumentSrc:[], //--->原始订单图片地址
            /*上传状态管理*/
            documentUploadStatus:false
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
                } else {
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
            //上传单据函数
            uploadDocument:function(){
                let thisRowData = MAIN.getTableRowData("orderInfoList");
                if(!Af.nullstr(thisRowData))
                {
                    vm.uploadDocumentForOrderNumber = thisRowData[0].orderNumber;
                    vm.documentUploadStatus = false;
                }
            },
            //客户趋势点击函数
            customerTrendFun:function(){
                layer.alert("该模块暂未开放!");
                return;
            },
            //订单趋势点击函数
            orderTrendFun:function(){
                layer.alert("该模块暂未开放!");
                return;
            },
            //财务报表点击函数
            financeReportFun: function () {
                layer.alert("本模块暂未开放!");
                return;
                /*请求后台获取(当前总收入/当前总支出/当前总余额)*/
                this.financeReportStatus = "block";
                var req = {
                    operator: $("#nickNameTextPanel").html(),
                    getIndexData: "getIndexData"
                };
                Af.rest("FinancialState.api", req, function (ans) {
                    if (ans.errorCode == 0) {
                        Af.trace(ans);
                        vm.totalRevenue = ans.TotalIncome;
                        vm.totalExpenses = ans.TotalOutlay;
                        vm.totalBalance = ans.TotalBalance;
                    }
                });
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
                this.SupplierInfoStatus = "none";
            },
            //进货管理点击函数
            IncomingGoodsFun: function () {
                vm.loadingStatus = "block";
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
                this.SupplierInfoStatus = "none";
                vm.loadingStatus = "none";
            },
            /*进货管理:原片采购[采购登记点击事件]*/
            purchaseRegistrationFun: function () {
                //请求后台获取 订单号/服务器时间/原片信息表所有原片名称/供货商信息表所有供货商名称
                vm.loadingStatus = "block";
                var req = {};
                req.queryType = ["productName"];
                req.operator = $("#nickNameTextPanel").html();
                Af.rest("productNameModelInquiry.api", req, function (ans) {
                    /*移除除第一个以外的选项*/
                    $("#OriginalFilmspecificationModel option:gt(0)").remove();
                    $("#OriginalFilmsupplier option:gt(0)").remove();
                    /*赋值订单号 日期*/
                    $("#OriginalFilmorderNumber").val(ans.orderNumber);
                    $("#OriginalFilmDateSelect").val(ans.nowTime);
                    productNameSelectFun();

                    /*渲染进货管理:原片采购[规格型号]选择框*/
                    function productNameSelectFun() {
                        var data = ans.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].productName;
                            nowData.push(temporaryData);
                        }
                        MAIN.addSelectVal(nowData, "OriginalFilmspecificationModel");
                        /*渲染供应商选择框*/
                        let SupplierResult = ans.SupplierResult;
                        var SupplierData = [];
                        for (var i = 0; i < SupplierResult.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = SupplierResult[i].id;
                            temporaryData.name = SupplierResult[i].supplierName;
                            SupplierData.push(temporaryData);
                        }
                        MAIN.addSelectVal(SupplierData, "OriginalFilmsupplier");
                    }
                });
                layer.open({
                    title: "原片采购",
                    type: 1,
                    area: ['970px', '640px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#PurchaseRegistrationSubmenu"),
                    success: function () {
                        vm.loadingStatus = "none";
                    },
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
                vm.loadingStatus = "block";
                /*获取用户输入的数据*/
                var req = {};
                req.orderNumber = $("#OriginalFilmorderNumber").val();
                req.purchaseDate = $("#OriginalFilmDateSelect").val();
                req.supplier = vm.originalFilmSupplierSelectVal;
                req.specificationModel = vm.purchaseProductName;
                req.thickness = $("#OriginalFilmthickness").val();
                req.color = $("#OriginalFilmcolor").val();
                req.quantity = $("#OriginalFilmquantity").val();
                req.unitPrice = $("#OriginalFilmunitPrice").val();
                req.totalPurchase = $("#OriginalFilmtotalPurchase").val();
                req.shippingFee = $("#OriginalFilmshippingFee").val();
                req.unloadingFee = $("#OriginalunloadingFee").val();
                if(Af.nullstr(req.unloadingFee))
                {
                    req.unloadingFee = "0";
                }
                req.remarks = $("#OriginalFilmremarks").val();
                req.operator = $("#nickNameTextPanel").html();
                req.addOrderData = "addOrderData";
                if (Af.nullstr(req.purchaseDate) || Af.nullstr(req.specificationModel) || Af.nullstr(req.color) || Af.nullstr(req.quantity) || Af.nullstr(req.unitPrice) || Af.nullstr(req.totalPurchase)) {
                    MAIN.ErroAlert("请检查红色必填项!");
                    vm.loadingStatus = "none";
                    if (Af.nullstr(req.purchaseDate)) {
                        $("#OriginalFilmDateSelect").css({
                            "border-color": "red"
                        });
                    } else {
                        $("#OriginalFilmDateSelect").css({
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
                            vm.MultipleRadioVal = "";
                            //清空select中除第一个以外的选项
                            $("#fittingSpecificationModel option:gt(0)").remove();
                            vm.loadingStatus = "none";
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
                vm.loadingStatus = "block";
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
                vm.loadingStatus = "none";
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
                vm.loadingStatus = "block";
                var req = {};
                req.operator = $("#nickNameTextPanel").html();
                req.queryAll = "queryAll";
                /*请求后台获取订单号/配件名称/配件图片 供应商表内所有供应商名称*/
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
                    MAIN.addSelectValForId(resultArray, "fittingSpecificationModel");
                    //渲染日期
                    $("#fittingOrderNumberDate").val(ans.serverTime);
                    /*渲染供应商选择框*/
                    let SupplierResult = ans.SupplierResult;
                    var SupplierData = [];
                    for (var i = 0; i < SupplierResult.length; i++) {
                        var temporaryData = {};
                        temporaryData.id = SupplierResult[i].id;
                        temporaryData.name = SupplierResult[i].supplierName;
                        SupplierData.push(temporaryData);
                    }
                    MAIN.addSelectVal(SupplierData, "fittingSupplier");
                });
                layer.open({
                    title: "配件采购",
                    type: 1,
                    area: ['970px', '640px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#fittingAddSubmenu"),
                    success: function () {
                        vm.loadingStatus = "none";
                    },
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
                vm.loadingStatus = "block";
                /*获取用户输入的数据*/
                var req = {};
                req.orderNumber = $("#fittingOrderNumberPanel").val();
                req.fittingDate = $("#fittingOrderNumberDate").val();
                req.supplier = vm.replacementFittingSupplierSelectVal;
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
                if (Af.nullstr(req.orderNumber) || Af.nullstr(req.fittingDate) || Af.nullstr(req.purchaseQuantity) || Af.nullstr(req.totalPurchase)) {
                    MAIN.ErroAlert("请检查红色必填项!");
                    vm.loadingStatus = "none";
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
                            vm.loadingStatus = "none";
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
                vm.loadingStatus = "block";
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
                vm.loadingStatus = "none";
            },
            //出货管理点击函数
            shipmentFun: function () {
                vm.loadingStatus = "block";
                this.shipmentStatus = "block";
                setTimeout(function () {
                    /*渲染出货管理数据表格*/
                    MAIN.originalFilmOutList($("#nickNameTextPanel").html());
                    vm.loadingStatus = "none";
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
                this.SupplierInfoStatus = "none";
            },
            //出货管理根据日期[查询]点击函数
            shipmentQueryFun: function () {
                vm.loadingStatus = "block";
                var req = {};
                req.dStart = this.ShipmentdStart;
                req.dEnd = this.ShipmentdEnd;
                req.conditionalQuery = "conditionalQuery";
                req.operator = $("#nickNameTextPanel").html();
                if (Af.nullstr(req.dStart) || Af.nullstr(req.dEnd) || Af.nullstr(req.operator)) {
                    MAIN.ErroAlert("请选择查询条件");
                    vm.loadingStatus = "none";
                } else {
                    Af.rest("ShipmentInfo.api", req, function (ans) {
                        MAIN.originalFilmOutDataList(ans.data);
                        vm.loadingStatus = "none";
                    })
                }
            },
            //出货管理[新增]悬浮层{提交}点击函数
            addShipmentSubmitFun: function () {
                /*获取表格内的所有数据*/
                let finalData = Af.getTableData("#OrderModelList");
                /*将得到的数组转为需要用的JSONArray*/
                let finalJSONArr = [];
                for (let i = 0; i < finalData.length; i++) {
                    let finalObj = {
                        "id": i + 1,
                        "productName":finalData[i][1],
                        "glassLength": finalData[i][2],
                        "glassWidth": finalData[i][3],
                        "glassNum": finalData[i][4],
                        "glassMark": finalData[i][5],
                        "glassArea": finalData[i][6],
                        "nowShipNum": finalData[i][7], //发货数量
                        "nowAmount":finalData[i][8], //发货金额
                        "nowArea":finalData[i][9], //发货面积
                        "shippedQuantity":finalData[i][10],  //已发货数量
                        "lastNum":finalData[i][11], //剩余数量
                        "unitPrice":finalData[i][12], //--->单价
                        "totalAmount":finalData[i][13] //--->总金额
                    };
                    finalJSONArr.push(finalObj);
                };
                /*数量框输入负数判断*/
                var inputBoxVal = false;
                //计算将要发货的数据(打印需要)
                var dataToBeShipped = [];
                $.each(finalJSONArr,function (index,item) {
                    let nowShipNum = item.nowShipNum;//--->当前发货数量
                    nowShipNum = Number(nowShipNum);
                    /*判断负数出现*/
                    if(nowShipNum<0)
                    {
                        inputBoxVal = true;
                    }
                    if(nowShipNum>0)
                    {
                        dataToBeShipped.push(item);
                    }
                });
                if(inputBoxVal)
                {
                    MAIN.ErroAlert("请检查发货数量框是否有负数!(剩余数量背景为成赤红色,表示当前型号已完成发货)");
                    return;
                } else if(Af.nullstr(dataToBeShipped))
                {
                    MAIN.ErroAlert("没有输入要发货的规格型号!");
                    return;
                }
                /*判断用户是否有输入发货数量(当前发货的总量,当前发货总金额,)*/
                var nowShipTotalNum = 0;//--->当前发货总数量
                var TotalShippedQuantity = 0; //--->当前已发货总数量
                var TotalShippedArea = 0; //---->当前已发货总面积 = 当前已发货数量*当前规格型号的面积
                var totalGlassNum = 0;//--->当前总数量
                var totalGlassArea = 0;//--->当前总面积
                var nowShipTotalAmount = 0; //--->当前发货总金额
                var nowShipTotalArea = 0; //--->当前发货总面积
                var nowTotalRemainingQuantity = 0;//--->当前剩余总数量
                var nowtotalRemainingArea = Number(0); //--->当前剩余总面积
                let repeatTimes = 0;
                for (let i = 0; i < finalJSONArr.length; i++) {
                    let thisObj = finalJSONArr[i];
                    let glassNum = thisObj.glassNum;
                    totalGlassNum = Af.accAdd(totalGlassNum,glassNum);
                    let glassArea = thisObj.glassArea;
                    totalGlassArea = Af.accAdd(totalGlassArea,glassArea); //--->计算总面积
                    let shipmentQuantity = thisObj.nowShipNum; //当前输入的发货数量
                    let nowAmount = thisObj.nowAmount; //当前发货金额
                    if(Af.nullstr(nowAmount))
                    {
                        nowAmount = 0;
                    }
                    let nowArea = thisObj.nowArea; //--->当前发货面积
                    if(Af.nullstr(nowArea))
                    {
                        nowArea = 0;
                    }
                    let shippedQuantity = thisObj.shippedQuantity;//--->当前已发货数量
                    if(Af.nullstr(shippedQuantity))
                    {
                        shippedQuantity = 0;
                    }
                    TotalShippedQuantity = Af.accAdd(TotalShippedQuantity,shippedQuantity);
                    let glassLength = thisObj.glassLength;
                    let glassWidth = thisObj.glassWidth;
                    let nowShipArea = ((glassLength*glassWidth*shippedQuantity)/1000000).toFixed(2); //--->计算当前已发货面积
                    TotalShippedArea = Af.accAdd(TotalShippedArea,nowShipArea).toFixed(2);//--->计算当前已发货总面积
                    let lastNum = thisObj.lastNum; //--->当前剩余数量
                    if(Af.nullstr(lastNum))
                    {
                        lastNum = 0;
                    }
                    nowShipTotalNum = Af.accAdd(nowShipTotalNum,shipmentQuantity);//--->计算当前发货总数量
                    nowShipTotalAmount = Af.accAdd(nowShipTotalAmount,nowAmount);//--->计算当前发货总金额
                    nowShipTotalArea = Af.accAdd(nowShipTotalArea,nowArea); //--->计算当前发货总面积
                    if (Af.nullstr(shipmentQuantity)) {
                        repeatTimes++;
                    }
                }
                nowTotalRemainingQuantity = totalGlassNum - TotalShippedQuantity; //--->计算当前剩余总数量(总数量-所有的已发货数量)
                nowtotalRemainingArea = Af.accSub(totalGlassArea,TotalShippedArea);//--->计算当前剩余总面积(总面积-当前已经发货面积)
                if (repeatTimes >= finalJSONArr.length) {
                    MAIN.ErroAlert("没有输入要发货的规格型号数量!");
                    return;
                }
                /*要发货的数据:finalJSONArr*/
                // Af.trace("将要发货的数据:");
                // Af.trace(finalJSONArr);
                let req = {
                    "operator":$("#nickNameTextPanel").html(),
                    "finalJSONArr":finalJSONArr,
                    "inventoryCheck":"inventoryCheck"
                };
                /*检查库存是否充足*/
                Af.rest("ShipmentInfo.api",req,function(ans){
                    if(ans.errorCode==0)
                    {
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
                                } else {
                                    layer.close(index);

                                    /*请求后台发送:已发货,剩余发货数据*/
                                    let ShipmentReq = {};
                                    ShipmentReq.addOrderData = "addOrderData"; //--->新增发货字段
                                    ShipmentReq.clientName = vm.shipClientName;//--->客户名称
                                    ShipmentReq.dataToShip = Af.getJSONArray(dataToBeShipped); //要发货的数据
                                    ShipmentReq.tempArray = Af.getJSONArray(finalJSONArr); //临时数据用于移除不需要的元素
                                    ShipmentReq.operator = $("#nickNameTextPanel").html();
                                    ShipmentReq.orderNumber = vm.shipOrderNumber;
                                    ShipmentReq.numberShipments = nowShipTotalNum.toString(); //--->当前发货总数量
                                    ShipmentReq.TotalShippedQuantity = TotalShippedQuantity.toString();//--->当前已发货总数量
                                    ShipmentReq.TotalShippedArea = TotalShippedArea.toString();//--->当前已发货总面积
                                    ShipmentReq.theTotalAmount = nowShipTotalAmount.toString(); //--->当前发货总金额
                                    ShipmentReq.shipArea = nowShipTotalArea.toString(); //--->当前发货总面积
                                    ShipmentReq.theRemainingNum = nowTotalRemainingQuantity.toString();//剩余总数量
                                    ShipmentReq.remainingArea = nowtotalRemainingArea.toString(); //剩余总面积
                                    ShipmentReq.paymentDetails = vm.invoicePaymentDetails; //付款明细
                                    ShipmentReq.transportationManager = vm.invoiceTransportationManager; //运输负责人
                                    ShipmentReq.freightPaymentStatus = vm.freightPaymentStatus;//--->运费支付状态
                                    ShipmentReq.freight = vm.invoiceFreight;//运费
                                    Af.rest("ShipmentInfo.api",ShipmentReq,function (ans) {
                                        if(ans.errorCode==0)
                                        {
                                            /*开始打印*/
                                            let orderInfoData = ans.orderInfo;
                                            //取出客户名称
                                            $("#invoiceClientName").html(vm.shipClientName);
                                            //从后台拿出(工程名称/订单号/联系电话/送货地址/订单日期/发货日期/未付款金额)
                                            $("#invoiceProjectName").html(orderInfoData.invoiceProjectName);
                                            $("#invoiceOrderNumber").html(orderInfoData.invoiceOrderNumber);
                                            $("#invoiceContactNumber").html(orderInfoData.invoiceContactNumber);
                                            $("#invoiceDeliveryAddress").html(orderInfoData.invoiceDeliveryAddress);
                                            $("#invoiceOrderDate").html(orderInfoData.invoiceOrderDate);
                                            $("#invoiceDateOfShipment").html(orderInfoData.invoiceDateOfShipment);
                                            $("#invoiceUnpaid").html(orderInfoData.unpaid);
                                            //总数量,总面积,总金额 打印时间 运输负责人
                                            $("#invoiceTotalNumber").html(nowShipTotalNum + "块");
                                            $("#invoiceTotalArea").html(nowShipTotalArea + "平方");
                                            $("#invoiceTotalAmount").html(nowShipTotalAmount + "元");
                                            $("#printTime").html(orderInfoData.invoiceDateOfShipment);
                                            $("#transportationManager").html(vm.invoiceTransportationManager);
                                            /*渲染打印模板表格区域*/
                                            let shippedDataArr = Af.getJSONArray(dataToBeShipped);
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

                                                var tdType1 = "<td colspan='5' class='title colspans'>";
                                                var tdType2 = "<td colspan='2' class='title colspans'>";
                                                var tdType3 = "<td colspan='1' class='title colspans'>";
                                                var dataArrayLength = Af.getJsonLength(shippedDataArr[i]); //---->获取当前JSONArray下的数据长度
                                                if (dataArrayLength > 1) {
                                                    let nowTotalArea = 0;
                                                    let nowTotalMoney = 0;
                                                    num++;
                                                    for (let k = 0; k < dataArrayLength; k++) {
                                                        let itemMoney = shippedDataArr[i][k].totalAmount;
                                                        let itemArea = shippedDataArr[i][k].glassArea;
                                                        nowTotalArea = Af.accAdd(itemArea, nowTotalArea);
                                                        nowTotalMoney = Af.accAdd(itemMoney, nowTotalMoney);
                                                    }
                                                    $("#invoicePrintList  tbody").append(trStart + tdType1 + "规格型号:" + shippedDataArr[i][0].productName + "</td>"+tdType3+ "面积(小计):" + nowTotalArea +"</td>"+tdType2 + "金额(小计):" + nowTotalMoney + "</td>" + trEnd);
                                                    for (let j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                                    {
                                                        let unitPrice = shippedDataArr[i][j].unitPrice;
                                                        td = "<td>" + j + "</td>";
                                                        td1 = "<td>" + shippedDataArr[i][j].glassLength + "</td>";    //表单模块需要的数据:玻璃长度/宽度/发货数量/标记/总面积/单价/总金额/
                                                        td2 = "<td>" + shippedDataArr[i][j].glassWidth + "</td>";
                                                        td3 = "<td>" + shippedDataArr[i][j].nowShipNum + "</td>";
                                                        td4 = "<td>" + "  " + "</td>";
                                                        td5 = "<td>" + shippedDataArr[i][j].nowArea + "</td>";
                                                        if (Af.nullstr(unitPrice)) {
                                                            td7 = "<td>" + "  " + "</td>";
                                                        } else {
                                                            td7 = "<td>" + unitPrice + "</td>";
                                                        }
                                                        td8 = "<td>" + shippedDataArr[i][j].nowAmount + "</td>";
                                                        $("#invoicePrintList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                                                    }

                                                } else {
                                                    let nowTotalArea = 0;
                                                    let nowTotalMoney = 0;
                                                    for (let k = 0; k < dataArrayLength; k++) {
                                                        let itemMoney = shippedDataArr[i][k].totalAmount;
                                                        let itemArea = shippedDataArr[i][k].glassArea;
                                                        nowTotalArea = Af.accAdd(itemArea, nowTotalArea);
                                                        nowTotalMoney = Af.accAdd(itemMoney, nowTotalMoney);
                                                    }
                                                    $("#invoicePrintList  tbody").append(trStart + tdType1 + "规格型号:" + shippedDataArr[i][0].productName + "</td>"+tdType3+ "面积(小计):" + nowTotalArea +"</td>"+tdType2 + "金额(小计):" + nowTotalMoney + "</td>" + trEnd);
                                                    for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                                    {
                                                        let unitPrice = shippedDataArr[i][j].unitPrice;
                                                        td = "<td>" + j + "</td>";
                                                        td1 = "<td>" + shippedDataArr[i][j].glassLength + "</td>";    //表单模块需要的数据:玻璃长度/宽度/发货数量/标记/总面积/单价/总金额/
                                                        td2 = "<td>" + shippedDataArr[i][j].glassWidth + "</td>";
                                                        td3 = "<td>" + shippedDataArr[i][j].nowShipNum + "</td>";
                                                        td4 = "<td>" + "  " + "</td>";
                                                        td5 = "<td>" + shippedDataArr[i][j].nowArea + "</td>";
                                                        if (Af.nullstr(unitPrice)) {
                                                            td7 = "<td>" + "  " + "</td>";
                                                        } else {
                                                            td7 = "<td>" + unitPrice + "</td>";
                                                        }
                                                        td8 = "<td>" + shippedDataArr[i][j].nowAmount + "</td>";
                                                        $("#invoicePrintList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                                                    }
                                                }
                                            }
                                            /*清空当前用户输入的数据*/
                                            layer.closeAll();
                                            /*重载数据表格*/
                                            MAIN.orderInfoList($("#nickNameTextPanel").html());
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
                                    })
                                }
                            }
                        });
                    }
                    else {
                        if(!Af.nullstr(ans.nonExistentInventoryVal))
                        {
                            let nonExistentInventoryVal = Af.mergeTheSameArrayValue(ans.nonExistentInventoryVal);
                            layer.confirm("以下库存不存在:"+nonExistentInventoryVal+"是否需要现在录入?", {
                                btn: ['是','否'] //按钮
                            }, function(){
                                layer.closeAll();
                                vm.purchaseRegistrationFun();
                            }, function(){
                                layer.closeAll();
                            });
                        }
                        else if(!Af.nullstr(ans.inventoryShortageVal))
                        {
                            let inventoryShortageVal = Af.mergeTheSameArrayValue(ans.inventoryShortageVal);
                            layer.confirm("以下库存不足:"+inventoryShortageVal+"是否需要现在录入?", {
                                btn: ['是','否'] //按钮
                            }, function(){
                                layer.closeAll();
                                vm.purchaseRegistrationFun();
                            }, function(){
                                layer.closeAll();
                            });
                        }
                        else {
                            MAIN.ErroAlert(ans.msg);
                        }
                    }
                });
            }
            ,
            //出货管理[新增]悬浮层{取消}点击函数
            shipmentAddCloseFun: function () {
                layer.closeAll();
            }
            ,
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
            }
            ,
            //基础信息[原片采购][原片名称]多个规格型号选择 提交事件
            MultipleSpeciSubmitFun:function(){
                if(!Af.nullstr(vm.MultipleRadioVal))
                {
                    let thisSelectVal = JSON.parse(vm.MultipleRadioVal);
                    $("#OriginalFilmthickness").val(thisSelectVal.length+"x"+thisSelectVal.width);
                    $("#OriginalFilmcolor").val(thisSelectVal.color);
                    $("#OriginalFilmunitPrice").val(thisSelectVal.unitPrice);
                    layer.close(MultipleSpeciLayer);
                }else{
                    MAIN.ErroAlert("请勾选一个型号");
                }
            },
            ///基础信息[原片采购][原片名称]多个规格型号选择 取消事件
            MultipleSpeciCancelFun:function(){
                layer.closeAll();
            },
            //出货管理[查看详情] 函数
            shipmentSeeDetails: function () {
                /*获取当前勾选行的数据*/
                let thisRowData = MAIN.getTableRowData("originalFilmOutList");
                if(Af.nullstr(thisRowData))
                {
                    MAIN.ErroAlert("请勾选一个出货单!");
                }else if(thisRowData.length==1)
                {
                    $("#shipOrderList tbody").html("");
                    let orderNumber = thisRowData[0].orderNumber;
                    let clientName = thisRowData[0].clientName;
                    let transportationManager = thisRowData[0].transportationManager;
                    let freight = thisRowData[0].freight+"元";
                    let freightPaymentStatus = thisRowData[0].freightPaymentStatus;
                    $("#shipOrderNumber").html(orderNumber);
                    $("#shipClientName").html(clientName);
                    $("#shipPeople").html(transportationManager);
                    $("#shipFreight").html(freight);
                    if(freightPaymentStatus)
                    {
                        $("#shipFreightPaymentStatus").html("已付款");
                    }
                    else
                    {
                        $("#shipFreightPaymentStatus").html("未付款");
                    }
                    let dataArray = JSON.parse(thisRowData[0].specificationModel);
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
                            td5,
                            td6,
                            td7,
                            td8,
                            td9,
                            td10,
                            td11,
                            td12;
                        var tdType = "<td colspan='13' class='title'>";
                        var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                        if (dataArrayLength > 1) {
                            num++;
                            $("#shipOrderList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td data-productName="+dataArray[i][j].productName+">" + (j + 1) + "</td>";
                                td1 = "<td class='glassLength'>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td class='glassWidth'>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td class='totalNum'>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                td6 = "<td class='quantityInput'>"+dataArray[i][j].nowShipNum+"</td>";
                                td7 ="<td class='nowAmount'>" + dataArray[i][j].nowAmount + "</td>";
                                td8 ="<td class='shipArea'>" + dataArray[i][j].nowArea + "</td>";
                                td9 = "<td class='shippedQuantity' data-rawData="+dataArray[i][j].shippedQuantity+">" + dataArray[i][j].shippedQuantity + "</td>";
                                if(Af.nullstr(dataArray[i][j].shippedQuantity))
                                {
                                    td9 = "<td class='shippedQuantity' data-rawData="+0+">" + 0 + "</td>";
                                }
                                td10 = "<td class='lastNum'>" + dataArray[i][j].lastNum + "</td>";
                                if (Number(dataArray[i][j].lastNum)==0)
                                {
                                    td10 = "<td class='lastNum' style='background:#FF5722;color: white '>" + dataArray[i][j].lastNum + "</td>";
                                }
                                if(Af.nullstr(dataArray[i][j].lastNum))
                                {
                                    td10 = "<td class='lastNum'>" + dataArray[i][j].glassNum + "</td>";
                                }
                                td11 = "<td class='unitPrice'>" +  dataArray[i][j].unitPrice + "</td>";
                                td12 = "<td>" +  dataArray[i][j].totalAmount + "</td>";
                                $("#shipOrderList  tbody").append("<tr class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + td6 + td7 + td8 + td9 + td10 + td11 +td12 + trEnd); //---->追加到页面
                            }

                        } else {
                            $("#shipOrderList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                            for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                            {
                                td = "<td data-productName="+dataArray[i][j].productName+">" + (j + 1) + "</td>";
                                td1 = "<td class='glassLength'>" + dataArray[i][j].glassLength + "</td>";
                                td2 = "<td class='glassWidth'>" + dataArray[i][j].glassWidth + "</td>";
                                td3 = "<td class='totalNum'>" + dataArray[i][j].glassNum + "</td>";
                                td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                td6 = "<td class='quantityInput'>"+dataArray[i][j].nowShipNum+"</td>";
                                td7 ="<td class='nowAmount'>" + dataArray[i][j].nowAmount + "</td>";
                                td8 ="<td class='shipArea'>" + dataArray[i][j].nowArea + "</td>";
                                td9 = "<td class='shippedQuantity' data-rawData="+dataArray[i][j].shippedQuantity+">" + dataArray[i][j].shippedQuantity + "</td>";
                                if(Af.nullstr(dataArray[i][j].shippedQuantity))
                                {
                                    td9 = "<td class='shippedQuantity' data-rawData="+0+">" + 0 + "</td>";
                                }
                                td10 = "<td class='lastNum'>" + dataArray[i][j].lastNum + "</td>";
                                if (Number(dataArray[i][j].lastNum)==0)
                                {
                                    td10 = "<td class='lastNum' style='background:#FF5722;color: white '>" + dataArray[i][j].lastNum + "</td>";
                                }
                                if(Af.nullstr(dataArray[i][j].lastNum))
                                {
                                    td10 = "<td class='lastNum'>" + dataArray[i][j].glassNum + "</td>";
                                }
                                td11 = "<td class='unitPrice'>" +  dataArray[i][j].unitPrice + "</td>";
                                td12 = "<td>" +  dataArray[i][j].totalAmount + "</td>";
                                $("#shipOrderList  tbody").append("<tr class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + td6 + td7 + td8 + td9 + td10 + td11 +td12 + trEnd); //---->追加到页面
                            }
                        }
                    }
                    Af.openSubmenu(""+thisRowData[0].clientName+"的出货单",["1170px","740px"],true,$("#shipmentSeeDetailsSubmenu"));
                }
                else
                {
                    MAIN.ErroAlert("不能勾选多个!");
                }

            }
            ,
            uploadDeliveryNoteFun:function(){
                /*获取当前勾选行的数据*/
                let thisRowData = MAIN.getTableRowData("originalFilmOutList");
                if(!Af.nullstr(thisRowData))
                {
                    vm.shippingOrderNumber = thisRowData[0].orderNumber;
                    vm.shippingOrderID =  thisRowData[0].id;
                    vm.documentUploadStatus = false;
                }
            },
            //进销存管理[库存管理]点击事件
            stockFun: function () {
                this.stockStatus = "block";
                setTimeout(function () {
                    /*渲染库存管理数据表格*/
                    MAIN.stockList($("#nickNameTextPanel").html());
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
                this.SupplierInfoStatus = "none";
            }
            ,
            //进销存管理[库存管理]查询函数
            inventoryInquiryFun: function () {
                //获取原片名称
                if (Af.nullstr(this.originalTitleName)) {
                    MAIN.ErroAlert("请选择一个原片名称后在点查询");
                    return;
                }
                var req = {};
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.originalTitle = vm.originalTitleName;
                Af.rest("inventoryInfo.api", req, function (ans) {
                    if (ans.errorCode == 0) {
                        MAIN.stockDataList(ans.data);
                    } else {
                        layer.msg(ans.msg);
                    }
                });
            }
            ,
            //进销存管理[库存管理]删除函数
            stockDelFun: function () {
                var req = {};
                //取出当前选择项订单号
                var idsArray = MAIN.getSelectId("stockList");
                if (Af.nullstr(idsArray)) {
                    MAIN.ErroAlert("不能删除空数据,请勾选订单!");
                } else {
                    //提示用户删除
                    layer.confirm('确定要删除吗?', function (index) {
                        var idsStr = idsArray.toString();
                        req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                        req.operator = $("#nickNameTextPanel").html();
                        req.delSalary = "delSalary";
                        Af.rest("inventoryInfo.api", req, function (ans) {
                            layer.close(index);
                            layer.msg(ans.msg);
                            if (ans.errorCode == 0) {
                                //数据表格重载
                                MAIN.stockList($("#nickNameTextPanel").html());
                            }
                        });
                    });
                }
            }
            ,
            //进销存管理[库存管理]导出函数
            stockExportFun: function () {
                var tableTitle = ['库存编号', '原片名称', '原片颜色', '原片厚度', '入库数量', '出库数量', '库存余量', '供货商'];
                var selectDatas = MAIN.getStockDatas("stockList");
                if (!Af.nullstr(selectDatas)) {
                    MAIN.exportFun(tableTitle, selectDatas);
                }
            }
            ,
            //订单信息管理点击事件
            OrderInfoFun: function () {
                this.orderManagementStatus = "block";
                vm.loadingStatus = "block";
                setTimeout(function () {
                    /*渲染订单信息管理数据表格*/
                    var userName = $("#nickNameTextPanel").html();
                    MAIN.orderInfoList(userName);
                    vm.loadingStatus = "none";
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*订单信息管理:查询按钮交互函数*/
            orderBtnQueryFun: function () {
                vm.loadingStatus = "block";
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
                    vm.loadingStatus = "none";
                } else {
                    Af.rest("orderInfonQueiry.api", req, function (ans) {
                        MAIN.orderInfoCustomizeList(ans.data);
                        vm.loadingStatus = "none";
                    });
                }
            }
            ,
            /*订单信息管理:开单按钮点击交互函数*/
            billingFun: function (callState) {
                vm.loadingStatus = "block";
                /**
                 * 解决时间:2018年1月7日 14:04
                 * @type {Array}
                 * 解决问题:用户第一次侯点开单,动态生成下拉选择框数据*2
                 * 问题原因:全局变量 ansSelectData没有进行清空处理
                 */
                ansSelectData = [];
                if(callState)
                {
                    layer.open({
                        title: "正在开单",
                        type: 1,
                        area: ['1270px', '840px'],
                        //shadeClose : true, //点击遮罩关闭
                        content: $("#billingManageSubmenu"),
                        success: function () {
                            /*清空除第一个以外的所有选项*/
                            $("select[name='customize" + globalVar + "'] option:gt(0)").remove();
                            $("#customize1 option:gt(0)").remove();
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
                                    MAIN.addSelectCustomize(selectData, "customize1");
                                    if (globalVar != 1) {
                                        MAIN.addSelectCustomize(selectData, "customize" + globalVar + "");
                                    }
                                    //获取订单号并赋值
                                    $("#billingOrderNumber").val(ans.serverTime);
                                    MAIN.billingorderNumber = ans.serverTime;
                                    //获取服务器时间并赋值
                                    $("#billingDatePanel").val(ans.nowTime);
                                    vm.loadingStatus = "none";
                                }
                            });
                            var selectId = 0; //用户选择slect下拉框的id(打开弹出层时,设置一个定时器!用于监听用户是否选择下拉框)
                            timer = setInterval(function () {
                                selectId = $('option:selected', "select[name='customize1']").index(); //--->获取当前选择项的索引
                                if (!Af.nullstr(selectId)) {
                                    if (selectId > 0) {
                                        //给单价赋值
                                        $("#submenu .table-panel .content-panel .row_1 .item-panel .unitPrice").val(selectData[selectId - 1].unitPrice);
                                    }
                                }
                            }, 100);
                        },
                        end: function () { //弹层销毁出发回调

                        }
                    });
                }else{
                    /*清空除第一个以外的所有选项*/
                    $("select[name='customize" + globalVar + "'] option:gt(0)").remove();
                    $("#customize1 option:gt(0)").remove();
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
                            MAIN.addSelectCustomize(selectData, "customize1");
                            if (globalVar != 1) {
                                MAIN.addSelectCustomize(selectData, "customize" + globalVar + "");
                            }
                            //获取订单号并赋值
                            $("#billingOrderNumber").val(ans.serverTime);
                            MAIN.billingorderNumber = ans.serverTime;
                            //获取服务器时间并赋值
                            $("#billingDatePanel").val(ans.nowTime);
                            vm.loadingStatus = "none";
                        }
                    });
                    var selectId = 0; //用户选择slect下拉框的id(打开弹出层时,设置一个定时器!用于监听用户是否选择下拉框)
                    timer = setInterval(function () {
                        selectId = $('option:selected', "select[name='customize1']").index(); //--->获取当前选择项的索引
                        if (!Af.nullstr(selectId)) {
                            if (selectId > 0) {
                                //给单价赋值
                                $("#submenu .table-panel .content-panel .row_1 .item-panel .unitPrice").val(selectData[selectId - 1].unitPrice);
                            }
                        }
                    }, 100);
                }


            }
            ,
            /*订单信息管理:开单悬浮层[新增] 数据交互*/
            billingaddFun: function () {
                var status = 1;
                if(vm.addProductStatus)
                {
                    layer.confirm('您已录入大于一条数据,若需要录入新的原片信息,此页面将刷新,已录入数据不会保存?', function (index) {
                        window.location.reload()
                    });
                    return;
                }
                vm.addProductFun(status);
            }
            ,
            /*订单信息管理:开单悬浮层[打印]*/
            billingPrintFun: function () {
                /*获取用户输入的所有规格型号信息*/
                var userInputDatas = [];
                var userInputArray = [];
                globalArea = 0;
                globalPrice = 0;
                globalGlassNum = 0;
                $("#billingGlassNum").val(""); //--->玻璃数量
                $("#billingTotalArea").val(""); //-->总面积
                $("#billingtotalAmount").val(""); //--->总金额
                for (var i = 1; i <= 300; i++) {
                    var userInputOBJ = {};
                    //获取容器
                    let lengthVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassLength");
                    let widthVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassWidth");
                    let numVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .glassNum");
                    let marksVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .marks");
                    let areaVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .area");
                    let unitPricePanel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .unitPrice");
                    let totalAmountVessel = $(parent_panel + " " + containerPanel + row_line + i + foot_panel + " .totalAmount");
                    let userSelectData = $("#submenu .table-panel .content-panel .row_" + i + " .specificationModel select").find("option:selected").text();
                    if (Af.nullstr(userSelectData) || Af.nullstr(lengthVessel.val()) || userSelectData == "点击选择规格型号") {
                        //退出循环
                        break;
                    }
                    let glassLength = lengthVessel.val();
                    let glassWidth = widthVessel.val();
                    let glassNum = numVessel.val();
                    let markval = marksVessel.val();
                    let unitPrice = unitPricePanel.val();
                    let areaVal = areaVessel.val();
                    let totalAmount = totalAmountVessel.val();
                    /*生成JSONArray*/
                    userInputOBJ['id'] = i;
                    userInputOBJ['productName'] = userSelectData; //-->型号
                    userInputOBJ['glassLength'] = glassLength; //-->长
                    userInputOBJ['glassWidth'] = glassWidth; //-->宽
                    userInputOBJ['glassNum'] = glassNum; //-->数量
                    userInputOBJ['glassMark'] = markval; //-->标记
                    userInputOBJ['glassArea'] = areaVal; //-->面积
                    userInputOBJ['unitPrice'] = unitPrice;//--->单价
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
                //判断用户是否有输入规格型号
                if (userInputDatas.length < 1) {
                    MAIN.ErroAlert("检测到你还没有输入规格型号,请输入规格型号!");
                    return;
                }
                if (!Af.nullstr(vm.preciseMergerVal)) {
                    //检测用户是否有点精确合并
                    vm.preciseMergerFlag = true;
                }
                /*赋值精确合并需要的数据*/
                vm.allSpecificationModel = userInputDatas; //--->当前用户输入的数据
                if (printClicks == 0) {
                    layer.alert("总金额,总面积,已经计算,请检查数据的准确性!确保无误后再次点打印,开始打印生产单!")
                    printClicks = 1;
                    return;
                }
                let unfinishedArr = [];
                /*生成未发货数据*/
                for(let i = 0;i < userInputDatas.length;i++)
                {
                    let glassNum = userInputDatas[i].glassNum;
                    let unitPrice =  userInputDatas[i].unitPrice;
                    let glassWidth =  userInputDatas[i].glassWidth;
                    let productName =  userInputDatas[i].productName;
                    let totalAmount =  userInputDatas[i].totalAmount;
                    let glassMark =  userInputDatas[i].glassMark;
                    let glassArea = userInputDatas[i].glassArea;
                    let glassLength =  userInputDatas[i].glassLength;
                    let thisObj = {
                        "glassNum":glassNum,
                        "unitPrice":unitPrice,
                        "lastNum":glassNum, //--->剩余未发货数量
                        "glassWidth":glassWidth,
                        "productName":productName,
                        "totalAmount":totalAmount,
                        "glassMark":glassMark,
                        "glassLength":glassLength,
                        "shippedQuantity":"0", //--->已经发货数量
                        "id":i,
                        "glassArea":glassArea
                    };
                    unfinishedArr.push(thisObj);
                }
                //JSONArray归类(相同的归为一类) :发送给后台
                userInputArray = Af.getJSONArray(userInputDatas);
                var req = {};
                req.operator = $("#nickNameTextPanel").html();
                req.clientName = $("#billingClientName").val(); //-->客户名称
                req.projectName = $("#billingprojectName").val(); //-->工程名称
                if(Af.nullstr($("#billingprojectName").val()))
                {
                    req.projectName = "";
                }
                req.orderNumber = MAIN.billingorderNumber //-->订单号
                req.time = $("#billingDatePanel").val(); //-->日期
                req.deliveryAddress = $("#billingdeliveryAddress").val(); //--->送货地址
                if(Af.nullstr($("#billingdeliveryAddress").val()))
                {
                    req.deliveryAddress = "";
                }
                req.contactNumber = $("#billingcontactNumber").val(); //--->联系电话
                if(Af.nullstr($("#billingcontactNumber").val()))
                {
                    req.contactNumber = "";
                }
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
                req.unfinishedArr = unfinishedArr; //--->未发货数据
                req.addOrderData = "addOrderData";
                if (Af.nullstr(req.clientName) ||Af.nullstr(req.time)) {
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
                    /*判断模糊合并和精确合并状态*/
                    if (vm.preciseMergerFlag) {
                        userInputArray = Af.getJSONArray(vm.preciseMergerVal);
                    }
                    if (vm.fuzzyState) {
                        userInputArray = Af.getJSONArray(vm.fuzzyVal);
                    }
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
                        var tdType1 = "<td colspan='5' class='title colspans'>";
                        var tdType2 = "<td colspan='2' class='title colspans'>";
                        var dataArrayLength = Af.getJsonLength(userInputArray[i]); //---->获取当前JSONArray下的数据长度
                        if (dataArrayLength > 1) {
                            var totalAreaValue = 0;
                            num++;
                            for (let k = 0; k < dataArrayLength; k++) {
                                let nowArea = userInputArray[i][k].glassArea;
                                totalAreaValue = Af.accAdd(totalAreaValue, nowArea);
                                totalAreaValue = totalAreaValue.toFixed(2);
                            }
                            $("#ProductionOrderList  tbody").append(trStart + tdType1 + "规格型号:" + userInputArray[i][0].productName +"</td>" + tdType2 + "总面积:" + totalAreaValue + "</td>" + trEnd);
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
                            var totalAreaValue = 0;
                            num++;
                            for (let k = 0; k < dataArrayLength; k++) { //计算每一项归类数据的面积
                                let nowArea = userInputArray[i][k].glassArea;
                                totalAreaValue = Af.accAdd(totalAreaValue, nowArea);
                                totalAreaValue = totalAreaValue.toFixed(2);
                            }
                            $("#ProductionOrderList  tbody").append(trStart + tdType1 + "规格型号:" + userInputArray[i][0].productName +"</td>" + tdType2 + "总面积:" + totalAreaValue + "</td>" + trEnd);
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
                    $("#globalArea").html(0);
                    $("#globalPrice").html(0);
                    /*第一行数据归位*/
                    $("#customize1 > option:first").attr("selected", true);
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .glassLength").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .glassWidth").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .glassNum").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .area").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .unitPrice").val("");
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .totalAmount").val("");
                    //全局变量复位
                    globalVar = 1;
                    globalGlassNum = 0;
                    printClicks = 0;
                    globalArea = 0;
                    globalPrice = 0;
                    userInputDatas = [];
                    userInputArray = [];
                    vm.preciseMergerFlag = false;
                    vm.preciseMergerVal = "";
                }

            }
            ,
            /*精确合并*/
            billingPreciseMergerFun: function () {
                var rawData = vm.allSpecificationModel; //--->用户选择的原始规格型号
                vm.preciseState = true; //--->精确状态
                if (vm.fuzzyState) {
                    layer.alert("你已经选择了模糊合并，不能在进行精确合并了!");
                    return;
                }
                if (Af.nullstr(rawData)) {
                    MAIN.ErroAlert("精确合并前请先点,打印按钮!");
                    return;
                }
                let finalData = Af.preciseMerger(rawData);
                vm.preciseMergerVal = finalData;
            }
            ,
            /*模糊合并*/
            billingfuzzyMergerFun: function () {
                vm.fuzzyState = true; //--->模糊状态
                if (vm.preciseState) {
                    layer.alert("你已经选择了精确合并,不能在进行模糊合并了!")
                    return;
                }
                var rawData = vm.allSpecificationModel; //--->用户选择的原始规格型号
                if (Af.nullstr(rawData)) {
                    MAIN.ErroAlert("模糊合并前请先点,打印按钮!");
                    return;
                }
                let finalData = Af.fuzzyMerger(rawData);
                vm.fuzzyVal = finalData;
            }
            ,
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
            /*订单信息管理:订单打印函数*/
            printOrderFun: function () {
                /*获取当前选择行数据*/
                let data = MAIN.getTableRowData("orderInfoList");
                let orderInfo = data[0];
                if(data.length>1)
                {
                    MAIN.ErroAlert("只能勾选一个订单!");
                    return;
                }
                else if(Af.nullstr(data))
                {
                    MAIN.ErroAlert("请勾选一个订单");
                    return;
                }
                let req = {
                    "operator":$("#nickNameTextPanel").html(),
                    "queryType":["contactNumber","deliveryAddress","modelDetails"],
                    "clientName":orderInfo.clientName,
                    "orderNumber":orderInfo.orderNumber
                };

                Af.rest("orderInfonQueiry.api",req,function (ans) {
                    let ansData = [];
                    let thisArr = ans.data;
                    ansData = thisArr[0];
                    if(ans.errorCode==0)
                    {
                        //给打印模板传数据
                        $("#ProductionOrderName").html(orderInfo.clientName); //--->客户名称
                        $("#ProductionOrderProdyctName").html(orderInfo.projectName); //--->工程名称
                        $("#ProductionOrderOrderNum").html(orderInfo.orderNumber); //--->单号
                        $("#ProductionOrderProdyctCell").html(ansData.contactNumber); //--->联系电话
                        $("#ProductionOrderAddress").html(ansData.deliveryAddress); //--->送货地址
                        $("#ProductionOrderDate").html(orderInfo.orderDate); //--->日期
                        //$("#MerchantAddress").html();//--->当前登陆企业的地址
                        //$("#MerchantCell").html();//--->当前登陆企业电话
                        //$("#MerchantFax").html();//--->当前登陆企业传真
                        var num = 0;
                        let userInputArray = JSON.parse(ansData.modelDetails);
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
                            var tdType1 = "<td colspan='5' class='title colspans'>";
                            var tdType2 = "<td colspan='2' class='title colspans'>";
                            var dataArrayLength = Af.getJsonLength(userInputArray[i]); //---->获取当前JSONArray下的数据长度
                            if (dataArrayLength > 1) {
                                var totalAreaValue = 0;
                                num++;
                                for (let k = 0; k < dataArrayLength; k++) {
                                    let nowArea = userInputArray[i][k].glassArea;
                                    totalAreaValue = Af.accAdd(totalAreaValue, nowArea);
                                    totalAreaValue = totalAreaValue.toFixed(2);
                                }
                                $("#ProductionOrderList  tbody").append(trStart + tdType1 + "规格型号:" + userInputArray[i][0].productName +"</td>" + tdType2+ "面积(小计):" + totalAreaValue + "</td>" + trEnd);
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
                                var totalAreaValue = 0;
                                num++;
                                for (let k = 0; k < dataArrayLength; k++) { //计算每一项归类数据的面积
                                    let nowArea = userInputArray[i][k].glassArea;
                                    totalAreaValue = Af.accAdd(totalAreaValue, nowArea);
                                    totalAreaValue = totalAreaValue.toFixed(2);
                                }
                                $("#ProductionOrderList  tbody").append(trStart + tdType1 + "规格型号:" + userInputArray[i][0].productName +"</td>" + tdType2+ "面积(小计):" + totalAreaValue + "</td>" + trEnd);
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
                        //清空动态Table中tbody中的数据
                        $("#ProductionOrderList tbody").html("");
                    }
                });
                /* var tableTitle = ['订单号', '日期', '客户名称', '工程名称', '玻璃数量', '总面积', '发货数量', '发货面积', '附加费用', '总金额', '已付款', '未付款', '完成发货', '制单人'];
                var selectDatas = MAIN.getSelectDatas("orderInfoList");
                if (!Af.nullstr(selectDatas)) {
                    MAIN.exportFun(tableTitle, selectDatas);
                }*/
            }
            ,
            responsiblePersonDetailsFun: function () {
                layer.alert($("#DetailsOrderTransportationManager").val());
            }
            ,
            /*查询所有订单*/
            queryAllOrderFun:function(){
                let clientName = vm.customerReconciliationSelectVal;
                if(Af.nullstr(clientName))
                {
                    MAIN.ErroAlert("没有勾选客户不能查询!");
                    return;
                }
                let req = {
                    "clientName":clientName,
                    "operator":$("#nickNameTextPanel").html(),
                    "queryOrderInfo":"",
                    "queryType":["orderNumber","orderDate","projectName","totalAmount","glassNumber","preparedBy"]
                };
                Af.rest("customerReconciliation.api",req,function (ans) {
                    MAIN.customerReconciliationDataList(ans.data);
                });
            },
            /*订单信息管理:开始发货*/
            startShippingFun: function () {
                $("#OrderModelList  tbody").html(""); //--->清空表格数据
                /*自定义查询订单信息表:获取该用户的所有规格型号*/
                let orderNumberArr = MAIN.getSelectOrder("orderInfoList");
                let cilentNameArr = MAIN.getClientName("orderInfoList");
                if (Af.nullstr(orderNumberArr)) {
                    MAIN.ErroAlert("没有勾选订单号");
                } else if (orderNumberArr.length > 1) {
                    MAIN.ErroAlert("每次只能查询一个订单");
                } else {
                    let req = {
                        operator: $("#nickNameTextPanel").html(),
                        queryType: ["unfinishedArr"],
                        orderNumber: orderNumberArr[0]
                    };
                    Af.rest("orderInfonQueiry.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            vm.shipOrderNumber = orderNumberArr[0];
                            vm.shipClientName = cilentNameArr[0];
                            let data = ans.data;
                            let unfinishedArr = data[0].unfinishedArr;
                            if(Af.nullstr(unfinishedArr))
                            {
                                MAIN.ErroAlert("此订单异常请联系客服处理!");
                            }
                            let dataArray = JSON.parse(unfinishedArr);
                            dataArray = Af.getJSONArray(dataArray);
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
                                    td5,
                                    td6,
                                    td7,
                                    td8,
                                    td9,
                                    td10,
                                    td11,
                                    td12;
                                var tdType = "<td colspan='13' class='title'>";
                                var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                                if (dataArrayLength > 1) {
                                    num++;
                                    $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                    for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                    {
                                        td = "<td data-productName="+dataArray[i][j].productName+">" + (j + 1) + "</td>";
                                        td1 = "<td class='glassLength'>" + dataArray[i][j].glassLength + "</td>";
                                        td2 = "<td class='glassWidth'>" + dataArray[i][j].glassWidth + "</td>";
                                        td3 = "<td class='totalNum'>" + dataArray[i][j].glassNum + "</td>";
                                        td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                        td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                        td6 = "<td style='width: 120px' class='quantityInput'>" + "<input placeholder='输入整数' oninput =\"value=value.replace(/[^\\d]/g,'');if(value>" + dataArray[i][j].glassNum + "){value=" + dataArray[i][j].glassNum + "};\" class='layui-input' style=\"width:120px\">" + "</td>";
                                        td7 ="<td class='nowAmount'>" + "" + "</td>";
                                        td8 ="<td class='shipArea'>" + "" + "</td>";
                                        td9 = "<td class='shippedQuantity' data-rawData="+dataArray[i][j].shippedQuantity+">" + dataArray[i][j].shippedQuantity + "</td>";
                                        if(Af.nullstr(dataArray[i][j].shippedQuantity))
                                        {
                                            td9 = "<td class='shippedQuantity' data-rawData="+0+">" + 0 + "</td>";
                                        }
                                        td10 = "<td class='lastNum'>" + dataArray[i][j].lastNum + "</td>";
                                        if (Number(dataArray[i][j].lastNum)==0)
                                        {
                                            td10 = "<td class='lastNum' style='background:#FF5722;color: white '>" + dataArray[i][j].lastNum + "</td>";
                                        }
                                        if(Af.nullstr(dataArray[i][j].lastNum))
                                        {
                                            td10 = "<td class='lastNum'>" + dataArray[i][j].glassNum + "</td>";
                                        }
                                        td11 = "<td class='unitPrice'>" +  dataArray[i][j].unitPrice + "</td>";
                                        td12 = "<td>" +  dataArray[i][j].totalAmount + "</td>";
                                        $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + td6 + td7 + td8 + td9 + td10 + td11 +td12 + trEnd); //---->追加到页面
                                    }

                                } else {
                                    $("#OrderModelList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                    for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                    {
                                        td = "<td data-productName="+dataArray[i][j].productName+">" + (j + 1) + "</td>";
                                        td1 = "<td class='glassLength'>" + dataArray[i][j].glassLength + "</td>";
                                        td2 = "<td class='glassWidth'>" + dataArray[i][j].glassWidth + "</td>";
                                        td3 = "<td class='totalNum'>" + dataArray[i][j].glassNum + "</td>";
                                        td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                        td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                        td6 = "<td style='width: 120px' class='quantityInput'>" + "<input placeholder='输入整数' oninput =\"value=value.replace(/[^\\d]/g,'');if(value>" + dataArray[i][j].glassNum + "){value=" + dataArray[i][j].glassNum + "};\" class='layui-input' style=\"width:120px\">" + "</td>";
                                        td7 ="<td class='nowAmount'>" + "" + "</td>";
                                        td8 ="<td class='shipArea'>" + "" + "</td>";
                                        td9 = "<td class='shippedQuantity' data-rawData="+dataArray[i][j].shippedQuantity+">" + dataArray[i][j].shippedQuantity + "</td>";
                                        if(Af.nullstr(dataArray[i][j].shippedQuantity))
                                        {
                                            td9 = "<td class='shippedQuantity' data-rawData="+0+">" + 0 + "</td>";
                                        }
                                        td10 = "<td class='lastNum'>" + dataArray[i][j].lastNum + "</td>";
                                        if(Af.nullstr(dataArray[i][j].lastNum))
                                        {
                                            td10 = "<td class='lastNum'>" + dataArray[i][j].glassNum + "</td>";
                                        }
                                        if (Number(dataArray[i][j].lastNum)==0)
                                        {
                                            td10 = "<td class='lastNum' style='background:#FF5722;color: white '>" + dataArray[i][j].lastNum + "</td>";
                                        }
                                        td11 = "<td class='unitPrice'>" +  dataArray[i][j].unitPrice + "</td>";
                                        td12 = "<td>" +  dataArray[i][j].totalAmount + "</td>";
                                        $("#OrderModelList  tbody").append("<tr onclick='ModelItemOneFun(" + j + "," + i + ")' class='row_" + i + "'>" + td + td1 + td2 + td3 + td4 + td5 + td6 + td7 + td8 + td9 + td10 + td11 +td12 + trEnd); //---->追加到页面
                                    }
                                }
                            }
                            layer.open({
                                title: cilentNameArr[0] + "的订单",
                                type: 1,
                                area: ['1170px', '740px'],
                                //shadeClose : true, //点击遮罩关闭
                                content: $("#shipmentAddSubmenu"),
                                end: function () { //弹层销毁出发回调

                                }
                            });

                        } else {
                            MAIN.ErroAlert(ans.msg);
                        }
                    })
                }

            }
            ,
            /*订单信息管理:添加收入按钮交互*/
            addRevenueFun: function () {
                /*请求后台获取当前客户信息*/
                let selectVal = MAIN.getSelectData("orderInfoList");
                if (Af.nullstr(selectVal)) {
                    MAIN.ErroAlert("请勾选一个订单!");
                } else if (selectVal.length > 1) {
                    MAIN.ErroAlert("只能勾选一个订单");
                } else {
                    let clientName = selectVal[0].clientName;
                    vm.addRevenueProjectName = selectVal[0].projectName;
                    let req = {
                        "operator": $("#nickNameTextPanel").html(),
                        "clientName": clientName,
                        "dStart": "",
                        "dEnd": "",
                        conditionalQuery: "conditionalQuery"
                    };
                    Af.rest("ClientInfo.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            let data = ans.data;
                            if (data.length > 0) {
                                vm.addRevenueVlientInfo = data;
                                vm.addRevenueOrderVal = selectVal[0].orderNumber; //订单号
                                vm.addRevenueTime = ans.serverTime; //--->服务器时间
                                vm.addRevenueClientNameVal = clientName; //--->客户名称
                                vm.addRevenuePayee = data[0].clientName; //--->收款人
                                vm.addRevenueCardVal = data[0].bankCardNumber; //--->银行卡号
                                Af.openSubmenu("添加收入", ["870px", "370px"], true, $("#addRevenueSubmenu"));
                            } else {
                                layer.confirm('系统内没有录入该客户,是否需要现在录入？', {
                                    btn: ['是','否'] //按钮
                                }, function(){
                                    layer.closeAll();
                                    vm.addClientFun();
                                }, function(){
                                    layer.closeAll();
                                });
                            }
                        }
                    });
                }
            }
            ,
            /*订单信息管理:[添加收入]提交函数*/
            addRevenueSubmitFun: function () {
                if (Af.nullstr(vm.addRevenueCollectionAmount)) {
                    MAIN.ErroAlert("请输入收款金额!");
                } else {
                    let req = {
                        orderNumber: vm.addRevenueOrderVal, //--->订单号
                        addIncome: "addIncome",
                        operator: $("#nickNameTextPanel").html(),
                        incomeDate: vm.addRevenueTime, //--->收入时间
                        clientName: vm.addRevenueClientNameVal, //--->客户名称
                        paymentMethod: vm.addRevenuePaymentMethod,//--->支付方式
                        paymentAmount: vm.addRevenueCollectionAmount, //--->付款金额
                        bankCardNumber: vm.addRevenueCardVal, //--->银行卡号
                        productName: vm.addRevenueProjectName,//--->工程名称
                        payee: vm.addRevenuePayee, //--->收款人
                        bankImg: vm.addRevenueBankImg,
                        remarks: vm.addRevenueRemarks, //--->备注
                    };
                    Af.rest("IncomeInfo.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            layer.closeAll();
                            layer.msg("添加成功");
                            MAIN.orderInfoList($("#nickNameTextPanel").html());
                        }
                    });
                }


            }
            ,
            /*订单信息管理:[添加收入]取消函数*/
            addRevenueCancelFun: function () {
                layer.closeAll();
            }
            ,
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
                        req.operator = $("#nickNameTextPanel").html();
                        Af.rest("orderInfonQueiry.api", req, function (ans) {
                            var dataArray = ans.data;
                            var nowOrderInfo = ans.nowOrderInfo;
                            let ShipResult = ans.ShipResult; //--->当前订单下出货表相关信息
                            if (Af.nullstr(dataArray)) {
                                MAIN.ErroAlert("该订单下没有录入规格型号!");
                            } else {
                                $("#DetailsOrderNumber").val(nowOrderInfo[0].orderNumber);
                                $("#DetailsOrderClientName").val(nowOrderInfo[0].clientName);
                                $("#DetailsOrderProjectName").val(nowOrderInfo[0].projectName);
                                $("#DetailsOrderDate").val(nowOrderInfo[0].orderDate);
                                $("#DetailsOrderShippedQuantity").val(nowOrderInfo[0].numberShipments);
                                $("#DetailsOrderShippedArea").val(nowOrderInfo[0].shipArea);
                                /*计算未发货数量,未发货面积*/
                                let glassNumber = nowOrderInfo[0].glassNumber; //--->总数量
                                let totalArea = nowOrderInfo[0].totalArea;//---总面积
                                let numberShipments = nowOrderInfo[0].numberShipments; //--->已发货数量
                                let shipArea = nowOrderInfo[0].shipArea; //--->已发货面积
                                $("#DetailsOrderUndeliveredQuantity").val(Number(glassNumber) - Number(numberShipments));//--->未发货数量
                                $("#DetailsOrderUnshippedArea").val((Number(totalArea) - Number(shipArea)).toFixed(2));//--->未发货面积
                                $("#DetailsOrderdeliveryAddress").val(nowOrderInfo[0].deliveryAddress);
                                let transportationManagerArr = [];
                                let totalFreight = 0;
                                /*计算运输费用,计算运输负责人*/
                                for (let i = 0; i < ShipResult.length; i++) {
                                    let transportationManager = ShipResult[i].transportationManager;
                                    transportationManagerArr.push(transportationManager);
                                    let freight = ShipResult[i].freight;
                                    totalFreight = Af.accAdd(totalFreight, freight);
                                }
                                $("#DetailsOrderTransportationManager").val(transportationManagerArr);//->运输负责人
                                $("#DetailsOrderTransportationCosts").val(totalFreight);//--->运输费用
                                $("#DetailsOrderRemarks").val(nowOrderInfo[0].remarks);
                                $("#DetailsOrdertotalAmount").html(nowOrderInfo[0].totalAmount);  //--->总金额
                                $("#DetailsOrdertheTotalArea").html(nowOrderInfo[0].totalArea);  //--->总面积
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
                                        $("#orderDetailsList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                        for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                        {
                                            td = "<td>" + (j + 1) + "</td>";
                                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                            $("#orderDetailsList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                                        }

                                    } else {
                                        $("#orderDetailsList  tbody").append(trStart + tdType + "规格型号:" + dataArray[i][0].productName + "</td>" + trEnd);
                                        for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                                        {
                                            td = "<td>" + (j + 1) + "</td>";
                                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                                            $("#orderDetailsList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + trEnd); //---->追加到页面
                                        }
                                    }
                                }
                                layer.open({
                                    title: false,
                                    shadeClose: true,
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
            }
            ,
            /*订单详情:分享函数*/
            partakeFun: function () {
                let orderNumber = $("#DetailsOrderNumber").val();
                let operator = $("#nickNameTextPanel").html();
                let aes_key = "likai";
                let aes_iv = "1195419506";
                /*开始加密*/
                let orderNumber_aes = CryptoJS.AES.encrypt(orderNumber, aes_key, aes_iv);
                let operator_aes = CryptoJS.AES.encrypt(operator, aes_key, aes_iv);
                /*生成链接*/
                let links = URL + "KFOMC/MobilePage/orderDetails.html?operator=" + operator_aes + "&orderNumber=" + orderNumber_aes;
                layer.tips('链接已复制到剪切板,快去分享给朋友吧!', '#partakePanel', {
                    tips: [2, '#2F4056'],
                    time: 3000
                });
                $("#orderLinks").val(links);
                /*清理剪切板赋值*/
                // clipboard.destroy();
            }
            ,
            /*订单详情:微信分享*/
            wechatSharing: function () {
                let orderNumber = $("#DetailsOrderNumber").val();
                let operator = $("#nickNameTextPanel").html();
                let aes_key = "likai";
                let aes_iv = "1195419506";
                /*开始加密*/
                let orderNumber_aes = CryptoJS.AES.encrypt(orderNumber, aes_key, aes_iv);
                let operator_aes = CryptoJS.AES.encrypt(operator, aes_key, aes_iv);
                /*生成链接*/
                let links = URL + "KFOMC/MobilePage/orderDetails.html?operator=" + operator_aes + "&orderNumber=" + orderNumber_aes;
                /*生成二维码*/
                $("#wechatQRCodePanel img").remove();
                var qrcode = new QRCode("wechatQRCodePanel", {
                    text: links,
                    width: 320,
                    height: 320,
                    colorDark: "#003366", //--->二维码颜色
                    colorLight: "#ffffff", //--->二维码底色
                    correctLevel: QRCode.CorrectLevel.H
                });
                layer.open({
                    type: 1,
                    title: false,
                    area: '320px',
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    time: 12000,
                    content: $('#wechatQRCodePanel')
                });
                MAIN.successAlert("打开手机微信,扫描下方二维码!")
            }
            ,
            /*订单信息管理:标签打印函数*/
            labelPrintingFun: function () {
                let orders = MAIN.getSelectOrder("orderInfoList");
                if (Af.nullstr(orders)) {
                    MAIN.ErroAlert("请勾选一个订单后,再点击点击标签打印!");
                } else if (orders.length > 1) {
                    MAIN.ErroAlert("一次只能勾选一个订单进行标签打印!");
                } else {
                    layer.open({
                        title: "标签打印",
                        type: 1,
                        area: ['470px', '270px'],
                        content: $("#labelPrintingSubmenu"),
                        success: function () {
                            var req = {
                                orderNumber: orders.toString(),
                                operator: $("#nickNameTextPanel").html(),
                                queryType: ["orderNumber", "id", "modelDetails"]
                            };
                            Af.rest("orderInfonQueiry.api", req, function (ans) {
                                let data = ans.data;
                                let modelDetails = "";
                                if (data.length > 0) {
                                    for (let i = 0; i < data.length; i++) {
                                        modelDetails = data[i].modelDetails;
                                        modelDetails = JSON.parse(modelDetails); //--->字符串转JSON
                                    }
                                }
                                /*多维数组转一维数组*/
                                let modelDetaArr = [];
                                arrayConversion(modelDetails);
                                /*数据精确合并*/
                                vm.labelFinalData = Af.preciseMerger(modelDetaArr);

                                //多维数组转一维数组函数
                                function arrayConversion(arr) {
                                    for (var i = 0; i < arr.length; i++) {
                                        if (Array.isArray(arr[i])) {
                                            arrayConversion(arr[i]);
                                        } else {
                                            modelDetaArr.push(arr[i]);
                                        }
                                    }
                                }
                            });
                        },
                        btn: ['打印', '取消'],
                        skin: 'btn-Color',
                        yes: function (index, layero) {
                            /*获取当前选择的单选框数值*/
                            let nowRadioVal = vm.labelRadio;
                            nowRadioVal = parseInt(nowRadioVal);
                            if (Af.nullstr(nowRadioVal)) {
                                MAIN.ErroAlert("请勾选一个标签纸尺寸!");
                            } else {
                                /*加载动画显示*/
                                $("#loading").css({"display": "block"});
                                let print_panel = $("#print-panel");
                                let secondPrint_panel = $("#secondPrint-panel");
                                let item_panel = "<div class='item-panel'>";
                                let row_panel = "<div class='row-panel'>";
                                let serialNumber_panel = "<div class='serialNumber-panel'>";
                                let mark_panel = "<div class='mark-panel'>";
                                let qrCode_panel = "<div class='qrCode-panel'>";
                                let img_panel = "<img src=\"https://www.kaisir.cn/webPic/qrCode/TestqrCode.jpg\" alt=\"\">";
                                let span_start = "<span>";
                                let productName_panel = "<div class='productName-panel'>";
                                let sizeQuantity_panel = "<div class='sizeQuantity-panel'>";
                                let div_end = "</div>";
                                let span_end = "</span>";
                                let finalData = vm.labelFinalData;
                                switch (nowRadioVal) {
                                    case 1:
                                        for (let i = 0; i < finalData.length; i++) {
                                            let glassNum = finalData[i].glassNum;
                                            glassNum = Number(glassNum);
                                            let glassMark = finalData[i].glassMark;
                                            let productName = finalData[i].productName;
                                            let itemId = i + 1;
                                            let glassLength = finalData[i].glassLength;
                                            let glassWidth = finalData[i].glassWidth;
                                            let sizeQuantity = glassLength + "x" + glassWidth + "=" + glassNum;
                                            for (let j = 0; j < glassNum; j++) {
                                                print_panel.append(item_panel + row_panel + serialNumber_panel + span_start + itemId + span_end + div_end + mark_panel + span_start + glassMark + span_end + div_end + div_end + productName_panel + span_start + productName + span_end + div_end + sizeQuantity_panel + span_start + sizeQuantity + span_end + div_end + div_end);
                                            }
                                        }
                                        /*开始打印*/
                                        $("#print-panel").css({
                                            "display": "block"
                                        });
                                        setTimeout(function () {
                                            $("#print-panel").css({
                                                "display": "none"
                                            });
                                            $("#loading").css({"display": "none"});
                                        }, 400);
                                        $("#print-panel").jqprint({}); //---->打印函数
                                        print_panel.html("");
                                        break;
                                    case 2:
                                        /*加载动画显示*/
                                        for (let i = 0; i < finalData.length; i++) {
                                            let glassNum = finalData[i].glassNum;
                                            glassNum = Number(glassNum);
                                            let glassMark = finalData[i].glassMark;
                                            let productName = finalData[i].productName;
                                            let itemId = i + 1;
                                            let glassLength = finalData[i].glassLength;
                                            let glassWidth = finalData[i].glassWidth;
                                            let sizeQuantity = glassLength + "x" + glassWidth + "=" + glassNum;
                                            for (let j = 0; j < glassNum; j++) {
                                                secondPrint_panel.append(item_panel + row_panel + serialNumber_panel + span_start + itemId + span_end + div_end + mark_panel + span_start + glassMark + span_end + div_end + qrCode_panel + img_panel + div_end + div_end + productName_panel + span_start + productName + span_end + div_end + sizeQuantity_panel + span_start + sizeQuantity + span_end + div_end + div_end);
                                            }
                                        }
                                        /*开始打印*/
                                        $("#secondPrint-panel").css({
                                            "display": "block"
                                        });
                                        setTimeout(function () {
                                            $("#secondPrint-panel").css({
                                                "display": "none"
                                            });
                                            $("#loading").css({"display": "none"});
                                        }, 400);
                                        $("#secondPrint-panel").jqprint({}); //---->打印函数
                                        secondPrint_panel.html("");
                                        break;
                                    default:
                                        MAIN.ErroAlert("内部错误:程序没有规定当前选择!");
                                        secondPrint_panel.html("");
                                }
                            }
                        },
                        btn2: function (index, layero) {
                            layer.close(index);
                        },
                        end: function () { //弹层销毁出发回调

                        }
                    });
                }
            }
            ,
            /*已完成订单点击事件*/
            OrderMonthlyFun: function () {
                this.OrderMonthStatus = "block";
                setTimeout(function () {
                    /*渲染已完成订单数据表格*/
                    let req = {
                        operator: $("#nickNameTextPanel").html(),
                        orderCompleted: true,
                    };
                    Af.rest("orderInfonQueiry.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            MAIN.OrderMonthList(ans.data);
                            vm.orderCompletedRawData = ans.data;
                        } else {
                            layer.msg(ans.msg);
                        }
                    });
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*已完成订单查询函数*/
            orderCompletedQueryFun: function () {
                vm.loadingStatus = "block";
                let data = vm.orderCompletedSelectData;
                let rawData = vm.orderCompletedRawData;
                if (Af.nullstr(data)) {
                    MAIN.OrderMonthList(rawData);
                    vm.loadingStatus = "none";
                } else {
                    let finalData = [];
                    for (let i = 0; i < rawData.length; i++) {
                        let rawClientName = rawData[i].clientName;
                        if (rawClientName == data) {
                            finalData.push(rawData[i]);
                        }
                    }
                    MAIN.OrderMonthList(finalData);
                    vm.orderCompletedSelectData = "";
                    vm.loadingStatus = "none";
                }
            }
            ,
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
                this.SupplierInfoStatus = "none";
            }
            ,
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
            }
            ,
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
            }
            ,
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
            }
            ,

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
                    success: function () {
                        for (let i = 0; i < datasArray.length; i++) {
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
                            clientId: vm.clientId
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
            }
            ,
            /*财务管理:收入管理点击事件*/
            revenueInfoFun: function () {
                this.revenueInfoStatus = "block";
                setTimeout(function () {
                    /*渲染订单月结管理数据表格*/
                    MAIN.revenueInfoList($("#nickNameTextPanel").html());
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*财务管理：支出管理点击事件*/
            expenditureInfoLFun: function () {
                this.expenditureInfoStatus = "block";
                setTimeout(function () {

                    MAIN.expenditureInfoList($("#nickNameTextPanel").html());
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*财务管理[收入管理]查询*/
            revenueQueryFun:function(){
                vm.loadingStatus = "block";
                var req = {};
                req.dStart = this.RevenueManagementStart;
                req.clientName = "";
                req.dEnd = this.RevenueManagementEnd;
                req.conditionalQuery = "conditionalQuery";
                req.operator = $("#nickNameTextPanel").html();
                if (Af.nullstr(req.dStart) || Af.nullstr(req.dEnd) || Af.nullstr(req.operator)) {
                    MAIN.ErroAlert("请选择查询条件");
                    vm.loadingStatus = "none";
                } else {
                    Af.rest("IncomeInfo.api", req, function (ans) {
                        MAIN.revenueInfoDataList(ans.data);
                        vm.loadingStatus = "none";
                    })
                }
            },
            /*财务管理[收入管理]添加其他收入项*/
            revenueAddFun:function(){
                Af.openSubmenu("其他收入",["520px","220px"],true,$("#addOtherRevenueSubmenu"));
            },
            //提交
            revenueSubmitFun:function(){
                let req = {
                    "orderNumber":"",
                    "clientName":vm.OtherRevenueClientName,
                    "paymentMethod":"",
                    "bankCardNumber":"",
                    "incomeDate":"",
                    "productName":"",
                    "bankImg":"",
                    "payee":vm.OtherRevenuePayee,
                    "paymentAmount":vm.OtherRevenueAmount,
                    "remarks":vm.OtherRevenueAmountRemarks,
                    "addIncome":"addIncome",
                    "operator":$("#nickNameTextPanel").html()
                };
                if(Af.nullstr(req.clientName)||Af.nullstr(req.payee)||Af.nullstr(req.paymentAmount))
                {
                    MAIN.ErroAlert("客户名称,收款人,收款金额,为必填项!");
                }
                else
                {
                    req.paymentAmount = Number(req.paymentAmount);
                    if(isNaN(req.paymentAmount))
                    {
                        MAIN.ErroAlert("收款金额,必须为有效的数字!");
                        return;
                    }
                    Af.rest("IncomeInfo.api",req,function(ans){
                        if(ans.errorCode==0)
                        {
                            layer.closeAll();
                            MAIN.revenueInfoList($("#nickNameTextPanel").html());
                            layer.msg("添加成功");
                        }
                        else {
                            MAIN.ErroAlert(ans.msg);
                        }
                    });
                }
            },
            //取消
            revenueCancelFun:function(){
                layer.closeAll();
            },
            /*财务管理[收入管理]编辑*/
            revenueEditFun:function(){
                let rowData = MAIN.getTableRowData("revenueInfoList");
                if(rowData.length==1)
                {
                    Af.openSubmenu("收入信息修改",["720px","310px"],true,$("#revenueEditSubmenu"));
                    let thisObj = rowData[0];
                    vm.EditRevenueClientName = thisObj.clientName;
                    vm.EditRevenueProjuctName = thisObj.productName;
                    vm.EditRevenuePayMethod = thisObj.paymentMethod;
                    vm.EditRevenueCaedNum = thisObj.bankCardNumber;
                    vm.EditRevenuePayAmount = thisObj.paymentAmount;
                    vm.EditRevenuePayee = thisObj.payee;
                    vm.EditRevenueRemarks = thisObj.remarks;
                }
                else
                {
                    MAIN.ErroAlert("必须勾选一条收入信息!");
                }
            },
            //提交
            revenueEditSubmitFun:function(){
                let rowData = MAIN.getTableRowData("revenueInfoList");
                let req = {
                    "id":rowData[0].id,
                    "operator":$("#nickNameTextPanel").html(),
                    "updateSalary":"updateSalary",
                    "orderNumber":"",
                    "incomeDate":"",
                    "clientName":vm.EditRevenueClientName,
                    "productName":vm.EditRevenueProjuctName,
                    "paymentMethod":vm.EditRevenuePayMethod,
                    "bankCardNumber": vm.EditRevenueCaedNum,
                    "paymentAmount":vm.EditRevenuePayAmount,
                    "payee":vm.EditRevenuePayee ,
                    "remarks": vm.EditRevenueRemarks
                };
                req.paymentAmount = Number(req.paymentAmount);
                if(isNaN(req.paymentAmount))
                {
                    MAIN.ErroAlert("收款金额,必须为有效的数字!");
                    return;
                }
                Af.rest("IncomeInfo.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        MAIN.revenueInfoList($("#nickNameTextPanel").html());
                        layer.msg("更新成功");
                    }
                    else {
                        MAIN.ErroAlert(ans.msg);
                    }
                });
            },
            //取消
            revenueEditCancelFun:function(){
                layer.closeAll();
            },
            /*财务管理[收入管理]删除*/
            revenueDelFun:function(){
                let idsArray = MAIN.getSelectId("revenueInfoList");
                if(idsArray.length<1)
                {
                    MAIN.ErroAlert("没有勾选收入条目!");
                    return;
                }
                layer.confirm('确定要删除吗?', function (index) {
                    let idsStr = idsArray.toString();
                    let req= {};
                    req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                    req.operator = $("#nickNameTextPanel").html();
                    req.delSalary = "delSalary";
                    Af.rest("IncomeInfo.api", req, function (ans) {
                        layer.close(index);
                        layer.msg(ans.msg);
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.revenueInfoList($("#nickNameTextPanel").html());
                        }
                    });
                });
            },
            /*财务管理[支出管理]查询*/
            payQueryFun:function(){
                vm.loadingStatus = "block";
                var req = {};
                req.dStart = this.payStart;
                req.dEnd = this.payEnd;
                req.conditionalQuery = "conditionalQuery";
                req.operator = $("#nickNameTextPanel").html();
                if (Af.nullstr(req.dStart) || Af.nullstr(req.dEnd) || Af.nullstr(req.operator)) {
                    MAIN.ErroAlert("请选择查询条件");
                    vm.loadingStatus = "none";
                } else {
                    Af.rest("OutlayInfo.api", req, function (ans) {
                        MAIN.expenditureInfoDataList(ans.data);
                        vm.loadingStatus = "none";
                    })
                }
            },
            /*财务管理[支出管理]添加*/
            payAddFun:function(){
                Af.openSubmenu("添加其他支出",["530px","260px"],true,$("#payAddSubmenu"));
            },
            //提交
            payAddSubmitFun:function(){
                let req = {
                    "orderNumber":"",
                    "outlayDate":"",
                    "outlayType":vm.payAddOutlayType,
                    "paymentMethod":vm.payAddPaymentMethod,
                    "paymentAmount":vm.payAddPaymentAmount,
                    "remarks":vm.payAddRemarks,
                    "beneficiary":vm.payAddBeneficiary,
                    "bankImg":"",
                    "addOutlay":"",
                    "operator":$("#nickNameTextPanel").html()
                };
                req.paymentAmount = Number(req.paymentAmount);
                if(Af.nullstr(req.outlayType)||Af.nullstr(req.paymentMethod)||Af.nullstr(req.paymentAmount)||Af.nullstr(req.beneficiary))
                {
                    MAIN.ErroAlert("(支出类别,付款方式,付款金额,收款人)为必填项!");
                    return;
                }
                if(isNaN(req.paymentAmount))
                {
                    MAIN.ErroAlert("收款金额,必须为有效的数字!");
                    return;
                }
                Af.rest("OutlayInfo.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        MAIN.expenditureInfoList($("#nickNameTextPanel").html());
                        layer.msg("添加成功!");
                        vm.payAddOutlayType = "";
                        vm.payAddPaymentMethod = "";
                        vm.payAddPaymentAmount = "";
                        vm.payAddRemarks = "";
                        vm.payAddBeneficiary ="";
                    }else{
                        layer.msg(ans.msg);
                    }
                })
            },
            //取消
            payAddCancelFun:function(){
                layer.closeAll();
            },
            /*财务管理[支出管理]编辑*/
            payEditFun:function(){
                let thisRowData = MAIN.getTableRowData("expenditureInfoList");
                let thisObjData = thisRowData[0];
                if(thisRowData.length!=1)
                {
                    MAIN.ErroAlert("(必须)只能勾选一个订单!");
                    return;
                }
                Af.openSubmenu("编辑支出信息",["730px","270px"],true,$("#payEditSubmenu"));
                vm.payEditOutlayType = thisObjData.outlayType;
                vm.payEditPaymentMethod = thisObjData.paymentMethod;
                vm.payEditPaymentAmount = thisObjData.paymentAmount;
                vm.payEditSupperName = thisObjData.supperName;
                vm.payEditBeneficiary = thisObjData.beneficiary;
                vm.payEditRemarks = thisObjData.remarks;
            },
            //提交
            payEditSubmitFun:function(){
                let thisRowData = MAIN.getTableRowData("expenditureInfoList");
                let thisObjData = thisRowData[0];
                /*请求后台开始更新*/
                let req = {
                    "id":thisObjData.id,
                    "updateSalary":"",
                    "orderNumber":"",
                    "outlayDate":"",
                    "outlayType":vm.payEditOutlayType,
                    "paymentMethod":vm.payEditPaymentMethod,
                    "paymentAmount":vm.payEditPaymentAmount,
                    "remarks":vm.payEditRemarks,
                    "beneficiary":vm.payEditBeneficiary,
                    "supperName":vm.payEditSupperName,
                    "bankImg":"",
                    "operator":$("#nickNameTextPanel").html()
                };
                req.paymentAmount = Number(req.paymentAmount);
                if(isNaN(req.paymentAmount))
                {
                    MAIN.ErroAlert("收款金额,必须为有效的数字!");
                    Af.trace(req);
                    return;
                }
                Af.rest("OutlayInfo.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        layer.msg("更新成功");
                        MAIN.expenditureInfoList($("#nickNameTextPanel").html());
                    }
                    else{
                        MAIN.ErroAlert(ans.msg);
                    }
                })
            },
            //取消
            payEditCancelFun:function(){
                layer.closeAll();
            },
            /*财务管理[支出管理]删除*/
            payDelFun:function(){
                let idsArray = MAIN.getSelectId("expenditureInfoList");
                if(idsArray.length<1)
                {
                    MAIN.ErroAlert("没有勾选收入条目!");
                    return;
                }
                layer.confirm('确定要删除吗?', function (index) {
                    let idsStr = idsArray.toString();
                    let req= {};
                    req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                    req.operator = $("#nickNameTextPanel").html();
                    req.delSalary = "delSalary";
                    Af.rest("OutlayInfo.api", req, function (ans) {
                        layer.close(index);
                        layer.msg(ans.msg);
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.expenditureInfoList($("#nickNameTextPanel").html());
                        }
                    });
                });
            },
            /*财务管理[财务报表]*/

            /*财务管理[客户对账]点击事件*/
            reconciliationFun: function () {
                this.customerReconciliationStatus = "block";
                setTimeout(function () {
                    MAIN.customerReconciliationList($("#nickNameTextPanel").html());

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
                this.SupplierInfoStatus = "none";
            }
            ,
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*员工管理[考勤管理]查询事件*/
            QueryAttendanceFun: function () {
                if (Af.nullstr(vm.AttendanceDivision)&&Af.nullstr(vm.AttendanceNameOfWorker)&&Af.nullstr(vm.AttendanceJobNumber)) {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                var req = {};
                vm.loadingStatus = "block";
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.division = vm.AttendanceDivision;
                req.nameOfWorker = vm.AttendanceNameOfWorker;
                req.jobNumber = vm.AttendanceJobNumber;
                Af.rest("AttendanceInfo.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        layer.msg(ans.msg);
                        vm.loadingStatus = "none";
                    } else {
                        MAIN.AttendanceInfoDataList(ans.data);
                        vm.loadingStatus = "none";
                    }
                });
            }
            ,
            /*员工管理[考勤管理]编辑事件*/
            EditAttendanceFun:function(){
                let thisRowData = MAIN.getTableRowData("AttendanceInfoList");
                let thisObj = thisRowData[0];
                if(thisRowData.length!=1)
                {
                    MAIN.ErroAlert("(必须)只能勾选一条考勤信息!");
                }else{
                    Af.trace(thisObj);
                    Af.openSubmenu("编辑考勤信息",["820px","330px"],true,$("#EditAttendanceSubmenu"));
                    vm.EditAttendanceName=thisObj.nameOfWorker;
                    vm.EditAttendanceJobNumber=thisObj.jobNumber;
                    vm.EditAttendanceDivision=thisObj.division;
                    vm.EditAttendanceAskForLeaveDays=thisObj.askForLeaveDays;
                    vm.EditAttendanceLeaveDays=thisObj.leaveDays;
                    vm.EditAttendanceSickLeaveDays=thisObj.sickLeaveDays;
                    vm.EditAttendanceActualAttendanceDays=thisObj.actualAttendanceDays;
                    vm.EditAttendanceDaysToAttend=thisObj.daysToAttend;
                }
            },
            //提交
            EditAttendanceSubmitFun:function(){
                let thisRowData = MAIN.getTableRowData("AttendanceInfoList");
                let thisObj = thisRowData[0];
                let req = {
                    "nameOfWorker": vm.EditAttendanceName,
                    "jobNumber": vm.EditAttendanceJobNumber,
                    "division":vm.EditAttendanceDivision,
                    "askForLeaveDays":vm.EditAttendanceAskForLeaveDays,
                    "leaveDays":vm.EditAttendanceLeaveDays,
                    "sickLeaveDays":vm.EditAttendanceSickLeaveDays,
                    "actualAttendanceDays":vm.EditAttendanceActualAttendanceDays,
                    "daysToAttend":vm.EditAttendanceDaysToAttend,
                    "operator":$("#nickNameTextPanel").html(),
                    "updateAttendance":"",
                    "id":thisObj.id
                };
                Af.rest("AttendanceInfo.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        layer.msg("更新成功");
                        MAIN.AttendanceInfoList($("#nickNameTextPanel").html());

                    }else{
                        layer.msg(ans.msg);
                    }
                })
            },
            //取消
            EditAttendanceCancelFun:function(){
                layer.closeAll();
            },
            /*员工管理[考勤管理]删除事件*/
            delAttendanceFun:function(){
                let idsArray = MAIN.getSelectId("AttendanceInfoList");
                if(idsArray.length<1)
                {
                    MAIN.ErroAlert("没有勾选收入条目!");
                    return;
                }
                layer.confirm('确定要删除吗?', function (index) {
                    let idsStr = idsArray.toString();
                    let req= {};
                    req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                    req.operator = $("#nickNameTextPanel").html();
                    req.delAttendance = "delAttendance";
                    Af.rest("AttendanceInfo.api", req, function (ans) {
                        layer.close(index);
                        layer.msg(ans.msg);
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.AttendanceInfoList($("#nickNameTextPanel").html());
                        }
                    });
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*员工管理[工资发放]查询事件*/
            salaryQueryFun: function () {
                if (Af.nullstr(vm.SalaryInfoDivisionVal)&&Af.nullstr(vm.SalaryInfoNameVal)&&Af.nullstr(vm.SalaryInfoJobNumberVal)) {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                vm.loadingStatus = "block";
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.position = this.SalaryInfoDivisionVal;
                req.nameOfWorker = this.SalaryInfoNameVal;
                req.jobNumber = this.SalaryInfoJobNumberVal;
                Af.rest("SalaryInfo.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        layer.msg(ans.msg);
                        vm.loadingStatus = "none";
                    } else {
                        MAIN.salaryGivingDataList(ans.data);
                        vm.loadingStatus = "none";
                    }
                });
            }
            ,
            /*员工管理[工资发放]新增事件*/
            salaryAddFun:function(){
                Af.openSubmenu("工资发放",["760px","370px"],true,$("#salaryAddSubmenu"));
                let queryType = ["nameOfWorker","jobNumber","department","basicWage"];
                let req = {
                    "operator":$("#nickNameTextPanel").html(),
                    "queryType":queryType,
                };
                Af.rest("EmployeeInfo.api",req,function (ans) {
                    //清空select中除第一个以外的选项
                    $("#salaryAddNameOfWorker option:gt(0)").remove();
                    vm.salaryGivingStaffData = ans.data;
                    renderEmployeeNameFun();
                    /*渲染员工姓名*/
                    function renderEmployeeNameFun() {
                        var data = ans.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].nameOfWorker;
                            nowData.push(temporaryData);
                        }
                        MAIN.addSelectVal(nowData, "salaryAddNameOfWorker");
                    }
                });
            },
            //提交
            salaryAddSubmitFun:function(){
                let req = {
                    "addSalary":"",
                    "operator":$("#nickNameTextPanel").html(),
                    "nameOfWorker":$("#salaryAddNameOfWorker").find("option:selected").text(),
                    "jobNumber":vm.salaryAddJobNumber,
                    "position":vm.salaryAddDepartment,
                    "basicWage":vm.salaryAddBasicWage,
                    "jobSubsidy":vm.salaryAddJobSubsidy,
                    "payable":vm.salaryAddPayable,
                    "attendanceDeduction":vm.salaryAddAttendanceDeduction,
                    "realWage":vm.salaryAddRealWage,
                    "personalIncomeTax":vm.salaryAddPersonalIncomeTax,
                    "remarks":vm.salaryAddRemark
                };
                req.basicWage = Number(req.basicWage);
                req.jobSubsidy = Number(req.jobSubsidy);
                req.payable = Number(req.payable);
                req.attendanceDeduction = Number(req.attendanceDeduction);
                req.personalIncomeTax = Number(req.personalIncomeTax);
                req.realWage =Number(req.realWage);
                if(isNaN(req.basicWage))
                {
                    MAIN.ErroAlert("基本工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.jobSubsidy))
                {
                    MAIN.ErroAlert("岗位补贴,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.payable))
                {
                    MAIN.ErroAlert("应发工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.attendanceDeduction))
                {
                    MAIN.ErroAlert("考勤扣款,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.realWage))
                {
                    MAIN.ErroAlert("实发工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.personalIncomeTax))
                {
                    MAIN.ErroAlert("个人所得税,必须为有效的数字!");
                    return;
                }
                Af.rest("SalaryInfo.api",req,function(ans){
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        MAIN.salaryGivingList($("#nickNameTextPanel").html());
                        layer.msg("添加成功");
                    }else{
                        layer.msg(ans.msg);
                    }
                })
            },
            //取消
            salaryAddCancelFun:function(){
                layer.closeAll();
            },
            /*员工管理[工资发放]编辑事件*/
            salaryEditFun:function(){
                let thisRowData = MAIN.getTableRowData("salaryGivingList");
                let thisObj = thisRowData[0];
                if(thisRowData.length==1)
                {
                    Af.openSubmenu("编辑工资信息",["630px","320px"],true,$("#salaryEditSubmenu"));
                    if(thisObj.hasOwnProperty("nameOfWorker"))
                    {
                        vm.salaryEditNameOfWorker = thisObj.nameOfWorker;
                    }
                    if(thisObj.hasOwnProperty("jobNumber"))
                    {
                        vm.salaryEditEmployeeNumber = thisObj.jobNumber;
                    }
                    if(thisObj.hasOwnProperty("basicWage"))
                    {
                        vm.salaryEditBasicWage = thisObj.basicWage;
                    }
                    if(thisObj.hasOwnProperty("jobSubsidy"))
                    {
                        vm.salaryEditJobSubsidy = thisObj.jobSubsidy;
                    }
                    if(thisObj.hasOwnProperty("payable"))
                    {
                        vm.salaryEditPayable = thisObj.payable;
                    }
                    if(thisObj.hasOwnProperty("attendanceDeduction"))
                    {
                        vm.salaryEditAttendanceDeduction = thisObj.attendanceDeduction;
                    }
                    if(thisObj.hasOwnProperty("realWage"))
                    {
                        vm.salaryEditRealWage = thisObj.realWage;
                    }
                    if(thisObj.hasOwnProperty("personalIncomeTax"))
                    {
                        vm.salaryEditPersonalIncomeTax = thisObj.personalIncomeTax;
                    }
                }else{
                    MAIN.ErroAlert("只能勾选一条信息进行编辑!");
                }
            },
            //提交
            salaryEditSubmitFun:function(){
                let thisRowData = MAIN.getTableRowData("salaryGivingList");
                let thisObj = thisRowData[0];
                let req = {
                    "id": thisObj.id,
                    "operator":$("#nickNameTextPanel").html(),
                    "updateSalary":"",
                    "nameOfWorker":vm.salaryEditNameOfWorker,
                    "jobNumber":vm.salaryEditEmployeeNumber,
                    "position":"",
                    "basicWage":vm.salaryEditBasicWage,
                    "jobSubsidy":vm.salaryEditJobSubsidy,
                    "payable":vm.salaryEditPayable,
                    "attendanceDeduction":vm.salaryEditAttendanceDeduction,
                    "personalIncomeTax":vm.salaryEditPersonalIncomeTax,
                    "realWage":vm.salaryEditRealWage,
                    "remarks":""
                };
                req.basicWage = Number(req.basicWage);
                req.jobSubsidy = Number(req.jobSubsidy);
                req.payable = Number(req.payable);
                req.attendanceDeduction = Number(req.attendanceDeduction);
                req.personalIncomeTax = Number(req.personalIncomeTax);
                req.realWage =Number(req.realWage);
                if(isNaN(req.basicWage))
                {
                    MAIN.ErroAlert("基本工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.jobSubsidy))
                {
                    MAIN.ErroAlert("岗位补贴,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.payable))
                {
                    MAIN.ErroAlert("应发工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.attendanceDeduction))
                {
                    MAIN.ErroAlert("考勤扣款,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.realWage))
                {
                    MAIN.ErroAlert("实发工资,必须为有效的数字!");
                    return;
                }
                if(isNaN(req.personalIncomeTax))
                {
                    MAIN.ErroAlert("个人所得税,必须为有效的数字!");
                    return;
                }
                Af.rest("SalaryInfo.api",req,function(ans){
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        MAIN.salaryGivingList($("#nickNameTextPanel").html());
                        layer.msg("更新成功");
                    }
                    else{
                        MAIN.ErroAlert(ans.msg);
                    }
                });

            },
            //取消
            salaryEditCancelFun:function(){
                layer.closeAll();
            },
            /*员工管理[工资发放]删除事件*/
            salaryDelFun:function(){
                let idsArray = MAIN.getSelectId("salaryGivingList");
                if(idsArray.length<1)
                {
                    MAIN.ErroAlert("没有勾选工资信息条目!");
                    return;
                }
                layer.confirm('确定要删除吗?', function (index) {
                    let idsStr = idsArray.toString();
                    let req= {};
                    req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                    req.operator = $("#nickNameTextPanel").html();
                    req.delSalary = "delSalary";
                    Af.rest("SalaryInfo.api", req, function (ans) {
                        layer.close(index);
                        layer.msg(ans.msg);
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.salaryGivingList($("#nickNameTextPanel").html());
                        }
                    });
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*员工管理[员工信息]查询点击事件*/
            employeeQueryFun: function () {
                if (Af.nullstr(vm.EmployeeDivisionVal)&&Af.nullstr(vm.EmployeeNameVal)&&Af.nullstr(vm.EmployeejobNumberVal)) {
                    MAIN.ErroAlert("不能查询空数据,请选择一个条件!");
                    return;
                }
                vm.loadingStatus = "block";
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.conditionalQuery = "conditionalQuery";
                req.department = vm.EmployeeDivisionVal;
                req.nameOfWorker = vm.EmployeeNameVal;
                req.jobNumber = vm.EmployeejobNumberVal;
                Af.rest("EmployeeInfo.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        layer.msg(ans.msg);
                        vm.loadingStatus = "none";
                    } else {
                        MAIN.employeeInfoDataList(ans.data);
                        vm.loadingStatus = "none";
                    }
                });
            },
            /*员工管理[员工信息]新增点击事件*/
            employeeAddFun:function(){
                Af.openSubmenu("添加员工",["660px","320px"],true,$("#employeeAddSubmenu"))
            },
            //提交
            employeeAddSubmitFun:function(){
                let req = {
                    "nameOfWorker":vm.employeeAddName,
                    "phoneNumber":vm.employeeAddPhoneNumber,
                    "jobNumber":vm.employeeAddJobNumber,
                    "department":vm.employeeAddDivision,
                    "position":vm.employeeAddPosition,
                    "basicWage":vm.employeeAddBasicWage,
                    "dateOfBirth":$("#employeeAddBornDate").val(),
                    "dateOfEntry":$("#employeeAddDateOfEntryDate").val(),
                    "remarks":"",
                    "operator":$("#nickNameTextPanel").html(),
                    "addTime":"",
                    "addSalary":""
                };
                req.basicWage = Number(req.basicWage);
                if(isNaN(req.basicWage))
                {
                    MAIN.ErroAlert("基本工资,必须为有效的数字!");
                    return;
                }
                Af.rest("EmployeeInfo.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        layer.msg("添加成功");
                        MAIN.employeeInfoList($("#nickNameTextPanel").html());
                    }
                    else{
                        MAIN.ErroAlert(ans.msg);
                    }
                })
            },
            //取消
            employeeAddCancelFun:function(){
                layer.closeAll();
            },
            /*员工管理[员工信息]删除点击事件*/
            employeeDelFun:function(){
                let idsArray = MAIN.getSelectId("employeeInfoList");
                if(idsArray.length<1)
                {
                    MAIN.ErroAlert("没有勾选员工信息条目!");
                    return;
                }
                layer.confirm('确定要删除吗?', function (index) {
                    let idsStr = idsArray.toString();
                    let req= {};
                    req.ids = Af.strToIntArr(idsStr); //将String字符串转int数组
                    req.operator = $("#nickNameTextPanel").html();
                    req.delSalary = "delSalary";
                    Af.rest("EmployeeInfo.api", req, function (ans) {
                        layer.close(index);
                        layer.msg(ans.msg);
                        if (ans.errorCode == 0) {
                            //数据表格重载
                            MAIN.employeeInfoList($("#nickNameTextPanel").html());
                        }
                    });
                });
            },
            /*员工管理[员工信息]编辑点击事件*/
            employeeEditFun:function(){
                let thisRowData = MAIN.getTableRowData("employeeInfoList");
                if(thisRowData.length==1)
                {
                    let thisObj = thisRowData[0];
                    Af.openSubmenu("修改员工信息",["660px","320px"],true,$("#employeeEditSubmenu"));
                    if(thisObj.hasOwnProperty("nameOfWorker"))
                    {
                        vm.employeeEditName = thisObj.nameOfWorker;
                    }
                    if(thisObj.hasOwnProperty("jobNumber"))
                    {
                        vm.employeeEditJobNumber=thisObj.jobNumber;
                    }
                    if(thisObj.hasOwnProperty("department"))
                    {
                        vm.employeeEditDivision=thisObj.department;
                    }
                    if(thisObj.hasOwnProperty("position"))
                    {
                        vm.employeeEditPosition=thisObj.position;
                    }
                    if(thisObj.hasOwnProperty("basicWage"))
                    {
                        vm.employeeEditBasicWage=thisObj.basicWage;
                    }
                    if(thisObj.hasOwnProperty("phoneNumber"))
                    {
                        vm.employeeEditPhoneNumber=thisObj.phoneNumber;
                    }
                    if(thisObj.hasOwnProperty("dateOfBirth"))
                    {
                        $("#employeeEditBornDate").val(thisObj.dateOfBirth);
                    }
                    if(thisObj.hasOwnProperty("dateOfEntry"))
                    {
                        $("#employeeEditDateOfEntryDate").val(thisObj.dateOfEntry);
                    }
                }
                else {
                    MAIN.ErroAlert("只能勾选一条员工信息进行编辑!");
                }
            },
            //提交
            employeeEditSubmitFun:function(){
                let thisRowData = MAIN.getTableRowData("employeeInfoList");
                let thisObj = thisRowData[0];
                let req = {
                    "id":thisObj.id,
                    "nameOfWorker":vm.employeeEditName,
                    "jobNumber":vm.employeeEditJobNumber,
                    "department":vm.employeeEditDivision,
                    "position":vm.employeeEditPosition,
                    "basicWage":vm.employeeEditBasicWage,
                    "phoneNumber":vm.employeeEditPhoneNumber,
                    "dateOfBirth":$("#employeeEditBornDate").val(),
                    "dateOfEntry":$("#employeeEditDateOfEntryDate").val(),
                    "operator":$("#nickNameTextPanel").html(),
                    "updateSalary":"",
                    "remarks":""
                };
                req.basicWage = Number(req.basicWage);
                if(isNaN(req.basicWage))
                {
                    MAIN.ErroAlert("基本工资,必须为有效的数字!");
                    return;
                }
                Af.rest("EmployeeInfo.api",req,function(ans){
                    if(ans.errorCode==0)
                    {
                        layer.closeAll();
                        MAIN.employeeInfoList($("#nickNameTextPanel").html());
                        layer.msg("更新成功");
                    }
                    else{
                        MAIN.ErroAlert(ans.msg);
                    }
                })
            },
            //取消
            employeeEditCancelFun:function(){
                layer.closeAll();
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*基础信息[原片信息]查询事件*/
            productNameQueryFun: function () {
                if (Af.nullstr(this.originalInformationProductName)) {
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
                Af.rest("productNameModelInquiry.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        layer.msg(ans.msg);
                    } else {
                        MAIN.OriginalInfoDataList(ans.data);
                    }
                });
            }
            ,
            /*基础信息[原片信息]新增事件*/
            addProductFun: function (status) {
                layer.open({
                    title: "新增原片信息",
                    type: 1,
                    area: ['520px', '460px'],
                    content: $("#addProductSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.productNameVal) || Af.nullstr(vm.originalFilmUnitPriceVal) || Af.nullstr(vm.productLength) || Af.nullstr(vm.productWidth)) {
                            MAIN.ErroAlert("产品名称|单价|规格型号|为必填项!");
                            return;
                        }
                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            addProduct: "addProduct",
                            productName: vm.productNameVal,
                            color: vm.productColor,
                            unitPrice: Number(vm.originalFilmUnitPriceVal),
                            wholesalePrice: Number(vm.originalFilmWholesalePriceVal),
                            length: vm.productLength,
                            width: vm.productWidth,
                            area: (vm.productLength * vm.productWidth) / 1000000,
                            remarks: vm.originalFilmRemarksVals
                        };
                        if(isNaN(req.unitPrice)||isNaN(req.wholesalePrice)||isNaN(req.area))
                        {
                            MAIN.ErroAlert("单价,折扣价,规格型号不能有英文或中文出现!");
                            return;
                        }
                        Af.rest("productNameModelInquiry.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.productNameVal = "";
                                vm.originalFilmColorVal = "";
                                vm.originalFilmThicknessVal = "";
                                vm.originalFilmUnitPriceVal = "";
                                vm.originalFilmWholesalePriceVal = "";
                                vm.productLength = "";
                                vm.productWidth = "";
                                vm.originalFilmRemarksVals = "";
                                layer.close(index);
                                MAIN.OriginalInfoList($("#nickNameTextPanel").html());
                                /*更新开单处产品名称选择*/
                                if (status == 1) //判断是否外部调用(订单调用)
                                {
                                    var reqs = {};
                                    reqs.operator = $("#nickNameTextPanel").html(); //--->获取用户名
                                    reqs.queryType = ["productName", "unitPrice"];
                                    var selectData = []; //品名型号下拉列表数据
                                    Af.rest("productNameModelInquiry.api", reqs, function (ans) { //查询原片信息表
                                        if (ans.errorCode == 0) {
                                            /**
                                             * 解决时间:2019年1月7日 14:32
                                             * 解决问题:新增规格型号,渲染下拉列表,用户勾选时找不到单价
                                             */
                                            vm.billingFun(false);
                                        }
                                    });
                                }
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
            }
            ,
            /*基础信息[原片信息]删除事件*/
            delProductFun: function () {
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
            }
            ,
            editProductFun: function () {
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
                    area: ['520px', '460px'],
                    //shadeClose : true, //点击遮罩关闭
                    content: $("#editProductSubmenu"),
                    btn: ['提交', '取消'],
                    skin: 'btn-Color',
                    success: function () {
                        for (let i = 0; i < datasArray.length; i++) {
                            vm.profuctId = datasArray[i].id;
                            /*给表单赋值*/
                            vm.editProductNameVal = datasArray[i].productName;  //--->产品名称
                            vm.editProductColor = datasArray[i].color; //--->颜色
                            vm.editProductLength = datasArray[i].length;  //--->长度
                            vm.editProductWidth = datasArray[i].width; //--->宽度
                            vm.editOriginalFilmThicknessVal = datasArray[i].thickness;//--->厚度
                            vm.editOriginalFilmUnitPriceVal = datasArray[i].unitPrice; //--->单价
                            vm.editOriginalFilmWholesalePriceVal = datasArray[i].wholesalePrice; //--->批发价
                            vm.editOriginalFilmRemarksVals = datasArray[i].remarks; //--->备注
                        }
                    },
                    yes: function (index, layero) {
                        /*判断用户输入的数据的合法性*/
                        if (Af.nullstr(vm.editProductNameVal) || Af.nullstr(vm.editProductLength) || Af.nullstr(vm.editProductWidth) || Af.nullstr(vm.editOriginalFilmUnitPriceVal)) {
                            MAIN.ErroAlert("产品名称,单价,长度,宽度为必填项!");
                            return;
                        }

                        var req = {
                            operator: $("#nickNameTextPanel").html(),
                            updateProduct: "updateProduct",
                            productName: vm.editProductNameVal, //--->原片名称
                            profuctId: vm.profuctId,//id
                            color: vm.editProductColor,//--->颜色
                            unitPrice: Number(vm.editOriginalFilmUnitPriceVal), //单价
                            wholesalePrice: Number(vm.editOriginalFilmWholesalePriceVal),//批发价
                            length: vm.editProductLength, //--->长度
                            width: vm.editProductWidth,//--->宽度
                            area: (vm.editProductLength * vm.editProductWidth) / 1000000,//面积
                            remarks: vm.editOriginalFilmRemarksVals//备注
                        };
                        if(isNaN(req.unitPrice)||isNaN(req.wholesalePrice)||isNaN(req.area))
                        {
                            MAIN.ErroAlert("单价,折扣价,规格型号不能有英文或中文出现!");
                            return;
                        }
                        Af.rest("productNameModelInquiry.api", req, function (ans) {
                            if (ans.errorCode == 0) {
                                vm.editProductNameVal = "";
                                vm.profuctId = "";
                                vm.editProductColor = "";
                                vm.editOriginalFilmThicknessVal = "";
                                vm.editOriginalFilmUnitPriceVal = "";
                                vm.editOriginalFilmWholesalePriceVal = "";
                                vm.editProductLength = "";
                                vm.editProductWidth = "";
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
            }
            ,
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
                this.SupplierInfoStatus = "none";
            }
            ,
            //基础信息[配件信息]新增函数
            addFittingFun: function () {
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
                            fittingImgUrl: vm.productImageUrl,
                            fittingName: vm.productModelVal
                        };
                        if (Af.nullstr(req.fittingName)) {
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
            }
            ,
            /*基础信息[配件信息]查询函数*/
            queryFittingFun: function () {
                if (Af.nullstr(this.OriginalInfoCommodityNameSelectVal)) {
                    MAIN.ErroAlert("不能查询空数据,请选择一个产品名称!");
                    return;
                }
                var req = {};
                //获取查询条件
                req.operator = $("#nickNameTextPanel").html();
                req.fittingName = this.OriginalInfoCommodityNameSelectVal;
                req.conditionalQuery = "conditionalQuery";
                Af.rest("FittingPublic.api", req, function (ans) {
                    if (ans.errorCode != 0) {
                        layer.msg(ans.msg);
                    } else {
                        MAIN.AttachmentInfoDataList(ans.data);
                    }
                });
            }
            ,
            /*基础信息[配件信息]删除函数*/
            delFittingFun: function () {
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
            }
            ,
            /*基础信息[供应商信息]管理点击事件*/
            SupplierFun: function () {
                setTimeout(function () {
                    /*渲染供应商管理数据表格*/
                    MAIN.SupplierInfoList($("#nickNameTextPanel").html());
                }, 100);
                this.SupplierInfoStatus = "block";
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
                this.basicSettingsStatus = "none";
            }
            ,
            /*基本信息[供应商管理]查询函数*/
            querySupplierFun: function () {
                if (Af.nullstr(vm.SupplierInfoSelectData)) {
                    MAIN.ErroAlert("不能查询空数据");
                } else {
                    let req = {
                        "customQuery": "customQuery",
                        "supplierName": vm.SupplierInfoSelectData,
                        "operator": $("#nickNameTextPanel").html()
                    };
                    Af.rest("supplier.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            MAIN.SupplierInfoDataList(ans.data);
                        }
                    })
                }
            }
            ,
            /*基本信息[供应商管理]新增函数*/
            addSupplierFun: function () {
                Af.openSubmenu("新增供应商", ["950px", "510px"], true, $("#addSupplierSubmenu"));
            }
            ,
            /*基本信息[供应商管理]监听银行卡号实时输入*/
            BankCardRealTimeInput: function () {
                let nowBankCard = vm.supplierBankCardNumber;
                if (Af.getStringLength(nowBankCard) == 19) {
                    let bankCardInfo = bankCardAttribution(nowBankCard);
                    if (bankCardInfo != "error") {
                        $("#supplierBankSpan").css({"color": "#5FB878"});
                        let bankCardType = bankCardInfo.bankName + "-" + bankCardInfo.cardTypeName;
                        vm.supplierBankPrompt = bankCardType;
                    } else {
                        $("#supplierBankSpan").css({"color": "red"});
                        vm.supplierBankPrompt = "请输入正确的卡号";

                    }
                } else {
                    vm.supplierBankPrompt = "";
                }
            },
            /*基本信息[客户信息]监听银行卡号实时输入*/
            addClientBankCardRealTimeInput: function () {
                let nowBankCard = vm.bankCardNumberVal;
                if (Af.getStringLength(nowBankCard) == 19) {
                    let bankCardInfo = bankCardAttribution(nowBankCard);
                    if (bankCardInfo != "error") {
                        let bankCardType = bankCardInfo.bankName + "-" + bankCardInfo.cardTypeName;
                        vm.bankAccountVal = bankCardType;
                    } else {
                        MAIN.ErroAlert("请输入正确的卡号");
                    }
                } else {
                    vm.bankAccountVal = "";
                }
            },
            /*基本信息[供应商管理]监听银行卡号实时输入(编辑)*/
            editBankCardRealTimeInput: function () {
                let nowBankCard = vm.editSupplierBankCardNumber;
                if (Af.getStringLength(nowBankCard) == 19) {
                    let bankCardInfo = bankCardAttribution(nowBankCard);
                    if (bankCardInfo != "error") {
                        $("#editSupplierBankSpan").css({"color": "#5FB878"});
                        let bankCardType = bankCardInfo.bankName + "-" + bankCardInfo.cardTypeName;
                        vm.editSupplierBankPrompt = bankCardType;
                    } else {
                        $("#editSupplierBankSpan").css({"color": "red"});
                        vm.editSupplierBankPrompt = "请输入正确的卡号";
                    }
                } else {
                    vm.editSupplierBankPrompt = "";
                }
            }
            ,
            /*基本信息[供应商管理]新增提交函数*/
            addSupplierSubmitFun: function () {
                let req = {
                    "supplierName": vm.supplierName,
                    "primaryContact": vm.supplierContact,
                    "contactNumber": vm.supplierPhone,
                    "wechat": vm.supplierWechat,
                    "address": vm.supplierAddress,
                    "logoUrl": vm.supplierLogoSrc,
                    "bankAccount": vm.supplierBankPrompt,
                    "bankCardNumber": vm.supplierBankCardNumber,
                    "addSupplier": "addSupplier",
                    "operator": $("#nickNameTextPanel").html()
                };
                if (vm.supplierLogoSrc == "img/update.png") {
                    MAIN.ErroAlert("请上传供应商logo");
                    return;
                } else if (vm.supplierContact == "") {
                    MAIN.ErroAlert("请填写首要联系人");
                } else if (vm.supplierPhone == "") {
                    MAIN.ErroAlert("请填写联系人电话");
                } else if (vm.supplierName == "") {
                    MAIN.ErroAlert("请填写供应商名称");
                } else if (vm.supplierBankPrompt == "请输入正确的卡号" || vm.supplierBankPrompt == "") {
                    MAIN.ErroAlert("银行卡号填写不正确");
                } else {
                    Af.rest("supplier.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            $("#supplierBlackTip").css({"display": "block"});
                            vm.supplierLogoSrc = "img/update.png";
                            vm.supplierName = "";
                            vm.supplierContact = "";
                            vm.supplierPhone = "";
                            vm.supplierAddress = "";
                            vm.supplierBankCardNumber = "";
                            vm.supplierBankPrompt = "";
                            vm.supplierWechat = "";
                            layer.closeAll();
                            layer.msg("添加成功");
                            MAIN.SupplierInfoList($("#nickNameTextPanel").html());
                        } else {
                            layer.msg(ans.msg);
                        }
                    });
                }

            }
            ,
            /*基本信息[供应商管理]新增取消函数*/
            addSupplierCancelFun: function () {
                layer.closeAll();
            }
            ,
            /*基本信息[供应商管理]删除函数*/
            delSupplierFun: function () {
                let selectId = MAIN.getSelectId("SupplierInfoList");
                if (Af.nullstr(selectId)) {
                    MAIN.ErroAlert("不能删除空数据");
                } else {
                    //调用layer的删除方法
                    let processResult = Af.layerDel(selectId, "supplier.api");
                    if (processResult) {
                        MAIN.SupplierInfoList($("#nickNameTextPanel").html());
                    }
                }
            }
            ,
            /*基本信息[供应商管理]编辑函数*/
            editSupplierFun: function () {
                let selectId = MAIN.getSelectId("SupplierInfoList");
                if (Af.nullstr(selectId)) {
                    MAIN.ErroAlert("不能编辑空数据");
                } else if (selectId.length > 1) {
                    MAIN.ErroAlert("一次只能修改一条数据");
                } else {
                    Af.openSubmenu("编辑供应商", ["950px", "510px"], true, $("#editSupplierSubmenu"));
                    /*获取当前选项的数据*/
                    let dataArray = MAIN.getSelectData("SupplierInfoList");
                    vm.editSupplierLogoSrc = dataArray[0].logoUrl;
                    vm.editSupplierName = dataArray[0].supplierName;
                    vm.editSupplierContact = dataArray[0].primaryContact;
                    vm.editSupplierBankPrompt = dataArray[0].bankAccount;
                    vm.editSupplierPhone = dataArray[0].contactNumber;
                    vm.editSupplierAddress = dataArray[0].address;
                    vm.editSupplierBankCardNumber = dataArray[0].bankCardNumber;
                    vm.editSupplierWechat = dataArray[0].wechat;
                }

            }
            ,
            /*基本信息[供应商管理]编辑提交函数*/
            editSupplierSubmitFun: function () {
                let selectId = MAIN.getSelectId("SupplierInfoList");
                let req = {
                    "supplierName": vm.editSupplierName,
                    "primaryContact": vm.editSupplierContact,
                    "contactNumber": vm.editSupplierPhone,
                    "wechat": vm.editSupplierWechat,
                    "address": vm.editSupplierAddress,
                    "logoUrl": vm.editSupplierLogoSrc,
                    "bankAccount": vm.editSupplierBankPrompt,
                    "bankCardNumber": vm.editSupplierBankCardNumber,
                    "updateSupplier": "updateSupplier",
                    "operator": $("#nickNameTextPanel").html(),
                    "id": selectId[0]
                };
                if (vm.editSupplierLogoSrc == "img/update.png") {
                    MAIN.ErroAlert("请上传供应商logo");
                    return;
                } else if (vm.editSupplierContact == "") {
                    MAIN.ErroAlert("请填写首要联系人");
                } else if (vm.editSupplierPhone == "") {
                    MAIN.ErroAlert("请填写联系人电话");
                } else if (vm.editSupplierName == "") {
                    MAIN.ErroAlert("请填写供应商名称");
                } else if (vm.editSupplierBankPrompt == "请输入正确的卡号" || vm.editSupplierBankPrompt == "") {
                    MAIN.ErroAlert("银行卡号填写不正确");
                } else {
                    Af.rest("supplier.api", req, function (ans) {
                        if (ans.errorCode == 0) {
                            $("#supplierBlackTip").css({"display": "block"});
                            vm.editSupplierLogoSrc = "img/update.png";
                            vm.editSupplierName = "";
                            vm.editSupplierContact = "";
                            vm.editSupplierPhone = "";
                            vm.editSupplierAddress = "";
                            vm.editSupplierBankCardNumber = "";
                            vm.editSupplierBankPrompt = "";
                            vm.editSupplierWechat = "";
                            MAIN.SupplierInfoList($("#nickNameTextPanel").html());
                            layer.closeAll();
                            layer.msg("修改成功");
                        } else {
                            layer.msg(ans.msg);
                        }
                    });
                }
            }
            ,
            /*基本信息[供应商管理]编辑取消函数*/
            editSupplierCancelFun: function () {
                layer.closeAll();
            }
            ,

            /*基本设置 点击事件*/
            basicSettingsFun: function () {
                layer.alert("该模块暂未开放");
                return;
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*联系我们 点击事件*/
            contactUsFun: function () {
                layer.alert("该模块暂未开放!");
                return;
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
                this.SupplierInfoStatus = "none";
            }
            ,
            /*客户原始单据点击放大图片*/
            OriginalDocumentFun: function () {
                //点击查看大图
                layer.photos({
                    photos: vm.customerOriginalDocumentSrc
                    ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                });
            },
            /*送货请单原始单据点击放大图片*/
            deliveryOrderFun:function () {
                //点击查看大图
                layer.photos({
                    photos: vm.deliveryOrderJsonSrc
                    ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                });
            },
            /*客户对账:单据下载函数*/
            downloadAllOrderFun:function () {
                let customerOriginalDocumentSrc = vm.customerOriginalDocumentSrc.data; //客户原始单据
                let deliveryOrderJsonSrc = vm.deliveryOrderJsonSrc.data; //发货单据
                if(Af.nullstr(customerOriginalDocumentSrc)||Af.nullstr(deliveryOrderJsonSrc))
                {
                    MAIN.ErroAlert("不能下载空单据!");
                    return;
                }
                let picPath = [];
                picPath.push(customerOriginalDocumentSrc[0].src);
                for(let i = 0;i < deliveryOrderJsonSrc.length;i++)
                {
                    picPath.push(deliveryOrderJsonSrc[i].src);
                };
                //路径处理(去除网站)
                let finalPath = [];
                $.each(picPath,function (index,item) {
                    item = item.substring(22);
                    finalPath.push(item);
                });
                let req = {
                    "picPath":finalPath,
                    "getReceipt":"",
                    "operator":$("#nickNameTextPanel").html()
                };
                Af.rest("fileDownload.api",req,function (ans) {
                    if(ans.errorCode==0)
                    {
                        //开始下载文件
                        Af.downloadFile(ans.downloadLink);
                    }
                    else {
                        MAIN.ErroAlert(ans.msg);
                    }
                });
            },
        }
    });

    $("#navBar li").click(function () {
       $(this).addClass("active").siblings("li").removeClass("active");
    });
    $("#navBar li").hover(function () {
        if($(this).hasClass("active"))
        {
            $(this).removeClass("nav-hover")
        }
        else{
            $(this).addClass("nav-hover");
        }
    },function () {
        $(this).removeClass("nav-hover")
    });
    /*根据条件查询切换卡鼠标移入以及点击事件处理*/
    $("#timeNav li").click(function () {
        $(this).addClass("active").siblings("li").removeClass("active");
    });
    $("#timeNav li").hover(function () {
        if($(this).hasClass("active"))
        {
            $(this).find("span").removeClass("nav-hover")
        }
        else{
            $(this).find("span").addClass("nav-hover");
        }
    },function () {
        $(this).find("span").removeClass("nav-hover")
    });
    /**
     * 支出管理图表渲染
     */
    // 基于准备好的dom，初始化echarts实例
    var outlayChart = echarts.init(document.getElementById('outlayChart'));
    var data = [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,77,88,88];
    // 指定图表的配置项和数据
    var option = {
        /*title: {text: '今日支出'},*/
        //鼠标移入的提示信息
        tooltip: {
            //触发类型：axis坐标轴触发
            trigger: 'axis',
            //提示框浮层内容格式器： params 是 formatter 需要的数据集，第二个参数 ticket 是异步回调标识，配合第三个参数 callback 使用
            formatter:function (params, ticket, callback) {
                return "支出时间: "+params[0].axisValue+"<br/>支出金额: "+params[0].data+"";
            }
        },
        //容器配置信息
        grid:{
            left:"80px",
            right:"80px",
            //显示坐标系中的网格
            show:true,
            borderColor:"#5458b3"
        },
        //工具箱
       /* toolbox: {
            feature: {
                //数据视图
                dataView: {},
                //另存为图片
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },*/
        xAxis: {
            //category类目轴
            type: 'category',
            data: ['0:00','1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00','8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00','22:00','23:00']
        },
        yAxis: {
            type: 'value',
            boundaryGap:false,
            cursor:"pointer"
        },
        //数据展示
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,77,88,88],
            type: 'line',
            //折线图线条颜色
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#5458b3' // 0% 处的颜色
                }, {
                    offset: 1, color: 'blue' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    outlayChart.setOption(option);
    layui.use(['form', 'element', 'jquery', 'table', 'laydate', 'carousel', 'colorpicker', 'upload','laytpl'], function () {
        var form = layui.form,
            element = layui.element,
            $ = layui.$,
            table = layui.table,
            laytpl = layui.laytpl,
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
        testFun("李凯");
        function testFun(userName){
            table.render({
                url: "OutlayInfo.api",
                method: 'POST', //方式
                elem: '#expenditureInfoList',
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
                            field: 'outlayDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'outlayType',
                            title: '支出类别',
                            align: "center"
                        },
                        {
                            field: 'paymentMethod',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'paymentAmount',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'supperName',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'beneficiary',
                            title: '收款人',
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
        }
        /*监听标签打印[单选框选择]*/
        form.on('radio(labelRadio)', function (data) {
            //console.log(data.value); //被点击的radio的value值
            vm.labelRadio = data.value;
        });
        /*监听运费支付状态是否勾选*/
        form.on('checkbox(freightSwitch)', function (data) {
            vm.freightPaymentStatus = data.elem.checked;
        });
        /*监听客户对账(客户名称选择)*/
        form.on('select(customerReconciliationSelect)', function (data) {
            vm.customerReconciliationSelectVal = data.value;
        });

        /*监听订单信息管理[添加收入]收款方式选择*/
        form.on('select(incomePaymentMethod)', function (data) {
            let selectData = data.value;
            selectData = Number(selectData);
            let rawData = vm.addRevenueVlientInfo;
            let addRevenueCard = $("#addRevenueCard");
            switch (selectData) {
                case 0:
                    vm.addRevenueCardVal = rawData[0].bankCardNumber;
                    vm.addRevenueBankImg = URL + "webPic/bankImg/yinlianzhifu.png";
                    vm.addRevenuePaymentMethod = "银行卡";
                    addRevenueCard.removeClass("not_allowed");
                    addRevenueCard.removeAttr("readonly");
                    break;
                case 1:
                    vm.addRevenueCardVal = "";
                    vm.addRevenuePaymentMethod = "支付宝";
                    vm.addRevenueBankImg = URL + "webPic/bankImg/zhifubao.png";
                    addRevenueCard.removeClass("not_allowed");
                    addRevenueCard.removeAttr("readonly");
                    break;
                case 2:
                    vm.addRevenueCardVal = rawData[0].weChat;
                    vm.addRevenuePaymentMethod = "微信";
                    vm.addRevenueBankImg = URL + "webPic/bankImg/weixinzhifu.png";
                    addRevenueCard.removeClass("not_allowed");
                    addRevenueCard.removeAttr("readonly");
                    break;
                case 3:
                    vm.addRevenueBankImg = URL + "webPic/bankImg/xianjin.png";
                    vm.addRevenueCardVal = "";
                    vm.addRevenuePaymentMethod = "现金";
                    addRevenueCard.addClass("not_allowed");
                    addRevenueCard.attr("readonly", "readonly");
                    break;
                default:
                    MAIN.ErroAlert("非法操作");
                    break;
            }
        });
        var orderInfoTmpobj = null;
        /*页面中所有layui数据表格单击当前行当前行的复选框被选中*/
        $(document).on("click", ".layui-table-body table.layui-table tbody tr", function () {
            var obj = event ? event.target : event.srcElement;
            var tag = obj.tagName;
            var index = $(this).attr('data-index');
            var tableBox = $(this).parents(".layui-table-box");
//存在固定列
            if (tableBox.find('.layui-table-fixed.layui-table-fixed-l').length > 0) {
                tableDiv = tableBox.find('.layui-table-fixed.layui-table-fixed-l');
            } else {
                tableDiv = tableBox.find('.layui-table-body.layui-table-main');
            }
            var checkCell = tableDiv.find('tr[data-index=' + index + ']').find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
            if (checkCell.length > 0) {
//if(tag == 'DIV') {
                checkCell.click();
//}
            }
        });
        $(document).on("click", "td div.laytable-cell-checkbox div.layui-form-checkbox", function (e) {
            e.stopPropagation();
        });
        /*页面中所有layui数据表格单击当前行当前行的复选框被选中结束*/
        /*监听订单列表行单击事件*/
        table.on('row(orderInfoList)', function (obj) {
            if (orderInfoTmpobj != null) {
                orderInfoTmpobj.tr[0].style = 'background-color: #ffffff;';
                if (orderInfoTmpobj.tr[1]) {
                    orderInfoTmpobj.tr[1].style = 'background-color: #ffffff;';
                }
            }
            orderInfoTmpobj = obj;
            obj.tr[0].style = 'background-color: #F2F2F2;';
            if (obj.tr[1]) {
                obj.tr[1].style = 'background-color: #F2F2F2;';
            }
        });
        /*监听订单列表行双击事件*/
        table.on('rowDouble(orderInfoList)', function (obj) {
            /*执行订单详情函数*/
            vm.orderDetailsFun();
        });
        /*监听客户对账列表行双击事件*/
        table.on('rowDouble(customerReconciliationList)', function (obj) {
            let req ={
                "orderNumber":obj.data.orderNumber,
                "operator":$("#nickNameTextPanel").html(),
                "queryShipInfo":""
            };
            if(Af.nullstr(obj.data.customerOriginalDocument))
            {
                MAIN.ErroAlert("该订单没有上传原始单据");
                return;
            }
            else
            {
                //生成客户原始单据查看大图需要的json数据
                vm.customerOriginalDocumentSrc = {
                    "title":"客户原始单据",
                    "id":1,
                    "start":0,
                    "data":[
                        {
                            "alt":"原始订单",
                            "pid":1,
                            "src":obj.data.customerOriginalDocument
                        }
                    ]
                };
                $("#customerOriginalDocumentImg").attr("src",obj.data.customerOriginalDocument);
                //生成送货清单查看大图需要的JSON数据
                Af.rest("customerReconciliation.api",req,function(ans){
                    let thisArr = ans.data;
                    if(Af.nullstr(thisArr))
                    {
                        MAIN.ErroAlert("此订单没上传任何发货单!");
                    }
                    else
                    {
                        let thisData = [];
                        for(let i = 0;i < thisArr.length;i++)
                        {
                            let picSrc = thisArr[i].deliveryNote;
                            if(Af.nullstr(picSrc))
                            {
                                continue;
                            }
                            else {
                                let thisObj ={
                                    "alt":"送货请单",
                                    "pid":i,
                                    "src":picSrc
                                };
                                thisData.push(thisObj);
                            }
                        }
                        let finalObj = {
                            "title":"送货清单",
                            "id":2,
                            "start":0,
                            "data":thisData
                        };
                        vm.deliveryOrderJsonSrc = finalObj;
                        if(!Af.nullstr(thisData))
                        {
                            $("#deliveryOrderPanel").attr("src",thisData[0].src);
                        }
                    }
                });
            }
        });
        /*监听出货管理[查看详情]表格双击事件*/
        table.on('rowDouble(originalFilmOutList)', function (obj) {
            /*执行出货管理查看详情函数*/
            vm.shipmentSeeDetails();
        });
        /*监听已完成订单客户名称选择*/
        form.on('select(orderCompletedSelect)', function (data) {
            vm.orderCompletedSelectData = data.value;
        });
        /*监听供应商信息,供应商名称选择*/
        form.on('select(SupplierInfoSelectPanel)', function (data) {
            vm.SupplierInfoSelectData = data.value;
        });
        /*监听原片采购[供应商]名称选择*/
        form.on('select(OriginalFilmsupplier)', function (data) {
            vm.originalFilmSupplierSelectVal = data.value;
        });
        /*监听配件采购[供应商]名称选择*/
        form.on('select(fittingSupplier)', function (data) {
            vm.replacementFittingSupplierSelectVal = data.value;
        });

        /*监听配件名称选择*/
        form.on('select(fittingSpecificationModel)', function (data) {
            var thisSelectVal = data.value;
            if (!Af.nullstr(thisSelectVal)) {
                $("#newAccessoriesInput").addClass("noInput");
                $("#newAccessoriesInput").attr("disabled", "disabled");
            } else {
                $("#newAccessoriesInput").removeClass("noInput");
                $("#newAccessoriesInput").removeAttr('disabled');
            }
        });
        /*送货单上传*/
        var uploadDeliveryNote = upload.render({
            elem: "#uploadDeliveryNote", //绑定元素
            url: "servlet/UploadAPI", //上传接口
            auto: false,
            bindAction: "#hideBtn",
            choose: function(obj) {
                if(Af.nullstr(vm.shippingOrderNumber))
                {
                    MAIN.ErroAlert("没有勾选订单,不能上传!");
                    return;
                }
                var files = obj.pushFile();
                var index, file, indexArr = [];
                for(index in files) {
                    indexArr.push(index);
                };
                var iaLen = indexArr.length;
                file = files[indexArr[iaLen - 1]];
                for(var i = 0; i < iaLen - 1; i++) {
                    delete files[indexArr[i]];
                }
                try {
                    if(file.size > 200 * 1024) {
                        delete files[index];
                        photoCompress(file, {
                            quality: 0.5,
                        }, function(base64Codes) {
                            var bl = convertBase64UrlToBlob(base64Codes);
                            obj.resetFile(index, bl, file.name);
                            $("#hideBtn").trigger("click");
                        });
                    } else {
                        $("#hideBtn").trigger("click");
                    }
                } catch(e) {
                    $("#hideBtn").trigger("click");
                }
            },
            done: function (ans) {
                //上传完毕回调
                if(vm.documentUploadStatus)
                {
                    console.log("禁止触发第二次后台请求!");
                }
                else {
                    vm.documentUploadStatus = true;
                    if (ans.errorCode == 0) {
                        var userPicPath = URL + ans.userPicPath;
                        let req = {
                            "updateOrder":"updateOrder",
                            "deliveryNote":userPicPath,
                            "id":vm.shippingOrderID,
                            "orderNumber":vm.shippingOrderNumber,
                            "operator":$("#nickNameTextPanel").html()
                        };
                        Af.rest("ShipmentInfo.api",req,function (ans) {
                            if(ans.errorCode==0)
                            {
                                layer.msg("添加成功");
                            }
                        });
                    }
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("服务器错误");
            }
        });
        /*客户原始订单单据上传*/
        var originalOrderDocument = upload.render({
            elem: "#uploadDocument", //绑定元素
            url: "servlet/UploadAPI", //上传接口
            auto: false,
            bindAction: "#btnHide",
            choose: function(obj) {
                if(Af.nullstr(vm.uploadDocumentForOrderNumber))
                {
                    MAIN.ErroAlert("没有勾选订单,不能上传!");
                    return;
                }
                var files = obj.pushFile();
                var index, file, indexArr = [];
                for(index in files) {
                    indexArr.push(index);
                };
                var iaLen = indexArr.length;
                file = files[indexArr[iaLen - 1]];
                for(var i = 0; i < iaLen - 1; i++) {
                    delete files[indexArr[i]];
                }
                try {
                    if(file.size > 200 * 1024) {
                        delete files[index];
                        photoCompress(file, {
                            quality: 0.5,
                        }, function(base64Codes) {
                            var bl = convertBase64UrlToBlob(base64Codes);
                            obj.resetFile(index, bl, file.name);
                            $("#btnHide").trigger("click");
                        });
                    } else {
                        $("#btnHide").trigger("click");
                    }
                } catch(e) {
                    $("#btnHide").trigger("click");
                }
            },
            done: function (ans) {
                //上传完毕回调
                if(vm.documentUploadStatus)
                {
                    console.log("禁止触发第二次后台请求!");
                }
                else{
                    vm.documentUploadStatus = true;
                    if (ans.errorCode == 0) {
                        var userPicPath = URL + ans.userPicPath;
                        let req = {
                            "updateOrder":"updateOrder",
                            "customerOriginalDocument":userPicPath,
                            "orderNumber":vm.uploadDocumentForOrderNumber,
                            "operator":$("#nickNameTextPanel").html()
                        };
                        Af.rest("orderInfonQueiry.api",req,function (ans) {
                            if(ans.errorCode==0)
                            {
                                layer.msg("添加成功");
                                vm.uploadDocumentForOrderNumber = "";
                            }
                        });
                    }
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("服务器错误");
            }
        });

        //供应商logo图片上传
        var supplierLogoUpload = upload.render({
            elem: "#blackMask", //绑定元素
            url: "servlet/UploadAPI", //上传接口
            done: function (ans) {
                //上传完毕回调
                if (ans.errorCode == 0) {
                    var userPicPath = URL + ans.userPicPath;
                    vm.supplierLogoSrc = userPicPath;//--->供应商logo赋值
                    $("#supplierBlackTip").css({"display": "none"});
                } else {
                    ErroAlert(ans.msg);
                    $("#supplierBlackTip").css({"display": "block"});
                }
            },
            error: function () {
                //请求异常回调
                layer.msg("服务器错误");
                $("#supplierBlackTip").css({"display": "block"});
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
        //正确信息弹出
        MAIN.successAlert = function (e) {
            var index = layer.alert(e, {
                icon: 6,
                time: 2000,
                offset: 't',
                closeBtn: 0,
                title: '成功提示',
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
                vm.addProductStatus = true;
                //判断用户是否勾选品名型号
                var selectIds = $("select[name='customize" + globalVar + "']").val();
                if (Af.nullstr(selectIds)) { //为空代表没有勾选
                    var lastselectId = $("select[name='customize" + (Number(globalVar) - 1) + "']").val(); //--->获取 用户上一项选择的规格型号
                    $("select[name='customize" + globalVar + "']").val(lastselectId); //---->赋值当前选择框的数据
                    /*获取单价panel*/
                    var pricePanel = $(parent_panel + " " + containerPanel + row_line + globalVar + foot_panel + " .unitPrice");
                    /**
                     * 此处修改时间:2019年1月7日 10:09
                     * @type {number}
                     * 解决BUG:用户没有选择规格型号的情况下,自动赋值单价为上一项
                     * 解决方法:去掉之前的-1
                     * 原代码:let thisSelectVal =  Number(lastselectId)-1;
                     */
                    let thisSelectVal = Number(lastselectId);
                    //给单价赋值
                    pricePanel.val(ansSelectData[thisSelectVal].unitPrice);
                }
                //清理当前单价定时器
                clearInterval(timer);
                //判断第一行用户是否有输入标记
                var first_row = $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").val();
                if (Af.nullstr(first_row)) {
                    MAIN.ErroAlert("请输入标记!");
                    //标记行获取焦点
                    $("#submenu .table-panel .content-panel .row_1 .item-panel .marks").focus();
                } else {
                    globalVar++; //添加行
                    //清空初第一个以外的所有选项
                    $("select[name='customize" + globalVar + "'] option:gt(0)").remove();
                    MAIN.addRow("#submenu .table-panel .content-panel");
                    console.log("此处加断点");
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
            var inputunitPrice = "<input type=\"text\" placeholder=\"自动读取\" class=\"layui-input unitPrice\">"; //--->单价标签
            var inputtotalAmount = "<input type=\"text\" placeholder=\"自动计算\" class=\"layui-input not_allowed totalAmount\" readonly=\"readonly\">"; //---->合计金额标签
            var endDiv = "</div>";
            /*数据拼凑*/
            var rowData = divStart + firstItemStart + "<span>" + globalVar + "</span>" + endDiv + specificationModelDivStart + specificationModel + endDiv + itemDiv + inputLength + endDiv + itemDiv + inputWidth + endDiv + itemDiv + inputNum + endDiv + itemDiv + inputMark + endDiv + itemDiv + inputArea + endDiv + itemDiv + inputunitPrice + endDiv + itemDiv + inputtotalAmount + endDiv + endDiv;
            //将拼凑的数据追加到 网页中
            $(elementDiv).append(rowData);
            //渲染select
            MAIN.addSelectCustomize(ansSelectData, "customize" + globalVar);
            //给新行设置定时器动态获取单价
            timer = setInterval(function () {
                var selectIds;
                var pricePanel = $(parent_panel + " " + containerPanel + row_line + globalVar + foot_panel + " .unitPrice");
                selectIds = $("option:selected", "select[name='customize" + globalVar + "']").index(); //--->获取当前选择项的索引

                if (!Af.nullstr(selectIds)) {
                    //给单价赋值
                    if (selectIds > 0) {
                        pricePanel.val(ansSelectData[selectIds - 1].unitPrice);
                    }
                }
            }, 100);
        };
        MAIN.addSelectOrderVal = function (data, container) {
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
        MAIN.addSelectCustomize = function(data, container){
            var $html = "";
            if (data != null) {
                $.each(data, function (index, item) {
                    if (item.proType) {
                        $html += "<option class='generate' value='" + index + "'>" + item.proType + "</option>";
                    } else {
                        $html += "<option value='" + index + "'>" + item.name + "</option>";
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
        /*动态赋值select函数*/
        MAIN.addSelectVal = function (data, container) {
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
        };
        MAIN.addSelectValForId = function (data, container) {
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
            vm.loadingStatus = "block";
            if (data.index == 0) {
                //原片采购数据表格渲染
                MAIN.OriginaFlilmList($("#nickNameTextPanel").html());
                vm.loadingStatus = "none";
            } else if (data.index == 1) {
                //附件数据表格渲染
                MAIN.annexList($("#nickNameTextPanel").html());
                vm.loadingStatus = "none";
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
            size: "sm", //大小
            done: function (color) {
                vm.originalFilmColorVal = color;
            }
        });
        colorpicker.render({
            elem: '#editOriginalFilmColorSelect', //原片颜色选择
            size: "sm", //大小
            done: function (color) {
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
        //获取当前数据表格选择项整行数据
        MAIN.getTableRowData = function(tableId){
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            return data;
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
        MAIN.getClientName = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            var clientNames = [];
            for (var i = 0; i < data.length; i++) {
                clientNames.push(data[i].clientName);
            }
            return clientNames;
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
        /*库存管理:[导出]数据函数*/
        MAIN.getStockDatas = function (tableId) {
            var checkStatus = table.checkStatus(tableId),
                data = checkStatus.data;
            if (Af.nullstr(data)) {
                MAIN.ErroAlert("不能导出空数据,请勾选要导出的数据!");
            } else {
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    var dataArr = [];
                    dataArr[0] = data[i].id;
                    dataArr[1] = data[i].originalTitle;
                    dataArr[2] = data[i].originalColor;
                    dataArr[3] = data[i].originalThickness;
                    dataArr[4] = data[i].storageNum;
                    if (data[i].numberOfOutbound) {
                        dataArr[5] = data[i].numberOfOutbound;
                    } else {
                        dataArr[5] = "空";
                    }
                    if (data[i].stockBalance) {
                        dataArr[6] = data[i].stockBalance;
                    } else {
                        dataArr[6] = "空";
                    }
                    dataArr[7] = data[i].supplier;
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
                } else {
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
                } else {
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
                } else {
                    vm.clientInfoStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.clientInfoEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }
            }
        });
        laydate.render({
            elem: '#revenueInfoDateInput', //收入管理：日期区间选择
            range: true,
            done: function (value, date, endDate) {
                if ($.isEmptyObject(date)) {
                    vm.RevenueManagementStart = "";
                    vm.RevenueManagementEnd = "";
                } else {
                    vm.RevenueManagementStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.RevenueManagementEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }
            }
        });
        laydate.render({
            elem: '#expenditureInfoDateInput', //支出管理:日期区间选择
            range: true,
            done: function (value, date, endDate) {
                if ($.isEmptyObject(date)) {
                    vm.payStart = "";
                    vm.payEnd = "";
                } else {
                    vm.payStart = date.year + "-" + date.month + "-" + date.date + " " + date.hours + ":" + date.minutes + ":" + date.seconds;
                    vm.payEnd = endDate.year + "-" + endDate.month + "-" + endDate.date + " " + endDate.hours + ":" + endDate.minutes + ":" + endDate.seconds;
                }
            }
        });
        laydate.render({
            elem: '#employeeAddBornDate', //添加员工[出生年月]:日期区间选择
            min: '1950-1-1',
            max: '2003-12-31',
            value: '1990-04-14',
            isInitValue: false //是否允许填充初始值，默认为 true
        });
        laydate.render({
            elem: '#employeeAddDateOfEntryDate', //添加员工[入职日期]:日期区间选择
            min: '1980-1-1',
            isInitValue: false //是否允许填充初始值，默认为 true
        });
        laydate.render({
            elem: '#employeeEditBornDate', //添加员工[出生年月]:日期区间选择(编辑)
            min: '1950-1-1',
            max: '2003-12-31',
            value: '1990-04-14',
            isInitValue: false //是否允许填充初始值，默认为 true
        });
        laydate.render({
            elem: '#employeeEditDateOfEntryDate', //添加员工[入职日期]:日期区间选择(编辑)
            min: '1980-1-1',
            isInitValue: false //是否允许填充初始值，默认为 true
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
        /*监听[工资发放]员工姓名选择*/
        form.on('select(salaryAddNameOfWorker)', function (data) {
            let thisData = data.value;
            let rawData = vm.salaryGivingStaffData;
            if(rawData.length>0)
            {
                for(let i = 0; i <rawData.length;i++)
                {
                    let thisObj = rawData[i];
                    let nameOfWorker = thisObj.nameOfWorker;
                    if(nameOfWorker==thisData)
                    {
                        if(thisObj.hasOwnProperty("jobNumber"))
                        {
                            vm.salaryAddJobNumber = thisObj.jobNumber;
                        }
                        if(thisObj.hasOwnProperty("department"))
                        {
                            vm.salaryAddDepartment = thisObj.department;
                        }
                        if(thisObj.hasOwnProperty("basicWage"))
                        {
                            vm.salaryAddBasicWage = thisObj.basicWage;
                        }
                    }
                }
            }
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
        /*监听进销存管理[库存管理]:原片名称选择*/
        form.on('select(stockProductNameSelectPanel)', function (data) {
            vm.originalTitleName = data.value;
        });
        form.on('radio(MultipleRadio)', function(data){
            vm.MultipleRadioVal = data.value;
        });
        /*监听原片采购[原片名称]选择*/
        form.on('select(OriginalFilmspecificationModel)', function (data) {
            vm.purchaseProductName = data.value;
            //查询 厚度,颜色,单价
            var req = {};
            req.queryType = ["length","width","color", "unitPrice"];
            req.operator = $("#nickNameTextPanel").html();
            req.productName = vm.purchaseProductName;
            Af.rest("productNameModelInquiry.api", req, function (ans) {
                if (ans.errorCode == 0) {
                    let data = ans.data;
                    if(data.length>1)
                    {
                        let MultiplePanel = $("#MultipleSpecificationsSubmenu .contentContainer");
                        MultiplePanel.html("");
                        $.each(data,function (index,item) {
                            let div_start = "<div class=\"row-panel\">";
                            let input_panel = "<input type=\"radio\" name=\"originalFilmModel\" value='"+JSON.stringify(item)+"' lay-filter='MultipleRadio'>";
                            let p_start = "<p>";
                            let p_style_start = "<p style=\"margin-right: 10px\">";
                            let p_end = "</p>";
                            let div_end = "</div>";
                            MultiplePanel.append(div_start+input_panel+p_start+ vm.purchaseProductName+p_end+p_start+item.length+"x"+item.width+p_end+p_style_start+item.unitPrice+"元"+p_end+div_end);
                        });
                        form.render('radio');
                        MultipleSpeciLayer = layer.open({
                            title: "型号选择",
                            type: 1,
                            area: ["470px","320px"],
                            shadeClose : true, //点击遮罩关闭
                            content: $("#MultipleSpecificationsSubmenu")
                        });
                    }else{
                        $("#OriginalFilmthickness").val(data[0].length+"x"+data[0].width);
                    }
                    $("#OriginalFilmcolor").val(data[0].color);
                    $("#OriginalFilmunitPrice").val(data[0].unitPrice);
                }
            });
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
                    /*页面已加载完成，数据表格也渲染完成:结束进度条*/
                    NProgress.done();

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
                            title: '详细尺寸',
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
                            title: '详细尺寸',
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
                            field: 'orderNumber',
                            title: '订单号',
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
                        {
                            field: 'freightPaymentStatus',
                            title: '运费状态',
                            align: "center",
                            templet: function(d){
                                let freightPaymentStatus = d.freightPaymentStatus;
                                let thisVal = "";
                                if(freightPaymentStatus)
                                {
                                    thisVal = "已支付";
                                }else{
                                    thisVal = "未支付";
                                }
                                return thisVal;
                            }
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
        MAIN.stockList = function (userName) {
            table.render({
                url: "inventoryInfo.api",
                elem: '#stockList',
                page: true,
                method: 'POST', //方式
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
                            title: '库存编号',
                            align: "center",
                            width: 100
                        },
                        {
                            field: 'originalTitle',
                            title: '原片名称',
                            align: "center"
                        },
                        {
                            field: 'originalColor',
                            title: '原片颜色',
                            align: "center"
                        },
                        {
                            field: 'originalThickness',
                            title: '原片厚度',
                            align: "center"
                        },
                        {
                            field: 'storageNum',
                            title: '入库数量',
                            align: "center"
                        },
                        {
                            field: 'numberOfOutbound',
                            title: '出库数量',
                            align: "center"
                        },
                        {
                            field: 'stockBalance',
                            title: '库存余量',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        }
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#stockProductNameSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    stockSelectFun();

                    /*渲染订单号选择框*/
                    function stockSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].originalTitle;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "stockProductNameSelectPanel");
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
        MAIN.stockDataList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#stockList',
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
                            title: '库存编号',
                            align: "center",
                            width: 100
                        },
                        {
                            field: 'originalTitle',
                            title: '原片名称',
                            align: "center"
                        },
                        {
                            field: 'originalColor',
                            title: '原片颜色',
                            align: "center"
                        },
                        {
                            field: 'originalThickness',
                            title: '原片厚度',
                            align: "center"
                        },
                        {
                            field: 'storageNum',
                            title: '入库数量',
                            align: "center"
                        },
                        {
                            field: 'numberOfOutbound',
                            title: '出库数量',
                            align: "center"
                        },
                        {
                            field: 'stockBalance',
                            title: '库存余量',
                            align: "center"
                        },
                        {
                            field: 'supplier',
                            title: '供货商',
                            align: "center"
                        }
                    ]
                ]
            });
        };

        /*订单管理:订单月结管理*/
        MAIN.OrderMonthList = function (rawData) {
            table.render({
                data: rawData,
                elem: '#OrderMonthList',
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
                            field: 'preparedBy',
                            title: '制单人',
                            align: "center"
                        },
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#orderCompletedSelect option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    clientNameSelectFun();

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
                        addSelectVal(nowData, "orderCompletedSelect");
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
        /*财务管理[收入管理] 数据表格*/
        MAIN.revenueInfoList = function (userName) {
            table.render({
                url: "IncomeInfo.api",
                method: 'POST', //方式
                elem: '#revenueInfoList',
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
                            field: 'incomeDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'productName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'paymentMethod',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '卡号/账号',
                            align: "center"
                        },
                        {
                            field: 'paymentAmount',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'payee',
                            title: '收款人',
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
        /*财务管理[收入管理] 数据表格(传值调用)*/
        MAIN.revenueInfoDataList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#revenueInfoList',
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
                            field: 'incomeDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'clientName',
                            title: '客户名称',
                            align: "center"
                        },
                        {
                            field: 'productName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'paymentMethod',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '卡号/账号',
                            align: "center"
                        },
                        {
                            field: 'paymentAmount',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'payee',
                            title: '收款人',
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
        /*财务管理[支出管理] 数据表格*/
        MAIN.expenditureInfoList = function (userName) {
            table.render({
                url: "OutlayInfo.api",
                method: 'POST', //方式
                elem: '#expenditureInfoList',
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
                            field: 'outlayDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'outlayType',
                            title: '支出类别',
                            align: "center"
                        },
                        {
                            field: 'paymentMethod',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'paymentAmount',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'supperName',
                            title: '供货商',
                            align: "center"
                        },
                        {
                            field: 'beneficiary',
                            title: '收款人',
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
        /*财务管理[支出管理] 数据表格(传值调用)*/
        MAIN.expenditureInfoDataList = function (resultData) {
            table.render({
                data: resultData,
                elem: '#expenditureInfoList',
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
                            field: 'outlayDate',
                            title: '日期',
                            align: "center"
                        },
                        {
                            field: 'outlayType',
                            title: '支出类别',
                            align: "center"
                        },
                        {
                            field: 'paymentMethod',
                            title: '付款方式',
                            align: "center"
                        },
                        {
                            field: 'paymentAmount',
                            title: '付款金额',
                            align: "center"
                        },
                        {
                            field: 'supperName',
                            title: '供货商',
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
        /*客户对账*/
        MAIN.customerReconciliationList = function (userName) {
            table.render({
                url: "customerReconciliation.api",
                method: 'POST', //方式
                elem: '#customerReconciliationList',
                contentType: 'application/json', //发送到服务端的内容编码类型
                where: {
                    operator: userName,
                    queryClientName:""
                },
                page: true,
                height: '270',
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
                            title: '订单日期',
                            align: "center"
                        },
                        {
                            field: 'projectName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'totalAmount',
                            title: '总金额',
                            align: "center"
                        },
                        {
                            field: 'glassNumber',
                            title: '总数量',
                            align: "center"
                        },
                        {
                            field: 'preparedBy',
                            title: '制单人',
                            align: "center"
                        }
                    ]
                ],
                done:function (res,curr,count) {
                    //清空select中除第一个以外的选项 渲染(部门,姓名,工号)
                    $("#customerReconciliationSelect option:gt(0)").remove();
                    AttendanceNameSelectFun();
                    /*渲染客户名称*/
                    function AttendanceNameSelectFun() {
                        var data = res.clientData;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].clientName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "customerReconciliationSelect");
                    }
                    /*动态赋值select函数*/
                    function addSelectVal(data, container) {
                        var $html = "";
                        if (data != null) {
                            $.each(data, function (index, item) {
                                if (item.proType) {
                                    $html += "<option class='generate' value='" + item.name + "'>" + item.proType + "</option>";
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
                }
            });
        };
        /*客户对账,传值调用*/
        MAIN.customerReconciliationDataList = function (UserData) {
            table.render({
                data:UserData,
                elem: '#customerReconciliationList',
                page: true,
                height: '270',
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
                            title: '订单日期',
                            align: "center"
                        },
                        {
                            field: 'projectName',
                            title: '工程名称',
                            align: "center"
                        },
                        {
                            field: 'totalAmount',
                            title: '总金额',
                            align: "center"
                        },
                        {
                            field: 'glassNumber',
                            title: '总数量',
                            align: "center"
                        },
                        {
                            field: 'preparedBy',
                            title: '制单人',
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
        MAIN.AttendanceInfoDataList = function (resultData) {
            table.render({
                data: resultData,
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
                data: resultData,
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
                            field: 'basicWage',
                            title: '基本工资',
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
                    console.log(res);
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
                            let thisObj = data[i];
                            if(thisObj.hasOwnProperty("jobNumber"))
                            {
                                var temporaryData = {};
                                temporaryData.id = data[i].id;
                                temporaryData.name = data[i].jobNumber;
                                nowData.push(temporaryData);
                            }
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
                data: resultData,
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
                            field: 'basicWage',
                            title: '基本工资',
                            align: "center"
                        }
                    ]
                ]
            });
        };
        /*基础信息:原片信息数据表格*/
        MAIN.OriginalInfoList = function (userName) {
            table.render({
                url: "productNameModelInquiry.api",
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
                            field: 'productName',
                            title: '产品名称',
                            align: "center"
                        },
                        {
                            field: 'color',
                            title: '颜色',
                            align: "center"
                        },
                        {
                            field: 'length',
                            title: '长度',
                            align: "length"
                        },
                        {
                            field: 'width',
                            title: '宽度',
                            align: "center"
                        },
                        {
                            field: 'area',
                            title: '面积',
                            align: "center"
                        },

                        {
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'wholesalePrice',
                            title: '折扣价',
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
                data: resultData,
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
                            field: 'unitPrice',
                            title: '单价',
                            align: "center"
                        },
                        {
                            field: 'memberPrice',
                            title: '折扣价',
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
                data: resultList,
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

        /*基础信息:供应商信息*/
        MAIN.SupplierInfoList = function (userName) {
            table.render({
                url: "supplier.api",
                method: 'POST', //方式
                elem: '#SupplierInfoList',
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
                            field: 'supplierName',
                            title: '供应商名称',
                            align: "center"
                        },
                        {
                            field: 'primaryContact',
                            title: '联系人姓名',
                            align: "center"
                        },
                        {
                            field: 'contactNumber',
                            title: '联系人电话',
                            align: "center"
                        },
                        {
                            field: 'wechat',
                            title: '联系人微信',
                            align: "center"
                        },
                        {
                            field: 'address',
                            title: '供货商地址',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '银行卡号',
                            align: "center"
                        },
                        {
                            field: 'bankAccount',
                            title: '开户银行',
                            align: "center"
                        },
                    ]
                ],
                done: function (res, curr, count) {
                    //清空select中除第一个以外的选项
                    $("#SupplierInfoSelectPanel option:gt(0)").remove();
                    //如果是异步请求数据方式，res即为接口返回的信息。
                    //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                    //console.log(res);
                    supplierNameSelectFun();

                    /*渲染订单号选择框*/
                    function supplierNameSelectFun() {
                        var data = res.data;
                        var nowData = [];
                        for (var i = 0; i < data.length; i++) {
                            var temporaryData = {};
                            temporaryData.id = data[i].id;
                            temporaryData.name = data[i].supplierName;
                            nowData.push(temporaryData);
                        }
                        addSelectVal(nowData, "SupplierInfoSelectPanel");
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
        /*基础信息:供应商信息,传值调用*/
        MAIN.SupplierInfoDataList = function (rawData) {
            table.render({
                elem: '#SupplierInfoList',
                data: rawData,
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
                            field: 'supplierName',
                            title: '供应商名称',
                            align: "center"
                        },
                        {
                            field: 'primaryContact',
                            title: '联系人姓名',
                            align: "center"
                        },
                        {
                            field: 'contactNumber',
                            title: '联系人电话',
                            align: "center"
                        },
                        {
                            field: 'wechat',
                            title: '联系人微信',
                            align: "center"
                        },
                        {
                            field: 'address',
                            title: '供货商地址',
                            align: "center"
                        },
                        {
                            field: 'bankCardNumber',
                            title: '银行卡号',
                            align: "center"
                        },
                        {
                            field: 'bankAccount',
                            title: '开户银行',
                            align: "center"
                        },
                    ]
                ],
            });
        };
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
    //发货管理:原片采购[数量] 失去焦点事件
    $("#OriginalFilmquantity").blur(function () {
        var totalAmount = Number($("#OriginalFilmquantity").val()) * Number($("#OriginalFilmunitPrice").val());
        if (isNaN(totalAmount)) {
            MAIN.ErroAlert("请输入数量和单价");
        } else {
            $("#OriginalFilmtotalPurchase").val(totalAmount + "元");
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