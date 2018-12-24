package com.lk.mappers;

import java.util.List;

import com.lk.db.ShipmentInfo;


public interface ShipmentMapper
{
		//查询表内所有数据
		public List<ShipmentInfo> findexpenditurePage(ShipmentInfo row);
		//根据条件查询
		public List<ShipmentInfo> conditionalQuery(ShipmentInfo row);
		//自定义查询
		public List<ShipmentInfo> customQuery(ShipmentInfo row);
		//更新数据
		public int update(ShipmentInfo row);
		//删除数据
		public int del(ShipmentInfo row);
		//新增数据
		public int add(ShipmentInfo row);
	
}
