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
import com.lk.Utils.UUIDUtil;
import com.lk.db.ProductListInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ProductNumeInfoMapper;

import af.restful.AfRestfulApi;

public class ProductNameModelInquiry extends AfRestfulApi
{
	/*
	 * 	基础信息[原片信息]接口
	 * 
	 * */
	private static Logger logger = Logger.getLogger(ProductNameModelInquiry.class);
	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		// 产生订单号:UUID（16位）
		String orderNumber = UUIDUtil.getOrderIdByUUId();
		// 获取当前服务器时间
		String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		JSONArray result = new JSONArray();
		long count = 0; // --->数据库数据总记录数
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		if(jsReq.has("operator"))
		{
			operator = jsReq.getString("operator");
			/*分页查询表内数据*/
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				ProductListInfo row = new ProductListInfo();
				row.setOperator(operator);
				List<ProductListInfo> resultList  = productNumeInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<ProductListInfo> pageInfo = new PageInfo<ProductListInfo>(resultList);
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
				/*根据 (产品名称) 或者 (日期查询)数据*/
				String productName = jsReq.getString("productName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if(dStart.equals(""))
				{
					dStart = null;
				}
				if(dEnd.equals(""))
				{
					dEnd = null;
				}
				if(productName.equals(""))
				{
					productName = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				ProductListInfo row = new ProductListInfo();
				row.setProductName(productName);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<ProductListInfo> resultList = productNumeInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addProduct"))
			{
				String productName = jsReq.getString("productName"); //原片名称
				String color  = jsReq.getString("color");
				String thickness = jsReq.getString("thickness");
				int  unitPrice = jsReq.getInt("unitPrice");//单价
				int wholesalePrice = jsReq.getInt("wholesalePrice"); //批发价
				int length = jsReq.getInt("length");
				int width = jsReq.getInt("width");
				Double area =  jsReq.getDouble("area");
				String remarks = jsReq.getString("remarks");
				String addTime = nowTime;
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				ProductListInfo row = new ProductListInfo();
				row.setProductName(productName);
				row.setLength(length);
				row.setColor(color);
				row.setWidth(width);
				row.setThickness(thickness);
				row.setUnitPrice(unitPrice);
				row.setArea(area);
				row.setWholesalePrice(wholesalePrice);
				row.setRemarks(remarks);
				row.setAddTime(addTime);
				row.setOperator(operator);
				int processResult = productNumeInfoMapper.add(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "添加成功";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "数据库错误,添加失败!";
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delProduct"))
			{
				JSONArray ids = jsReq.getJSONArray("ids"); 
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				ProductListInfo row = new ProductListInfo();
				row.setIds(ids);
				row.setOperator(operator);
				int processResult = productNumeInfoMapper.del(row);
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
					logger.error("基础信息[原片信息]删除接口出错!");
				}
				sqlSession.close();
			}
			//更新原片信息
			if(jsReq.has("updateProduct"))
			{
				String productName = jsReq.getString("productName"); //原片名称
				int id = jsReq.getInt("profuctId");
				String color  = jsReq.getString("color");
				String thickness = jsReq.getString("thickness");
				int  unitPrice = jsReq.getInt("unitPrice");//单价
				int wholesalePrice = jsReq.getInt("wholesalePrice"); //批发价
				int length = jsReq.getInt("length");
				int width = jsReq.getInt("width");
				Double area = jsReq.getDouble("area"); //计算面积
				String remarks = jsReq.getString("remarks");
				String addTime = nowTime;
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				ProductListInfo row = new ProductListInfo();
				row.setProductName(productName);
				row.setLength(length);
				row.setColor(color);
				row.setWidth(width);
				row.setThickness(thickness);
				row.setUnitPrice(unitPrice);
				row.setArea(area);
				row.setWholesalePrice(wholesalePrice);
				row.setRemarks(remarks);
				row.setId(id);
				row.setAddTime(addTime);
				int processResult = productNumeInfoMapper.update(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "修改成功";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("基础信息[原片信息]更新接口错误");
				}
				sqlSession.close();
			}
			/*查询表内 自定义查询 (规格型号,单价) 字段 开始*/
			if(jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				ProductListInfo row = new ProductListInfo();
				if(jsReq.has("productName"))
				{
					String productName = jsReq.getString("productName");
					row.setProductName(productName);
				}
				row.setOperator(operator);
				row.setQueryType(queryType);
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
				List<ProductListInfo> resultList = productNumeInfoMapper.customQuery(row);
				sqlSession.close(); //-->关闭数据库连接
				result = new JSONArray(resultList);
			}
			/*查询表内 (规格型号,单价) 字段结束*/
		}
		else
		{
			errorCode = 1;
			msg = "没有操作人!";
			logger.error("基础信息[原片信息]报错:缺少[operator]字段");
		}
		JSONObject jsReply = new JSONObject();
		//产生订单号:UUID（16位）
		String  serverTime =  UUIDUtil.getOrderIdByUUId(); //--->产生订单号
		jsReply.put("code", code);
		jsReply.put("errorCode",errorCode);
		jsReply.put("msg",msg );
		jsReply.put("count", count);
		jsReply.put("orderNumber", orderNumber);
		jsReply.put("nowTime",nowTime );
		jsReply.put("androidData", androidData);
		jsReply.put("serverTime", serverTime);
		jsReply.put("data", result);
		jsReply.put("operator",operator );
		return jsReply.toString();
	}
	
}
