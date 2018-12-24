package com.lk.API;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.Utils.LkCommon;
import com.lk.db.InventoryInfo;
import com.lk.db.OrderInfo;
import com.lk.db.OutlayInfo;
import com.lk.db.ProductListInfo;
import com.lk.db.ShipmentInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.InventoryInfoMapper;
import com.lk.mappers.OrderMapper;
import com.lk.mappers.OutlayInfoMapper;
import com.lk.mappers.ProductNumeInfoMapper;
import com.lk.mappers.ShipmentMapper;

import af.restful.AfRestfulApi;

/*进销存管理[出货管理]接口*/

public class ShipmentInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(ShipmentInfoAPI.class);

	/*
	 * 用于抑制编译器产生警告信息
	 * 
	 * @SuppressWarnings("null")
	 */
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
		JSONObject orderInfo = new JSONObject();
		ArrayList<String> nonExistentInventoryVal = new ArrayList<String>(); // --->不存在的库存
		ArrayList<String> inventoryShortageVal = new ArrayList<String>(); // --->库存不足的规格型号
		long count = 0; // --->数据库数据总记录数
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		DecimalFormat df = new DecimalFormat("0.00");
		LkCommon lkCommon = new LkCommon();
		JSONArray InventoryShortage = new JSONArray(); // --->库存余量不足,统计不足的库存名称
		if (jsReq.has("operator"))
		{
			// 获取当前服务器时间
			String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
			operator = jsReq.getString("operator"); // --->取出操作人
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				ShipmentInfo row = new ShipmentInfo();
				row.setOperator(operator);
				List<ShipmentInfo> resultList = shipmentMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<ShipmentInfo> pageInfo = new PageInfo<ShipmentInfo>(resultList);
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
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<ShipmentInfo> resultList = shipmentMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			//查询库存是否充足
			if(jsReq.has("inventoryCheck"))
			{
				/*
				 * 如果库存充足,直接更新库存,否则提示前端库存不足
				 * */
				JSONArray finalJSONArr = jsReq.getJSONArray("finalJSONArr");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				/* 检查库存余量是否充足:查询库存表所有数据,计总当前每种规格型号需要消耗的库存数量 */
				InventoryInfoMapper inventoryInfoOneMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				String[] InventoryQueryOneTypeArr = { "stockBalance", "originalTitle" };// --->构造查询条件(库存余量,原片名称)
				JSONArray InventoryOneQueryType = new JSONArray(InventoryQueryOneTypeArr);
				/* 查询库存表数据:自定义查询:原片名称/库存余量 */
				InventoryInfo InventoryQueryOneRow = new InventoryInfo();
				InventoryQueryOneRow.setOperator(operator);
				InventoryQueryOneRow.setQueryType(InventoryOneQueryType);
				List<InventoryInfo> InventoryInfoOneList = inventoryInfoOneMapper.customQuery(InventoryQueryOneRow);
				JSONArray InventoryInfoOneResult = new JSONArray(InventoryInfoOneList);
				ArrayList<String> stockNameVal = new ArrayList<String>(); // --->库存表原片名称总数组
				for(int i= 0;i<InventoryInfoOneResult.length();i++)
				{
					//赋值库存表原片名称数组
					JSONObject thisObj = InventoryInfoOneResult.getJSONObject(i);
					String originalTitle = thisObj.getString("originalTitle");
					stockNameVal.add(originalTitle);
				}
				//判断库存是否存在
				for(int i = 0 ;i<finalJSONArr.length();i++)
				{
					JSONObject thisObj = finalJSONArr.getJSONObject(i);
					String productName = thisObj.getString("productName");
					boolean stockFlag = stockNameVal.contains(productName);
					if(stockFlag)
					{
						//检测库存剩余
						for(int j = 0;j < InventoryInfoOneResult.length();j++)
						{
							JSONObject dataBaseObj = InventoryInfoOneResult.getJSONObject(j);
							String originalTitle = dataBaseObj.getString("originalTitle");
							if(productName.equals(originalTitle))
							{
								int inventoryNum = dataBaseObj.getInt("stockBalance"); // 库存余量
								if (inventoryNum < 10) // --->库存余量小于10禁止下单
								{
									//	logger.error("库存不足禁止下单");
									inventoryShortageVal.add(originalTitle);
									code = 1;
									errorCode =1;
									msg = "库存不足";
								}
							}
						}
					}
					else
					{
						//库存不存在
						code = 1;
						errorCode =1;
						msg = "库存不存在";
						nonExistentInventoryVal.add(productName);
					}
				}
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addOrderData"))
			{
				/*
				 * 未发货数据没有进行归类处理,前端发货时,需要将数据进行归类处理!
				 * */
				String orderNumber = jsReq.getString("orderNumber");
				String clientName = jsReq.getString("clientName");// --->客户名称
				String dateOfShipment = serverTime; // --->下单日期
				JSONArray dataToShip = jsReq.getJSONArray("dataToShip"); // --->要发货的数据
				JSONArray tempArray = jsReq.getJSONArray("tempArray"); //--->临时存储数据
				String numberShipments = jsReq.getString("numberShipments");// --->当前发货数量
				String TotalShippedQuantity = jsReq.getString("TotalShippedQuantity");//--->当前已发货总数量(前端js计算)
				String TotalShippedArea = jsReq.getString("TotalShippedArea"); //--->当前已发货总面积(前端js计算)
				String shipArea = jsReq.getString("shipArea");// --->当前发货面积
				String theTotalAmount = jsReq.getString("theTotalAmount");// --->发货金额
				String theRemainingNum = jsReq.getString("theRemainingNum");// --->剩余总数量
				String remainingArea = jsReq.getString("remainingArea");// --->剩余总面积
				String paymentDetails = jsReq.getString("paymentDetails");// --->付款明细
				String transportationManager = jsReq.getString("transportationManager");// --->运输负责人
				Boolean freightPaymentStatus = jsReq.getBoolean("freightPaymentStatus"); //--->运费支付状态
				String freight = jsReq.getString("freight");// --->运费
				/*计算未发货的数据:移除当前发货数量/发货金额/发货面积*/
				JSONArray unfinishedArr = new JSONArray();
				for(int i = 0;i<tempArray.length();i++)
				{
					JSONArray thisArr = tempArray.getJSONArray(i);
					for(int j = 0; j <thisArr.length();j++)
					{
						JSONObject thisObj = thisArr.getJSONObject(j);
						thisObj.remove("nowShipNum");
						thisObj.remove("nowAmount");
						thisObj.remove("nowArea");
						unfinishedArr.put(thisObj);
					}
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo(clientName, dateOfShipment, dataToShip.toString(),unfinishedArr.toString(), theTotalAmount, numberShipments, shipArea, theRemainingNum,remainingArea, paymentDetails, transportationManager, freight, operator);
				row.setOrderNumber(orderNumber);
				row.setFreightPaymentStatus(freightPaymentStatus);
				int processResult = shipmentMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "新增出货信息成功";
					/* 查询订单表 */
					// 配置映射器
					OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
					/* 查询 工程名称/订单号/联系电话/送货地址/订单日期/未付款金额 */
					String[] queryArr = { "projectName", "orderNumber", "contactNumber", "deliveryAddress", "orderDate", "unpaid" };
					JSONArray queryType = new JSONArray(queryArr);
					OrderInfo rows = new OrderInfo();
					rows.setQueryType(queryType);
					rows.setOperator(operator);
					rows.setOrderNumber(orderNumber);
					rows.setClientName(clientName); // 根据 (订单号 客户名称 操作人) 查询数据
					List<OrderInfo> resultList = orderMapper.customQuery(rows);
					JSONArray resultArr = new JSONArray(resultList);
					/* 取出Array中的数据,构造前端需要的数据 */
					if (resultArr.length() > 0)
					{
						for (int i = 0; i < resultArr.length(); i++)
						{
							JSONObject resultObj = resultArr.getJSONObject(i);
							/* 工程名称/订单号/联系电话/送货地址/订单日期/发货日期/未付款金额 */
							orderInfo.put("invoiceProjectName", resultObj.getString("projectName"));
							orderInfo.put("invoiceOrderNumber", resultObj.getString("orderNumber"));
							orderNumber = resultObj.getString("orderNumber");
							orderInfo.put("invoiceContactNumber", resultObj.getString("contactNumber"));
							orderInfo.put("invoiceDeliveryAddress", resultObj.getString("deliveryAddress"));
							orderInfo.put("invoiceOrderDate", resultObj.getString("orderDate"));
							orderInfo.put("invoiceDateOfShipment", serverTime);
							orderInfo.put("unpaid", resultObj.getString("unpaid"));
						}
					} else
					{
						code = 1;
						errorCode = 1;
						msg = "该订单状态异常(不存在)";
						logger.error("进销存管理[出货管理][新增],查询订单信息状态异常!");
					}
					/* 新增发货记录结束 */
					/* 更新订单信息表开始 */
					// 赋值订单数据表余下字段
					OrderInfo Nowrows = new OrderInfo();
					Nowrows.setNumberShipments(TotalShippedQuantity); // ---->剩余总数量
					Nowrows.setShipArea(TotalShippedArea);// ---->剩余总面积
					Nowrows.setUnfinishedArr(unfinishedArr.toString());// --->未发货的规格型号数据
					Nowrows.setOrderNumber(orderNumber);// --->根据订单号更新
					int processResults = orderMapper.update(Nowrows);
					sqlSession.commit();
					if (processResults == 0)
					{
						msg = "更新订单数据表失败";
						logger.error("出货管理接口异常:更新订单数据表失败!");
					}
					/* 更新订单信息表结束 */
					
					/*检测运费是否为已支付(更新支出表)*/
					if(freightPaymentStatus)
					{
						//更新支出表
						OutlayInfoMapper outlayInfoMapper = sqlSession.getMapper(OutlayInfoMapper.class);
						OutlayInfo outlayInfoRow = new  OutlayInfo();
						outlayInfoRow.setOrderNumber(orderNumber);
						outlayInfoRow.setOutlayDate(serverTime);
						outlayInfoRow.setOutlayType("运费支出");
						BigDecimal PaymentAmount = new BigDecimal(freight);
						outlayInfoRow.setPaymentAmount(PaymentAmount.doubleValue());
						outlayInfoRow.setOperator(operator);
						outlayInfoRow.setBeneficiary(transportationManager);
						outlayInfoRow.setAddTime(serverTime);
						@SuppressWarnings("unused")
						int outlayInfoResult =  outlayInfoMapper.add(outlayInfoRow);
						sqlSession.commit();
					}
					/*更新库存管理表开始*/
					/* 计算出库数量:当前订单的当前规格型号总面积/一块原片的面积 */
					// 查询原片表,取出所有原片名称和面积
					// 配置映射器
					ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
					// 构造查询条件
					String[] productQueryArr = { "productName", "area" };
					JSONArray productQueryType = new JSONArray(productQueryArr);
					ProductListInfo ProductListRow = new ProductListInfo();
					ProductListRow.setOperator(operator);
					ProductListRow.setQueryType(productQueryType);
					List<ProductListInfo> productList = productNumeInfoMapper.customQuery(ProductListRow);
					JSONArray productResult = new JSONArray(productList); //--->库存表:原片名称和面积
					if(productResult.length()>1)
					{
						for(int i = 0;i < dataToShip.length();i++)
						{
							JSONArray levelOneArrList = dataToShip.getJSONArray(i);// --->第一层数组的数据
							BigDecimal outboundNum = new BigDecimal("0.00");// --->出库数量
							BigDecimal specificationTotalArea = new BigDecimal("0.00"); // --->当前已发货的规格型号的总面积
							String nowArea = df.format(0.00); // --->一块原片的面积
							String productName = ""; // --->已发货数据的规格型号名称
							for (int j = 0; j < levelOneArrList.length(); j++) // --->计算已发货数据的规格型号总面积,得出已发货规格型号名称
							{
								// 取出当前重复数据的规格型号名称 面积
								JSONObject levelOneArrObj = levelOneArrList.getJSONObject(j);
								productName = levelOneArrObj.getString("productName");
								String itemArea = levelOneArrObj.getString("nowArea");
								if(itemArea.equals(""))
								{
									itemArea = "0.00";
								}
								specificationTotalArea = LkCommon.addDouble(itemArea,specificationTotalArea.toString()); // 计算相同规格型号的总面积
							}
							for (int k = 0; k < productResult.length(); k++) // --->找出已发货的规格型号所对应的库存的原片面积
							{
								JSONObject productObj = productResult.getJSONObject(k);
								String originalProductName = productObj.getString("productName");
								if (productName.equals(originalProductName))
								{
									nowArea = df.format(productObj.getDouble("area")); // 一块原片的面积
									break;
								}
							}
							// 出库原片数量= 当前总规格型号的面积/一张原片的面积
							outboundNum = lkCommon.divide(specificationTotalArea.toString(), nowArea);
							int outboundIntNum = 0;
							if (outboundNum.intValue() - outboundNum.doubleValue() == 0) // --->判断需要的原片数量是否为小数:取整计算出货数量
							{
								outboundIntNum = outboundNum.intValue();
							} else
							{
								outboundIntNum = outboundNum.intValue() + 1;
							}
							/*
							 * 开始更新库存表:先查询到当前规格型号所对应的库存信息表的数据，然后在根据id更新
							 */
							// 配置映射器
							InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
							String[] InventoryQueryTypeArr ={ "storageNum", "numberOfOutbound", "stockArea" };// --->构造查询条件
							JSONArray InventoryQueryType = new JSONArray(InventoryQueryTypeArr);
							/* 查询库存表数据:自定义查询:原片名称/入库数量/出库数量/库存余量/库存面积 */
							InventoryInfo InventoryQueryRow = new InventoryInfo();
							InventoryQueryRow.setOperator(operator);
							InventoryQueryRow.setQueryType(InventoryQueryType);
							InventoryQueryRow.setOriginalTitle(productName);
							List<InventoryInfo> InventoryInfoList = inventoryInfoMapper.customQuery(InventoryQueryRow);
							JSONArray InventoryInfoResult = new JSONArray(InventoryInfoList);
							if (InventoryInfoResult.length() > 0)
							{
								JSONObject InventoryInfoObj = InventoryInfoResult.getJSONObject(0);
								int storageNum = InventoryInfoObj.getInt("storageNum"); // --->入库数量
								int numberOfOutbound = InventoryInfoObj.getInt("numberOfOutbound"); // --->出库数量
								int originalId = InventoryInfoObj.getInt("id");
								int newNumberOfOutbound = numberOfOutbound + outboundIntNum; // --->新的出库数量=原出库数量+当前出库数量
								int newStockBalance = storageNum - newNumberOfOutbound;// --->新的库存余量=入库数量-新的出库数量
								// 根据id更新库存表
								InventoryInfo InventoryRow = new InventoryInfo();
								InventoryRow.setId(originalId);
								InventoryRow.setNumberOfOutbound(newNumberOfOutbound); // --->新的出库数量
								InventoryRow.setStockBalance(newStockBalance); // --->新的库存余量
								int InventoryResult = inventoryInfoMapper.update(InventoryRow);
								sqlSession.commit();
								if (InventoryResult <= 0)
								{
									logger.error("出货管理:更新库存表失败");
								}
								/* 更新库存表结束 */
							
							} else
							{
						
								logger.error("出货管理查询[库存表]:没有数据");
								errorCode = 1;
								code = 1;
								msg = "库存不足";
								JSONObject jsReply = new JSONObject();
								jsReply.put("errorCode", errorCode);
								jsReply.put("code", code);
								jsReply.put("msg", msg);
								return jsReply.toString();
							}
						}
					}
					// 更新库存管理表结束
				}
				sqlSession.close();
				/* 添加发货接口结束 */
			}
			/*更新发货单字段*/
			if(jsReq.has("updateOrder"))
			{
				String deliveryNote = jsReq.getString("deliveryNote");
				int id = jsReq.getInt("id");
				String orderNumber = jsReq.getString("orderNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setDeliveryNote(deliveryNote);
				row.setOperator(operator);
				row.setId(id);
				row.setOrderNumber(orderNumber);
				int thisResult = shipmentMapper.update(row);
				sqlSession.commit();
				if(thisResult>0)
				{
					msg = "更新成功";
					code = 0;
					errorCode =0;
				}
				else
				{
					code = 1;
					errorCode =1;
					msg = "更新失败!";
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delOrders"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ShipmentMapper shipmentMapper = sqlSession.getMapper(ShipmentMapper.class);
				ShipmentInfo row = new ShipmentInfo();
				row.setIds(ids);
				int processResult = shipmentMapper.del(row);
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
			logger.error("进销存管理[出货管理]接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("InventoryShortage", InventoryShortage);
		jsReply.put("nonExistentInventoryVal",nonExistentInventoryVal);
		jsReply.put("inventoryShortageVal", inventoryShortageVal);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("orderInfo", orderInfo);
		jsReply.put("count", count);
		return jsReply.toString();
	}

}