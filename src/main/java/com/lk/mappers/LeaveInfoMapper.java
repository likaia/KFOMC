package com.lk.mappers;

import java.util.List;

import com.lk.db.LeaveInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-02 17:37:46 root
  *  
* */

public interface LeaveInfoMapper
{
	// 查询表内所有数据
	public List<LeaveInfo> findexpenditurePage(LeaveInfo row);

	// 自定义查询表内数据
	public List<LeaveInfo> customQuery(LeaveInfo row);

	// 按条件查询
	public List<LeaveInfo> conditionalQuery(LeaveInfo row);

	// 批量删除
	public int del(LeaveInfo row);

	// 新增数据
	public int add(LeaveInfo row);

	// 更新数据
	public int update(LeaveInfo row);
}
