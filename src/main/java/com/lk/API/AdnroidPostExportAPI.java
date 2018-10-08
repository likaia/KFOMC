package com.lk.API;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Properties;

import org.apache.ibatis.io.ResolverUtil.Test;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONObject;

import com.lk.Utils.ExcelUtil;
import com.lk.dbutil.DbUtil;
import af.restful.AfRestfulApi;

public class AdnroidPostExportAPI extends AfRestfulApi
{
	private static DbUtil dbUtil = new DbUtil();
	@Override
	public String execute(String reqText) throws Exception
	{
		int errorCode = 0;
		String msg = "ok";
		String fileUrl = null;
		JSONObject jsReq = new JSONObject(reqText);
		if(jsReq.has("operator"))
		{
			String  operator = jsReq.getString("operator");
			if(operator.equals(""))
			{
				errorCode = 1;
				msg = "操作人不能为空!";
			}
			else
			{
				// 创建工作博
				Workbook wb = new HSSFWorkbook();
				// 定义头部
				String headers[] =
				{ "订单号", "日期", "客户姓名", "客户姓名", "工程名称", "玻璃数量", "总面积", "发货数量", "发货面积", "附加费用", "总金额", "已付款", "未付款", "完成发货",
						"制单人", "操作人" };
				//用户名添加双引号
				operator = "\"" + operator + "\"";
				// 从数据库取出数据 使用jdbc查询数据库
				// 获取连接
				Connection con = dbUtil.getCon();
				String sql = "select * from t_order_Info where operator="+operator+"";
				PreparedStatement pstmt = con.prepareStatement(sql);
				ResultSet rs = pstmt.executeQuery(); // 返回结果集ResultSet
				//调用Excel工具类 生成excel文件 此处生成后 下方wb直接可以写入文件
				ExcelUtil.fillExcelData(rs, wb, headers);
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
				// 时间处理(大写hh代表24小时制)
				String serverTime = new SimpleDateFormat("yyyyMMddHHmmss").format(Calendar.getInstance().getTime());
				//文件名字
				String filePath = "/Temporarydirectory/"+serverTime+"OrderInfo.xls";
				//给客户端发送的下载地址
				fileUrl = "https://www.kaisir.cn/webPic"+filePath;
				//保存到本地
				FileOutputStream fileOut = new FileOutputStream(tomcatPath+filePath);
				wb.write(fileOut);
				fileOut.close();
				dbUtil.close(pstmt, con);//关闭数据库连接
			}
		}
		else
		{
			errorCode = 1;
			msg = "字段不全:没有操作人字段";
		}
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", errorCode);
		jsReply.put("msg", msg);
		jsReply.put("fileUrl", fileUrl);
		return jsReply.toString();
	}
	
}
