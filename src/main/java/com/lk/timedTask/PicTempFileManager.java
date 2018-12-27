package com.lk.timedTask;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import org.apache.log4j.Logger;

import com.lk.Utils.LkCommon;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-25 19:46:43 root
  *  删除服务器上的文件
 * 实现Runnable接口(推荐)，可以线程接口，预留一个extends(继承)，方便扩展
* */

public class PicTempFileManager implements Runnable
{
	private static String path;// 路径
	private static Logger logger = Logger.getLogger(PicTempFileManager.class);
	LkCommon lkCommon = new LkCommon();
	private static String RETENTION_TIME = "";// 文件保存的时间
	static
	{
		Properties prop = new Properties();
		InputStream inStrem = PicTempFileManager.class.getClassLoader().getResourceAsStream("timedDeletion.properties");
		try
		{
			prop.load(inStrem);
			//读取文件保存时间
			RETENTION_TIME = prop.getProperty("file_retention_time");
		} catch (IOException e)
		{
			e.printStackTrace();
		} finally
		{
			try
			{
				inStrem.close();
			} catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}

	/**
	 * 构造函数。初始化参数
	 * 
	 * @param path
	 */
	@SuppressWarnings("static-access")
	public PicTempFileManager(String path)
	{
		this.path = path;
	}

	/**
	 * 把线程要执行的代码放在run()中
	 */
	@Override
	public void run()
	{
		/**
		 * 监听器获取网站的根目录
		 * String path = sce.getServletContext().getRealPath("/");
		 */
		/**自定义读取目录,生成zipFile所在的绝对路径*/
		String tomcatPath = lkCommon.readConfigFile("/TomcatPath.properties");
		path = tomcatPath + "/zipFile";
		File file = new File(path);
		/**删除zipFile下的文件*/
		deletefiles(file);
	}

	/**
	 * 批量删除文件夹下的文件
	 * 
	 * @param folder
	 */
	public void deletefiles(File folder)
	{
		File[] files = folder.listFiles();
		for (int i = 0; i < files.length; i++)
		{
			deleteFile(files[i]);
		}
	}

	/**
	 * 删除文件
	 * 
	 * @param file
	 */
	private void deleteFile(File file)
	{
		try
		{
			if (file.isFile())
			{
				// 删除符合条件的文件
				if (canDeleteFile(file))
				{
					if (file.delete())
					{
						logger.info("文件" + file.getName() + "删除成功!");
					} else
					{
						logger.info("文件" + file.getName() + "删除失败!此文件可能正在被使用");
					}
				} else
				{

				}
			} else
			{
				logger.info("没有可以删除的文件了");
			}

		} catch (Exception e)
		{
			logger.info("删除文件失败========");
			e.printStackTrace();
		}
	}

	/**
	 * 判断文件是否能够被删除（删除一周前的文件）
	 */
	private boolean canDeleteFile(File file)
	{
		Date fileDate = getfileDate(file);
		Date date = new Date();
		long time = (date.getTime() - fileDate.getTime()) / 1000 / 60 - Integer.parseInt(RETENTION_TIME);// 当前时间与文件间隔的分钟
		if (time > 0)
		{
			return true;
		} else
		{
			return false;
		}
	}

	/**
	 * 获取文件最后的修改时间
	 * 
	 * @param file
	 * @return
	 */
	private Date getfileDate(File file)
	{
		long modifiedTime = file.lastModified();
		Date d = new Date(modifiedTime);
		return d;
	}

	/**
	 * 格式化日期,没有用到
	 */
	@SuppressWarnings("unused")
	private String formatDate(Date date)
	{
		// SimpleDateFormat f=new SimpleDateFormat("yyyyMMdd hh:mm:ss");//12小时制
		SimpleDateFormat f = new SimpleDateFormat("yyyyMMdd HH:mm:ss");// 24小时制
		String formateDate = f.format(date);
		return formateDate;
	}

	/**
	 * 删除文件夹
	 * 
	 * @param folder
	 */
	public void deleteFolder(File folder)
	{
		if (folder.isDirectory())
		{
			File[] files = folder.listFiles();
			for (int i = 0; i < files.length; i++)
			{
				deleteFolder(files[i]);
			}

			// 非当前目录，删除
			if (!folder.getAbsolutePath().equalsIgnoreCase(path))
			{

				// 只删除在30分钟前创建的文件
				if (canDeleteFile(folder))
				{
					if (folder.delete())
					{
						logger.info("文件夹" + folder.getName() + "删除成功!");
					} else
					{
						logger.info("文件夹" + folder.getName() + "删除失败!此文件夹内的文件可能正在被使用");
					}
				}
			}
		} else
		{
			deleteFile(folder);
		}
	}
}
