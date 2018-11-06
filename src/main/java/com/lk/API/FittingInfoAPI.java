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
import com.lk.db.FittingInfo;
import com.lk.db.FittingPublic;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.FittingInfoMapper;
import com.lk.mappers.FittingPublicMapper;

import af.restful.AfRestfulApi;

/*进货信息管理[配件采购]*/
public class FittingInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(FittingInfoAPI.class);

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
		JSONArray  totalAmount = new JSONArray();
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
				FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				FittingInfo row = new FittingInfo();
				row.setOperator(operator);
				List<FittingInfo> resultList = fittingInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<FittingInfo> pageInfo = new PageInfo<FittingInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				//查询总金额
				List<FittingInfo> TotalAmountList = fittingInfoMapper.getTotalAmount(row);
				totalAmount = new JSONArray(TotalAmountList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询
			if (jsReq.has("conditionalQuery"))
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
				FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
				FittingInfo row = new FittingInfo();
				row.setOrderNumber(orderNumber);
				row.setSupplier(supplier);
				row.setRemarks(remarks);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<FittingInfo> resultList = fittingInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 根据操作人查询表内 所有配件名称/配件图片
			if (jsReq.has("getProductNameImgUrl"))
			{
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
				FittingInfo row = new FittingInfo();
				row.setOperator(operator);
				List<FittingInfo> resultList = fittingInfoMapper.getProductNameImgUrl(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 检测是否为新增配件
			if (jsReq.has("fittingName"))
			{
				String fittingName = jsReq.getString("fittingName");
				String fittingImgUrl = jsReq.getString("fittingImgUrl");
				// 获取当前服务器时间
				String addTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
				String addAPerson = operator;
				if (!fittingName.equals(""))
				{
					// 打开连接
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					// 配置映射器
					FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
					FittingPublic row = new FittingPublic(fittingName, fittingImgUrl, addTime, addAPerson);
					int resultVal = fittingPublicMapper.add(row);
					sqlSession.commit();
					if (resultVal <= 0)
					{
						code = 1;
						errorCode = 1;
						msg = "数据库错误!";
					} else
					{
						msg = "添加成功!";
					}
					sqlSession.close();
				}
			}
			// 新增数据
			if (jsReq.has("addOrderData"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				String fittingDate = jsReq.getString("fittingDate");
				String supplier = jsReq.getString("supplier");
				String specificationModel = jsReq.getString("specificationModel");
				String specificationModelVal = jsReq.getString("specificationModelVal"); // 用户选择的数据id
				String purchaseQuantity = jsReq.getString("purchaseQuantity");
				String totalPurchase = jsReq.getString("totalPurchase");
				String paymentDetails = jsReq.getString("paymentDetails");
				String otherFee = jsReq.getString("otherFee");
				String remarks = jsReq.getString("remarks");
				String fittingName = jsReq.getString("fittingName");
				// 检测用户是否为新增配件 (判断用户是否有选择配件名称)
				if (specificationModelVal.equals(""))
				{
					// 配件名称就为用户自定义的配件
					specificationModel = fittingName;
					String fittingImgUrl = jsReq.getString("fittingImgUrl"); //取出用户上传的图片地址
					// 打开连接
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					// 配置映射器(新增配件采购记录)
					FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
					FittingInfo row = new FittingInfo(orderNumber, fittingDate, supplier, specificationModel,
							purchaseQuantity, totalPurchase, paymentDetails, otherFee, remarks, fittingImgUrl, operator);
					int processResult = fittingInfoMapper.add(row);
					sqlSession.commit();
					if (processResult > 0)
					{
						msg = "添加成功";
					} else
					{
						code = 1;
						errorCode = 1;
						msg = "添加失败";
					}
					sqlSession.close();
				} else
				{
					// 打开连接
					SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
					// 配置映射器(根据配件id查询当前配件图片地址)
					FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
					FittingPublic rows = new FittingPublic();
					int specificationModeid = 0;
					try
					{
						specificationModeid = Integer.parseInt(specificationModelVal);
					} catch (NumberFormatException e)
					{
						e.printStackTrace();
					}
					rows.setId(specificationModeid);
					List<FittingPublic> FittingImgUrlList = fittingPublicMapper.queryIdUrl(rows);
					JSONArray FittingImgUrlArray = new JSONArray(FittingImgUrlList);
					JSONObject productImageUrlObj = FittingImgUrlArray.getJSONObject(0);
					String productImageUrl = productImageUrlObj.getString("fittingImgUrl");
					// 配置映射器(新增配件采购记录)
					FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
					FittingInfo row = new FittingInfo(orderNumber, fittingDate, supplier, specificationModel,
							purchaseQuantity, totalPurchase, paymentDetails, otherFee, remarks, productImageUrl, operator);
					int processResult = fittingInfoMapper.add(row);
					sqlSession.commit();
					if (processResult > 0)
					{
						msg = "添加成功";
					} else
					{
						code = 1;
						errorCode = 1;
						msg = "添加失败";
					}
					sqlSession.close();
				}
			}

			// 批量删除
			if (jsReq.has("delOrders"))
			{
				JSONArray orders = jsReq.getJSONArray("orders");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
				FittingInfo row = new FittingInfo();
				row.setOrders(orders);
				int processResult = fittingInfoMapper.del(row);
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
			//根据操作人查询表内所有配件采购总额:计算总成本
			if(jsReq.has("getTotalAmount"))
			{
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
				FittingInfo row = new FittingInfo();
				row.setOperator(operator);
				List<FittingInfo> resultList = fittingInfoMapper.getTotalAmount(row);
				result = new JSONArray(resultList);
				sqlSession.close();
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("进货信息管理[配件采购]:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("androidData", androidData);
		jsReply.put("totalAmount", totalAmount);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}

}
