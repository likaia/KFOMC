package com.lk.db;

import org.json.JSONArray;

public class ProductListInfo
{
	private Integer id;
	private String productName;
	private String specification;
	private String color;
	private String texture;
	private String thickness;
	private Integer unitPrice;
	private Integer memberPrice;
	private Integer wholesalePrice;
	private JSONArray queryType; 
	private String remarks;
	private String addTime;
	private String operator;
	private String dStart;
	private String dEnd;
	private JSONArray ids;
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
	public String getSpecification()
	{
		return specification;
	}
	public void setSpecification(String specification)
	{
		this.specification = specification;
	}
	public String getColor()
	{
		return color;
	}
	public void setColor(String color)
	{
		this.color = color;
	}
	public String getTexture()
	{
		return texture;
	}
	public void setTexture(String texture)
	{
		this.texture = texture;
	}
	public String getThickness()
	{
		return thickness;
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}
	public Integer getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(Integer unitPrice)
	{
		this.unitPrice = unitPrice;
	}
	public Integer getMemberPrice()
	{
		return memberPrice;
	}
	public void setMemberPrice(Integer memberPrice)
	{
		this.memberPrice = memberPrice;
	}
	public Integer getWholesalePrice()
	{
		return wholesalePrice;
	}
	public void setWholesalePrice(Integer wholesalePrice)
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
