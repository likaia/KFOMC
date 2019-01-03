package com.lk.mappers;

import java.util.List;

import com.lk.db.WorkReportInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 18:14:53 root
  *  
* */

public interface WorkReportInfoMapper
{
		// 查询表内所有数据
		public List<WorkReportInfo> findexpenditurePage(WorkReportInfo row);

		// 自定义查询表内数据
		public List<WorkReportInfo> customQuery(WorkReportInfo row);

		// 按条件查询
		public List<WorkReportInfo> conditionalQuery(WorkReportInfo row);

		// 批量删除
		public int del(WorkReportInfo row);

		// 新增数据
		public int add(WorkReportInfo row);

		// 更新数据
		public int update(WorkReportInfo row);
}
