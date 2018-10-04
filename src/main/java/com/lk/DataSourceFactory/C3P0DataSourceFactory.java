package com.lk.DataSourceFactory;

import org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory;

import com.mchange.v2.c3p0.ComboPooledDataSource;
/*c3p0实现类*/
public class C3P0DataSourceFactory extends UnpooledDataSourceFactory
{
	public C3P0DataSourceFactory(){
        this.dataSource=new ComboPooledDataSource();
    }
}
