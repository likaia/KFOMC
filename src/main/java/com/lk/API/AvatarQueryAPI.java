package com.lk.API;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;

import com.lk.db.User;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.UserMapper;

import af.restful.AfRestfulApi;

public class AvatarQueryAPI extends AfRestfulApi
{
	@Override
	public String execute(String reqText) throws Exception
	{
		int errorCode = 0;
		String msg  = "";
		JSONObject data = new JSONObject();
		JSONObject jsReq = new JSONObject(reqText);
		if(jsReq.has("userName"))
		{
			String userName = jsReq.getString("userName");
			// 打开数据库连接 配置当前要使用的Mapper
			SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			User row = userMapper.findByName(userName);
			sqlSession.close();
			if(row ==null)
			{
				errorCode = 1;
				msg = "没有此用户";
			}
			else
			{
				JSONObject nowUserInfo = new JSONObject(row);
				//取出图片路径
				data.put("userAvatar",nowUserInfo.getString("filePath"));
				msg = "ok";
			}
		}
		else
		{
			errorCode = 1;
			msg = "非法操作:字段不全";
		}
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("data", data);
		return jsReply.toString();
	}

}
