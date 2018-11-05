package com.lk.db;

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
	private Integer daysToAttend;
	private Integer actualAttendanceDays;
	private Integer askForLeaveDays;
	private Integer leaveDays;
	private Integer sickLeaveDays;
	private String remark; 
	private String addTime;
	private String operator;
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
	public Integer getDaysToAttend()
	{
		return daysToAttend;
	}
	public void setDaysToAttend(Integer daysToAttend)
	{
		this.daysToAttend = daysToAttend;
	}
	public Integer getActualAttendanceDays()
	{
		return actualAttendanceDays;
	}
	public void setActualAttendanceDays(Integer actualAttendanceDays)
	{
		this.actualAttendanceDays = actualAttendanceDays;
	}
	public Integer getAskForLeaveDays()
	{
		return askForLeaveDays;
	}
	public void setAskForLeaveDays(Integer askForLeaveDays)
	{
		this.askForLeaveDays = askForLeaveDays;
	}
	public Integer getLeaveDays()
	{
		return leaveDays;
	}
	public void setLeaveDays(Integer leaveDays)
	{
		this.leaveDays = leaveDays;
	}
	public Integer getSickLeaveDays()
	{
		return sickLeaveDays;
	}
	public void setSickLeaveDays(Integer sickLeaveDays)
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
	public AttendanceInfo()
	{
		super();
	}
	
}
