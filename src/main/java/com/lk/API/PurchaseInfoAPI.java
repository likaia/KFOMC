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
import com.lk.db.InventoryInfo;
import com.lk.db.PurchaseInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.FittingInfoMapper;
import com.lk.mappers.InventoryInfoMapper;
import com.lk.mappers.PurchaseMapper;

import af.restful.AfRestfulApi;

/*进货信息管理[原片采购]*/
public class PurchaseInfoAPI extends AfRestfulApi
{

	private static Logger logger = Logger.getLogger(PurchaseInfoAPI.class);
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
				String unloadingFee = jsReq.getString("unloadingFee");
				String remarks = jsReq.getString("remarks");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				PurchaseInfo row = new PurchaseInfo(orderNumber, purchaseDate, supplier, specificationModel, thickness, color, quantity, unitPrice, totalPurchase, shippingFee, unloadingFee, remarks, operator);
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
				/*配置库存管理映射器:更新库存管理表*/
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				InventoryInfo InventoryRow = new InventoryInfo();
				InventoryRow.setOperator(operator);
				InventoryRow.setOriginalTitle(specificationModel); //--->根据当前新增的规格型号查询库存管理表
				List<InventoryInfo> InventoryResultListArr = inventoryInfoMapper.conditionalQuery(InventoryRow); //查询表内数据
				JSONArray InventoryResult = new JSONArray(InventoryResultListArr);
				if(InventoryResult.length()>0)
				{
					//--->更新库存表内数据
					for(int i = 0;i<InventoryResult.length();i++)
					{
						//--->取出库存表内的规格型号信息
						JSONObject InventoryObj = new JSONObject();
						InventoryObj = InventoryResult.getJSONObject(i);
						//--->取出当前项的id
						int inventoryId = InventoryObj.getInt("id");
						//--->取出入库数量
						int storageNum = InventoryObj.getInt("storageNum");
						//--->取出出库数量
						int numberOfOutbound = InventoryObj.getInt("numberOfOutbound");
						//--->取出库存余量
						int stockBalance = InventoryObj.getInt("stockBalance");
						//--->声明新入库数量变量: 库存表内入库数量 + 当前新增的入库数量
						int newStorageNum = storageNum +Integer.parseInt(quantity);
						//--->声明新库存余量变量: 库存表内库存余量 + 当前新增的入库数量 - 出库数量
						int newStockBalance = stockBalance + Integer.parseInt(quantity) -numberOfOutbound ;
						//--->更新当前数据信息
						InventoryInfo updateInventoryRow = new InventoryInfo();
						updateInventoryRow.setId(inventoryId);//--->当前条目id
						updateInventoryRow.setStorageNum(newStorageNum); //--->入库数量
						updateInventoryRow.setStockBalance(newStockBalance); //--->库存余量
						updateInventoryRow.setAddTime(serverTime); //--->本次记录更新时间
						int updateResult = inventoryInfoMapper.update(updateInventoryRow);//--->调用更新接口
						sqlSession.commit();
						if(updateResult==0)
						{
							logger.error("进销存管理[进货管理]接口异常:更新库存表失败");
						}
					}
				}
				else
				{
					//--->库存表内没有当前规格型号,新增此条规格型号
					String originalTitle =  specificationModel;       //--->原片名称
					String originalColor = color; //--->原片颜色
					String originalThickness = thickness; //--->原片厚度
					int storageNum =Integer.parseInt(quantity); //--->原片数量
					int numberOfOutbound = 0;//--->出库数量
					int stockBalance =Integer.parseInt(quantity); //--->库存余量
					String addTime = serverTime; //--->添加时间
					//--->新增数据
					InventoryInfo addInventoryRow = new InventoryInfo();
					addInventoryRow.setOriginalTitle(originalTitle);
					addInventoryRow.setOriginalColor(originalColor);
					addInventoryRow.setOriginalThickness(originalThickness);
					addInventoryRow.setStorageNum(storageNum);
					addInventoryRow.setNumberOfOutbound(numberOfOutbound);
					addInventoryRow.setStockBalance(stockBalance);
					addInventoryRow.setSupplier(supplier);
					addInventoryRow.setAddTime(addTime);
					addInventoryRow.setOperator(operator);
					int addResult = inventoryInfoMapper.add(addInventoryRow);
					sqlSession.commit();
					if(addResult==0)
					{
						logger.error("进销存管理[进货管理]接口异常:新增库存表记录失败");
					}
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
			//通过 订单号 查询原片采购表&配件采购表 用户数据
			if(jsReq.has("originalAccessoriesQuiery"))
			{
				String orderNumber = jsReq.getString("orderNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				PurchaseMapper purchaseMapper = sqlSession.getMapper(PurchaseMapper.class);
				PurchaseInfo row = new PurchaseInfo();
				row.setOperator(operator);
				row.setOrderNumber(orderNumber);
				List<PurchaseInfo> PurchaseResultList  = purchaseMapper.queryByOrderNumber(row);
				JSONArray PurchaseResult = new JSONArray(PurchaseResultList);
				if(PurchaseResult.length()>0)
				{
					result = PurchaseResult;
					androidData = "\"" + result + "\"";
					sqlSession.close();
				}
				else
				{
					// 配置映射器
					FittingInfoMapper fittingInfoMapper = sqlSession.getMapper(FittingInfoMapper.class);
					FittingInfo rows = new FittingInfo();
					row.setOperator(operator);
					rows.setOrderNumber(orderNumber);
					List<FittingInfo> fittingResultList = fittingInfoMapper.queryByOrderNumber(rows);
					JSONArray fittingResult = new JSONArray(fittingResultList);
					if(fittingResult.length()>0)
					{
						result=fittingResult;
					}
					else
					{
						code = 1;
						errorCode = 1;
						msg = "此订单号不存在";
					}
					sqlSession.close();
				}
			}
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("进货信息管理[原片采购]异常:没有操作人");
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
