package com.lk.db;

public class ProductNumeInfo
{
	private Integer id;
	private String productName;
	private String specification;
	private String color;
	private String Texture;
	private String thickness;
	private String unitPrice;
	private String memberPrice;
	private String WholesalePrice;
	private String queryType;
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
		return Texture;
	}
	public void setTexture(String texture)
	{
		Texture = texture;
	}
	public String getThickness()
	{
		return thickness;
	}
	public void setThickness(String thickness)
	{
		this.thickness = thickness;
	}
	public String getUnitPrice()
	{
		return unitPrice;
	}
	public void setUnitPrice(String unitPrice)
	{
		this.unitPrice = unitPrice;
	}
	public String getMemberPrice()
	{
		return memberPrice;
	}
	public void setMemberPrice(String memberPrice)
	{
		this.memberPrice = memberPrice;
	}
	public String getWholesalePrice()
	{
		return WholesalePrice;
	}
	public void setWholesalePrice(String wholesalePrice)
	{
		WholesalePrice = wholesalePrice;
	}
	public ProductNumeInfo()
	{
		super();
	}
	public ProductNumeInfo(String productName, String specification, String color, String texture, String thickness,
			String unitPrice, String memberPrice, String wholesalePrice)
	{
		super();
		this.productName = productName;
		this.specification = specification;
		this.color = color;
		Texture = texture;
		this.thickness = thickness;
		this.unitPrice = unitPrice;
		this.memberPrice = memberPrice;
		WholesalePrice = wholesalePrice;
	}
	
}
