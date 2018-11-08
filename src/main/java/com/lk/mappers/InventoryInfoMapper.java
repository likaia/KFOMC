package com.lk.mappers;

import java.util.List;

import com.lk.db.InventoryInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-07 11:48:09 root
  *  
* */

public interface InventoryInfoMapper
{
	// 查询表内所有数据
	public List<InventoryInfo> findexpenditurePage(InventoryInfo row);

	// 自定义查询
	public List<InventoryInfo> conditionalQuery(InventoryInfo row);

	// 自定义查询表内数据
	public List<InventoryInfo> customQuery(InventoryInfo row);

	// 批量删除
	public int del(InventoryInfo row);

	// 新增数据
	public int add(InventoryInfo row);

	// 更新数据
	public int update(InventoryInfo row);
}
