package com.lk.API;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.db.User;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.UserMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-29 11:06:37 root
  *  
* */

public class MessageApprovalAPI extends AfRestfulApi
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
		long count = 0; // --->数据库数据总记录数
		String msg = "ok"; 
		/* 安卓端返回数据 */
		String androidData = "";
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			int companyID = jsReq.getInt("companyID");
			JSONObject messageRequest = jsReq.getJSONObject("messageRequest");
			// 打开数据库连接 配置当前要使用的Mapper
			SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			User dbData = userMapper.findByName(operator);
			JSONObject queryResult = new JSONObject(dbData);
			if(queryResult.has("messageRequest"))
			{
				//Add current entry to JSOPNArraySource data
				String sqlMessageRequest = queryResult.getString("messageRequest");
				JSONArray sqlMessageRequestArr = new JSONArray(sqlMessageRequest);
				sqlMessageRequestArr.put(messageRequest);
				//update to database
				User saveRow = new User();
				saveRow.setMessageRequest(sqlMessageRequestArr.toString());
				saveRow.setUserName(operator);
				saveRow.setCompanyID(companyID);
				int updateResult = userMapper.updateAttendanceInfo(saveRow);
				sqlSession.commit();
				if(updateResult>0)
				{
					code =1;
					errorCode =1;
					msg = "Update completed!";
				}else{
					msg = "Update failed!";
					code = 1;
					errorCode =1;
				}
			}else{
				//Generate JSONArray And add the current entry
				JSONArray rawArray = new JSONArray();
				rawArray.put(messageRequest);
				//update to database
				User saveRow = new User();
				saveRow.setMessageRequest(rawArray.toString());
				saveRow.setUserName(operator);
				saveRow.setCompanyID(companyID);
				int updateResult = userMapper.updateAttendanceInfo(saveRow);
				sqlSession.commit();
				if(updateResult>0)
				{
					code =1;
					errorCode =1;
					msg = "Update completed!";
				}else{
					msg = "Update failed!";
					code = 1;
					errorCode =1;
				}
			}
			// 关闭session
			sqlSession.close();
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
