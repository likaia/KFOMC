$(function () {
    var parent_panel = "#submenu";
    var containerPanel = ".table-panel .content-panel"; //---->动态div之前的容器
    var row_line = " .row_"; //--->动态div名称
    var foot_panel = " .item-panel"; //---->每一个item
    var globalArr = [];
    for(var i =1;i<=300;i++)
    {
        globalArr.push(i);
    }
    /*页面首次加载时 长度失去焦点*/
    $(parent_panel).on("blur",containerPanel+row_line+globalArr[0]+foot_panel+" .glassLength", function() {
        var localVar = globalArr[0]; //当前第几行 (手动修改)
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));
    });
    /*页面首次加载时 宽度失去焦点*/
    $(parent_panel).on("blur", containerPanel+row_line+globalArr[0]+foot_panel+" .glassWidth", function() {
        var localVar = globalArr[0]; //当前第几行 (手动修改)
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));
    });
    /*页面首次加载时:数量失去焦点*/
    $(parent_panel).on("blur", containerPanel+row_line+globalArr[0]+foot_panel+" .glassNum", function() {
        var localVar = globalArr[0]; //当前第几行 (手动修改)
        var upLine = localVar - 1;
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        var marksVesselUpVal = $(parent_panel+" "+containerPanel+row_line+upLine+foot_panel+" .marks").val();//获取上行标记
        var marksVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .marks");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));
        //给标记列赋值
        if(!typeof(marksVesselUpVal)=="undefined"){
            marksVessel.val(marksVesselUpVal);
        }
    });

    /*重复代码开始*/

    $(parent_panel).on("blur",containerPanel+row_line+globalArr[1]+foot_panel+" .glassLength", function() {
        var localVar = globalArr[1]; //当前第几行 (手动修改)
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));

    });
    /*宽度失去焦点*/
    $(parent_panel).on("blur",containerPanel+row_line+globalArr[1]+foot_panel+" .glassWidth", function() {
        var localVar = globalArr[1]; //当前第几行 (手动修改)
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));
    });
    /*数量失去焦点*/
    $(parent_panel).on("blur", containerPanel+row_line+globalArr[1]+foot_panel+" .glassNum", function() {
        var localVar = globalArr[1]; //当前第几行 (手动修改)
        var upLine = localVar - 1;
        var lengthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassLength");
        var widthVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassWidth");
        var numVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .glassNum");
        var unitPriceVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .unitPrice");
        var areaVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .area");
        var totalAmountVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .totalAmount");
        var marksVesselUpVal = $(parent_panel+" "+containerPanel+row_line+upLine+foot_panel+" .marks").val();//获取上行标记
        var marksVessel = $(parent_panel+" "+containerPanel+row_line+localVar+foot_panel+" .marks");
        //获取当前编辑行的 长 宽 数量 单价
        var glassLength = lengthVessel.val();
        var glassWidth = widthVessel.val();
        var glassNum = numVessel.val();
        var unitPrice = unitPriceVessel.val();
        //计算当前行面积
        var glassArea = (glassLength*glassWidth*glassNum)/1000000;
        //计算当前行总金额
        var totalAmount = glassNum * unitPrice;
        //给面积列赋值
        areaVessel.val(glassArea.toFixed(2));
        //给合计金额列赋值
        totalAmountVessel.val(totalAmount.toFixed(2));
        //给标记列赋值
        marksVessel.val(marksVesselUpVal);
    });
    /*重复代码结束*/


});