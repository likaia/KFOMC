package com.lk.TestAPI;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.ibatis.session.SqlSession;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.json.JSONArray;
import org.json.JSONObject;

import com.lk.Utils.LkCommon;
import com.lk.Utils.WorderToNewWordUtils;
import com.lk.db.OutlayInfo;
import com.lk.db.ProductListInfo;
import com.lk.db.ShipmentInfo;
import com.lk.dbutil.SqlSessionFactoryUtil;
import com.lk.mappers.OutlayInfoMapper;
import com.lk.mappers.ProductNumeInfoMapper;
import com.lk.mappers.ShipmentMapper;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-13 18:44:10 root
  *  
* */

public class TestClass
{

	public static void main(String[] args) throws Exception
	{

		/*
		 * JSONArray arr = new JSONArray(); JSONObject obj = new JSONObject();
		 * for(int i = 0; i<20;i++) { if(i>10) { obj.put("name", "aa");
		 * obj.put("age", 13); arr.put(obj); } } System.out.println(arr);
		 */
		/*
		 * String aa = "每一天,每一分钟,每一秒,一个人的每一天都很迷茫"; aa= aa.replaceAll("每", "");
		 * System.out.println(aa);
		 */
		/*
		 * // 打开连接 SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
		 * // 配置映射器 ShipmentMapper shipmentMapper =
		 * sqlSession.getMapper(ShipmentMapper.class); ShipmentInfo shipRow =
		 * new ShipmentInfo(); shipRow.setOperator("李凯");
		 * shipRow.setOrderNumber("11413809773"); List<ShipmentInfo>
		 * shipResultList = shipmentMapper.conditionalQuery(shipRow); JSONArray
		 * ShipResult = new JSONArray(shipResultList);
		 * System.out.println(ShipResult); sqlSession.close();
		 */
		/*
		 * String JSONStr =
		 * "[{\"originalTitle\":\"5+25+5双白双钢\",\"stockBalance\":1355,\"id\":3},{\"originalTitle\":\"5+9+5双白双钢\",\"stockBalance\":1940,\"id\":4},{\"originalTitle\":\"5+9+5双白普通\",\"stockBalance\":1668,\"id\":5},{\"originalTitle\":\"10mm钢化\",\"stockBalance\":720,\"id\":6},{\"originalTitle\":\"5mm单片钢化\",\"stockBalance\":3788,\"id\":7},{\"originalTitle\":\"5mmLOW-E单片普通\",\"stockBalance\":120,\"id\":12}]";
		 * JSONArray JSONarr = new JSONArray(JSONStr);
		 * ArrayList<String>stockNameVal = new ArrayList<String>();
		 * //--->库存表原片名称总数组 System.out.println(JSONarr.length()); for(int i =
		 * 0;i<JSONarr.length();i++) { JSONObject InventoryInfoOneObj =
		 * JSONarr.getJSONObject(i); String originalTitle =
		 * InventoryInfoOneObj.getString("originalTitle").trim(); // --->原片名称
		 * stockNameVal.add(originalTitle); } String productName = "5+9+5双白双钢";
		 * // --->原片名称 boolean stockFlag =
		 * stockNameVal.contains(productName);//--->判断库存中是否有当前原片名称
		 * System.out.println(stockFlag);
		 */
	}

}
