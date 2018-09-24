package com.lk.jsp;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;

/* JSP工具
 * 方便JSP直接从url里取得参数
 *  */
public class Jsp
{
	public static Long getLong(HttpServletRequest req, String paramName, Long defValue)
	{		
		try{
			return Long.valueOf(req.getParameter(paramName)); 
		}catch(Exception e)
		{
			return defValue;
		}		
	}
	
	public static Integer getInt(HttpServletRequest req, String paramName, Integer defValue)
	{		
		try{
			return Integer.valueOf(req.getParameter(paramName)); 
		}catch(Exception e)
		{
			return defValue;
		}		
	}
	
	// 获取字符串型参数
	public static String getString(HttpServletRequest req, String paramName, String defValue)
	{		
		try
		{
			req.setCharacterEncoding("UTF-8");
		} catch (UnsupportedEncodingException e1)
		{
			e1.printStackTrace();
		}
		
		String val = req.getParameter(paramName);
		if(val == null || val.length() == 0)
		{
			val = defValue;
		}
		return "'" + val + "'";	
	}
	
	public static String getString2(HttpServletRequest req, String paramName, String defValue)
	{		
		String val = req.getParameter(paramName);
		// 2. 得到 6个字节
		
		try
		{
			byte[] bb;
			bb = val.getBytes("iso-8859-1");
			val = new String(bb, "UTF-8");
		} catch (UnsupportedEncodingException e1)
		{
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		// 3. 构造字符串
		
		
		if(val == null || val.length() == 0)
		{
			val = defValue;
		}

		return "'" + val + "'";	
	}
}
