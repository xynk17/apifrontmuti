<template>
  <div id="app">
    <section  class="main-content-wrapper wrapper" >
      <section id="main-content" >
        <div class="row">
          <div class="col-md-12">
            <!-- 查询 -->
            <ul class="btn-edit fl">
              <li class="input-serach">
                <el-input :placeholder="placeholder" v-model="keywords" style="width: 300px;">
                  <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                    <el-option label="店铺ID" value="store_id"></el-option>
                    <el-option label="商品ID" value="goods_id"></el-option>
                    <el-option label="バーコード" value="bar_code"></el-option>
                  </el-select>
                  <el-button type="danger" class="danger" slot="append" icon="search" @click="query"></el-button>
                </el-input>
              </li>
            </ul>
            <!-- 操作 -->
            <ul class="btn-edit fr">
              <li >
                <el-button type="primary" @click="dialogCreateVisible = true">新規</el-button>
                <el-button type="primary" icon="delete" :disabled="selected.length==0" @click="removeUsers()"  ></el-button>
              </li>
            </ul>
            <!-- 用户列表-->
            <el-table :data="options"
                      stripe
                      v-loading="loading"
                      element-loading-text="拼命加载中..."
                      style="width: 100%"
                      height="443"
                      @sort-change="tableSortChange"
                      @selection-change="tableSelectionChange">
              <el-table-column type="selection"
                               width="60">
              </el-table-column>
              <el-table-column sortable="custom" prop="id"
                               label="DBID"
                               width="100" hidden="true">
              </el-table-column>

              <el-table-column sortable="custom" prop="store_id"
                               label="店铺ID"
                               width="100">
              </el-table-column>
              <el-table-column sortable="custom" prop="store_name"
                               label="店铺名"
                               width="199">
              </el-table-column>
              <el-table-column prop="goods_id"
                               label="商品ID"
                               width="100">
              </el-table-column>
              <el-table-column prop="goods_name"
                               label="商品名"
                               width="299">
              </el-table-column>
              <el-table-column prop="size_lvl"
                               label="サイズ"
                               width="100">
              </el-table-column>
              <el-table-column prop="ice_hot"
                               label="ICE/HOT"
                               width="100">
              </el-table-column>
              <el-table-column prop="ice_lvl"
                               label="氷"
                               width="100">
              </el-table-column>
              <el-table-column prop="suger_lvl"
                               label="甘さ"
                               width="100">
              </el-table-column>
              <!--<el-table-column prop="create_time" sortable="custom" inline-template-->
              <!--label="注册日期">-->
              <!--<div>{{ row.create_time | moment('YYYY年MM月DD日 HH:mm:ss')}}</div>-->
              <!--</el-table-column>-->
              <el-table-column prop="bar_code"
                               label="バーコード"
                               width="199">
              </el-table-column>
              <el-table-column inline-template
                               label="操作"
                               width="250">
                            <span>
                                <el-button type="primary" size="mini" @click="removeUser(row)">删除</el-button>
                                <el-button type="primary" size="mini" @click="setCurrent(row)">编辑</el-button>
                            </span>
              </el-table-column>
            </el-table>
            <!--分页begin-->
            <el-pagination class="tc mg"
                           :current-page="filter.page"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="filter.per_page"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total_rows"
                           @size-change="pageSizeChange"
                           @current-change="pageCurrentChange">
            </el-pagination>
            <!--分页end-->
          </div>
        </div>
      </section>
    </section>

    <!-- 创建用户 begin-->
    <el-dialog title="创建用户" v-model="dialogCreateVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset" >
      <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">

        <el-form-item label="店舗ID" prop="store_id">
          <el-input v-model="create.store_id"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="goods_id">
          <el-input v-model="create.goods_id"></el-input>
        </el-form-item>
        <el-form-item label="サイズ" prop="size_lvl">
          <el-input v-model="create.size_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="ICE/HOT" prop="ice_hot">
          <el-input v-model="create.ice_hot" ></el-input>
        </el-form-item>
        <el-form-item label="氷" prop="ice_lvl">
          <el-input v-model="create.ice_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="甘さ" prop="suger_lvl">
          <el-input v-model="create.suger_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="バーコード" prop="bar_code">
          <el-input v-model="create.bar_code" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateVisible = false">取 消</el-button>
        <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改Option信息" v-model="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form id="#update" :model="update" :rules="updateRules" ref="update" label-width="100px">
        <el-form-item label="DBID" prop="store_id">
          <el-input v-model="update.id" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="店舗ID" prop="store_id">
          <el-input v-model="update.store_id" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="goods_id">
          <el-input v-model="update.goods_id" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="サイズ" prop="size_lvl">
          <el-input v-model="update.size_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="ICE/HOT" prop="ice_hot">
          <el-input v-model="update.ice_hot" ></el-input>
        </el-form-item>
        <el-form-item label="氷" prop="ice_lvl">
          <el-input v-model="update.ice_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="甘さ" prop="suger_lvl">
          <el-input v-model="update.suger_lvl" ></el-input>
        </el-form-item>
        <el-form-item label="バーコード" prop="bar_code">
          <el-input v-model="update.bar_code" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  var placeholders={"name":"请输入查找姓名","username":"请输入查找用户名","phone":"请输入查找电话"};
  function getuuid(){
    var uid = [];
    var hexDigits = "0123456789abcdefghijklmnopqrst";
    for (var i = 0; i < 32; i++) {
      uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    uid[6] = "4";
    uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1);
    var uuid = uid.join("");
    return uuid;
  }
  export default {
    name: 'app',
    data: function() {

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.create.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        getUrl: 'http://localhost:8888/phalapirrelease/Public/Orderapi/?service=GoodsBarcode.getGoodsBarcodes',
        createUrl: 'http://localhost:8888/phalapirrelease/Public/Orderapi/?service=GoodsBarcode.createGoodsBarcode',
        deleteUrl: 'http://localhost:8888/phalapirrelease/Public/Orderapi/?service=GoodsBarcode.deleteGoodsBarcode',
        updateUrl:'http://localhost:8888/phalapirrelease/Public/Orderapi/?service=GoodsBarcode.updateGoodsBarcode',
        options: [],
        create: {
          store_id: '',
          goods_id: '',
          size_lvl: '',
          ice_hot: '',
          ice_lvl: '',
          suger_lvl: '',
          bar_code: '',
          is_active: true
        },
        currentId:'',
        update:{
          id:'',
          store_id: '',
          goods_id: '',
          size_lvl: '',
          ice_hot: '',
          ice_lvl: '',
          suger_lvl: '',
          bar_code: '',
          is_active: true
        },
        rules: {
          //TODO FRONT CHECK
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符'}
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 25, message: '长度在 3 到 25 个字符'},
            { pattern:/^[A-Za-z0-9]+$/, message: '用户名只能为字母和数字'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 25, message: '长度在 6 到 25 个字符'}
          ],
          checkpass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validatePass}
          ],
          email: [
            { type: 'email', message: '邮箱格式不正确'}
          ],
          phone:[
            { pattern:/^1[34578]\d{9}$/, message: '请输入中国国内的手机号码'}
          ]
        },
        updateRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符'}
          ],
          email: [
            { type: 'email', message: '邮箱格式不正确'}
          ],
          phone:[
            { pattern:/^1[34578]\d{9}$/, message: '请输入中国国内的手机号码'}
          ]
        },
        filter: {
          per_page: 10, // 页大小
          page: 1, // 当前页
          store_id:'',
          goods_id:'',
          bar_code:'',
          sorts:''
        },
        total_rows: 0,
        keywords: '', //搜索框的关键字内容
        select: '選択', //搜索框的搜索字段
        loading: true,
        selected: [], //已选择项
        dialogCreateVisible: false, //创建对话框的显示状态
        dialogUpdateVisible: false, //编辑对话框的显示状态
        createLoading: false,
        updateLoading: false,
        placeholder:placeholders["username"]
      };
    },
    mounted: function() {
      this.getUsers();
    },
    methods: {
      tableSelectionChange(val) {
        this.selected = val;
      },
      tableSortChange(val) {
        console.log(`排序属性: ${val.prop}`);
        console.log(`排序: ${val.order}`);
        if(val.prop!=null){
          if(val.order=='descending'){
            this.filter.sorts = '-'+val.prop;
          }
          else{
            this.filter.sorts = ''+val.prop;
          }
        }
        else{
          this.filter.sorts = '';
        }
        this.getUsers();
      },
      searchFieldChange(val) {
        this.placeholder=placeholders[val];
        console.log(`搜索字段： ${val} `);
      },
      pageSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.filter.per_page = val;
        this.getUsers();
      },
      pageCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.filter.page = val;
        this.getUsers();
      },
      setCurrent(option){
        this.currentId=option.id;
        this.update.id=option.id;
        this.update.store_id=option.store_id;
        this.update.goods_id=option.goods_id;
        this.update.size_lvl=option.size_lvl;
        this.update.ice_hot=option.ice_hot;
        this.update.ice_lvl=option.ice_lvl;
        this.update.suger_lvl=option.suger_lvl;
        this.update.store_id=option.store_id;
        this.update.store_id=option.store_id;
        this.update.bar_code=option.bar_code;
        this.update.is_active=option.is_active;
        this.dialogUpdateVisible=true;

      },
      // 重置表单
      reset() {
        this.$refs.create.resetFields();
      },
      query(){

        this.filter.store_id='';
        this.filter.bar_code='';
        this.filter[this.select]=this.keywords;
        this.getUsers();
      },
      // 获取用户列表
      getUsers() {
        this.loading = true;

        var resource = this.$resource(this.getUrl);
        resource.query(this.filter)
          .then((response) => {
            this.options = response.data.data;
            this.total_rows = response.data.total_rows;
            this.loading = false;
            this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
            this.$message.error('错了哦，这是一条错误消息');
            this.loading = false;
          });

      },

      // 创建用户
      createUser(){
        // 主动校验
        this.$refs.create.validate((valid) => {
          if (valid) {
            //this.create.id=getuuid();
            this.createLoading=true;
            var resource = this.$resource(this.createUrl);
            resource.query(this.create)
              .then((response) => {
                this.$message.success('创建商品barcode成功！');
                this.dialogCreateVisible=false;
                this.createLoading=false;
                this.reset();
                this.getUsers();
              })
              .catch((response) => {
                var data=response.data;
                if(data instanceof Array){
                  this.$message.error(data[0]["message"]);
                }
                else if(data instanceof Object){
                  this.$message.error(data["message"]);
                }
                this.createLoading=false;
              });
          }
          else {
            return false;
          }
        });
      },
      // 更新用户资料
      updateUser() {

        this.$refs.update.validate((valid) => {
          if (valid) {
            this.updateLoading=true;
            var resource = this.$resource(this.updateUrl);
            resource.query(this.update)
              .then((response) => {

                this.$message.success('修改Option资料成功！');
                this.dialogUpdateVisible=false;
                this.updateLoading=false;
                this.getUsers();
              })
              .catch((response) => {

                var data=response.data;
                console.log(data);
                if(data instanceof Array){
                  this.$message.error(data[0]["message"]);
                }
                else if(data instanceof Object){
                  this.$message.error(data["message"]);
                }
                this.updateLoading=false;
              });
          }
          else {
            return false;
          }
        });
      },

      // // 更新用户资料
      // updateUser() {
      //     this.$refs.update.validate((valid) => {
      //         if (valid) {
      //             this.updateLoading=true;
      //             var actions = {
      //                 update: {method: 'patch'}
      //             }
      //             var resource = this.$resource(this.url,{},actions);
      //             resource.update({"ids":this.currentId},this.update)
      //                 .then((response) => {
      //                 this.$message.success('修改用户资料成功！');
      //                 this.dialogUpdateVisible=false;
      //                 this.updateLoading=false;
      //                 this.getUsers();
      //         })
      //         .catch((response) => {
      //             var data=response.data;
      //             console.log(data);
      //             if(data instanceof Array){
      //                 this.$message.error(data[0]["message"]);
      //             }
      //             else if(data instanceof Object){
      //                 this.$message.error(data["message"]);
      //             }
      //             this.updateLoading=false;
      //         });
      //         }
      //         else {
      //             return false;
      //         }
      //     });
      // },

      // 删除单个用户
      removeUser(option) {
        this.$confirm('此操作将永久删除商品条形码 ' + option.option_name + ', 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            // 向请求服务端删除
            var resource = this.$resource(this.deleteUrl);
            resource.query({ id: option.id })
              .then((response) => {
                this.$message.success('成功删除了商品条形码' + option.option_name + '!');
                this.getUsers();
              })
              .catch((response) => {
                this.$message.error('删除失败!');
              });
          })
          .catch(() => {
            this.$message.info('已取消操作!');
          });
      },
      //删除多个用户
      removeUsers() {
        this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个商品条形码, 是否继续?', '提示', { type: 'warning' })
          .then(() => {
            console.log(this.selected);
            var ids = [];
            //提取选中项的id
            $.each(this.selected,(i, option)=> {
              ids.push(option.id);
            });
            // 向请求服务端删除
            var resource = this.$resource(this.deleteUrl);
            resource.query({id: ids.join(",") })
              .then((response) => {
                this.$message.success('删除了' + this.selected.length + '个商品条形码!');
                this.getUsers();
              })
              .catch((response) => {
                this.$message.error('删除失败!');
              });
          })
          .catch(() => {
            this.$Message('已取消操作!');
          });
      }
    }
  }
</script>
<style>
  @import '../../assets/plugins/bootstrap/css/bootstrap.min.css';
  @import '../../assets/css/global.css';
  @import '../../assets/css/main.min.css';
</style>
