package com.lk.mappers;

import java.util.List;

import com.lk.db.EmployeeInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 23:52:24 root
  *  
* */

public interface EmployeeInfoMapper
{
	// 查询表内所有数据
	public List<EmployeeInfo> findexpenditurePage(EmployeeInfo row);

	// 条件查询
	public List<EmployeeInfo> conditionalQuery(EmployeeInfo row);

	// 批量删除
	public int del(EmployeeInfo row);

	// 自定义查询
	public List<EmployeeInfo> customQuery(EmployeeInfo row);

	// 新增数据
	public int add(EmployeeInfo row);

	// 更新数据
	public int update(EmployeeInfo row);
}
