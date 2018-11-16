package com.lk.Utils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-08 13:53:11 root
  *  
* */

public class LkCommon
{

	/* 白天json数组统计 */
	public JSONObject getJSONArrayLengths(JSONArray oldData)
	{
		int num = 0;// 计数
		Map map = new HashMap();

		for (int i = 0; i < oldData.length(); i++)
		{
			num = 1;
			for (int j = i + 1; j < oldData.length(); j++)
			{
				JSONObject oldDataObj = oldData.getJSONObject(i);
				JSONObject dataObj = oldData.getJSONObject(j);
				String ss = oldDataObj.getString("name");
				String aa = dataObj.getString("name");
				if (ss.equals(aa))
				{
					num++;
				}
			}
			JSONObject oldDataObj = oldData.getJSONObject(i);
			if (!map.containsKey(oldDataObj.getString("name")))
			{
				map.put(oldDataObj.getString("name"), num);
			}
		}

		return new JSONObject(map);
	}

	/* 百分比运算 */
	public String txPercentage(int a, int b)
	{
		DecimalFormat df = new DecimalFormat("0.00");// 设置保留位数
		return df.format((float) a / b);
	}
	/*小数加法运算*/
	public BigDecimal addDouble(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.add(parameterTwo);
		return result;
	}
	/*小数减法运算*/
	public BigDecimal subtract(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.subtract(parameterTwo);
		return result;
	}
	/*小数乘法运算*/
	public BigDecimal multiply(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.multiply(parameterTwo);
		return result;
	}
	/*小数除法运算*/
	public BigDecimal divide(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.divide(parameterTwo,2); //要设置保留几位小数
		return result;
	}
	/* 三徒弟 JSON数组统计 */
	public HashMap<String, Integer> getJSONArrayNum(JSONArray rawData)
	{
		JSONArray data = rawData;
		HashMap<String, Integer> hm = new HashMap<>();
		for (int i = 0; i < data.length(); i++)
		{
			JSONObject json = data.getJSONObject(i);
			if (json.length() > 0)
			{
				String key = json.getString("name");
				if (hm.get(key) != null)
				{
					hm.put(key, hm.get(key) + 1);
				} else
				{
					hm.put(key, 1);
				}
			}
		}
		return hm;
		// 调用方法
		/*
		 * 1.LkCommon test = new LkCommon(); //--->实例化 2.HashMap<String,
		 * Integer> length = test.getJSONArrayNum(一个JSONArray);//--->调用当前方法
		 * 3.Set<String> mapSet = length.keySet();//获取所有的key值 为set的集合
		 * Iterator<String> itor = mapSet.iterator();// 获取key的Iterator遍历 while
		 * (itor.hasNext()) {// 存在下一个值 String key = itor.next();// 当前key值 int
		 * val = length.get(key); System.out.println(key+":"+val); }
		 */
	}

	/* 大大JSONArray归类 */
	public JSONArray getJSONArray(JSONArray jsonArray)
	{
		/*
		 * 实现思路 1.声明一个HashSet 2.循环遍历原数据中的每一项,并取出name放进 HashSet中
		 * 3.将HashSet的数据转为list 4.声明JSONArray数组用于存放最终归类好的数据
		 * 5.循环遍历,转为list的HashSet数据，取出每一项的name 6.声明重复时需要的JSONArray
		 * 7.循环遍历原数据,取出原数据中的每一项
		 * 8.取出原数据每一项的key=name的值和转为list的HashSet中的name值，判断是否相同
		 * 9.如果数据相同,就声明一个JSONObject,将当前循环到的数据，放进JSONObject中
		 * 10.给重复时的JSONArray把重复的JSONObject放进去 11.给最初定义的(归类好的)JSONArray赋值重复的数据
		 * 12.返回归类号的JSONArray
		 */
		Set name = new HashSet<String>(); // --->声明一个HashSet
		for (int i = 0; i < jsonArray.length(); i++)
		{
			JSONObject a = jsonArray.getJSONObject(i);// --->循环遍历原数据中的每一项
			name.add(a.get("name")); // --->取出name放进 HashSet中
		}
		List list = new ArrayList(name); // --->将HashSet的数据转为list
		JSONArray nowData = new JSONArray(); // --->声明JSONArray数组用于存放最终归类好的数据
		for (int i = 0; i < list.size(); i++)
		{
			// --->循环遍历,转为list的HashSet数据
			String listName = (String) list.get(i); // --->取出每一项的name
			JSONArray repatArr = new JSONArray(); // --->声明重复时需要的JSONArray
			for (int j = 0; j < jsonArray.length(); j++)
			{
				// --->循环遍历原数据,
				JSONObject rawDataObj = jsonArray.getJSONObject(j); // --->取出原数据中的每一项
				if (listName.equals(rawDataObj.getString("name")))
				{
					// --->取出原数据每一项的key=name的值和转为list的HashSet中的name值，判断是否相同
					JSONObject sameDataObj = new JSONObject(); // --->声明相同的数据需要的JSONObject
					sameDataObj.put("name", rawDataObj.get("name")); // --->put相同项的数据
					sameDataObj.put("amount", rawDataObj.getDouble("amount"));
					repatArr.put(sameDataObj); // --->put相同项对象
				}
			}
			nowData.put(repatArr); // --->put归类好的重复项数据,新数据将成为二维数组
		}
		return nowData;

	}

}
