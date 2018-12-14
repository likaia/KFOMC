var oldurl = "";

/* 第一层(外层)使用双引号，第二层使用单引号 */
var Af = {};

/* RESTful 调用的封装 
 *  示例  Af.rest("XXX.api", jsReq, onSubmit_Result);	
 */

/*servlet请求*/
Af.servletRest = function(URI, ARGS, SUCCESS_CALLBACK, ERROR_CALLBACK) {
	jQuery.ajax({
		url : URI, // <--	
		method : "POST",
		data : ARGS,
		success : function(data, textStatus, jqXHR) {
			SUCCESS_CALLBACK(data); // <--
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (typeof ERROR_CALLBACK != "undefined" && ERROR_CALLBACK != null)
				ERROR_CALLBACK(errorThrown);else {
				if (errorThrown.length > 0) alert("error: " + errorThrown);
			}
		}
	});
};

Af.rest = function(URI, ARGS, SUCCESS_CALLBACK, ERROR_CALLBACK) {
	jQuery.ajax({
		url : URI, // <--			
		method : "POST",
		processData : false,
		data : JSON.stringify(ARGS), // <--
		success : function(data, textStatus, jqXHR) {
			SUCCESS_CALLBACK(JSON.parse(data)); // <--
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (typeof ERROR_CALLBACK != "undefined" && ERROR_CALLBACK != null)
				ERROR_CALLBACK(errorThrown);else {
				if (errorThrown.length > 0) alert("error: " + errorThrown);
			}
		}
	});
};
//获取get传值的方法(获取url地址)
Af.getQueryString = function(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(decodeURI(r[2])); return null;//--->解决中文乱码
};

/* 判断一个字符串是否为空
 *  */
Af.nullstr = function(v) {
	return v == null || v.length == 0;
};

/*JSON数据精确合并:*/
Af.preciseMerger = function(arr){
    var objs = [];
    var flag = true;
    for(let i = 0; i < arr.length;i++){
        let area = parseInt(arr[i].glassLength) * parseInt(arr[i].glassWidth);
        for(let j=0;j<objs.length;j++){
            let objsArea =  parseInt(objs[j].glassLength) * parseInt(objs[j].glassWidth);
            if(area == objsArea){
                objs[j].glassNum = parseInt(objs[j].glassNum) + parseInt(arr[i].glassNum); //--->玻璃总数量相加
                objs[j].glassArea = parseFloat(objs[j].glassArea) + parseFloat(arr[i].glassArea); //--->玻璃总面积相加
                objs[j].glassArea = objs[j].glassArea.toFixed(2); //--->保留2位小数
                objs[j].totalAmount = parseInt(objs[j].totalAmount) + parseInt(arr[i].totalAmount); //--->总金额相加
                flag = false;
                break;
            }
            else{
                flag = true;
            }
        }
        if(flag){
            objs.push(arr[i]);
        }
    }
    return objs;
};
/*JSON数据模糊合并*/
Af.fuzzyMerger = function (arr) {
    function sortLength(a, b) {
        return a.glassLength - b.glassLength;
    }

    function sortWidth(a, b) {
        return parseInt(a.glassWidth) - parseInt(b.glassWidth);
    }

    function averageLength(x) {
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            value += parseInt(x[i].glassLength);
        }
        return Math.round(value / x.length);
    }

    function averageWidth(x) {
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            value += parseInt(x[i].glassWidth);
        }
        return Math.round(value / x.length);
    }
    var objs = [];
    var obj = {}; //单个json对象
    var somes = []; //保存长度符合的数组
    var somesNum = 0; //记录的glassNum数量
    var somesArea = 0.0;

    var exclude_objs = [];
    var exclude_obj_num = 0;
    var exclude_obj_area = 0.0;
    var id = 0;
    //按照长度进行排序
    arr.sort(sortLength);
    while (arr.length > 0) {

        var arr_obj = arr.shift(); //每次取出都是第一个数据

        if (somes.length == 0) {
            somes.push(arr_obj);
            somesNum = parseInt(arr_obj.glassNum);
            somesArea = parseFloat(arr_obj.glassArea);
        } else if (somes.length > 0 && arr_obj.productName == somes[0].productName && parseInt(arr_obj.glassLength) - parseInt(somes[0].glassLength) <= 6) { //先把符合宽度的数据放进来
            somes.push(arr_obj);
            somesNum += parseInt(arr_obj.glassNum);
            somesArea += parseFloat(arr_obj.glassArea);
        } else {
            //当所有符合宽度和名称的要求判断完毕后，再把不符合宽度要求的数取出来
            somes = somes.sort(sortWidth); //对宽度进行排序，每次判断最后一个宽度和第一个宽度是不是相差6
            while (parseInt(somes[somes.length - 1].glassWidth) - parseInt(somes[0].glassWidth) > 6) {
                var exclude_obj = somes.pop(); //弹出最后面不符合要求的数据
                somesNum -= parseInt(exclude_obj.glassNum);
                somesArea -= parseFloat(exclude_obj.glassArea);
                arr.push(exclude_obj);
            }

            arr.push(arr_obj); //前面判断长度或者产品名称数据没通过，再把取出来的数据放进去，然后进行排序
            arr.sort(sortLength);

            var averLength = averageLength(somes).toString();
            var averWidth = averageWidth(somes).toString();

            obj.id = id;
            obj.productName = somes[0].productName;
            obj.glassLength = averLength;
            obj.glassWidth = averWidth;
            obj.glassNum = somesNum;
            obj.glassMark = "#0";
            obj.glassArea = Math.floor(somesArea * 100) / 100;
            obj.unitPrice = "#0";
            obj.totalAmount = "#0";
            objs.push(obj);

            somes = [];
            somesNum = 0;
            somesArea = 0.0;
            obj = {};
            id++;
        }

    }

    //上面处理后，筛选出来的数据就是长度和产品名称相同的，但是宽度不一定相同的数据
    somes.sort(sortWidth);
    while (somes.length > 0) {
        var some_obj = somes.shift();
        if (exclude_objs.length == 0) {
            exclude_objs.push(some_obj);
            exclude_obj_num = parseInt(some_obj.glassNum);
            exclude_obj_area = parseFloat(some_obj.glassArea);
        } else if (exclude_objs.length > 0 && parseInt(some_obj.glassWidth) - parseInt(exclude_objs[0].glassWidth) <= 6) {
            exclude_objs.push(some_obj);
            exclude_obj_num += parseInt(some_obj.glassNum);
            exclude_obj_area += parseFloat(some_obj.glassArea);
        } else {

            somes.push(some_obj);
            somes.sort(sortWidth);

            var averLength = averageLength(exclude_objs).toString();
            var averWidth = averageWidth(exclude_objs).toString();

            obj.id = id;
            obj.productName = exclude_objs[0].productName;
            obj.glassLength = averLength;
            obj.glassWidth = averWidth;
            obj.glassNum = exclude_obj_num;
            obj.glassMark = "#0";
            obj.glassArea = Math.floor(exclude_obj_area * 100) / 100;
            obj.unitPrice = "#0";
            obj.totalAmount = "#0";
            objs.push(obj);

            exclude_objs = [];
            exclude_obj_num = 0;
            exclude_obj_area = 0.0;
            obj = {};
            id++;
        }
    }

    //经过上一步的处理，最后还剩的数据就是长度，宽度，名称都相同的，直接算
    if (exclude_objs.length != 0) {
        var averLength = averageLength(exclude_objs).toString();
        var averWidth = averageWidth(exclude_objs).toString();

        obj.id = id;
        obj.productName = exclude_objs[0].productName;
        obj.glassLength = averLength;
        obj.glassWidth = averWidth;
        obj.glassNum = exclude_obj_num;
        obj.glassMark = "#0";
        obj.glassArea = Math.floor(exclude_obj_area * 100) / 100;
        obj.unitPrice = "#0";
        obj.totalAmount = "#0";
        objs.push(obj);
    }
    return objs;
};
/*多维数组转一维数组函数*/
Af.arrayConversion = function (arr) {
    let editRawData = [];
    for (var i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            Af.arrayConversion(arr[i]);
        } else {
            editRawData.push(arr[i]);
        }
    }
    return editRawData;
};
/*判断字符串长度*/
Af.getStringLength = function(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

/*公用layer删除函数*/
Af.layerDel = function(strArr,api){
    layer.confirm("你确定要删除第所选择的数据吗?", function (index) {
        let idsStr = strArr.toString();  //--->将选择的数组格式化为字符串
    	var req = {
        	"delSupplier":"delSupplier",
			"ids":Af.strToIntArr(idsStr),//将String字符串转int数组
			"operator":$("#nickNameTextPanel").html()
		};
    	Af.rest(api,req,function (ans) {
			if(ans.errorCode==0)
			{
                layer.close(index);
                layer.msg("删除成功");
                return true;
			}
			else{
				layer.msg(ans.msg);
				return false;
			}
        });
    });
};
/*公用layer悬浮层*/
Af.openSubmenu = function(title,[width,height],status,container){
    layer.open({
        title: title,
        type: 1,
        area: [width, height],
        shadeClose : status, //点击遮罩关闭
        content: container,
        success:function(){

        },
        end: function () { //弹层销毁出发回调

        }
    });
};

/* 检测屏幕方向
 window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
       if (window.orientation === 180 || window.orientation === 0) {
           alert("竖屏");
       }
       if (window.orientation === 90 || window.orientation === -90 ){
           alert("横屏");
       }
   }, false);*/

/*小数加法函数*/
/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
Af.accAdd = function(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/*JSONArray归类*/
Af.getJSONArray = function(resultJSONArray) {
	var list = resultJSONArray,
		flag = 0,
		data = [];
	for (var i = 0; i < list.length; i++) {
		var az = '';
		for (var j = 0; j < data.length; j++) {
			if (data[j][0].productName == list[i].productName) {
				flag = 1;
				az = j;
				break;
			}
		}
		if (flag == 1) {
			data[az].push(list[i]);
			flag = 0;
		} else if (flag == 0) {
			wdy = new Array();
			wdy.push(list[i]);
			data.push(wdy);
		}

	/*	    
	 * 中文key
	 * if(!data[list[i].productName]) {
		        var arr = [];
		        arr.push(list[i]);
		        data[list[i].productName] = arr;
		    }else {
		        data[list[i].productName].push(list[i])
		    }*/
	}
	return data;
};

/*删除二维数组元素*/
Af.removeDyadicArray = function(rawData,rowLine,item){
    rawData[rowLine].splice([item],1);
    return rawData;
};

//获取select选中的文本内容
Af.getSelectText = function(selectPanel){
    var thisVal = $(selectPanel).find("option:selected").text();
    return thisVal;
};
/*获取JSONArray长度*/
Af.getJsonLength = function(jsonData) {
	var jsonLength = 0;
	for (var item in jsonData) {
		jsonLength++;
	}
	return jsonLength;
}
/*String字符串转int[]*/
Af.strToIntArr = function(ordersStr){
	var ordersStrArr=ordersStr.split(",");//分割成字符串数组
	var ordersIntArr=[];//保存转换后的整型字符串
	ordersStrArr.forEach(function(data,index,arr){
		ordersIntArr.push(+data);
	});
	return ordersIntArr;
}

/* 输出日志 */
Af.trace = function(msg) {
	try {
		console.log(msg);
	} catch (err) {}
};


//一个类型
function AfTag(name, pair) {
	this.name = name; // 标签名 		
	this.attrList = {}; // 属性
	this.innerHtml = ""; // 内容
	this.pair = pair; // 是否成对标签  		

	// 添加attr
	this.a = function(attrName, attrValue) {
		this.attrList[attrName] = attrValue;
		return this;
	};
	this.aa = function(attrName, attrValue) {
		if (this.attrList[attrName] == null)
			this.attrList[attrName] = attrValue;
		else
			this.attrList[attrName] += (" " + attrValue);
		return this;
	};
	//
	this.t = function(innerHtml) {
		this.innerHtml = innerHtml;
		return this;
	};
	this.tt = function(innerHtml) {
		this.innerHtml += innerHtml;
		return this;
	};
	// 转成html
	this.toHtml = function() {
		var htmlAttr = "";
		for (attrName in this.attrList) {
			var attrValue = this.attrList[attrName];
			var str = " " + attrName + "='" + attrValue + "'" + " ";
			htmlAttr += str;
		}

		if (false == this.pair) // 单标签
		{
			return "<" + name + htmlAttr + "/>" // <img />;
		} else // 成对标签 
		{
			return "<" + name + htmlAttr + ">" // <div>
				+ this.innerHtml
				+ "</" + name + ">" // </div>;
		}
	};
}

/* 以逗号分隔的ID列表 */
function AfIdList() {
	this.ids = [];

	this.aa = function(str) {
		if (str == null || str.length == 0) return this;
		var sss = str.split(",");
		for (var i = 0; i < sss.length; i++) {
			var it = sss[i];
			if (it.length > 0 && !this.contains(it)) {
				this.ids.push(it);
			}
		}
		return this;
	};
	this.at = function(index) {
		if (this.ids.length == 0) return null;
		return this.ids[index];
	};
	this.contains = function(id) {
		for (var i = 0; i < this.ids.length; i++) {
			if (id == this.ids[i]) return true;
		}
		return false;
	};
	this.size = function() {
		return this.ids.length;
	};
	this.toString = function() {
		return this.ids.join(",");
	}
}

/* 可以按ID查询的表 */
function AfMap() {
	this.array = [];

	this.put = function(id, obj) {
		/* 检查重复, 如果已经存在直接替换 */
		for (var i = 0; i < this.array.length; i++) {
			var e = this.array[i];
			if (e.id == id) {
				e.obj = obj;
				return;
			}
		}
		/* 添加新的项 */
		var e = {};
		e.id = id;
		e.obj = obj;
		this.array.push(e);
	};

	this.get = function(id) {
		for (var i = 0; i < this.array.length; i++) {
			var e = this.array[i];
			if (e.id == id)
				return e.obj;
		}
		return null;
	};

	this.size = function() {
		return this.array.length;
	};

	this.clear = function() {
		this.array = [];
	};

	this.values = function() {
		var values = [];
		for (var i = 0; i < this.array.length; i++) {
			var e = this.array[i];
			values.push(e.obj);
		}
		return values;
	};
}

Af.indexOf = function(value, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == value) return i;
	}
	return -1;
};
Af.indexOf2 = function(value, strlist) {
	var array = strlist.split(",");
	var v1 = value + ""; // 转成字符串
	for (var i = 0; i < array.length; i++) {
		var v2 = array[i] + "";
		if (v1 == v2) return i;
	}
	return -1;
};

/* 省略的名称显示 */
Af.short = function(title, N) {
	if (title.length <= N)
		return title;
	else
		return title.substr(0, N) + "...";
};

/* 列表的选择 */
/* 显示用户的当前的选项: container:父级窗口, options:数组, 要设置为选中的项 */
Af.set_options = function(container, options) {
	// 先清空所有选中项
	var boxes = $("[type='checkbox']", container);
	boxes.prop("checked", false);

	if (options == null) return;
	//var sss = options.split(",");

	var boxes = $("[type='checkbox']", container);
	for (var i = 0; i < boxes.length; i++) {
		var box = $(boxes[i]);
		var id = box.attr("id1");
		if (Af.indexOf(id, options) >= 0) {
			box.prop("checked", true);
		}
	}
};
/* 取得用户选中的项 */
Af.get_options = function(container) {
	var options = [];
	var boxes = $("[type='checkbox']", container);
	for (var i = 0; i < boxes.length; i++) {
		var box = $(boxes[i]);
		if (box.prop("checked")) {
			var id = box.attr("id1");
			options.push(id);
		}
	}
	return options;
};