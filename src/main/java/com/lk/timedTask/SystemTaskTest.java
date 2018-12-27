package com.lk.timedTask;

import java.util.TimerTask;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;



/*
  * 
  *  @author  李凯
  *  @version V-2018-12-25 19:55:56 root
  *   时间任务器
* */

public class SystemTaskTest extends TimerTask
{
	private static Logger logger = Logger.getLogger(SystemTaskTest.class);
	@SuppressWarnings("unused")
	private ServletContext context;
	private String path;
	@SuppressWarnings("unused")
	private static String every_time_run;

	public SystemTaskTest(String path, ServletContext context)
	{
		this.path = path;
		this.context = context;
	}
	@Override
	/**  
	 * 把要定时执行的任务就在run中  
	 */
	public void run()
	{
		PicTempFileManager etf;
		try
		{
			logger.info("开始执行定时任务!");
			// 需要执行的代码
			//System.out.println("path======" + path);
			etf = new PicTempFileManager(path);
			etf.run();
			logger.info("指定任务执行完成");
		} catch (Exception e)
		{
			e.printStackTrace();
		}

	}
}
