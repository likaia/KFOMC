package com.lk.mappers;

import java.util.List;

import com.lk.db.OutlayInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-06 20:16:07 root
  *  
* */

public interface OutlayInfoMapper
{
	// 查询表内所有数据
	public List<OutlayInfo> findexpenditurePage(OutlayInfo row);

	// 自定义查询表内数据
	public List<OutlayInfo> customQuery(OutlayInfo row);

	// 自定义查询
	public List<OutlayInfo> conditionalQuery(OutlayInfo row);

	// 批量删除
	public int del(OutlayInfo row);

	// 新增数据
	public int add(OutlayInfo row);

	// 更新数据
	public int update(OutlayInfo row);
}
