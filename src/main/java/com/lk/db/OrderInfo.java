package com.lk.db;

public class OrderInfo
{	
	private Integer id;
	private String orderNumber;
	private String orderDate;
	private String clientName;
	private String projectName;
	private Integer glassNumber;
	private Integer totalArea;
	private Integer numberShipments;
	private Integer shipArea;
	private Integer additionalFees;
	private Integer totalAmount;
	private Integer AlreadyPaid;
	private Integer Unpaid;
	private String FinishDelivery;
	private String PreparedBy;
	private String operator;
	private String  queryType;
	private String dStart;
	private String dEnd;
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
	public String getQueryType()
	{
		return queryType;
	}
	public void setQueryType(String queryType)
	{
		this.queryType = queryType;
	}
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
	public Integer getGlassNumber()
	{
		return glassNumber;
	}
	public void setGlassNumber(Integer glassNumber)
	{
		this.glassNumber = glassNumber;
	}
	public Integer getTotalArea()
	{
		return totalArea;
	}
	public void setTotalArea(Integer totalArea)
	{
		this.totalArea = totalArea;
	}
	public Integer getNumberShipments()
	{
		return numberShipments;
	}
	public void setNumberShipments(Integer numberShipments)
	{
		this.numberShipments = numberShipments;
	}
	public Integer getShipArea()
	{
		return shipArea;
	}
	public void setShipArea(Integer shipArea)
	{
		this.shipArea = shipArea;
	}
	public Integer getAdditionalFees()
	{
		return additionalFees;
	}
	public void setAdditionalFees(Integer additionalFees)
	{
		this.additionalFees = additionalFees;
	}
	public Integer getTotalAmount()
	{
		return totalAmount;
	}
	public void setTotalAmount(Integer totalAmount)
	{
		this.totalAmount = totalAmount;
	}
	public Integer getAlreadyPaid()
	{
		return AlreadyPaid;
	}
	public void setAlreadyPaid(Integer alreadyPaid)
	{
		AlreadyPaid = alreadyPaid;
	}
	public Integer getUnpaid()
	{
		return Unpaid;
	}
	public void setUnpaid(Integer unpaid)
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
	public OrderInfo()
	{
		super();
	}
	public OrderInfo(Integer id, String orderNumber, String orderDate, String clientName, String projectName,
			Integer glassNumber, Integer totalArea, Integer numberShipments, Integer shipArea, Integer additionalFees,
			Integer totalAmount, Integer alreadyPaid, Integer unpaid, String finishDelivery, String preparedBy,
			String operator, String queryType)
	{
		super();
		this.id = id;
		this.orderNumber = orderNumber;
		this.orderDate = orderDate;
		this.clientName = clientName;
		this.projectName = projectName;
		this.glassNumber = glassNumber;
		this.totalArea = totalArea;
		this.numberShipments = numberShipments;
		this.shipArea = shipArea;
		this.additionalFees = additionalFees;
		this.totalAmount = totalAmount;
		AlreadyPaid = alreadyPaid;
		Unpaid = unpaid;
		FinishDelivery = finishDelivery;
		PreparedBy = preparedBy;
		this.operator = operator;
		this.queryType = queryType;
	}

	
}
