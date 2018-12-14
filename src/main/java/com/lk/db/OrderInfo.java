package com.lk.db;

import org.json.JSONArray;

public class OrderInfo
{	
	private Integer id;
	private String orderNumber;
	private String orderDate;
	private String clientName;
	private String projectName;
	private String glassNumber;
	private String totalArea;
	private String numberShipments;
	private String shipArea;
	private String additionalFees; //--->其他费用
	private String totalAmount;
	private String AlreadyPaid;
	private String Unpaid;
	private String FinishDelivery;
	private String PreparedBy;
	private String operator;
	private String companyName;
	private JSONArray queryType; 
	private String unfinishedArr; //未发货的规格型号
	public String getUnfinishedArr()
	{
		return unfinishedArr;
	}
	public void setUnfinishedArr(String unfinishedArr)
	{
		this.unfinishedArr = unfinishedArr;
	}
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}

	private String dStart;
	private String dEnd;
	private String deliveryAddress;  //--->送货地址
	private String contactNumber; //--->联系电话
	private String shippingMethod;//--->发货方式
	private String remarks;//--->备注
	private String modelDetails;//--->规格型号
	private JSONArray orders;
	public JSONArray getOrders()
	{
		return orders;
	}
	public void setOrders(JSONArray orders)
	{
		this.orders = orders;
	}
	
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getModelDetails()
	{
		return modelDetails;
	}
	public void setModelDetails(String modelDetails)
	{
		this.modelDetails = modelDetails;
	}
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
	}
	public String getShippingMethod()
	{
		return shippingMethod;
	}
	public void setShippingMethod(String shippingMethod)
	{
		this.shippingMethod = shippingMethod;
	}
	public String getContactNumber()
	{
		return contactNumber;
	}
	public void setContactNumber(String contactNumber)
	{
		this.contactNumber = contactNumber;
	}
	public String getDeliveryAddress()
	{
		return deliveryAddress;
	}
	public void setDeliveryAddress(String deliveryAddress)
	{
		this.deliveryAddress = deliveryAddress;
	}
	public String getOrderNumber()
	{
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
	}
	public String getOrderDate()
	{
		return orderDate;
	}
	public void setOrderDate(String orderDate)
	{
		this.orderDate = orderDate;
	}
	public String getClientName()
	{
		return clientName;
	}
	public void setClientName(String clientName)
	{
		this.clientName = clientName;
	}
	public String getProjectName()
	{
		return projectName;
	}
	public void setProjectName(String projectName)
	{
		this.projectName = projectName;
	}
	public String getGlassNumber()
	{
		return glassNumber;
	}
	public void setGlassNumber(String glassNumber)
	{
		this.glassNumber = glassNumber;
	}
	public String getTotalArea()
	{
		return totalArea;
	}
	public void setTotalArea(String totalArea)
	{
		this.totalArea = totalArea;
	}
	public String getNumberShipments()
	{
		return numberShipments;
	}
	public void setNumberShipments(String numberShipments)
	{
		this.numberShipments = numberShipments;
	}
	public String getShipArea()
	{
		return shipArea;
	}
	public void setShipArea(String shipArea)
	{
		this.shipArea = shipArea;
	}
	public String getAdditionalFees()
	{
		return additionalFees;
	}
	public void setAdditionalFees(String additionalFees)
	{
		this.additionalFees = additionalFees;
	}
	public String getTotalAmount()
	{
		return totalAmount;
	}
	public void setTotalAmount(String totalAmount)
	{
		this.totalAmount = totalAmount;
	}
	public String getAlreadyPaid()
	{
		return AlreadyPaid;
	}
	public void setAlreadyPaid(String alreadyPaid)
	{
		AlreadyPaid = alreadyPaid;
	}
	public String getUnpaid()
	{
		return Unpaid;
	}
	public void setUnpaid(String unpaid)
	{
		Unpaid = unpaid;
	}
	public String getFinishDelivery()
	{
		return FinishDelivery;
	}
	public void setFinishDelivery(String finishDelivery)
	{
		FinishDelivery = finishDelivery;
	}
	public String getPreparedBy()
	{
		return PreparedBy;
	}
	public void setPreparedBy(String preparedBy)
	{
		PreparedBy = preparedBy;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
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
	public Integer getId()
	{
		return id;
	}
	
	public String getCompanyName()
	{
		return companyName;
	}
	public void setCompanyName(String companyName)
	{
		this.companyName = companyName;
	}
	public OrderInfo()
	{
		super();
	}
	
}
