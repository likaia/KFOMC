package com.lk.mappers;

import java.util.List;

import com.lk.db.FittingPublic;

public interface FittingPublicMapper
{
	// 查询表内所有数据
	public List<FittingPublic> findFitting(FittingPublic row);
	//新增
	public int add(FittingPublic row);
	//根据id查询图片
	public  List<FittingPublic> queryIdUrl(FittingPublic row);
}
