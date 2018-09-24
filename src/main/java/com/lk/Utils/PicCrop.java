package com.lk.Utils;

import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

public class PicCrop
{
	private String srcpath; //原图路径
	 private String subpath; //目标存放路径
	 private String imageType; //图片类型
	 private int x;
	 private int y;
	 private int width; //图片目标宽度
	 private int height; //图片目标高度 
	 /*构造方法*/
	 public PicCrop()
		{
			super();
		}
	 public PicCrop(String srcpath, int x, int y, int width, int height) {
		  this.srcpath = srcpath;
		  this.x = x;
		  this.y = y;
		  this.width = width;
		  this.height = height;
		 }
	 
	 public String getSrcpath()
	{
		return srcpath;
	}
	public void setSrcpath(String srcpath)
	{
		this.srcpath = srcpath;
	}
	public String getSubpath()
	{
		return subpath;
	}
	public void setSubpath(String subpath)
	{
		this.subpath = subpath;
	}
	public String getImageType()
	{
		return imageType;
	}
	public void setImageType(String imageType)
	{
		this.imageType = imageType;
	}
	public int getX()
	{
		return x;
	}
	
	public void setX(int x)
	{
		this.x = x;
	}
	public int getY()
	{
		return y;
	}
	public void setY(int y)
	{
		this.y = y;
	}
	public int getWidth()
	{
		return width;
	}
	public void setWidth(int width)
	{
		this.width = width;
	}
	public int getHeight()
	{
		return height;
	}
	public void setHeight(int height)
	{
		this.height = height;
	}
	 public boolean cut() throws IOException {
		  FileInputStream is = null;
		  ImageInputStream iis = null;
		  boolean bol = false;
		  try {
			   is = new FileInputStream(srcpath);
			   Iterator<ImageReader> it = ImageIO.getImageReadersByFormatName(this.imageType);
			   ImageReader reader = it.next();
			   iis = ImageIO.createImageInputStream(is);
			   reader.setInput(iis, true);
			   ImageReadParam param = reader.getDefaultReadParam();
			   Rectangle rect = new Rectangle(x, y, width, height);
			   param.setSourceRegion(rect);
			   BufferedImage bi = reader.read(0, param);  
	           //实际高度大于目标高度或者实际宽度大于目标宽度则进行剪切
	           File o = new File(srcpath);
	           BufferedImage bii = ImageIO.read(o);
	           int itempWidth = bii.getWidth(); //实际宽度
	           int itempHeight = bii.getHeight(); //实际高度
	           if ((itempHeight > height) || (itempWidth > width)) { 
	    		   ImageIO.write(bi, this.imageType, new File(subpath));
	    		   bol = true; 
	           } 
		  } finally {
		   if (is != null)
		    is.close();
		   if (iis != null)
		    iis.close();
		  }
		  return bol;
	 } 
	 
}
