package com.lk.mappers;

import java.util.List;

import com.lk.db.FittingPublic;

public interface FittingPublicMapper
{
	
	//分页查询
	public List<FittingPublic> findexpenditurePage(FittingPublic row);
	// 查询表内规格型号
	public List<FittingPublic> findFitting(FittingPublic row);
	//新增
	public int add(FittingPublic row);
	//根据id查询图片
	public  List<FittingPublic> queryIdUrl(FittingPublic row);
	/*根据配件名称:查询表内数据(按条件查询)*/
	public  List<FittingPublic> conditionalQuery(FittingPublic row);
	//批量删除
	public int del(FittingPublic row);
	//更新数据
	public int update(FittingPublic row);
}
