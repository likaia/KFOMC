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
  *  @version V-2019-01-02 17:20:23 root
  *  
* */

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.WorkReportInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.WorkReportInfoMapper;

public class WorkReportInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(WorkReportInfoAPI.class);

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
		if (jsReq.has("operator"))
		{
			// 分页查询接口
			// 获取当前服务器时间
			String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				WorkReportInfo row = new WorkReportInfo();
				row.setOperator(operator);
				List<WorkReportInfo> resultList = workReportInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<WorkReportInfo> pageInfo = new PageInfo<WorkReportInfo>(resultList);
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
				String workReportName = jsReq.getString("workReportName");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				WorkReportInfo row = new WorkReportInfo();
				row.setOperator(operator);
				row.setWorkReportName(workReportName);
				if (jsReq.has("addTime"))
				{
					String addTime = jsReq.getString("addTime");
					row.setAddTime(addTime);
				}
				row.setQueryType(queryType);
				List<WorkReportInfo> resultList = workReportInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(可根据 [员工姓名/工号/开始时间/结束时间/请假时间]查询)
			if (jsReq.has("conditionalQuery"))
			{
				String workReportName = jsReq.getString("workReportName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
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
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				WorkReportInfo row = new WorkReportInfo();
				row.setOperator(operator);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setWorkReportName(workReportName);
				List<WorkReportInfo> resultList = workReportInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addWorkReportInfo"))
			{
				String workReportName = jsReq.getString("workReportName");
				String completeTheTaskThisWeek = jsReq.getString("completeTheTaskThisWeek");
				String unfinishedTasksThisWeek = jsReq.getString("unfinishedTasksThisWeek");
				String weeklyPicture = jsReq.getString("weeklyPicture");
				String weeklyNote = jsReq.getString("weeklyNote");
				String addTime = jsReq.getString("addTime");
				if (workReportName.equals(""))
				{
					workReportName = null;
				}
				if (completeTheTaskThisWeek.equals(""))
				{
					completeTheTaskThisWeek = null;
				}
				if (unfinishedTasksThisWeek.equals(""))
				{
					unfinishedTasksThisWeek = null;
				}
				if (weeklyPicture.equals(""))
				{
					weeklyPicture = null;
				}
				if (weeklyNote.equals(""))
				{
					weeklyNote = null;
				}
				if (addTime.equals(""))
				{
					addTime = serverTime;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				WorkReportInfo row = new WorkReportInfo();
				row.setOperator(operator);
				row.setWorkReportName(workReportName);
				row.setCompleteTheTaskThisWeek(completeTheTaskThisWeek);
				row.setUnfinishedTasksThisWeek(unfinishedTasksThisWeek);
				row.setWeeklyPicture(weeklyPicture);
				row.setWeeklyNote(weeklyNote);
				row.setAddTime(addTime);
				int processResult = workReportInfoMapper.add(row);
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
			if (jsReq.has("delWorkReportInfo"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				WorkReportInfo row = new WorkReportInfo();
				row.setIds(ids);
				int processResult = workReportInfoMapper.del(row);
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
			if (jsReq.has("updateWorkReportInfo"))
			{
				int id = jsReq.getInt("id");
				String workReportName = jsReq.getString("workReportName");
				String completeTheTaskThisWeek = jsReq.getString("completeTheTaskThisWeek");
				String unfinishedTasksThisWeek = jsReq.getString("unfinishedTasksThisWeek");
				String weeklyPicture = jsReq.getString("weeklyPicture");
				String weeklyNote = jsReq.getString("weeklyNote");
				if (workReportName.equals(""))
				{
					workReportName = null;
				}
				if (completeTheTaskThisWeek.equals(""))
				{
					completeTheTaskThisWeek = null;
				}
				if (unfinishedTasksThisWeek.equals(""))
				{
					unfinishedTasksThisWeek = null;
				}
				if (weeklyPicture.equals(""))
				{
					weeklyPicture = null;
				}
				if (weeklyNote.equals(""))
				{
					weeklyNote = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				WorkReportInfoMapper workReportInfoMapper = sqlSession.getMapper(WorkReportInfoMapper.class);
				WorkReportInfo row = new WorkReportInfo();
				row.setId(id);
				row.setOperator(operator);
				row.setWorkReportName(workReportName);
				row.setCompleteTheTaskThisWeek(completeTheTaskThisWeek);
				row.setUnfinishedTasksThisWeek(unfinishedTasksThisWeek);
				row.setWeeklyPicture(weeklyPicture);
				row.setWeeklyNote(weeklyNote);
				int processResult = workReportInfoMapper.update(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "更新成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("update Error!!!");
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
