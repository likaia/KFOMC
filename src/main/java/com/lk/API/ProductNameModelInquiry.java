package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.Utils.UUIDUtil;
import com.lk.db.ProductListInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ProductNumeInfoMapper;

import af.restful.AfRestfulApi;

public class ProductNameModelInquiry extends AfRestfulApi
{
	/*
	 * 	查询规格型号表，所有的品名型号字段
	 * 
	 * */
	private static Logger logger = Logger.getLogger(ProductNameModelInquiry.class);
	@Override
	public String execute(String reqText) throws Exception
	{
		int errorCode = 0;
		String msg = "ok";
		String operator = "";
		JSONArray result = new JSONArray();
		JSONObject jsReq = new JSONObject(reqText);
		if(jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			// 打开连接
			SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
			// 配置映射器
			ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
			List<ProductListInfo> resultList = productNumeInfoMapper.customQuery();
			sqlSession.close(); //-->关闭数据库连接
			result = new JSONArray(resultList);
		}
		else
		{
			errorCode = 1;
			msg = "没有操作人!";
			logger.error("查询品名型号API报错:缺少[operator]字段");
		}
		JSONObject jsReply = new JSONObject();
		//产生订单号:UUID（16位）
		String serverTime = UUIDUtil.getOrderIdByUUId();
		// 获取当前服务器时间
		String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		jsReply.put("errorCode",errorCode);
		jsReply.put("msg",msg );
		jsReply.put("nowTime",nowTime );
		jsReply.put("serverTime", serverTime);
		jsReply.put("data", result);
		jsReply.put("operator",operator );
		return jsReply.toString();
	}
	
}
