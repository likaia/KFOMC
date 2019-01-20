package com.lk.API;

import af.restful.AfRestfulApi;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.*;
/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:19:45 root
  *  
* */

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.LeaveInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.LeaveInfoMapper;

public class LeaveInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(LeaveInfoAPI.class);

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
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		// 获取当前服务器时间
		String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator"); // --->取出操作人
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				LeaveInfo row = new LeaveInfo();
				row.setOperator(operator);
				List<LeaveInfo> resultList = leaveInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<LeaveInfo> pageInfo = new PageInfo<LeaveInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 自定义查询()
			if (jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				String leaveType = jsReq.getString("leaveType");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				LeaveInfo row = new LeaveInfo();
				row.setOperator(operator);
				row.setLeaveType(leaveType);
				row.setQueryType(queryType);
				List<LeaveInfo> resultList = leaveInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(可根据 [员工姓名/工号/开始时间/结束时间/请假时间]查询)
			if (jsReq.has("conditionalQuery"))
			{
				String leaveType = jsReq.getString("leaveType");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if(leaveType.equals(""))
				{
					leaveType = null;
				}
				
				if (dStart.equals(""))
				{
					dStart = null;
				}
				if (dEnd.equals(""))
				{
					dEnd = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				LeaveInfo row = new LeaveInfo();
				row.setOperator(operator);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				if(jsReq.has("id"))
				{
					int id = jsReq.getInt("id");
					row.setId(id);
				}
				row.setLeaveType(leaveType);
				List<LeaveInfo> resultList = leaveInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addLeaveInfo"))
			{
				String leaveTheTitle = jsReq.getString("leaveTheTitle");
				String leaveType = jsReq.getString("leaveType");
				String leaveContent = jsReq.getString("leaveContent");
				String leaveStartTime = jsReq.getString("leaveStartTime");
				String leaveTime = jsReq.getString("leaveTime");
				String leavePicture = jsReq.getString("leavePicture");
				String addTime = jsReq.getString("addTime");
				if (leaveTheTitle.equals(""))
				{
					leaveTheTitle = null;
				}
				if (leaveType.equals(""))
				{
					leaveType = null;
				}
				if (leaveContent.equals(""))
				{
					leaveContent = null;
				}
				if (leaveStartTime.equals(""))
				{
					leaveStartTime = null;
				}
				if (leaveTime.equals(""))
				{
					leaveTime = null;
				}
				if (leavePicture.equals(""))
				{
					leavePicture = null;
				}
				if (addTime.equals(""))
				{
					addTime = serverTime;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				LeaveInfo row = new LeaveInfo();
				row.setOperator(operator);
				row.setLeaveTheTitle(leaveTheTitle);
				row.setLeaveType(leaveType);
				row.setLeaveContent(leaveContent);
				row.setLeaveStartTime(leaveStartTime);
				row.setLeaveTime(leaveTime);
				row.setLeavePicture(leavePicture);
				row.setAddTime(addTime);
				int processResult = leaveInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("error!!!!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delLeaveInfo"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				LeaveInfo row = new LeaveInfo();
				row.setIds(ids);
				int processResult = leaveInfoMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("del Error!");
				}
				sqlSession.close();
			}
			// 更新
			if (jsReq.has("updateLeaveInfo"))
			{
				int id = jsReq.getInt("id");
				String leaveTheTitle = jsReq.getString("leaveTheTitle");
				String leaveType = jsReq.getString("leaveType");
				String leaveContent = jsReq.getString("leaveContent");
				String leaveStartTime = jsReq.getString("leaveStartTime");
				String leaveTime = jsReq.getString("leaveTime");
				String leavePicture = jsReq.getString("leavePicture");
				if (leaveTheTitle.equals(""))
				{
					leaveTheTitle = null;
				}
				if (leaveType.equals(""))
				{
					leaveType = null;
				}
				if (leaveContent.equals(""))
				{
					leaveContent = null;
				}
				if (leaveStartTime.equals(""))
				{
					leaveStartTime = null;
				}
				if (leaveTime.equals(""))
				{
					leaveTime = null;
				}
				if (leavePicture.equals(""))
				{
					leavePicture = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				LeaveInfoMapper leaveInfoMapper = sqlSession.getMapper(LeaveInfoMapper.class);
				LeaveInfo row = new LeaveInfo();
				row.setOperator(operator);
				row.setId(id);
				row.setLeaveTheTitle(leaveTheTitle);
				row.setLeaveType(leaveType);
				row.setLeaveContent(leaveContent);
				row.setLeaveStartTime(leaveStartTime);
				row.setLeaveTime(leaveTime);
				row.setLeavePicture(leavePicture);
				int processResult = leaveInfoMapper.update(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "更新成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("update Error");
				}
				sqlSession.close();
			}
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
