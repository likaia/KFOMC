package com.lk.TestAPI;

import java.math.BigDecimal;

import com.lk.Utils.LkCommon;

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
		LkCommon lkCommon = new LkCommon();
		BigDecimal result = lkCommon.subtract("5.66", "1.33");
		System.out.println(result);
	}
}
