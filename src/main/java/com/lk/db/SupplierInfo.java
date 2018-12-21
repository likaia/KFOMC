package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-28 12:42:58 root
  *  
* */

public class SupplierInfo
{
	private Integer id;
	private String supplierName;
	private String primaryContact;
	private String contactNumber;
	private String wechat;
	private String address;
	private String logoUrl;
	private String bankAccount;
	private String bankCardNumber;
	private String addTime;
	private JSONArray ids;
	private JSONArray queryType;
	private String operator;
	public Integer getId()
	{
		return id;
	}
	public void setId(Integer id)
	{
		this.id = id;
	}
	public String getSupplierName()
	{
		return supplierName;
	}
	public void setSupplierName(String supplierName)
	{
		this.supplierName = supplierName;
	}
	public String getPrimaryContact()
	{
		return primaryContact;
	}
	public void setPrimaryContact(String primaryContact)
	{
		this.primaryContact = primaryContact;
	}
	public String getContactNumber()
	{
		return contactNumber;
	}
	public void setContactNumber(String contactNumber)
	{
		this.contactNumber = contactNumber;
	}
	public String getWechat()
	{
		return wechat;
	}
	public void setWechat(String wechat)
	{
		this.wechat = wechat;
	}
	public String getAddress()
	{
		return address;
	}
	public void setAddress(String address)
	{
		this.address = address;
	}
	public String getLogoUrl()
	{
		return logoUrl;
	}
	public void setLogoUrl(String logoUrl)
	{
		this.logoUrl = logoUrl;
	}
	public String getBankAccount()
	{
		return bankAccount;
	}
	public void setBankAccount(String bankAccount)
	{
		this.bankAccount = bankAccount;
	}
	public String getBankCardNumber()
	{
		return bankCardNumber;
	}
	public void setBankCardNumber(String bankCardNumber)
	{
		this.bankCardNumber = bankCardNumber;
	}
	public String getAddTime()
	{
		return addTime;
	}
	public void setAddTime(String addTime)
	{
		this.addTime = addTime;
	}
	public JSONArray getIds()
	{
		return ids;
	}
	public void setIds(JSONArray ids)
	{
		this.ids = ids;
	}

	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public String getOperator()
	{
		return operator;
	}
	public void setOperator(String operator)
	{
		this.operator = operator;
	}
	public SupplierInfo()
	{
		super();
	}
	

	public SupplierInfo(String supplierName, String primaryContact, String contactNumber, String wechat, String address,
			String logoUrl, String bankAccount, String bankCardNumber, String addTime, String operator)
	{
		super();
		this.supplierName = supplierName;
		this.primaryContact = primaryContact;
		this.contactNumber = contactNumber;
		this.wechat = wechat;
		this.address = address;
		this.logoUrl = logoUrl;
		this.bankAccount = bankAccount;
		this.bankCardNumber = bankCardNumber;
		this.addTime = addTime;
		this.operator = operator;
	}
	



	
	
}
