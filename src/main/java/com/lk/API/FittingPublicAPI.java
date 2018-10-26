package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.Utils.UUIDUtil;
import com.lk.db.FittingPublic;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.FittingPublicMapper;

import af.restful.AfRestfulApi;

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
		JSONArray result = new JSONArray();
		String msg = "ok";
		/* 安卓端返回数据 */
		String androidData = "";
		if (jsReq.has("operator"))
		{
			operator = jsReq.getString("operator"); // --->取出操作人
			// 查询接口
			if (jsReq.has("queryAll"))
			{
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				FittingPublicMapper fittingPublicMapper = sqlSession.getMapper(FittingPublicMapper.class);
				FittingPublic row = new FittingPublic();
				List<FittingPublic> resultList = fittingPublicMapper.findFitting(row);
				result = new JSONArray(resultList);
				// 关闭连接
				sqlSession.close();
			} else
			{
				code = 1;
				errorCode = 1;
				msg = "字段丢失!请检查!";
			}
			// 新增接口
			if (jsReq.has("addFitting"))
			{
				String fittingName = jsReq.getString("fittingName");
				String fittingImgUrl = jsReq.getString("fittingImgUrl");
				String addTime = jsReq.getString("addTime");
				String addAPerson = jsReq.getString("addAPerson");
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
			logger.error("进货管理接口异常:没有操作人");
		}
		// 产生订单号:UUID（16位）
		String orderNumber = UUIDUtil.getOrderIdByUUId();
		// 获取当前服务器时间
		String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("orderNumber", orderNumber);
		jsReply.put("serverTime", serverTime);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		return jsReply.toString();
	}

}
