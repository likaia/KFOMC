package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 17:47:55 root
  *  
* */
/*财务管理[支出管理]*/
public class OutlayInfo
{
	private Integer id;
	private String orderNumber;
	private String outlayDate;
	private String outlayType;
	private String paymentMethod;
	private Double paymentAmount;
	private String remarks;
	private String operator;
	private String addTime;
	private JSONArray ids;
	private JSONArray queryType;
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
	public String getOrderNumber()
	{
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
	}
	public String getOutlayDate()
	{
		return outlayDate;
	}
	public void setOutlayDate(String outlayDate)
	{
		this.outlayDate = outlayDate;
	}
	public String getOutlayType()
	{
		return outlayType;
	}
	public void setOutlayType(String outlayType)
	{
		this.outlayType = outlayType;
	}
	public String getPaymentMethod()
	{
		return paymentMethod;
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
	public OutlayInfo()
	{
		super();
	}
	

	public OutlayInfo(Integer id, String orderNumber, String outlayDate, String outlayType, String paymentMethod,
			Double paymentAmount, String remarks, String operator)
	{
		super();
		this.id = id;
		this.orderNumber = orderNumber;
		this.outlayDate = outlayDate;
		this.outlayType = outlayType;
		this.paymentMethod = paymentMethod;
		this.paymentAmount = paymentAmount;
		this.remarks = remarks;
		this.operator = operator;
	}
	public OutlayInfo(String orderNumber, String outlayDate, String outlayType, String paymentMethod,
			Double paymentAmount, String remarks, String operator, String addTime)
	{
		super();
		this.orderNumber = orderNumber;
		this.outlayDate = outlayDate;
		this.outlayType = outlayType;
		this.paymentMethod = paymentMethod;
		this.paymentAmount = paymentAmount;
		this.remarks = remarks;
		this.operator = operator;
		this.addTime = addTime;
	}
	
}
