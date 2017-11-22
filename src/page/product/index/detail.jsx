/*
* @Author: Rosen
* @Date:   2017-02-28 14:53:59
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-13 15:33:03
*/


'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Product      from 'service/product.jsx';

import { productTypes } from 'config/config.jsx'

const _mm = new MMUtile();
const _product = new Product();


const ProductDetail = React.createClass({
    getInitialState() {
        return {
            id                  : this.props.params.pId,
            firstCategoryList   : [],
            firstCategoryId     : '',
            secondCategoryList  : [],
            secondCategoryId    : '',
            thirdCategoryList   : [],
            thirdCategoryId     : '',
            name                : '',
            subtitle            : '',
            subImages           : [],
            price               : '',
            stock               : '',
            detail              : '',
            status              : '',
            goodProduct         : true,
            newProduct          : false,
            hotSale             : false,
            discount            : '',
            type                : ''
        };
    },
    componentDidMount: function(){
        // 初始化一级分类
        this.loadFirstCategory();
        // 初始化产品
        this.loadProduct();
    },
    // 加载一级分类
    loadFirstCategory(){
        // 查询一级品类时，不传id
        _product.getCategory().then(res => {
            this.setState({
                firstCategoryList: res
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 加载二级分类
    loadSecondCategory(){
        // 一级品类不存在时，不初始化二级分类
        if(!this.state.firstCategoryId){
            return;
        }
        // 查询一级品类时，不传id
        _product.getCategory(this.state.firstCategoryId).then(res => {
            this.setState({
                secondCategoryList  : res,
                secondCategoryId    : this.state.secondCategoryId
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 加载三级分类
    loadThirdCategory(){
        // 二级品类不存在时，不初始化三级分类
        if(!this.state.secondCategoryId){
            return;
        }
        _product.getCategory(this.state.secondCategoryId).then(res => {
            this.setState({
                thirdCategoryList   : res,
                thirdCategoryId     : this.state.thirdCategoryId
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 编辑的时候，需要初始化商品信息
    loadProduct(){
        // 有id参数时，读取商品信息
        if(this.state.id){
            _product.getProduct(this.state.id).then(res => {
                let product = this.productAdapter(res)
                this.setState(product);
                // 有二级分类时，load二级列表
                if(product.firstCategoryId){
                    this.loadSecondCategory();
                }
                // 有三级分类时，load三级列表
                if (product.secondCategoryId) {
                    this.loadThirdCategory();
                }
                this.initProductProperty();
            }, err => {
                alert(err.msg || '哪里不对了~');
            });
        }
    },
    // 初始化商品特征
    initProductProperty(){
        let goodProductEl = document.getElementsByName('goodProduct');
        if (goodProductEl.length > 0) {
            goodProductEl[0].checked = this.state.goodProduct;
        }
        let newProductEl = document.getElementsByName('newProduct');
        if (newProductEl.length > 0) {
            newProductEl[0].checked = this.state.newProduct;
        }
        let hotSaleEl = document.getElementsByName('hotSale');
        if (hotSaleEl.length > 0) {
            hotSaleEl[0].checked = this.state.hotSale;
        }
    },
    // 适配接口返回的数据
    productAdapter(product){
        let firstCategoryId = '',
            secondCategoryId = '',
            thirdCategoryId = '';
        if (product.grandParentCategoryId === 0 && product.parentCategoryId === 0) {
            firstCategoryId = product.categoryId;
        } else if (product.grandParentCategoryId === 0 && product.parentCategoryId !== 0) {
            firstCategoryId = product.parentCategoryId;
            secondCategoryId = product.categoryId;
        } else if (product.grandParentCategoryId !== 0 && product.parentCategoryId !== 0) {
            firstCategoryId = product.grandParentCategoryId;
            secondCategoryId = product.parentCategoryId;
            thirdCategoryId = product.categoryId;
        } else {
            alert('哪里不对了~');
        }
        return {
            categoryId          : product.categoryId,
            name                : product.name,
            subtitle            : product.subtitle,
            subImages           : product.subImages.split(','),
            detail              : product.detail,
            price               : product.price,
            stock               : product.stock,
            firstCategoryId     : firstCategoryId,
            secondCategoryId    : secondCategoryId,
            thirdCategoryId     : thirdCategoryId,
            status              : product.status,
            goodProduct         : product.goodProduct === 1 ? true : false,
            newProduct          : product.newProduct === 1 ? true : false,
            hotSale             : product.hotSale === 1 ? true : false,
            discount            : product.discount,
            type                : product.type
        }
    },
    onSwitchChange(checked){
        console.log(`switch to ${checked}`);
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="商品详情"/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-2 control-label">商品名称</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.name}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">商品描述</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.subtitle}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">当前状态</label>
                                <div className="col-md-5">
                                    <p type="text" className="form-control-static">{this.state.status == 1 ? '在售' : '已下架'}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="col-md-2 control-label">所属分类</label>
                                <div className="col-md-10">
                                    <select type="password" className="form-control cate-select col-md-5" value={this.state.firstCategoryId} readOnly>
                                        <option value="">请选择一级品类</option>
                                        {
                                            this.state.firstCategoryList.map((category, index) => {
                                                return (
                                                    <option value={category.id} key={index}>{category.name}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    {this.state.secondCategoryList.length ?  
                                        <select type="password" className="form-control cate-select col-md-5" value={this.state.secondCategoryId} readOnly>
                                            <option value="">请选择二级品类</option>
                                            {
                                                this.state.secondCategoryList.map((category, index) => {
                                                    return (
                                                        <option value={category.id} key={index}>{category.name}</option>
                                                    );
                                                })
                                            }
                                        </select> : null
                                    }
                                    {this.state.thirdCategoryList.length ?  
                                        <select type="password" className="form-control cate-select col-md-5" value={this.state.thirdCategoryId} readOnly>
                                            <option value="">请选择三级品类</option>
                                            {
                                                this.state.thirdCategoryList.map((category, index) => {
                                                    return (
                                                        <option value={category.id} key={index}>{category.name}</option>
                                                    );
                                                })
                                            }
                                        </select> : null
                                    }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="col-md-2 control-label">商品类型</label>
                                <div className="col-md-10">
                                    <select type="password" className="form-control cate-select col-md-5" value={this.state.type} readOnly>
                                        <option value="">请选择商品类型</option>
                                        {
                                            productTypes.map((type, index) => {
                                                return (
                                                    <option value={type.value} key={index}>{type.name}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="col-md-2 control-label">商品特征</label>
                                <div className="checkbox col-md-2">
                                    <label>
                                        <input type="checkbox" name="goodProduct" disabled/> 好物优选
                                    </label>
                                </div>
                                <div className="checkbox col-md-2">
                                    <label>
                                        <input type="checkbox" name="newProduct" disabled/> 新品
                                    </label>
                                </div>
                                <div className="checkbox col-md-2">
                                    <label>
                                        <input type="checkbox" name="hotSale" disabled/> 热销
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price" className="col-md-2 control-label">商品价格</label>
                                <div className="col-md-3">
                                    <div className="input-group">
                                        <input type="number" 
                                            className="form-control" 
                                            id="price" 
                                            placeholder="价格"
                                            value={this.state.price}
                                            readOnly/>
                                        <div className="input-group-addon">元</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="discount" className="col-md-2 control-label">商品折扣</label>
                                <div className="col-md-3">
                                    <div className="input">
                                        <input type="number"
                                            className="form-control" 
                                            id="discount" 
                                            placeholder="折扣"
                                            value={this.state.discount}
                                            readOnly/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock" className="col-md-2 control-label">商品库存</label>
                                <div className="col-md-3">
                                    <div className="input-group">
                                        <input type="number" 
                                            className="form-control" 
                                            id="stock"
                                            placeholder="库存" 
                                            value={this.state.stock}
                                            readOnly/>
                                        <div className="input-group-addon">件</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">商品图片</label>
                                <div className="img-con col-md-10">
                                    {
                                        this.state.subImages.length ? this.state.subImages.map((image, index) => {
                                            return (
                                                <div className="sub-img" key={index}>
                                                    <img className="img" src={_mm.getImageUrl(image)}/>
                                                </div>
                                            );
                                        }) : <div className="notice">没有图片</div>
                                    }
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">商品详情</label>
                                <div className="col-md-10" dangerouslySetInnerHTML={{__html: this.state.detail}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default ProductDetail;