package com.lk.db;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 14:29:46 root
  *  
* */
/*财务管理[收入管理]*/

public class IncomeInfo
{
	private Integer id;
	private String orderNumber;
	private String incomeDate;
	private String clientName;
	private String paymentMethod;
	private String paymentAmount;
	private String payee;
	private String remarks;
	private String operator;
	private String addTime;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getOrderNumber()
	{
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
	}
	public String getIncomeDate()
	{
		return incomeDate;
	}
	public void setIncomeDate(String incomeDate)
	{
		this.incomeDate = incomeDate;
	}
	public String getClientName()
	{
		return clientName;
	}
	public void setClientName(String clientName)
	{
		this.clientName = clientName;
	}
	public String getPaymentMethod()
	{
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod)
	{
		this.paymentMethod = paymentMethod;
	}
	public String getPaymentAmount()
	{
		return paymentAmount;
	}
	public void setPaymentAmount(String paymentAmount)
	{
		this.paymentAmount = paymentAmount;
	}
	public String getPayee()
	{
		return payee;
	}
	public void setPayee(String payee)
	{
		this.payee = payee;
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
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	
	public IncomeInfo()
	{
		super();
	}
	public IncomeInfo(String orderNumber, String incomeDate, String clientName, String paymentMethod,
			String paymentAmount, String payee, String remarks, String operator, String addTime)
	{
		super();
		this.orderNumber = orderNumber;
		this.incomeDate = incomeDate;
		this.clientName = clientName;
		this.paymentMethod = paymentMethod;
		this.paymentAmount = paymentAmount;
		this.payee = payee;
		this.remarks = remarks;
		this.operator = operator;
		this.addTime = addTime;
	}
	
}
