package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 17:06:32 root
  *  
* */

public class AttendanceInfo
{
	/*考勤信息*/
	private Integer id;
	private String nameOfWorker;
	private String jobNumber;
	private String division;
	private Double daysToAttend;
	private Double actualAttendanceDays;
	private Double askForLeaveDays;
	private Double leaveDays;
	private Double sickLeaveDays;
	private String remark; 
	private String addTime;
	private String operator;
	private JSONArray ids;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getNameOfWorker()
	{
		return nameOfWorker;
	}
	public void setNameOfWorker(String nameOfWorker)
	{
		this.nameOfWorker = nameOfWorker;
	}
	public String getJobNumber()
	{
		return jobNumber;
	}
	public void setJobNumber(String jobNumber)
	{
		this.jobNumber = jobNumber;
	}
	public String getDivision()
	{
		return division;
	}
	public void setDivision(String division)
	{
		this.division = division;
	}
	
	
	public Double getDaysToAttend()
	{
		return daysToAttend;
	}
	public void setDaysToAttend(Double daysToAttend)
	{
		this.daysToAttend = daysToAttend;
	}
	public Double getActualAttendanceDays()
	{
		return actualAttendanceDays;
	}
	public void setActualAttendanceDays(Double actualAttendanceDays)
	{
		this.actualAttendanceDays = actualAttendanceDays;
	}
	public Double getAskForLeaveDays()
	{
		return askForLeaveDays;
	}
	public void setAskForLeaveDays(Double askForLeaveDays)
	{
		this.askForLeaveDays = askForLeaveDays;
	}
	public Double getLeaveDays()
	{
		return leaveDays;
	}
	public void setLeaveDays(Double leaveDays)
	{
		this.leaveDays = leaveDays;
	}
	public Double getSickLeaveDays()
	{
		return sickLeaveDays;
	}
	public void setSickLeaveDays(Double sickLeaveDays)
	{
		this.sickLeaveDays = sickLeaveDays;
	}
	public String getRemark()
	{
		return remark;
	}
	public void setRemark(String remark)
	{
		this.remark = remark;
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
	
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	public AttendanceInfo()
	{
		super();
	}
	public AttendanceInfo(String nameOfWorker, String jobNumber, String division, Double daysToAttend,
			Double actualAttendanceDays, Double askForLeaveDays, Double leaveDays, Double sickLeaveDays, String remark,
			String addTime, String operator)
	{
		super();
		this.nameOfWorker = nameOfWorker;
		this.jobNumber = jobNumber;
		this.division = division;
		this.daysToAttend = daysToAttend;
		this.actualAttendanceDays = actualAttendanceDays;
		this.askForLeaveDays = askForLeaveDays;
		this.leaveDays = leaveDays;
		this.sickLeaveDays = sickLeaveDays;
		this.remark = remark;
		this.addTime = addTime;
		this.operator = operator;
	}
	
	
}
