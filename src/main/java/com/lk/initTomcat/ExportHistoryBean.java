package com.lk.initTomcat;

import java.io.File;
import java.util.Calendar;
import java.util.TimerTask;

import javax.servlet.ServletContext;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-23 11:44:35 root
  *  
* */
/*tomcat定时任务执行文件,配合SysContextListener.java*/
public class ExportHistoryBean extends TimerTask
{
	private static final int C_SCHEDULE_HOUR = 0;
	private static boolean isRunning = false;
	private ServletContext context = null;
	public ExportHistoryBean(ServletContext context)
	{
	this.context = context;
	}
	public void run()
	{
		Calendar c = Calendar.getInstance();
		if (!isRunning)
		{
			if (C_SCHEDULE_HOUR == c.get(Calendar.HOUR_OF_DAY))
			{
				isRunning = true;
				context.log("开始执行指定任务");
				// -------------------开始保存当日历史记录
				// 在这里编写自己的功能，例：
				// File file = new File("temp");
				// file.mkdir();
				// 启动tomcat，可以发现在tomcat根目录下，会自动创建temp文件夹
				// -------------------结束
				isRunning = false;
				context.log("指定任务执行结束");
			} else
			{
				context.log("上一次任务执行还未结束");
			}
		}
	}
}
