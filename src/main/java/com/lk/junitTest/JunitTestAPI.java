package com.lk.junitTest;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.*;


import com.lk.Utils.DeleteFileUtil;
import com.lk.Utils.LkCommon;
import com.lk.Utils.WorderToNewWordUtils;
import com.lk.Utils.ZipUtils;
import com.lk.db.ClientInfo;
import com.lk.db.OrderInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.ClientInfoMapper;
import com.lk.mappers.OrderMapper;

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

	/* 打卡区间判断 */
	@Test
	public void test4() throws ParseException
	{
		String result = lkcommon.timeIntervalJudgment("08:20", "", "08:00", "08:20", "09:00");
		System.out.println("当前打卡状态:" + result);
	}

	/* 使用TreeSet去除数组中的重复元素,并且会排序 */
	@Test
	public void test5()
	{
		TreeSet<String> ts = new TreeSet<String>();
		ts.add("李凯");
		ts.add("王");
		ts.add("王");
		System.out.println(ts);

	}

	/* tomcat路径读取测试 */
	@Test
	public void test6()
	{
		/* 加载配置文件 */
		Properties props = new Properties();
		try
		{
			InputStream is = Test.class.getResourceAsStream("/TomcatPath.properties");
			props.load(is);
		} catch (IOException e)
		{
			e.printStackTrace();
		}
		// 取得配置参数
		String tomcatPath = props.getProperty("path", "---");
		System.out.println(tomcatPath);
	}

	/* tomcat路径拼接测试 */
	@Test
	public void test7()
	{
		String fileName = "webPic/20190910.jpg";
		fileName = fileName.substring(6);
		String tomcatPath = lkcommon.readConfigFile("/TomcatPath.properties");
		fileName = tomcatPath + fileName;
		System.out.println(fileName);
	}

	/* 客户名称自定义查询接口测试 */
	@Test
	public void test8()
	{
		String operator = "李凯";
		String[] queryTypeArr =
		{ "clientName" };
		JSONArray queryType = new JSONArray(queryTypeArr);
		// 打开连接
		SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
		// 配置映射器
		ClientInfoMapper clientInfoMapper = sqlSession.getMapper(ClientInfoMapper.class);
		ClientInfo row = new ClientInfo();
		row.setOperator(operator);
		row.setQueryType(queryType);
		List<ClientInfo> resultList = clientInfoMapper.customQuery(row);
		JSONArray clientData = new JSONArray(resultList);
		System.out.println(clientData);
		sqlSession.close();
	}

	/* 订单接口:客户对账特有接口查询 */
	@Test
	public void test9()
	{
		String clientName = "张小飞";
		// 打开连接
		SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
		// 配置映射器
		OrderMapper orderMapper = sqlSession.getMapper(OrderMapper.class);
		OrderInfo row = new OrderInfo();
		row.setClientName(clientName);
		row.setOperator("李凯");
		/* 按条件查询:(客户名称查询所有订单) */
		List<OrderInfo> resultList = orderMapper.uniqueQuery(row);
		JSONArray result = new JSONArray(resultList);
		sqlSession.close();
		System.out.println(result);
	}

	/* 文件压缩测试 */
	@Test
	public void test10() throws IOException
	{
		String fileName = "webPic/43.jpg";
		fileName = fileName.substring(6);
		String tomcatPath = lkcommon.readConfigFile("/TomcatPath.properties");
		fileName = tomcatPath + fileName;
		String zipFile = "/home/likai/my.zip";
		ZipUtils.doCompress(fileName, zipFile);
	}
	/* 获取网络时间 */
	@Test
	public void test11()
	{
		for (int i = 0; i < 1000; i++)
		{
			 //获取当前网络时间
	        String webUrl="http://www.baidu.com";//百度时间
	        String webTime=LkCommon.getNetworkTime(webUrl);
	        System.out.println("当前网络时间为："+webTime);
		}
	}
	/**
	 * @throws IOException 
	 * 
	 * @Title:             test12
	 * @Description:     文件操作
	 * @return:         void   
	 * @throws
	 */
	@Test
	public void test12() throws IOException
	{
		String[] picStrArr = {"webPic/20181223172516_233223.png","webPic/43.jpg","webPic/20181004023334_admin.jpg","webPic/20181223114011_timg.jpeg","webPic/20181224092931_shengdan.jpg"};
		JSONArray picArr = new JSONArray(picStrArr);
		  //获取网络时间
		  String webTime=LkCommon.getNetworkTime("http://www.baidu.com"); 
		  //去除时间中的所有标点符号
		  webTime = webTime.replaceAll("[\\pP\\p{Punct}]","");
		  //获取tomcat路径
		  String tomcatPath = lkcommon.readConfigFile("/TomcatPath.properties");
		  //拼接文件夹名称
		  String folderName = tomcatPath+"/"+webTime+"";
		  //去除空格
		  folderName =  folderName.replace(" ","");
		  System.out.println("将要创建的文件夹名称为:"+folderName);
		  //创建文件夹
		  lkcommon.createFolder(folderName);
		 int num = 0;
		  //将文件名从数组中读出来
		  for(int i = 0; i <picArr.length();i++)
		  {
			  num++;
			  String fileName = picArr.getString(i);
			  //去除webPic前缀
			  fileName = fileName.substring(6);
			  //拼接每一项的文件路径,得到tomcat下的真实文件路径
			  fileName = tomcatPath+"/"+fileName+"";
			  //将遍历到的每一项文件复制到新建的文件夹中
			  lkcommon.copyFile(fileName, folderName);
		  }
		  System.out.println(num+"个文件,已拷贝到"+folderName+"中");
		  String zipFile = tomcatPath+"/zipFile/"+webTime+".zip";
		  //去除空格
		  zipFile =zipFile.replace(" ","");
		  //压缩文件
		  ZipUtils.doCompress(folderName, zipFile);
		  System.out.println("文件压缩成功,路径为:"+zipFile);
		  //删除刚开始创建的文件夹
		  DeleteFileUtil.deleteDirectory(folderName);
		  System.out.println("文件:"+folderName+"已删除");
	}
	/**
	 * 
	 * @Title:             test13
	 * @Description:     arrayList排序
	 * @param:                
	 * @return:         void   
	 * @throws
	 */
	@Test
	public void test13()
	{
		String[] arr = {"aa","cc","nn","bb"};
		ArrayList<String> arrs = new ArrayList<String>();
		for(int i = 0;i< arr.length;i++)
		{
			arrs.add(arr[i]);
		}
		Collections.sort(arrs);
		System.out.println(arrs);
	}
}
