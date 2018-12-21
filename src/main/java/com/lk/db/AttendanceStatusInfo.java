package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-07 11:36:52 root
  *  
* */
/*考勤状态信息*/
public class AttendanceStatusInfo
{
	private Integer id;
	private String nameOfWorker;
	private String jobNumber;
	private String department;
	private String workingHours;
	private String afterGetOffWorkTime;
	private String attendanceDate;
	private String wifiInfo;
	private String attendanceLocation;
	private String morningWorkTime;
	private String afternoonWorkTime;
	private String attendanceRange;
	private String fieldCard;
	private String remarks;
	private JSONArray queryType;
	private JSONArray ids;
	private String addTime;
	private String dStart;
	private String dEnd;
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
	public String getDepartment()
	{
		return department;
	}
	public void setDepartment(String department)
	{
		this.department = department;
	}
	public String getWorkingHours()
	{
		return workingHours;
	}
	public void setWorkingHours(String workingHours)
	{
		this.workingHours = workingHours;
	}
	public String getAfterGetOffWorkTime()
	{
		return afterGetOffWorkTime;
	}
	public void setAfterGetOffWorkTime(String afterGetOffWorkTime)
	{
		this.afterGetOffWorkTime = afterGetOffWorkTime;
	}
	public String getAttendanceDate()
	{
		return attendanceDate;
	}
	public void setAttendanceDate(String attendanceDate)
	{
		this.attendanceDate = attendanceDate;
	}
	public String getWifiInfo()
	{
		return wifiInfo;
	}
	public void setWifiInfo(String wifiInfo)
	{
		this.wifiInfo = wifiInfo;
	}
	public String getAttendanceLocation()
	{
		return attendanceLocation;
	}
	public void setAttendanceLocation(String attendanceLocation)
	{
		this.attendanceLocation = attendanceLocation;
	}
	public String getAttendanceRange()
	{
		return attendanceRange;
	}
	public void setAttendanceRange(String attendanceRange)
	{
		this.attendanceRange = attendanceRange;
	}
	public String getFieldCard()
	{
		return fieldCard;
	}
	public void setFieldCard(String fieldCard)
	{
		this.fieldCard = fieldCard;
	}
	
	public String getMorningWorkTime()
	{
		return morningWorkTime;
	}
	public void setMorningWorkTime(String morningWorkTime)
	{
		this.morningWorkTime = morningWorkTime;
	}
	public String getAfternoonWorkTime()
	{
		return afternoonWorkTime;
	}
	public void setAfternoonWorkTime(String afternoonWorkTime)
	{
		this.afternoonWorkTime = afternoonWorkTime;
	}
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
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
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
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
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public AttendanceStatusInfo()
	{
		super();
	}
	public AttendanceStatusInfo(String nameOfWorker, String jobNumber, String department, String workingHours,
			String afterGetOffWorkTime, String attendanceDate, String wifiInfo, String attendanceLocation,
			String attendanceRange, String fieldCard, String remarks, String addTime, String operator)
	{
		super();
		this.nameOfWorker = nameOfWorker;
		this.jobNumber = jobNumber;
		this.department = department;
		this.workingHours = workingHours;
		this.afterGetOffWorkTime = afterGetOffWorkTime;
		this.attendanceDate = attendanceDate;
		this.wifiInfo = wifiInfo;
		this.attendanceLocation = attendanceLocation;
		this.attendanceRange = attendanceRange;
		this.fieldCard = fieldCard;
		this.remarks = remarks;
		this.addTime = addTime;
		this.operator = operator;
	}
	public AttendanceStatusInfo(String nameOfWorker, String jobNumber, String department, String workingHours,
			String afterGetOffWorkTime, String attendanceDate, String wifiInfo, String attendanceLocation,
			String attendanceRange, String fieldCard, String remarks, String operator)
	{
		super();
		this.nameOfWorker = nameOfWorker;
		this.jobNumber = jobNumber;
		this.department = department;
		this.workingHours = workingHours;
		this.afterGetOffWorkTime = afterGetOffWorkTime;
		this.attendanceDate = attendanceDate;
		this.wifiInfo = wifiInfo;
		this.attendanceLocation = attendanceLocation;
		this.attendanceRange = attendanceRange;
		this.fieldCard = fieldCard;
		this.remarks = remarks;
		this.operator = operator;
	}
	
	
}
