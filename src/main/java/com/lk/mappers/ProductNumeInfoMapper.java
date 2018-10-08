package com.lk.mappers;


import java.util.List;

import com.lk.db.ProductListInfo;

public interface ProductNumeInfoMapper
{
	//查询表内 [productName] 字段
	public List<ProductListInfo> customQuery();
}
