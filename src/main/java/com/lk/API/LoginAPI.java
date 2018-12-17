package com.lk.API;



import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.db.User;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.UserMapper;

import af.restful.AfRestfulApi;

public class LoginAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(LoginAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{		
		// 构造错误码 错误信息 返回数据
		int errorCode = 0;
		String msg = "ok";
		JSONObject data = new JSONObject();
		JSONArray nowResult = new 	JSONArray();
		JSONObject jsReq = new JSONObject(reqText);
		if(jsReq.has("userName"))
		{
			if (jsReq.has("userName") && jsReq.has("passWord"))
			{
				//普通登录
				String userName = jsReq.getString("userName").replaceAll(" ", "");
				String passWord = jsReq.getString("passWord").replaceAll(" ", "");
				if (userName.equals("") || passWord.equals(""))
				{
					logger.error("用户名或密码为空(非法操作)");
					if (userName.equals(""))
					{
						errorCode = 1;
						msg = "用户名不能为空";
					}
					if (passWord.equals(""))
					{
						errorCode = 1;
						msg = "密码不能为空";
					}
				} else
				{
					// 打开数据库连接 配置当前要使用的Mapper
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
					User dbData = userMapper.findByName(userName);
					// 关闭session
					sqlSession.close();
					if (dbData == null)
					{
						errorCode = 1;
						msg = "此用户不存在!请注册";
					} else
					{
						JSONObject result = new JSONObject(dbData);
						String sqlUserName = result.getString("userName");
						String sqlPassWord = result.getString("passWord");
						if (userName.equals(sqlUserName) && passWord.equals(sqlPassWord))
						{
							errorCode = 0;
							msg = "密码正确";
							httpSession.setAttribute("nowUser", sqlUserName);
							httpSession.setAttribute("Version", dbData.getVersion());
							httpSession.setAttribute("nickName", dbData.getUserName());
							httpSession.setAttribute("avatarUrl", dbData.getFilePath());
							httpSession.setAttribute("sysUseAuthority", dbData.getSysUseAuthority());

						} else
						{
							errorCode = 1;
							msg = "密码错误";
						}
					}
				}
			} 
			/*自定义查询*/
			if(jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				String userName = jsReq.getString("userName");
				// 打开数据库连接 配置当前要使用的Mapper
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
				User row = new User();
				row.setUserName(userName);
				row.setQueryType(queryType);
				List<User> resultList = userMapper.customQuery(row);
				nowResult = new JSONArray(resultList);
				sqlSession.close();
			}
			/*更新本公司其他考勤状态信息*/
			if(jsReq.has("updateAttendanceInfo"))
			{
				int completionScope = jsReq.getInt("completionScope");
				int lateArrivalRange = jsReq.getInt("lateArrivalRange");
				Boolean holidayStatus = jsReq.getBoolean("holidayStatus");
				String userName = jsReq.getString("userName");
				String workingHours = jsReq.getString("workingHours");
				String afterGetOffWorkTime = jsReq.getString("afterGetOffWorkTime");
				String attendanceDate = jsReq.getString("attendanceDate");
				String officeWifi = jsReq.getString("officeWifi");
				String officeLocation = jsReq.getString("officeLocation");
				Boolean fieldCard = jsReq.getBoolean("fieldCard");
				String morningOffHours = jsReq.getString("morningOffHours");
				String afternoonWorkTime = jsReq.getString("afternoonWorkTime");
				Boolean twoCommutes = jsReq.getBoolean("twoCommutes");
				Boolean punchAfterWorkStatus = jsReq.getBoolean("punchAfterWorkStatus"); 
				String phoneModel = jsReq.getString("phoneModel");
				String mobilePhoneSerialNumber = jsReq.getString("mobilePhoneSerialNumber");
				String mobilePhoneManufacturer = jsReq.getString("mobilePhoneManufacturer");
				// 打开数据库连接 配置当前要使用的Mapper
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
				User row = new User();
				row.setCompletionScope(completionScope);
				row.setLateArrivalRange(lateArrivalRange);
				row.setHolidayStatus(holidayStatus);
				row.setWorkingHours(workingHours);
				row.setAfterGetOffWorkTime(afterGetOffWorkTime);
				row.setAttendanceDate(attendanceDate);
				row.setOfficeWifi(officeWifi);
				row.setOfficeLocation(officeLocation);
				row.setFieldCard(fieldCard);
				row.setUserName(userName);
				row.setMorningOffHours(morningOffHours);
				row.setAfternoonWorkTime(afternoonWorkTime);
				row.setTwoCommutes(twoCommutes);
				row.setPunchAfterWorkStatus(punchAfterWorkStatus);
				row.setMobilePhoneManufacturer(mobilePhoneManufacturer);
				row.setPhoneModel(phoneModel);
				row.setMobilePhoneSerialNumber(mobilePhoneSerialNumber);
				int processResult = userMapper.updateAttendanceInfo(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "更新成功!";
				}
				else
				{
					errorCode = 1;
					msg = "更新失败,数据库错误";
				}
				sqlSession.close();
			}
		}
		else
		{
			errorCode = 1;
			msg = "字段缺失";
			logger.error("字段不全，非法操作");
		}
		// 发送给前端的数据
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("data", data);
		jsReply.put("result", nowResult);
		return jsReply.toString();
	}

	@Override
	public void setContext(HttpServletRequest req, HttpServletResponse resp)
	{
		// TODO Auto-generated method stub
		super.setContext(req, resp);
	}
}
