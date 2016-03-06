## Pixeler
一个用于设计像素图片（拼豆）的应用。用HTML5 canvas开发。  
A website to design pixel picture, based on HTML5 canvas.

## Function To-Do

- [ ] 自定义网格颜色
- [ ] 自定义网格是否显示
- [ ] LocalStorage保存图案历史
- [ ] 虚化画布线条
- [ ] 长按鼠标连续绘制
- [ ] 画布放大缩小
- [ ] 像素形状可选圆形、方块，并且重新绘制画布上的拼豆
- [ ] 选区功能（参照PS）
- [ ] 生成图片并保存分享
- [ ] 拼豆图纸案例展示
- [ ] 滚动条样式优化
- [ ] 界面优化（像素风格）
- [ ] 整体拼豆图案效果预览（先做点击可以预览，在做实时预览）
- [ ] 图纸库
- [ ] 保存5步内操作（用队列记录5步内格子位置和颜色）
- [ ] 上传图纸转换到canvas
- [ ] 移动端优化
- [ ] 用纸的截图替换色块
- [ ] hover更换布局时，显示实际盒子样式
- [ ] 定制网站改用花的形状
- [x] 拼豆计数
- [x] 画布坐标
- [x] 自定义画布大小
- [x] 高亮当前颜色和布局的选项
- [x] 更换布局的清空提示
- [x] 清空画布
- [x] 写使用帮助、提交建议、联系
- [x] 颜色选择改用取色器
- [x] 自定义页面背景色
- [x] 减小画布格子大小
- [x] 根据长宽格子数自动调整画布大小
- [x] 减少左侧栏的信息的展示

## Code To-Do
<<<<<<< HEAD
- [ ] 分离坐标、画布、拼豆
- [ ] 封装Canvas各种绘图方法
=======

- [ ] 切换拼豆形状时，把之前形状替换成现在的形状
- [ ] 分离坐标和画布
- [ ] Canvas方法的封装
>>>>>>> 6a795290614623292eab0b08dd1909c5943dcbd0
- [x] 合并清除拼豆的代码

## Change log

### 20151023
index.html：修复——更换背景色时，调整已删除的拼豆的位置的颜色与背景色一致。  
index.html: Fix- Set the same color of deleted pindou as background color.

### 20151018
index.html：根据长宽格子数自动调整画布大小。  
index.html: Adjust canvas size when change the grid count.

### 20151016
index.html：调整格子宽度和代码灵活性。  
index.html: Adjust grid width.

### 20151006
index.html：可以自定义背景色。  
index.html: Use color picker to change the background color.

### 20151005
index.html：使用取色器自定义拼豆颜色。  
index.html: Use color picker to change the color.

### 20151003
clj.htm：三栏布局。   
clj.htm：New layout.

### 20151001
clj.htm：添加所有颜色的拼豆，新增帮助和联系。  
clj.htm：Add all color.Add help and contact block.

### 20150927
clj.htm：改变行列数。  
clj.htm: Change the row and column.  

### 20150921
拼豆计数。  
Count the color.

### 20150916
能更换拼豆颜色。  
Change the color.

### 20150911
实现绘制、清除拼豆。  
Draw and clear pixels.