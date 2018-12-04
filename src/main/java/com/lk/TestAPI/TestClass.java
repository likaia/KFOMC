package com.lk.TestAPI;

import java.util.ArrayList;
import java.util.Arrays;
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
		String JSONStr = "[{\"originalTitle\":\"5+25+5双白双钢\",\"stockBalance\":1355,\"id\":3},{\"originalTitle\":\"5+9+5双白双钢\",\"stockBalance\":1940,\"id\":4},{\"originalTitle\":\"5+9+5双白普通\",\"stockBalance\":1668,\"id\":5},{\"originalTitle\":\"10mm钢化\",\"stockBalance\":720,\"id\":6},{\"originalTitle\":\"5mm单片钢化\",\"stockBalance\":3788,\"id\":7},{\"originalTitle\":\"5mmLOW-E单片普通\",\"stockBalance\":120,\"id\":12}]";
		JSONArray JSONarr = new JSONArray(JSONStr);
		ArrayList<String>stockNameVal = new ArrayList<String>(); //--->库存表原片名称总数组
		System.out.println(JSONarr.length());
		for(int i = 0;i<JSONarr.length();i++)
		{
				JSONObject InventoryInfoOneObj = JSONarr.getJSONObject(i);
				String originalTitle = InventoryInfoOneObj.getString("originalTitle").trim(); // --->原片名称
				stockNameVal.add(originalTitle);
		}
		String productName = "5+9+5双白双钢"; // --->原片名称
		boolean stockFlag = stockNameVal.contains(productName);//--->判断库存中是否有当前原片名称
		System.out.println(stockFlag);
	}
}
