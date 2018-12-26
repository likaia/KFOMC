package com.lk.timedTask;

import javax.servlet.ServletContextListener;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Date;
import java.util.Properties;
import java.util.Timer;

import javax.servlet.ServletContextEvent;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-25 19:22:16 root
  *  时间监听器(定时删除指定图片)
* */
public class PicTempFileListener implements ServletContextListener
{
	private Timer timer;
	private SystemTaskTest systemTask;
	private static String every_time_run;
	static
	{
		Properties prop = new Properties();
		InputStream inStrem = PicTempFileManager.class.getClassLoader().getResourceAsStream("timedDeletion.properties");
		try
		{
			prop.load(inStrem);
			every_time_run = prop.getProperty("every_time_run");
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

	@Override
	// 监听器初始方法
	public void contextInitialized(ServletContextEvent sce)
	{
		timer = new Timer();
		systemTask = new SystemTaskTest(sce.getServletContext().getRealPath("/"), sce.getServletContext());
		try
		{
			sce.getServletContext().log("定时器已启动");
			// 设置在每天xx:xx分执行任务
			 Calendar calendar = Calendar.getInstance();
			 calendar.set(Calendar.HOUR_OF_DAY, 12); // 24 ,可以更改时间
			 calendar.set(Calendar.MINUTE,10); // 0可以更改分数
			 calendar.set(Calendar.SECOND, 0);// 0 //默认为0,不以秒计
			 Date date = calendar.getTime();
			// 监听器获取网站的根目录
			//String path = sce.getServletContext().getRealPath("/");
			Long time = Long.parseLong(every_time_run) * 60 * 1000;// 循环执行的时间
			// 第一个参数是要运行的代码，第二个参数是从什么时候开始运行，第三个参数是每隔多久在运行一次。重复执行
			timer.schedule(systemTask, date, time);
			sce.getServletContext().log("已经添加任务调度表");
		} catch (Exception e)
		{
		}

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce)
	{
		try
		{
			timer.cancel();
		} catch (Exception e)
		{
		}
	}
}
