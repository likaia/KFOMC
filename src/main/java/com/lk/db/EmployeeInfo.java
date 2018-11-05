package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 23:46:01 root
  *  
* */

public class EmployeeInfo
{
	private Integer id;
	private String nameOfWorker;
	private String  phoneNumber;
	private String  jobNumber;
	private String  department;
	private String  position;
	private String  dateOfBirth;
	private String  dateOfEntry;
	private String  remarks;
	private String operator;
	private String addTime;
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
	public String getPhoneNumber()
	{
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber)
	{
		this.phoneNumber = phoneNumber;
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
	public String getPosition()
	{
		return position;
	}
	public void setPosition(String position)
	{
		this.position = position;
	}
	public String getDateOfBirth()
	{
		return dateOfBirth;
	}
	public void setDateOfBirth(String dateOfBirth)
	{
		this.dateOfBirth = dateOfBirth;
	}
	
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public String getDateOfEntry()
	{
		return dateOfEntry;
	}
	public void setDateOfEntry(String dateOfEntry)
	{
		this.dateOfEntry = dateOfEntry;
	}
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
	}
	public EmployeeInfo()
	{
		super();
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
	public EmployeeInfo(String nameOfWorker, String phoneNumber, String jobNumber, String department, String position,
			String dateOfBirth, String dateOfEntry, String remarks, String operator, String addTime)
	{
		super();
		this.nameOfWorker = nameOfWorker;
		this.phoneNumber = phoneNumber;
		this.jobNumber = jobNumber;
		this.department = department;
		this.position = position;
		this.dateOfBirth = dateOfBirth;
		this.dateOfEntry = dateOfEntry;
		this.remarks = remarks;
		this.operator = operator;
		this.addTime = addTime;
	}
	

	
}
