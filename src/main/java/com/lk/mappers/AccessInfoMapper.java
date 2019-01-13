package com.lk.mappers;

import java.util.List;

import com.lk.db.AccessInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2019-01-10 11:46:54 root
  *  
* */

public interface AccessInfoMapper
{
	// 查询表内所有数据
	public List<AccessInfo> findexpenditurePage(AccessInfo row);

	// 自定义查询表内数据
	public List<AccessInfo> customQuery(AccessInfo row);

	// 按条件查询
	public List<AccessInfo> conditionalQuery(AccessInfo row);

	// 批量删除
	public int del(AccessInfo row);

	// 新增数据
	public int add(AccessInfo row);

	// 更新数据
	public int update(AccessInfo row);
}
