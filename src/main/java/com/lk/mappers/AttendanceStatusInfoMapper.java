package com.lk.mappers;

import java.util.List;

import com.lk.db.AttendanceStatusInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-12-07 12:14:44 root
  *  
* */

public interface AttendanceStatusInfoMapper
{
	// 查询表内所有数据
	public List<AttendanceStatusInfo> findexpenditurePage(AttendanceStatusInfo row);

	// 自定义查询表内数据
	public List<AttendanceStatusInfo> customQuery(AttendanceStatusInfo row);

	// 按条件查询
	public List<AttendanceStatusInfo> conditionalQuery(AttendanceStatusInfo row);

	// 批量删除
	public int del(AttendanceStatusInfo row);

	// 新增数据
	public int add(AttendanceStatusInfo row);

	// 更新数据
	public int update(AttendanceStatusInfo row);
}
