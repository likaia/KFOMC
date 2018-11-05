package com.lk.db;

import org.json.JSONArray;

//配件公开表
public class FittingPublic
{
	private Integer id;
	private String fittingName;
	private String fittingImgUrl;
	private JSONArray ids;
	public FittingPublic()
	{
		super();
	}
	public FittingPublic(String fittingName, String fittingImgUrl, String addTime, String addAPerson)
	{
		super();
		this.fittingName = fittingName;
		this.fittingImgUrl = fittingImgUrl;
		this.addTime = addTime;
		this.addAPerson = addAPerson;
	}
	private String addTime;
	private String addAPerson;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getFittingName()
	{
		return fittingName;
	}
	public void setFittingName(String fittingName)
	{
		this.fittingName = fittingName;
	}
	
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}
	public String getFittingImgUrl()
	{
		return fittingImgUrl;
	}
	public void setFittingImgUrl(String fittingImgUrl)
	{
		this.fittingImgUrl = fittingImgUrl;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public String getAddAPerson()
	{
		return addAPerson;
	}
	public void setAddAPerson(String addAPerson)
	{
		this.addAPerson = addAPerson;
	}
	
}
