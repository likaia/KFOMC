package com.lk.API;

import java.text.DecimalFormat;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.db.IncomeInfo;
import com.lk.db.OutlayInfo;
import com.lk.db.ShipmentInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.IncomeInfoMapper;
import com.lk.mappers.OutlayInfoMapper;
import com.lk.mappers.ShipmentMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 21:27:58 root
  *  
* */

public class FinancialStateAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(FinancialStateAPI.class);

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
		long count = 0; // --->数据库数据总记录数
		String msg = "ok";
		Double TotalIncome = 0.00; //--->总收入 
		Double TotalOutlay = 0.00; //--->总支出
		Double  TotalBalance = 0.00; //--->总余额
		Double TotalShippingArea = 0.00;//--->总发货面积
		int TotalOrders = 0;  //---->总发货单数量
		/* 安卓端返回数据 */
		String androidData = "";
		 DecimalFormat df = new DecimalFormat("0.00"); //--->保留小数位数
		/* 定义分页需要的字段 */
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			/*查询: (收入表,支出表,出货表) 总金额,计算 总收入/总支出/总余额/总发货面积/总订单数*/
			if(jsReq.has("getIndexData"))
			{
				String dStart = null;
				String dEnd = null;
				if(jsReq.has("dStart"))
				{
					dStart = jsReq.getString("dStart");
				}
				if(jsReq.has("dEnd"))
				{
					dEnd = jsReq.getString("dEnd");
				}
				//构造查询条件
				String[] queryTypeArr = {"paymentAmount"};
				String[] shipQueryTypeArr = {"shipArea"};
				JSONArray queryType = new JSONArray(queryTypeArr);
				JSONArray shipQueryType = new JSONArray(shipQueryTypeArr);
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置收入接口映射器
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				IncomeInfo IncomeInfoRow = new IncomeInfo();/*--->配置收入所需要的实体类*/
				IncomeInfoRow.setQueryType(queryType);
				IncomeInfoRow.setOperator(operator);
				IncomeInfoRow.setdStart(dStart);
				IncomeInfoRow.setdEnd(dEnd);
				List<IncomeInfo>  IncomeInfoResultArr = incomeInfoMapper.customQuery(IncomeInfoRow);
				JSONArray IncomeInfoResult = new JSONArray(IncomeInfoResultArr);
				//配置支出接口映射器
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				OutlayInfo outlayInfoRow = new OutlayInfo();
				outlayInfoRow.setQueryType(queryType);
				outlayInfoRow.setOperator(operator);
				outlayInfoRow.setdStart(dStart);
				outlayInfoRow.setdEnd(dEnd);
				List<OutlayInfo> OutlayInfoResultArr = outlayInfoMapper.customQuery(outlayInfoRow);
				JSONArray OutlayInfoResult = new JSONArray(OutlayInfoResultArr);
				//配置出货接口映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo shipmentRow = new ShipmentInfo();
				shipmentRow.setOperator(operator);
				shipmentRow.setQueryType(shipQueryType);
				shipmentRow.setdStart(dStart);
				shipmentRow.setdEnd(dEnd);
				List<ShipmentInfo> shipmentList = shipmentMapper.customQuery(shipmentRow);
				JSONArray shipmentResult = new JSONArray(shipmentList);
				sqlSession.close();
				/*计算(总收入/总支出/总金额/总发货面积)*/
				if(IncomeInfoResult.length()>0)
				{
					for(int i = 0;i<IncomeInfoResult.length();i++)
					{
						JSONObject IncomeInfoObj = new JSONObject();
						IncomeInfoObj = IncomeInfoResult.getJSONObject(i);
						Double paymentAmount = IncomeInfoObj.getDouble("paymentAmount");
						 // 计算总收入
						TotalIncome+=paymentAmount;
					}
				}
				if(OutlayInfoResult.length()>0)
				{
					for(int i = 0;i<OutlayInfoResult.length();i++)
					{
						JSONObject OutlayInfoObj = new JSONObject();
						OutlayInfoObj = OutlayInfoResult.getJSONObject(i);
						Double paymentAmount = OutlayInfoObj.getDouble("paymentAmount");
						//计算总支出
						TotalOutlay+=paymentAmount;
					}
				}
				//计算总余额
				TotalBalance = TotalIncome - TotalOutlay;
				//计算总发货面积
				if(shipmentResult.length()>0)
				{
					for(int i = 0;i<shipmentResult.length();i++)
					{
						JSONObject shipmentObj = new JSONObject();
						shipmentObj = shipmentResult.getJSONObject(i);
						Double area = shipmentObj.getDouble("shipArea");
						TotalShippingArea += area;
					}
				}
				//总出货单数量
				TotalOrders = shipmentResult.length();
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
		jsReply.put("TotalIncome", df.format(TotalIncome)); //--->总收入
		jsReply.put("TotalOutlay", df.format(TotalOutlay));//--->总支出
		jsReply.put("TotalBalance", df.format(TotalBalance));//--->总余额
		jsReply.put("TotalShippingArea", df.format(TotalShippingArea));//--->总发货面积
		jsReply.put("TotalOrders", TotalOrders);//--->总发货单数
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}
}
