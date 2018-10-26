package com.lk.db;

import org.json.JSONArray;

/*出货管理*/
public class ShipmentInfo
{
	private Integer id;
	private String clientName;
	private String dateOfShipment;
	private String specificationModel;
	private String numberShipments;
	private String shipArea;
	private String theRemainingAmount;
	private String remainingArea;
	private String amountOfPayment;
	private String paymentDetails;
	private String transportationManager;
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
	public String getAmountOfPayment()
	{
		return amountOfPayment;
	}
	public void setAmountOfPayment(String amountOfPayment)
	{
		this.amountOfPayment = amountOfPayment;
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
	public ShipmentInfo(String clientName, String dateOfShipment, String specificationModel, String numberShipments,
			String shipArea, String theRemainingAmount, String remainingArea, String amountOfPayment,
			String paymentDetails, String transportationManager, String operator)
	{
		super();
		this.clientName = clientName;
		this.dateOfShipment = dateOfShipment;
		this.specificationModel = specificationModel;
		this.numberShipments = numberShipments;
		this.shipArea = shipArea;
		this.theRemainingAmount = theRemainingAmount;
		this.remainingArea = remainingArea;
		this.amountOfPayment = amountOfPayment;
		this.paymentDetails = paymentDetails;
		this.transportationManager = transportationManager;
		this.operator = operator;
	}
	public ShipmentInfo()
	{
		super();
	}
	
}
