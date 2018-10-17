package com.lk.API;

import org.json.JSONObject;

import com.lk.Utils.UUIDUtil;

import af.restful.AfRestfulApi;

public class GetOrderNumberAPI extends AfRestfulApi
{
/*获取订单号接口*/
	@Override
	public String execute(String reqText) throws Exception
	{
		//产生订单号:UUID（16位）
		String orderNumber = UUIDUtil.getOrderIdByUUId();
		JSONObject jsReply = new JSONObject();
		jsReply.put("msg", "订单号获取成功!");
		jsReply.put("orderNumber", orderNumber);
		return jsReply.toString();
	}
	
}
