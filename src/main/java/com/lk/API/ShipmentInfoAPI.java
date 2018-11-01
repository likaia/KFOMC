package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.OrderInfo;
import com.lk.db.ShipmentInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.OrderMapper;
import com.lk.mappers.ShipmentMapper;

import af.restful.AfRestfulApi;

/*出货管理*/

public class ShipmentInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(ShipmentInfoAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		JSONArray result = new JSONArray();
		JSONObject orderInfo = new JSONObject();
		long count = 0; // --->数据库数据总记录数
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		if (jsReq.has("operator"))
		{
			// 获取当前服务器时间
			String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
			operator = jsReq.getString("operator"); // --->取出操作人
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				ShipmentInfo row = new ShipmentInfo();
				row.setOperator(operator);
				List<ShipmentInfo> resultList = shipmentMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<ShipmentInfo> pageInfo = new PageInfo<ShipmentInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询
			if (jsReq.has("conditionalQuery"))
			{
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<ShipmentInfo> resultList = shipmentMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addOrderData"))
			{
				String clientName = jsReq.getString("clientName");// --->客户名称
				String clientId = jsReq.getString("clientId"); //--->客户id
				String dateOfShipment = serverTime; // --->下单日期
				JSONArray specificationModel = jsReq.getJSONArray("specificationModel"); // --->已发货数据
				JSONArray unfinishedArr = jsReq.getJSONArray("unfinishedArr");// --->未发货数据
				String numberShipments = jsReq.getString("numberShipments");// --->发货数量
				String shipArea = jsReq.getString("shipArea");// --->发货面积
				String theTotalAmount = jsReq.getString("theTotalAmount");// --->发货金额
				String theRemainingAmount = jsReq.getString("theRemainingAmount");// --->剩余数量 
				String remainingArea = jsReq.getString("remainingArea");// --->剩余面积
				String paymentDetails = jsReq.getString("paymentDetails");// --->付款明细
				String transportationManager = jsReq.getString("transportationManager");// --->运输负责人
				String freight = jsReq.getString("freight");// --->运费
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo(clientName, dateOfShipment, specificationModel.toString(),
						unfinishedArr.toString(), theTotalAmount, numberShipments, shipArea,
						theRemainingAmount , remainingArea, paymentDetails, transportationManager, freight,
						operator);
				int processResult = shipmentMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "新增出货信息成功";
					/*查询订单表*/
					// 配置映射器
					OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
					/*查询 工程名称/订单号/联系电话/送货地址/订单日期/未付款金额*/
					String[] queryArr = {"projectName","orderNumber","contactNumber","deliveryAddress","orderDate","unpaid"};
					JSONArray queryType = new JSONArray(queryArr);
					String orderNumber = "";
					OrderInfo rows = new OrderInfo();
					rows.setQueryType(queryType);
					rows.setOperator(operator);
					int id = Integer.valueOf(clientId);
					rows.setId(id);
					rows.setClientName(clientName);  //根据 (id 客户名称 操作人 查询数据) 
					List<OrderInfo> resultList = orderMapper.customQuery(rows);
					JSONArray resultArr = new JSONArray(resultList);
					/*取出Array中的数据,构造前端需要的数据*/
					if(resultArr.length()>0)
					{
						for(int i = 0;i<resultArr.length();i++)
						{
							JSONObject resultObj = resultArr.getJSONObject(i);
							/*工程名称/订单号/联系电话/送货地址/订单日期/发货日期/未付款金额*/
							orderInfo.put("invoiceProjectName", resultObj.getString("projectName"));
							orderInfo.put("invoiceOrderNumber", resultObj.getString("orderNumber"));
							orderNumber =  resultObj.getString("orderNumber");
							orderInfo.put("invoiceContactNumber", resultObj.getString("contactNumber"));
							orderInfo.put("invoiceDeliveryAddress",resultObj.getString("deliveryAddress"));
							orderInfo.put("invoiceOrderDate", resultObj.getString("orderDate"));
							orderInfo.put("invoiceDateOfShipment", serverTime);
							orderInfo.put("unpaid", resultObj.getString("unpaid"));
						}
					}
					else
					{
						code =1;
						errorCode =1;
						msg = "该订单状态异常(不存在)";
						logger.error("出货管理[新增],查询订单信息状态异常!");
					}
					String totalGlassNumber = ""; //--->总数量
					String totalArea = ""; //--->总面积
					//根据(订单号 客户名称 id 操作人)查询 总数量 总面积
					OrderInfo orderRowQuery = new OrderInfo();
					orderRowQuery.setOperator(operator);
					orderRowQuery.setClientName(clientName);
					orderRowQuery.setId(id);
					orderRowQuery.setOrderNumber(orderNumber);
					List<OrderInfo> accurateList = orderMapper.accurateFind(orderRowQuery);
					JSONArray accurate = new JSONArray(accurateList);
					if(accurate.length()>0)
					{
						for(int i = 0;i<accurate.length();i++)
						{
							JSONObject accurateObj = accurate.getJSONObject(i);
							totalGlassNumber = accurateObj.getString("glassNumber"); //--->总数量
							totalArea = accurateObj.getString("totalArea"); //--->总面积
						}
					}
					//赋值订单数据表余下字段  
					OrderInfo Nowrows = new OrderInfo();
					//类型转换(String--->float)
					int theRemainingAmountInt = Integer.parseInt(theRemainingAmount); //--->剩余数量
					float remainingAreaInt =  Float.parseFloat(remainingArea);//--->剩余面积
					int totalGlassNumberInt = Integer.parseInt(totalGlassNumber); //--->总数量
					float totalAreaInt = Float.parseFloat(totalArea); //--->总面积
					/*计算 已发货数量与已发货面积*/
					int ShippedNumInt = totalGlassNumberInt - theRemainingAmountInt;
					float ShippedAreaInt =  totalAreaInt - remainingAreaInt;
					Nowrows.setNumberShipments(String.valueOf(ShippedNumInt)); //---->已发货数量 = 总数量-剩余数量
					Nowrows.setShipArea(String.valueOf(ShippedAreaInt));//---->已发货面积 = 总面积 - 剩余面积
					Nowrows.setUnfinishedArr(unfinishedArr.toString());//--->未发货的规格型号数据
					Nowrows.setOrderNumber(orderNumber);//--->根据订单号更新
					int processResults = orderMapper.update(Nowrows);
					sqlSession.commit();
					if(processResults==0)
					{
						msg = "更新订单数据表失败";
						code =1;
						errorCode =1;
					}
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败";
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delOrders"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setIds(ids);
				int processResult = shipmentMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					msg = "删除失败";
				}
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("出货管理接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("orderInfo", orderInfo);
		jsReply.put("count", count);
		return jsReply.toString();
	}

}
