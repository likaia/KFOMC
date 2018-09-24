package com.lk.API;


import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
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
		JSONObject jsReq = new JSONObject(reqText);
		if (jsReq.has("userName") && jsReq.has("passWord"))
		{
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
						httpSession.setAttribute("user", userName);
					} else
					{
						errorCode = 1;
						msg = "密码错误";
					}
				}
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
		return jsReply.toString();
	}
}
