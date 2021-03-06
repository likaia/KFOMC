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
import com.lk.db.OutlayInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.OutlayInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 20:37:10 root
  *  
* */
/*财务管理[支出管理]*/
public class OutlayInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(OutlayInfoAPI.class);

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
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				OutlayInfo row = new OutlayInfo();
				row.setOperator(operator);
				List<OutlayInfo> resultList = outlayInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<OutlayInfo> pageInfo = new PageInfo<OutlayInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(日期)
			if (jsReq.has("conditionalQuery"))
			{
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
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				OutlayInfo row = new OutlayInfo();
				row.setOperator(operator);
				if(jsReq.has("outlayType"))
				{
					String outlayType = jsReq.getString("outlayType");
					row.setOutlayType(outlayType);
				}
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				List<OutlayInfo> resultList = outlayInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addOutlay"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String outlayDate = jsReq.getString("outlayDate");
				String outlayType = jsReq.getString("outlayType");
				String paymentMethod = jsReq.getString("paymentMethod");
				Double paymentAmount = jsReq.getDouble("paymentAmount");
				String remarks = jsReq.getString("remarks");
				String beneficiary = jsReq.getString("beneficiary");
				String bankImg = jsReq.getString("bankImg");
				String addTime = serverTime;
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				if(orderNumber.equals(""))
				{
					orderNumber = null;
				}
				if(outlayDate.equals(""))
				{
					outlayDate = serverTime;
				}
				if(bankImg.equals(""))
				{
					bankImg = null;
				}
				// 配置映射器
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				OutlayInfo row = new OutlayInfo(orderNumber, outlayDate, outlayType, paymentMethod, paymentAmount, remarks, operator, addTime, beneficiary, bankImg);
				int processResult = outlayInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("财务管理[收入管理]添加接口错误,添加失败!");
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
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				OutlayInfo row = new OutlayInfo();
				row.setIds(ids);
				int processResult = outlayInfoMapper.del(row);
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
					logger.error("财务管理[收入管理] 删除接口出错!");
				}
				sqlSession.close();
			}
			//更新客户信息
			if(jsReq.has("updateSalary"))
			{
				int id = jsReq.getInt("id");
				String orderNumber = jsReq.getString("orderNumber");
				String outlayDate = jsReq.getString("outlayDate");
				String outlayType = jsReq.getString("outlayType");
				String paymentMethod = jsReq.getString("paymentMethod");
				Double paymentAmount = jsReq.getDouble("paymentAmount");
				String remarks = jsReq.getString("remarks");
				String beneficiary =null;
				if(jsReq.has("beneficiary"))
				{
					beneficiary = jsReq.getString("beneficiary");
				}
				String bankImg = jsReq.getString("bankImg");
				if(orderNumber.equals(""))
				{
					orderNumber = null;
				}
				if(outlayDate.equals(""))
				{
					outlayDate = null;
				}
				if(outlayType.equals(""))
				{
					outlayType = null;
				}
				if(paymentMethod.equals(""))
				{
					paymentMethod = null;
				}
				if(paymentAmount.equals(""))
				{
					paymentAmount = null;
				}
				if(remarks.equals(""))
				{
					remarks = null;
				}
				if(bankImg.equals(""))
				{
					bankImg = null;
				}
				OutlayInfo row = new OutlayInfo(id, orderNumber, outlayDate, outlayType, paymentMethod, paymentAmount, remarks, operator, beneficiary, bankImg);
				if(jsReq.has("supperName"))
				{
					String supperName = jsReq.getString("supperName");
					row.setSupperName(supperName);
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
				int processResult = outlayInfoMapper.update(row);
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
					logger.error("财务管理[收入管理]:更新接口错误");
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
		jsReply.put("serverTime", serverTime);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}
}
