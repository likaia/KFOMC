package com.lk.API;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.dbutil.SqlSessionFactoryUtil;

import af.restful.AfRestfulApi;

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
		long count = 0; // --->数据库数据总记录数
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator"); // --->取出操作人
			page = jsReq.getInt("page");
			limit = jsReq.getInt("limit");
			// 打开连接
			SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
			// 配置映射器
			
		}
		else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("进货管理接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}
	
}
