package com.lk.db;

import org.json.JSONArray;

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
	private Integer completionScope;
	private Integer lateArrivalRange;
	private Boolean holidayStatus;
	private String workingHours;
	private String afterGetOffWorkTime;
	private String attendanceDate;
	private String officeWifi;
	private String officeLocation;
	private Boolean fieldCard;
	private String morningOffHours;
	private String afternoonWorkTime;
	private Boolean twoCommutes;
	private Boolean punchAfterWorkStatus;
	private String mobilePhoneManufacturer;
	private String phoneModel;
	private String companyName;
	private String bearingInformation;
	private Integer userID;
	private String mobilePhoneSerialNumber;
	private JSONArray queryType;
	private Integer punchRange;
	private Integer companyID;

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

	public String getBearingInformation()
	{
		return bearingInformation;
	}
	public void setBearingInformation(String bearingInformation)
	{
		this.bearingInformation = bearingInformation;
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


	public Integer getCompanyID()
	{
		return companyID;
	}
	public void setCompanyID(Integer companyID)
	{
		this.companyID = companyID;
	}
	public Integer getUserID()
	{
		return userID;
	}
	public void setUserID(Integer userID)
	{
		this.userID = userID;
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

	public Integer getPunchRange()
	{
		return punchRange;
	}
	public void setPunchRange(Integer punchRange)
	{
		this.punchRange = punchRange;
	}
	public String getVersion()
	{
		return version;
	}

	public String getMobilePhoneManufacturer()
	{
		return mobilePhoneManufacturer;
	}
	public void setMobilePhoneManufacturer(String mobilePhoneManufacturer)
	{
		this.mobilePhoneManufacturer = mobilePhoneManufacturer;
	}
	public void setVersion(String version)
	{
		this.version = version;
	}
	
	public Integer getCompletionScope()
	{
		return completionScope;
	}
	public void setCompletionScope(Integer completionScope)
	{
		this.completionScope = completionScope;
	}
	public Integer getLateArrivalRange()
	{
		return lateArrivalRange;
	}
	public void setLateArrivalRange(Integer lateArrivalRange)
	{
		this.lateArrivalRange = lateArrivalRange;
	}
	public Boolean getHolidayStatus()
	{
		return holidayStatus;
	}
	public void setHolidayStatus(Boolean holidayStatus)
	{
		this.holidayStatus = holidayStatus;
	}
	
	public String getWorkingHours()
	{
		return workingHours;
	}
	public void setWorkingHours(String workingHours)
	{
		this.workingHours = workingHours;
	}
	public String getAfterGetOffWorkTime()
	{
		return afterGetOffWorkTime;
	}
	public void setAfterGetOffWorkTime(String afterGetOffWorkTime)
	{
		this.afterGetOffWorkTime = afterGetOffWorkTime;
	}
	public String getAttendanceDate()
	{
		return attendanceDate;
	}
	public void setAttendanceDate(String attendanceDate)
	{
		this.attendanceDate = attendanceDate;
	}
	public String getOfficeWifi()
	{
		return officeWifi;
	}
	public void setOfficeWifi(String officeWifi)
	{
		this.officeWifi = officeWifi;
	}
	public String getOfficeLocation()
	{
		return officeLocation;
	}
	public void setOfficeLocation(String officeLocation)
	{
		this.officeLocation = officeLocation;
	}
	public Boolean getFieldCard()
	{
		return fieldCard;
	}
	public void setFieldCard(Boolean fieldCard)
	{
		this.fieldCard = fieldCard;
	}
	public User(Integer completionScope, Integer lateArrivalRange, Boolean holidayStatus)
	{
		super();
		this.completionScope = completionScope;
		this.lateArrivalRange = lateArrivalRange;
		this.holidayStatus = holidayStatus;
	}
	public String getRegistrationTime()
	{
		return RegistrationTime;
	}
	
	
	public String getCompanyName()
	{
		return companyName;
	}
	public void setCompanyName(String companyName)
	{
		this.companyName = companyName;
	}
	public JSONArray getQueryType()
	{
		return queryType;
	}
	public void setQueryType(JSONArray queryType)
	{
		this.queryType = queryType;
	}
	public void setRegistrationTime(String registrationTime)
	{
		RegistrationTime = registrationTime;
	}
	public String getMorningOffHours()
	{
		return morningOffHours;
	}
	public void setMorningOffHours(String morningOffHours)
	{
		this.morningOffHours = morningOffHours;
	}
	public String getAfternoonWorkTime()
	{
		return afternoonWorkTime;
	}
	public void setAfternoonWorkTime(String afternoonWorkTime)
	{
		this.afternoonWorkTime = afternoonWorkTime;
	}
	public Boolean getTwoCommutes()
	{
		return twoCommutes;
	}
	public void setTwoCommutes(Boolean twoCommutes)
	{
		this.twoCommutes = twoCommutes;
	}
	public Boolean getPunchAfterWorkStatus()
	{
		return punchAfterWorkStatus;
	}
	public void setPunchAfterWorkStatus(Boolean punchAfterWorkStatus)
	{
		this.punchAfterWorkStatus = punchAfterWorkStatus;
	}
	public String getPhoneModel()
	{
		return phoneModel;
	}
	public void setPhoneModel(String phoneModel)
	{
		this.phoneModel = phoneModel;
	}
	public String getMobilePhoneSerialNumber()
	{
		return mobilePhoneSerialNumber;
	}
	public void setMobilePhoneSerialNumber(String mobilePhoneSerialNumber)
	{
		this.mobilePhoneSerialNumber = mobilePhoneSerialNumber;
	}

	
}
