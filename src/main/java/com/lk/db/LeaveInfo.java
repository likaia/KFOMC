package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:05:07 root
  *  
* */
/**请假信息*/

public class LeaveInfo
{
	private Integer id;
	private String leaveTheTitle;
	private String leaveType;
	private String leaveContent;
	private String leaveStartTime;
	private String leaveTime;
	private String leavePicture;
	private String addTime;
	private String operator;
	private JSONArray queryType;
	private JSONArray ids;
	private String dStart;
	private String dEnd;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getLeaveTheTitle()
	{
		return leaveTheTitle;
	}
	public void setLeaveTheTitle(String leaveTheTitle)
	{
		this.leaveTheTitle = leaveTheTitle;
	}
	public String getLeaveType()
	{
		return leaveType;
	}
	public void setLeaveType(String leaveType)
	{
		this.leaveType = leaveType;
	}
	public String getLeaveContent()
	{
		return leaveContent;
	}
	public void setLeaveContent(String leaveContent)
	{
		this.leaveContent = leaveContent;
	}
	public String getLeaveStartTime()
	{
		return leaveStartTime;
	}
	public void setLeaveStartTime(String leaveStartTime)
	{
		this.leaveStartTime = leaveStartTime;
	}
	public String getLeaveTime()
	{
		return leaveTime;
	}
	public void setLeaveTime(String leaveTime)
	{
		this.leaveTime = leaveTime;
	}
	public String getLeavePicture()
	{
		return leavePicture;
	}
	public void setLeavePicture(String leavePicture)
	{
		this.leavePicture = leavePicture;
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
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
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
	
}
