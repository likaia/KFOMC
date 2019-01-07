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
import com.lk.db.EmployeeInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.EmployeeInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 23:33:00 root
  *  
* */
/*员工管理[员工信息]接口*/
public class EmployeeInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(EmployeeInfoAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		// 获取当前服务器时间
		String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
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
			operator = jsReq.getString("operator"); // --->取出操作人
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				EmployeeInfo row = new EmployeeInfo();
				row.setOperator(operator);
				List<EmployeeInfo> resultList = employeeInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<EmployeeInfo> pageInfo = new PageInfo<EmployeeInfo>(resultList);
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
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				EmployeeInfo row = new EmployeeInfo();
				row.setQueryType(queryType);
				row.setOperator(operator);
				List<EmployeeInfo> resultList = employeeInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询
			if (jsReq.has("conditionalQuery"))
			{
				/* 根据(职位,姓名,工号)查询数据 */
				String department = jsReq.getString("department");
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				if (department.equals(""))
				{
					department = null;
				}
				if (nameOfWorker.equals(""))
				{
					nameOfWorker = null;
				}
				if (jobNumber.equals(""))
				{
					jobNumber = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				EmployeeInfo row = new EmployeeInfo();
				row.setPosition(department);
				row.setNameOfWorker(nameOfWorker);
				row.setJobNumber(jobNumber);
				row.setOperator(operator);
				List<EmployeeInfo> resultList = employeeInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
	
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addSalary"))
			{
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String phoneNumber = jsReq.getString("phoneNumber");
				String jobNumber = jsReq.getString("jobNumber");
				String department = jsReq.getString("department");
				String position = jsReq.getString("position");
				String dateOfBirth = jsReq.getString("dateOfBirth");
				String dateOfEntry = jsReq.getString("dateOfEntry");
				String remarks = jsReq.getString("remarks");
				String addTime = jsReq.getString("addTime");
				if(nameOfWorker.equals(""))
				{
					nameOfWorker = null;
				}
				if(phoneNumber.equals(""))
				{
					phoneNumber = null;
				}
				if(jobNumber.equals(""))
				{
					jobNumber = null;
				}
				if(department.equals(""))
				{
					department = null;
				}
				if(position.equals(""))
				{
					position = null;
				}
				if(dateOfBirth.equals(""))
				{
					dateOfBirth = null;
				}
				if(dateOfEntry.equals(""))
				{
					dateOfEntry = null;
				}
				if(remarks.equals(""))
				{
					remarks = null;
				}
				if(addTime.equals(""))
				{
					addTime = serverTime;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				EmployeeInfo row = new EmployeeInfo(nameOfWorker, phoneNumber, jobNumber, department, position,
						dateOfBirth, dateOfEntry, remarks, operator, serverTime);
				if(jsReq.has("basicWage"))
				{
					Double basicWage = jsReq.getDouble("basicWage");
					row.setBasicWage(basicWage);
				}
				int processResult = employeeInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("员工管理[员工信息]接口错误,添加失败!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delSalary"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				EmployeeInfo row = new EmployeeInfo();
				row.setIds(ids);
				int processResult = employeeInfoMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("员工管理[员工信息] 删除接口出错!");
				}
				sqlSession.close();
			}
			// 更新客户信息
			if (jsReq.has("updateSalary"))
			{
				EmployeeInfo row = new EmployeeInfo();
				row.setOperator(operator);
				row.setAddTime(serverTime);
				if(jsReq.has("id"))
				{
					int id = jsReq.getInt("id");
					row.setId(id);
				}
				if(jsReq.has("nameOfWorker"))
				{
					String nameOfWorker = jsReq.getString("nameOfWorker");
					row.setNameOfWorker(nameOfWorker);
				}
				if(jsReq.has("phoneNumber"))
				{
					String phoneNumber = jsReq.getString("phoneNumber");
					row.setPhoneNumber(phoneNumber);
				}
				if(jsReq.has("jobNumber"))
				{
					String jobNumber = jsReq.getString("jobNumber");
					row.setJobNumber(jobNumber);
				}
				if(jsReq.has("department"))
				{
					String department = jsReq.getString("department");
					row.setDepartment(department);
				}
				if(jsReq.has("position"))
				{
					String position = jsReq.getString("position");
					row.setPosition(position);
				}
				if(jsReq.has("dateOfBirth"))
				{
					String dateOfBirth = jsReq.getString("dateOfBirth");
					row.setDateOfBirth(dateOfBirth);
				}
				if(jsReq.has("dateOfEntry"))
				{
					String dateOfEntry = jsReq.getString("dateOfEntry");
					row.setDateOfEntry(dateOfEntry);
				}
				if(jsReq.has("remarks"))
				{
					String remarks = jsReq.getString("remarks");
					row.setRemarks(remarks);
				}
				if(jsReq.has("basicWage"))
				{
					Double basicWage = jsReq.getDouble("basicWage");
					row.setBasicWage(basicWage);
				}
				if(jsReq.has("mobilePhoneManufacturer"))
				{
					String mobilePhoneManufacturer = jsReq.getString("mobilePhoneManufacturer");
					row.setMobilePhoneManufacturer(mobilePhoneManufacturer);
				}
				if(jsReq.has("phoneModel"))
				{
					String phoneModel = jsReq.getString("phoneModel");
					row.setPhoneModel(phoneModel);
				}
				if(jsReq.has("mobilePhoneSerialNumber"))
				{
					String mobilePhoneSerialNumber = jsReq.getString("mobilePhoneSerialNumber");
					row.setMobilePhoneSerialNumber(mobilePhoneSerialNumber);
				}
				
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				EmployeeInfoMapper employeeInfoMapper = sqlSession.getMapper(EmployeeInfoMapper.class);
				int processResult = employeeInfoMapper.update(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "更新成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("员工管理[员工信息]更新接口错误");
				}
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("员工管理[员工信息]接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("serverTime", serverTime);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}
}
