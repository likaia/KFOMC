package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 22:07:21 root
  *  
* */

public class SalaryInfo
{
	private Integer id;
	private String nameOfWorker;
	private String jobNumber;
	private String position;
	private Double basicWage;
	private Double jobSubsidy;
	private Double payable;
	private Double attendanceDeduction;
	private Double personalIncomeTax;
	private Double realWage;
	private String signingTime;
	private String remarks;
	private String operator;
	JSONArray ids;
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
	public String getPosition()
	{
		return position;
	}
	public void setPosition(String position)
	{
		this.position = position;
	}
	public Double getBasicWage()
	{
		return basicWage;
	}
	public void setBasicWage(Double basicWage)
	{
		this.basicWage = basicWage;
	}
	public Double getJobSubsidy()
	{
		return jobSubsidy;
	}
	public void setJobSubsidy(Double jobSubsidy)
	{
		this.jobSubsidy = jobSubsidy;
	}
	public Double getPayable()
	{
		return payable;
	}
	public void setPayable(Double payable)
	{
		this.payable = payable;
	}
	public Double getAttendanceDeduction()
	{
		return attendanceDeduction;
	}
	public void setAttendanceDeduction(Double attendanceDeduction)
	{
		this.attendanceDeduction = attendanceDeduction;
	}
	public Double getPersonalIncomeTax()
	{
		return personalIncomeTax;
	}
	public void setPersonalIncomeTax(Double personalIncomeTax)
	{
		this.personalIncomeTax = personalIncomeTax;
	}

	public Double getRealWage()
	{
		return realWage;
	}
	public void setRealWage(Double realWage)
	{
		this.realWage = realWage;
	}
	public String getSigningTime()
	{
		return signingTime;
	}
	public String getStringSigningTime()
	{
		return signingTime;
	}
	public void setSigningTime(String signingTime)
	{
		this.signingTime = signingTime;
	}
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public SalaryInfo()
	{
		super();
	}
	
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	public SalaryInfo(String nameOfWorker, String jobNumber, String position, Double basicWage, Double jobSubsidy,
			Double payable, Double attendanceDeduction, Double personalIncomeTax, Double realWage, String signingTime,
			String remarks, String operator)
	{
		super();
		this.nameOfWorker = nameOfWorker;
		this.jobNumber = jobNumber;
		this.position = position;
		this.basicWage = basicWage;
		this.jobSubsidy = jobSubsidy;
		this.payable = payable;
		this.attendanceDeduction = attendanceDeduction;
		this.personalIncomeTax = personalIncomeTax;
		this.realWage = realWage;
		this.signingTime = signingTime;
		this.remarks = remarks;
		this.operator = operator;
	}
	
	
}
