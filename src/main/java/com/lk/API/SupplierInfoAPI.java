package com.lk.API;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-28 11:40:51 root
  *  
* */

public class SupplierInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(SupplierInfoAPI.class);

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
			/*分页查询接口*/
			if(jsReq.has("page")&&jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
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
		jsReply.put("count", count);
		return jsReply.toString();
	}
}
