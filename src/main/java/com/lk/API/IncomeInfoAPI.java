package com.lk.API;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.Utils.LkCommon;
import com.lk.db.IncomeInfo;
import com.lk.db.OrderInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.IncomeInfoMapper;
import com.lk.mappers.OrderMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 15:30:54 root
  *  
* */

public class IncomeInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(IncomeInfoAPI.class);

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
			LkCommon lkCommon = new LkCommon();
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				IncomeInfo row = new IncomeInfo();
				row.setOperator(operator);
				List<IncomeInfo> resultList = incomeInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<IncomeInfo> pageInfo = new PageInfo<IncomeInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(日期/客户名称)
			if (jsReq.has("conditionalQuery"))
			{
				String clientName = jsReq.getString("clientName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (clientName.equals(""))
				{
					clientName = null;
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
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				IncomeInfo row = new IncomeInfo();
				row.setOperator(operator);
				if(jsReq.has("paymentMethod"))
				{
					String paymentMethod = jsReq.getString("paymentMethod");
					row.setPaymentMethod(paymentMethod);
				}
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setClientName(clientName);
				List<IncomeInfo> resultList = incomeInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addIncome"))
			{
				String orderNumber = jsReq.getString("orderNumber"); //--->订单号
				String incomeDate = jsReq.getString("incomeDate"); //--->收款日期
				String clientName = jsReq.getString("clientName"); //--->客户名称
				String paymentMethod = jsReq.getString("paymentMethod"); //--->支付方式
				Double paymentAmount = jsReq.getDouble("paymentAmount"); //--->付款金额
				String bankCardNumber = jsReq.getString("bankCardNumber"); //--->银行卡号
				String productName = jsReq.getString("productName"); //--->工程名称
				String payee = jsReq.getString("payee"); //--->收款人
				String bankImg = jsReq.getString("bankImg"); //--->银行图片
				String remarks = jsReq.getString("remarks");//--->备注
				String addTime = serverTime;//--->添加时间
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				IncomeInfo row = new IncomeInfo(orderNumber, incomeDate, clientName, productName, paymentMethod, paymentAmount, payee, remarks, operator, addTime, bankCardNumber, bankImg);
				int processResult = incomeInfoMapper.add(row);            
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
					/*更新订单信息表*/
					OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
					//自定义查询(总金额/已付款)
					String[] queryTypeArr = {"totalAmount","alreadyPaid"};
					JSONArray queryType = new JSONArray(queryTypeArr);
					OrderInfo orderRowQuery = new OrderInfo();
					orderRowQuery.setOperator(operator);
					orderRowQuery.setOrderNumber(orderNumber);
					orderRowQuery.setClientName(clientName);
					orderRowQuery.setQueryType(queryType);
					List<OrderInfo> orderInfoResultList = orderMapper.customQuery(orderRowQuery);
					JSONArray orderInfoResult = new JSONArray(orderInfoResultList);
					if(orderInfoResult.length()>1)
					{
						logger.error("添加收入,更新订单表出错(出现大于一个相同订单)!");
					}else if(orderInfoResult.length()==1)
					{
						JSONObject orderInfoObj = orderInfoResult.getJSONObject(0);
						BigDecimal totalAlreadyPaid = new BigDecimal("0.00");//--->当前总已付款金额
						BigDecimal unpaid = new BigDecimal("0.00"); //--->计算未付款
						int orderId = orderInfoObj.getInt("id");
						String totalAmount = orderInfoObj.getString("totalAmount");
						String alreadyPaid =  orderInfoObj.getString("alreadyPaid");
						totalAlreadyPaid =LkCommon.addDouble(alreadyPaid, paymentAmount.toString());
						unpaid = lkCommon.subtract(totalAmount,totalAlreadyPaid.toString()); //--->未付款 = 总金额-总已付款
						//更新订单信息表(已付款/未付款)
						OrderInfo updateRow = new OrderInfo();
						updateRow.setAlreadyPaid(alreadyPaid);
						updateRow.setUnpaid(unpaid.toString());
						updateRow.setOperator(operator);
						updateRow.setId(orderId);
						int updateResult = orderMapper.update(updateRow);
						sqlSession.commit();
						if(updateResult<=0)
						{
							logger.error("更新订单信息表失败(订单号):"+orderNumber);
						}
					}else
					{
						logger.error("更新订单信息表出错:该订单不存在!");
					}
					
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
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				IncomeInfo row = new IncomeInfo();
				row.setIds(ids);
				int processResult = incomeInfoMapper.del(row);
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
				String orderNumber = jsReq.getString("orderNumber");
				String incomeDate = jsReq.getString("incomeDate");
				String clientName = jsReq.getString("clientName");
				String paymentMethod = jsReq.getString("paymentMethod");
				Double paymentAmount = jsReq.getDouble("paymentAmount");
				String payee = jsReq.getString("payee");
				String remarks = jsReq.getString("remarks");
				String addTime = serverTime;
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				IncomeInfoMapper incomeInfoMapper = sqlSession.getMapper(IncomeInfoMapper.class);
				IncomeInfo row = new IncomeInfo();
				row.setOrderNumber(orderNumber);
				row.setIncomeDate(incomeDate);
				row.setClientName(clientName);
				row.setPaymentMethod(paymentMethod);
				row.setPaymentAmount(paymentAmount);
				row.setPayee(payee);
				row.setRemarks(remarks);
				row.setAddTime(addTime);
				int processResult = incomeInfoMapper.update(row);
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
			logger.error("财务管理[收入管理]接口异常:没有操作人");
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
