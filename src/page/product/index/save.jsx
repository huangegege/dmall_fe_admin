/*
* @Author: Rosen
* @Date:   2017-02-13 10:22:06
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-13 15:36:53
*/

'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import FileUploader from 'component/file-uploader/index.jsx';
import RichEditor   from 'component/rich-editor/index.jsx';

import MMUtile from 'util/mm.jsx';
import Product      from 'service/product.jsx';

import { productTypes } from 'config/config.jsx';

const _mm = new MMUtile();
const _product = new Product();

import './save.scss';

const ProductSave = React.createClass({
    getInitialState() {
        return {
            id                  : this.props.params.pId,
            firstCategoryList   : [],
            firstCategoryId     : '',
            secondCategoryList  : [],
            secondCategoryId    : '',
            thirdCategoryList  : [],
            thirdCategoryId    : '',
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
            discount            : '1',
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
                secondCategoryList: res
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
                thirdCategoryList: res
            });
        }, err => {
            alert(err.msg || '哪里不对了~');
        });
    },
    // 编辑的时候，需要初始化商品信息
    loadProduct(){
        // 有id参数时，读取商品信息
        if(this.state.id){
            // 查询一级品类时，不传id
            _product.getProduct(this.state.id).then(res => {
                let product = this.productAdapter(res)
                this.setState(product);
                // 有二级分类时，load二级列表
                if(product.firstCategoryId){
                    this.loadSecondCategory();
                }
                // 有三级分类时，load三级列表
                if(product.secondCategoryId){
                    this.loadThirdCategory();
                }
                this.initProductProperty();
                this.refs['rich-editor'].setValue(product.detail);
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
        console.log('type = ' + product.type);
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
            goodProduct         : product.goodProduct,
            newProduct          : product.newProduct,
            hotSale             : product.hotSale,
            discount            : product.discount,
            type                : product.type || ''
        }
    },
    // 普通字段更新
    onValueChange(e){
        console.log('onValueChange');
        console.log(e);
        let name    = e.target.name,
            value   = e.target.value;
        // 更改state
        this.setState({
            [name] : e.target.value
        });
    },
    // 富文本字段更新
    onRichValueChange(newValue){
        this.setState({
            detail: newValue
        });
    },
    // 一级品类变化
    onFirstCategoryChange(e){
        let newValue    = e.target.value || 0;
        // 更新一级选中值，并清除二级选中值
        this.setState({
            firstCategoryId     : newValue,
            secondCategoryId    : 0,
            secondCategoryList  : [],
            thirdCategoryId     : 0,
            thirdCategoryList   : []
        }, () => {
            // 更新二级品类列表
            this.loadSecondCategory();
        });
    },
    // 二级品类变化
    onSecondCategoryChange(e){
        let newValue    = e.target.value;
        // 更新二级选中值
        this.setState({
            secondCategoryId    : newValue,
            thirdCategoryId     : 0,
            thirdCategoryList   : []
        }, () => {
            // 更新三级品类列表
            this.loadThirdCategory();
        });
    },
    // 三级品类变化
    onThirdCategoryChange(e){
        let newValue    = e.target.value;
        // 更新三级选中值
        this.setState({
            thirdCategoryId    : newValue
        });
    },
    // 图片上传成功
    onUploadSuccess(res){
        let subImages = this.state.subImages;
        subImages.push(res.data.uri);
        this.setState({
            subImages: subImages
        });
    },
    // 图片上传失败
    onUploadError(err){
        alert(err.message || '哪里不对了~');
    },
    // 删除图片
    onDeleteImage(img){
        let subImages   = this.state.subImages,
            imageIndex  = subImages.indexOf(img);
        if(imageIndex >= 0){
            subImages.splice(imageIndex, 1);
        }
        this.setState({
            subImages: subImages
        });
    },
    // 验证要提交的产品信息是否符合规范
    checkProduct(product){
        let result = {
            status  : true,
            msg     : '验证通过'
        };
        if(!product.name){
            result = {
                status  : false,
                msg     : '请输入商品名称'
            }
        }
        if(!product.subtitle){
            result = {
                status  : false,
                msg     : '请输入商品描述'
            }
        }
        if(!product.price){
            result = {
                status  : false,
                msg     : '请输入商品价格'
            }
        }
        if(!product.subtitle){
            result = {
                status  : false,
                msg     : '请输入商品描述'
            }
        }
        return result;
    },
    // 提交表单
    onSubmit(e){
        // 阻止提交
        e.preventDefault();
        // 需要提交的字段
        let product = {
                categoryId          : this.state.thirdCategoryId || this.state.secondCategoryId || this.state.firstCategoryId || 0,
                name                : this.state.name,
                subtitle            : this.state.subtitle,
                subImages           : this.state.subImages.join(','),
                detail              : this.state.detail,
                price               : this.state.price,
                stock               : this.state.stock,
                status              : this.state.status || 1, // 状态为正常
                goodProduct         : this.state.goodProduct ? 1: 0,
                newProduct          : this.state.newProduct ? 1 : 0,
                hotSale             : this.state.hotSale ? 1 : 0,
                discount            : this.state.discount,
                type                : this.state.type
            },
            checkProduct = this.checkProduct(product);
        // 当为编辑时，添加id字段
        if(this.state.id){
            product.id = this.state.id;
        }
        // 验证通过后，提交商品信息
        if(checkProduct.status){
            // 保存product
            _product.saveProduct(product).then(res => {
                alert(res);
                window.location.href = '#/product/index';
            }, err => {
                alert(err.msg || '哪里不对了~');
            });
        }else{
            alert(checkProduct.msg);
        }
        return false;
    },
    onCheckBoxChange(e){
        let name    = e.target.name,
            checked   = e.target.checked;
        // 更改state
        this.setState({
            [name] : checked
        });
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle={'商品管理 -- ' + (this.state.id ? '修改商品' : '添加商品')}/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="name" className="col-md-2 control-label">商品名称</label>
                                <div className="col-md-5">
                                    <input type="text" 
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        placeholder="请输入商品名称"
                                        value={this.state.name}
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subtitle" className="col-md-2 control-label">商品描述</label>
                                <div className="col-md-5">
                                    <input type="text"
                                        className="form-control"
                                        name="subtitle"
                                        id="subtitle"
                                        placeholder="请输入商品描述"
                                        value={this.state.subtitle}
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="col-md-2 control-label">所属分类</label>
                                <div className="col-md-10">
                                    <select type="password" className="form-control cate-select col-md-5" value={this.state.firstCategoryId} onChange={this.onFirstCategoryChange}>
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
                                        <select type="password" className="form-control cate-select col-md-5" value={this.state.secondCategoryId} onChange={this.onSecondCategoryChange}>
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
                                        <select type="password" className="form-control cate-select col-md-5" value={this.state.thirdCategoryId} onChange={this.onThirdCategoryChange}>
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
                                    <select type="password" name="type" className="form-control cate-select col-md-5" value={this.state.type} onChange={this.onValueChange}>
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
                                        <input type="checkbox" name="goodProduct" onChange={this.onCheckBoxChange} /> 好物优选
                                    </label>
                                </div>
                                <div className="checkbox col-md-2">
                                    <label>
                                        <input type="checkbox" name="newProduct" onChange={this.onCheckBoxChange} /> 新品
                                    </label>
                                </div>
                                <div className="checkbox col-md-2">
                                    <label>
                                        <input type="checkbox" name="hotSale" onChange={this.onCheckBoxChange} /> 热销
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
                                            name="price"
                                            value={this.state.price}
                                            onChange={this.onValueChange}/>
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
                                            name="discount"
                                            value={this.state.discount}
                                            onChange={this.onValueChange}/>
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
                                            name="stock"
                                            placeholder="库存" 
                                            value={this.state.stock}
                                            onChange={this.onValueChange}/>
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
                                                    <i className="fa fa-close fa-fw" onClick={this.onDeleteImage.bind(this, image)}></i>
                                                </div>
                                            );
                                        }) : <div className="notice">请上传图片</div>
                                    }
                                </div>
                                <div className="col-md-offset-2 col-md-10">
                                    <FileUploader onSuccess={this.onUploadSuccess} onError={this.onUploadError}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputEmail3" className="col-md-2 control-label">商品详情</label>
                                <div className="col-md-10">
                                    <RichEditor ref="rich-editor" onValueChange={this.onRichValueChange} placeholder="商品详细信息"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-offset-2 col-md-10">
                                    <button type="btn" className="btn btn-xl btn-primary" onClick={this.onSubmit}>提交</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default ProductSave;