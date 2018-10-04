package com.lk.Utils;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;

public class TencentSendSMS
{
	// 腾讯云短信应用SDK AppID
	int appid = 1400135339;
	// 腾讯云短信应用SDK AppKey
	String appkey = "8ddaa415342e5265553e5fd7aeb8813e";
	// 签名
	String smsSign = "凯枫管理";
	//商家手机号
	String MerchantCellphone = "18710414548";
	//构造返回数据
	JSONObject jsonObj = new JSONObject();
	// 短信模板ID
	/*方法参数说明:
	 * templateId : 短信内容模板ID
	 * cellPhone  : 客户手机号
	 * username : 客户姓名
	 * ServiceType : 服务类型
	 * Address ：客户地址
	 * HomeAmount ：上门费用
	 * */
	public JSONObject sendSMS(int templateId,String cellPhone,String username,String ServiceType,String Address,String HomeAmount)
	{
		/*根据模板id判断模板类型*/
		if(templateId ==184719)
		{
			//客户端短信模板
			try
			{
				/*
				 *params 数组，用于替换模板对应的数据
				 */
				String[] params =
				{ username, ServiceType };
				SmsSingleSender ssender = new SmsSingleSender(appid, appkey);
				SmsSingleSenderResult result = ssender.sendWithParam("86", cellPhone, templateId, params, smsSign, "", ""); 
				jsonObj.put("SMSCode", result.result);
				jsonObj.put("errmsg", result.errMsg);
				jsonObj.put("ext", result.ext);
				
			} catch (HTTPException e)
			{
				// HTTP响应码错误
				e.printStackTrace();
			} catch (JSONException e)
			{
				// json解析错误
				e.printStackTrace();
			} catch (IOException e)
			{
				// 网络IO错误
				e.printStackTrace();
			}
		}
		else
		{
			//商家
			try
			{
				/*
				 *params 数组，用于替换模板对应的数据
				 */
				String[] params =
				{ username, ServiceType,cellPhone, Address,HomeAmount};
				SmsSingleSender ssender = new SmsSingleSender(appid, appkey);
				SmsSingleSenderResult result = ssender.sendWithParam("86", MerchantCellphone, templateId, params, smsSign, "", "");
				jsonObj.put("SMSCode", result.result);
				jsonObj.put("errmsg", result.errMsg);
				jsonObj.put("ext", result.ext);
			} catch (HTTPException e)
			{
				// HTTP响应码错误
				e.printStackTrace();
			} catch (JSONException e)
			{
				// json解析错误
				e.printStackTrace();
			} catch (IOException e)
			{
				// 网络IO错误
				e.printStackTrace();
			}
		}
		return jsonObj;
	}
}
