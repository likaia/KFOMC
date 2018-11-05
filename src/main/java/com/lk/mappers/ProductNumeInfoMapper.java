package com.lk.mappers;

import java.util.List;

import com.lk.db.ProductListInfo;

public interface ProductNumeInfoMapper
{
	//自定义字段查询
	public List<ProductListInfo> customQuery(ProductListInfo row);
	//分页查询
	public List<ProductListInfo> findexpenditurePage(ProductListInfo row);
	//自定义条件查询
	public List<ProductListInfo> conditionalQuery(ProductListInfo row);
	//批量删除
	public int del(ProductListInfo row);
	//新增数据
	public int add(ProductListInfo row);
	//更新数据
	public int update(ProductListInfo row);
}
