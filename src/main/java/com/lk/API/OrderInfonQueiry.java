package com.lk.API;


import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.OrderInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.OrderMapper;

import af.restful.AfRestfulApi;

/*订单信息查询*/
public class OrderInfonQueiry extends AfRestfulApi
{

	@Override
	public String execute(String reqText) throws Exception
	{
		int errorCode = 0;
		// layui need
		int code = 0;
		String msg = "ok";
		JSONObject jsReq = new JSONObject(reqText);
		// 从请求中取出分页信息:当前页面/每页显示的数量
		int page = 0;
		int limit = 0;
		/*要返回给用户的数据*/
		long count = 0;
		JSONArray result = new JSONArray();
		String androidData = "";
		if(jsReq.has("operator"))
		{
			String operator = jsReq.getString("operator");
			// 订单信息:分页查询接口
			if (jsReq.has("page") || jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				OrderInfo row = new OrderInfo();
				row.setOperator(operator);
				List<OrderInfo> resultList = orderMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<OrderInfo> pageInfo = new PageInfo<OrderInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 自定义查询
			if (jsReq.has("queryType"))
			{
				String queryType = jsReq.getString("queryType");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setQueryType(queryType);
				row.setOperator(operator);
				List<OrderInfo> resultList = orderMapper.customQuery(row);
				result = new JSONArray(resultList);
				// 关闭链接
				sqlSession.close();
			}
			// 订单号 客户名称 工程名称 日期 查询表内数据(条件查询)
			if (jsReq.has("conditionalQuery"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String clientName =  jsReq.getString("clientName");
				String projectName =   jsReq.getString("projectName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if(orderNumber.equals(""))
				{
					orderNumber = null;
				}
				if(clientName.equals(""))
				{
					clientName = null;
				}
				if(projectName.equals(""))
				{
					projectName = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
				OrderInfo row = new OrderInfo();
				row.setOperator(operator);
				row.setOrderNumber(orderNumber);
				row.setClientName(clientName);
				row.setProjectName(projectName);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				List<OrderInfo> resultList = orderMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
		}
		else
		{
			code = 1;
			errorCode = 1;
			msg = "没有操作人!";
		}
		// 从数据库得到数据 发送给前端
		JSONObject jsReply = new JSONObject();
		jsReply.put("code", code);
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("count", count);
		return jsReply.toString();
	}

}
/*
 * JSONArrayString 转 JSONArray String test = jsReply.getString("androidData");
 * JSONArray test2 = new JSONArray(test.substring(1,test.length()-1));
 */