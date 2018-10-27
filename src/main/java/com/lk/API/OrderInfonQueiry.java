package com.lk.API;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.OrderInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.OrderMapper;

import af.restful.AfRestfulApi;

/*订单信息查询*/
public class OrderInfonQueiry extends AfRestfulApi
{
	@Override
	public String execute(String reqText) throws Exception
	{
		String operator = "";
		int errorCode = 0;
		// layui need
		int code = 0;
		String msg = "ok";
		JSONObject jsReq = new JSONObject(reqText);
		// 从请求中取出分页信息:当前页面/每页显示的数量
		int page = 0;
		int limit = 0;
		/* 要返回给用户的数据 */
		long count = 0;
		JSONArray result = new JSONArray();
		JSONArray nowOrderInfo = new JSONArray();
		String androidData = "";
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			// 订单信息:分页查询接口
			if (jsReq.has("page") || jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				OrderInfo row = new OrderInfo();
				row.setOperator(operator);
				List<OrderInfo> resultList = orderMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<OrderInfo> pageInfo = new PageInfo<OrderInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 自定义查询
			if (jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType"); // --->传JSONArray
																		// [需要获取的数据库字段名进行查询]
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setQueryType(queryType);
				row.setOperator(operator);
				List<OrderInfo> resultList = orderMapper.customQuery(row);
				result = new JSONArray(resultList);
				// 关闭链接
				sqlSession.close();
			}
			// 订单号 客户名称 工程名称 日期 查询表内数据(条件查询)
			if (jsReq.has("conditionalQuery"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String clientName = jsReq.getString("clientName");
				String projectName = jsReq.getString("projectName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (orderNumber.equals(""))
				{
					orderNumber = null;
				}
				if (clientName.equals(""))
				{
					clientName = null;
				}
				if (projectName.equals(""))
				{
					projectName = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setOperator(operator);
				row.setOrderNumber(orderNumber);
				row.setClientName(clientName);
				row.setProjectName(projectName);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				List<OrderInfo> resultList = orderMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 根据id查询规格型号
			if (jsReq.has("findModelById"))
			{
				String orderIdStr = jsReq.getString("orderId");
				int orderId = 0;
				try
				{
					orderId = Integer.parseInt(orderIdStr);
				} catch (NumberFormatException e)
				{
					e.printStackTrace();
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setId(orderId);
				List<OrderInfo> resultList = orderMapper.findModelById(row);
				/* 查询规格型号后处理成JSONArray */
				JSONArray modelDetails = new JSONArray(resultList);// ---->从List转换成JSONArray
				JSONObject modelDetailsOBJ = modelDetails.getJSONObject(0); // --->从JSONArray中取出JSONObject型数据
				String modelDetailsArr = modelDetailsOBJ.getString("modelDetails"); // ---->从JSONObject中取出String型Array数据
				result = new JSONArray(modelDetailsArr); // ---->转化为JSONArray
				/* 查询规格型号后处理成JSONArray结束 */
				sqlSession.close();
			}
			// 新增订单信息
			if (jsReq.has("addOrderData"))
			{
				String orderNumber = jsReq.getString("orderNumber");// --->订单号
				String clientName = jsReq.getString("clientName"); // -->客户名称
				String projectName = jsReq.getString("projectName");// -->工程名称
				String deliveryAddress = jsReq.getString("deliveryAddress");// --->送货地址
				String orderDate = jsReq.getString("time");// ---->日期
				String contactNumber = jsReq.getString("contactNumber");// --->联系电话
				String shippingMethod = jsReq.getString("ShippingMethod");// -->发货方式
				String preparedBy = jsReq.getString("billingPreparedBy");// --->制单人
				String glassNumber = jsReq.getString("glassNumber"); // --->玻璃数量
				String totalArea = jsReq.getString("totalArea");// --->总面积
				String additionalFees = jsReq.getString("otherCost");// ---->其他费用
				String totalAmount = jsReq.getString("totalAmount");// --->总金额
				String remarks = jsReq.getString("remarks");// --->备注
				String alreadyPaid = jsReq.getString("Paid");// --->已付款
				String unpaid = jsReq.getString("Unpaid");// --->未付款
				JSONArray modelDetails = jsReq.getJSONArray("data");// --->规格型号
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setOperator(operator);
				row.setOrderNumber(orderNumber);
				row.setClientName(clientName);
				row.setProjectName(projectName);
				row.setDeliveryAddress(deliveryAddress);
				row.setOrderDate(orderDate);
				row.setContactNumber(contactNumber);
				row.setShippingMethod(shippingMethod);
				row.setPreparedBy(preparedBy);
				row.setGlassNumber(glassNumber);
				row.setTotalArea(totalArea);
				row.setAdditionalFees(additionalFees + "元");
				row.setTotalAmount(totalAmount + "元");
				row.setRemarks(remarks);
				row.setAlreadyPaid(alreadyPaid + "元");
				row.setUnpaid(unpaid + "元");
				row.setModelDetails(modelDetails.toString());
				int processResult = orderMapper.add(row);
				sqlSession.commit();
				sqlSession.close();
				if (processResult == 1)
				{
					System.out.println("订单信息表添加一条信息成功!");
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "数据库异常!数据添加失败";
				}
			}
			// 刪除订单
			if (jsReq.has("delOrders"))
			{
				JSONArray orders = jsReq.getJSONArray("orders");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setOrders(orders);
				row.setOperator(operator);
				int processResult = orderMapper.del(row);
				sqlSession.commit();
				sqlSession.close();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					msg = "删除失败";
				}
			}
			// 查询规格型号
			if (jsReq.has("queryModelDetails"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setOrderNumber(orderNumber);
				List<OrderInfo> resultList = orderMapper.queryModelDetails(row);
				// 查询当前订单下所有字段
				List<OrderInfo> nowOrderInfoList = orderMapper.queryNowOrderInfo(row);
				nowOrderInfo = new JSONArray(nowOrderInfoList);
				JSONArray modelDetails = new JSONArray(resultList);// ---->从List转换成JSONArray
				JSONObject modelDetailsOBJ = modelDetails.getJSONObject(0); // --->从JSONArray中取出JSONObject型数据
				String modelDetailsArr = modelDetailsOBJ.getString("modelDetails"); // ---->从JSONObject中取出String型Array数据
				result = new JSONArray(modelDetailsArr); // ---->转化为JSONArray
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "没有操作人!";
		}
		// 从数据库得到数据 发送给前端
		JSONObject jsReply = new JSONObject();
		jsReply.put("code", code);
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("nowOrderInfo", nowOrderInfo);
		jsReply.put("androidData", androidData);
		jsReply.put("count", count);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}

}
/*
 * JSONArrayString 转 JSONArray String test = jsReply.getString("androidData");
 * JSONArray test2 = new JSONArray(test.substring(1,test.length()-1));
 */