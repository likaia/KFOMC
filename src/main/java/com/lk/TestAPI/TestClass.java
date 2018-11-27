package com.lk.TestAPI;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.Utils.LkCommon;
import com.lk.db.ProductListInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ProductNumeInfoMapper;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-13 18:44:10 root
  *  
* */

public class TestClass
{
	public static void main(String[] args)
	{
		String b = "[{\"name\":\"支付宝\",\"amount\":500.54},{\"name\":\"现金\",\"amount\":700.13},{\"name\":\"现金\",\"amount\":200.00},{\"name\":\"支付宝\",\"amount\":800.00},{\"name\":\"支付宝\",\"amount\":900.00}]";
		JSONArray d = new JSONArray(b); // --->把JSONString传换为JSONArray
		ArrayList<String> moneyArr = new ArrayList<String>();
		for(int  i  = 0 ;i<d.length();i++)
		{
			JSONObject aa = d.getJSONObject(i);
			String oldName = aa.getString("name");
			for(int j = 1;j<d.length();j++)
			{
				JSONObject bb =d.getJSONObject(j);
				String nowName = bb.getString("name");
				if(oldName.equals(nowName))
				{
					System.out.println("重复了"+oldName);
				}
			}
		}
	}
}
