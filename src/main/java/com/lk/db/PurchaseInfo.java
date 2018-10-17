package com.lk.db;

import org.json.JSONArray;

public class PurchaseInfo
{
	private int id;
	private String orderNumber;
	private String purchaseDate;
	private String supplier;
	private String specificationModel;
	private String thickness;
	private String color;
	private String quantity;
	private String unitPrice;
	private String TotalPurchase;
	private String ShippingFee ;
	private String remarks;
	private String operator;
	private String dStart;
	private String dEnd;
	private JSONArray orders;
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
	public String getOrderNumber()
	{
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
	}
	public String getPurchaseDate()
	{
		return purchaseDate;
	}
	public void setPurchaseDate(String purchaseDate)
	{
		this.purchaseDate = purchaseDate;
	}
	public int getId()
	{
		return id;
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
	public String getThickness()
	{
		return thickness;
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}
	public String getColor()
	{
		return color;
	}
	public void setColor(String color)
	{
		this.color = color;
	}
	public String getQuantity()
	{
		return quantity;
	}
	public void setQuantity(String quantity)
	{
		this.quantity = quantity;
	}
	public String getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(String unitPrice)
	{
		this.unitPrice = unitPrice;
	}
	public String getTotalPurchase()
	{
		return TotalPurchase;
	}
	public void setTotalPurchase(String totalPurchase)
	{
		TotalPurchase = totalPurchase;
	}
	public String getShippingFee()
	{
		return ShippingFee;
	}
	public void setShippingFee(String shippingFee)
	{
		ShippingFee = shippingFee;
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
	public void setId(int id)
	{
		this.id = id;
	}
	public PurchaseInfo()
	{
		super();
	}
	public PurchaseInfo(String orderNumber, String purchaseDate, String supplier, String specificationModel,
			String thickness, String color, String quantity, String unitPrice, String totalPurchase, String shippingFee,
			String remarks, String operator)
	{
		super();
		this.orderNumber = orderNumber;
		this.purchaseDate = purchaseDate;
		this.supplier = supplier;
		this.specificationModel = specificationModel;
		this.thickness = thickness;
		this.color = color;
		this.quantity = quantity;
		this.unitPrice = unitPrice;
		TotalPurchase = totalPurchase;
		ShippingFee = shippingFee;
		this.remarks = remarks;
		this.operator = operator;
	}
}