package com.lk.Utils;

import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;

/*文件下载工具类*/
public class FileDownloadUtil
{
	public static void export(HttpServletResponse response,Workbook wb,String fileName) throws Exception
	{
		response.setHeader("Content-Disposition", "attachment;filename="+new String(fileName.getBytes("utf-8"),"iso8859-1"));
		response.setContentType("application/ynd.ms-excel;charset=UTF-8");
		OutputStream out = response.getOutputStream();
		wb.write(out);
		out.close();
	}
}
