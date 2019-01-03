package com.lk.API;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import af.restful.AfRestfulApi;

import org.apache.ibatis.session.SqlSession;
import org.apache.log4j.Logger;
import org.json.*;
/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:20:51 root
  *  
* */

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.lk.db.MessageApprovalInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.MessageApprovalInfoMapper;

public class MessageApprovalInfoAPI extends AfRestfulApi
{
	private static Logger logger = Logger.getLogger(MessageApprovalInfoAPI.class);
	// 获取当前服务器时间
	String serverTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(Calendar.getInstance().getTime());

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
			// 分页查询接口
			if (jsReq.has("page") && jsReq.has("limit"))
			{
				page = jsReq.getInt("page");
				limit = jsReq.getInt("limit");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				// 使用pageHelper插件进行分页查询
				PageHelper.startPage(page, limit); // 设置分页
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setOperator(operator);
				List<MessageApprovalInfo> resultList = messageApprovalInfoMapper.findexpenditurePage(row);
				// 获取表内所有的数据总记录数 :使用PageInfo方法
				PageInfo<MessageApprovalInfo> pageInfo = new PageInfo<MessageApprovalInfo>(resultList);
				// 获取总记录数
				count = pageInfo.getTotal();
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 自定义查询()
			if (jsReq.has("queryType"))
			{
				JSONArray queryType = jsReq.getJSONArray("queryType");
				String applicant = jsReq.getString("applicant");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setOperator(operator);
				row.setApplicant(applicant);
				if (jsReq.has("addTime"))
				{
					String addTime = jsReq.getString("addTime");
					row.setAddTime(addTime);
				}
				row.setQueryType(queryType);
				List<MessageApprovalInfo> resultList = messageApprovalInfoMapper.customQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 条件查询(可根据 [员工姓名/工号/开始时间/结束时间/请假时间]查询)
			if (jsReq.has("conditionalQuery"))
			{
				String approvalStatus = jsReq.getString("approvalStatus");
				String dStart = jsReq.getString("dStart");
				String dEnd = jsReq.getString("dEnd");
				if (dStart.equals(""))
				{
					dStart = null;
				}
				if (dEnd.equals(""))
				{
					dEnd = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setOperator(operator);
				row.setdStart(dStart);
				row.setdEnd(dEnd);
				row.setApprovalStatus(approvalStatus);
				List<MessageApprovalInfo> resultList = messageApprovalInfoMapper.conditionalQuery(row);
				result = new JSONArray(resultList);
				/* 使用转义字符给数据添加双引号 */
				androidData = "\"" + result + "\"";
				// 关闭链接
				sqlSession.close();
			}
			// 新增数据
			if (jsReq.has("addMessageApprovalInfo"))
			{
				String applicant = jsReq.getString("applicant");
				String approvalType = jsReq.getString("approvalType");
				String approvalContent = jsReq.getString("approvalContent");
				String approvalStatus = jsReq.getString("approvalStatus");
				String addTime = jsReq.getString("addTime");
				if (applicant.equals(""))
				{
					applicant = null;
				}
				if (approvalType.equals(""))
				{
					approvalType = null;
				}
				if (approvalContent.equals(""))
				{
					approvalContent = null;
				}
				if (approvalStatus.equals(""))
				{
					approvalStatus = null;
				}
				if (addTime.equals(""))
				{
					addTime = serverTime;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setOperator(operator);
				row.setApplicant(applicant);
				row.setApprovalType(approvalType);
				row.setApprovalContent(approvalContent);
				row.setApprovalStatus(approvalStatus);
				row.setAddTime(addTime);
				int processResult = messageApprovalInfoMapper.add(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "添加成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "添加失败,数据库错误";
					logger.error("error!!!!");
				}
				sqlSession.close();
			}
			// 批量删除
			if (jsReq.has("delMessageApprovalInfo"))
			{
				JSONArray ids = jsReq.getJSONArray("ids");
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setIds(ids);
				int processResult = messageApprovalInfoMapper.del(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "删除成功!";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "删除失败,数据库错误";
					logger.error("del Error!");
				}
				sqlSession.close();
			}
			// 更新
			if (jsReq.has("updateMessageApprovalInfo"))
			{
				int id = jsReq.getInt("id");
				String applicant = jsReq.getString("applicant");
				String approvalType = jsReq.getString("approvalType");
				String approvalContent = jsReq.getString("approvalContent");
				String approvalStatus = jsReq.getString("approvalStatus");
				if (applicant.equals(""))
				{
					applicant = null;
				}
				if (approvalType.equals(""))
				{
					approvalType = null;
				}
				if (approvalContent.equals(""))
				{
					approvalContent = null;
				}
				if (approvalStatus.equals(""))
				{
					approvalStatus = null;
				}
				// 打开连接
				SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
				// 配置映射器
				MessageApprovalInfoMapper messageApprovalInfoMapper = sqlSession
						.getMapper(MessageApprovalInfoMapper.class);
				MessageApprovalInfo row = new MessageApprovalInfo();
				row.setOperator(operator);
				row.setId(id);
				row.setApplicant(applicant);
				row.setApprovalType(approvalType);
				row.setApprovalContent(approvalContent);
				row.setApprovalStatus(approvalStatus);
				int processResult = messageApprovalInfoMapper.update(row);
				sqlSession.commit();
				if (processResult > 0)
				{
					msg = "更新成功";
				} else
				{
					code = 1;
					errorCode = 1;
					msg = "更新失败";
					logger.error("update Error!");
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
