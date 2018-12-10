package com.lk.Utils;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
	@SuppressWarnings("unchecked")
	public JSONObject getJSONArrayLengths(JSONArray oldData)
	{
		int num = 0;// 计数
		@SuppressWarnings("rawtypes")
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

	  // ArrayList类型转成String类型
    public String ArrayListToString(ArrayList<String> arrayList) {
        String result = "";
        if (arrayList != null && arrayList.size() > 0) {
            for (String item : arrayList) {
                // 把列表中的每条数据用逗号分割开来，然后拼接成字符串
                result += item + ",";
            }
            // 去掉最后一个逗号
            result = result.substring(0, result.length() - 1);
        }
        return result;
    }
	/*三徒弟:将日期为同一天的数据归类到一块*/
	public String timeFormat(JSONArray rawData) {
		ConcurrentHashMap<String, JSONArray> hs = new ConcurrentHashMap<>();
		for(int i = 0;i < rawData.length();i++) {
			JSONObject json = rawData.getJSONObject(i);
			String date = json.getString("date").substring(0, 10);
			JSONArray array;
			if (hs.containsKey(date)) {
				array = hs.get(date);
			}else {
				array = new JSONArray();
			}
			 
			array.put(json);
			hs.put(date, array);
		}
		
		rawData = new JSONArray();
		for(String k : hs.keySet()) {
		rawData.put(hs.get(k));
		}
		
		return rawData.toString();
	}
	/*将日期为同一天的数据归类到一块*/
	public static JSONArray getSameDateJsonArray(JSONArray rawArray)
	{
		JSONArray array = new JSONArray();
		for (int i = 0; i < rawArray.length(); i++)
		{
			JSONObject obj = rawArray.getJSONObject(i);
			obj.put("flag", "no");
		}
		for (int i = 0; i < rawArray.length(); i++)
		{
			JSONObject obj = rawArray.getJSONObject(i);
			
			if (obj.get("flag").equals("no"))
			{
				JSONArray newArray = new JSONArray();
				newArray.put(obj);
				obj.put("flag", "ok");

				for (int j = i + 1; j < rawArray.length(); j++)
				{
					JSONObject other = rawArray.getJSONObject(j);
					if (other.get("flag").equals("no"))
					{
						String objTime = obj.getString("date").substring(0, 10);
						String otherTime = other.getString("date").substring(0, 10);
						if (objTime.equals(otherTime))
						{
							newArray.put(other);
							other.put("flag", "ok");
						}
					}

				}
				array.put(newArray);
			}
		}
		JSONArray finalData = new JSONArray();
		for(int i=0;i<array.length();i++)
		{
			JSONArray arrOneArr = array.getJSONArray(i);
			JSONArray finalOneArr = new JSONArray();
			for(int j = 0;j<arrOneArr.length();j++)
			{
				JSONObject arrObj = arrOneArr.getJSONObject(j);
				if(arrObj.has("flag"))
				{
					arrObj.remove("flag");
					finalOneArr.put(arrObj);
				}
			}
			finalData.put(finalOneArr);
		}
		array = finalData;
		return array;
	}

	/* 百分比运算 */
	public String txPercentage(int a, int b)
	{
		DecimalFormat df = new DecimalFormat("0.00");// 设置保留位数
		return df.format((float) a / b);
	}

	/* 小数加法运算 */
	public static BigDecimal addDouble(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.add(parameterTwo);
		return result;
	}

	/* 小数减法运算 */
	public BigDecimal subtract(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.subtract(parameterTwo);
		return result;
	}

	/* 小数乘法运算 */
	public BigDecimal multiply(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.multiply(parameterTwo);
		return result;
	}

	/* 小数除法运算 */
	public BigDecimal divide(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.divide(parameterTwo, 2); // 要设置保留几位小数
		return result;
	}

	/* 正则表达式去掉字符串的中文 */
	public String removeChinese(String str)
	{
		String reg = "[\u4e00-\u9fa5]";
		Pattern pat = Pattern.compile(reg);
		Matcher mat = pat.matcher(str);
		String repickStr = mat.replaceAll("");
		return repickStr;
	}

	/* JSONArray根据name去重,并计算amount(三徒弟) */
	public JSONArray removeDuplicate(JSONArray rawData)
	{
		/*
		 * 难点:
		 * 		使用ConcurrentHashMap,相比HashMap优点高并发下不会出错
		 * */
		ConcurrentHashMap<String, Double> hs = new ConcurrentHashMap<>();
		for (int i = 0; i < rawData.length(); i++)
		{
			JSONObject data = rawData.getJSONObject(i);
			String name = data.getString("name");
			double amount = data.getDouble("amount");
			if (hs.containsKey(name))  //--->判断name是否重复
			{
				hs.put(name, hs.get(name) + amount); //--->当前项的amount+hs中的amount
			} else
			{
				hs.put(name, amount); //--->不重复的数据
			}
		}
		rawData = new JSONArray();
		for (String k : hs.keySet())
		{
			JSONObject json = new JSONObject();
			json.put("name", k);
			json.put("amount", hs.get(k));
			rawData.put(json);
		}
		return rawData;
	}

	/* JSONArray根据name去重,并计算Amount */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
	public static JSONArray lkRemoveDuplicate(JSONArray rawData)
	{
		/*
		 * 难点:去重 实现思路:
		 * 使用List的contains方法比对每一项obj的name字段是否相同,如果相同就给List中add,得到重复的字段后,遍历原数据,
		 * 根据重复的字段去比对原数据的每一项的name,如果相同取出amount,并计算
		 * 
		 */
		JSONArray finalData = new JSONArray(); // --->定义最终算好的数据
		List listTemp = new ArrayList(); // --->用于存放重复的数据
		for (int i = 0; i < rawData.length(); i++)
		{
			JSONObject listObj = rawData.getJSONObject(i); // --->取出array中的每一个obj
			if (!listTemp.contains(listObj.getString("name"))) // --->判断list中是否包含当前项的name
			{
				String name = listObj.getString("name"); // --->取出当前重复项的name
				BigDecimal amount = new BigDecimal(0.00); // --->定义总金额
				JSONObject finalObj = new JSONObject(); // --->定义最终数据对象
				for (int j = 0; j < rawData.length(); j++)
				{ // --->遍历原数据,根据当前重复的name去寻找相同的数据,取出amount,然后++
					JSONObject nowListObj = rawData.getJSONObject(j);
					if (name.equals(nowListObj.getString("name")))
					{
						Double nowAmount = nowListObj.getDouble("amount"); // --->取出amount
						amount = addDouble(amount.toString(), nowAmount.toString()); // --->调用小数加法运算,参数转为String
					}
				}
				listTemp.add(name); // --->给arrayList赋值
				finalObj.put("name", name);
				finalObj.put("amount", amount.doubleValue());
				if(listObj.has("bankImg"))
				{
					finalObj.put("bankImg",listObj.getString("bankImg"));
				}
				finalData.put(finalObj);// --->最终数据赋值
			}
		}
		return finalData;
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
	/*将数据按日期归类好后,根据订单号来比对当前时间段下的数据*/
	public void orderSameDateArray( JSONArray sameDateArray,String orderNumber)
	{
		for(int i =0;i<sameDateArray.length();i++)
		{
			//取出当前遍历到的第一层Array
			JSONArray sameDateOneArr = sameDateArray.getJSONArray(i);
			for(int j = 0; j <sameDateOneArr.length();j++)
			{
				JSONObject nowObj = sameDateOneArr.getJSONObject(j); //--->当前第一层数据每一项的重复到的数据
				String nowOrderNumber = ""; //--->当前项的订单号
				if(nowObj.has("orderNumber"))
				{
					nowOrderNumber = nowObj.getString("orderNumber");
				}
				if(orderNumber.equals(nowOrderNumber))
				{
					System.out.println("当前点击项下的数据:");
					for(int k = 0;k<sameDateOneArr.length();k++)
					{
						JSONObject itemClickData = sameDateOneArr.getJSONObject(k);
						System.out.println(itemClickData);
					}
				}
			}	
		}
	}
	/* 大大JSONArray归类 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
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
