package com.lk.API;

import org.json.JSONArray;
import org.json.JSONObject;

import af.restful.AfRestfulApi;

/*进货信息管理*/
public class PurchaseInfo extends AfRestfulApi
{

	@Override
	public String execute(String reqText) throws Exception
	{
		/*前端必发数据*/
		String operator = "";
		JSONObject jsReq= new JSONObject(reqText);
		/*回传给前端的数据*/
		int errorCode = 0;
		int code = 0;
		JSONArray result = new JSONArray();
		String msg = "ok";
		/*安卓端返回数据*/
		String androidData = "";
		
		
		
		/*构造返回对象*/
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		return jsReply.toString();
	}

}
