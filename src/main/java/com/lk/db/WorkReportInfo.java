package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:12:12 root
  *  
* */
/**工作汇报信息*/

public class WorkReportInfo
{
	private Integer id;
	private String workReportName;
	private String completeTheTaskThisWeek;
	private String unfinishedTasksThisWeek;
	private String weeklyPicture;
	private String weeklyNote;
	private String addTime;
	private String operator;
	private JSONArray queryType;
	private String dStart;
	private String dEnd;
	private JSONArray ids;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getWorkReportName()
	{
		return workReportName;
	}
	public void setWorkReportName(String workReportName)
	{
		this.workReportName = workReportName;
	}
	public String getCompleteTheTaskThisWeek()
	{
		return completeTheTaskThisWeek;
	}
	public void setCompleteTheTaskThisWeek(String completeTheTaskThisWeek)
	{
		this.completeTheTaskThisWeek = completeTheTaskThisWeek;
	}
	public String getUnfinishedTasksThisWeek()
	{
		return unfinishedTasksThisWeek;
	}
	public void setUnfinishedTasksThisWeek(String unfinishedTasksThisWeek)
	{
		this.unfinishedTasksThisWeek = unfinishedTasksThisWeek;
	}
	public String getWeeklyPicture()
	{
		return weeklyPicture;
	}
	public void setWeeklyPicture(String weeklyPicture)
	{
		this.weeklyPicture = weeklyPicture;
	}
	public String getWeeklyNote()
	{
		return weeklyNote;
	}
	public void setWeeklyNote(String weeklyNote)
	{
		this.weeklyNote = weeklyNote;
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
