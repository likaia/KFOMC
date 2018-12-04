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
import com.lk.db.SupplierInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.SupplierInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-28 11:40:51 root
  *  
* */

public class SupplierInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(SupplierInfoAPI.class);

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
			operator = jsReq.getString("operator");
			// 获取当前服务器时间
			String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());
			/*分页查询接口*/
			if(jsReq.has("page")&&jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				SupplierInfo row = new SupplierInfo();
				row.setOperator(operator);
				List<SupplierInfo> resultList = supplierInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<SupplierInfo> pageInfo = new PageInfo<SupplierInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(供应商名称)
			if (jsReq.has("customQuery"))
			{
				String supplierName = jsReq.getString("supplierName");
				if (supplierName.equals(""))
				{
					supplierName = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo row = new SupplierInfo();
				row.setOperator(operator);
				row.setSupplierName(supplierName);
				List<SupplierInfo> resultList = supplierInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			//自定义字段查询
			if(jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo row = new SupplierInfo();
				row.setOperator(operator);
				row.setQueryType(queryType);
				List<SupplierInfo> resultList = supplierInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addSupplier"))
			{
				String supplierName = jsReq.getString("supplierName");
				String primaryContact = jsReq.getString("primaryContact");
				String contactNumber = jsReq.getString("contactNumber");
				String wechat = jsReq.getString("wechat");
				String address = jsReq.getString("address");
				String logoUrl = jsReq.getString("logoUrl");
				String bankAccount = jsReq.getString("bankAccount");
				String bankCardNumber = jsReq.getString("bankCardNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo row = new SupplierInfo(supplierName, primaryContact, contactNumber, wechat, address, logoUrl, bankAccount, bankCardNumber, serverTime, operator);
				int processResult = supplierInfoMapper.add(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "添加成功!";
				}
				else
				{
					code = 1;
					errorCode =1;
					msg = "数据库处理错误";
					logger.error("供应商信息[新增]接口出错!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delSupplier"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo row = new SupplierInfo();
				row.setIds(ids);
				int processResult = supplierInfoMapper.del(row);
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
			if(jsReq.has("updateSupplier"))
			{
				int id = jsReq.getInt("id");
				String supplierName = jsReq.getString("supplierName");
				String primaryContact = jsReq.getString("primaryContact");
				String contactNumber = jsReq.getString("contactNumber");
				String wechat = jsReq.getString("wechat");
				String address = jsReq.getString("address");
				String logoUrl = jsReq.getString("logoUrl");
				String bankAccount = jsReq.getString("bankAccount");
				String bankCardNumber = jsReq.getString("bankCardNumber");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				SupplierInfoMapper supplierInfoMapper = sqlSession.getMapper(SupplierInfoMapper.class);
				SupplierInfo row = new SupplierInfo();
				row.setId(id);
				row.setSupplierName(supplierName);
				row.setPrimaryContact(primaryContact);
				row.setContactNumber(contactNumber);
				row.setWechat(wechat);
				row.setAddress(address);
				row.setLogoUrl(logoUrl);
				row.setBankAccount(bankAccount);
				row.setBankCardNumber(bankCardNumber);
				row.setOperator(operator);
				int processResult = 	supplierInfoMapper.update(row);
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
			logger.error("出货管理接口异常:没有操作人");
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
