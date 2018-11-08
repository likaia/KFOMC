package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-07 11:40:52 root
  *  
* */

public class InventoryInfo
{
	private Integer id;
	private String originalTitle;
	private String originalColor;
	private String originalThickness;
	private Integer storageNum;
	private Integer numberOfOutbound;
	private Integer stockBalance;
	private Double stockArea;
	private String addTime;
	private String supplier;
	private String operator;
	private JSONArray queryType;
	private JSONArray ids;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getOriginalTitle()
	{
		return originalTitle;
	}
	public void setOriginalTitle(String originalTitle)
	{
		this.originalTitle = originalTitle;
	}
	public String getOriginalColor()
	{
		return originalColor;
	}
	public void setOriginalColor(String originalColor)
	{
		this.originalColor = originalColor;
	}
	public String getOriginalThickness()
	{
		return originalThickness;
	}
	public void setOriginalThickness(String originalThickness)
	{
		this.originalThickness = originalThickness;
	}
	public Integer getStorageNum()
	{
		return storageNum;
	}
	public void setStorageNum(Integer storageNum)
	{
		this.storageNum = storageNum;
	}
	public Integer getNumberOfOutbound()
	{
		return numberOfOutbound;
	}
	public void setNumberOfOutbound(Integer numberOfOutbound)
	{
		this.numberOfOutbound = numberOfOutbound;
	}
	public Integer getStockBalance()
	{
		return stockBalance;
	}
	public void setStockBalance(Integer stockBalance)
	{
		this.stockBalance = stockBalance;
	}
	public Double getStockArea()
	{
		return stockArea;
	}
	public void setStockArea(Double stockArea)
	{
		this.stockArea = stockArea;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public String getSupplier()
	{
		return supplier;
	}
	public void setSupplier(String supplier)
	{
		this.supplier = supplier;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	
	public InventoryInfo()
	{
		super();
	}
	public InventoryInfo(String originalTitle, String originalColor, String originalThickness, Integer storageNum,
			Integer numberOfOutbound, Integer stockBalance, Double stockArea, String addTime, String supplier,
			String operator)
	{
		super();
		this.originalTitle = originalTitle;
		this.originalColor = originalColor;
		this.originalThickness = originalThickness;
		this.storageNum = storageNum;
		this.numberOfOutbound = numberOfOutbound;
		this.stockBalance = stockBalance;
		this.stockArea = stockArea;
		this.addTime = addTime;
		this.supplier = supplier;
		this.operator = operator;
	}
	
	
}
