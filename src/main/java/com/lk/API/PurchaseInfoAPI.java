package com.lk.API;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.PurchaseInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.PurchaseMapper;

import af.restful.AfRestfulApi;

/*进货信息管理[原片采购]*/
public class PurchaseInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(LoginAPI.class);

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
			operator = jsReq.getString("operator"); // --->取出操作人
			// 进货管理:分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				PurchaseInfo row = new PurchaseInfo();
				row.setOperator(operator);
				List<PurchaseInfo> resultList = purchaseMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<PurchaseInfo> pageInfo = new PageInfo<PurchaseInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			//进货管理:条件查询()
			if(jsReq.has("conditionalQuery"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String supplier = jsReq.getString("originalFilmSupplier");
				String remarks = jsReq.getString("originalFilmRemarks");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (orderNumber.equals(""))
				{
					orderNumber = null;
				}
				if (supplier.equals(""))
				{
					supplier = null;
				}
				if (remarks.equals(""))
				{
					remarks = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				PurchaseInfo row = new PurchaseInfo();
				row.setOrderNumber(orderNumber);
				row.setSupplier(supplier);
				row.setRemarks(remarks);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<PurchaseInfo> resultList = purchaseMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			//进货管理新增数据
			if(jsReq.has("addOrderData"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String purchaseDate = jsReq.getString("purchaseDate");
				String supplier = jsReq.getString("supplier");
				String specificationModel = jsReq.getString("specificationModel");
				String thickness = jsReq.getString("thickness");
				String color = jsReq.getString("color");
				String quantity = jsReq.getString("quantity");
				String unitPrice = jsReq.getString("unitPrice");
				String totalPurchase = jsReq.getString("totalPurchase");
				String shippingFee = jsReq.getString("shippingFee");
				String remarks = jsReq.getString("remarks");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				PurchaseInfo row = new PurchaseInfo(orderNumber, purchaseDate, supplier, specificationModel, thickness, color, quantity, unitPrice, totalPurchase, shippingFee, remarks, operator);
				int processResult = purchaseMapper.add(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "添加成功";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败";
				}
				sqlSession.close();
			}
			//进货管理:批量删除
			if(jsReq.has("delOrders"))
			{
				JSONArray orders = jsReq.getJSONArray("orders");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				PurchaseInfo row = new PurchaseInfo();
				row.setOrders(orders);
				int processResult = purchaseMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					msg = "删除失败";
				}
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("进货管理接口异常:没有操作人");
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
