package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-10 11:37:32 root
  *  
* */

public class AccessInfo
{
	private Integer id;
	private String accessDevice;
	private String  osName;
	private String  browserType;
	private String  browserName;
	private String  userAgent;
	private String  addTime;
	private String dStart;
	private String dEnd;
	private JSONArray queryType;
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
	public String getAccessDevice()
	{
		return accessDevice;
	}
	public void setAccessDevice(String accessDevice)
	{
		this.accessDevice = accessDevice;
	}
	public String getOsName()
	{
		return osName;
	}
	public void setOsName(String osName)
	{
		this.osName = osName;
	}
	public String getBrowserType()
	{
		return browserType;
	}
	public void setBrowserType(String browserType)
	{
		this.browserType = browserType;
	}
	public String getBrowserName()
	{
		return browserName;
	}
	public void setBrowserName(String browserName)
	{
		this.browserName = browserName;
	}
	public String getUserAgent()
	{
		return userAgent;
	}
	public void setUserAgent(String userAgent)
	{
		this.userAgent = userAgent;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
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
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	
}
