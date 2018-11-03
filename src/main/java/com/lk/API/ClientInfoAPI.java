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
import com.lk.db.ClientInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ClientInfoMapper;

import af.restful.AfRestfulApi;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-01 16:47:24 root
  *  
* */

public class ClientInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(ClientInfoAPI.class);
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
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				ClientInfo row  = new ClientInfo();
				row.setOperator(operator);
				List<ClientInfo> resultList = clientInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<ClientInfo> pageInfo = new PageInfo<ClientInfo>(resultList);
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
				/*根据 (客户姓名) 或者 (日期查询)数据*/
				String clientName = jsReq.getString("clientName");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if(clientName.equals(""))
				{
					clientName = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				ClientInfo row  = new ClientInfo();
				row.setClientName(clientName);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setOperator(operator);
				List<ClientInfo> resultList = clientInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addClient"))
			{
				String customerType = jsReq.getString("customerType");//--->客户类型
				String clientName = jsReq.getString("clientName");//--->客户名称
				String companyName = jsReq.getString("companyName");//--->公司名称
				String taxNumber = jsReq.getString("taxNumber");//--->税号
				String address = jsReq.getString("address");//--->地址
				String phoneNumber = jsReq.getString("phoneNumber");//--->手机号
				String weChat = jsReq.getString("weChat");//--->微信号
				String email = jsReq.getString("email");//--->邮箱
				String bankAccount = jsReq.getString("bankAccount");//--->开户银行
				String bankCardNumber = jsReq.getString("bankCardNumber");//--->银行卡号
				String joinTime = serverTime;//--->加入时间
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				ClientInfo row  = new ClientInfo(customerType, clientName, companyName, taxNumber, address, phoneNumber, weChat, email, bankAccount, bankCardNumber, joinTime, operator);
				int processResult = clientInfoMapper.add(row);
				sqlSession.commit();
				if(processResult>0)
				{
					msg = "添加成功";
				}
				else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("客户信息管理接口错误,添加失败!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delClients"))
			{
				JSONArray ids = jsReq.getJSONArray("ids"); 
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				ClientInfo row  = new ClientInfo();
				row.setIds(ids);
				row.setOperator(operator);
				int processResult = clientInfoMapper.del(row);
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
					logger.error("客户信息管理,删除接口出错!");
				}
				sqlSession.close();
			}
			//更新客户信息
			if(jsReq.has("updateClient"))
			{
				int id = jsReq.getInt("clientId");
				String customerType = jsReq.getString("customerType");//--->客户类型
				String clientName = jsReq.getString("clientName");//--->客户名称
				String companyName = jsReq.getString("companyName");//--->公司名称
				String taxNumber = jsReq.getString("taxNumber");//--->税号
				String address = jsReq.getString("address");//--->地址
				String phoneNumber = jsReq.getString("phoneNumber");//--->手机号
				String weChat = jsReq.getString("weChat");//--->微信号
				String email = jsReq.getString("email");//--->邮箱
				String bankAccount = jsReq.getString("bankAccount");//--->开户银行
				String bankCardNumber = jsReq.getString("bankCardNumber");//--->银行卡号
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
				ClientInfo row  = new ClientInfo();
				row.setId(id);
				row.setCustomerType(customerType);
				row.setClientName(clientName);
				row.setCompanyName(companyName);
				row.setTaxNumber(taxNumber);
				row.setAddress(address);
				row.setPhoneNumber(phoneNumber);
				row.setWeChat(weChat);
				row.setEmail(email);
				row.setBankAccount(bankAccount);
				row.setOperator(operator);
				row.setBankCardNumber(bankCardNumber);
				int processResult = clientInfoMapper.update(row);
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
					logger.error("客户信息:更新接口错误");
				}
				sqlSession.close();
			}
		}
		else
		{
			code = 1;
			errorCode = 1;
			msg = "字段丢失:operator is Undefined";
			logger.error("客户管理接口异常:没有操作人");
		}
		/* 构造返回对象 */
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("code", code);
		jsReply.put("msg", msg);
		jsReply.put("data", result);
		jsReply.put("serverTime", serverTime);
		jsReply.put("androidData", androidData);
		jsReply.put("operator", operator);
		jsReply.put("count", count);
		return jsReply.toString();
	}

}
