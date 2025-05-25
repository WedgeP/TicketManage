### 车票管理系统数据库设计

#### 1. 数据库设计
为了确保数据的独立性并符合第三范式（3NF），我们对车票管理系统数据库进行了模块化设计，拆解为以下几个主要的表，以避免冗余和依赖问题：

- **Users**：存储用户信息，区分管理员和普通用户。
- **Stations**：存储车站信息。
- **Trains**：存储列车信息。
- **Tickets**：存储票务信息。
- **Orders**：存储用户购买的订单信息。
- **Payments**：存储支付信息。

#### 2. 表结构设计

##### Users 表
存储用户信息，包括管理员和普通用户的区分：
```sql
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 用户唯一ID
    username TEXT NOT NULL UNIQUE,                -- 用户名
    password TEXT NOT NULL,                       -- 加密后的密码
    email TEXT NOT NULL,                          -- 用户邮箱
    role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',  -- 用户角色，admin或user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);
```

##### Stations 表
存储车站信息：
```sql
CREATE TABLE Stations (
    station_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 车站唯一ID
    name TEXT NOT NULL,                            -- 车站名称
    location TEXT,                                 -- 车站位置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);
```

##### Trains 表
存储列车信息：
```sql
CREATE TABLE Trains (
    train_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 列车唯一ID
    train_number TEXT NOT NULL UNIQUE,             -- 列车编号
    train_type TEXT,                               -- 列车类型
    from_station_id INTEGER,                      -- 出发车站ID
    to_station_id INTEGER,                        -- 到达车站ID
    departure_time TIMESTAMP,                      -- 出发时间
    arrival_time TIMESTAMP,                        -- 到达时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (from_station_id) REFERENCES Stations(station_id),
    FOREIGN KEY (to_station_id) REFERENCES Stations(station_id)
);
```

##### Tickets 表
存储车票信息：
```sql
CREATE TABLE Tickets (
    ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 车票唯一ID
    train_id INTEGER,                              -- 列车ID
    price DECIMAL(10, 2) NOT NULL,                 -- 票价
    available_seats INTEGER,                       -- 可用座位数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (train_id) REFERENCES Trains(train_id)
);
```

##### Orders 表
存储用户订单信息：
```sql
CREATE TABLE Orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 订单唯一ID
    user_id INTEGER,                               -- 用户ID
    ticket_id INTEGER,                             -- 车票ID
    quantity INTEGER NOT NULL,                     -- 购买数量
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 订单时间
    status TEXT CHECK(status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending', -- 订单状态
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
);
```

##### Payments 表
存储支付信息：
```sql
CREATE TABLE Payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 支付唯一ID
    order_id INTEGER,                               -- 订单ID
    amount DECIMAL(10, 2) NOT NULL,                 -- 支付金额
    payment_method TEXT CHECK(payment_method IN ('credit_card', 'paypal', 'bank_transfer')), -- 支付方式
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 支付时间
    status TEXT CHECK(status IN ('pending', 'completed', 'failed')) DEFAULT 'pending', -- 支付状态
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);
```

#### 3. 业务逻辑
- **用户注册和登录**：用户注册时，管理员设置 `role = 'admin'`，普通用户的 `role` 默认为 `'user'`。登录时验证用户名和密码，根据角色确定权限。
- **车票管理**：车票相关信息随时间变化，管理员可动态维护，普通用户仅能查询。
- **订单和支付**：用户购买车票生成订单，支付成功后记录支付信息。

#### 4. 第三范式（3NF）解释
- **第一范式（1NF）**：确保表中每个列的数据是原子的，不含重复或多重值字段。
- **第二范式（2NF）**：保证每个非主键列完全依赖主键。例如，在 `Orders` 表中，`user_id` 和 `ticket_id` 都完全依赖于 `order_id`。
- **第三范式（3NF）**：确保非主键字段不依赖于其他非主键字段。在上述设计中，`Users` 表的 `role` 仅依赖于 `user_id`，`Payments` 表中的支付状态和金额不直接依赖其他信息，符合3NF要求。

#### 5. 数据库关系示意
- **用户与订单**：一个用户可以有多个订单。
- **订单与车票**：一个订单包含一张车票，但一张车票可被多个订单购买。
- **车票与列车**：每张车票对应一列车，列车的票价和座位数固定。
- **支付与订单**：每个支付记录对应一个订单。

#### 6. 优化和扩展
- **查询性能优化**：可对常用查询字段建立索引，如 `username`、`train_number` 和 `departure_time`。
- **扩展功能**：可根据需求拓展，如增加票务类型、用户信息详细记录和历史订票信息等。

此设计方案已满足第三范式要求，具备良好的灵活性和可扩展性，可根据业务需求进一步细化表结构和字段类型。