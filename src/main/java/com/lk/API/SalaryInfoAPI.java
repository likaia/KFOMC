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
import com.lk.db.SalaryInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.SalaryInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 22:43:04 root
  *  
* */
/*员工管理[工资发放]接口*/
public class SalaryInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(SalaryInfoAPI.class);

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
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				SalaryInfo row = new SalaryInfo();
				row.setOperator(operator);
				if(jsReq.has("nameOfWorker"))
				{
					String nameOfWorker = jsReq.getString("nameOfWorker");
					row.setNameOfWorker(nameOfWorker);
				}
				List<SalaryInfo> resultList = salaryInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<SalaryInfo> pageInfo = new PageInfo<SalaryInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			/*自定义查询：操作人/员工姓名*/
			if(jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				String nameOfWorker = jsReq.getString("nameOfWorker");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				SalaryInfo row = new SalaryInfo();
				row.setOperator(operator);
				row.setNameOfWorker(nameOfWorker);
				row.setQueryType(queryType);
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				List<SalaryInfo> resultList = salaryInfoMapper.customQuery(row);
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
				String position = jsReq.getString("position");
				String nameOfWorker = jsReq.getString("nameOfWorker");
				String jobNumber = jsReq.getString("jobNumber");
				if (position.equals(""))
				{
					position = null;
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
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				SalaryInfo row = new SalaryInfo();
				row.setPosition(position);
				row.setNameOfWorker(nameOfWorker);
				row.setJobNumber(jobNumber);
				row.setOperator(operator);
				List<SalaryInfo> resultList = salaryInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addSalary"))
			{
				String  nameOfWorker = jsReq.getString("nameOfWorker");
				String position = jsReq.getString("position");
				String  jobNumber = jsReq.getString("jobNumber");
				Double basicWage = jsReq.getDouble("basicWage");
				Double  jobSubsidy = jsReq.getDouble("jobSubsidy");
				Double payable = jsReq.getDouble("payable");
				Double attendanceDeduction = jsReq.getDouble("attendanceDeduction");
				Double personalIncomeTax = jsReq.getDouble("personalIncomeTax");
				Double realWage = jsReq.getDouble("realWage");
				String remarks = jsReq.getString("remarks");
				SalaryInfo row = new SalaryInfo();
				row.setOperator(operator);
				row.setNameOfWorker(nameOfWorker);
				row.setPosition(position);
				row.setJobNumber(jobNumber);
				row.setBasicWage(basicWage);
				row.setPayable(payable);
				row.setJobSubsidy(jobSubsidy);
				row.setAttendanceDeduction(attendanceDeduction);
				if(personalIncomeTax>0)
				{
					row.setPersonalIncomeTax(personalIncomeTax);
				}
				row.setRealWage(realWage);
				row.setRemarks(remarks);
				row.setSigningTime(serverTime);
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				//配置映射器
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				int processResult = salaryInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("员工管理[工资发放]添加失败!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delSalary"))
			{
				JSONArray ids = jsReq.getJSONArray("ids"); 
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				//配置映射器
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				SalaryInfo row = new SalaryInfo();
				row.setIds(ids);
				int processResult =  salaryInfoMapper.del(row);
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
					logger.error("员工管理[工资管理] 删除接口出错!");
				}
				sqlSession.close();
			}
			//更新工资信息
			if(jsReq.has("updateSalary"))
			{
				int id = jsReq.getInt("id");
				String  nameOfWorker = jsReq.getString("nameOfWorker");
				String  jobNumber = jsReq.getString("jobNumber");
				String  position = jsReq.getString("position");
				Double basicWage = jsReq.getDouble("basicWage");
				Double  jobSubsidy = jsReq.getDouble("jobSubsidy");
				Double payable = jsReq.getDouble("payable");
				Double attendanceDeduction = jsReq.getDouble("attendanceDeduction");
				Double personalIncomeTax = jsReq.getDouble("personalIncomeTax");
				Double realWage = jsReq.getDouble("realWage");
				String remarks = jsReq.getString("remarks");
				SalaryInfo row = new SalaryInfo(nameOfWorker, jobNumber, position, basicWage, jobSubsidy, payable, attendanceDeduction, personalIncomeTax, realWage, serverTime, remarks, operator);
				row.setId(id);
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				//配置映射器
				SalaryInfoMapper salaryInfoMapper = sqlSession.getMapper(SalaryInfoMapper.class);
				int processResult =   salaryInfoMapper.update(row);
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
					logger.error("员工管理[工资发放]:更新接口错误");
				}
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("员工管理[工资发放]没有操作人");
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
