package com.lk.db;

import org.json.JSONArray;

/*配件表字段映射*/
public class FittingInfo
{
	private Integer id;
	private String orderNumber;
	private String fittingDate;
	private String supplier;
	private String specificationModel;
	private String purchaseQuantity;
	private String totalPurchase;
	private String paymentDetails;
	private String otherFee;
	private String remarks;
	private String operator;
	private JSONArray orders;
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
	public String getFittingDate()
	{
		return fittingDate;
	}
	public void setFittingDate(String fittingDate)
	{
		this.fittingDate = fittingDate;
	}
	public String getSupplier()
	{
		return supplier;
	}
	public void setSupplier(String supplier)
	{
		this.supplier = supplier;
	}
	public String getSpecificationModel()
	{
		return specificationModel;
	}
	public void setSpecificationModel(String specificationModel)
	{
		this.specificationModel = specificationModel;
	}
	public String getPurchaseQuantity()
	{
		return purchaseQuantity;
	}
	public void setPurchaseQuantity(String purchaseQuantity)
	{
		this.purchaseQuantity = purchaseQuantity;
	}
	public String getTotalPurchase()
	{
		return totalPurchase;
	}
	public void setTotalPurchase(String totalPurchase)
	{
		this.totalPurchase = totalPurchase;
	}
	public String getPaymentDetails()
	{
		return paymentDetails;
	}
	public void setPaymentDetails(String paymentDetails)
	{
		this.paymentDetails = paymentDetails;
	}
	public String getOtherFee()
	{
		return otherFee;
	}
	public void setOtherFee(String otherFee)
	{
		this.otherFee = otherFee;
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
	public JSONArray getOrders()
	{
		return orders;
	}
	public void setOrders(JSONArray orders)
	{
		this.orders = orders;
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
	public FittingInfo(String orderNumber, String fittingDate, String supplier, String specificationModel,
			String purchaseQuantity, String totalPurchase, String paymentDetails, String otherFee, String remarks,
			String operator)
	{
		super();
		this.orderNumber = orderNumber;
		this.fittingDate = fittingDate;
		this.supplier = supplier;
		this.specificationModel = specificationModel;
		this.purchaseQuantity = purchaseQuantity;
		this.totalPurchase = totalPurchase;
		this.paymentDetails = paymentDetails;
		this.otherFee = otherFee;
		this.remarks = remarks;
		this.operator = operator;
	}
	public FittingInfo()
	{
		super();
	}
	
} 
