package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.AttendanceInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.AttendanceInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 17:32:12 root
  *  
* */

public class AttendanceInfoAPI extends AfRestfulApi
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
				AttendanceInfoMapper attendanceInfoMapper = sqlSession.getMapper(AttendanceInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				AttendanceInfo row = new AttendanceInfo();
				row.setOperator(operator);
				List<AttendanceInfo> resultList = attendanceInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<AttendanceInfo> pageInfo = new PageInfo<AttendanceInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询
			if (jsReq.has("conditionalQuery"))
			{
				/* 根据(部门,姓名,工号)查询数据 */
				String division = jsReq.getString("division");
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				if (division.equals(""))
				{
					division = null;
				}
				if (nameOfWorker.equals(""))
				{
					nameOfWorker = null;
				}
				if (jobNumber.equals("jobNumber"))
				{
					jobNumber = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceInfoMapper attendanceInfoMapper = sqlSession.getMapper(AttendanceInfoMapper.class);
				AttendanceInfo row = new AttendanceInfo();
				row.setDivision(division);
				row.setNameOfWorker(nameOfWorker);
				row.setJobNumber(jobNumber);
				List<AttendanceInfo> resultList = attendanceInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addAttendance"))
			{
				String nameOfWorker = jsReq.getString("nameOfWorker"); // --->员工姓名
				String jobNumber = jsReq.getString("jobNumber"); // --->工号
				String division = jsReq.getString("division"); // --->部门
				int daysToAttend = jsReq.getInt("daysToAttend"); // --->应出勤天数
				int actualAttendanceDays = jsReq.getInt("actualAttendanceDays");// --->实际出勤天数
				int askForLeaveDays = jsReq.getInt("askForLeaveDays"); // --->请假天数
				int leaveDays = jsReq.getInt("leaveDays"); // --->事假天数
				int sickLeaveDays = jsReq.getInt("sickLeaveDays"); // --->病假天数
				String remark = jsReq.getString("remark"); // --->备注
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceInfoMapper attendanceInfoMapper = sqlSession.getMapper(AttendanceInfoMapper.class);
				AttendanceInfo row = new AttendanceInfo(nameOfWorker, jobNumber, division, daysToAttend,
						actualAttendanceDays, askForLeaveDays, leaveDays, sickLeaveDays, remark, serverTime, operator);
				int processResult = attendanceInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("客户信息管理接口错误,添加失败!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delAttendance"))
			{
				JSONArray ids = jsReq.getJSONArray("ids"); 
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceInfoMapper attendanceInfoMapper = sqlSession.getMapper(AttendanceInfoMapper.class);
				AttendanceInfo row = new AttendanceInfo();
				row.setIds(ids);
				int processResult =  attendanceInfoMapper.del(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "删除成功!";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("员工管理[考勤管理] 删除接口出错!");
				}
				sqlSession.close();
			}
			//更新客户信息
			if(jsReq.has("updateAttendance"))
			{
				String nameOfWorker = jsReq.getString("nameOfWorker"); // --->员工姓名
				String jobNumber = jsReq.getString("jobNumber"); // --->工号
				String division = jsReq.getString("division"); // --->部门
				int daysToAttend = jsReq.getInt("daysToAttend"); // --->应出勤天数
				int actualAttendanceDays = jsReq.getInt("actualAttendanceDays");// --->实际出勤天数
				int askForLeaveDays = jsReq.getInt("askForLeaveDays"); // --->请假天数
				int leaveDays = jsReq.getInt("leaveDays"); // --->事假天数
				int sickLeaveDays = jsReq.getInt("sickLeaveDays"); // --->病假天数
				String remark = jsReq.getString("remark"); // --->备注
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceInfoMapper attendanceInfoMapper = sqlSession.getMapper(AttendanceInfoMapper.class);
				AttendanceInfo row = new AttendanceInfo(nameOfWorker, jobNumber, division, daysToAttend,
						actualAttendanceDays, askForLeaveDays, leaveDays, sickLeaveDays, remark, serverTime, operator);
				int processResult =  attendanceInfoMapper.update(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "更新成功";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("客户信息:更新接口错误");
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
		jsReply.put("serverTime", serverTime);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}
}
