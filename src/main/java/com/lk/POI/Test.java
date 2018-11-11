package com.lk.POI;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.Utils.LkCommon;

public class Test
{

	public static void main(String[] args) throws Exception
	{

		LkCommon test = new LkCommon();
		String b = "[{\"name\":\"支付宝\",\"amount\":500.54},{\"name\":\"现金\",\"amount\":700.13},{\"name\":\"现金\",\"amount\":200.00},{\"name\":\"支付宝\",\"amount\":800.00},{\"name\":\"支付宝\",\"amount\":900.00}]";
		JSONArray d = new JSONArray(b); // --->把JSONString传换为JSONArray
		
		/*JSONArray归类*/
		JSONArray aa= test.getJSONArray(d); //传源数据进来
		DecimalFormat df=new DecimalFormat("0.00");//--->设置保留位数
		//System.out.println("归类好的数据:"+aa.toString());
		JSONArray statisticsArr = new JSONArray(); //--->存放当前归类好的数据,每一类的支付方式,合计金额,重复次数
		int statisNum = 0; //--->重复次数
		double totleAmount = 0.00; //---->当前金额总计
		for(int i = 0;i<aa.length();i++)
		{
			JSONArray bb = aa.getJSONArray(i); //--->第一层数组的数据
			if(bb.length()>1)
			{
				JSONObject statisticsObj = new JSONObject();
				String name = "";
				//取出当前重复数据的 金额 支付方式
				for(int j = 0;j<bb.length();j++)
				{
					statisNum++;
					JSONObject bbObj = bb.getJSONObject(j);
					name = bbObj.getString("name");
					double amount = bbObj.getDouble("amount");
					df.format(amount);
					totleAmount += amount;
				}
				System.out.println("当前重复的支付方式:"+name+",当前金额："+df.format(totleAmount)+",当前支付方式重复次数:"+statisNum);
				statisticsObj.put("name", name); //--->当前重复数据的支付方式
				statisticsObj.put("payRepeat", totleAmount);//--->当前重复数据的总金额
				statisticsObj.put("statisNum", statisNum);///--->当前支付方式重复次数
				statisticsArr.put(statisticsObj);//--->将计算好的对象put进最终数组数据
				statisNum = 0; //--->重复次数归零
				totleAmount = 0;//--->当前总金额归零
			}
			else
			{
				JSONObject notRepeatedObj = new JSONObject();
				String name = "";
				//取出当前未重复数据的 金额 支付方式
				for(int j = 0;j<bb.length();j++)
				{
					statisNum++;
					JSONObject bbObj = bb.getJSONObject(j);
					name = bbObj.getString("name");
					double amount = bbObj.getDouble("amount");
					df.format(amount);
					totleAmount += amount;
				}
				System.out.println("当前未重复的支付方式:"+name+",当前金额："+df.format(totleAmount)+",当前支付方式重复次数:"+statisNum);
				notRepeatedObj.put("name", name); //--->当前重复数据的支付方式
				notRepeatedObj.put("payRepeat", totleAmount);//--->当前重复数据的总金额
				notRepeatedObj.put("statisNum", statisNum);///--->当前支付方式重复次数
				statisticsArr.put(notRepeatedObj); //--->将计算好的对象put进最终数组数据
				statisNum = 0; //--->重复次数归零
				totleAmount = 0;//--->当前总金额归零
			}
		}
		System.out.println("最终得到的重复数据总金额，支付方式，重复次数JSONArray"+statisticsArr);
		/*JSONArray归类结束*/
		
		//获取元素重复出现次数
		HashMap<String, Integer> length = test.getJSONArrayNum(d); //传源数据进来
		JSONArray keyArr = new JSONArray(); //键数组
		JSONArray itemArr = new JSONArray(); //值数组
		/*获取hashMap中的key名*/
		Set<String> mapSet = length.keySet();//获取所有的key值 为set的集合
		Iterator<String> itor = mapSet.iterator();// 获取key的Iterator遍历
		int totalVal = 0;
		while (itor.hasNext())
		{// 存在下一个值
			JSONObject keyObj = new JSONObject(); //键对象
			JSONObject itemObj = new JSONObject(); //值对象
			String key = itor.next();// --->当前key值
			int val = length.get(key); //--->当前key对应的键值
			keyObj.put("name", key);
			itemObj.put("name", val);
			totalVal+=val;//--->计算总数
			keyArr.put(keyObj);//--->put键对象
			itemArr.put(itemObj);//--->put值对象
		}
		System.out.println("当前元素总占比"+totalVal);
		if(totalVal>0)
		{
			/*取出键数组的数值,取出值数组中的数值*/
			for(int i = 0; i <keyArr.length();i++)
			{
				JSONObject keyObj = keyArr.getJSONObject(i);
				JSONObject itemObj = itemArr.getJSONObject(i); 
				int itemVal = itemObj.getInt("name");
				//计算当前元素所占百分比
				String percentage = test.txPercentage(itemVal, totalVal);
				double percentageDouble = Double.valueOf(percentage.toString());
				int percentageInt = (int)Math.floor(percentageDouble*100); //当前每个元素占比
				System.out.println(keyObj.getString("name")+percentageInt);
			}
		}
		/*获取hashMap中的key名结束*/
		
		
		/*
		 * JSONArray e = test.getJSONArray(d);
		 * //调用JSONArray归类方法--->(大大的json数据归类) System.out.println(e.toString());
		 * //--->(大大的json数据归类) HashMap<String, Integer> hm =
		 * test.getJSONArrayNum(d); //--->三徒弟的JSON数组key重复次数
		 * System.out.println(test.getJSONArray(d)); //三徒弟的JSONArray重复次数
		 * JSONObject JSONLength = new JSONObject(hm);//--->HashMap转为JSONObject
		 */ // System.out.println(test.getJSONArrays(d)); //白天的JSON数组重复次数

		/*
		 * 创建带有Sheet页的Excel Workbook wb = new HSSFWorkbook();
		 * wb.createSheet("第一个Sheet页面"); FileOutputStream fileOut = new
		 * FileOutputStream("/home/likai/poiExport/ExcelTest1.xls");
		 * wb.write(fileOut); fileOut.close();
		 */

		/*
		 * 基本用法：创建一个空Excel 创建工作薄 Workbook wb = new HSSFWorkbook(); 创建输出流
		 * FileOutputStream fileOut = new
		 * FileOutputStream("/home/likai/poiExport/ExcelTest.xls");
		 * wb.write(fileOut); fileOut.close();
		 * 
		 */
		/*
		 * String orders = "["+1+","+2+","+3+"]"; JSONArray array = new
		 * JSONArray(orders); System.out.println(array);
		 */
		/*
		 * 使用for循环方式判断用户输入的String字符串中 字母 数字 其他字符的个数 int letter = 0; // 是字母 int
		 * number = 0; // 是数字 int other = 0; // 是其他字符 String s = "张总1234"; //
		 * 分析字符所属类型 for (int i = 0; i < s.length(); i++) { char x = s.charAt(i);
		 * // if(Character.isUpperCase(x)||Character.isLowerCase(x))是否为大写或小写字母
		 * if (Character.isLetter(x)) // 是否为字母; //
		 * Character.isAlphabetic()似乎用法类似，多了一种"OTHER_LETTER",存疑 { letter++; }
		 * else if (Character.isDigit(x)) // 是否为数字 { number++; } else // 其他字符 {
		 * other++; } } System.out.println("字母个数：" + letter + "\n数字个数：" + number
		 * + "\n其他字符个数：" + other);
		 * 
		 */

		/*
		 * // 要验证的字符串 （用正则表达式判断用户输入的字符串中，数字个数是否大于3） String str = "李凯123"; //
		 * 验证数字个数是否大于3 String regEx = "(?s)^(?=.*\\d.*\\d.*\\d).+$"; // 编译正则表达式
		 * Pattern pattern = Pattern.compile(regEx); Matcher matcher =
		 * pattern.matcher(str); // 字符串是否与正则表达式相匹配 boolean rs =
		 * matcher.matches(); System.out.println(rs);
		 * 
		 * 
		 */
	}
}
