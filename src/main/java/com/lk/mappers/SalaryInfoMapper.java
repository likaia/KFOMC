package com.lk.mappers;

import java.util.List;

import com.lk.db.SalaryInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-05 22:12:11 root
  *  
* */

public interface SalaryInfoMapper
{
	// 查询表内所有数据
	public List<SalaryInfo> findexpenditurePage(SalaryInfo row);

	// 自定义查询
	public List<SalaryInfo> conditionalQuery(SalaryInfo row);

	//自定义字段查询
	public List<SalaryInfo> customQuery(SalaryInfo row);
	
	// 批量删除
	public int del(SalaryInfo row);

	// 新增数据
	public int add(SalaryInfo row);

	// 更新数据
	public int update(SalaryInfo row);
}
