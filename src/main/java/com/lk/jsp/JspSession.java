package com.lk.jsp;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class JspSession
{
	public static Long getLong(HttpServletRequest req, String paramName, Long defValue)
	{		
		try{
			HttpSession ss = req.getSession();
			if(ss == null) return defValue;
			return Long.valueOf(req.getSession().getAttribute(paramName).toString()); 
		}catch(Exception e)
		{
			return defValue;
		}		
	}
	
	public static Integer getInt(HttpServletRequest req, String paramName, Integer defValue)
	{		
		try{
			HttpSession ss = req.getSession();
			if(ss == null) return defValue;
			return Integer.valueOf(req.getSession().getAttribute(paramName).toString()); 
		}catch(Exception e)
		{
			return defValue;
		}		
	}

	// 获取字符串型参数
	public static String getString(HttpServletRequest req, String paramName, String defValue)
	{		
		String val = null;
		try{
			HttpSession ss = req.getSession();
			if(ss == null) return defValue;
			val = req.getSession().getAttribute(paramName).toString();
		}catch(Exception e){}
		
		if(val == null || val.length() == 0)
		{
			val = defValue;
		}
		return "'" + val + "'";	
	}
	
	public static boolean getBoolean(HttpServletRequest req, String paramName, boolean defValue)
	{		
		Boolean val = null;
		try{
			HttpSession ss = req.getSession();
			if(ss == null) return defValue;
			
			val = (Boolean) req.getSession().getAttribute(paramName);
		}catch(Exception e)
		{
			
		}	
		if(val == null) return defValue;
		return val;
	}
	
	public static Object getObject(HttpServletRequest req, String paramName, Object defValue)
	{		
		Object val = null;
		try{
			HttpSession ss = req.getSession();
			if(ss == null) return defValue;
			
			val = (Object) req.getSession().getAttribute(paramName);
		}catch(Exception e)
		{
			
		}	
		if(val == null) return defValue;
		return val;
	}
}
