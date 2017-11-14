/*
* @Author: Rosen
* @Date:   2017-02-15 20:34:22
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-04 19:46:28
*/
'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';

import Product      from 'service/product.jsx'

const _product = new Product();

const ProductCategoryAdd = React.createClass({
    getInitialState() {
        return {
            pageName        : '所属品类',
            // parentId        : 0,  // 所属品类
            categoryName    : '', // 品类名称
            // categoryList    : [],  // 品类集合
            firstCategoryList   : [],
            firstCategoryId     : '',
            secondCategoryList  : [],
            secondCategoryId    : '',
        };
    },
    componentDidMount: function(){
        this.loadFirstCategory();
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
    // 一级品类变化
    onFirstCategoryChange(e){
        let newValue    = e.target.value || 0;
        // 更新一级选中值，并清除二级选中值
        this.setState({
            firstCategoryId     : newValue,
            secondCategoryId    : 0,
            secondCategoryList  : []
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
            secondCategoryId    : newValue
        });
    },
    onValueChange(e){
        let name   = e.target.name;
        this.setState({
            [name] : e.target.value
        });
    },
    onSubmit(e){
        e.preventDefault();
        if(!this.state.categoryName){
            alert('请输入品类名称');
            return;
        }
        // 请求接口
        _product.saveCategory({
            parentId      : this.state.secondCategoryId || this.state.firstCategoryId || 0,
            categoryName    : this.state.categoryName
        }).then(res => {
            alert('品类添加成功');
            window.location.href='#/product.category/index';
        }, errMsg => {
            alert(errMsg);
        });
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="品类管理 -- 添加品类"/>
                <div className="row">
                    <div className="form-wrap col-lg-12">
                        <form className="form-horizontal" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label className="col-md-2 control-label">{this.state.pageName}</label>
                                <div className="col-md-10">
                                    <select className="form-control cate-select" name="parentId" onChange={this.onFirstCategoryChange}>
                                        <option value="">请选择一级品类</option>
                                        {
                                            this.state.firstCategoryList.map(function(category, index) {
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
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="category-name" className="col-md-2 control-label">品类名称</label>
                                <div className="col-md-3">
                                    <input type="text" 
                                        className="form-control" 
                                        id="category-name" 
                                        name="categoryName"
                                        autoComplete="off"
                                        placeholder="请输入品类名称"
                                        onChange={this.onValueChange}/>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <div className="col-md-offset-2 col-md-10">
                                    <button type="submit" className="btn btn-xl btn-primary">提交</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

export default ProductCategoryAdd;