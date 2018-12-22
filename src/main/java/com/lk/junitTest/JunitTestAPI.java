package com.lk.junitTest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.*;

import com.lk.Utils.LkCommon;
import com.lk.Utils.WorderToNewWordUtils;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-14 11:44:38 root
  *  
* */

public class JunitTestAPI
{
	/*
	 * @Ignore: 被忽略的测试方法
	 * 
	 * @Before: 每一个测试方法之前运行
	 * 
	 * @After: 每一个测试方法之后运行
	 * 
	 * @BeforeClass: 所有测试开始之前运行
	 * 
	 * @AfterClass: 所有测试结束之后运行
	 */
	LkCommon lkcommon = new LkCommon();

	// 测试:JSONArray中每个元素重复出现次数,元素占比,当前元素的金额
	@Test
	public void test1()
	{
		String b = "[{\"name\":\"支付宝\",\"amount\":500.54},{\"name\":\"现金\",\"amount\":700.13},{\"name\":\"现金\",\"amount\":200.00},{\"name\":\"微信\",\"amount\":800.00},{\"name\":\"支付宝\",\"amount\":900.00}]";
		JSONArray d = new JSONArray(b); // --->把JSONString传换为JSONArray
		HashMap<String, Integer> length = lkcommon.getJSONArrayNum(d); // 传源数据进来
		JSONArray keyArr = new JSONArray(); // 键数组
		JSONArray itemArr = new JSONArray(); // 值数组
		// 获取hashMap中的key名
		Set<String> mapSet = length.keySet();// 获取所有的key值 为set的集合
		Iterator<String> itor = mapSet.iterator();// 获取key的Iterator遍历
		// 元素总金额
		JSONArray totalAmount = LkCommon.lkRemoveDuplicate(d);
		int totalVal = 0;
		while (itor.hasNext())
		{// 存在下一个值
			JSONObject keyObj = new JSONObject(); // 键对象
			JSONObject itemObj = new JSONObject(); // 值对象
			String key = itor.next();// --->当前key值
			int val = length.get(key); // --->当前key对应的键值
			keyObj.put("name", key);
			itemObj.put("name", val);
			totalVal += val;// --->计算总数
			keyArr.put(keyObj);// --->put键对象
			itemArr.put(itemObj);// --->put值对象
		}
		// System.out.println("当前元素总占比" + totalVal);
		if (totalVal > 0)
		{
			// 取出键数组的数值,取出值数组中的数值
			for (int i = 0; i < keyArr.length(); i++)
			{
				// 开始计算总出现次数
				JSONObject keyObj = keyArr.getJSONObject(i);
				JSONObject itemObj = itemArr.getJSONObject(i);
				String keyName = keyObj.getString("name");
				int itemVal = itemObj.getInt("name");
				System.out.println("当前的key名" + keyName + ",当前的key所对应的出现次数:" + itemVal);
				// 开始计算元素总占比
				String percentage = lkcommon.txPercentage(itemVal, totalVal);
				double percentageDouble = Double.valueOf(percentage.toString());
				int percentageInt = (int) Math.floor(percentageDouble * 100); // 当前每个元素占比
				System.out.println("元素总占比:" + keyObj.getString("name") + percentageInt);
				// 开始计算元素总金额
				for (int j = 0; j < totalAmount.length(); j++)
				{
					JSONObject totalAmountObj = totalAmount.getJSONObject(j);
					String totalName = totalAmountObj.getString("name");
					if (totalName.equals(keyName))
					{
						Double itemAmount = totalAmountObj.getDouble("amount");
						System.out.println("当前元素总金额:" + itemAmount);
						System.out.println();
						break;
					}
				}
			}
		}
	}

	// 测试:word导出
	public void test2()
	{
		// 模板文件地址
		String inputUrl = "src/main/resources/wordTemplate/title.docx";
		// 新生产的模板文件
		String outputUrl = "/home/likai/201812110orderDetailTemplate.docx";
		Map<String, String> testMap = new HashMap<String, String>();
		List<String[]> testList = new ArrayList<String[]>();
		if (WorderToNewWordUtils.changWord(inputUrl, outputUrl, testMap, testList))
		{
			System.out.println("导出成功");
		}
		;
	}

	// 日期计算
	@Test
	public void test3() throws ParseException
	{
		String startTime = "08:00:00";
		String endTime = "08:20:00";
		// 看自己的时间格式选择对应的转换对象
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		// 转换成date类型
		Date start = sdf.parse(startTime);
		Date end = sdf.parse(endTime);
		// 获取毫秒数
		Long startLong = start.getTime();
		Long endLong = end.getTime();
		// 计算时间差,单位毫秒
		Long ms = endLong - startLong;
		// 时间差转换为 \天\时\分\秒
		String time = LkCommon.longTimeToDay(ms);
		System.out.println(time);
	}
	
	/*打卡区间判断*/
	@Test
	public void test4() throws ParseException
	{
		String result = lkcommon.timeIntervalJudgment("08:20", "", "08:00", "08:20", "09:00");
		System.out.println("当前打卡状态:"+result);
	}
	/*使用TreeSet去除数组中的重复元素,并且会排序*/
	@Test
	public void test5()
	{
		TreeSet<String> ts = new TreeSet<String>();
		ts.add("李凯");
		ts.add("王");
		ts.add("王");
		System.out.println(ts);
		
	}
	@Test
	public void test6()
	{
		
	
	}
	
}