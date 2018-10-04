package com.lk.jsp;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

public class JspUtil
{
	
	public static JSONObject currentUser ( HttpServletRequest httpReq) throws Exception
	{
		HttpSession httpSession = httpReq.getSession();
		Object user = httpSession.getAttribute("user");
		if( user == null) 
			return new JSONObject();
		else
			return new JSONObject ( user);

	}
}
