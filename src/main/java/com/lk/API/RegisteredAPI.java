package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.lk.db.User;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.UserMapper;

import af.restful.AfRestfulApi;

public class RegisteredAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(RegisteredAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{
		int errorCode = 0;
		String msg = "ok";
		JSONObject data = new JSONObject();
		JSONObject jsReq = new JSONObject(reqText);
		if (jsReq.has("userName") && jsReq.has("passWord") && jsReq.has("cellPhone") && jsReq.has("type"))
		{
			int type = jsReq.getInt("type");
			String userName = jsReq.getString("userName").replaceAll(" ", ""); 
			String passWord = jsReq.getString("passWord").replaceAll(" ", ""); 
			String cellPhone = jsReq.getString("cellPhone").replaceAll(" ", ""); 
			// 获取当前服务器时间
			String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
			/* type=1表示安卓 */
			if (type == 1)
			{
				if (userName.equals("") || passWord.equals("") || cellPhone.equals(""))
				{
					logger.error("(注册接口报错)来自安卓端：用户名或手机号或密码有一项为空");
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
					if (cellPhone.equals(""))
					{
						errorCode = 1;
						msg = "手机号不能为空";
					}
				} else
				{
					// 打开数据库连接 配置当前要使用的Mapper
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
					// 查询数据库判断用户名是否重复
					User row = userMapper.findByName(userName);
					if(row==null)
					{
						//用户不存在
						User user = new User();
						user.setUserName(userName);
						user.setPassWord(passWord);
						user.setCellPhone(cellPhone);
						user.setRegistrationTime(serverTime);
						if(jsReq.has("userID"))
						{
							int userID = jsReq.getInt("userID");
							user.setUserID(userID);
						}
						int result = userMapper.add(user);
						sqlSession.commit();
						// 关闭session
						sqlSession.close();
						if (result == 0)
						{
							errorCode = 1;
							msg = "数据库错误:注册失败";
							logger.error("(注册接口)数据库错误:注册失败");
						} else
						{
							errorCode = 0;
							msg = "注册成功!";
						}
					}else
					{
						JSONObject sqlQueryData = new JSONObject(row);
						String sqlUserName = sqlQueryData.getString("userName");
						if (sqlUserName.equals(userName))
						{
							errorCode = 1;
							msg = "用户名已存在!";
							// 关闭session
							sqlSession.close();
						} 
					}
					
				}
			} else
			{
				// 取出图片路径
				String filePath = jsReq.getString("cropPicPath");
				if (userName.equals("") || passWord.equals("") || cellPhone.equals("") || filePath.equals(""))
				{
					logger.error("(注册接口报错)来自web端：用户名或手机号或密码有一项为空");
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
					if (cellPhone.equals(""))
					{
						errorCode = 1;
						msg = "手机号不能为空";
					}
					if (filePath.equals(""))
					{
						errorCode = 1;
						msg = "文件路径不能为空";
					}
				} else
				{
					// 打开数据库连接 配置当前要使用的Mapper
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
					// 查询数据库判断用户名是否重复
					User row = userMapper.findByName(userName);
					if (row == null)
					{
						//用户不存在
						User user = new User();
						user.setUserName(userName);
						user.setPassWord(passWord);
						user.setCellPhone(cellPhone);
						user.setFilePath(filePath);
						user.setRegistrationTime(serverTime);
						int result = userMapper.add(user);
						sqlSession.commit();
						// 关闭session
						sqlSession.close();
						if (result == 0)
						{
							errorCode = 1;
							msg = "数据库错误:注册失败";
							logger.error("(注册接口)数据库错误:注册失败");
						} else
						{
							errorCode = 0;
							msg = "注册成功!";
						}
					} else
					{
						JSONObject sqlQueryData = new JSONObject(row);
						String sqlUserName = sqlQueryData.getString("userName");
						if (sqlUserName.equals(userName))
						{
							errorCode = 1;
							msg = "用户名已存在!";
							// 关闭session
							sqlSession.close();
						}
					}

				}
			}

		} else
		{
			errorCode = 1;
			msg = "非法操作!字段不全!";
			logger.error("(注册接口报错)非法操作,字段不全!请注意");
		}

		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("data", data);
		return jsReply.toString();
	}

}
