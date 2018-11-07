package com.lk.mappers;

import java.util.List;

import com.lk.db.IncomeInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 14:48:03 root
  *  
* */

public interface IncomeInfoMapper
{
	// 查询表内所有数据
	public List<IncomeInfo> findexpenditurePage(IncomeInfo row);

	// 自定义查询
	public List<IncomeInfo> conditionalQuery(IncomeInfo row);

	// 自定义查询表内数据
	public List<IncomeInfo> customQuery(IncomeInfo row);

	// 批量删除
	public int del(IncomeInfo row);

	// 新增数据
	public int add(IncomeInfo row);

	// 更新数据
	public int update(IncomeInfo row);
}
