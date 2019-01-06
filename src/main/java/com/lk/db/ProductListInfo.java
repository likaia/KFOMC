package com.lk.db;

import org.json.JSONArray;

public class ProductListInfo
{
	private Integer id;
	private String productName;
	private String color;
	private String thickness;
	private Double unitPrice;
	private Double wholesalePrice;
	private JSONArray queryType;
	private Double area;
	private String remarks;
	private String addTime;
	private String operator;
	private String dStart;
	private String dEnd;
	private JSONArray ids;
	private Integer length;
	private Integer width;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getProductName()
	{
		return productName;
	}
	public void setProductName(String productName)
	{
		this.productName = productName;
	}

	public String getColor()
	{
		return color;
	}
	public void setColor(String color)
	{
		this.color = color;
	}

	
	public Double getArea()
	{
		return area;
	}
	public void setArea(Double area)
	{
		this.area = area;
	}
	public String getThickness()
	{
		return thickness;
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}
	
	public Double getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(Double unitPrice)
	{
		this.unitPrice = unitPrice;
	}
	public Double getWholesalePrice()
	{
		return wholesalePrice;
	}
	public void setWholesalePrice(Double wholesalePrice)
	{
		this.wholesalePrice = wholesalePrice;
	}
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public String getRemarks()
	{
		return remarks;
	}
	public void setRemarks(String remarks)
	{
		this.remarks = remarks;
	}
	
	public Integer getLength()
	{
		return length;
	}
	public void setLength(Integer length)
	{
		this.length = length;
	}
	public Integer getWidth()
	{
		return width;
	}
	public void setWidth(Integer width)
	{
		this.width = width;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public ProductListInfo()
	{
		super();
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
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	
}
