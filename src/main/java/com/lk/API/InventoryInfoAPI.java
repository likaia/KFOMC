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
import com.lk.db.InventoryInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.InventoryInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-07 10:50:23 root
  *  
* */
/* 进销存管理[库存管理]接口*/
public class InventoryInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(InventoryInfoAPI.class);

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
			operator = jsReq.getString("operator");
			// 进货管理:分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				InventoryInfo row = new InventoryInfo();
				row.setOperator(operator);
				List<InventoryInfo> resultList = inventoryInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<InventoryInfo> pageInfo = new PageInfo<InventoryInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(原片名称)
			if (jsReq.has("conditionalQuery"))
			{
				String originalTitle = jsReq.getString("originalTitle");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				InventoryInfo row = new InventoryInfo();
				row.setOriginalTitle(originalTitle);
				row.setOperator(operator);
				List<InventoryInfo> resultList = inventoryInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addIncome"))
			{
				String originalTitle = jsReq.getString("originalTitle");
				String originalColor = jsReq.getString("originalColor");
				String originalThickness = jsReq.getString("originalThickness");
				int storageNum = jsReq.getInt("storageNum");
				int numberOfOutbound = jsReq.getInt("numberOfOutbound");
				int stockBalance = jsReq.getInt("stockBalance");
				String supplier = jsReq.getString("supplier");
				Double stockArea = jsReq.getDouble("stockArea");
				String addTime = serverTime;
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				InventoryInfo row = new InventoryInfo(originalTitle, originalColor, originalThickness, storageNum, numberOfOutbound, stockBalance, stockArea, addTime, supplier, operator);
				int processResult = inventoryInfoMapper.add(row);
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
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				InventoryInfo row = new InventoryInfo();
				row.setIds(ids);
				int processResult = inventoryInfoMapper.del(row);
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
				int inventoryId = jsReq.getInt("inventoryId");
				String originalTitle = jsReq.getString("originalTitle");
				String originalColor = jsReq.getString("originalColor");
				String originalThickness = jsReq.getString("originalThickness");
				int storageNum = jsReq.getInt("storageNum");
				int numberOfOutbound = jsReq.getInt("numberOfOutbound");
				int stockBalance = jsReq.getInt("stockBalance");
				String supplier = jsReq.getString("supplier");
				Double stockArea = jsReq.getDouble("stockArea");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				InventoryInfoMapper inventoryInfoMapper = sqlSession.getMapper(InventoryInfoMapper.class);
				InventoryInfo row = new InventoryInfo();
				row.setId(inventoryId);
				row.setOriginalTitle(originalTitle);
				row.setOriginalColor(originalColor);
				row.setOriginalThickness(originalThickness);
				row.setStorageNum(storageNum);
				row.setNumberOfOutbound(numberOfOutbound);
				row.setStockBalance(stockBalance);
				row.setSupplier(supplier);
				row.setStockArea(stockArea);
				int processResult = inventoryInfoMapper.update(row);
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
			logger.error(" 进销存管理[库存管理]接口异常:没有操作人");
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
