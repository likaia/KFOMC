package com.lk.mappers;

import java.util.List;

import com.lk.db.PurchaseInfo;


public interface PurchaseMapper
{
	//查询表内所有数据
	public List<PurchaseInfo> findexpenditurePage(PurchaseInfo row);
	//根据条件查询
	public List<PurchaseInfo> conditionalQuery(PurchaseInfo row);
	//根据订单号查询表内数据
	public List<PurchaseInfo> queryByOrderNumber(PurchaseInfo row);
	//删除数据
	public int del(PurchaseInfo row);
	//新增数据
	public int add(PurchaseInfo row);
}
