package com.lk.initTomcat;

import java.util.Timer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-23 11:55:14 root
  *  
* */
/*Servlet侦听器结合Java定时器来讲述整个实现过程。
	 * 要运用Servlet侦听器需要实现 javax.servlet.ServletContextListener接口，
	 * 同时实现它的 c
	 * ontextInitialized(ServletContextEvent event)和 contextDestroyed(ServletContextEvent event)
	 * 两个接口函数
*/
public class SysContextListener implements ServletContextListener
{
	private Timer timer = null;

	public void contextInitialized(ServletContextEvent event)
	{
		// 在这里初始化监听器，在tomcat启动的时候监听器启动，可以在这里实现定时器功能
		timer = new Timer(true);
		event.getServletContext().log("定时器已启动");// 添加日志，可在tomcat日志中查看到
		timer.schedule(new ExportHistoryBean(event.getServletContext()), 0, 5 * 1000);// 调用exportHistoryBean，0表示任务无延迟，5*1000表示每隔5秒执行任务，60*60*1000表示一个小时。
		event.getServletContext().log("已经添加任务");
	}
	public void contextDestroyed(ServletContextEvent event)
	{
		// 在这里关闭监听器，所以在这里销毁定时器。
		timer.cancel();
		event.getServletContext().log("定时器销毁");
	}
}
