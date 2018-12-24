package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.json.JSONObject;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-23 17:59:13 root
  *  
* */

public class ServerTimeAPI extends AfRestfulApi
{
	
	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		// 获取当前服务器时间
		String serverTime = "";
		String msg = "ok";
		if (jsReq.has("operator"))
		{
			serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("serverTime", serverTime);
		jsReply.put("msg", msg);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}
}
