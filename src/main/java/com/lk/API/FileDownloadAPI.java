package com.lk.API;

import org.apache.log4j.Logger;
import org.json.*;

import com.lk.Utils.DeleteFileUtil;
import com.lk.Utils.LkCommon;
import com.lk.Utils.ZipUtils;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-26 15:31:08 root
  *  
* */

public class FileDownloadAPI extends AfRestfulApi
{

	private static Logger logger = Logger.getLogger(FileDownloadAPI.class);
	LkCommon lkcommon = new LkCommon();
	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		long count = 0; // --->数据库数据总记录数
		String downloadLink = "";
		String msg = "ok";
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			/**
			 * 计算并获取客户对账单据
			 */
			if(jsReq.has("getReceipt"))
			{
				JSONArray picArr = jsReq.getJSONArray("picPath");
				// 获取网络时间
				String webTime = LkCommon.getNetworkTime("http://www.baidu.com");
				// 去除时间中的所有标点符号
				webTime = webTime.replaceAll("[\\pP\\p{Punct}]", "");
				// 获取tomcat路径
				String tomcatPath = lkcommon.readConfigFile("/TomcatPath.properties");
				// 拼接文件夹名称
				String folderName = tomcatPath + "/" + webTime + "";
				// 去除空格
				folderName = folderName.replace(" ", "");
				// 创建文件夹
				lkcommon.createFolder(folderName);
				// 将文件名从数组中读出来
				for (int i = 0; i < picArr.length(); i++)
				{
					String fileName = picArr.getString(i);
					// 去除webPic前缀
					fileName = fileName.substring(6);
					// 拼接每一项的文件路径,得到tomcat下的真实文件路径
					fileName = tomcatPath + "/" + fileName + "";
					// 将遍历到的每一项文件复制到新建的文件夹中
					lkcommon.copyFile(fileName, folderName);
				}
				String zipFile = tomcatPath + "/zipFile/" + webTime + ".zip";
				// 去除空格
				zipFile = zipFile.replace(" ", "");
				// 压缩文件
				ZipUtils.toZip(folderName, zipFile,true);
				// 删除刚开始创建的文件夹
				DeleteFileUtil.deleteDirectory(folderName);
				downloadLink = "https://www.kaisir.cn/webPic/zipFile/"+(webTime.replace(" ", ""))+".zip";
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("文件下载接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("operator", operator);
		jsReply.put("downloadLink", downloadLink);
		jsReply.put("count", count);
		return jsReply.toString();
	}
	
}
