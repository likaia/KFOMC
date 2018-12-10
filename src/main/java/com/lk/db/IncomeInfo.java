package com.lk.db;

import org.json.JSONArray;

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
	private String productName;
	private String paymentMethod;
	private Double paymentAmount;
	private String payee;
	private String remarks;
	private String operator;
	private String addTime;
	private String dStart;
	private String bankCardNumber;
	private String dEnd;
	private JSONArray queryType;
	private JSONArray ids;
	private String bankImg;
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
	
	public String getProductName()
	{
		return productName;
	}
	public void setProductName(String productName)
	{
		this.productName = productName;
	}
	public void setPaymentMethod(String paymentMethod)
	{
		this.paymentMethod = paymentMethod;
	}
	
	public Double getPaymentAmount()
	{
		return paymentAmount;
	}
	public void setPaymentAmount(Double paymentAmount)
	{
		this.paymentAmount = paymentAmount;
	}
	public String getPayee()
	{
		return payee;
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
	public void setPayee(String payee)
	{
		this.payee = payee;
	}
	public String getRemarks()
	{
		return remarks;
	}
	
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
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
	
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public IncomeInfo()
	{
		super();
	}
	
	public String getBankImg()
	{
		return bankImg;
	}
	public void setBankImg(String bankImg)
	{
		this.bankImg = bankImg;
	}
	
	public String getBankCardNumber()
	{
		return bankCardNumber;
	}
	public void setBankCardNumber(String bankCardNumber)
	{
		this.bankCardNumber = bankCardNumber;
	}
	public IncomeInfo(String orderNumber, String incomeDate, String clientName, String productName,
			String paymentMethod, Double paymentAmount, String payee, String remarks, String operator, String addTime,
			String bankCardNumber, String bankImg)
	{
		super();
		this.orderNumber = orderNumber;
		this.incomeDate = incomeDate;
		this.clientName = clientName;
		this.productName = productName;
		this.paymentMethod = paymentMethod;
		this.paymentAmount = paymentAmount;
		this.payee = payee;
		this.remarks = remarks;
		this.operator = operator;
		this.addTime = addTime;
		this.bankCardNumber = bankCardNumber;
		this.bankImg = bankImg;
	}	
	
}
