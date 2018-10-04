package com.lk.mappers;

import java.util.List;

import com.lk.db.OrderInfo;

public interface OrderMapper
{
	//添加数据
	public int add(OrderInfo row);
	//查询表内所有数据
	public List<OrderInfo> findexpenditurePage(OrderInfo row); 
	//自定义查询表内数据
	public List<OrderInfo> customQuery(OrderInfo row); 
	//根据特定条件查询表内数据
	public List<OrderInfo> conditionalQuery(OrderInfo row);
	//更新数据
	public int update(OrderInfo row);
	//删除数据
	public int del(int id);
	//模糊查询
	public List<OrderInfo> Gluestudy(String basicStandard); 
}
