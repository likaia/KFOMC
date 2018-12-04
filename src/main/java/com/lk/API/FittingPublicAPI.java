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
import com.lk.db.FittingPublic;
import com.lk.db.SupplierInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.FittingPublicMapper;
import com.lk.mappers.SupplierInfoMapper;

import af.restful.AfRestfulApi;

/*基础信息[配件信息]接口*/

public class FittingPublicAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(FittingPublicAPI.class);

	@Override
	public String execute(String reqText) throws Exception
	{
		/* 前端必发数据 */
		String operator = "";
		JSONObject jsReq = new JSONObject(reqText);
		/* 回传给前端的数据 */
		int errorCode = 0;
		int code = 0;
		long count = 0;
		JSONArray result = new JSONArray();
		JSONArray SupplierResult = new JSONArray();
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		// 获取当前服务器时间
		String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		/* 定义分页需要的字段 */
		int page = 0;
		int limit = 0;
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator"); // --->取出操作人
			/* 分页查询 */
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				FittingPublic row = new FittingPublic();
				row.setAddAPerson(operator);
				List<FittingPublic> resultList = fittingPublicMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<FittingPublic> pageInfo = new PageInfo<FittingPublic>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 查询所有规格型号接口
			if (jsReq.has("queryAll"))
			{
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
				FittingPublic row = new FittingPublic();
				List<FittingPublic> resultList = fittingPublicMapper.findFitting(row);
				result = new JSONArray(resultList);
				/*查询供应商表:所有供应商名称*/
				String[] supplierArr = {"supplierName"};
				JSONArray supplierQueryType = new JSONArray(supplierArr);
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo SupplierRow = new SupplierInfo();
				SupplierRow.setOperator(operator);
				SupplierRow.setQueryType(supplierQueryType);
				List<SupplierInfo> SupplierResultList = supplierInfoMapper.conditionalQuery(SupplierRow);
				SupplierResult = new JSONArray(SupplierResultList);
				sqlSession.close(); //-->关闭数据库连接
			}
			// 条件查询
			if (jsReq.has("conditionalQuery"))
			{
				String fittingName = jsReq.getString("fittingName");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
				FittingPublic row = new FittingPublic();
				row.setFittingName(fittingName);
				List<FittingPublic> resultList = fittingPublicMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 删除接口
			if (jsReq.has("delFitting"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
				FittingPublic row = new FittingPublic();
				row.setIds(ids);
				int processResult = fittingPublicMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("基础信息[配件信息]删除接口出错!");
				}
				sqlSession.close();
			}
			// 新增接口
			if (jsReq.has("addFitting"))
			{
				String fittingName = jsReq.getString("fittingName");
				String fittingImgUrl = jsReq.getString("fittingImgUrl");
				String addTime = serverTime;
				String addAPerson = operator;
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
		} else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("基础信息[配件信息]接口异常:没有操作人");
		}
		// 产生订单号:UUID（16位）
		String orderNumber = UUIDUtil.getOrderIdByUUId();

		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("count", count);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("orderNumber", orderNumber);
		jsReply.put("serverTime", serverTime);
		jsReply.put("SupplierResult",SupplierResult);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}

}
