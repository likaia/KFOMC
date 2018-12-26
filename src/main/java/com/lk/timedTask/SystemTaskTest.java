package com.lk.timedTask;

import java.util.Date;
import java.util.TimerTask;

import javax.servlet.ServletContext;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-25 19:55:56 root
  *   时间任务器
* */

public class SystemTaskTest extends TimerTask
{
	private ServletContext context;
	private String path;
	@SuppressWarnings("unused")
	private static String every_time_run;

	public SystemTaskTest(String path, ServletContext context)
	{
		this.path = path;
		this.context = context;
	}

	@SuppressWarnings("deprecation")
	@Override
	/**  
	 * 把要定时执行的任务就在run中  
	 */
	public void run()
	{
		PicTempFileManager etf;
		try
		{
			context.log("开始执行任务!");
			// 需要执行的代码
			System.out.println(new Date().toLocaleString());
			//System.out.println("path======" + path);
			etf = new PicTempFileManager(path);
			etf.run();
			context.log("指定任务执行完成!");
		} catch (Exception e)
		{
			e.printStackTrace();
		}

	}
}
