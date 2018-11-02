package com.lk.db;

import org.json.JSONArray;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-01 16:29:44 root
  *  
* */

public class ClientInfo
{
	private Integer id;
	private String customerType;
	private String clientName;
	private String companyName;
	private String taxNumber;
	private String address;
	private String phoneNumber;
	private String weChat;
	private String email;
	private String bankAccount;
	private String bankCardNumber;
	private String joinTime;
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
	public String getCustomerType()
	{
		return customerType;
	}
	public void setCustomerType(String customerType)
	{
		this.customerType = customerType;
	}
	public String getClientName()
	{
		return clientName;
	}
	public void setClientName(String clientName)
	{
		this.clientName = clientName;
	}
	public String getCompanyName()
	{
		return companyName;
	}
	public void setCompanyName(String companyName)
	{
		this.companyName = companyName;
	}
	public String getTaxNumber()
	{
		return taxNumber;
	}
	public void setTaxNumber(String taxNumber)
	{
		this.taxNumber = taxNumber;
	}
	public String getAddress()
	{
		return address;
	}
	public void setAddress(String address)
	{
		this.address = address;
	}
	public String getPhoneNumber()
	{
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber)
	{
		this.phoneNumber = phoneNumber;
	}
	public String getWeChat()
	{
		return weChat;
	}
	public void setWeChat(String weChat)
	{
		this.weChat = weChat;
	}
	public String getEmail()
	{
		return email;
	}
	public void setEmail(String email)
	{
		this.email = email;
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
	public String getJoinTime()
	{
		return joinTime;
	}
	public void setJoinTime(String joinTime)
	{
		this.joinTime = joinTime;
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
	
	public ClientInfo()
	{
		super();
	}
	public ClientInfo(String customerType, String clientName, String companyName, String taxNumber, String address,
			String phoneNumber, String weChat, String email, String bankAccount, String bankCardNumber, String joinTime,
			String operator)
	{
		super();
		this.customerType = customerType;
		this.clientName = clientName;
		this.companyName = companyName;
		this.taxNumber = taxNumber;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.weChat = weChat;
		this.email = email;
		this.bankAccount = bankAccount;
		this.bankCardNumber = bankCardNumber;
		this.joinTime = joinTime;
		this.operator = operator;
	}
	
}
