package com.lk.mappers;

import java.util.List;

import com.lk.db.AttendanceInfo;


/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 17:34:35 root
  *  
* */

public interface AttendanceInfoMapper
{
	// 查询表内所有数据
	public List<AttendanceInfo> findexpenditurePage(AttendanceInfo row);

	// 自定义查询
	public List<AttendanceInfo> conditionalQuery(AttendanceInfo row);

	// 批量删除
	public int del(AttendanceInfo row);

	// 新增数据
	public int add(AttendanceInfo row);

	// 更新数据
	public int update(AttendanceInfo row);
}
