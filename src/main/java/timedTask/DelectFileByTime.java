package timedTask;

import java.io.File;
import java.util.Date;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-25 18:37:52 root
  *  
* */

public class DelectFileByTime
{
	class Runnable1 implements Runnable
	{
		public void run()
		{// 重写run方法
			File dir = new File("D:\\test");
			while (true)
			{
				try
				{
					Thread.sleep(10);// 实现定时去删除
					System.out.println("测试定时");
					delect(dir);// 删除方法
				} catch (InterruptedException e)
				{
					e.printStackTrace();
				}
			}
		}

		private void delect(File file)
		{// 递归删除文件
			Long ftime = file.lastModified();
			Date now = new Date();
			Long ntime = now.getTime();
			Long ms = ntime - ftime;
			/*
			 *             * 若是文件则直接删除             * 若是目录，要先将目录多有内容删除           
			 *  *
			 */
			if (file.isDirectory())
			{
				// 先清空目录
				File[] subs = file.listFiles();
				for (File sub : subs)
				{
					/*
					 *              * 递归调用   方法内部调用自己方法的行为  称为递归              *
					 * 使用要注意：              *   1.递归的层数不要太多，因为递归调用开销较大。       
					 *       *   2.递归调用在方法中不能必然执行，必须在一个分支              *  
					 * 中控制它的调用，否则就是死循环。  递归是将一个方法中所有的代码重新执行。              *
					 */
					delect(sub);
				}
			}
			if (ms > 1000 * 60 * 5)
			{// 文件保留时间超过5分钟
				System.out.println(ms);// 测试用
				file.delete();// 递归删除文件方法
			}
		}
	}
}
