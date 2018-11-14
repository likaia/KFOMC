package com.lk.TestAPI;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.json.JSONArray;

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
		// 打开连接
		SqlSession sqlSession = SqlSessionFactoryUtil.openSession();
		// 配置映射器
		ProductNumeInfoMapper productNumeInfoMapper = sqlSession.getMapper(ProductNumeInfoMapper.class);
		//构造查询条件
		String[] productQueryArr = {"productName","area"};
		JSONArray productQueryType = new JSONArray(productQueryArr);
		ProductListInfo ProductListRow = new ProductListInfo();
		ProductListRow.setOperator("李凯");
		ProductListRow.setQueryType(productQueryType);
		List<ProductListInfo> productList = productNumeInfoMapper.customQuery(ProductListRow);
		JSONArray productResult = new JSONArray(productList);
		System.out.println(productResult.toString());
		
		
		
		/*LkCommon lkCommon = new LkCommon();
		BigDecimal result = lkCommon.subtract("5.66", "1.33");
		System.out.println(result);*/
	}
}
