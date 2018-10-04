package com.lk.db;

public class User
{
	private Integer id;
	private String userName;
	private String passWord;
	private String cellPhone;
	private String filePath;
	private String version;
	private String RegistrationTime;
	private String sysUseAuthority;
	public String getSysUseAuthority()
	{
		return sysUseAuthority;
	}
	public void setSysUseAuthority(String sysUseAuthority)
	{
		this.sysUseAuthority = sysUseAuthority;
	}
	public User()
	{
		// 无参构造方法

	}
	public User(Integer id, String userName, String passWord, String cellPhone, String filePath, String version,
			String registrationTime)
	{
		super();
		this.id = id;
		this.userName = userName;
		this.passWord = passWord;
		this.cellPhone = cellPhone;
		this.filePath = filePath;
		this.version = version;
		RegistrationTime = registrationTime;
	}

	public User(Integer id, String userName, String passWord)
	{
		this.id = id;
		this.userName = userName;
		this.passWord = passWord;
	}

	public User(String userName, String passWord)
	{
		this.userName = userName;
		this.passWord = passWord;
	}

	public Integer getId()
	{
		return id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	public String getUserName()
	{
		return userName;
	}

	public void setUserName(String userName)
	{
		this.userName = userName;
	}

	public String getPassWord()
	{
		return passWord;
	}

	public void setPassWord(String passWord)
	{
		this.passWord = passWord;
	}

	public String getCellPhone()
	{
		return cellPhone;
	}

	public void setCellPhone(String cellPhone)
	{
		this.cellPhone = cellPhone;
	}

	public String getFilePath()
	{
		return filePath;
	}

	public void setFilePath(String filePath)
	{
		this.filePath = filePath;
	}

	public String getVersion()
	{
		return version;
	}

	public void setVersion(String version)
	{
		this.version = version;
	}
	public String getRegistrationTime()
	{
		return RegistrationTime;
	}
	public void setRegistrationTime(String registrationTime)
	{
		RegistrationTime = registrationTime;
	}
}
