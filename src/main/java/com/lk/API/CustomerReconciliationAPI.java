package com.lk.API;

import af.restful.AfRestfulApi;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.*;

import com.lk.db.ClientInfo;
import com.lk.db.OrderInfo;
import com.lk.db.ShipmentInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ClientInfoMapper;
import com.lk.mappers.OrderMapper;
import com.lk.mappers.ShipmentMapper;
/*
  * 
  *  @author  李凯
  *  @version V-2018-12-24 10:03:24 root
  *  
* */
/*客户对账*/
public class CustomerReconciliationAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(CustomerReconciliationAPI.class);

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
		JSONArray clientData = new JSONArray();
		String msg = "ok";
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			if(jsReq.has("queryClientName"))
			{
				String[] queryTypeArr = {"clientName"};
				JSONArray queryType = new JSONArray(queryTypeArr);
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				ClientInfo row  = new ClientInfo();
				row.setOperator(operator);
				row.setQueryType(queryType);
				List<ClientInfo> resultList = clientInfoMapper.customQuery(row);
				clientData = new JSONArray(resultList);
				sqlSession.close();
			}
			if(jsReq.has("queryOrderInfo"))
			{
				String clientName = jsReq.getString("clientName");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setClientName(clientName);
				row.setOperator(operator);
				/*按条件查询:(客户名称查询所有订单)*/
				List<OrderInfo> resultList = orderMapper.uniqueQuery(row);
				result = new JSONArray(resultList);
				sqlSession.close();
			}
			if(jsReq.has("queryShipInfo"))
			{
				/*根据订单号查询当前订单所有出货信息*/
				String orderNumber = jsReq.getString("orderNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setOperator(operator);
				row.setOrderNumber(orderNumber);
				List<ShipmentInfo> resultList = shipmentMapper.uniqueQuery(row);
				result = new JSONArray(resultList);
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("客户对账接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("clientData", clientData);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}
}
