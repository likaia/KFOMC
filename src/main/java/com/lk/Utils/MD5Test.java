package com.lk.Utils;

public class MD5Test
{
	//此处为加密key，勿作修改
	public static final String KEY = "likai1195419506";
	public static void main(String[] args) throws Exception
	{
		/*
		 * 使用方法:
		 * 			1.import进HMacMD5.java工具类
		 * 			2.调用 HMacMD5.encryptHMAC2String(data,KEY );
		 * 			3.返回值为String,用String接收加密后的md5码
		 * 			4.把加密后的密码发给后台
		 * */
		String md5PassWord = HMacMD5.encryptHMAC2String("kaizi21.zjy",KEY );
		System.out.println("hmac_md5加密后的密码为:"+md5PassWord);
	}

}
