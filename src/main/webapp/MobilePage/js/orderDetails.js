$(function () {
    //  监听 ctrl + p事件
    $(document).unbind('keydown').bind('keydown', function(e){
        if(e.ctrlKey && e.keyCode  == 80) {
            doSomething();
            // 返回false, 防止重复触发copy事件
            return false;
        }
    });
    // 鼠标右键的复制事件
    $(document).unbind('copy').bind('copy', function(e) {
        setTime();
        layer.msg("复制成功!");
    });
    function doSomething(){
        setTime();
        //改变表格头样式
        $("#orderDetailsList thead tr th").removeClass("layui-bg-cyan");
        $("#orderDetailsList thead tr th").addClass("printStyle");
        //改变表格主样式
        $("#orderDetailsList tbody tr td").removeClass("title");
        $("#orderDetailsList tbody tr").addClass("printStyle");
        $("#orderDetailsList tbody tr td").addClass("printStyle");
        //改变表格底部样式
        $("#footPanel span").addClass("printStyle");
        window.print();
        //还原表格头样式
        $("#orderDetailsList thead tr th").removeClass("printStyle");
        $("#orderDetailsList thead tr th").addClass("layui-bg-cyan");
        //还原表格主样式
        $("#orderDetailsList tbody tr .colspans").addClass("title");
        $("#orderDetailsList tbody tr").removeClass("printStyle");
        $("#orderDetailsList tbody tr td").removeClass("printStyle");
        //还原表格底部样式
        $("#footPanel span").removeClass("printStyle");
    }
    function setTime(){
        if(window.localStorage) {
            let time = localStorage.getItem('time');
            time ? time ++ : time = 1;
            localStorage.setItem('time', time);
        }
    }
    //监听结束
    var aes_key = "likai";
    var aes_iv = "1195419506";
    /*获取get请求中的参数*/
    var operator_aes = Af.getQueryString("operator");
    var orderNumber_aes = Af.getQueryString("orderNumber");
    if(operator_aes==null||orderNumber_aes==null)
    {
        $("body").html("<h1 style='color: red'>链接中没有get参数!</h1>");
        layer.msg("链接错误!");
        return;
    }
    var num = 0;
    /*解密*/
    var operator = CryptoJS.AES.decrypt(operator_aes, aes_key,aes_iv).toString(CryptoJS.enc.Utf8);
    var orderNumber = CryptoJS.AES.decrypt(orderNumber_aes, aes_key,aes_iv).toString(CryptoJS.enc.Utf8);
    if(!Af.nullstr(operator)&&!Af.nullstr(orderNumber))
    {
        var req = {
            "operator":operator,
            "orderNumber":orderNumber,
            "queryType":["modelDetails","companyName","clientName","projectName","orderNumber","glassNumber","totalArea","totalAmount","unpaid"],
            "getOtherInfo":""
        };
        Af.rest("orderInfonQueiry.api",req,function (ans) {
            if(ans.errorCode==0)
            {
                var data = ans.data;
                var dataArrayArr = data[0].modelDetails;
                var dataArray = JSON.parse(dataArrayArr);
                var companyName = data[0].companyName; //--->公司名称
                var clientName = data[0].clientName; //--->客户名称
                var projectName = data[0].projectName; //--->工程名称
                var orderNumber = data[0].orderNumber; //--->订单号
                var glassNumber = data[0].glassNumber; //--->玻璃数量
                var totalArea = data[0].totalArea; //--->总面积
                var totalAmount = data[0].totalAmount; //--->总金额
                var unpaid = data[0].unpaid; //--->未付款
                /*渲染页面内数据*/
                $("#citizenName").html(companyName);
                $("#clientNameVal").html(clientName);
                $("#projectNameVal").html(projectName);
                $("#orderNumberVal").html(orderNumber);
                $("#theTotalNumber").html(glassNumber);
                $("#theTotalArea").html(totalArea);
                $("#totalAmount").html(totalAmount);
                $("#unpaidVal").html(unpaid);
                /*渲染订单详情表格*/
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
                        td7,
                        td8;
                    var tdType1 = "<td colspan='5' class='title colspans'>";
                    var tdType2 = "<td colspan='2' class='title colspans'>";
                    var tdType3 = "<td colspan='1' class='title colspans'>";
                    var dataArrayLength = Af.getJsonLength(dataArray[i]); //---->获取当前JSONArray下的数据长度
                    if (dataArrayLength > 1) {
                        let nowTotalArea = 0;
                        let nowTotalMoney = 0;
                        num++;
                        for (let k = 0; k < dataArrayLength; k++)
                        {
                            let itemMoney = dataArray[i][k].totalAmount;
                            let itemArea = dataArray[i][k].glassArea;
                            nowTotalArea = Af.accAdd(itemArea,nowTotalArea);
                            nowTotalMoney = Af.accAdd(itemMoney,nowTotalMoney);
                        }
                        $("#orderDetailsList  tbody").append(trStart + tdType1 + "规格型号:" + dataArray[i][0].productName+"</td>"+tdType3+"面积(小计):"+nowTotalArea+"</td>"+tdType2+"金额(小计):"+nowTotalMoney+"</td>"+ trEnd);
                        for (let j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                        {
                            let unitPrice = dataArray[i][j].unitPrice;
                            td = "<td>" + Number(j+1) + "</td>";
                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                            if(Af.nullstr(unitPrice)){
                                td7 = "<td>" + "  " + "</td>";
                            }
                            else{
                                td7 = "<td>" + unitPrice + "</td>";
                            }
                            td8 = "<td>" + dataArray[i][j].totalAmount + "</td>";
                            $("#orderDetailsList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                        }

                    } else {
                        let nowTotalArea = 0;
                        let nowTotalMoney = 0;
                        for (let k = 0; k < dataArrayLength; k++)
                        {
                            let itemMoney = dataArray[i][k].totalAmount;
                            let itemArea = dataArray[i][k].glassArea;
                            nowTotalArea = Af.accAdd(itemArea,nowTotalArea);
                            nowTotalMoney = Af.accAdd(itemMoney,nowTotalMoney);
                        }
                        $("#orderDetailsList  tbody").append(trStart + tdType1 + "规格型号:" + dataArray[i][0].productName+"</td>"+tdType3+"面积(小计):"+nowTotalArea+"</td>"+tdType2+"金额(小计):"+nowTotalMoney+"</td>"+ trEnd);
                        for (var j = 0; j < dataArrayLength; j++) //---->遍历当前重复的规格型号下的数据,并追加页面
                        {
                            let unitPrice = dataArray[i][j].unitPrice;
                            td = "<td>" + Number(j+1) + "</td>";
                            td1 = "<td>" + dataArray[i][j].glassLength + "</td>";
                            td2 = "<td>" + dataArray[i][j].glassWidth + "</td>";
                            td3 = "<td>" + dataArray[i][j].glassNum + "</td>";
                            td4 = "<td>" + dataArray[i][j].glassMark + "</td>";
                            td5 = "<td>" + dataArray[i][j].glassArea + "</td>";
                            if(Af.nullstr(unitPrice)){
                                td7 = "<td>" + "  " + "</td>";
                            }
                            else{
                                td7 = "<td>" + unitPrice + "</td>";
                            }
                            td8 = "<td>" + dataArray[i][j].totalAmount + "</td>";
                            $("#orderDetailsList  tbody").append(trStart + td + td1 + td2 + td3 + td4 + td5 + td7 + td8 + trEnd); //---->追加到页面
                        }
                    }
                }
            }
            else{
                layer.msg("链接错误!");
                $("body").html("<h1>服务器错误!</h1>");
            }
        });
    }
    else
    {
        $("body").html("<h1 style='color: red'>链接不存在!</h1>");
        layer.msg("链接错误");
        return;
    }

});