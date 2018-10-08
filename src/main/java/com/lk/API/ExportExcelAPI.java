package com.lk.API;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import com.lk.Utils.*;
import com.lk.dbutil.DbUtil;
public class ExportExcelAPI extends HttpServlet
{
	/*从数据库查询所有数据，并导出为Excel*/
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		DbUtil dbUtil = new DbUtil();
		request.setCharacterEncoding("UTF-8");
		//取出用户名
		String  operator = request.getParameter("operator");
		operator = "\"" + operator + "\"";
		if(!operator.equals(""))
		{
			// 创建工作博
			Workbook wb = new HSSFWorkbook();
			// 定义头部
			String headers[] =
			{ "订单号", "日期", "客户姓名", "客户姓名", "工程名称", "玻璃数量", "总面积", "发货数量", "发货面积", "附加费用", "总金额", "已付款", "未付款", "完成发货",
					"制单人", "操作人" };
			// 从数据库取出数据 使用jdbc查询数据库
			try
			{
				// 获取连接
				Connection con = dbUtil.getCon();
				String sql = "select * from t_order_Info where operator="+operator+"";
				PreparedStatement pstmt = con.prepareStatement(sql);
				ResultSet rs = pstmt.executeQuery(); // 返回结果集ResultSet
				//调用Excel工具类 生成excel文件
				ExcelUtil.fillExcelData(rs, wb, headers);
				FileDownloadUtil.export(response, wb, "订单信息.xls");
			} catch (Exception e)
			{
				System.out.println("数据库异常");
				e.printStackTrace();
			} 
		}
		else
		{
			System.out.println("操作人不能为空!");
		}
	}
}
