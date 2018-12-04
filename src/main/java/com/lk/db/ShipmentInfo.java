package com.lk.db;

import org.json.JSONArray;

/*出货管理*/
public class ShipmentInfo
{
	private Integer id;
	private String clientName;
	private String dateOfShipment;
	private String specificationModel;
	private String unfinishedArr;
	private String theTotalAmount;
	private String numberShipments;
	private String shipArea;
	private String theRemainingAmount;
	private String remainingArea;
	private String paymentDetails;
	private String transportationManager;
	private String orderNumber;
	private JSONArray queryType;
	private String  freight;
	public String getFreight()
	{
		return freight;
	}
	public void setFreight(String freight)
	{
		this.freight = freight;
	}
	public String getUnfinishedArr()
	{
		return unfinishedArr;
	}
	public void setUnfinishedArr(String unfinishedArr)
	{
		this.unfinishedArr = unfinishedArr;
	}
	public String getTheTotalAmount()
	{
		return theTotalAmount;
	}
	public void setTheTotalAmount(String theTotalAmount)
	{
		this.theTotalAmount = theTotalAmount;
	}
	private String operator;
	private String dStart;
	private String dEnd;
	private JSONArray ids;
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getClientName()
	{
		return clientName;
	}
	public void setClientName(String clientName)
	{
		this.clientName = clientName;
	}
	public String getDateOfShipment()
	{
		return dateOfShipment;
	}
	public void setDateOfShipment(String dateOfShipment)
	{
		this.dateOfShipment = dateOfShipment;
	}
	
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public String getSpecificationModel()
	{
		return specificationModel;
	}
	public void setSpecificationModel(String specificationModel)
	{
		this.specificationModel = specificationModel;
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
	public String getTheRemainingAmount()
	{
		return theRemainingAmount;
	}
	public void setTheRemainingAmount(String theRemainingAmount)
	{
		this.theRemainingAmount = theRemainingAmount;
	}
	public String getRemainingArea()
	{
		return remainingArea;
	}
	public void setRemainingArea(String remainingArea)
	{
		this.remainingArea = remainingArea;
	}
	public String getPaymentDetails()
	{
		return paymentDetails;
	}
	public void setPaymentDetails(String paymentDetails)
	{
		this.paymentDetails = paymentDetails;
	}
	public String getTransportationManager()
	{
		return transportationManager;
	}
	public void setTransportationManager(String transportationManager)
	{
		this.transportationManager = transportationManager;
	}
	
	public String getOrderNumber()
	{
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
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
	
	public ShipmentInfo(String clientName, String dateOfShipment, String specificationModel, String unfinishedArr,
			String theTotalAmount, String numberShipments, String shipArea, String theRemainingAmount,
			String remainingArea, String paymentDetails, String transportationManager, String freight, String operator)
	{
		super();
		this.clientName = clientName;
		this.dateOfShipment = dateOfShipment;
		this.specificationModel = specificationModel;
		this.unfinishedArr = unfinishedArr;
		this.theTotalAmount = theTotalAmount;
		this.numberShipments = numberShipments;
		this.shipArea = shipArea;
		this.theRemainingAmount = theRemainingAmount;
		this.remainingArea = remainingArea;
		this.paymentDetails = paymentDetails;
		this.transportationManager = transportationManager;
		this.freight = freight;
		this.operator = operator;
	}
	public ShipmentInfo()
	{
		super();
	}
	
}
