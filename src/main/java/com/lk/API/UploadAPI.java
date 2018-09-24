package com.lk.API;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.ibatis.io.ResolverUtil.Test;
import org.json.JSONObject;

public class UploadAPI extends HttpServlet
{
	/**
	 * Java的序列化机制
	 */
	private static final long serialVersionUID = 1L;
	// 上传配置
	private static final int MEMORY_THRESHOLD = 1024 * 1024 * 3; // 3MB
	private static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
	private static final int MAX_REQUEST_SIZE = 1024 * 1024 * 50; // 50MB

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		String msg = "ok";
		request.setCharacterEncoding("UTF-8");
		String fileName = "";
		String userPicPath = "";
		String filePath = "";
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
		// 检测是否为多媒体上传
		if (!ServletFileUpload.isMultipartContent(request))
		{
			// 如果不是则停止
			PrintWriter writer = response.getWriter();
			msg = "Error: 表单必须包含 enctype=multipart/form-data";
			writer.flush();
			return;
		}
		// 配置上传参数
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置内存临界值 - 超过后将产生临时文件并存储于临时目录中
		factory.setSizeThreshold(MEMORY_THRESHOLD);
		// 设置临时存储目录
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
		ServletFileUpload upload = new ServletFileUpload(factory);
		// 设置最大文件上传值
		upload.setFileSizeMax(MAX_FILE_SIZE);

		// 设置最大请求值 (包含文件和表单数据)
		upload.setSizeMax(MAX_REQUEST_SIZE);

		// 构造临时路径来存储上传的文件
		String uploadPath = tomcatPath;
		// 如果目录不存在则创建
		File uploadDir = new File(uploadPath);
		if (!uploadDir.exists())
		{
			uploadDir.mkdir();
		}
		try
		{
			// 解析请求的内容提取文件数据
			List<FileItem> formItems = upload.parseRequest(request);
			if (formItems != null && formItems.size() > 0)
			{
				// 迭代表单数据
				for (FileItem item : formItems)
				{
					// 处理不在表单中的字段
					if (!item.isFormField())
					{
						fileName =serverTime +"_" +  new File(item.getName()).getName();
						userPicPath = "webPic/" +  fileName;
						filePath = uploadPath + File.separator  + fileName;
						File storeFile = new File(filePath);
						// 保存文件到硬盘
						item.write(storeFile);
						msg = "文件上传成功";
					}
				}
			}
		} catch (Exception ex)
		{
			msg = ex.getMessage();
		}
		// 应答
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/plain");
		JSONObject jsReply = new JSONObject();
		jsReply.put("errorCode", 0);
		jsReply.put("msg", msg);
		jsReply.put("userPicPath", userPicPath);
		jsReply.put("filePath", filePath);
		/* 给前端发送结果 */
		PrintWriter writer = response.getWriter();
		writer.write(jsReply.toString());
	}

}
