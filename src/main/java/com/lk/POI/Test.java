package com.lk.POI;

import java.util.HashMap;
import java.util.Scanner;
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
		String b = "[{\"name\":\"支付宝\"},{\"name\":\"微信\"},{\"name\":\"现金\"},{\"name\":\"支付宝\"},{\"name\":\"支付宝\"}]";
		JSONArray d = new JSONArray(b); //--->把JSONString传换为JSONArray
		JSONArray e = test.getJSONArray(d); //调用JSONArray归类方法
		System.out.println(e.toString()); //--->(大大的json数据归类)
		HashMap<String, Integer> hm = test.getJSONArrayNum(d); //--->三徒弟的JSON数组key重复次数
		JSONObject JSONLength = new JSONObject(hm);//--->HashMap转为JSONObject
		System.out.println(JSONLength);
//		System.out.println(test.getJSONArray(d));
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
