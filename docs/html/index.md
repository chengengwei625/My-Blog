# html 教程

## 实现一个收缩侧边栏:

![](https://s3.bmp.ovh/imgs/2022/08/25/8df04cabd50a223a.gif)

```html
  <body>
    <div class="wrap">
      <div class="nav">
        <!--按钮-->
        <div class="btn">
          <div class="btn-item"></div>
          <div class="btn-item"></div>
          <div class="btn-item"></div>
        </div>
        <!--头像-->
        <div class="icon">
          <div class="icon-img"><img src="img/eric.jpg" alt="" /></div>
          <div class="icon-con">
            <p>Good Day</p>
            <h2>Mr. Chen</h2>
          </div>
        </div>
        <div class="line"></div>
        <div class="title">
          <p>Menu 6</p>
        </div>
        <div class="menu">
          <div class="item">
            <div class="light"></div>
            <div class="licon"><span class="iconfont icon-wenjian"></span></div>
            <div class="con">Dashboard</div>
            <div class="ricon"><span class="iconfont icon-shezhi"></span></div>
          </div>
          <div class="item">
            <div class="light"></div>
            <div class="licon"><span class="iconfont icon-qipao1"></span></div>
            <div class="con">Products</div>
            <div class="ricon"></div>
          </div>
          <div class="item">
            <div class="light"></div>
            <div class="licon">
              <span class="iconfont icon-shexiang1"></span>
            </div>
            <div class="con">Campaigns</div>
            <div class="ricon"></div>
          </div>
          <div class="item">
            <div class="light"></div>
            <div class="licon">
              <span class="iconfont icon-xiaolian"></span>
            </div>
            <div class="con">Sales</div>
            <div class="ricon"><span class="iconfont icon-caidan1"></span></div>
          </div>
          <div class="item">
            <div class="light"></div>
            <div class="licon">
              <span class="iconfont icon-shexiang"></span>
            </div>
            <div class="con">Discount</div>
            <div class="ricon"></div>
          </div>
          <div class="item">
            <div class="light"></div>
            <div class="licon">
              <span class="iconfont icon-wenjian1"></span>
            </div>
            <div class="con">Payouts</div>
            <div class="ricon"></div>
          </div>
        </div>
        <div class="line"></div>
        <div class="title">
          <p>Sever 6</p>
        </div>
        <div class="serve">
          <div class="item">
            <div class="licon"><span class="iconfont icon-caidan"></span></div>
            <div class="con">Software</div>
            <div class="ricon">
              <span class="iconfont icon-Dashboard"></span>
            </div>
          </div>
          <div class="item">
            <div class="licon"><span class="iconfont icon-renqun"></span></div>
            <div class="con">Chat</div>
            <div class="ricon"></div>
          </div>
          <div class="item">
            <div class="licon"><span class="iconfont icon-sousuo"></span></div>
            <div class="con">Intercom</div>
            <div class="ricon"><span class="iconfont icon-caidan1"></span></div>
          </div>
          <div class="item">
            <div class="licon">
              <span class="iconfont icon-gengduo-a"></span>
            </div>
            <div class="con">Setting</div>
            <div class="ricon"></div>
          </div>
        </div>
      </div>
    </div>
  </body>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.6);
}

.wrap {
    width: 100%;
    height: 100vh;
    background: url(img/bg.jpg) center no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav {
    width: 110px;
    /*    width: 280px;*/
    margin-right: 180px;
    height: 820px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 20px;
    overflow: hidden;
    transition: 0.5s;
}

.nav:hover {
    width: 280px;
}

.btn {
    width: 60px;
    height: 10px;
    display: flex;
    justify-content: space-around;
    margin-left: 25px;
    margin-top: 25px;
}

.btn-item {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.btn-item:nth-child(1) {
    background: #eb5a56;
}

.btn-item:nth-child(2) {
    background: #f8bc33;
}

.btn-item:nth-child(3) {
    background: #62cb44;
}

.icon {
    width: 250px;
    height: 60px;
    margin-left: 25px;
    margin-top: 20px;
    display: flex;
}

.icon-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.icon-img img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.icon-con {
    height: 60px;
    margin-left: 25px;
}

.icon-con p {
    padding-top: 5px;
}

.icon-con h2 {
    font-weight: 400;
}

.line {
    width: 60px;
    height: 1px;
    background: rgba(245, 253, 255, 0.5);
    margin: 20px 25px;
    transition: 0.5s;
}

.nav:hover .line {
    width: 230px;
}

.title {
    width: 60px;
    margin-left: 25px;
    margin-bottom: 20px;
}

.title p {
    font-size: 14px;
}

.menu {
    width: 230px;
    margin-left: 25px;
}

.item {
    display: flex;
    position: relative;
    transition: 0.5s;
    border-radius: 6px;
}

.item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.licon {
    width: 60px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.con {
    width: 0px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    overflow: hidden;
    position: relative;
    left: -20px;
    opacity: 0;
}

.nav:hover .con {
    width: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
}

.ricon {
    width: 0px;
    height: 50px;
    transition: 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    opacity: 0;
}

.nav:hover .ricon {
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
}

.iconfont {
    font-size: 26px;
}

.ricon .iconfont {
    font-size: 20px;
    color: #62cb44;
}

.light {
    width: 6px;
    height: 50px;
    background: #eb5a56;
    position: absolute;
    left: -25px;
    transition: 0.5s;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    opacity: 0;
}

.item:hover .light {
    opacity: 1;
}

.serve {
    width: 60px;
    /*    background: rgba(98, 203, 68, 0.5);*/
    background: rgba(0, 0, 0, 0.7);
    margin-left: 25px;
    border-radius: 10px;
    overflow: hidden;
    transition: 0.5s;
}

.nav:hover .serve {
    width: 230px;
}
```

## 实现一个边框按钮

![](https://s3.bmp.ovh/imgs/2022/08/25/47f1f65bb4dbd916.gif)

```html
    <style>
      body {
        background-color: #000;
      }
      .button {
        position: relative;
        color: #0984d9;
        width: 200px;
        height: 50px;
        font-size: 24px;
        text-align: center;
        line-height: 50px;
        background-color: #000;
        /* border: 4px solid #fff; */
        z-index: 1;
        border-radius: 10px;
        overflow: hidden;
      }
      .button::after {
        content: '';
        position: absolute;
        background-color: #000;
        width: 192px;
        height: 42px;
        left: 4px;
        top: 4px;
        border-radius: 10px;
        z-index: -1;
      }
      .button::before {
        content: '';
        position: absolute;
        background: #0984d9;
        width: 200%;
        height: 200%;
        z-index: -2;
        left: 50%;
        top: 50%;
        animation: rotate 3s infinite linear;
        transform-origin: 0 0;
      }
      @keyframes rotate {
        to {
          transform: rotate(1turn);
        }
      }
    </style>
  </head>
  <body>
    <div>
      <div class="button">边框按钮</div>
    </div>
  </body>
```

## 绘制小三角的几种办法:

![](https://s3.bmp.ovh/imgs/2022/08/25/9dc4dfa27e33d426.png)

```html
<body>
    <div class="box">
        <div class="triangle bottom"></div>
        <div class="triangle bottom"></div>
        <div class="triangle left"></div>
        <div class="triangle right"></div>
    </div>
</body>
```

```css
.box {
    padding: 15px;
    background-color: #f5f6f9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.triangle {
    display: inline-block;
    margin-right: 10px;
    /* Base Style */
    border: solid 10px transparent;
}


/*下*/

.triangle.bottom {
    border-top-color: #0097a7;
}


/*上*/

.triangle.top {
    border-bottom-color: #b2ebf2;
}


/*左*/

.triangle.left {
    border-right-color: #00bcd4;
}


/*右*/

.triangle.right {
    border-left-color: #009688;
}
```

## 绘制小箭头的几种方法:

![](https://s3.bmp.ovh/imgs/2022/08/25/188dfcc0362a3f07.png)

```html
<body>
    <div class="box">
        <div class="arrow bottom"></div>
        <div class="arrow top"></div>
        <div class="arrow left"></div>
        <div class="arrow right"></div>
    </div>
</body>
```

```css
.box {
    padding: 15px;
    background-color: #ffffff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.arrow {
    display: inline-block;
    margin-right: 10px;
    width: 0;
    height: 0;
    /* Base Style */
    border: 16px solid;
    border-color: transparent #cddc39 transparent transparent;
    position: relative;
}

.arrow::after {
    content: "";
    position: absolute;
    right: -20px;
    top: -16px;
    border: 16px solid;
    border-color: transparent #fff transparent transparent;
}


/*下*/

.arrow.bottom {
    transform: rotate(270deg);
}


/*上*/

.arrow.top {
    transform: rotate(90deg);
}


/*左*/

.arrow.left {
    transform: rotate(180deg);
}


/*右*/

.arrow.right {
    transform: rotate(0deg);
}
```

## 使用 flex 布局将一个元素智能地固定在底部:

![](https://s3.bmp.ovh/imgs/2022/08/25/d2aef31e9e438b59.gif)

```html
<body>
    <div class="container">
        <div class="main">I'm fatfish, 6 years of programming experience, like front-end, writing and making friends,looking forward to becoming good friends with you.</div>
        <div class="footer">rule</div>
    </div>
</body>
```

```css
* {
    margin: 0;
    padding: 0;
}

.container {
    height: 100vh;
    /* Key Style */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.main {
    /* Key Style */
    flex: 1;
    background-image: linear-gradient( 45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.footer {
    padding: 15px 0;
    text-align: center;
    color: #ff9a9e;
    font-size: 14px;
}
```

