package com.lk.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.ibatis.io.ResolverUtil.Test;
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

	/**
	 * 
	 * @Title:             getNetworkTime
	 * @Description:     获取当前网络时间
	 * @param:             @param webUrl
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public static String getNetworkTime(String webUrl)
	{
		try
		{
			URL url = new URL(webUrl);
			URLConnection conn = url.openConnection();
			conn.connect();
			long dateL = conn.getDate();
			Date date = new Date(dateL);
			SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
			return dateFormat.format(date);
		} catch (MalformedURLException e)
		{
			e.printStackTrace();
		} catch (IOException e)
		{
			// TODO: handle exception
			e.printStackTrace();
		}
		return "";
	}

	/**
	 * 
	 * @Title:             createFolder
	 * @Description:     创建文件夹
	 * @param:             @param name
	 * @param:             @return   
	 * @return:         JSONObject   
	 * @throws
	 */
	public JSONObject createFolder(String name)
	{
		JSONObject javaReply = new JSONObject();
		Boolean result = true;
		String msg = "创建成功!";
		File myFolderPath = new File(name);
		try
		{
			if (!myFolderPath.exists())
			{
				myFolderPath.mkdir();
			}
		} catch (Exception e)
		{
			msg = "新建目录操作出错";
			result = false;
			e.printStackTrace();
		}
		javaReply.put("result", result);
		javaReply.put("msg", msg);
		return javaReply;
	}

	/**
	 * 
	 * @Title:           	createAFile
	 * @Description:     执行文件创建
	 * @param:             @param filePath 文件路径
	 * @param:             @param documentContent 文件内容
	 * @param:             @return   
	 * @return:         Boolean   
	 * @throws
	 */
	public Boolean createAFile(String filePath, String documentContent)
	{
		Boolean result = true;
		File myFilePath = new File(filePath);
		try
		{
			if (!myFilePath.exists())
			{
				myFilePath.createNewFile();
			}
			FileWriter resultFile = new FileWriter(myFilePath);
			PrintWriter myFile = new PrintWriter(resultFile);
			myFile.println(documentContent);
			resultFile.close();
		} catch (Exception e)
		{
			System.out.println("新建文件操作出错");
			result = false;
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 
	 * @Title:            copyFile
	 * @Description:     拷贝文件
	 * @param:             @param srcPathStr 源文件路径
	 * @param:             @param desPathStr   最终路径
	 * @return:         void   
	 * @throws
	 */
	public void copyFile(String srcPathStr, String desPathStr)
	{
		// 1.获取源文件的名称
		String newFileName = srcPathStr.substring(srcPathStr.lastIndexOf("/") + 1); // 目标文件地址(linux为"/")
		desPathStr = desPathStr + File.separator + newFileName; // 源文件地址
		try
		{
			// 2.创建输入输出流对象
			FileInputStream fis = new FileInputStream(srcPathStr);
			@SuppressWarnings("resource")
			FileOutputStream fos = new FileOutputStream(desPathStr);
			// 创建搬运工具
			byte datas[] = new byte[1024 * 8];
			// 创建长度
			int len = 0;
			// 循环读取数据
			while ((len = fis.read(datas)) != -1)
			{
				fos.write(datas, 0, len);
			}
			// 3.释放资源
			fis.close();
			fis.close();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/* 白天json数组统计 */
	/**
	 * 
	 * @Title:             getJSONArrayLengths
	 * @Description:     统计JSON数据中元素的出现次数(白天)
	 * @param:             @param oldData
	 * @param:             @return   
	 * @return:         JSONObject   
	 * @throws
	 */
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

	/**
	 * 
	 * @Title:             readConfigFile
	 * @Description:     读取配置文件
	 * @param:             @param configPath
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public String readConfigFile(String configPath)
	{
		/* 加载配置文件 */
		Properties props = new Properties();
		try
		{
			InputStream is = Test.class.getResourceAsStream(configPath);
			props.load(is);
		} catch (IOException e)
		{
			e.printStackTrace();
		}
		// 取得配置参数
		String tomcatPath = props.getProperty("path", "---");
		return tomcatPath;
	}

	/**
	 * 
	 * @Title:             ArrayListToString
	 * @Description:     ArrayList类型转成String类型
	 * @param:             @param arrayList
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public String ArrayListToString(ArrayList<String> arrayList)
	{
		String result = "";
		if (arrayList != null && arrayList.size() > 0)
		{
			for (String item : arrayList)
			{
				// 把列表中的每条数据用逗号分割开来，然后拼接成字符串
				result += item + ",";
			}
			// 去掉最后一个逗号
			result = result.substring(0, result.length() - 1);
		}
		return result;
	}

	/**
	 * 
	 * @Title:             timeFormat
	 * @Description:     三徒弟:将日期为同一天的数据归类到一块
	 * @param:             @param rawData
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public String timeFormat(JSONArray rawData)
	{
		ConcurrentHashMap<String, JSONArray> hs = new ConcurrentHashMap<>();
		for (int i = 0; i < rawData.length(); i++)
		{
			JSONObject json = rawData.getJSONObject(i);
			String date = json.getString("date").substring(0, 10);
			JSONArray array;
			if (hs.containsKey(date))
			{
				array = hs.get(date);
			} else
			{
				array = new JSONArray();
			}

			array.put(json);
			hs.put(date, array);
		}

		rawData = new JSONArray();
		for (String k : hs.keySet())
		{
			rawData.put(hs.get(k));
		}

		return rawData.toString();
	}

	/**
	 * 
	 * @Title:             daysBetween
	 * @Description:      计算两个时间相差的天数
	 * @param:             @param early
	 * @param:             @param late
	 * @param:             @return   
	 * @return:         int   
	 * @throws
	 */
	public static final int daysBetween(Date early, Date late)
	{
		java.util.Calendar calst = java.util.Calendar.getInstance();
		java.util.Calendar caled = java.util.Calendar.getInstance();
		calst.setTime(early);
		caled.setTime(late);
		// 设置时间为0时
		calst.set(java.util.Calendar.HOUR_OF_DAY, 0);
		calst.set(java.util.Calendar.MINUTE, 0);
		calst.set(java.util.Calendar.SECOND, 0);
		caled.set(java.util.Calendar.HOUR_OF_DAY, 0);
		caled.set(java.util.Calendar.MINUTE, 0);
		caled.set(java.util.Calendar.SECOND, 0);
		// 得到两个日期相差的天数
		int days = ((int) (caled.getTime().getTime() / 1000) - (int) (calst.getTime().getTime() / 1000)) / 3600 / 24;
		return days;
	}

	/**
	 * 
	 * @Title:             longTimeToDay
	 * @Description:     计算两个时间的相差数(天/时/分/秒)
	 * @param:             @param ms
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public static String longTimeToDay(Long ms)
	{
		Integer ss = 1000;
		Integer mi = ss * 60;
		Integer hh = mi * 60;
		Integer dd = hh * 24;
		Long day = ms / dd;
		Long hour = (ms - day * dd) / hh;
		Long minute = (ms - day * dd - hour * hh) / mi;
		Long second = (ms - day * dd - hour * hh - minute * mi) / ss;
		Long milliSecond = ms - day * dd - hour * hh - minute * mi - second * ss;
		StringBuffer sb = new StringBuffer();
		if (day > 0)
		{
			sb.append(day + "天");
		}
		if (hour > 0)
		{
			sb.append(hour + "小时");
		}
		if (minute > 0)
		{
			sb.append(minute + "分");
		}
		if (second > 0)
		{
			sb.append(second + "秒");
		}
		if (milliSecond > 0)
		{
			sb.append(milliSecond + "毫秒");
		}
		return sb.toString();
	}

	/**
	 * 
	 * @Title:             timeIntervalJudgment
	 * @Description:     TODO
	 * @param:             @param inputDate        当前时间
	 * @param:             @param prohibitDate   禁止打卡时间
	 * @param:             @param startDate        标准时间
	 * @param:             @param normalDate   开始时间
	 * @param:             @param endDate         结束时间
	 * @param:             @return
	 * @param:             @throws ParseException   
	 * @return:         String   
	 * @throws
	 */
	public String timeIntervalJudgment(String inputDate, String prohibitDate, String startDate, String normalDate,
			String endDate) throws ParseException
	{
		String result = "";
		/*
		 * 接口规范: 传HH:mm的数据
		 */
		SimpleDateFormat df = new SimpleDateFormat("HH:mm");
		Date now = df.parse(inputDate); // 当前时间
		// 如果禁止打卡时间没有设置默认为06:00
		if (prohibitDate.equals(""))
		{
			prohibitDate = "06:00";
		}
		Date prohibit = df.parse(prohibitDate); // --->禁止打卡时间段
		Date begin = df.parse(startDate); // --->开始时间
		Date normal = df.parse(normalDate); // --->在20分钟内
		Date end = df.parse(endDate); // --->结束时间
		Calendar nowTime = Calendar.getInstance();
		nowTime.setTime(now); // --->当前时间的判断值
		Calendar beginTime = Calendar.getInstance();
		Calendar prohibitTime = Calendar.getInstance();
		prohibitTime.setTime(prohibit);// --->禁止打卡时间的判断值
		beginTime.setTime(begin); // --->开始时间的判断值
		Calendar endTime = Calendar.getInstance();
		endTime.setTime(end); // --->结束时间的判断值
		Calendar normalTime = Calendar.getInstance();
		normalTime.setTime(normal); // --->20分钟以内的时间判断值
		if (nowTime.before(normalTime) && nowTime.after(beginTime))
		{
			/* 如果在20分钟以内:当前时间在正常时间之前,在开始时间之后 */
			result = "正常打卡";
			// return true;

		} else if (nowTime.before(endTime) && nowTime.after(beginTime))
		{
			/* 如果在(开始时间)到(结束时间)之间:当前时间在结束时间之前,在开始时间之后 */
			result = "迟到打卡";
			// return false;
		} else if (nowTime.before(beginTime) && nowTime.after(prohibitTime))
		{
			/* 如果在开始时间之前,在禁止打卡时间之后 */
			result = "提前打卡";
		} else if (nowTime.before(prohibitTime))
		{
			/* 如果在禁止打卡时间之前 */
			result = "禁止打卡";
		} else if (nowTime.equals(beginTime))
		{
			result = "准时打卡";
		} else
		{
			result = "旷工";
		}
		return result;
	}

	
	/**
	 * 
	 * @Title:             getSameDateJsonArray
	 * @Description:     将日期为同一天的数据归类到一块
	 * @param:             @param rawArray
	 * @param:             @return   
	 * @return:         JSONArray   
	 * @throws
	 */
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
		for (int i = 0; i < array.length(); i++)
		{
			JSONArray arrOneArr = array.getJSONArray(i);
			JSONArray finalOneArr = new JSONArray();
			for (int j = 0; j < arrOneArr.length(); j++)
			{
				JSONObject arrObj = arrOneArr.getJSONObject(j);
				if (arrObj.has("flag"))
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
	/**
	 * 
	 * @Title:             weekSort
	 * @Description:     周排序
	 * @param:             @param rawDate
	 * @param:             @return   
	 * @return:         ArrayList<String>   
	 * @throws
	 */
	public ArrayList<String> weekSort(ArrayList<String> rawDate)
	{
		// 转换为Integer数组
		ArrayList<Integer> tmpArr = new ArrayList<Integer>();
		for (int i = 0; i < rawDate.size(); i++)
		{
			String thisVal = rawDate.get(i);
			switch (thisVal)
			{
			case "星期一":
				tmpArr.add(1);
				break;
			case "星期二":
				tmpArr.add(2);
				break;
			case "星期三":
				tmpArr.add(3);
				break;
			case "星期四":
				tmpArr.add(4);
				break;
			case "星期五":
				tmpArr.add(5);
				break;
			case "星期六":
				tmpArr.add(6);
				break;
			default:
				tmpArr.add(7);
				break;
			}
		}
		// 排序
		Collections.sort(tmpArr);
		// 转回List
		ArrayList<String> finalArr = new ArrayList<String>();
		for (int i = 0; i < tmpArr.size(); i++)
		{
			int thisVal = tmpArr.get(i);
			switch (thisVal)
			{
			case 1:
				finalArr.add("星期一");
				break;
			case 2:
				finalArr.add("星期二");
				break;
			case 3:
				finalArr.add("星期三");
				break;
			case 4:
				finalArr.add("星期四");
				break;
			case 5:
				finalArr.add("星期五");
				break;
			case 6:
				finalArr.add("星期六");
				break;
			default:
				finalArr.add("星期天");
				break;
			}
		}
		return finalArr;
	}

	/**
	 * 
	 * @Title:             txPercentage
	 * @Description:      百分比运算
	 * @param:             @param a
	 * @param:             @param b
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public String txPercentage(int a, int b)
	{
		DecimalFormat df = new DecimalFormat("0.00");// 设置保留位数
		return df.format((float) a / b);
	}

	/**
	 * 
	 * @Title:             addDouble
	 * @Description:     小数加法运算
	 * @param:             @param a
	 * @param:             @param b
	 * @param:             @return   
	 * @return:         BigDecimal   
	 * @throws
	 */
	public static BigDecimal addDouble(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.add(parameterTwo);
		return result;
	}

	/**
	 * 
	 * @Title:             subtract
	 * @Description:     小数减法运算
	 * @param:             @param a
	 * @param:             @param b
	 * @param:             @return   
	 * @return:         BigDecimal   
	 * @throws
	 */
	public BigDecimal subtract(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.subtract(parameterTwo);
		return result;
	}

	/**
	 * 
	 * @Title:             multiply
	 * @Description:     小数乘法运算
	 * @param:             @param a
	 * @param:             @param b
	 * @param:             @return   
	 * @return:         BigDecimal   
	 * @throws
	 */
	public BigDecimal multiply(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.multiply(parameterTwo);
		return result;
	}

	/**
	 * 
	 * @Title:             divide
	 * @Description:     小数除法运算
	 * @param:             @param a
	 * @param:             @param b
	 * @param:             @return   
	 * @return:         BigDecimal   
	 * @throws
	 */
	public BigDecimal divide(String a, String b)
	{
		BigDecimal parameterOne = new BigDecimal(a);
		BigDecimal parameterTwo = new BigDecimal(b);
		BigDecimal result = parameterOne.divide(parameterTwo, 2); // 要设置保留几位小数
		return result;
	}

	/**
	 * 
	 * @Title:             removeChinese
	 * @Description:     正则表达式去掉字符串的中文
	 * @param:             @param str
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public String removeChinese(String str)
	{
		String reg = "[\u4e00-\u9fa5]";
		Pattern pat = Pattern.compile(reg);
		Matcher mat = pat.matcher(str);
		String repickStr = mat.replaceAll("");
		return repickStr;
	}
	/**
	 * 根据小时判断是否为上午、中午、下午
	 * @param hour
	 * @return
	 * @author 李凯
	 */
	public static String getDuringDay(int hour){
		if (hour >= 7 && hour < 11) {
			return "AM";
		}if (hour >= 11 && hour <= 13) {
			return "NOON";
		}if (hour >= 14 && hour <= 18) {
			return "PM";
		}
		return null;
	}
	/**
	 * 
	 * @Title:             getWeekOfDate
	 * @Description:     传日期获取当前为星期几
	 * @param:             @param date
	 * @param:             @return   
	 * @return:         String   
	 * @throws
	 */
	public static String getWeekOfDate(Date date) { 
		  String[] weekDaysName = { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" }; 
		  //String[] weekDaysCode = { "0", "1", "2", "3", "4", "5", "6" }; 
		  Calendar calendar = Calendar.getInstance(); 
		  calendar.setTime(date); 
		  int intWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1; 
		  return weekDaysName[intWeek]; 
	}
	
	/**
	 * 
	 * @Title:             removeDuplicate
	 * @Description:     JSONArray根据name去重,并计算amount(三徒弟)
	 * @param:             @param rawData
	 * @param:             @return   
	 * @return:         JSONArray   
	 * @throws
	 */
	public JSONArray removeDuplicate(JSONArray rawData)
	{
		/*
		 * 难点: 使用ConcurrentHashMap,相比HashMap优点高并发下不会出错
		 */
		ConcurrentHashMap<String, Double> hs = new ConcurrentHashMap<>();
		for (int i = 0; i < rawData.length(); i++)
		{
			JSONObject data = rawData.getJSONObject(i);
			String name = data.getString("name");
			double amount = data.getDouble("amount");
			if (hs.containsKey(name)) // --->判断name是否重复
			{
				hs.put(name, hs.get(name) + amount); // --->当前项的amount+hs中的amount
			} else
			{
				hs.put(name, amount); // --->不重复的数据
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

	/**
	 * 
	 * @Title:             lkRemoveDuplicate
	 * @Description:     JSONArray根据name去重,并计算Amount
	 * @param:             @param rawData
	 * @param:             @return   
	 * @return:         JSONArray   
	 * @throws
	 */
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
				if (listObj.has("bankImg"))
				{
					finalObj.put("bankImg", listObj.getString("bankImg"));
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

	/**
	 * 
	 * @Title:             orderSameDateArray
	 * @Description:     将数据按日期归类好后,根据订单号来比对当前时间段下的数据 
	 * @param:             @param sameDateArray
	 * @param:             @param orderNumber   
	 * @return:         void   
	 * @throws
	 */
	public void orderSameDateArray(JSONArray sameDateArray, String orderNumber)
	{
		for (int i = 0; i < sameDateArray.length(); i++)
		{
			// 取出当前遍历到的第一层Array
			JSONArray sameDateOneArr = sameDateArray.getJSONArray(i);
			for (int j = 0; j < sameDateOneArr.length(); j++)
			{
				JSONObject nowObj = sameDateOneArr.getJSONObject(j); // --->当前第一层数据每一项的重复到的数据
				String nowOrderNumber = ""; // --->当前项的订单号
				if (nowObj.has("orderNumber"))
				{
					nowOrderNumber = nowObj.getString("orderNumber");
				}
				if (orderNumber.equals(nowOrderNumber))
				{
					System.out.println("当前点击项下的数据:");
					for (int k = 0; k < sameDateOneArr.length(); k++)
					{
						JSONObject itemClickData = sameDateOneArr.getJSONObject(k);
						System.out.println(itemClickData);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @Title:             getJSONArray
	 * @Description:     大大JSONArray归类
	 * @param:             @param jsonArray
	 * @param:             @return   
	 * @return:         JSONArray   
	 * @throws
	 */
	@SuppressWarnings(
	{ "rawtypes", "unchecked" })
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
