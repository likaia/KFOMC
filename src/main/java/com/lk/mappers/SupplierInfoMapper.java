package com.lk.mappers;

import java.util.List;

import com.lk.db.SupplierInfo;

/*
  * 
  *  @author  李凯
  *  @version V-2018-11-28 11:59:37 root
  *  
* */

public interface SupplierInfoMapper
{
	    // 查询表内所有数据
		public List<SupplierInfo> findexpenditurePage(SupplierInfo row);
		//自定义查询(查询特定字段)
		public List<SupplierInfo> conditionalQuery(SupplierInfo row);
		//自定义查询(根据特定条件查询)
		public List<SupplierInfo>customQuery(SupplierInfo row);
		//批量删除
		public int del(SupplierInfo row);
		//新增数据
		public int add(SupplierInfo row);
		//更新数据
		public int update(SupplierInfo row);
	
}
