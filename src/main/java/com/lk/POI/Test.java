package com.lk.POI;

import org.json.JSONArray;

public class Test
{
	public static void main(String[] args) throws Exception
	{
		
		/*创建带有Sheet页的Excel
		 * 	Workbook wb = new HSSFWorkbook();
		 * 	wb.createSheet("第一个Sheet页面");
		 * 	FileOutputStream fileOut = new FileOutputStream("/home/likai/poiExport/ExcelTest1.xls");
		 * 	wb.write(fileOut);
		 * 	fileOut.close();
		 * */
	
		/*基本用法：创建一个空Excel
		 * 	创建工作薄
			Workbook wb = new HSSFWorkbook();
			创建输出流
			FileOutputStream fileOut = new FileOutputStream("/home/likai/poiExport/ExcelTest.xls");
			wb.write(fileOut);
			fileOut.close();
		 * 
		 * */
		String orders = "["+1+","+2+","+3+"]";
		JSONArray array = new JSONArray(orders);
		System.out.println(array);
		
	}
}
