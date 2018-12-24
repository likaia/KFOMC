package com.lk.API;

import af.restful.AfRestfulApi;

import org.apache.log4j.Logger;
import org.json.*;
/*
  * 
  *  @author  李凯
  *  @version V-2018-12-24 10:03:24 root
  *  
* */
/*客户对账*/
public class CustomerReconciliationAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(ClientInfoAPI.class);

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
		String msg = "ok";
		/* 安卓端返回数据 */
		/* 定义分页需要的字段 */
		if (jsReq.has("operator"))
		{

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
		jsReply.put("operator", operator);
		return jsReply.toString();
	}
}
