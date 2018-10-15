package com.lk.mappers;

import java.util.List;

import com.lk.db.PurchaseInfo;


public interface PurchaseMapper
{
	//查询表内所有数据
	public List<PurchaseInfo> findexpenditurePage(PurchaseInfo row); 
	
}
