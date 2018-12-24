package com.lk.API;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.lk.Utils.DeleteFileUtil;
import com.lk.Utils.LkCommon;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-23 10:18:58 root
  *  
* */
/*删除客户端上传的文件*/
public class DropFileAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(DropFileAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		LkCommon lkCommon = new LkCommon();
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		String msg = "ok";
		if (jsReq.has("operator"))
		{
			if(jsReq.has("delPic"))
			{
				String fileName = jsReq.getString("fileName");
				fileName = fileName.substring(6);
				/*获取tomcat位置*/
				String tomcatPath = lkCommon.readConfigFile("/TomcatPath.properties");
				fileName = tomcatPath + fileName;
				Boolean result = DeleteFileUtil.deleteFile(fileName);
				if(result)
				{
					code =0;
					errorCode = 0;
					msg = "删除成功";
				}
				else
				{
					code =1;
					errorCode =1;
					msg = "删除失败";
					logger.error("删除图片接口错误!");
				}
			}
			
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("删除文件接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}
}
