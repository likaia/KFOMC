package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:14:59 root
  *  
* */

public class MessageApprovalInfo
{
	private Integer id;
	private String applicant;
	private String approvalType;
	private String approvalContent;
	private String approvalStatus;
	private String addTime;
	private String operator;
	private JSONArray queryType;
	private String dStart;
	private String dEnd;
	private JSONArray ids;
	private String remarks;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
	}
	public String getApplicant()
	{
		return applicant;
	}
	public void setApplicant(String applicant)
	{
		this.applicant = applicant;
	}
	public String getApprovalType()
	{
		return approvalType;
	}
	public void setApprovalType(String approvalType)
	{
		this.approvalType = approvalType;
	}
	public String getApprovalContent()
	{
		return approvalContent;
	}
	public void setApprovalContent(String approvalContent)
	{
		this.approvalContent = approvalContent;
	}
	public String getApprovalStatus()
	{
		return approvalStatus;
	}
	public void setApprovalStatus(String approvalStatus)
	{
		this.approvalStatus = approvalStatus;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public String getdStart()
	{
		return dStart;
	}
	public void setdStart(String dStart)
	{
		this.dStart = dStart;
	}
	public String getdEnd()
	{
		return dEnd;
	}
	public void setdEnd(String dEnd)
	{
		this.dEnd = dEnd;
	}
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	
}
