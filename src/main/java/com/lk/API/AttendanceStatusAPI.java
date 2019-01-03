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
import com.lk.db.AttendanceStatusInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.AttendanceStatusInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-07 12:12:55 root
  *  
* */

/*考勤状态接口*/
public class AttendanceStatusAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(AttendanceStatusAPI.class);

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
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				AttendanceStatusInfo row = new AttendanceStatusInfo();
				row.setOperator(operator);
				List<AttendanceStatusInfo> resultList = attendanceStatusInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<AttendanceStatusInfo> pageInfo = new PageInfo<AttendanceStatusInfo>(resultList);
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
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (nameOfWorker.equals(""))
				{
					nameOfWorker = null;
				}
				if (jobNumber.equals(""))
				{
					jobNumber = null;
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
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				AttendanceStatusInfo row = new AttendanceStatusInfo();
				row.setOperator(operator);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setQueryType(queryType);
				row.setJobNumber(jobNumber);
				row.setNameOfWorker(nameOfWorker);
				row.setQueryType(queryType);
				List<AttendanceStatusInfo> resultList = attendanceStatusInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(可根据 [员工姓名/工号/开始时间/结束时间/请假时间]查询)
			if (jsReq.has("conditionalQuery"))
			{
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (nameOfWorker.equals(""))
				{
					nameOfWorker = null;
				}
				if (jobNumber.equals(""))
				{
					jobNumber = null;
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
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				AttendanceStatusInfo row = new AttendanceStatusInfo();
				row.setOperator(operator);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setJobNumber(jobNumber);
				row.setNameOfWorker(nameOfWorker);
				List<AttendanceStatusInfo> resultList = attendanceStatusInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addAttendanceStatusInfo"))
			{
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				String department = jsReq.getString("department");
				String workingHours = jsReq.getString("workingHours");
				String afterGetOffWorkTime = jsReq.getString("afterGetOffWorkTime");
				String attendanceDate = jsReq.getString("attendanceDate");
				String wifiInfo = jsReq.getString("wifiInfo");
				String attendanceLocation = jsReq.getString("attendanceLocation");
				String attendanceRange = jsReq.getString("attendanceRange");
				String fieldCard = jsReq.getString("fieldCard");
				String remarks = jsReq.getString("remarks");
				if (jobNumber.equals(""))
				{
					jobNumber = null;
				}
				if (department.equals(""))
				{
					department = null;
				}
				if (workingHours.equals(""))
				{
					workingHours = null;
				}
				if (afterGetOffWorkTime.equals(""))
				{
					afterGetOffWorkTime = null;
				}
				if (attendanceDate.equals(""))
				{
					attendanceDate = null;
				}
				if (wifiInfo.equals(""))
				{
					wifiInfo = null;
				}
				if (attendanceLocation.equals(""))
				{
					attendanceLocation = null;
				}
				if (attendanceRange.equals(""))
				{
					attendanceRange = null;
				}
				if (fieldCard.equals(""))
				{
					fieldCard = null;
				}
				if (remarks.equals(""))
				{
					remarks = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				AttendanceStatusInfo row = new AttendanceStatusInfo(nameOfWorker, jobNumber, department, workingHours,
						afterGetOffWorkTime, attendanceDate, wifiInfo, attendanceLocation, attendanceRange, fieldCard,
						remarks, serverTime, operator);
				int processResult = attendanceStatusInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("员工管理[考勤管理]接口错误,添加失败!");
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
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				AttendanceStatusInfo row = new AttendanceStatusInfo();
				row.setIds(ids);
				int processResult = attendanceStatusInfoMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("员工管理[考勤信息]删除接口出错!");
				}
				sqlSession.close();
			}
			// 更新考勤状态信息
			if (jsReq.has("updateAttendance"))
			{
				
				String nameOfWorker = jsReq.getString("nameOfWorker");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				AttendanceStatusInfoMapper attendanceStatusInfoMapper = sqlSession
						.getMapper(AttendanceStatusInfoMapper.class);
				AttendanceStatusInfo row = new AttendanceStatusInfo();
				row.setNameOfWorker(nameOfWorker);
				row.setOperator(operator);
				if(jsReq.has("id"))
				{
					int id = jsReq.getInt("id");
					row.setId(id);
				}

				if (jsReq.has("jobNumber"))
				{
					String jobNumber = jsReq.getString("jobNumber");
					row.setJobNumber(jobNumber);
				}
				if (jsReq.has("department"))
				{
					String department = jsReq.getString("department");
					row.setDepartment(department);
				}
				if (jsReq.has("workingHours"))
				{
					String workingHours = jsReq.getString("workingHours");
					row.setWorkingHours(workingHours);
				}
				if (jsReq.has("afterGetOffWorkTime"))
				{
					String afterGetOffWorkTime = jsReq.getString("afterGetOffWorkTime");
					row.setAfterGetOffWorkTime(afterGetOffWorkTime);
				}
				if (jsReq.has("attendanceDate"))
				{
					String attendanceDate = jsReq.getString("attendanceDate");
					row.setAttendanceDate(attendanceDate);
				}
				if (jsReq.has("wifiInfo"))
				{
					String wifiInfo = jsReq.getString("wifiInfo");
					row.setWifiInfo(wifiInfo);
				}
				if (jsReq.has("attendanceLocation"))
				{
					String attendanceLocation = jsReq.getString("attendanceLocation");
					row.setAttendanceLocation(attendanceLocation);
				}
				if (jsReq.has("attendanceRange"))
				{
					String attendanceRange = jsReq.getString("attendanceRange");
					row.setAttendanceRange(attendanceRange);
				}
				if (jsReq.has("fieldCard"))
				{
					String fieldCard = jsReq.getString("fieldCard");
					row.setFieldCard(fieldCard);
				}
				if (jsReq.has("remarks"))
				{
					String remarks = jsReq.getString("remarks");
					row.setRemarks(remarks);
				}
				
				if (jsReq.has("workID"))
				{
					int workID = jsReq.getInt("workID");
					row.setId(workID);
				}
				if (jsReq.has("afternoonWorkTime"))
				{
					String afternoonWorkTime = jsReq.getString("afternoonWorkTime");
					row.setAfternoonWorkTime(afternoonWorkTime);
				}
				int processResult = attendanceStatusInfoMapper.update(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "更新成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("员工管理[考勤管理]接口:更新错误");
				}
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("考勤状态接口异常:没有操作人");
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
