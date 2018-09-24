package com.lk.Utils;

import org.apache.commons.codec.digest.DigestUtils;

public class MD5Utils
{	
	private String text;
	private String key;
	private String md5;
	
	public static String md5(String text, String key) throws Exception
	{
		// 加密后的字符串
		String encodeStr = DigestUtils.md5Hex(text + key);
		System.out.println("MD5加密后的字符串为:encodeStr=" + encodeStr);
		return encodeStr;
	}
	/**
	 * MD5验证方法
	 * 
	 * @param text
	 *            明文
	 * @param key
	 *            密钥
	 * @param md5
	 *            密文
	 * @return true/false
	 * @throws Exception
	 */
	public static boolean verify(String text, String key, String md5) throws Exception
	{
		// 根据传入的密钥进行验证
		String md5Text = md5(text, key);
		if (md5Text.equalsIgnoreCase(md5))
		{
			System.out.println("MD5验证通过");
			return true;
		}

		return false;
	}
	
	
	public String getText()
	{
		return text;
	}

	public void setText(String text)
	{
		this.text = text;
	}

	public String getKey()
	{
		return key;
	}

	public void setKey(String key)
	{
		this.key = key;
	}

	public String getMd5()
	{
		return md5;
	}

	public void setMd5(String md5)
	{
		this.md5 = md5;
	}
}
